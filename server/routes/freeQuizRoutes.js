const express = require('express');
const router = express.Router();
const freeQuizController = require('../controllers/freeQuizController');

// Get all quizzes
router.get('/', freeQuizController.getFreeQuizzes);

// Get single quiz (for full data like PDF content)
router.get('/:id', freeQuizController.getFreeQuizById);

// Create new quiz
router.post('/', freeQuizController.createFreeQuiz);

// Update existing quiz
router.patch('/:id', freeQuizController.updateFreeQuiz);

// Delete quiz
router.delete('/:id', freeQuizController.deleteFreeQuiz);

module.exports = router;
