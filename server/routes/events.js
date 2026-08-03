const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');
const { sendNotification } = require('../utils/notifications');
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
      cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed for event banner.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', protect, async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, authorize('Admin', 'Manager'), upload.single('banner'), async (req, res, next) => {
  const { name, description, date, time, venue } = req.body;

  if (!name || !description || !date || !time || !venue) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, description, date, time, and venue for the event.'
    });
  }

  try {
    const bannerUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : '';

    const event = await Event.create({
      name,
      description,
      date: new Date(date),
      time,
      venue,
      bannerUrl
    });

    // Send email notification to all active employees
    const formattedDate = new Date(date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const emailMessage = `A new corporate event "${name}" has been scheduled!\n\n📅 Date: ${formattedDate}\n⏰ Time: ${time}\n📍 Venue: ${venue}\n\nDescription:\n${description}`;

    await sendNotification(
      'All',
      `New Event Announcement: ${name}`,
      emailMessage,
      'Event'
    );

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Corporate event not found'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
