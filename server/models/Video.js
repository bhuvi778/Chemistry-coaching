const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  youtubeId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  instructor: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['organic', 'inorganic', 'physical', 'general', 'other'],
    default: 'general'
  },
  examType: {
    type: String,
    enum: ['JEE', 'NEET', 'GATE', 'AIIMS', 'IAT', 'NEST', 'KVPY', 'TIFR', 'CSIR NET', 'IIT JAM', 'OLYMPIAD', 'CUET', 'BOARDS', 'all'],
    default: 'all'
  },
  chapterName: {
    type: String,
    default: ''
  },
  duration: String,
  views: {
    type: Number,
    default: 0
  },
  classNotes: {
    data: String,  // Base64 encoded PDF
    filename: String,
    uploadedAt: Date
  },
  quizLink: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  strict: true,
  strictQuery: false
});

// Add index for sorting by createdAt (newest first)
videoSchema.index({ createdAt: -1 });
videoSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Video', videoSchema);
