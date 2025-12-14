const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  subtitle: String, // Added to match frontend form
  grade: String, // Old field - kept for backward compatibility
  category: { 
    type: String, 
    enum: ['JEE', 'NEET', 'IAT', 'NEST', 'CSIR NET', 'GATE', 'IIT JAM', 'TIFR', 'jee', 'neet', 'iat', 'nest', 'csir-net', 'gate', 'iit-jam', 'tifr'], 
    default: 'JEE' 
  }, // Exam category (old categories)
  desc: { 
    type: String, 
    required: true 
  }, // Changed from 'description' to match frontend form
  description: String, // Keep for backward compatibility
  duration: String,
  schedule: String,
  price: String, // Made optional to match frontend
  features: [String],
  color: String,
  icon: String, // Added to match frontend form
  badge: String, // Added to match frontend form
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
    default: []
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