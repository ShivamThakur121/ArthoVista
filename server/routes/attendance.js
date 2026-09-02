const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Holiday = require('../models/Holiday');
const LeaveRequest = require('../models/LeaveRequest');
const { protect } = require('../middleware/auth');
const { verifyFace } = require('../utils/faceMatcher');
const { checkGeofence } = require('../utils/haversine');

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

router.get('/today', protect, async (req, res, next) => {
  try {
    const today = getTodayDateString();
    const attendance = await Attendance.findOne({
      employee: req.user.id,
      date: today
    });

    res.status(200).json({
      success: true,
      exists: !!attendance,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
});

router.get('/history', protect, async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'Admin' || req.user.role === 'Manager') {
      if (req.query.employeeId) {
        query.employee = req.query.employeeId;
      }
    } else {
      query.employee = req.user.id;
    }

    if (req.query.month) {
      // Month format: YYYY-MM
      query.date = { $regex: `^${req.query.month}` };
    }

    const history = await Attendance.find(query)
      .populate({
        path: 'employee',
        select: 'fullName employeeId department designation profilePhoto',
        populate: { path: 'department', select: 'name code' }
      })
      .sort({ date: -1, createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/attendance/calendar
// @desc    Get complete monthly calendar attendance grid with leaves, holidays, weekends & logs
// @access  Private
router.get('/calendar', protect, async (req, res, next) => {
  try {
    const targetUserId = (req.query.employeeId && (req.user.role === 'Admin' || req.user.role === 'Manager'))
      ? req.query.employeeId
      : req.user.id;

    const today = new Date();
    const year = parseInt(req.query.year) || today.getFullYear();
    const month = parseInt(req.query.month) || (today.getMonth() + 1); // 1-12

    // Get total days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    const mStr = String(month).padStart(2, '0');

    const startDateStr = `${year}-${mStr}-01`;
    const endDateStr = `${year}-${mStr}-${String(daysInMonth).padStart(2, '0')}`;

    const monthDates = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = String(d).padStart(2, '0');
      monthDates.push(`${year}-${mStr}-${dStr}`);
    }

    // 1. Fetch holidays
    const holidays = await Holiday.find({
      date: { $gte: startDateStr, $lte: endDateStr }
    });
    const holidayMap = {};
    holidays.forEach(h => { holidayMap[h.date] = h; });

    // 2. Fetch approved leaves
    const startRange = new Date(startDateStr);
    const endRange = new Date(endDateStr);
    endRange.setHours(23, 59, 59, 999);

    const leaveRequests = await LeaveRequest.find({
      employee: targetUserId,
      status: 'Approved',
      startDate: { $lte: endRange },
      endDate: { $gte: startRange }
    });

    const isDateOnLeave = (dateStr) => {
      const d = new Date(dateStr);
      return leaveRequests.find(leave => {
        const lStart = new Date(leave.startDate);
        lStart.setHours(0,0,0,0);
        const lEnd = new Date(leave.endDate);
        lEnd.setHours(23,59,59,999);
        return d >= lStart && d <= lEnd;
      });
    };

    // 3. Fetch attendance logs for user
    const logs = await Attendance.find({
      employee: targetUserId,
      date: { $in: monthDates }
    });
    const logMap = {};
    logs.forEach(l => { logMap[l.date] = l; });

    // 4. Build calendar days
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    let presentCount = 0;
    let lateCount = 0;
    let halfDayCount = 0;
    let absentCount = 0;
    let leaveCount = 0;
    let totalWorkHours = 0;

    const calendarDays = monthDates.map(dateStr => {
      const dateObj = new Date(dateStr);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const log = logMap[dateStr] || null;
      const holiday = holidayMap[dateStr] || null;
      const leave = isDateOnLeave(dateStr) || null;
      const isPastOrToday = dateStr <= todayStr;
      const isToday = dateStr === todayStr;
      const isSunday = (dayOfWeek === 0); // Only Sunday is weekend, Saturday is working day

      let status = 'Pending';
      if (log) {
        status = log.status || 'Present';
        if (status === 'Present') presentCount++;
        else if (status === 'Late') { lateCount++; presentCount++; }
        else if (status === 'Half Day') { halfDayCount++; presentCount += 0.5; }
        else if (status === 'Absent') { absentCount++; }
        if (log.workHours) totalWorkHours += log.workHours;
      } else if (isSunday) {
        status = 'Weekend';
      } else if (holiday) {
        status = 'Holiday';
      } else if (leave) {
        status = 'Leave';
        leaveCount++;
      } else if (isPastOrToday) {
        status = 'Absent';
        absentCount++;
      }

      return {
        date: dateStr,
        dayNumber: dateObj.getDate(),
        dayOfWeek,
        dayName,
        isSunday,
        isToday,
        holiday: holiday ? { name: holiday.name, type: holiday.type } : null,
        leave: leave ? { type: leave.type, reason: leave.reason } : null,
        log: log ? {
          checkIn: log.checkIn?.time || null,
          checkOut: log.checkOut?.time || null,
          status: log.status,
          workHours: log.workHours || 0,
          overtime: log.overtime || 0,
          deviceInfo: log.checkIn?.deviceInfo || null,
          address: log.checkIn?.gps?.address || null,
          faceVerified: log.checkIn?.faceVerified || false
        } : null,
        status
      };
    });

    const workingDaysCount = calendarDays.filter(d => !d.isSunday && !d.holiday).length;
    const attendancePercentage = (presentCount + absentCount) > 0
      ? Math.round((presentCount / (presentCount + absentCount)) * 100)
      : 100;

    res.status(200).json({
      success: true,
      data: {
        year,
        month,
        summary: {
          daysInMonth,
          workingDays: workingDaysCount,
          presentDays: presentCount,
          lateDays: lateCount,
          halfDays: halfDayCount,
          absentDays: absentCount,
          leaveDays: leaveCount,
          totalWorkHours: Math.round(totalWorkHours * 100) / 100,
          attendancePercentage
        },
        calendar: calendarDays
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/check-in', protect, async (req, res, next) => {
  const { faceDescriptor, gps, deviceInfo, browser, livenessVerified } = req.body;
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
    return res.status(400).json({
      success: false,
      message: 'Webcam face descriptor embedding is required for check-in.'
    });
  }

  if (!gps || !gps.lat || !gps.lng) {
    return res.status(400).json({
      success: false,
      message: 'GPS coordinates are required to verify geofenced office check-in.'
    });
  }

  try {
    const employee = await User.findById(req.user.id);
    if (!employee.faceEmbeddings || employee.faceEmbeddings.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No registered biometrics found for this profile. Please contact IT Admin.'
      });
    }

    const faceCheck = verifyFace(faceDescriptor, employee.faceEmbeddings);
    if (!faceCheck.verified) {
      return res.status(401).json({
        success: false,
        message: `Biometric verification failed. Face match score too low (distance: ${faceCheck.medianDistance.toFixed(3)}, matched ${faceCheck.matchCount}/${faceCheck.totalEmbeddings} frames). Please ensure only the enrolled employee attempts check-in.`
      });
    }

    const officeLat = parseFloat(process.env.OFFICE_LAT || '28.6126546');
    const officeLng = parseFloat(process.env.OFFICE_LNG || '77.3660593');
    const officeRadius = parseFloat(process.env.OFFICE_RADIUS || '50');

    const geofenceCheck = checkGeofence(gps.lat, gps.lng, officeLat, officeLng, officeRadius);
    if (!geofenceCheck.inRange) {
      return res.status(403).json({
        success: false,
        message: `Geofence validation failed. You are ${geofenceCheck.distanceMeters.toFixed(1)} meters from the office location. Allowed radius: ${officeRadius}m.`
      });
    }

    const today = getTodayDateString();
    let record = await Attendance.findOne({ employee: req.user.id, date: today });

    if (record && record.checkIn && record.checkIn.time) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in for today.'
      });
    }

    const checkinTime = new Date();
    let status = 'Present';
    // Shift officially starts at 10:00 AM (Check-ins after 10:00 AM are marked Late)
    if (checkinTime.getHours() > 10 || (checkinTime.getHours() === 10 && checkinTime.getMinutes() > 0)) {
      status = 'Late';
    }

    const checkInData = {
      time: checkinTime,
      gps: {
        lat: gps.lat,
        lng: gps.lng,
        address: gps.address || 'Address Unresolved'
      },
      deviceInfo: deviceInfo || 'Unknown Device',
      browser: browser || 'Unknown Browser',
      ip: clientIp,
      faceVerified: true,
      livenessVerified: Boolean(livenessVerified)
    };

    if (!record) {
      record = await Attendance.create({
        employee: req.user.id,
        date: today,
        checkIn: checkInData,
        status: status
      });
    } else {
      record.checkIn = checkInData;
      record.status = status;
      await record.save();
    }

    res.status(200).json({
      success: true,
      message: `Check-in recorded successfully! Status: ${status}`,
      data: record
    });
  } catch (error) {
    next(error);
  }
});

router.post('/check-out', protect, async (req, res, next) => {
  const { faceDescriptor, gps, deviceInfo, browser, livenessVerified } = req.body;
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
    return res.status(400).json({
      success: false,
      message: 'Webcam face descriptor embedding is required for check-out.'
    });
  }

  if (!gps || !gps.lat || !gps.lng) {
    return res.status(400).json({
      success: false,
      message: 'GPS coordinates are required to verify geofenced office check-out.'
    });
  }

  try {
    const today = getTodayDateString();
    const record = await Attendance.findOne({ employee: req.user.id, date: today });

    if (!record || !record.checkIn || !record.checkIn.time) {
      return res.status(400).json({
        success: false,
        message: 'No check-in record found for today. Please check-in first.'
      });
    }

    if (record.checkOut && record.checkOut.time) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out for today.'
      });
    }

    const employee = await User.findById(req.user.id);
    
    const faceCheck = verifyFace(faceDescriptor, employee.faceEmbeddings);
    if (!faceCheck.verified) {
      return res.status(401).json({
        success: false,
        message: `Biometric verification failed. Face match score too low (distance: ${faceCheck.medianDistance.toFixed(3)}, matched ${faceCheck.matchCount}/${faceCheck.totalEmbeddings} frames). Please ensure only the enrolled employee attempts check-out.`
      });
    }

    const officeLat = parseFloat(process.env.OFFICE_LAT || '28.6126546');
    const officeLng = parseFloat(process.env.OFFICE_LNG || '77.3660593');
    const officeRadius = parseFloat(process.env.OFFICE_RADIUS || '50');

    const geofenceCheck = checkGeofence(gps.lat, gps.lng, officeLat, officeLng, officeRadius);
    if (!geofenceCheck.inRange) {
      return res.status(403).json({
        success: false,
        message: `Geofence validation failed. You are ${geofenceCheck.distanceMeters.toFixed(1)} meters from the office location. Allowed radius: ${officeRadius}m.`
      });
    }

    const checkoutTime = new Date();
    const checkinTime = new Date(record.checkIn.time);
    
    // Accurate working duration from actual check-in to check-out
    const diffMs = Math.max(0, checkoutTime.getTime() - checkinTime.getTime());
    const workHoursRaw = diffMs / (1000 * 60 * 60);
    const workHours = Math.round(workHoursRaw * 100) / 100;

    let overtime = 0;
    if (workHours > 8) {
      overtime = Math.round((workHours - 8) * 100) / 100;
    }

    // Determine status based on actual work hours and check-in timeliness
    if (workHours >= 8) {
      // Full working day: preserve 'Late' if checked in late, otherwise 'Present'
      if (record.status !== 'Late') {
        record.status = 'Present';
      }
    } else if (workHours >= 4 && workHours < 8) {
      record.status = 'Half Day';
    } else {
      record.status = 'Half Day';
    }

    record.checkOut = {
      time: checkoutTime,
      gps: {
        lat: gps.lat,
        lng: gps.lng,
        address: gps.address || 'Address Unresolved'
      },
      deviceInfo: deviceInfo || 'Unknown Device',
      browser: browser || 'Unknown Browser',
      ip: clientIp,
      faceVerified: true,
      livenessVerified: Boolean(livenessVerified)
    };

    record.workHours = workHours;
    record.overtime = overtime;

    await record.save();

    res.status(200).json({
      success: true,
      message: `Check-out recorded successfully! Work Hours: ${workHours} hrs.`,
      data: record
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
