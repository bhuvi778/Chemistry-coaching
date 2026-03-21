const mongoose = require('mongoose');

const freeQuizQuestionSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FreeQuiz',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
        validate: [arr => arr.length === 4, 'Must have exactly 4 options']
    },
    correctAnswer: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        required: true
    },
    explanation: {
        type: String,
        default: ''
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    marks: {
        type: Number,
        default: 4
    },
    negativeMarks: {
        type: Number,
        default: 1
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FreeQuizQuestion', freeQuizQuestionSchema);
