const mongoose = require('mongoose');

const flashCardProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FlashCardChapter',
        required: true
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FlashCardTopic',
        required: true
    },
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FlashCard',
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'learning', 'reviewing', 'mastered'],
        default: 'new'
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    lastReviewed: {
        type: Date,
        default: null
    },
    nextReview: {
        type: Date,
        default: null
    },
    easeFactor: {
        type: Number,
        default: 2.5 // For spaced repetition algorithm
    },
    interval: {
        type: Number,
        default: 0 // Days until next review
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
flashCardProgressSchema.index({ userId: 1, chapterId: 1 });
flashCardProgressSchema.index({ userId: 1, topicId: 1 });
flashCardProgressSchema.index({ userId: 1, cardId: 1 }, { unique: true });

module.exports = mongoose.model('FlashCardProgress', flashCardProgressSchema);
