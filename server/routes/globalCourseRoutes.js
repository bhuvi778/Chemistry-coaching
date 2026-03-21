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

// Admin routes (must be before /:id to prevent /admin being captured as an id)
router.get('/admin/all', getAllGlobalCoursesAdmin);

router.get('/:id', getGlobalCourseById);
router.post('/admin', createGlobalCourse);
router.put('/admin/:id', updateGlobalCourse);
router.delete('/admin/:id', deleteGlobalCourse);

module.exports = router;
