const mongoose = require('mongoose');

const BlogSectionSchema = new mongoose.Schema({
  id: { type: String, default: '' },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  bullets: [{ type: String }],
  callout: { type: String, default: '' }
}, { _id: false });

const TableOfContentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true }
}, { _id: false });

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Blog slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    default: 'Government Schemes'
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  },
  author: {
    type: String,
    default: 'ArthoVista Advisory Team'
  },
  featured: {
    type: Boolean,
    default: false
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true
  },
  metaDescription: {
    type: String,
    default: ''
  },
  keywords: [{
    type: String
  }],
  tableOfContents: [TableOfContentSchema],
  sections: [BlogSectionSchema],
  bodyHtml: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Published', 'Draft', 'Archived'],
    default: 'Published'
  },
  views: {
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

BlogSchema.index({ category: 1 });
BlogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Blog', BlogSchema, 'MSME_Blogs');
