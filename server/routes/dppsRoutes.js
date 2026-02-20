const express = require('express');
const router = express.Router();
const DPPSChapter = require('../models/DPPSChapter');
const DPPSQuestion = require('../models/DPPSQuestion');
const DPPSProgress = require('../models/DPPSProgress');
const DPPSSettings = require('../models/DPPSSettings');
const DPPSTestSession = require('../models/DPPSTestSession');
const multer = require('multer');
const path = require('path');

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/dpps/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'dpps-' + uniqueSuffix + path.extname(file.originalname));
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

// ==================== SETTINGS ROUTES ====================

// Get DPPS settings
router.get('/settings', async (req, res) => {
    try {
        let settings = await DPPSSettings.findOne();
        if (!settings) {
            settings = await DPPSSettings.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update DPPS settings
router.put('/settings', async (req, res) => {
    try {
        let settings = await DPPSSettings.findOne();
        if (!settings) {
            settings = await DPPSSettings.create(req.body);
        } else {
            settings.pageDescription = req.body.pageDescription || settings.pageDescription;
            settings.isActive = req.body.isActive !== undefined ? req.body.isActive : settings.isActive;
            settings.updatedAt = Date.now();
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== CHAPTER ROUTES ====================

// Get all chapters (with optional class and difficulty filter)
router.get('/chapters', async (req, res) => {
    try {
        const { classLevel, difficultyLevel, isActive, subject } = req.query;

        let filter = {};
        if (classLevel) filter.classLevel = classLevel;
        if (difficultyLevel) filter.difficultyLevel = difficultyLevel;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (subject) filter.subject = subject;

        const chapters = await DPPSChapter.find(filter)
            .sort({ order: 1, createdAt: -1 });

        // Add question count to each chapter
        const chaptersWithCounts = await Promise.all(
            chapters.map(async (chapter) => {
                const questionCount = await DPPSQuestion.countDocuments({
                    chapterId: chapter._id,
                    isActive: true
                });
                return {
                    ...chapter.toObject(),
                    questionCount
                };
            })
        );

        res.json(chaptersWithCounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single chapter
router.get('/chapters/:id', async (req, res) => {
    try {
        const chapter = await DPPSChapter.findById(req.params.id);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }
        const questionCount = await DPPSQuestion.countDocuments({
            chapterId: chapter._id,
            isActive: true
        });
        res.json({ ...chapter.toObject(), questionCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create chapter
router.post('/chapters', async (req, res) => {
    try {
        const chapter = new DPPSChapter(req.body);
        await chapter.save();
        res.status(201).json(chapter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update chapter
router.put('/chapters/:id', async (req, res) => {
    try {
        const chapter = await DPPSChapter.findByIdAndUpdate(
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
        // Also delete associated questions
        await DPPSQuestion.deleteMany({ chapterId: req.params.id });

        const chapter = await DPPSChapter.findByIdAndDelete(req.params.id);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }
        res.json({ message: 'Chapter and associated questions deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== QUESTION ROUTES ====================

// Get questions with filters
router.get('/questions', async (req, res) => {
    try {
        const { chapterId, classLevel, difficultyLevel, questionType, isActive } = req.query;

        let filter = {};
        if (chapterId) filter.chapterId = chapterId;
        if (classLevel) filter.classLevel = classLevel;
        if (difficultyLevel) filter.difficultyLevel = difficultyLevel;
        if (questionType) filter.questionType = questionType;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const questions = await DPPSQuestion.find(filter)
            .populate('chapterId')
            .sort({ order: 1, createdAt: -1 });

        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single question
router.get('/questions/:id', async (req, res) => {
    try {
        const question = await DPPSQuestion.findById(req.params.id)
            .populate('chapterId');
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

        const questionData = {
            ...req.body,
            options: options,
            tags: tags
        };

        // Handle image uploads
        if (req.files?.image) {
            questionData.imageUrl = `/uploads/dpps/${req.files.image[0].filename}`;
        }
        if (req.files?.solutionImage) {
            questionData.solutionImageUrl = `/uploads/dpps/${req.files.solutionImage[0].filename}`;
        }

        const question = new DPPSQuestion(questionData);
        await question.save();

        const populatedQuestion = await DPPSQuestion.findById(question._id)
            .populate('chapterId');

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
                // ignore
            }
        }

        // Handle image uploads
        if (req.files?.image) {
            updateData.imageUrl = `/uploads/dpps/${req.files.image[0].filename}`;
        }
        if (req.files?.solutionImage) {
            updateData.solutionImageUrl = `/uploads/dpps/${req.files.solutionImage[0].filename}`;
        }

        const question = await DPPSQuestion.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('chapterId');

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
        const question = await DPPSQuestion.findByIdAndDelete(req.params.id);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== PROGRESS ROUTES ====================

// Save progress
router.post('/progress', async (req, res) => {
    try {
        const { userId, questionId, chapterId, isCorrect } = req.body;

        const progress = await DPPSProgress.findOneAndUpdate(
            { userId, questionId },
            {
                chapterId,
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
        const progress = await DPPSProgress.find({ userId: req.params.userId });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== STATISTICS ROUTES ====================

// Get statistics
router.get('/stats', async (req, res) => {
    try {
        const chapterCount = await DPPSChapter.countDocuments({ isActive: true });
        const questionCount = await DPPSQuestion.countDocuments({ isActive: true });

        const difficultyStats = await DPPSQuestion.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$difficultyLevel', count: { $sum: 1 } } }
        ]);

        res.json({
            chapters: chapterCount,
            questions: questionCount,
            byDifficulty: difficultyStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {})
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== TEST SESSION ROUTES ====================

// Start a new test session
router.post('/test-sessions', async (req, res) => {
    try {
        const { userId, chapterId } = req.body;

        if (!userId || !chapterId) {
            return res.status(400).json({ error: 'userId and chapterId are required' });
        }

        // Get chapter details
        const chapter = await DPPSChapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        // Get all questions for this chapter
        const questions = await DPPSQuestion.find({
            chapterId: chapterId,
            isActive: true
        }).sort({ order: 1 });

        if (questions.length === 0) {
            return res.status(400).json({ error: 'No questions have been added to this chapter yet. Please add questions first.' });
        }

        // Create test session
        const testSession = new DPPSTestSession({
            userId,
            chapterId,
            classLevel: chapter.classLevel,
            difficultyLevel: chapter.difficultyLevel,
            timeLimit: chapter.timeLimit || 60,
            startTime: new Date(),
            questions: questions.map(q => ({
                questionId: q._id,
                isAttempted: false
            }))
        });

        await testSession.save();

        // Populate questions for response
        const populatedSession = await DPPSTestSession.findById(testSession._id)
            .populate('chapterId')
            .populate('questions.questionId');

        res.status(201).json(populatedSession);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get test session by ID
router.get('/test-sessions/:id', async (req, res) => {
    try {
        const testSession = await DPPSTestSession.findById(req.params.id)
            .populate('chapterId')
            .populate('questions.questionId');

        if (!testSession) {
            return res.status(404).json({ error: 'Test session not found' });
        }

        res.json(testSession);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update test session (save answer)
router.put('/test-sessions/:id/answer', async (req, res) => {
    try {
        const { questionId, selectedAnswer, timeSpent } = req.body;

        const testSession = await DPPSTestSession.findById(req.params.id)
            .populate('questions.questionId');

        if (!testSession) {
            return res.status(404).json({ error: 'Test session not found' });
        }

        // Check if test time has expired
        if (testSession.isTimeExpired()) {
            return res.status(400).json({ error: 'Test time has expired' });
        }

        // Find the question in the session
        const questionIndex = testSession.questions.findIndex(
            q => q.questionId._id.toString() === questionId
        );

        if (questionIndex === -1) {
            return res.status(404).json({ error: 'Question not found in this test' });
        }

        // Get the correct answer
        const question = testSession.questions[questionIndex].questionId;
        const isCorrect = selectedAnswer === question.correctAnswer;

        // Update the answer
        testSession.questions[questionIndex].selectedAnswer = selectedAnswer;
        testSession.questions[questionIndex].isCorrect = isCorrect;
        testSession.questions[questionIndex].isAttempted = true;
        testSession.questions[questionIndex].timeSpent = timeSpent || 0;

        await testSession.save();

        res.json({
            success: true,
            isCorrect,
            correctAnswer: question.correctAnswer
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Submit test (manual or auto)
router.put('/test-sessions/:id/submit', async (req, res) => {
    try {
        const { isAutoSubmit } = req.body;

        const testSession = await DPPSTestSession.findById(req.params.id)
            .populate('questions.questionId');

        if (!testSession) {
            return res.status(404).json({ error: 'Test session not found' });
        }

        if (testSession.isCompleted) {
            return res.status(400).json({ error: 'Test already submitted' });
        }

        // Mark as completed
        testSession.isCompleted = true;
        testSession.isAutoSubmitted = isAutoSubmit || false;
        testSession.submittedAt = new Date();
        testSession.endTime = new Date();

        // Calculate results
        testSession.calculateResults();

        await testSession.save();

        // Save progress for each question
        for (const q of testSession.questions) {
            if (q.isAttempted) {
                await DPPSProgress.findOneAndUpdate(
                    { userId: testSession.userId, questionId: q.questionId._id },
                    {
                        chapterId: testSession.chapterId,
                        testSessionId: testSession._id,
                        isCorrect: q.isCorrect,
                        isCompleted: true,
                        timeSpent: q.timeSpent,
                        lastAttempted: Date.now()
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            }
        }

        res.json(testSession);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get test results
router.get('/test-sessions/:id/results', async (req, res) => {
    try {
        const testSession = await DPPSTestSession.findById(req.params.id)
            .populate('chapterId')
            .populate('questions.questionId');

        if (!testSession) {
            return res.status(404).json({ error: 'Test session not found' });
        }

        if (!testSession.isCompleted) {
            return res.status(400).json({ error: 'Test not yet completed' });
        }

        res.json(testSession);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's test history
router.get('/test-sessions/user/:userId', async (req, res) => {
    try {
        const { classLevel, difficultyLevel } = req.query;

        let filter = { userId: req.params.userId, isCompleted: true };
        if (classLevel) filter.classLevel = classLevel;
        if (difficultyLevel) filter.difficultyLevel = difficultyLevel;

        const sessions = await DPPSTestSession.find(filter)
            .populate('chapterId')
            .sort({ createdAt: -1 });

        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
