const express = require('express');
const router = express.Router();
const flashCardController = require('../controllers/flashCardController');

// Export route
router.get('/export', flashCardController.exportFlashCards);

// Chapter routes
router.get('/chapters', flashCardController.getChaptersWithProgress);
router.get('/chapters/:id', flashCardController.getChapterById);
router.post('/chapters', flashCardController.createChapter);
router.put('/chapters/:id', flashCardController.updateChapter);
router.delete('/chapters/:id', flashCardController.deleteChapter);

// Topic routes
router.get('/chapters/:chapterId/topics', flashCardController.getTopicsByChapterWithProgress);
router.post('/topics', flashCardController.createTopic);
router.put('/topics/:id', flashCardController.updateTopic);
router.delete('/topics/:id', flashCardController.deleteTopic);

// Card routes
router.get('/topics/:topicId/cards', flashCardController.getCardsByTopic);
router.post('/cards/by-topics', flashCardController.getCardsByTopics);
router.post('/cards', flashCardController.createCard);
router.put('/cards/:id', flashCardController.updateCard);
router.delete('/cards/:id', flashCardController.deleteCard);

// Progress routes
router.get('/chapters/:chapterId/progress', flashCardController.getChapterProgress);
router.get('/topics/:topicId/progress', flashCardController.getTopicProgress);
router.post('/cards/:cardId/progress', flashCardController.updateCardProgress);

// Stats routes
router.get('/chapters/:chapterId/stats', flashCardController.getChapterStats);

module.exports = router;
