const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  staffName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['waiter', 'kitchen', 'admin'],
    default: 'waiter'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Staff', StaffSchema, 'staffs');