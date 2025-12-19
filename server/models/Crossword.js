const mongoose = require('mongoose');

const crosswordSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    chapter: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
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
    crosswordUrl: {
        type: String,
        required: true
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Crossword', crosswordSchema);
