const mongoose = require('mongoose');

const chemSnapSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['PDF', 'DOC', 'PPT', 'IMAGE'],
        default: 'PDF'
    },
    category: {
        type: String,
        enum: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Analytical Chemistry', 'Biochemistry', 'General'],
        default: 'General'
    },
    examType: {
        type: String,
        enum: ['JEE', 'NEET', 'GATE', 'CSIR NET', 'IIT JAM', 'AIIMS', 'IAT', 'NEST', 'KVPY', 'TIFR', 'OLYMPIAD', 'CUET', 'BOARDS', 'All'],
        default: 'All'
    },
    chapter: {
        type: String,
        default: ''
    },
    thumbnailUrl: String,
    fileSize: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChemSnap', chemSnapSchema);
