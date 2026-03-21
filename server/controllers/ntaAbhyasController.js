const NTAAbhyas = require('../models/NTAAbhyas');

// Get all unique chapters for an exam category
exports.getChapters = async (req, res) => {
    try {
        const { examCategory } = req.params;

        if (!['JEE', 'NEET'].includes(examCategory)) {
            return res.status(400).json({ message: 'Invalid exam category. Must be JEE or NEET.' });
        }

        const chapters = await NTAAbhyas.aggregate([
            { $match: { examCategory, isActive: true } },
            {
                $group: {
                    _id: '$chapter',
                    chapterNumber: { $first: '$chapterNumber' },
                    classLevel: { $first: '$classLevel' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { chapterNumber: 1, _id: 1 } },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    chapterNumber: 1,
                    classLevel: 1,
                    questionCount: '$count'
                }
            }
        ]);

        res.json(chapters);
    } catch (error) {
        console.error('Error fetching NTA Abhyas chapters:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get questions by exam category and chapter
exports.getQuestions = async (req, res) => {
    try {
        const { examCategory, chapter } = req.query;

        if (!examCategory || !chapter) {
            return res.status(400).json({ message: 'Exam category and chapter are required' });
        }

        if (!['JEE', 'NEET'].includes(examCategory)) {
            return res.status(400).json({ message: 'Invalid exam category. Must be JEE or NEET.' });
        }

        const questions = await NTAAbhyas.find({
            examCategory,
            chapter,
            isActive: true
        }).sort({ createdAt: 1 });

        res.json(questions);
    } catch (error) {
        console.error('Error fetching NTA Abhyas questions:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all questions (for admin)
exports.getAllQuestions = async (req, res) => {
    try {
        const { examCategory, chapter, difficulty } = req.query;

        const filter = {};
        if (examCategory) filter.examCategory = examCategory;
        if (chapter) filter.chapter = chapter;
        if (difficulty) filter.difficulty = difficulty;

        const questions = await NTAAbhyas.find(filter).sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        console.error('Error fetching all NTA Abhyas questions:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new question
exports.createQuestion = async (req, res) => {
    try {
        const questionData = { ...req.body };

        // Validate exam category
        if (!['JEE', 'NEET'].includes(questionData.examCategory)) {
            return res.status(400).json({ message: 'Invalid exam category. Must be JEE or NEET.' });
        }

        // Parse options array (comes as JSON string from FormData)
        if (questionData.options && typeof questionData.options === 'string') {
            try { questionData.options = JSON.parse(questionData.options); } catch (e) { }
        }

        // Attach uploaded image URLs
        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                questionData.imageUrl = '/api/uploads/' + req.files.image[0].filename;
            }
            if (req.files.solutionImage && req.files.solutionImage[0]) {
                questionData.solutionImageUrl = '/api/uploads/' + req.files.solutionImage[0].filename;
            }
        }

        const question = new NTAAbhyas(questionData);
        await question.save();

        res.status(201).json({ message: 'Question created successfully', question });
    } catch (error) {
        console.error('Error creating NTA Abhyas question:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a question
exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Validate exam category if provided
        if (updateData.examCategory && !['JEE', 'NEET'].includes(updateData.examCategory)) {
            return res.status(400).json({ message: 'Invalid exam category. Must be JEE or NEET.' });
        }

        // Parse options array (comes as JSON string from FormData)
        if (updateData.options && typeof updateData.options === 'string') {
            try { updateData.options = JSON.parse(updateData.options); } catch (e) { }
        }

        // Attach uploaded image URLs
        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                updateData.imageUrl = '/api/uploads/' + req.files.image[0].filename;
            }
            if (req.files.solutionImage && req.files.solutionImage[0]) {
                updateData.solutionImageUrl = '/api/uploads/' + req.files.solutionImage[0].filename;
            }
        }

        const question = await NTAAbhyas.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ message: 'Question updated successfully', question });
    } catch (error) {
        console.error('Error updating NTA Abhyas question:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await NTAAbhyas.findByIdAndDelete(id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting NTA Abhyas question:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get statistics
exports.getStats = async (req, res) => {
    try {
        const stats = await NTAAbhyas.aggregate([
            {
                $group: {
                    _id: '$examCategory',
                    totalQuestions: { $sum: 1 },
                    chapters: { $addToSet: '$chapter' }
                }
            },
            {
                $project: {
                    examCategory: '$_id',
                    totalQuestions: 1,
                    totalChapters: { $size: '$chapters' },
                    _id: 0
                }
            }
        ]);

        res.json(stats);
    } catch (error) {
        console.error('Error fetching NTA Abhyas stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
