const GlobalCourse = require('../models/GlobalCourse');

// Cache clearing function
let clearCache = () => { console.log('Cache clear function not initialized'); };

const setClearCacheFunction = (fn) => {
    clearCache = fn;
};

// Get all global courses (public)
const getAllGlobalCourses = async (req, res) => {
    try {
        const courses = await GlobalCourse.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single global course
const getGlobalCourseById = async (req, res) => {
    try {
        const course = await GlobalCourse.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get all courses (including inactive)
const getAllGlobalCoursesAdmin = async (req, res) => {
    try {
        const courses = await GlobalCourse.find().sort({ order: 1, createdAt: -1 });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Create global course
const createGlobalCourse = async (req, res) => {
    const course = new GlobalCourse(req.body);
    try {
        const newCourse = await course.save();
        clearCache('global-courses');
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Admin: Update global course
const updateGlobalCourse = async (req, res) => {
    try {
        const course = await GlobalCourse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        clearCache('global-courses');
        res.json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Admin: Delete global course
const deleteGlobalCourse = async (req, res) => {
    try {
        const course = await GlobalCourse.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        clearCache('global-courses');
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllGlobalCourses,
    getGlobalCourseById,
    getAllGlobalCoursesAdmin,
    createGlobalCourse,
    updateGlobalCourse,
    deleteGlobalCourse,
    setClearCacheFunction
};
