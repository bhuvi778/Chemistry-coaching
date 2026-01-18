const mongoose = require('mongoose');

const assertionReasonProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssertionReasonQuestion',
        required: true
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssertionReasonChapter',
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'learning', 'reviewing', 'mastered'],
        default: 'new'
    },
    repetitions: {
        type: Number,
        default: 0
    },
    easeFactor: {
        type: Number,
        default: 2.5
    },
    interval: {
        type: Number,
        default: 0
    },
    nextReview: {
        type: Date,
        default: Date.now
    },
    lastReview: {
        type: Date
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
assertionReasonProgressSchema.index({ userId: 1, chapterId: 1 });
assertionReasonProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });
assertionReasonProgressSchema.index({ nextReview: 1, status: 1 });

module.exports = mongoose.model('AssertionReasonProgress', assertionReasonProgressSchema);
