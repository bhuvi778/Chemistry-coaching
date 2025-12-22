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
    required: true
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
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);
