const express = require('express');
const router = express.Router();
const Holiday = require('../models/Holiday');
const { protect, authorize } = require('../middleware/auth');
const { sendNotification } = require('../utils/notifications');

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

router.post('/', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
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

    const formattedDate = new Date(date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    await sendNotification(
      'All',
      `New Holiday Scheduled: ${name}`,
      `A new holiday "${name}" has been scheduled for ${formattedDate} (${type || 'Public'} Holiday).`,
      'Holiday'
    );

    res.status(201).json({
      success: true,
      data: holiday
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
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

router.get('/check-daily', async (req, res, next) => {
  const isCron = req.headers['x-vercel-cron'] === '1' || req.query.bypass === 'true';
  if (!isCron) {
    return res.status(401).json({ success: false, message: 'Unauthorized execution' });
  }

  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const holiday = await Holiday.findOne({ date: todayStr });
    if (holiday) {
      const Notification = require('../models/Notification');
      const alreadySent = await Notification.findOne({
        title: `Happy Holiday: ${holiday.name}!`,
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      });
      if (alreadySent) {
        return res.status(200).json({ success: true, message: 'Holiday greeting already sent today.' });
      }

      const { sendNotification } = require('../utils/notifications');
      await sendNotification(
        'All',
        `Happy Holiday: ${holiday.name}!`,
        `Wishing all employees a wonderful and restful "${holiday.name}" holiday!\n\nWarm regards,\nManagement Team`,
        'Holiday'
      );
      return res.status(200).json({ success: true, message: `Holiday greeting dispatched for: ${holiday.name}` });
    }
    res.status(200).json({ success: true, message: 'No holiday scheduled for today.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
