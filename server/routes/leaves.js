const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const sendEmail = require('../utils/email');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/attachments/');
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
    if (req.user.role !== 'Admin' && req.user.role !== 'Manager') {
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

    // Fetch all active Admins & Managers to notify them
    const managersAndAdmins = await User.find({
      role: { $in: ['Admin', 'Manager'] },
      status: 'Active'
    });
    const emails = [...new Set(managersAndAdmins.map(u => u.email).filter(Boolean))];

    if (emails.length > 0) {
      const formattedStartDate = new Date(startDate).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      const formattedEndDate = new Date(endDate).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      
      await sendEmail({
        to: emails,
        subject: `[Leave Request] New leave applied by ${req.user.fullName}`,
        text: `Hello,\n\n${req.user.fullName} has applied for a "${type} Leave".\n\n📅 Duration: ${formattedStartDate} to ${formattedEndDate}\n💬 Reason: ${reason}\n\nPlease log in to the portal to review the request.\n\nRegards,\nAttendance Support`,
        html: `<div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 16px 20px; border-radius: 12px; color: #ffffff; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 18px; font-weight: 700;">New Leave Application</h2>
          </div>
          <div style="font-size: 14px; line-height: 1.6; color: #334155;">
            <p>Hello,</p>
            <p><strong>${req.user.fullName}</strong> has submitted a new leave request:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Leave Type:</td>
                <td style="padding: 8px 0; color: #1e293b;">${type} Leave</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569;">Start Date:</td>
                <td style="padding: 8px 0; color: #1e293b;">${formattedStartDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569;">End Date:</td>
                <td style="padding: 8px 0; color: #1e293b;">${formattedEndDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569;">Reason:</td>
                <td style="padding: 8px 0; color: #1e293b;">${reason}</td>
              </tr>
            </table>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #6366f1); color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: bold; margin-top: 16px;">Review Request</a>
          </div>
          <br/>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
          <p style="font-size: 11px; color: #94a3b8; margin: 0;">This is an automated notification from AttendanceHub Portal.</p>
        </div>`
      });
    }

    res.status(201).json({
      success: true,
      data: leave
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
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
      .populate('employee', 'fullName employeeId department designation email')
      .populate('approvedBy', 'fullName designation');

    // Send email to employee if the leave is approved or rejected
    if (updatedLeave.employee && updatedLeave.employee.email) {
      const formattedStartDate = new Date(updatedLeave.startDate).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      const formattedEndDate = new Date(updatedLeave.endDate).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      
      const subject = `[Leave Request Update] Your Leave has been ${status}`;
      const emailMessage = `Hello ${updatedLeave.employee.fullName},\n\nYour leave request for "${updatedLeave.type} Leave" has been ${status}.\n\n📅 Duration: ${formattedStartDate} to ${formattedEndDate}\n💬 Admin Remarks: ${adminRemarks || 'None'}\n\nThank you,\nAttendance Support`;

      await sendEmail({
        to: updatedLeave.employee.email,
        subject: subject,
        text: emailMessage,
        html: `<div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="background: ${status === 'Approved' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'}; padding: 16px 20px; border-radius: 12px; color: #ffffff; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 18px; font-weight: 700;">Leave Request ${status}</h2>
          </div>
          <div style="font-size: 14px; line-height: 1.6; color: #334155;">
            <p>Hello <strong>${updatedLeave.employee.fullName}</strong>,</p>
            <p>Your leave request has been reviewed and updated to: <span style="color: ${status === 'Approved' ? '#10b981' : '#ef4444'}; font-weight: bold;">${status}</span>.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Leave Type:</td>
                <td style="padding: 8px 0; color: #1e293b;">${updatedLeave.type} Leave</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569;">Start Date:</td>
                <td style="padding: 8px 0; color: #1e293b;">${formattedStartDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569;">End Date:</td>
                <td style="padding: 8px 0; color: #1e293b;">${formattedEndDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569;">Admin Remarks:</td>
                <td style="padding: 8px 0; color: #1e293b; font-style: italic;">${adminRemarks || 'None'}</td>
              </tr>
            </table>
          </div>
          <br/>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
          <p style="font-size: 11px; color: #94a3b8; margin: 0;">This is an automated notification from AttendanceHub Portal.</p>
        </div>`
      });
    }

    res.status(200).json({
      success: true,
      data: updatedLeave
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
