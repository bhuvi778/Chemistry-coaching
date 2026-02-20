const mongoose = require('mongoose');

const ncertTopicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NCERTChapter',
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
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
ncertTopicSchema.index({ chapterId: 1, order: 1 });

module.exports = mongoose.model('NCERTTopic', ncertTopicSchema);
