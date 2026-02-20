const mongoose = require('mongoose');

const ncertProgressSchema = new mongoose.Schema({
    userId: {
        type: String, // Can be ObjectId if using real auth, or string for temp identifiers
        required: true,
        index: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NCERTQuestion',
        required: true
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NCERTChapter'
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NCERTTopic'
    },
    isCompleted: {
        type: Boolean,
        default: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    lastAttempted: {
        type: Date,
        default: Date.now
    }
});

// Composite index to quickly find user's progress on a question
ncertProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });
ncertProgressSchema.index({ userId: 1, chapterId: 1 });
ncertProgressSchema.index({ userId: 1, topicId: 1 });

module.exports = mongoose.model('NCERTProgress', ncertProgressSchema);
