const mongoose = require('mongoose');

const assertionReasonQuestionSchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssertionReasonChapter',
        required: true
    },
    assertion: {
        type: String,
        required: true,
        trim: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    assertionTrue: {
        type: Boolean,
        required: true,
        default: true
    },
    reasonTrue: {
        type: Boolean,
        required: true,
        default: true
    },
    reasonExplainsAssertion: {
        type: Boolean,
        required: true,
        default: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    explanation: {
        type: String,
        trim: true,
        default: ''
    },
    tags: [{
        type: String,
        trim: true
    }],
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AssertionReasonQuestion', assertionReasonQuestionSchema);
