const mongoose = require('mongoose');

const infinitePracticeQuestionSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
        enum: ['NEET', 'JEE Main', 'JEE Advanced']
    },
    subject: {
        type: String,
        required: true,
        enum: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Practical', 'Physics', 'Mathematics', 'Biology', 'Zoology', 'Botany']
    },
    chapterName: {
        type: String,
        required: true,
        trim: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    questionType: {
        type: String,
        enum: ['Single Correct', 'Multiple Correct', 'Numerical', 'Integer Type'],
        default: 'Single Correct'
    },
    options: {
        type: [String],
        validate: {
            validator: function(arr) {
                return arr.length === 4;
            },
            message: 'Must have exactly 4 options'
        }
    },
    correctAnswer: {
        type: mongoose.Schema.Types.Mixed, // Can be number (index) or array of numbers for multiple correct
        required: true
    },
    solution: {
        type: String,
        trim: true
    },
    hint: {
        type: String,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    tags: [{
        type: String,
        trim: true
    }],
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
infinitePracticeQuestionSchema.index({ examName: 1, subject: 1, chapterName: 1 });
infinitePracticeQuestionSchema.index({ difficulty: 1 });
infinitePracticeQuestionSchema.index({ isActive: 1 });

module.exports = mongoose.model('InfinitePracticeQuestion', infinitePracticeQuestionSchema);
