const express = require('express');
const router = express.Router();
const { getMagazines, createMagazine, updateMagazine, deleteMagazine } = require('../controllers/magazineController');

router.get('/', getMagazines);
router.post('/', createMagazine);
router.put('/:id', updateMagazine);
router.delete('/:id', deleteMagazine);

module.exports = router;
