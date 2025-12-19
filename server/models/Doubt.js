const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        default: ''
    },
    studentName: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        required: true
    },
    studentPhone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'answered'],
        default: 'pending'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    answeredAt: {
        type: Date
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    }

});

module.exports = mongoose.model('Doubt', doubtSchema);
