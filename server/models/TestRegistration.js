const mongoose = require('mongoose');

const testRegistrationSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PracticeTest',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    hasAttempted: {
        type: Boolean,
        default: false
    },
    attemptedAt: {
        type: Date
    }
});

// Index for faster queries
testRegistrationSchema.index({ testId: 1, email: 1 });

module.exports = mongoose.model('TestRegistration', testRegistrationSchema);
