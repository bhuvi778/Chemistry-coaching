const express = require('express');
const router = express.Router();
const {
  getLeads,
  createLead,
  deleteLead,
  getPopupSettings,
  updatePopupSettings
} = require('../controllers/leadCaptureController');

// Lead capture submissions
router.get('/leads', getLeads);
router.post('/leads', createLead);
router.delete('/leads/:id', deleteLead);

// Popup settings
router.get('/settings', getPopupSettings);
router.put('/settings', updatePopupSettings);

module.exports = router;
