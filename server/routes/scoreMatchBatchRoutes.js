const express = require('express');
const router = express.Router();
const {
    getScoreMatchBatches,
    createScoreMatchBatch,
    updateScoreMatchBatch,
    deleteScoreMatchBatch
} = require('../controllers/scoreMatchBatchController');

router.get('/', getScoreMatchBatches);
router.post('/', createScoreMatchBatch);
router.put('/:id', updateScoreMatchBatch);
router.delete('/:id', deleteScoreMatchBatch);

module.exports = router;
