const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');
const { sendNotification } = require('../utils/notifications');

router.get('/', protect, async (req, res, next) => {
  try {
    const announcements = await Announcement.find()
      .populate('author', 'fullName designation')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, authorize('Admin'), async (req, res, next) => {
  const { title, description, priority, attachmentUrl } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Please provide announcement title and description'
    });
  }

  try {
    const announcement = await Announcement.create({
      title,
      description,
      priority: priority || 'Low',
      attachmentUrl: attachmentUrl || '',
      author: req.user.id
    });

    const populatedAnn = await Announcement.findById(announcement._id)
      .populate('author', 'fullName designation');

    await sendNotification('All', title, description, 'Announcement');

    res.status(201).json({
      success: true,
      data: populatedAnn
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, authorize('Admin'), async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
