const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  course: String,
  message: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', enquirySchema);