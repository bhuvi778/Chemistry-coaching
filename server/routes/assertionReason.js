const express = require('express');
const router = express.Router();
const assertionReasonController = require('../controllers/assertionReasonController');

// ============ FRONTEND ROUTES ============

// Get all chapters with progress
router.get('/chapters', assertionReasonController.getChaptersWithProgress);

// Get chapter details
router.get('/chapters/:chapterId', assertionReasonController.getChapterDetails);

// Get questions for practice
router.get('/chapters/:chapterId/questions', assertionReasonController.getQuestionsForPractice);

// Update question progress
router.post('/progress/:questionId', assertionReasonController.updateQuestionProgress);

// ============ ADMIN ROUTES ============

// Chapter management
router.get('/admin/chapters', assertionReasonController.getChaptersAdmin);
router.post('/admin/chapters', assertionReasonController.createChapter);
router.put('/admin/chapters/:chapterId', assertionReasonController.updateChapter);
router.delete('/admin/chapters/:chapterId', assertionReasonController.deleteChapter);

// Question management
router.get('/admin/chapters/:chapterId/questions', assertionReasonController.getQuestionsAdmin);
router.post('/admin/questions', assertionReasonController.createQuestion);
router.put('/admin/questions/:questionId', assertionReasonController.updateQuestion);
router.delete('/admin/questions/:questionId', assertionReasonController.deleteQuestion);

module.exports = router;
