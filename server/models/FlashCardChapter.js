const mongoose = require('mongoose');

const flashCardChapterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    icon: {
        type: String,
        default: 'fas fa-layer-group' // FontAwesome icon class
    },
    iconColor: {
        type: String,
        default: '#a855f7' // Purple color
    },
    subject: {
        type: String,
        default: 'Chemistry',
        enum: ['Chemistry', 'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry']
    },
    category: {
        type: String,
        enum: {
            values: ['Physical', 'Organic', 'Inorganic', ''],
            message: '{VALUE} is not a valid category'
        },
        trim: true
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

module.exports = mongoose.model('FlashCardChapter', flashCardChapterSchema);
