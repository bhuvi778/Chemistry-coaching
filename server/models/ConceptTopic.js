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
    images: [{
        url: String,
        caption: String
    }],
    concepts: [{
        conceptName: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String, // Rich text HTML for notes
            required: true
        },
        images: [{
            url: String,
            caption: String
        }],
        practiceQuestions: [{
            question: {
                type: String,
                required: true
            },
            questionPdfUrl: {
                type: String,
                default: ''
            },
            options: [{
                type: String,
                required: true
            }],
            correctAnswer: {
                type: Number, // Index of correct option (0-based)
                required: true
            },
            explanation: {
                type: String,
                default: ''
            },
            difficulty: {
                type: String,
                enum: ['Easy', 'Medium', 'Hard'],
                default: 'Medium'
            }
        }],
        order: {
            type: Number,
            default: 0
        }
    }],
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ConceptTopic', conceptTopicSchema);

