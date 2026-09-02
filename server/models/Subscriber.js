const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  interest: {
    type: String,
    default: 'Govt. Subsidies & Grants'
  },
  status: {
    type: String,
    enum: ['Active', 'Unsubscribed'],
    default: 'Active'
  },
  source: {
    type: String,
    default: 'Website Newsletter Page'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscriber', SubscriberSchema, 'MSME_Subscribers');
