const mongoose = require('mongoose');

const FreeQuizAttemptSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'FreeQuiz', required: true },
    quizTitle: { type: String },
    // User info
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    examTarget: { type: String, default: '' },
    // Results
    score: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
    unattempted: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 }, // seconds
    attemptedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FreeQuizAttempt', FreeQuizAttemptSchema);
