const mongoose = require('mongoose');

const puzzleSetSchema = new mongoose.Schema({
    setNumber: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    chapter: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        default: ''
    },
    examType: {
        type: String,
        enum: [
            'All',
            'JEE', 'GATE',
            'NEET', 'AIIMS',
            'IAT', 'NEST', 'KVPY', 'TIFR',
            'CSIR NET', 'IIT JAM',
            'OLYMPIAD', 'CUET',
            'BOARDS'
        ],
        default: 'All'
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    thumbnailUrl: {
        type: String,
        default: ''
    },
    // PDF for the puzzle set
    setPdfUrl: {
        type: String,
        required: true
    },
    setPdfSize: {
        type: String,
        default: ''
    },
    // PDF for the answers
    answerPdfUrl: {
        type: String,
        required: true
    },
    answerPdfSize: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PuzzleSet', puzzleSetSchema);
