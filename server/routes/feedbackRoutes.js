const express = require('express');
const router = express.Router();
const { getAllFeedback, createFeedback, deleteFeedback } = require('../controllers/feedbackController');

router.get('/', getAllFeedback);
router.post('/', createFeedback);
router.delete('/:id', deleteFeedback);

module.exports = router;
