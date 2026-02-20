const mongoose = require('mongoose');

const pyqErrorReportSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PYQQuestion',
        required: true
    },
    errorType: {
        type: String,
        required: true,
        enum: [
            'Wrong/Unclear Question',
            'Wrong/Unclear Option(s)',
            'Wrong/Blury/No Images(s)',
            'Incorrect Answer Key',
            'Wrong/Unclear Solution'
        ]
    },
    additionalDetails: {
        type: String,
        trim: true,
        default: ''
    },
    reporterName: {
        type: String,
        required: true,
        trim: true
    },
    reporterEmail: {
        type: String,
        required: true,
        trim: true
    },
    reporterMobile: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'rejected'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for faster queries
pyqErrorReportSchema.index({ questionId: 1 });
pyqErrorReportSchema.index({ status: 1 });
pyqErrorReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PYQErrorReport', pyqErrorReportSchema);
