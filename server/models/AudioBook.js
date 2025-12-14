const mongoose = require('mongoose');

const audioBookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: String,
  duration: String,
  audioUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  category: {
    type: String,
    enum: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'General'],
    default: 'General'
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

module.exports = mongoose.model('AudioBook', audioBookSchema);
