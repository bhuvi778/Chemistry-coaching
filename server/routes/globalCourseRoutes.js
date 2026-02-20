const express = require('express');
const router = express.Router();
const {
    getAllGlobalCourses,
    getGlobalCourseById,
    getAllGlobalCoursesAdmin,
    createGlobalCourse,
    updateGlobalCourse,
    deleteGlobalCourse
} = require('../controllers/globalCourseController');

// Public routes
router.get('/', getAllGlobalCourses);
router.get('/:id', getGlobalCourseById);

// Admin routes
router.get('/admin/all', getAllGlobalCoursesAdmin);
router.post('/admin', createGlobalCourse);
router.put('/admin/:id', updateGlobalCourse);
router.delete('/admin/:id', deleteGlobalCourse);

module.exports = router;
