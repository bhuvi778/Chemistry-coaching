const FreeQuiz = require('../models/FreeQuiz');

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB limit for PDFs

let clearCache = () => { console.log('Cache clear function not initialized'); };

const setClearCacheFunction = (fn) => {
    clearCache = fn;
};

// Get all free quizzes
const getFreeQuizzes = async (req, res) => {
    try {
        // Project only necessary fields for the list view to reduce payload size
        const quizzes = await FreeQuiz.find({}, {
            'quizPdf.data': 0 // Exclude heavy base64 data from list
        }).sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single free quiz (useful for fetching the PDF data)
const getFreeQuizById = async (req, res) => {
    try {
        const quiz = await FreeQuiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new free quiz
const createFreeQuiz = async (req, res) => {
    const quiz = new FreeQuiz(req.body);
    try {
        // Validation for PDF size if present
        if (quiz.quizType === 'PDF' && quiz.quizPdf && quiz.quizPdf.data) {
            // Rough estimation of base64 size: 4/3 of original size
            const sizeInBytes = (quiz.quizPdf.data.length * 3) / 4;
            if (sizeInBytes > MAX_FILE_SIZE) {
                return res.status(400).json({ message: 'PDF file is too large. Maximum size is 15MB.' });
            }
        }

        const newQuiz = await quiz.save();
        clearCache('freeQuizzes');
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update free quiz
const updateFreeQuiz = async (req, res) => {
    try {
        // Validation for PDF size if present in update
        if (req.body.quizType === 'PDF' && req.body.quizPdf && req.body.quizPdf.data) {
            const sizeInBytes = (req.body.quizPdf.data.length * 3) / 4;
            if (sizeInBytes > MAX_FILE_SIZE) {
                return res.status(400).json({ message: 'PDF file is too large. Maximum size is 15MB.' });
            }
        }

        const quiz = await FreeQuiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        clearCache('freeQuizzes');
        res.json(quiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete free quiz
const deleteFreeQuiz = async (req, res) => {
    try {
        const quiz = await FreeQuiz.findByIdAndDelete(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        clearCache('freeQuizzes');
        res.json({ message: 'Quiz deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    setClearCacheFunction,
    getFreeQuizzes,
    getFreeQuizById,
    createFreeQuiz,
    updateFreeQuiz,
    deleteFreeQuiz
};
