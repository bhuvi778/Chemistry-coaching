const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

// Public Routes
router.get('/', faqController.getActiveFAQs);
router.get('/category/:category', faqController.getFAQsByCategory);
router.get('/blog/:blogId', faqController.getFAQsForBlog);
router.patch('/:id/view', faqController.incrementFAQView);

// Admin Routes
router.get('/admin/all', faqController.getAllFAQsAdmin);
router.get('/admin/stats', faqController.getFAQStats);
router.post('/admin', faqController.createFAQ);
router.put('/admin/:id', faqController.updateFAQ);
router.delete('/admin/:id', faqController.deleteFAQ);

module.exports = router;
