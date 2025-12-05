const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  grade: String, // Old field - kept for backward compatibility
  category: { 
    type: String, 
    enum: ['JEE', 'NEET', 'Foundation', 'jee', 'neet', 'foundation'], 
    default: 'JEE' 
  }, // Exam category (old categories)
  description: { 
    type: String, 
    required: true 
  },
  duration: String,
  schedule: String,
  price: { 
    type: String, 
    required: true 
  },
  features: [String],
  color: String,
  categories: {
    type: [String],
    enum: [
      'live-batch',
      'recorded',
      '1-1-tutoring',
      'mentorship',
      'doubt-solver',
      'test-series'
    ],
    default: ['live-batch']
  }, // Program type categories (new categories)
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);