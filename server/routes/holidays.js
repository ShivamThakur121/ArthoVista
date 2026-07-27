const express = require('express');
const router = express.Router();
const Holiday = require('../models/Holiday');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res, next) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.status(200).json({
      success: true,
      count: holidays.length,
      data: holidays
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, authorize('Admin'), async (req, res, next) => {
  const { name, date, type } = req.body;

  if (!name || !date) {
    return res.status(400).json({
      success: false,
      message: 'Please provide holiday name and date (YYYY-MM-DD)'
    });
  }

  try {
    const holiday = await Holiday.create({
      name,
      date,
      type: type || 'Public'
    });

    res.status(201).json({
      success: true,
      data: holiday
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, authorize('Admin'), async (req, res, next) => {
  try {
    const holiday = await Holiday.findById(req.params.id);

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found'
      });
    }

    await holiday.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Holiday deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
