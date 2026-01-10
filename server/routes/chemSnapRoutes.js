const express = require('express');
const router = express.Router();
const chemSnapController = require('../controllers/chemSnapController');

// Public routes
router.get('/', chemSnapController.getAllChemSnaps);
router.get('/chapters/list', chemSnapController.getChemSnapChapters);
router.get('/:id', chemSnapController.getChemSnapById);

// Admin routes
router.post('/', chemSnapController.createChemSnap);
router.put('/:id', chemSnapController.updateChemSnap);
router.delete('/:id', chemSnapController.deleteChemSnap);

module.exports = router;
