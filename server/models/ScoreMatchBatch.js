const mongoose = require('mongoose');

const scoreMatchBatchSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: String,
    desc: {
        type: String,
        required: true
    },
    exam: {
        type: String,
        enum: [
            // UG Entrance Exams
            'NEET', 'JEE', 'IAT', 'NEST', 'CUET UG', 'BITSAT',
            // PG Entrance Exams
            'IIT JAM', 'CUET PG',
            // Research Level Exams
            'CSIR NET', 'GATE', 'TIFR',
            // Competitive Exams (Govt. Job)
            'PSTET', 'Master Cadre', 'UPSC - Mains (Chemistry)'
        ],
        required: true
    },
    batchType: {
        type: String,
        enum: ['Crash Course', 'Revision Batch', 'Practice Batch', 'One Shot Course', 'Fast Track Batch'],
        required: true
    },
    price: String,
    duration: String,
    schedule: String,
    startDate: String,
    features: [String],
    color: {
        type: String,
        default: 'cyan'
    },
    icon: {
        type: String,
        default: 'fa-trophy'
    },
    badge: String,
    enrollmentLink: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ScoreMatchBatch', scoreMatchBatchSchema);
