const mongoose = require('mongoose');

const dppsProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DPPSQuestion',
        required: true
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DPPSChapter'
    },
    testSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DPPSTestSession'
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    timeSpent: {
        type: Number, // in seconds
        default: 0
    },
    lastAttempted: {
        type: Date,
        default: Date.now
    }
});

// Compound index for user progress queries
dppsProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });
dppsProgressSchema.index({ userId: 1, chapterId: 1 });
dppsProgressSchema.index({ userId: 1, testSessionId: 1 });

module.exports = mongoose.model('DPPSProgress', dppsProgressSchema);
