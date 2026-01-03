const mongoose = require('mongoose');

const uploadedMaterialSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  chapter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  },
  file_name: {
    type: String,
    required: true
  },
  file_path: {
    type: String,
    required: true
  },
  file_type: {
    type: String,
    enum: ['PDF', 'DOCX', 'DOC', 'PNG', 'JPG', 'JPEG', 'TXT'],
    required: true
  },
  extracted_text: {
    type: String
  },
  file_size: {
    type: Number
  },
  key_topics: [{
    type: String
  }],
  estimated_study_time: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UploadedMaterial', uploadedMaterialSchema);