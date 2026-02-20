const mongoose = require('mongoose');

const dppsQuestionSchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DPPSChapter',
        required: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    options: [{
        type: String,
        trim: true
    }],
    correctAnswer: {
        type: String,
        trim: true
    },
    solution: {
        type: String,
        trim: true
    },
    hint: {
        type: String,
        trim: true
    },
    classLevel: {
        type: String,
        enum: ['11', '12'],
        required: true,
        default: '11'
    },
    difficultyLevel: {
        type: String,
        enum: ['Easy', 'Medium', 'Tough'],
        required: true,
        default: 'Medium'
    },
    questionType: {
        type: String,
        enum: ['MCQ', 'Subjective', 'Numerical', 'True/False'],
        default: 'MCQ'
    },
    marks: {
        type: Number,
        default: 1
    },
    imageUrl: {
        type: String,
        trim: true
    },
    solutionImageUrl: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
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
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for faster queries
dppsQuestionSchema.index({ chapterId: 1, isActive: 1 });
dppsQuestionSchema.index({ classLevel: 1, difficultyLevel: 1 });
dppsQuestionSchema.index({ classLevel: 1, isActive: 1 });
dppsQuestionSchema.index({ questionType: 1 });

module.exports = mongoose.model('DPPSQuestion', dppsQuestionSchema);
