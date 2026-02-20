const express = require('express');
const router = express.Router();
const ntaAbhyasController = require('../controllers/ntaAbhyasController');

// Public routes
router.get('/chapters/:examCategory', ntaAbhyasController.getChapters);
router.get('/questions', ntaAbhyasController.getQuestions);
router.get('/stats', ntaAbhyasController.getStats);

// Admin routes (add authentication middleware as needed)
router.get('/admin/all', ntaAbhyasController.getAllQuestions);
router.post('/admin/create', ntaAbhyasController.createQuestion);
router.put('/admin/update/:id', ntaAbhyasController.updateQuestion);
router.delete('/admin/delete/:id', ntaAbhyasController.deleteQuestion);

module.exports = router;
