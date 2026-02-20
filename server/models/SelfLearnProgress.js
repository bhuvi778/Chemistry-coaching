const mongoose = require('mongoose');

const selfLearnProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        default: 'guest'
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SelfLearnChapter',
        required: true
    },
    examType: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    // Learn Progress
    learnProgress: {
        videosWatched: [{
            videoIndex: Number,
            watchedAt: Date,
            completed: Boolean
        }],
        notesViewed: [{
            noteIndex: Number,
            viewedAt: Date
        }],
        exercisesCompleted: [{
            exerciseIndex: Number,
            completedAt: Date
        }]
    },
    // Practice Progress
    practiceProgress: {
        dppsCompleted: [{
            dppIndex: Number,
            completedAt: Date,
            score: Number
        }],
        videoSolutionsWatched: [{
            videoIndex: Number,
            watchedAt: Date
        }]
    },
    // Revise Progress
    reviseProgress: {
        revisionClassesWatched: [{
            classIndex: Number,
            watchedAt: Date,
            completed: Boolean
        }],
        notesViewed: [{
            noteIndex: Number,
            viewedAt: Date
        }],
        mockTestsCompleted: [{
            testIndex: Number,
            completedAt: Date,
            score: Number
        }]
    },
    // Overall Progress
    overallProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
selfLearnProgressSchema.index({ userId: 1, chapterId: 1 }, { unique: true });
selfLearnProgressSchema.index({ userId: 1, examType: 1, subject: 1 });

module.exports = mongoose.model('SelfLearnProgress', selfLearnProgressSchema);
