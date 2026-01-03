const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  preferred_language: {
    type: String,
    enum: ['English', 'Hindi', 'Hinglish'],
    default: 'English'
  },
  exam_type: {
    type: String,
    enum: ['Boards', 'JEE', 'NEET', 'CUET', 'University']
  },
  exam_date: {
    type: Date
  },
  daily_study_time_minutes: {
    type: Number,
    default: 120
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);