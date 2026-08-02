const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res, next) => {
  try {
    const departments = await Department.find();
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  const { name, code, description } = req.body;

  if (!name || !code) {
    return res.status(400).json({
      success: false,
      message: 'Please provide department name and code'
    });
  }

  try {
    const department = await Department.create({
      name,
      code,
      description
    });

    res.status(201).json({
      success: true,
      data: department
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  try {
    let department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    await department.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
