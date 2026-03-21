const mongoose = require('mongoose');

const pyqQuestionSchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PYQChapter',
        required: true
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PYQTopic',
        required: true
    },
    examName: {
        type: String,
        required: true,
        enum: ['JEE Main', 'JEE Advanced', 'NEST', 'IAT', 'NEET', 'BITSAT']
    },
    yearBadge: {
        type: String,
        required: true,
        // Example: "JEE Main 2022 – 25 July, Shift 2"
        trim: true
    },
    subject: {
        type: String,
        required: true,
        enum: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Practical']
    },
    question: {
        type: String,
        required: true
    },
    questionImage: {
        type: String // URL to uploaded image
    },
    hint: {
        type: String,
        default: '',
        trim: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    questionType: {
        type: String,
        required: true,
        enum: ['Single Correct', 'Multiple Correct', 'Numerical'],
        default: 'Single Correct'
    },
    options: {
        type: [String],
        // For MCQs, will have 4 options. For Numerical, can be empty
        default: []
    },
    correctAnswer: {
        type: String,
        required: true
        // For Single: "A" or "B" etc
        // For Multiple: "A,C" or "B,D" etc
        // For Numerical: the number as string
    },
    solution: {
        type: String,
        // Detailed solution (optional, can be added later)
    },
    solutionImage: {
        type: String // URL to solution image
    },
    tags: {
        type: [String],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
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

// Indexes for efficient queries
pyqQuestionSchema.index({ chapterId: 1, topicId: 1 });
pyqQuestionSchema.index({ examName: 1 });
pyqQuestionSchema.index({ subject: 1, difficulty: 1 });
pyqQuestionSchema.index({ isActive: 1 });

module.exports = mongoose.model('PYQQuestion', pyqQuestionSchema);
