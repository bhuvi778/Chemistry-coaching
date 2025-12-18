const mongoose = require('mongoose');

const meetingRequestSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    requestType: {
        type: String,
        required: true,
        enum: ['Webinar', 'Demo', 'Workshop', 'Consultation', 'Trial Class', 'Doubt Session']
    },
    message: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'contacted', 'scheduled', 'completed', 'cancelled']
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MeetingRequest', meetingRequestSchema);
