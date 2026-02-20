const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const PYQChapter = require('../models/PYQChapter');
const PYQTopic = require('../models/PYQTopic');
const PYQQuestion = require('../models/PYQQuestion');
const PYQProgress = require('../models/PYQProgress');
const PYQErrorReport = require('../models/PYQErrorReport');
const { clearCache } = require('../middleware/cache');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// ==================== CHAPTER ROUTES ====================

// Get all chapters (with optional filters)
router.get('/chapters', async (req, res) => {
    try {
        const { examName, subject, isActive, userId } = req.query;
        const filter = {};

        if (examName) filter.examName = examName;
        if (subject) filter.subject = subject;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const chapters = await PYQChapter.find(filter).sort({ order: 1, chapterNumber: 1 });

        // Enrich chapters with question counts, topic counts, and user progress
        const enrichedChapters = await Promise.all(chapters.map(async (chapter) => {
            const topicCount = await PYQTopic.countDocuments({ chapterId: chapter._id, isActive: true });
            const questionCount = await PYQQuestion.countDocuments({ chapterId: chapter._id, isActive: true });

            let attemptedCount = 0;
            let progress = 0;

            // If userId is provided, calculate progress
            if (userId) {
                const questions = await PYQQuestion.find({ chapterId: chapter._id, isActive: true }).select('_id');
                const questionIds = questions.map(q => q._id);

                if (questionIds.length > 0) {
                    attemptedCount = await PYQProgress.countDocuments({
                        userId: userId,
                        questionId: { $in: questionIds }
                    });

                    progress = questionCount > 0 ? Math.round((attemptedCount / questionCount) * 100) : 0;
                }
            }

            return {
                ...chapter.toObject(),
                topicCount,
                questionCount,
                attemptedCount,
                unattemptedCount: questionCount - attemptedCount,
                progress
            };
        }));

        res.json(enrichedChapters);
    } catch (error) {
        console.error('Error fetching PYQ chapters:', error);
        res.status(500).json({ error: 'Failed to fetch chapters' });
    }
});

// Get chapter by ID
router.get('/chapters/:id', async (req, res) => {
    try {
        const chapter = await PYQChapter.findById(req.params.id);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }
        res.json(chapter);
    } catch (error) {
        console.error('Error fetching chapter:', error);
        res.status(500).json({ error: 'Failed to fetch chapter' });
    }
});

// Create new chapter
router.post('/chapters', async (req, res) => {
    try {
        const chapter = new PYQChapter(req.body);
        await chapter.save();
        clearCache('pyq');
        res.status(201).json(chapter);
    } catch (error) {
        console.error('Error creating chapter:', error);
        res.status(500).json({ error: 'Failed to create chapter' });
    }
});

// Update chapter
router.put('/chapters/:id', async (req, res) => {
    try {
        req.body.updatedAt = Date.now();
        const chapter = await PYQChapter.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        clearCache('pyq');
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }
        res.json(chapter);
    } catch (error) {
        console.error('Error updating chapter:', error);
        res.status(500).json({ error: 'Failed to update chapter' });
    }
});

// Delete chapter
router.delete('/chapters/:id', async (req, res) => {
    try {
        const chapter = await PYQChapter.findByIdAndDelete(req.params.id);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        // Also delete associated topics and questions
        await PYQTopic.deleteMany({ chapterId: req.params.id });
        await PYQQuestion.deleteMany({ chapterId: req.params.id });
        await PYQProgress.deleteMany({ chapterId: req.params.id });

        clearCache('pyq');
        res.json({ message: 'Chapter and associated data deleted successfully' });
    } catch (error) {
        console.error('Error deleting chapter:', error);
        res.status(500).json({ error: 'Failed to delete chapter' });
    }
});

// ==================== TOPIC ROUTES ====================

