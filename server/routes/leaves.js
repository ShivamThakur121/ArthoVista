const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/attachments/';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `leave-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only Documents (pdf, doc, docx) or Images (jpeg, jpg, png, webp) allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', protect, async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin') {
      query.employee = req.user.id;
    } else if (req.query.status) {
      query.status = req.query.status;
    }

    const leaves = await LeaveRequest.find(query)
      .populate('employee', 'fullName employeeId department designation')
      .populate('approvedBy', 'fullName designation')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, upload.single('attachment'), async (req, res, next) => {
  const { type, startDate, endDate, reason } = req.body;

  if (!type || !startDate || !endDate || !reason) {
    return res.status(400).json({
      success: false,
      message: 'Please provide type, start date, end date, and reason'
    });
  }

  try {
    const attachmentUrl = req.file ? `/uploads/attachments/${req.file.filename}` : '';

    const leave = await LeaveRequest.create({
      employee: req.user.id,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      attachmentUrl
    });

    res.status(201).json({
      success: true,
      data: leave
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', protect, authorize('Admin'), async (req, res, next) => {
  const { status, adminRemarks } = req.body;

  if (!status || !['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide valid status (Approved or Rejected)'
    });
  }

  try {
    let leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    leave.status = status;
    leave.approvedBy = req.user.id;
    leave.adminRemarks = adminRemarks || '';
    
    await leave.save();

    const updatedLeave = await LeaveRequest.findById(req.params.id)
      .populate('employee', 'fullName employeeId department designation')
      .populate('approvedBy', 'fullName designation');

    res.status(200).json({
      success: true,
      data: updatedLeave
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
