const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Department = require('../models/Department');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images only (jpeg, jpg, png, webp)'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  try {
    const { department, search, role } = req.query;
    // Exclude Admin from employee directory list
    let query = {
      role: { $ne: 'Admin' },
      email: { $ne: 'shivamthakur12012@gmail.com' }
    };

    if (department) {
      query.department = department;
    }

    if (role && role !== 'Admin') {
      query.role = role;
    }

    if (search) {
      query.$and = [
        { role: { $ne: 'Admin' } },
        { email: { $ne: 'shivamthakur12012@gmail.com' } },
        {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { employeeId: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      ];
      delete query.role;
      delete query.email;
    }

    // Fast lean query with projection
    const employees = await User.find(query)
      .populate('department', 'name code')
      .select('fullName employeeId email phone role department designation joiningDate status address profilePhoto faceEmbeddings createdAt')
      .sort({ createdAt: -1 })
      .lean();

    // Map to lightweight objects without transferring raw float vector arrays
    const sanitizedEmployees = employees.map(emp => ({
      _id: emp._id,
      fullName: emp.fullName,
      employeeId: emp.employeeId,
      email: emp.email,
      phone: emp.phone || '',
      role: emp.role,
      department: emp.department,
      designation: emp.designation || 'Staff',
      joiningDate: emp.joiningDate,
      status: emp.status,
      address: emp.address || '',
      profilePhoto: emp.profilePhoto || '',
      faceEmbeddingsCount: (emp.faceEmbeddings && Array.isArray(emp.faceEmbeddings)) ? emp.faceEmbeddings.length : 0,
      hasBiometrics: Boolean(emp.faceEmbeddings && emp.faceEmbeddings.length > 0)
    }));

    res.status(200).json({
      success: true,
      count: sanitizedEmployees.length,
      data: sanitizedEmployees
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    if (req.user.role !== 'Admin' && req.user.role !== 'Manager' && currentUserId !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const employee = await User.findById(req.params.id)
      .populate('department', 'name code')
      .select('-password -faceEmbeddings')
      .lean();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...employee,
        hasBiometrics: Boolean(employee.faceEmbeddings && employee.faceEmbeddings.length > 0),
        faceEmbeddingsCount: employee.faceEmbeddings ? employee.faceEmbeddings.length : 0
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, authorize('Admin'), async (req, res, next) => {
  const {
    fullName,
    employeeId,
    email,
    password,
    phone,
    role,
    department,
    designation,
    joiningDate,
    status,
    address
  } = req.body;

  if (!fullName || !employeeId || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide full name, employee ID, email, and password'
    });
  }

  try {
    if (role === 'Admin' && email.toLowerCase() !== 'shivamthakur12012@gmail.com') {
      return res.status(400).json({
        success: false,
        message: 'Security Restriction: Only shivamthakur12012@gmail.com can be assigned the Admin role.'
      });
    }

    const employee = await User.create({
      fullName,
      employeeId: employeeId.toUpperCase(),
      email: email.toLowerCase(),
      password,
      phone,
      role: role || 'Employee',
      department: department || null,
      designation,
      joiningDate: joiningDate || Date.now(),
      status: status || 'Active',
      address
    });

    const returnEmployee = employee.toObject();
    delete returnEmployee.password;

    res.status(201).json({
      success: true,
      data: returnEmployee
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  const { password, ...updateFields } = req.body;

  try {
    let employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Permanent Lock: System Admin profile cannot be edited via Employee Management
    if (
      employee.role === 'Admin' ||
      employee.email.toLowerCase() === 'shivamthakur12012@gmail.com' ||
      employee.employeeId === 'ADMIN001'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Security Restriction: System Administrator profile (shivamthakur12012@gmail.com) is permanently fixed and cannot be edited or modified.'
      });
    }

    if (updateFields.role === 'Admin') {
      const targetEmail = updateFields.email || employee.email;
      if (targetEmail.toLowerCase() !== 'shivamthakur12012@gmail.com') {
        return res.status(400).json({
          success: false,
          message: 'Security Restriction: Only shivamthakur12012@gmail.com can be assigned the Admin role.'
        });
      }
    }

    if (password) {
      employee.password = password;
    }

    Object.keys(updateFields).forEach(key => {
      if (key === 'department' && updateFields[key] === '') {
        employee[key] = null;
      } else {
        employee[key] = updateFields[key];
      }
    });

    await employee.save();

    const updatedEmployee = await User.findById(req.params.id)
      .populate('department', 'name code')
      .select('-password');

    res.status(200).json({
      success: true,
      data: updatedEmployee
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/photo', protect, upload.single('photo'), async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admins can upload profile photos.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a photo file'
      });
    }

    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const base64Data = req.file.buffer.toString('base64');
    const photoUrl = `data:${req.file.mimetype};base64,${base64Data}`;
    employee.profilePhoto = photoUrl;
    await employee.save();

    res.status(200).json({
      success: true,
      data: {
        profilePhoto: photoUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/face-embeddings', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  const { embeddings } = req.body;

  if (!embeddings || !Array.isArray(embeddings) || embeddings.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide valid face descriptor embeddings (array of float arrays)'
    });
  }

  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (
      employee.role === 'Admin' ||
      employee.email.toLowerCase() === 'shivamthakur12012@gmail.com' ||
      employee.employeeId === 'ADMIN001'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Attendance and face biometrics are not applicable for Administrator accounts.'
      });
    }

    employee.faceEmbeddings = embeddings;
    await employee.save();

    res.status(200).json({
      success: true,
      message: `Successfully registered ${embeddings.length} face embeddings for ${employee.fullName}`
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, authorize('Admin'), async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (
      employee.employeeId === 'ADMIN001' ||
      employee.role === 'Admin' ||
      employee.email.toLowerCase() === 'shivamthakur12012@gmail.com'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Security Restriction: Primary Administrator account (shivamthakur12012@gmail.com) is permanently fixed and cannot be deleted or removed.'
      });
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Employee profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
