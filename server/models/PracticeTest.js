const mongoose = require('mongoose');

const practiceTestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    examType: {
        type: String,
        enum: [
            // UG Entrance Exams
            'NEET', 'JEE', 'IAT', 'NEST', 'CUET UG', 'BITSAT',
            // PG Entrance Exams
            'IIT JAM', 'CUET PG',
            // Research Level Exams
            'CSIR NET', 'GATE', 'TIFR',
            // Competitive Exams (Govt. Job)
            'PSTET', 'Master Cadre', 'UPSC - Mains (Chemistry)',
            // Other
            'Foundation', 'All'
        ],
        default: 'JEE'
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now // Test becomes available immediately by default
    },
    duration: {
        type: Number, // in minutes
        default: 60
    },
    totalMarks: {
        type: Number,
        required: true
    },
    passingMarks: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PracticeTest', practiceTestSchema);
