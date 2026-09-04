const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Department = require('../models/Department');
const LeaveRequest = require('../models/LeaveRequest');
const Announcement = require('../models/Announcement');
const Holiday = require('../models/Holiday');
const { protect, authorize } = require('../middleware/auth');
const sendEmail = require('../utils/email');
const Notification = require('../models/Notification');

const getMonthDateStrings = () => {
  const dates = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const daysInMonth = today.getDate(); // Up to today

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const yStr = d.getFullYear();
    const mStr = String(d.getMonth() + 1).padStart(2, '0');
    const dStr = String(d.getDate()).padStart(2, '0');
    dates.push(`${yStr}-${mStr}-${dStr}`);
  }
  return dates;
};

const calculateCurrentMonthAttendance = async (employeeId, holidayDates, leaveRequests, monthDates, logsByDate = null) => {
  let logs = logsByDate;
  if (!logs) {
    const empLogs = await Attendance.find({
      employee: employeeId,
      date: { $in: monthDates }
    }).lean();
    logs = {};
    empLogs.forEach(log => {
      logs[log.date] = log;
    });
  }

  let presentDays = 0;
  let absentDays = 0;
  let leaveDays = 0;

  const isOnLeave = (dateStr) => {
    const d = new Date(dateStr);
    return leaveRequests.some(leave => {
      return leave.employee.toString() === employeeId.toString() &&
        new Date(leave.startDate) <= d &&
        new Date(leave.endDate) >= d;
    });
  };

  monthDates.forEach(dateStr => {
    const log = logs[dateStr];
    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay();

    if (log) {
      if (log.status === 'Present') {
        presentDays++;
      } else if (log.status === 'Late') {
        presentDays++;
      } else if (log.status === 'Half Day') {
        presentDays += 0.5;
      } else {
        absentDays++;
      }
    } else {
      const isWeekend = (dayOfWeek === 0); // 0 = Sunday (Only Sunday is weekend, Saturday is a working day)
      const isHoliday = holidayDates.has(dateStr);

      if (isWeekend || isHoliday) {
        return;
      }

      if (isOnLeave(dateStr)) {
        leaveDays++;
      } else {
        absentDays++;
      }
    }
  });

  const totalWorkingDays = presentDays + absentDays;
  const attendancePercentage = totalWorkingDays > 0
    ? Math.round((presentDays / totalWorkingDays) * 100)
    : 100;

  return {
    presentDays,
    absentDays,
    leaveDays,
    attendancePercentage,
    totalWorkingDays
  };
};

