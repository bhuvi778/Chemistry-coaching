const mongoose = require('mongoose');

const practiceQuestionSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PracticeTest',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: Number, // Index of correct option (0, 1, 2, 3)
        required: true
    },
    marks: {
        type: Number,
        default: 1
    },
    negativeMarks: {
        type: Number,
        default: 0
    },
    explanation: String,
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PracticeQuestion', practiceQuestionSchema);
