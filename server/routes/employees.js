const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Department = require('../models/Department');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/profiles/');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `employee-${req.params.id || 'new'}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

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
    let query = {};

    if (department) {
      query.department = department;
    }

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const employees = await User.find(query)
      .populate('department', 'name code')
      .select('-password');

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'Manager' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const employee = await User.findById(req.params.id)
      .populate('department', 'name code')
      .select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
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

    if (updateFields.role === 'Admin') {
      const targetEmail = updateFields.email || employee.email;
      if (targetEmail.toLowerCase() !== 'shivamthakur12012@gmail.com') {
        return res.status(400).json({
          success: false,
          message: 'Security Restriction: Only shivamthakur12012@gmail.com can be assigned the Admin role.'
        });
      }
    }

    if (employee.role === 'Admin') {
      if (updateFields.role && updateFields.role !== 'Admin') {
        return res.status(400).json({
          success: false,
          message: 'Security Restriction: The Admin role cannot be changed.'
        });
      }
      if (updateFields.email && updateFields.email.toLowerCase() !== 'shivamthakur12012@gmail.com') {
        return res.status(400).json({
          success: false,
          message: 'Security Restriction: The Admin email address cannot be changed.'
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
    if (req.user.role !== 'Admin' && req.user.role !== 'Manager' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
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

    const photoUrl = `/uploads/profiles/${req.file.filename}`;
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

    if (employee.employeeId === 'ADMIN001') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the system primary admin user'
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
