const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Public Routes
router.post('/', commentController.createComment);
router.get('/blog/:blogId', commentController.getBlogComments);

// Admin Routes
router.get('/admin/all', commentController.getAllCommentsAdmin);
router.get('/admin/stats', commentController.getCommentStats);
router.patch('/admin/:id/approve', commentController.approveComment);
router.delete('/admin/:id', commentController.deleteComment);

module.exports = router;
