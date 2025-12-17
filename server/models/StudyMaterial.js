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
    enum: [
      // General Categories
      'Notes', 'Handwritten Notes', 'Formula Sheets', 'Revision Notes',
      'Question Banks', 'Practice Problems', 'Solutions',
      'Previous Year Papers', 'Sample Papers', 'Mock Tests',
      'Study Guides', 'Reference Materials',
      // Chemistry Topics
      'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry',
      'Analytical Chemistry', 'Biochemistry'
    ],
    default: 'Notes'
  },
  examType: {
    type: String,
    enum: [
      'All', 'JEE', 'NEET', 'IAT', 'NEST', 'TIFR', 'KVPY',
      'CSIR NET', 'GATE', 'IIT JAM', 'OLYMPIAD', 'CUET', 'AIIMS', 'BOARDS'
    ],
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
