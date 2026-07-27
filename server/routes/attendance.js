const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
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
    const history = await Attendance.find({ employee: req.user.id })
      .sort({ date: -1 })
      .limit(30);

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
});

router.post('/check-in', protect, async (req, res, next) => {
  const { faceDescriptor, gps, deviceInfo, browser } = req.body;
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

    const officeLat = parseFloat(process.env.OFFICE_LAT || '28.6139');
    const officeLng = parseFloat(process.env.OFFICE_LNG || '77.2090');
    const officeRadius = parseFloat(process.env.OFFICE_RADIUS || '200');

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
    if (checkinTime.getHours() > 9 || (checkinTime.getHours() === 9 && checkinTime.getMinutes() > 30)) {
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
      faceVerified: true
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
  const { faceDescriptor, gps, deviceInfo, browser } = req.body;
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

    const officeLat = parseFloat(process.env.OFFICE_LAT || '28.6139');
    const officeLng = parseFloat(process.env.OFFICE_LNG || '77.2090');
    const officeRadius = parseFloat(process.env.OFFICE_RADIUS || '200');

    const geofenceCheck = checkGeofence(gps.lat, gps.lng, officeLat, officeLng, officeRadius);
    if (!geofenceCheck.inRange) {
      return res.status(403).json({
        success: false,
        message: `Geofence validation failed. You are ${geofenceCheck.distanceMeters.toFixed(1)} meters from the office location. Allowed radius: ${officeRadius}m.`
      });
    }

    const checkoutTime = new Date();
    const checkinTime = new Date(record.checkIn.time);
    
    const diffMs = checkoutTime - checkinTime;
    const workHoursRaw = diffMs / (1000 * 60 * 60);
    const workHours = Math.round(workHoursRaw * 100) / 100;

    let overtime = 0;
    if (workHours > 8) {
      overtime = Math.round((workHours - 8) * 100) / 100;
    }

    if (workHours < 8) {
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
      ip: clientIp
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
