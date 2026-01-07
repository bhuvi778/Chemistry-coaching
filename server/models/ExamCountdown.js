const mongoose = require('mongoose');

const examCountdownSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
        trim: true
    },
    examDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    color: {
        type: String,
        default: 'cyan', // cyan, blue, red, green, purple, orange
        enum: ['cyan', 'blue', 'red', 'green', 'purple', 'orange', 'pink']
    },
    icon: {
        type: String,
        default: 'fa-graduation-cap'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ExamCountdown', examCountdownSchema);
