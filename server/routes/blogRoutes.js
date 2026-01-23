const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Frontend Routes
router.get('/', blogController.getAllBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.get('/related/:slug', blogController.getRelatedBlogs);

// Admin Routes
router.get('/admin/all', blogController.getAllBlogsAdmin);
router.get('/admin/stats', blogController.getBlogStats);
router.get('/admin/:id', blogController.getBlogById);
router.post('/admin', blogController.createBlog);
router.put('/admin/:id', blogController.updateBlog);
router.delete('/admin/:id', blogController.deleteBlog);
router.patch('/admin/:id/toggle-publish', blogController.togglePublishStatus);

module.exports = router;
