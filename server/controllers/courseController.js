const Course = require('../models/Course');

let clearCache = () => {};
const setClearCacheFunction = (fn) => { clearCache = fn; };

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    clearCache('courses');
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    clearCache('courses');
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    clearCache('courses');
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourses, createCourse, updateCourse, deleteCourse, setClearCacheFunction };
