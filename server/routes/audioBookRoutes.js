const express = require('express');
const router = express.Router();
const { getAudioBooks, getAudioBookById, createAudioBook, updateAudioBook, deleteAudioBook } = require('../controllers/audioBookController');

router.get('/', getAudioBooks);
router.get('/:id', getAudioBookById);
router.post('/', createAudioBook);
router.put('/:id', updateAudioBook);
router.delete('/:id', deleteAudioBook);

module.exports = router;
