const mongoose = require('mongoose');

const assertionReasonChapterSchema = new mongoose.Schema({
    name: {
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
        default: 'fas fa-bolt'
    },
    iconColor: {
        type: String,
        default: '#8b5cf6'
    },
    category: {
        type: String,
        enum: ['Physical', 'Organic', 'Inorganic'],
        default: 'Physical'
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AssertionReasonChapter', assertionReasonChapterSchema);
