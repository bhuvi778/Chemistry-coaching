const express = require('express');
const router = express.Router();
const { getFeedback, createFeedback, deleteFeedback } = require('../controllers/feedbackController');

router.get('/', getFeedback);
router.post('/', createFeedback);
router.delete('/:id', deleteFeedback);

module.exports = router;
