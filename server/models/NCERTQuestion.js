const mongoose = require('mongoose');

const ncertQuestionSchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NCERTChapter'
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NCERTTopic'
    },
    category: {
        type: String,
        required: true
    },
    badgeType: {
        type: String, // To link with NCERTBadge
        trim: true
    },
    classLevel: {
        type: String,
        default: '11',
        enum: ['11', '12']
    },
    questionType: {
        type: String,
        required: true
    },
    ncertLine: {
        type: String,
        trim: true
    },
    concept: {
        type: String,
        trim: true
    },
    paraname: {
        type: String,
        trim: true
    },
    question: {
        type: String,
        required: true,
        trim: true
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
    hint: {
        type: String,
        trim: true
    },
    solution: {
        type: String,
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
    imageUrl: {
        type: String,
        trim: true
    },
    solutionImageUrl: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
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
ncertQuestionSchema.index({ category: 1, chapterId: 1 });
ncertQuestionSchema.index({ topicId: 1 });
ncertQuestionSchema.index({ questionType: 1 });

module.exports = mongoose.model('NCERTQuestion', ncertQuestionSchema);
