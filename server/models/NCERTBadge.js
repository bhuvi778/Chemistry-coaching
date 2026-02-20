const mongoose = require('mongoose');

const ncertBadgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['line-by-line', 'questions', 'exemplars', 'diagrams']
    },
    badgeType: {
        type: String,
        required: true
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
    }
});

// Index for faster queries
ncertBadgeSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('NCERTBadge', ncertBadgeSchema);
