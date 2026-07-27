const mongoose = require('mongoose');

const HolidaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a holiday name'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'Please add a holiday date'],
    unique: true
  },
  type: {
    type: String,
    enum: ['Public', 'Company'],
    default: 'Public'
  }
}, { timestamps: true });

module.exports = mongoose.model('Holiday', HolidaySchema);
