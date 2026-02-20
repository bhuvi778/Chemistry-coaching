const mongoose = require('mongoose');

const dppsChapterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        enum: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Practical'],
        trim: true
    },
    description: {
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
        default: 'Medium'
    },
    timeLimit: {
        type: Number, // in minutes
        default: 60,
        min: 1
    },
    icon: {
        type: String,
        default: 'fa-book'
    },
    color: {
        type: String,
        default: 'cyan'
    },
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

// Index for faster queries
dppsChapterSchema.index({ isActive: 1, order: 1 });
dppsChapterSchema.index({ classLevel: 1, difficultyLevel: 1 });
dppsChapterSchema.index({ classLevel: 1, isActive: 1 });

module.exports = mongoose.model('DPPSChapter', dppsChapterSchema);
