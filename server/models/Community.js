const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
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
        required: false
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
    },
    feedbacks: [{
        name: String,
        email: String,
        feedback: String,
        reactionType: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('Community', communitySchema);
