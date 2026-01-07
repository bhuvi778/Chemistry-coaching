const mongoose = require('mongoose');

const conceptNoteSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        enum: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'General Chemistry']
    },
    chapter: {
        type: String,
        required: true,
        trim: true
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    images: [{
        url: String,
        caption: String
    }],
    examType: {
        type: String,
        default: 'All',
        enum: ['All', 'JEE', 'NEET', 'BOARDS', 'OLYMPIAD', 'GATE', 'CSIR NET', 'IIT JAM', 'IAT', 'NEST', 'KVPY', 'TIFR', 'AIIMS', 'CUET']
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

// Index for faster queries
conceptNoteSchema.index({ subject: 1, chapter: 1, topic: 1 });
conceptNoteSchema.index({ examType: 1 });

module.exports = mongoose.model('ConceptNote', conceptNoteSchema);
