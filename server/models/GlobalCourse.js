const mongoose = require('mongoose');

const globalCourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    thumbnail: {
        type: String,
        default: ''
    },
    exam: {
        type: String,
        required: true,
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
            // School Board Exams
            'CBSE', 'IB', 'IGCSE', 'A-Level'
        ]
    },
    category: {
        type: String,
        required: true,
        enum: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'General Chemistry', 'All Chemistry']
    },
    instructor: {
        type: String,
        trim: true
    },
    courseType: {
        type: String,
        enum: ['Live', 'Recorded', 'Hybrid'],
        default: 'Recorded'
    },
    duration: {
        type: String,
        trim: true
    },
    language: {
        type: String,
        default: 'English',
        trim: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
        default: 'All Levels'
    },
    price: {
        type: String,
        trim: true
    },
    originalPrice: {
        type: String,
        trim: true
    },
    enrollmentLink: {
        type: String,
        trim: true
    },
    features: [{
        type: String,
        trim: true
    }],
    badge: {
        type: String,
        trim: true
    },
    icon: {
        type: String,
        default: 'fa-globe'
    },
    color: {
        type: String,
        default: 'cyan'
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

module.exports = mongoose.model('GlobalCourse', globalCourseSchema);
