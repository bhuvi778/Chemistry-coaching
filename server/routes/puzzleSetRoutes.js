const express = require('express');
const router = express.Router();
const { getPuzzleSets, createPuzzleSet, updatePuzzleSet, deletePuzzleSet } = require('../controllers/puzzleSetController');

router.get('/', getPuzzleSets);
router.post('/', createPuzzleSet);
router.put('/:id', updatePuzzleSet);
router.delete('/:id', deletePuzzleSet);

module.exports = router;
