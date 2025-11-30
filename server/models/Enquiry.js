const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: String,
  phone: String,
  course: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', enquirySchema);