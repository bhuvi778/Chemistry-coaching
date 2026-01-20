const express = require('express');
const router = express.Router();
const practiceTestController = require('../controllers/practiceTestController');

// ============ FRONTEND ROUTES ============

// Get all active tests
router.get('/tests', practiceTestController.getAllTests);

// Get test by ID with questions
router.get('/tests/:testId', practiceTestController.getTestById);

// Submit test
router.post('/tests/:testId/submit', practiceTestController.submitTest);

// Get user results
router.get('/results', practiceTestController.getUserResults);

// ============ REGISTRATION ROUTES ============

// Register for a test
router.post('/tests/:testId/register', practiceTestController.registerForTest);

// Check registration status
router.get('/tests/:testId/registration', practiceTestController.checkRegistration);


// ============ ADMIN ROUTES ============

// Test management
router.get('/admin/tests', practiceTestController.getAllTestsAdmin);
router.post('/admin/tests', practiceTestController.createTest);
router.put('/admin/tests/:testId', practiceTestController.updateTest);
router.delete('/admin/tests/:testId', practiceTestController.deleteTest);

// Question management
router.get('/admin/tests/:testId/questions', practiceTestController.getQuestionsAdmin);
router.post('/admin/questions', practiceTestController.createQuestion);
router.put('/admin/questions/:questionId', practiceTestController.updateQuestion);
router.delete('/admin/questions/:questionId', practiceTestController.deleteQuestion);

// Registration management
router.get('/admin/registrations', practiceTestController.getAllRegistrations);
router.get('/admin/tests/:testId/registrations', practiceTestController.getTestRegistrations);
router.delete('/admin/registrations/:registrationId', practiceTestController.deleteRegistration);

module.exports = router;


