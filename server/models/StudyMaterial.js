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
    enum: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Notes', 'Question Banks', 'Previous Year Papers', 'Revision Notes', 'Study Material', 'Practice Sets', 'Reference Books'],
    default: 'Notes'
  },
  examType: {
    type: String,
    enum: ['JEE', 'NEET', 'GATE', 'CSIR NET', 'IIT JAM', 'All'],
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
