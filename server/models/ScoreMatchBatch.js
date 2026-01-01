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
        enum: ['JEE', 'NEET', 'IAT', 'NEST', 'CSIR NET', 'GATE', 'IIT JAM', 'TIFR'],
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
