const mongoose = require('mongoose');

const pyqProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PYQQuestion',
        required: true
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PYQChapter',
        required: true
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PYQTopic',
        required: true
    },
    status: {
        type: String,
        enum: ['Correct', 'Incorrect', 'Partially Correct', 'Unattempted'],
        default: 'Unattempted'
    },
    userAnswer: {
        type: String,
        // Stores user's answer
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    attempts: {
        type: Number,
        default: 0
    },
    timeSpent: {
        type: Number,
        default: 0 // in seconds
    },
    lastAttemptedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound indexes for efficient queries
pyqProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });
pyqProgressSchema.index({ userId: 1, chapterId: 1 });
pyqProgressSchema.index({ userId: 1, topicId: 1 });
pyqProgressSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('PYQProgress', pyqProgressSchema);
