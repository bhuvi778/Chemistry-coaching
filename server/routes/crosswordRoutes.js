const express = require('express');
const router = express.Router();
const { getCrosswords, getCrosswordById, createCrossword, updateCrossword, deleteCrossword } = require('../controllers/crosswordController');

router.get('/', getCrosswords);
router.get('/:id', getCrosswordById);
router.post('/', createCrossword);
router.put('/:id', updateCrossword);
router.delete('/:id', deleteCrossword);

module.exports = router;
