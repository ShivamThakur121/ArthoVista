const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an event name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add an event description'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date']
  },
  time: {
    type: String,
    required: [true, 'Please add an event start time']
  },
  venue: {
    type: String,
    required: [true, 'Please add an event venue'],
    trim: true
  },
  bannerUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
