const mongoose = require('mongoose');

const leadCaptureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  whatsapp: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    default: ''
  },
  classLevel: {
    type: String,
    required: true,
    trim: true
  },
  exam: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

leadCaptureSchema.index({ createdAt: -1 });

module.exports = mongoose.model('LeadCapture', leadCaptureSchema);
