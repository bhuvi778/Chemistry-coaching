const mongoose = require('mongoose');

const conceptChapterSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        enum: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'General Chemistry', 'Analytical Chemistry', 'Biochemistry']
    },
    chapterName: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    thumbnailUrl: String,
    examType: {
        type: String,
        default: 'All',
        enum: ['All', 'JEE', 'NEET', 'BOARDS', 'OLYMPIAD', 'GATE', 'CSIR NET', 'IIT JAM', 'IAT', 'NEST', 'KVPY', 'TIFR', 'AIIMS', 'CUET']
    },
    badges: {
        type: String,
        default: ''
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
conceptChapterSchema.index({ subject: 1, chapterName: 1 });
conceptChapterSchema.index({ examType: 1 });

module.exports = mongoose.model('ConceptChapter', conceptChapterSchema);
