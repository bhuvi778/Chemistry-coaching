const mongoose = require('mongoose');

const popupSettingsSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true
  },
  delaySeconds: {
    type: Number,
    default: 45
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PopupSettings', popupSettingsSchema);
