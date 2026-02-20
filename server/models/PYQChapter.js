const mongoose = require('mongoose');

const pyqChapterSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
        enum: ['JEE Main', 'JEE Advanced', 'NEST', 'IAT', 'NEET', 'BITSAT']
    },
    subject: {
        type: String,
        required: true,
        enum: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Practical']
    },
    chapterName: {
        type: String,
        required: true,
        trim: true
    },
    chapterNumber: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    icon: {
        type: String,
        default: 'fa-book'
    },
    color: {
        type: String,
        default: 'cyan',
        enum: ['cyan', 'blue', 'purple', 'pink', 'green', 'yellow', 'orange', 'red']
    },
    classLevel: {
        type: String,
        default: '11',
        enum: ['11', '12']
    },
    batchName: {
        type: String,
        trim: true,
        default: ''
    },
    shift: {
        type: String,
        enum: ['Morning', 'Afternoon', 'Evening', ''],
        default: ''
    },
    timing: {
        type: String,
        trim: true,
        default: ''
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

// Indexes for faster queries
pyqChapterSchema.index({ examName: 1, subject: 1, order: 1 });
pyqChapterSchema.index({ isActive: 1 });

module.exports = mongoose.model('PYQChapter', pyqChapterSchema);
