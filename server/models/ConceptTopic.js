const mongoose = require('mongoose');

const conceptTopicSchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ConceptChapter',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String, // Rich text HTML
        required: true
    },
    images: [{
        url: String,
        caption: String
    }],
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ConceptTopic', conceptTopicSchema);
