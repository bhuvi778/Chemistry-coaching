const mongoose = require('mongoose');

const magazineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  edition: String,
  month: String,
  year: Number,
  coverImageUrl: String,
  pdfUrl: {
    type: String,
    required: true
  },
  topics: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Magazine', magazineSchema);
