const mongoose = require('mongoose');

const freeQuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    examType: {
        type: String,
        required: true,
        enum: [
            'NEET', 'JEE', 'IAT', 'NEST', 'CUET UG', 'BITSAT',
            'IIT JAM', 'CUET PG',
            'CSIR NET', 'GATE', 'TIFR',
            'PSTET', 'Master Cadre', 'UPSC - Mains (Chemistry)',
            'BOARDS', 'KVPY', 'OLYMPIAD', 'FOUNDATION', 'OTHER'
        ],
        default: 'JEE'
    },
    subject: {
        type: String,
        default: 'Chemistry'
    },
    chapter: {
        type: String,
        required: true,
        trim: true
    },
    topic: {
        type: String,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    quizCategory: {
        type: String,
        enum: ['Quiz', 'Mock Test', 'PYPs'],
        default: 'Quiz'
    },
    marks: {
        type: Number,
        default: 4
    },
    negativeMarks: {
        type: Number,
        default: 1
    },
    timeLimit: {
        type: Number,
        default: 30 // in minutes
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

module.exports = mongoose.model('FreeQuiz', freeQuizSchema);
