const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  chapter_name: {
    type: String,
    required: true,
    trim: true
  },
  difficulty_level: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Chapter', chapterSchema);