// Get topics by chapter
router.get('/topics/chapter/:chapterId', async (req, res) => {
    try {
        const { userId } = req.query;
        const topics = await PYQTopic.find({
            chapterId: req.params.chapterId,
            isActive: true
        }).sort({ order: 1 });

        // Enrich topics with question counts and user progress
        const enrichedTopics = await Promise.all(topics.map(async (topic) => {
            const questionCount = await PYQQuestion.countDocuments({ topicId: topic._id, isActive: true });

            let attemptedCount = 0;
            let progress = 0;

            // If userId is provided, calculate progress
            if (userId) {
                const questions = await PYQQuestion.find({ topicId: topic._id, isActive: true }).select('_id');
                const questionIds = questions.map(q => q._id);

                if (questionIds.length > 0) {
                    attemptedCount = await PYQProgress.countDocuments({
                        userId: userId,
                        questionId: { $in: questionIds }
                    });

                    progress = questionCount > 0 ? Math.round((attemptedCount / questionCount) * 100) : 0;
                }
            }

            return {
                ...topic.toObject(),
                questionCount,
                attemptedCount,
                unattemptedCount: questionCount - attemptedCount,
                progress
            };
        }));

        res.json(enrichedTopics);
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
});

// Get topic by ID
router.get('/topics/:id', async (req, res) => {
    try {
        const topic = await PYQTopic.findById(req.params.id).populate('chapterId');
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        res.json(topic);
    } catch (error) {
        console.error('Error fetching topic:', error);
        res.status(500).json({ error: 'Failed to fetch topic' });
    }
});

// Create new topic
router.post('/topics', async (req, res) => {
    try {
        const topic = new PYQTopic(req.body);
        await topic.save();
        clearCache('pyq');
        res.status(201).json(topic);
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({ error: 'Failed to create topic' });
    }
});

// Update topic
router.put('/topics/:id', async (req, res) => {
    try {
        req.body.updatedAt = Date.now();
        const topic = await PYQTopic.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        clearCache('pyq');
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        res.json(topic);
    } catch (error) {
        console.error('Error updating topic:', error);
        res.status(500).json({ error: 'Failed to update topic' });
    }
});

// Delete topic
router.delete('/topics/:id', async (req, res) => {
    try {
        const topic = await PYQTopic.findByIdAndDelete(req.params.id);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }

        // Also delete associated questions
        await PYQQuestion.deleteMany({ topicId: req.params.id });
        await PYQProgress.deleteMany({ topicId: req.params.id });

        clearCache('pyq');
        res.json({ message: 'Topic and associated questions deleted successfully' });
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({ error: 'Failed to delete topic' });
    }
});

// ==================== QUESTION ROUTES ====================

