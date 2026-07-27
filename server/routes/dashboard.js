const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Department = require('../models/Department');
const LeaveRequest = require('../models/LeaveRequest');
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');

const getCurrentWeekDateStrings = () => {
  const dates = [];
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));

  for (let i = 0; i < 5; i++) {
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

router.get('/admin', protect, authorize('Admin'), async (req, res, next) => {
  try {
    const today = getTodayDateString();

    const totalEmployees = await User.countDocuments({ role: 'Employee', status: 'Active' });
    const totalDepartments = await Department.countDocuments();

    const todayLogs = await Attendance.find({ date: today }).populate('employee', 'fullName employeeId');
    const presentTodayCount = todayLogs.filter(log => log.status === 'Present' || log.status === 'Late').length;
    const lateTodayCount = todayLogs.filter(log => log.status === 'Late').length;
    
    const dToday = new Date();
    dToday.setHours(0,0,0,0);
    const leavesTodayCount = await LeaveRequest.countDocuments({
      status: 'Approved',
      startDate: { $lte: dToday },
      endDate: { $gte: dToday }
    });

    const absentTodayCount = Math.max(0, totalEmployees - presentTodayCount - leavesTodayCount);

    const recentLogs = await Attendance.find()
      .populate({
        path: 'employee',
        select: 'fullName employeeId profilePhoto department designation',
        populate: { path: 'department', select: 'name code' }
      })
      .sort({ updatedAt: -1 })
      .limit(8);

    const weekDates = getCurrentWeekDateStrings();
    const weeklyChartData = [];
    
    for (const dStr of weekDates) {
      const logs = await Attendance.find({ date: dStr });
      const presentCount = logs.filter(log => log.status === 'Present' || log.status === 'Late').length;
      const lateCount = logs.filter(log => log.status === 'Late').length;
      
      const dayName = new Date(dStr).toLocaleDateString('en-US', { weekday: 'short' });
      
      weeklyChartData.push({
        day: dayName,
        date: dStr,
        Present: presentCount,
        Late: lateCount,
        Absent: Math.max(0, totalEmployees - presentCount)
      });
    }

    const departments = await Department.find();
    const departmentChartData = [];

    for (const dept of departments) {
      const employeeCount = await User.countDocuments({ department: dept._id, role: 'Employee', status: 'Active' });
      const logs = await Attendance.find({ date: today }).populate('employee');
      const presentCount = logs.filter(log => log.employee && log.employee.department && log.employee.department.toString() === dept._id.toString()).length;

      departmentChartData.push({
        department: dept.code,
        name: dept.name,
        Total: employeeCount,
        Present: presentCount
      });
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
        departmentBreakdown: departmentChartData
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/employee', protect, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = getTodayDateString();

    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);

    const monthLogs = await Attendance.find({
      employee: userId,
      checkIn: { $ne: null },
      createdAt: { $gte: monthAgo }
    });

    const presentCount = monthLogs.filter(log => log.status === 'Present' || log.status === 'Late').length;
    const lateCount = monthLogs.filter(log => log.status === 'Late').length;
    
    const approvedLeavesCount = await LeaveRequest.countDocuments({
      employee: userId,
      status: 'Approved',
      startDate: { $gte: monthAgo }
    });

    const weekDates = getCurrentWeekDateStrings();
    const weeklyLogs = [];

    for (const dStr of weekDates) {
      const log = await Attendance.findOne({ employee: userId, date: dStr });
      const dayName = new Date(dStr).toLocaleDateString('en-US', { weekday: 'short' });
      const isPastOrToday = new Date(dStr) <= new Date();

      weeklyLogs.push({
        day: dayName,
        date: dStr,
        checkIn: log?.checkIn?.time ? log.checkIn.time : null,
        checkOut: log?.checkOut?.time ? log.checkOut.time : null,
        status: log?.status || (isPastOrToday ? 'Absent' : 'Pending'),
        workHours: log?.workHours || 0
      });
    }

    const announcements = await Announcement.find()
      .populate('author', 'fullName designation')
      .sort({ createdAt: -1 })
      .limit(3);

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
        todayLog: await Attendance.findOne({ employee: userId, date: today })
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
