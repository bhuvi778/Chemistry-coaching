const mongoose = require('mongoose');

const ncertChapterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    chapterNumber: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    icon: {
        type: String,
        default: 'fa-flask'
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
    subject: {
        type: String,
        required: true,
        enum: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Practical'],
        default: 'Physical Chemistry'
    },
    category: {
        type: String,
        required: true,
        enum: ['line-by-line', 'questions', 'exemplars']
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

// Index for faster queries
ncertChapterSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('NCERTChapter', ncertChapterSchema);
