const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  duration: String,
  audioUrl: {
    type: String,
    required: true
  }
});

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  topics: [topicSchema]
});

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
  thumbnailUrl: String,
  category: {
    type: String,
    enum: [
      'General',
      'JEE',
      'NEET',
      'IAT',
      'NEST',
      'TIFR',
      'CSIR NET',
      'GATE',
      'IIT JAM',
      'Physical Chemistry',
      'Organic Chemistry',
      'Inorganic Chemistry'
    ],
    default: 'General'
  },
  chapters: [chapterSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance
audioBookSchema.index({ createdAt: -1 });
audioBookSchema.index({ isActive: 1, createdAt: -1 });
audioBookSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('AudioBook', audioBookSchema);
