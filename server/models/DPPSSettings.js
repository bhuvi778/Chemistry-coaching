const mongoose = require('mongoose');

const dppsSettingsSchema = new mongoose.Schema({
    pageDescription: {
        type: String,
        default: 'Daily Practice Problem Sets (DPPS) help you build consistency and strengthen your concepts through regular practice. Solve curated questions daily to track your progress and improve your problem-solving skills.'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DPPSSettings', dppsSettingsSchema);