const getCurrentWeekDateStrings = () => {
  const dates = [];
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));

  for (let i = 0; i < 6; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateVal = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${dateVal}`);
  }
  return dates;
};

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

router.get('/admin', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  try {
    const today = getTodayDateString();
    const weekDates = getCurrentWeekDateStrings();
    const monthDates = getMonthDateStrings();
    const startRange = new Date(monthDates[0]);
    const endRange = new Date(monthDates[monthDates.length - 1]);

    const dToday = new Date();
    dToday.setHours(0, 0, 0, 0);

    // Run bulk queries concurrently in parallel
    const [
      totalEmployees,
      totalDepartments,
      todayLogs,
      leavesTodayCount,
      recentLogs,
      allWeekLogs,
      departments,
      holidays,
      activeStaff,
      leaveRequests
    ] = await Promise.all([
      User.countDocuments({ role: { $in: ['Employee', 'Manager'] }, status: 'Active' }),
      Department.countDocuments(),
      Attendance.find({ date: today }).populate('employee', 'fullName employeeId department').lean(),
      LeaveRequest.countDocuments({
        status: 'Approved',
        startDate: { $lte: dToday },
        endDate: { $gte: dToday }
      }),
      Attendance.find()
        .populate({
          path: 'employee',
          select: 'fullName employeeId profilePhoto department designation',
          populate: { path: 'department', select: 'name code' }
        })
        .sort({ updatedAt: -1 })
        .limit(8)
        .lean(),
      Attendance.find({ date: { $in: weekDates } }).lean(),
      Department.find().lean(),
      Holiday.find({ date: { $in: monthDates } }).lean(),
      User.find({
        role: { $in: ['Employee', 'Manager'] },
        status: 'Active'
      }).select('fullName employeeId email department').lean(),
      LeaveRequest.find({
        status: 'Approved',
        startDate: { $lte: endRange },
        endDate: { $gte: startRange }
      }).lean()
    ]);

    const presentTodayCount = todayLogs.filter(log => log.status === 'Present' || log.status === 'Late').length;
    const lateTodayCount = todayLogs.filter(log => log.status === 'Late').length;
    const absentTodayCount = Math.max(0, totalEmployees - presentTodayCount - leavesTodayCount);

    // Group week logs by date
    const logsByDateMap = {};
    weekDates.forEach(dStr => {
      logsByDateMap[dStr] = [];
    });
    allWeekLogs.forEach(log => {
      if (logsByDateMap[log.date]) {
        logsByDateMap[log.date].push(log);
      }
    });

    const weeklyChartData = [];
    for (const dStr of weekDates) {
      const dayLogs = logsByDateMap[dStr] || [];
      const presentCount = dayLogs.filter(log => log.status === 'Present' || log.status === 'Late').length;
      const lateCount = dayLogs.filter(log => log.status === 'Late').length;
      const dayName = new Date(dStr).toLocaleDateString('en-US', { weekday: 'short' });

      weeklyChartData.push({
        day: dayName,
        date: dStr,
        Present: presentCount,
        Late: lateCount,
        Absent: Math.max(0, totalEmployees - presentCount)
      });
    }

    const departmentChartData = departments.map(dept => {
      const employeeCount = activeStaff.filter(emp => emp.department && emp.department.toString() === dept._id.toString()).length;
      const presentCount = todayLogs.filter(log => log.employee && log.employee.department && log.employee.department.toString() === dept._id.toString()).length;

      return {
        department: dept.code,
        name: dept.name,
        Total: employeeCount,
        Present: presentCount
      };
    });

    // Calculate short attendance for the current month in batch
    const holidayDates = new Set(holidays.map(h => h.date));
    const activeStaffIds = activeStaff.map(emp => emp._id);
    const allMonthLogs = await Attendance.find({
      employee: { $in: activeStaffIds },
      date: { $in: monthDates }
    }).lean();

    const logsByEmployee = {};
    activeStaffIds.forEach(id => {
      logsByEmployee[id.toString()] = {};
    });
    allMonthLogs.forEach(log => {
      if (log.employee) {
        logsByEmployee[log.employee.toString()][log.date] = log;
      }
    });

    const shortAttendanceEmployees = [];
    for (const emp of activeStaff) {
      const employeeLogsMap = logsByEmployee[emp._id.toString()] || {};
      const details = await calculateCurrentMonthAttendance(emp._id, holidayDates, leaveRequests, monthDates, employeeLogsMap);
      if (details.attendancePercentage < 75) {
        shortAttendanceEmployees.push({
          employee: {
            id: emp._id,
            fullName: emp.fullName,
            employeeId: emp.employeeId,
            email: emp.email
          },
          attendancePercentage: details.attendancePercentage
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalEmployees,
          totalDepartments,
          presentToday: presentTodayCount,
          lateToday: lateTodayCount,
          leavesToday: leavesTodayCount,
          absentToday: absentTodayCount
        },
        recentLogs,
        weeklyTrend: weeklyChartData,
        departmentBreakdown: departmentChartData,
        shortAttendanceEmployees
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/employee', protect, async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const today = getTodayDateString();

    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);

    const weekDates = getCurrentWeekDateStrings();
    const monthDates = getMonthDateStrings();
    const startRange = new Date(monthDates[0]);
    const endRange = new Date(monthDates[monthDates.length - 1]);

    // Execute all database queries concurrently in parallel with .lean() for blazing speed!
    const [
      monthLogs,
      approvedLeavesCount,
      weekLogs,
      announcements,
      holidays,
      leaveRequests,
      employeeMonthLogs,
      todayLog
    ] = await Promise.all([
      Attendance.find({
        employee: userId,
        checkIn: { $ne: null },
        createdAt: { $gte: monthAgo }
      }).select('status date checkIn checkOut workHours').lean(),
      LeaveRequest.countDocuments({
        employee: userId,
        status: 'Approved',
        startDate: { $gte: monthAgo }
      }),
      Attendance.find({
        employee: userId,
        date: { $in: weekDates }
      }).select('date checkIn checkOut status workHours').lean(),
      Announcement.find()
        .populate('author', 'fullName designation')
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      Holiday.find({
        date: { $in: monthDates }
      }).lean(),
      LeaveRequest.find({
        employee: userId,
        status: 'Approved',
        startDate: { $lte: endRange },
        endDate: { $gte: startRange }
      }).lean(),
      Attendance.find({
        employee: userId,
        date: { $in: monthDates }
      }).lean(),
      Attendance.findOne({
        employee: userId,
        date: today
      }).lean()
    ]);

    const presentCount = monthLogs.filter(log => log.status === 'Present' || log.status === 'Late').length;
    const lateCount = monthLogs.filter(log => log.status === 'Late').length;

    const weekLogsByDate = {};
    weekLogs.forEach(log => {
      weekLogsByDate[log.date] = log;
    });

    const now = new Date();
    const weeklyLogs = [];
    for (const dStr of weekDates) {
      const log = weekLogsByDate[dStr];
      const dayName = new Date(dStr).toLocaleDateString('en-US', { weekday: 'short' });
      const isPastOrToday = new Date(dStr) <= now;

      weeklyLogs.push({
        day: dayName,
        date: dStr,
        checkIn: log?.checkIn?.time ? log.checkIn.time : null,
        checkOut: log?.checkOut?.time ? log.checkOut.time : null,
        status: log?.status || (isPastOrToday ? 'Absent' : 'Pending'),
        workHours: log?.workHours || 0
      });
    }

    const holidayDates = new Set(holidays.map(h => h.date));
    const monthLogsByDate = {};
    employeeMonthLogs.forEach(log => {
      monthLogsByDate[log.date] = log;
    });

    const details = await calculateCurrentMonthAttendance(userId, holidayDates, leaveRequests, monthDates, monthLogsByDate);
    const shortAttendanceAlert = details.attendancePercentage < 75;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          presentDays: presentCount,
          lateDays: lateCount,
          leaveDays: approvedLeavesCount
        },
        weeklyGrid: weeklyLogs,
        announcements,
        todayLog,
        shortAttendanceAlert,
        attendancePercentage: details.attendancePercentage
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/attendance-report
// @desc    Generate a custom date range report for all active employees
// @access  Private (Admin, Manager)
router.get('/attendance-report', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both startDate and endDate (YYYY-MM-DD)'
    });
  }

  try {
    // 1. Get all active employees (Employee or Manager)
    const employees = await User.find({
      role: { $in: ['Employee', 'Manager'] },
      status: 'Active'
    }).populate('department', 'name code');

    // 2. Fetch all holidays
    const holidays = await Holiday.find({
      date: { $gte: startDate, $lte: endDate }
    });
    const holidayDates = new Set(holidays.map(h => h.date));

    // 3. Fetch all attendance logs in this range
    const attendanceLogs = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    });

    // 4. Fetch all approved leave requests that might overlap this range
    const startRange = new Date(startDate);
    const endRange = new Date(endDate);

    const leaveRequests = await LeaveRequest.find({
      status: 'Approved',
      startDate: { $lte: endRange },
      endDate: { $gte: startRange }
    });

    const isOnLeave = (employeeId, dateStr) => {
      const d = new Date(dateStr);
      return leaveRequests.some(leave => {
        return leave.employee.toString() === employeeId.toString() &&
          new Date(leave.startDate) <= d &&
          new Date(leave.endDate) >= d;
      });
    };

    // Calculate dates in range
    const datesInRange = [];
    let current = new Date(startDate);
    while (current <= endRange) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      datesInRange.push(`${y}-${m}-${d}`);
      current.setDate(current.getDate() + 1);
    }

    const report = employees.map(emp => {
      let presentDays = 0;
      let absentDays = 0;
      let lateDays = 0;
      let halfDays = 0;
      let leaveDays = 0;
      let totalWorkHours = 0;

      const empLogs = attendanceLogs.filter(log => log.employee.toString() === emp._id.toString());
      const logsByDate = {};
      empLogs.forEach(log => {
        logsByDate[log.date] = log;
      });

      // Sort logs by date ascending
      const sortedLogs = [...empLogs].sort((a, b) => a.date.localeCompare(b.date));
      const punchDetails = [];

      sortedLogs.forEach(log => {
        if (log.workHours) {
          totalWorkHours += log.workHours;
        }
        if (log.checkIn && log.checkIn.time) {
          const inTime = new Date(log.checkIn.time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          const outTime = log.checkOut && log.checkOut.time
            ? new Date(log.checkOut.time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })
            : 'Pending Check-Out';
          punchDetails.push(`${log.date}: In ${inTime} - Out ${outTime}`);
        }
      });

      let punchInTime = 'Not Punched In';
      let punchOutTime = 'Not Punched Out';

      if (startDate === endDate) {
        const dayLog = logsByDate[startDate];
        if (dayLog && dayLog.checkIn && dayLog.checkIn.time) {
          punchInTime = new Date(dayLog.checkIn.time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
        } else if (dayLog && dayLog.status) {
          punchInTime = dayLog.status;
        } else {
          punchInTime = 'Not Punched In';
        }

        if (dayLog && dayLog.checkOut && dayLog.checkOut.time) {
          punchOutTime = new Date(dayLog.checkOut.time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
        } else if (dayLog && dayLog.checkIn && dayLog.checkIn.time) {
          punchOutTime = 'Pending Check-Out';
        } else {
          punchOutTime = 'Not Punched Out';
        }
      } else {
        const lastLogWithPunchIn = [...sortedLogs].reverse().find(l => l.checkIn && l.checkIn.time);
        if (lastLogWithPunchIn) {
          const inTime = new Date(lastLogWithPunchIn.checkIn.time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          punchInTime = `${lastLogWithPunchIn.date} ${inTime}`;

          if (lastLogWithPunchIn.checkOut && lastLogWithPunchIn.checkOut.time) {
            const outTime = new Date(lastLogWithPunchIn.checkOut.time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            });
            punchOutTime = `${lastLogWithPunchIn.date} ${outTime}`;
          } else {
            punchOutTime = 'Pending Check-Out';
          }
        }
      }

      datesInRange.forEach(dateStr => {
        const log = logsByDate[dateStr];
        const dateObj = new Date(dateStr);
        const dayOfWeek = dateObj.getDay(); // 0 = Sunday

        if (log) {
          if (log.status === 'Present') {
            presentDays++;
          } else if (log.status === 'Late') {
            lateDays++;
            presentDays++;
          } else if (log.status === 'Half Day') {
            halfDays++;
            presentDays += 0.5;
          } else {
            absentDays++;
          }
        } else {
          const isWeekend = (dayOfWeek === 0);
          const isHoliday = holidayDates.has(dateStr);

          if (isWeekend || isHoliday) {
            return;
          }

          if (isOnLeave(emp._id, dateStr)) {
            leaveDays++;
          } else {
            absentDays++;
          }
        }
      });

      const totalWorkingDays = presentDays + absentDays;
      const attendancePercentage = totalWorkingDays > 0
        ? Math.round((presentDays / totalWorkingDays) * 100)
        : 100;

      return {
        employee: {
          id: emp._id,
          fullName: emp.fullName,
          employeeId: emp.employeeId,
          email: emp.email,
          department: emp.department?.name || 'Unassigned',
          designation: emp.designation || 'Staff'
        },
        presentDays,
        absentDays,
        lateDays,
        halfDays,
        leaveDays,
        attendancePercentage,
        punchInTime,
        punchOutTime,
        totalWorkHours: Math.round(totalWorkHours * 100) / 100,
        punchDetails: punchDetails.join(' | ')
      };
    });

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/dashboard/send-warning-email
// @desc    Send short attendance email warning and create in-app notification
// @access  Private (Admin, Manager)
router.post('/send-warning-email', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide employeeId'
    });
  }

  try {
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const monthDates = getMonthDateStrings();
    const holidays = await Holiday.find({
      date: { $in: monthDates }
    });
    const holidayDates = new Set(holidays.map(h => h.date));

    const startRange = new Date(monthDates[0]);
    const endRange = new Date(monthDates[monthDates.length - 1]);
    const leaveRequests = await LeaveRequest.find({
      employee: employeeId,
      status: 'Approved',
      startDate: { $lte: endRange },
      endDate: { $gte: startRange }
    });

    const attDetails = await calculateCurrentMonthAttendance(employeeId, holidayDates, leaveRequests, monthDates);

    const emailResult = await sendEmail({
      to: employee.email,
      from: process.env.SMTP_FROM,
      subject: `[Warning] Short Attendance Alert - Action Required`,
      text: `Dear ${employee.fullName},\n\nThis is to notify you that your attendance for the current month is ${attDetails.attendancePercentage}%, which is below the minimum required threshold of 75%.\n\nPlease make sure to check in regularly to improve your attendance.\n\nRegards,\nSupport Team (support@gmail.com)`,
      html: `<div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #fca5a5; border-radius: 16px; background-color: #fef2f2;">
        <div style="background-color: #ef4444; padding: 16px 20px; border-radius: 12px; color: #ffffff; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 700;">⚠️ Short Attendance Alert</h2>
        </div>
        <p style="font-size: 15px; color: #1f2937; font-weight: bold;">Dear ${employee.fullName},</p>
        <p style="font-size: 14px; color: #374151; line-height: 1.6;">
          Your attendance for the current month is <strong>${attDetails.attendancePercentage}%</strong>, which is below the minimum required threshold of <strong>75%</strong>.
        </p>
        <p style="font-size: 14px; color: #374151; line-height: 1.6;">
          Please make sure to mark your attendance daily via the AttendanceHub portal to avoid further action.
        </p>
        <div style="margin-top: 24px; font-size: 12px; color: #6b7280; border-top: 1px solid #fee2e2; padding-top: 16px;">
          Sent by Support Team (support@gmail.com) • AttendanceHub Advisory Platform
        </div>
      </div>`
    });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: `Failed to send short attendance warning email: ${emailResult.error}`
      });
    }

    await Notification.create({
      recipient: employeeId,
      title: 'Short Attendance Warning',
      message: `Your current monthly attendance is ${attDetails.attendancePercentage}%, which is below the 75% threshold. Please check in daily.`,
      type: 'Attendance'
    });

    res.status(200).json({
      success: true,
      message: `Short attendance warning email successfully dispatched to ${employee.fullName}.`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
