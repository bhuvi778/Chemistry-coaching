const express = require('express');
const router = express.Router();
const InfinitePracticeQuestion = require('../models/InfinitePracticeQuestion');
const InfinitePracticeSession = require('../models/InfinitePracticeSession');

// ==================== ADMIN ROUTES ====================

// Get all questions with filters
router.get('/admin/questions', async (req, res) => {
    try {
        const { examName, subject, chapterName, difficulty, isActive } = req.query;
        
        const filter = {};
        if (examName) filter.examName = examName;
        if (subject) filter.subject = subject;
        if (chapterName) filter.chapterName = chapterName;
        if (difficulty) filter.difficulty = difficulty;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const questions = await InfinitePracticeQuestion.find(filter)
            .sort({ createdAt: -1 });
        
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Server error while fetching questions' });
    }
});

// Get single question
router.get('/admin/questions/:id', async (req, res) => {
    try {
        const question = await InfinitePracticeQuestion.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create question
router.post('/admin/questions', async (req, res) => {
    try {
        const question = new InfinitePracticeQuestion(req.body);
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ message: 'Server error while creating question' });
    }
});

// Update question
router.put('/admin/questions/:id', async (req, res) => {
    try {
        req.body.updatedAt = Date.now();
        const question = await InfinitePracticeQuestion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        
        res.json(question);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: 'Server error while updating question' });
    }
});

// Delete question
router.delete('/admin/questions/:id', async (req, res) => {
    try {
        const question = await InfinitePracticeQuestion.findByIdAndDelete(req.params.id);
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: 'Server error while deleting question' });
    }
});

// Get available chapters for an exam and subject
router.get('/admin/chapters', async (req, res) => {
    try {
        const { examName, subject } = req.query;
        
        const filter = { isActive: true };
        if (examName) filter.examName = examName;
        if (subject) filter.subject = subject;

        const chapters = await InfinitePracticeQuestion.distinct('chapterName', filter);
        res.json(chapters.sort());
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({ message: 'Server error while fetching chapters' });
    }
});

