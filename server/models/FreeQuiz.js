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
        enum: ['JEE', 'NEET', 'BOARDS', 'KVPY', 'OLYMPIAD', 'FOUNDATION', 'OTHER'],
        default: 'JEE'
    },
    subject: {
        type: String,
        default: 'Chemistry'
    },
    chapter: {
        type: String,
        required: true
    },
    topic: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    quizType: {
        type: String,
        enum: ['LINK', 'PDF'],
        required: true,
        default: 'LINK'
    },
    quizLink: {
        type: String,
        trim: true
    },
    quizPdf: {
        data: String, // Base64 encoded string
        contentType: String,
        filename: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FreeQuiz', freeQuizSchema);
