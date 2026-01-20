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
        enum: [
            'All',
            // UG Entrance Exams
            'NEET', 'JEE', 'IAT', 'NEST', 'CUET UG', 'BITSAT',
            // PG Entrance Exams
            'IIT JAM', 'CUET PG',
            // Research Level Exams
            'CSIR NET', 'GATE', 'TIFR',
            // Competitive Exams (Govt. Job)
            'PSTET', 'Master Cadre', 'UPSC - Mains (Chemistry)',
            // Legacy/Other
            'BOARDS', 'OLYMPIAD', 'KVPY', 'AIIMS', 'CUET', 'Foundation'
        ]
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
