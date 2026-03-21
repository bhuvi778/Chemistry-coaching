const mongoose = require('mongoose');

const infinitePracticeSessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    examName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    chapters: [{
        type: String,
        required: true
    }],
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        enum: ['Practice', 'Exam'],
        required: true
    },
    timedMode: {
        type: Boolean,
        default: false
    },
    timeLimitSeconds: {
        type: Number,
        default: null
    },
    negativeMarking: {
        type: Boolean,
        default: false
    },
    negativeMarkValue: {
        type: Number,
        default: 0.25
    },
    studentInfo: {
        name: String,
        email: String,
        mobile: String,
        class: String
    },
    questions: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InfinitePracticeQuestion'
        },
        userAnswer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        timeTaken: Number,
        markedForReview: {
            type: Boolean,
            default: false
        }
    }],
    score: {
        correct: { type: Number, default: 0 },
        incorrect: { type: Number, default: 0 },
        unattempted: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date,
    totalTimeTaken: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
infinitePracticeSessionSchema.index({ userId: 1, status: 1 });
infinitePracticeSessionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('InfinitePracticeSession', infinitePracticeSessionSchema);
