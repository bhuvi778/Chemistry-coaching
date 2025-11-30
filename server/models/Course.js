const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  grade: String,
  description: String,
  duration: String,
  schedule: String,
  price: String,
  features: [String],
  color: String,
  categories: [String]
});

module.exports = mongoose.model('Course', courseSchema);