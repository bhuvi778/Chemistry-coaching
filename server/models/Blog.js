const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        trim: true
    },
    author: {
        type: String,
        default: 'JEE',
        trim: true
    },
    excerpt: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    featuredImage: {
        type: String,
        default: ''
    },
    videoUrls: [{
        type: String,
        trim: true
    }],
    additionalImages: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        enum: ['JEE', 'NEET', 'Boards', 'Study Tips', 'Career Guidance', 'Chemistry', 'General'],
        default: 'General'
    },
    tags: [{
        type: String,
        trim: true
    }],
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    publishedDate: {
        type: Date,
        default: Date.now
    },
    metaTitle: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    metaKeywords: [{
        type: String,
        trim: true
    }],
    shareCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
    faqs: [{
        question: {
            type: String,
            required: true,
            trim: true
        },
        answer: {
            type: String,
            required: true,
            trim: true
        },
        order: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

// Index for better search performance
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ isPublished: 1, publishedDate: -1 });

module.exports = mongoose.model('Blog', blogSchema);
