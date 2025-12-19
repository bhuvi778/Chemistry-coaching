const mongoose = require('mongoose');

const crosswordAnswerSchema = new mongoose.Schema({
    crosswordSetName: {
        type: String,
        required: true
    },
    word: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    clue: {
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster searching
crosswordAnswerSchema.index({ word: 'text', answer: 'text', crosswordSetName: 'text' });

module.exports = mongoose.model('CrosswordAnswer', crosswordAnswerSchema);
