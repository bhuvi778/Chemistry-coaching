const express = require('express');
const router = express.Router();
const FreeQuiz = require('../models/FreeQuiz');
const FreeQuizQuestion = require('../models/FreeQuizQuestion');
const FreeQuizAttempt = require('../models/FreeQuizAttempt');

// ===================== QUIZ CRUD =====================

// GET all quizzes (with question count) - student
router.get('/', async (req, res) => {
    try {
        const quizzes = await FreeQuiz.find({ isActive: { $ne: false } }).sort({ createdAt: -1 });
        const quizzesWithCount = await Promise.all(
            quizzes.map(async (quiz) => {
                const questionCount = await FreeQuizQuestion.countDocuments({ quizId: quiz._id, isActive: true });
                return { ...quiz.toObject(), questionCount };
            })
        );
        res.json(quizzesWithCount);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all quizzes (admin - includes inactive)
router.get('/admin/all', async (req, res) => {
    try {
        const quizzes = await FreeQuiz.find().sort({ createdAt: -1 });
        const quizzesWithCount = await Promise.all(
            quizzes.map(async (quiz) => {
                const questionCount = await FreeQuizQuestion.countDocuments({ quizId: quiz._id, isActive: true });
                return { ...quiz.toObject(), questionCount };
            })
        );
        res.json(quizzesWithCount);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all attempts (admin) — must be before /:id
router.get('/attempts/all', async (req, res) => {
    try {
        const attempts = await FreeQuizAttempt.find().sort({ attemptedAt: -1 });
        res.json(attempts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single quiz
router.get('/:id', async (req, res) => {
    try {
        const quiz = await FreeQuiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
        const questionCount = await FreeQuizQuestion.countDocuments({ quizId: quiz._id, isActive: true });
        res.json({ ...quiz.toObject(), questionCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create quiz
router.post('/', async (req, res) => {
    try {
        const quiz = new FreeQuiz(req.body);
        await quiz.save();
        res.status(201).json(quiz);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH update quiz
router.patch('/:id', async (req, res) => {
    try {
        const quiz = await FreeQuiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
        res.json(quiz);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE quiz + its questions
router.delete('/:id', async (req, res) => {
    try {
        await FreeQuizQuestion.deleteMany({ quizId: req.params.id });
        const quiz = await FreeQuiz.findByIdAndDelete(req.params.id);
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
        res.json({ message: 'Quiz deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===================== QUESTION CRUD =====================

// GET questions for a quiz - admin (all, including inactive)
router.get('/:quizId/questions/admin', async (req, res) => {
    try {
        const questions = await FreeQuizQuestion.find({ quizId: req.params.quizId }).sort({ order: 1, createdAt: 1 });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET questions for a quiz - student (active only)
router.get('/:quizId/questions', async (req, res) => {
    try {
        const questions = await FreeQuizQuestion.find({ quizId: req.params.quizId, isActive: true }).sort({ order: 1, createdAt: 1 });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add question to quiz
router.post('/:quizId/questions', async (req, res) => {
    try {
        const quiz = await FreeQuiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
        const question = new FreeQuizQuestion({ ...req.body, quizId: req.params.quizId });
        await question.save();
        res.status(201).json(question);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH update question
router.patch('/:quizId/questions/:questionId', async (req, res) => {
    try {
        const question = await FreeQuizQuestion.findOneAndUpdate(
            { _id: req.params.questionId, quizId: req.params.quizId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.json(question);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE question
router.delete('/:quizId/questions/:questionId', async (req, res) => {
    try {
        const question = await FreeQuizQuestion.findOneAndDelete({
            _id: req.params.questionId,
            quizId: req.params.quizId
        });
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.json({ message: 'Question deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST save quiz attempt (student submits)
router.post('/:quizId/attempts', async (req, res) => {
    try {
        const quiz = await FreeQuiz.findById(req.params.quizId);
        const attempt = new FreeQuizAttempt({
            ...req.body,
            quizId: req.params.quizId,
            quizTitle: quiz?.title || ''
        });
        await attempt.save();
        res.status(201).json(attempt);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET attempts for a specific quiz (admin)
router.get('/:quizId/attempts', async (req, res) => {
    try {
        const attempts = await FreeQuizAttempt.find({ quizId: req.params.quizId }).sort({ attemptedAt: -1 });
        res.json(attempts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
