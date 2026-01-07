const express = require('express');
const router = express.Router();
const {
    getActiveCountdown,
    getAllCountdowns,
    createCountdown,
    updateCountdown,
    deleteCountdown
} = require('../controllers/examCountdownController');

// Public route - get active countdown
router.get('/active', getActiveCountdown);

// Admin routes
router.get('/', getAllCountdowns);
router.post('/', createCountdown);
router.put('/:id', updateCountdown);
router.delete('/:id', deleteCountdown);

module.exports = router;