// Get stats
router.get('/admin/stats', async (req, res) => {
    try {
        const totalQuestions = await InfinitePracticeQuestion.countDocuments();
        const activeQuestions = await InfinitePracticeQuestion.countDocuments({ isActive: true });
        
        const byExam = await InfinitePracticeQuestion.aggregate([
            { $group: { _id: '$examName', count: { $sum: 1 } } }
        ]);
        
        const byDifficulty = await InfinitePracticeQuestion.aggregate([
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]);

        res.json({
            totalQuestions,
            activeQuestions,
            byExam,
            byDifficulty
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server error while fetching stats' });
    }
});

// ==================== USER ROUTES ====================

// Get available chapters for selection
router.get('/chapters', async (req, res) => {
    try {
        const { examName, subject } = req.query;
        
        if (!examName || !subject) {
            return res.status(400).json({ message: 'examName and subject are required' });
        }

        const chapters = await InfinitePracticeQuestion.distinct('chapterName', {
            examName,
            subject,
            isActive: true
        });
        
        // Get question count for each chapter
        const chaptersWithCounts = await Promise.all(
            chapters.map(async (chapterName) => {
                const count = await InfinitePracticeQuestion.countDocuments({
                    examName,
                    subject,
                    chapterName,
                    isActive: true
                });
                return { chapterName, questionCount: count };
            })
        );

        res.json(chaptersWithCounts.sort((a, b) => a.chapterName.localeCompare(b.chapterName)));
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start a new practice session
router.post('/session/start', async (req, res) => {
    try {
        const { userId, examName, subject, chapters, difficulty, totalQuestions, mode } = req.body;

        // Validate input
        if (!userId || !examName || !subject || !chapters || chapters.length === 0) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (chapters.length > 3) {
            return res.status(400).json({ message: 'Maximum 3 chapters allowed' });
        }

        // Build query for questions
        const query = {
            examName,
            subject,
            chapterName: { $in: chapters },
            isActive: true
        };

        // Add difficulty filter
        if (difficulty !== 'Mixed') {
            query.difficulty = difficulty;
        }

        // Fetch questions
        let questions = await InfinitePracticeQuestion.find(query);

        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for the selected criteria' });
        }

        // Shuffle questions
        questions = questions.sort(() => Math.random() - 0.5);

        // Limit to requested number
        questions = questions.slice(0, totalQuestions);

        // Create session
        const session = new InfinitePracticeSession({
            userId,
            examName,
            subject,
            chapters,
            difficulty,
            totalQuestions: questions.length,
            mode,
            questions: questions.map(q => ({
                questionId: q._id,
                userAnswer: null,
                isCorrect: null,
                timeTaken: 0,
                markedForReview: false
            })),
            score: {
                correct: 0,
                incorrect: 0,
                unattempted: questions.length,
                total: questions.length,
                percentage: 0
            }
        });

        await session.save();

        // Populate questions for response
        const populatedSession = await InfinitePracticeSession.findById(session._id)
            .populate('questions.questionId');

        res.status(201).json(populatedSession);
    } catch (error) {
        console.error('Error starting session:', error);
        res.status(500).json({ message: 'Server error while starting session' });
    }
});

// Get active session
router.get('/session/:sessionId', async (req, res) => {
    try {
        const session = await InfinitePracticeSession.findById(req.params.sessionId)
            .populate('questions.questionId');
        
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.json(session);
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit answer for a question
router.post('/session/:sessionId/answer', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { questionIndex, userAnswer, timeTaken } = req.body;

        const session = await InfinitePracticeSession.findById(sessionId)
            .populate('questions.questionId');

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (questionIndex < 0 || questionIndex >= session.questions.length) {
            return res.status(400).json({ message: 'Invalid question index' });
        }

        const questionData = session.questions[questionIndex];
        const question = questionData.questionId;

        // Check if answer is correct
        let isCorrect = false;
        if (Array.isArray(question.correctAnswer)) {
            // Multiple correct answers
            isCorrect = JSON.stringify(userAnswer.sort()) === JSON.stringify(question.correctAnswer.sort());
        } else {
            isCorrect = userAnswer === question.correctAnswer;
        }

        // Update question data
        questionData.userAnswer = userAnswer;
        questionData.isCorrect = isCorrect;
        questionData.timeTaken = timeTaken;

        // Update score
        let correctCount = 0;
        let incorrectCount = 0;
        let unattemptedCount = 0;

        session.questions.forEach(q => {
            if (q.userAnswer === null || q.userAnswer === undefined) {
                unattemptedCount++;
            } else if (q.isCorrect) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        });

        session.score = {
            correct: correctCount,
            incorrect: incorrectCount,
            unattempted: unattemptedCount,
            total: session.totalQuestions,
            percentage: Math.round((correctCount / session.totalQuestions) * 100)
        };

        await session.save();

        res.json({ 
            success: true, 
            isCorrect, 
            score: session.score 
        });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark question for review
router.post('/session/:sessionId/mark-review', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { questionIndex, marked } = req.body;

        const session = await InfinitePracticeSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        session.questions[questionIndex].markedForReview = marked;
        await session.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error marking for review:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Complete session
router.post('/session/:sessionId/complete', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { totalTimeTaken } = req.body;

        const session = await InfinitePracticeSession.findById(sessionId)
            .populate('questions.questionId');

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        session.status = 'completed';
        session.completedAt = new Date();
        session.totalTimeTaken = totalTimeTaken;

        await session.save();

        res.json(session);
    } catch (error) {
        console.error('Error completing session:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's session history
router.get('/sessions/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, limit = 20 } = req.query;

        const filter = { userId };
        if (status) filter.status = status;

        const sessions = await InfinitePracticeSession.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(sessions);
    } catch (error) {
        console.error('Error fetching user sessions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
