const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  course: String,
  message: String,
  assignedTo: {
    type: String,
    default: null  // Username of admin assigned to this enquiry
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'follow-up', 'converted', 'closed'],
    default: 'new'
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', enquirySchema);