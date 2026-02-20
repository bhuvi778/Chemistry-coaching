const mongoose = require('mongoose');

const selfLearnChapterSchema = new mongoose.Schema({
    examType: {
        type: String,
        required: true,
        enum: ['NEET', 'JEE', 'IAT/NEST']
    },
    subject: {
        type: String,
        required: true,
        enum: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Practical']
    },
    class: {
        type: String,
        required: true,
        enum: ['11', '12'],
        default: '11'
    },
    chapterName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    order: {
        type: Number,
        default: 0
    },
    icon: {
        type: String,
        default: 'fa-book'
    },
    color: {
        type: String,
        default: 'cyan'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Learn Section
    learn: {
        videoLectures: [{
            title: String,
            url: String,
            duration: String,
            order: Number
        }],
        classNotes: [{
            title: String,
            pdfUrl: String,
            order: Number
        }],
        exercises: [{
            title: String,
            pdfUrl: String,
            order: Number
        }]
    },
    // Practice Section
    practice: {
        dpps: [{
            title: String,
            dppId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'DPPSChapter'
            },
            order: Number
        }],
        dppVideoSolutions: [{
            title: String,
            url: String,
            order: Number
        }]
    },
    // Revise Section
    revise: {
        revisionClasses: [{
            title: String,
            url: String,
            duration: String,
            order: Number
        }],
        notes: [{
            title: String,
            pdfUrl: String,
            order: Number
        }],
        mockTests: [{
            title: String,
            testId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'PracticeTest'
            },
            order: Number
        }]
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

// Update timestamp on save
selfLearnChapterSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index for faster queries
selfLearnChapterSchema.index({ examType: 1, subject: 1, order: 1 });
selfLearnChapterSchema.index({ isActive: 1 });

module.exports = mongoose.model('SelfLearnChapter', selfLearnChapterSchema);
