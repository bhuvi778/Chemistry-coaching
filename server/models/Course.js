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
  desc: String, // Frontend uses this field
  description: String, // Backend compatibility field
  duration: String,
  schedule: String,
  price: String,
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
      'test-series',
      'focus-test-series'
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

// Pre-save hook to sync desc and description fields
courseSchema.pre('save', function (next) {
  // If desc is provided but description is not, copy desc to description
  if (this.desc && !this.description) {
    this.description = this.desc;
  }
  // If description is provided but desc is not, copy description to desc
  if (this.description && !this.desc) {
    this.desc = this.description;
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);