const mongoose = require('mongoose');

const pyqTopicSchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PYQChapter',
        required: true
    },
    topicName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
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

// Indexes
pyqTopicSchema.index({ chapterId: 1, order: 1 });
pyqTopicSchema.index({ isActive: 1 });

module.exports = mongoose.model('PYQTopic', pyqTopicSchema);
