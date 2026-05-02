const mongoose = require('mongoose');

const ntaAbhyasSchema = new mongoose.Schema({
    examCategory: {
        type: String,
        required: true,
        enum: ['JEE', 'NEET'],
        index: true
    },
    chapter: {
        type: String,
        required: true,
        index: true
    },
    classLevel: {
        type: String,
        default: '11',
        enum: ['11', '12']
    },
    chapterNumber: {
        type: String,
        default: ''
    },
    question: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ['MCQ', 'Numerical', 'Subjective'],
        default: 'MCQ'
    },
    options: [{
        type: String
    }],
    correctAnswer: {
        type: String,
        required: true
    },
    solution: {
        type: String,
        default: ''
    },
    solutionImageUrl: {
        type: String,
        default: ''
    },
    hint: {
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
        default: 1
    },
    imageUrl: {
        type: String,
        default: ''
    },
    year: {
        type: Number,
        default: null
    },
    topic: {
        type: String,
        default: ''
    },
    paperNumber: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
ntaAbhyasSchema.index({ examCategory: 1, chapter: 1 });
ntaAbhyasSchema.index({ examCategory: 1, difficulty: 1 });

module.exports = mongoose.model('NTAAbhyas', ntaAbhyasSchema);
