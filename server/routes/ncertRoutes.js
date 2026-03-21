const express = require('express');
const router = express.Router();
const NCERTChapter = require('../models/NCERTChapter');
const NCERTTopic = require('../models/NCERTTopic');
const NCERTQuestion = require('../models/NCERTQuestion');
const NCERTBadge = require('../models/NCERTBadge');
const NCERTProgress = require('../models/NCERTProgress');
const NCERTErrorReport = require('../models/NCERTErrorReport');
const multer = require('multer');
const path = require('path');

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/ncert/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'ncert-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// ==================== CHAPTER ROUTES ====================

// Get all chapters by category
router.get('/chapters/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const chapters = await NCERTChapter.find({ category })
            .sort({ order: 1, chapterNumber: 1 });
        res.json(chapters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single chapter
router.get('/chapters/single/:id', async (req, res) => {
    try {
        const chapter = await NCERTChapter.findById(req.params.id);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }
        res.json(chapter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create chapter
router.post('/chapters', async (req, res) => {
    try {
        const chapter = new NCERTChapter(req.body);
        await chapter.save();
        res.status(201).json(chapter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update chapter
router.put('/chapters/:id', async (req, res) => {
    try {
        const chapter = await NCERTChapter.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }
        res.json(chapter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete chapter
router.delete('/chapters/:id', async (req, res) => {
    try {
        // Also delete associated topics and questions
        await NCERTTopic.deleteMany({ chapterId: req.params.id });
        await NCERTQuestion.deleteMany({ chapterId: req.params.id });

        const chapter = await NCERTChapter.findByIdAndDelete(req.params.id);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }
        res.json({ message: 'Chapter and associated data deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== TOPIC ROUTES ====================

// Get topics by chapter
router.get('/topics/chapter/:chapterId', async (req, res) => {
    try {
        const topics = await NCERTTopic.find({ chapterId: req.params.chapterId })
            .sort({ order: 1 });
        res.json(topics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single topic
router.get('/topics/:id', async (req, res) => {
    try {
        const topic = await NCERTTopic.findById(req.params.id)
            .populate('chapterId');
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        res.json(topic);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create topic
router.post('/topics', async (req, res) => {
    try {
        const topic = new NCERTTopic(req.body);
        await topic.save();
        res.status(201).json(topic);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update topic
router.put('/topics/:id', async (req, res) => {
    try {
        const topic = await NCERTTopic.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        res.json(topic);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete topic
router.delete('/topics/:id', async (req, res) => {
    try {
        // Also delete associated questions
        await NCERTQuestion.deleteMany({ topicId: req.params.id });

        const topic = await NCERTTopic.findByIdAndDelete(req.params.id);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        res.json({ message: 'Topic and associated questions deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== QUESTION ROUTES ====================

// Get questions with filters
router.get('/questions', async (req, res) => {
    try {
        const { category, chapterId, topicId, questionType, difficulty, badgeType, classLevel } = req.query;

        let filter = {};
        if (category) filter.category = category;
        if (chapterId) filter.chapterId = chapterId;
        if (topicId) filter.topicId = topicId;
        if (questionType) filter.questionType = questionType;
        if (difficulty) filter.difficulty = difficulty;
        if (badgeType) filter.badgeType = badgeType;
        if (classLevel) filter.classLevel = classLevel;

        const questions = await NCERTQuestion.find(filter)
            .populate('chapterId')
            .populate('topicId')
            .sort({ order: 1 });

        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single question
router.get('/questions/:id', async (req, res) => {
    try {
        const question = await NCERTQuestion.findById(req.params.id)
            .populate('chapterId')
            .populate('topicId');
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create question (with optional image upload)
router.post('/questions', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'solutionImage', maxCount: 1 }
]), async (req, res) => {
    try {
        // Helper to parse tags
        let tags = [];
        if (req.body.tags) {
            if (typeof req.body.tags === 'string') {
                try {
                    tags = JSON.parse(req.body.tags);
                } catch (e) {
                    tags = [];
                }
            } else if (Array.isArray(req.body.tags)) {
                tags = req.body.tags;
            }
        }

        // Helper to parse options
        let options = [];
        if (req.body.options) {
            if (typeof req.body.options === 'string') {
                try {
                    options = JSON.parse(req.body.options);
                } catch (e) {
                    options = [req.body.options];
                }
            } else if (Array.isArray(req.body.options)) {
                options = req.body.options;
            }
        }

        const questionData = {
            ...req.body,
            tags: tags,
            options: options
        };

        // Handle image uploads
        if (req.files?.image) {
            questionData.imageUrl = `/uploads/ncert/${req.files.image[0].filename}`;
        }
        if (req.files?.solutionImage) {
            questionData.solutionImageUrl = `/uploads/ncert/${req.files.solutionImage[0].filename}`;
        }

        const question = new NCERTQuestion(questionData);
        await question.save();

        const populatedQuestion = await NCERTQuestion.findById(question._id)
            .populate('chapterId')
            .populate('topicId');

        res.status(201).json(populatedQuestion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update question
router.put('/questions/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'solutionImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            updatedAt: Date.now()
        };

        if (req.body.tags && typeof req.body.tags === 'string') {
            updateData.tags = JSON.parse(req.body.tags);
        }

        if (req.body.options && typeof req.body.options === 'string') {
            try {
                updateData.options = JSON.parse(req.body.options);
            } catch (e) {
                // ignore or handle
            }
        }

        // Handle image uploads
        if (req.files?.image) {
            updateData.imageUrl = `/uploads/ncert/${req.files.image[0].filename}`;
        }
        if (req.files?.solutionImage) {
            updateData.solutionImageUrl = `/uploads/ncert/${req.files.solutionImage[0].filename}`;
        }

        const question = await NCERTQuestion.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('chapterId').populate('topicId');

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete question
router.delete('/questions/:id', async (req, res) => {
    try {
        const question = await NCERTQuestion.findByIdAndDelete(req.params.id);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== BADGE ROUTES ====================

// Get badges by category
router.get('/badges/:category', async (req, res) => {
    try {
        const badges = await NCERTBadge.find({
            category: req.params.category,
            isActive: true
        }).sort({ order: 1 });
        res.json(badges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create badge
router.post('/badges', async (req, res) => {
    try {
        const badge = new NCERTBadge(req.body);
        await badge.save();
        res.status(201).json(badge);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update badge
router.put('/badges/:id', async (req, res) => {
    try {
        const badge = await NCERTBadge.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!badge) {
            return res.status(404).json({ error: 'Badge not found' });
        }
        res.json(badge);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete badge
router.delete('/badges/:id', async (req, res) => {
    try {
        const badge = await NCERTBadge.findByIdAndDelete(req.params.id);
        if (!badge) {
            return res.status(404).json({ error: 'Badge not found' });
        }
        res.json({ message: 'Badge deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== PROGRESS ROUTES ====================

// Save progress
router.post('/progress', async (req, res) => {
    try {
        const { userId, questionId, chapterId, topicId, isCorrect } = req.body;

        const progress = await NCERTProgress.findOneAndUpdate(
            { userId, questionId },
            {
                chapterId,
                topicId,
                isCorrect,
                isCompleted: true,
                lastAttempted: Date.now()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json(progress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user progress
router.get('/progress/:userId', async (req, res) => {
    try {
        const progress = await NCERTProgress.find({ userId: req.params.userId });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== STATISTICS ROUTES ====================

// Get statistics for a category
router.get('/stats/:category', async (req, res) => {
    try {
        const { category } = req.params;

        let chapterCount, topicCount;
        const questionCount = await NCERTQuestion.countDocuments({ category });

        if (category === 'line-by-line') {
            chapterCount = await NCERTChapter.countDocuments({ category });
            topicCount = await NCERTTopic.countDocuments();
        } else {
            // For other categories, derive chapter/topic count from question references
            const distinctChapters = await NCERTQuestion.distinct('chapterId', { category });
            const distinctBadges = await NCERTQuestion.distinct('badgeType', { category });
            chapterCount = distinctChapters.filter(c => c && c.toString() !== '000000000000000000000000').length || distinctChapters.filter(Boolean).length;
            topicCount = distinctBadges.filter(Boolean).length;
        }

        res.json({
            chapters: chapterCount,
            questions: questionCount,
            topics: topicCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== ERROR REPORT ROUTES ====================

// Submit error report
router.post('/error-reports', async (req, res) => {
    try {
        const errorReport = new NCERTErrorReport(req.body);
        await errorReport.save();

        const populatedReport = await NCERTErrorReport.findById(errorReport._id)
            .populate({
                path: 'questionId',
                populate: [
                    { path: 'chapterId' },
                    { path: 'topicId' }
                ]
            });

        res.status(201).json(populatedReport);
    } catch (error) {
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

        const reports = await NCERTErrorReport.find(filter)
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
        res.status(500).json({ error: error.message });
    }
});

// Get single error report
router.get('/error-reports/:id', async (req, res) => {
    try {
        const report = await NCERTErrorReport.findById(req.params.id)
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

        const report = await NCERTErrorReport.findByIdAndUpdate(
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
        res.status(400).json({ error: error.message });
    }
});

// Delete error report
router.delete('/error-reports/:id', async (req, res) => {
    try {
        const report = await NCERTErrorReport.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Error report not found' });
        }
        res.json({ message: 'Error report deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
