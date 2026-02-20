const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    answer: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    category: {
        type: String,
        required: true,
        enum: ['JEE', 'NEET', 'Boards', 'Study Tips', 'Career Guidance', 'Chemistry', 'General'],
        default: 'General'
    },
    tags: [{
        type: String,
        trim: true
    }],
    relatedBlogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
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

// Indexes for faster queries
faqSchema.index({ category: 1, isActive: 1 });
faqSchema.index({ order: 1 });
faqSchema.index({ createdAt: -1 });

// Text index for search
faqSchema.index({ question: 'text', answer: 'text', tags: 'text' });

// Update updatedAt on save
faqSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('FAQ', faqSchema);