// Get questions with filters
router.get('/questions', async (req, res) => {
    try {
        const { chapterId, topicId, examName, examYear, subject, difficulty, questionType, isActive } = req.query;
        const filter = {};

        if (chapterId) filter.chapterId = chapterId;
        if (topicId) filter.topicId = topicId;
        if (examName) filter.examName = examName;
        if (examYear) filter.examYear = parseInt(examYear);
        if (subject) filter.subject = subject;
        if (difficulty) filter.difficulty = difficulty;
        if (questionType) filter.questionType = questionType;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const questions = await PYQQuestion.find(filter)
            .populate('chapterId')
            .populate('topicId')
            .sort({ examYear: -1, order: 1 });

        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// Get question by ID
router.get('/questions/:id', async (req, res) => {
    try {
        const question = await PYQQuestion.findById(req.params.id)
            .populate('chapterId')
            .populate('topicId');

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Failed to fetch question' });
    }
});

// Create new question (with image upload)
router.post('/questions', upload.fields([
    { name: 'questionImage', maxCount: 1 },
    { name: 'solutionImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const questionData = {
            ...req.body,
            options: req.body.options ? JSON.parse(req.body.options) : [],
            tags: req.body.tags ? JSON.parse(req.body.tags) : []
        };

        if (req.files) {
            if (req.files.questionImage) {
                questionData.questionImage = '/uploads/' + req.files.questionImage[0].filename;
            }
            if (req.files.solutionImage) {
                questionData.solutionImage = '/uploads/' + req.files.solutionImage[0].filename;
            }
        }

        const question = new PYQQuestion(questionData);
        await question.save();
        clearCache('pyq');
        res.status(201).json(question);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Failed to create question', details: error.message });
    }
});

// Update question
router.put('/questions/:id', upload.fields([
    { name: 'questionImage', maxCount: 1 },
    { name: 'solutionImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            updatedAt: Date.now()
        };

        if (req.body.options && typeof req.body.options === 'string') {
            updateData.options = JSON.parse(req.body.options);
        }
        if (req.body.tags && typeof req.body.tags === 'string') {
            updateData.tags = JSON.parse(req.body.tags);
        }

        if (req.files) {
            if (req.files.questionImage) {
                updateData.questionImage = '/uploads/' + req.files.questionImage[0].filename;
            }
            if (req.files.solutionImage) {
                updateData.solutionImage = '/uploads/' + req.files.solutionImage[0].filename;
            }
        }

        const question = await PYQQuestion.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        clearCache('pyq');

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Failed to update question' });
    }
});

// Delete question
router.delete('/questions/:id', async (req, res) => {
    try {
        const question = await PYQQuestion.findByIdAndDelete(req.params.id);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Delete associated progress
        await PYQProgress.deleteMany({ questionId: req.params.id });

        clearCache('pyq');
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

// ==================== PROGRESS ROUTES ====================

// Get user progress
router.get('/progress/:userId', async (req, res) => {
    try {
        const { chapterId, topicId, status } = req.query;
        const filter = { userId: req.params.userId };

        if (chapterId) filter.chapterId = chapterId;
        if (topicId) filter.topicId = topicId;
        if (status) filter.status = status;

        const progress = await PYQProgress.find(filter)
            .populate('questionId')
            .populate('chapterId')
            .populate('topicId');

        res.json(progress);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

// Update or create progress
router.post('/progress', async (req, res) => {
    try {
        const { userId, questionId, status, userAnswer, timeSpent } = req.body;

        let progress = await PYQProgress.findOne({ userId, questionId });

        if (progress) {
            // Update existing progress
            progress.status = status;
            progress.userAnswer = userAnswer;
            progress.attempts += 1;
            progress.timeSpent += timeSpent || 0;
            progress.lastAttemptedAt = Date.now();
            progress.isCompleted = status === 'Correct' || status === 'Partially Correct';
            progress.updatedAt = Date.now();
        } else {
            // Create new progress
            progress = new PYQProgress({
                ...req.body,
                attempts: 1,
                lastAttemptedAt: Date.now(),
                isCompleted: status === 'Correct' || status === 'Partially Correct'
            });
        }

        await progress.save();
        res.json(progress);
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ error: 'Failed to update progress' });
    }
});

// Get general statistics (for admin panel)
router.get('/stats', async (req, res) => {
    try {
        const chapters = await PYQChapter.countDocuments();
        const topics = await PYQTopic.countDocuments();
        const questions = await PYQQuestion.countDocuments();

        res.json({
            chapters,
            topics,
            questions
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Get statistics
router.get('/stats/:userId', async (req, res) => {
    try {
        const { examName, subject, chapterId } = req.query;
        const filter = { userId: req.params.userId };

        if (chapterId) filter.chapterId = chapterId;

        const progress = await PYQProgress.find(filter);

        const stats = {
            total: progress.length,
            correct: progress.filter(p => p.status === 'Correct').length,
            incorrect: progress.filter(p => p.status === 'Incorrect').length,
            partiallyCorrect: progress.filter(p => p.status === 'Partially Correct').length,
            unattempted: progress.filter(p => p.status === 'Unattempted').length,
            accuracy: 0,
            totalTimeSpent: progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0)
        };

        if (stats.total > 0) {
            stats.accuracy = Math.round(((stats.correct + stats.partiallyCorrect * 0.5) / stats.total) * 100);
        }

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// ==================== ERROR REPORT ROUTES ====================

// Submit error report
router.post('/error-reports', async (req, res) => {
    try {
        const errorReport = new PYQErrorReport(req.body);
        await errorReport.save();

        const populatedReport = await PYQErrorReport.findById(errorReport._id)
            .populate({
                path: 'questionId',
                populate: [
                    { path: 'chapterId' },
                    { path: 'topicId' }
                ]
            });

        res.status(201).json(populatedReport);
    } catch (error) {
        console.error('Error submitting error report:', error);
        res.status(400).json({ error: error.message });
    }
});

// Get all error reports with filters
router.get('/error-reports', async (req, res) => {
    try {
        const { status, questionId } = req.query;

        let filter = {};
        if (status) filter.status = status;
        if (questionId) filter.questionId = questionId;

        const reports = await PYQErrorReport.find(filter)
            .populate({
                path: 'questionId',
                populate: [
                    { path: 'chapterId' },
                    { path: 'topicId' }
                ]
            })
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (error) {
        console.error('Error fetching error reports:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single error report
router.get('/error-reports/:id', async (req, res) => {
    try {
        const report = await PYQErrorReport.findById(req.params.id)
            .populate({
                path: 'questionId',
                populate: [
                    { path: 'chapterId' },
                    { path: 'topicId' }
                ]
            });

        if (!report) {
            return res.status(404).json({ error: 'Error report not found' });
        }

        res.json(report);
    } catch (error) {
        console.error('Error fetching error report:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update error report status
router.put('/error-reports/:id', async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            updatedAt: Date.now()
        };

        const report = await PYQErrorReport.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate({
            path: 'questionId',
            populate: [
                { path: 'chapterId' },
                { path: 'topicId' }
            ]
        });

        if (!report) {
            return res.status(404).json({ error: 'Error report not found' });
        }

        res.json(report);
    } catch (error) {
        console.error('Error updating error report:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete error report
router.delete('/error-reports/:id', async (req, res) => {
    try {
        const report = await PYQErrorReport.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Error report not found' });
        }
        res.json({ message: 'Error report deleted successfully' });
    } catch (error) {
        console.error('Error deleting error report:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

