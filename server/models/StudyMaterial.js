const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['PDF', 'DOC', 'PPT', 'ZIP'],
    default: 'PDF'
  },
  category: {
    type: String,
    enum: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Analytical Chemistry', 'Biochemistry', 'Notes', 'Handwritten Notes', 'Formula Sheets', 'Revision Notes', 'Question Banks', 'Practice Problems', 'Solutions', 'Previous Year Papers', 'Sample Papers', 'Mock Tests', 'Study Guides', 'Reference Materials', 'Reference Books', 'Study Material', 'Practice Sets', 'Puzzle'],
    default: 'Notes'
  },
  examType: {
    type: String,
    enum: ['JEE', 'NEET', 'GATE', 'CSIR NET', 'IIT JAM', 'AIIMS', 'IAT', 'NEST', 'KVPY', 'TIFR', 'OLYMPIAD', 'CUET', 'BOARDS', 'All'],
    default: 'All'
  },
  thumbnailUrl: String,
  fileSize: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
