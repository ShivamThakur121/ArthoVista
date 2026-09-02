const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema({
  edition: {
    type: String,
    required: [true, 'Edition number is required (e.g. Issue #53)'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  },
  desc: {
    type: String,
    required: [true, 'Description / Summary is required'],
    trim: true
  },
  highlights: [{
    type: String,
    trim: true
  }],
  readTime: {
    type: String,
    default: '4 min read'
  },
  tag: {
    type: String,
    default: 'Govt. Subsidies'
  },
  content: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Published', 'Draft', 'Archived'],
    default: 'Published'
  },
  pdfUrl: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: 'ArthoVista Editorial Board'
  },
  sentToCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

NewsletterSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Newsletter', NewsletterSchema, 'MSME_Newsletters');
