const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PracticeTest',
        required: true
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PracticeQuestion'
        },
        selectedAnswer: Number, // Index of selected option
        isCorrect: Boolean,
        marksObtained: Number
    }],
    totalMarks: Number,
    marksObtained: Number,
    percentage: Number,
    timeTaken: Number, // in seconds
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TestResult', testResultSchema);
