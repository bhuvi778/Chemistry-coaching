const mongoose = require('mongoose');

const dppsTestSessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DPPSChapter',
        required: true
    },
    classLevel: {
        type: String,
        enum: ['11', '12'],
        required: true
    },
    difficultyLevel: {
        type: String,
        enum: ['Easy', 'Medium', 'Tough'],
        required: true
    },
    questions: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DPPSQuestion'
        },
        selectedAnswer: String,
        isCorrect: Boolean,
        timeSpent: Number, // in seconds
        isAttempted: {
            type: Boolean,
            default: false
        }
    }],
    timeLimit: {
        type: Number, // in minutes
        required: true
    },
    startTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    submittedAt: {
        type: Date
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    isAutoSubmitted: {
        type: Boolean,
        default: false
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    attemptedQuestions: {
        type: Number,
        default: 0
    },
    correctAnswers: {
        type: Number,
        default: 0
    },
    incorrectAnswers: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    negativeScore: {
        type: Number,
        default: 0
    },
    totalMarks: {
        type: Number,
        default: 0
    },
    percentage: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for faster queries
dppsTestSessionSchema.index({ userId: 1, chapterId: 1 });
dppsTestSessionSchema.index({ userId: 1, isCompleted: 1 });
dppsTestSessionSchema.index({ classLevel: 1, difficultyLevel: 1 });

// Method to calculate results
dppsTestSessionSchema.methods.calculateResults = function () {
    this.totalQuestions = this.questions.length;
    this.attemptedQuestions = this.questions.filter(q => q.isAttempted).length;
    this.correctAnswers = this.questions.filter(q => q.isCorrect === true).length;
    this.incorrectAnswers = this.attemptedQuestions - this.correctAnswers;

    // Calculate marks with negative marking
    let positiveMarks = 0;
    let negativeMarks = 0;
    const maxMarks = this.questions.reduce((sum, q) => {
        const qData = q.questionId;
        return sum + (qData?.marks || 1);
    }, 0);

    this.questions.forEach(q => {
        const qData = q.questionId;
        if (q.isCorrect === true) {
            positiveMarks += (qData?.marks || 1);
        } else if (q.isAttempted && q.isCorrect === false) {
            negativeMarks += (qData?.negativeMarks || 0);
        }
    });

    this.negativeScore = negativeMarks;
    this.totalMarks = maxMarks;
    this.score = Math.max(0, positiveMarks - negativeMarks);
    this.percentage = maxMarks > 0
        ? Math.round((this.score / maxMarks) * 100)
        : 0;
};

// Method to check if test time has expired
dppsTestSessionSchema.methods.isTimeExpired = function () {
    if (!this.startTime || !this.timeLimit) return false;
    const now = new Date();
    const elapsedMinutes = (now - this.startTime) / (1000 * 60);
    return elapsedMinutes >= this.timeLimit;
};

module.exports = mongoose.model('DPPSTestSession', dppsTestSessionSchema);
