const express = require('express');
const router = express.Router();
const {
    getSubjects,
    getChaptersBySubject,
    getChapterDetails,
    getChapterById,
    getAllChapters,
    createChapter,
    updateChapter,
    deleteChapter,
    createTopic,
    updateTopic,
    deleteTopic,
    getTopicWithConcepts
} = require('../controllers/conceptNoteController');

// Public routes
router.get('/subjects', getSubjects);
router.get('/subjects/:subject/chapters', getChaptersBySubject);
router.get('/subjects/:subject/chapters/:chapterName', getChapterDetails);

// Public routes - Topics with Concepts
router.get('/topics/:topicId', getTopicWithConcepts);

// Admin routes - Chapters
router.get('/admin/all', getAllChapters);
router.get('/admin/:id', getChapterById);
router.post('/admin', createChapter);
router.put('/admin/:id', updateChapter);
router.delete('/admin/:id', deleteChapter);

// Admin routes - Topics
router.post('/admin/chapters/:chapterId/topics', createTopic);
router.put('/admin/topics/:id', updateTopic);
router.delete('/admin/topics/:id', deleteTopic);

module.exports = router;


