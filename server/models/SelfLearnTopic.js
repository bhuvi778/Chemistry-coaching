const mongoose = require('mongoose');

const selfLearnTopicSchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SelfLearnChapter',
        required: true,
        index: true
    },
    topicName: {
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
    isActive: {
        type: Boolean,
        default: true
    },
    // Category for Learn/Practice/Revise tabs
    category: {
        type: String,
        enum: ['learn', 'practice', 'revise'],
        default: 'learn'
    },
    // Learn Section
    learn: {
        // Video Lectures from Bunny.net
        videos: [{
            title: String,
            bunnyUrl: String,  // Bunny.net video URL
            videoId: String,   // Bunny.net video ID
            duration: String,
            thumbnail: String,
            order: Number
        }],
        // Sheets (PDF view only)
        sheets: [{
            title: String,
            pdfUrl: String,
            description: String,
            order: Number
        }],
        // Exercises (MCQ Tests) - Grouped by exercise sets
        exercises: [{
            exerciseName: {
                type: String,
                required: true
            },
            description: String,
            order: {
                type: Number,
                default: 0
            },
            questions: [{
                question: {
                    type: String,
                    required: true
                },
                options: [{
                    type: String,
                    required: true
                }],
                correctAnswer: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 3
                },
                explanation: {
                    type: String
                },
                difficulty: {
                    type: String,
                    enum: ['Easy', 'Medium', 'Hard'],
                    default: 'Medium'
                },
                marks: {
                    type: Number,
                    default: 4
                },
                negativeMarks: {
                    type: Number,
                    default: 1
                },
                order: Number
            }]
        }]
    },
    // Legacy questions field (keeping for backwards compatibility)
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        correctAnswer: {
            type: Number,
            required: true,
            min: 0,
            max: 3
        },
        explanation: {
            type: String
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Medium'
        },
        marks: {
            type: Number,
            default: 4
        },
        negativeMarks: {
            type: Number,
            default: 1
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    // Statistics
    questionCount: {
        type: Number,
        default: 0
    },
    videoCount: {
        type: Number,
        default: 0
    },
    sheetCount: {
        type: Number,
        default: 0
    },
    exerciseCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Update counts and timestamp before save
selfLearnTopicSchema.pre('save', function (next) {
    this.questionCount = this.questions?.length || 0;
    this.videoCount = this.learn?.videos?.length || 0;
    this.sheetCount = this.learn?.sheets?.length || 0;
    // Count total questions across all exercise sets
    this.exerciseCount = this.learn?.exercises?.reduce((total, exercise) => {
        return total + (exercise.questions?.length || 0);
    }, 0) || 0;
    this.updatedAt = Date.now();
    next();
});

// Indexes
selfLearnTopicSchema.index({ chapterId: 1, order: 1 });
selfLearnTopicSchema.index({ isActive: 1 });

module.exports = mongoose.model('SelfLearnTopic', selfLearnTopicSchema);
