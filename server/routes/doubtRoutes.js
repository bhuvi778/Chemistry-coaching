const express = require('express');
const router = express.Router();
const { getPublishedDoubts, getDoubts, createDoubt, updateDoubt, deleteDoubt, addReaction } = require('../controllers/doubtController');

router.get('/published', getPublishedDoubts);
router.get('/', getDoubts);
router.post('/', createDoubt);
router.put('/:id', updateDoubt);
router.delete('/:id', deleteDoubt);
router.post('/:id/reaction', addReaction);

module.exports = router;
