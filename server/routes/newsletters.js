const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const Subscriber = require('../models/Subscriber');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/newsletters
// @desc    Get published newsletter editions (Archive)
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : { status: 'Published' };

    const newsletters = await Newsletter.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'fullName');

    res.status(200).json({
      success: true,
      count: newsletters.length,
      data: newsletters
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/newsletters/subscribe
// @desc    Subscribe to the newsletter
// @access  Public
router.post('/subscribe', async (req, res, next) => {
  try {
    const { email, name, interest, source } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let subscriber = await Subscriber.findOne({ email: normalizedEmail });

    if (subscriber) {
      if (subscriber.status === 'Unsubscribed') {
        subscriber.status = 'Active';
        if (name) subscriber.name = name;
        if (interest) subscriber.interest = interest;
        await subscriber.save();
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your newsletter subscription has been reactivated.',
          data: subscriber
        });
      }

      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to the ArthoVista Gazette!',
        data: subscriber
      });
    }

    subscriber = await Subscriber.create({
      email: normalizedEmail,
      name: name ? name.trim() : '',
      interest: interest || 'Govt. Subsidies & Grants',
      source: source || 'Website Form'
    });

    res.status(201).json({
      success: true,
      message: 'Subscribed successfully! Welcome edition and MSME Checklist are on their way.',
      data: subscriber
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/newsletters/subscribers
// @desc    Get all subscribers count and list
// @access  Private (Admin / Manager)
router.get('/subscribers', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/newsletters
// @desc    Create / Publish a new newsletter edition
// @access  Private (Admin / Manager)
router.post('/', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  try {
    const { edition, title, date, desc, highlights, readTime, tag, content, status, pdfUrl } = req.body;

    if (!edition || !title || !desc) {
      return res.status(400).json({
        success: false,
        message: 'Edition number, title, and summary are required'
      });
    }

    const subscribersCount = await Subscriber.countDocuments({ status: 'Active' });

    const newsletter = await Newsletter.create({
      edition,
      title,
      date: date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      desc,
      highlights: Array.isArray(highlights) ? highlights : (highlights ? highlights.split('\n').map(h => h.trim()).filter(Boolean) : []),
      readTime: readTime || '4 min read',
      tag: tag || 'Govt. Subsidies',
      content: content || '',
      status: status || 'Published',
      pdfUrl: pdfUrl || '',
      sentToCount: subscribersCount,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: `Gazette ${edition} published successfully!`,
      data: newsletter
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/newsletters/:id
// @desc    Update a newsletter edition
// @access  Private (Admin / Manager)
router.put('/:id', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  try {
    let newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter edition not found'
      });
    }

    newsletter = await Newsletter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Gazette edition updated successfully',
      data: newsletter
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/newsletters/:id
// @desc    Delete a newsletter edition
// @access  Private (Admin / Manager)
router.delete('/:id', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter edition not found'
      });
    }

    await newsletter.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gazette edition deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
