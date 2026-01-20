const AssertionReasonChapter = require('../models/AssertionReasonChapter');
const AssertionReasonQuestion = require('../models/AssertionReasonQuestion');
const AssertionReasonProgress = require('../models/AssertionReasonProgress');

// ============ FRONTEND ROUTES ============

// Get all chapters with progress
exports.getChaptersWithProgress = async (req, res) => {
    try {
        const { userId = 'guest' } = req.query;

        const chapters = await AssertionReasonChapter.find({ isActive: true })
            .sort({ order: 1, createdAt: 1 });

        const chaptersWithProgress = await Promise.all(chapters.map(async (chapter) => {
            // Get total question count
            const questionCount = await AssertionReasonQuestion.countDocuments({
                chapterId: chapter._id
            });

            // Get progress stats
            const reviewedCount = await AssertionReasonProgress.countDocuments({
                userId,
                chapterId: chapter._id
            });

            const masteredCount = await AssertionReasonProgress.countDocuments({
                userId,
                chapterId: chapter._id,
                status: 'mastered'
            });

            // Calculate due count (new + due for review)
            const neverReviewedCount = questionCount - reviewedCount;
            const cardsNeedingReview = await AssertionReasonProgress.countDocuments({
                userId,
                chapterId: chapter._id,
                nextReview: { $lte: new Date() },
                status: { $ne: 'mastered' }
            });
            const dueCount = neverReviewedCount + cardsNeedingReview;

            // Calculate progress
            const completedCards = await AssertionReasonProgress.countDocuments({
                userId,
                chapterId: chapter._id,
                nextReview: { $gt: new Date() }
            });
            const progress = questionCount > 0 ? Math.round((completedCards / questionCount) * 100) : 0;

            return {
                _id: chapter._id,
                name: chapter.name,
                description: chapter.description,
                icon: chapter.icon,
                iconColor: chapter.iconColor,
                category: chapter.category,
                questionCount,
                dueCount,
                progress
            };
        }));

        // Calculate overall stats
        const totalQuestions = chaptersWithProgress.reduce((sum, ch) => sum + ch.questionCount, 0);
        const totalDue = chaptersWithProgress.reduce((sum, ch) => sum + ch.dueCount, 0);
        const totalMastered = await AssertionReasonProgress.countDocuments({
            userId,
            status: 'mastered'
        });

        res.json({
            chapters: chaptersWithProgress,
            stats: {
                totalQuestions,
                totalChapters: chapters.length,
                dueToday: totalDue,
                mastered: totalMastered
            }
        });
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({ message: 'Error fetching chapters', error: error.message });
    }
};

// Get chapter details with progress
exports.getChapterDetails = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const { userId = 'guest' } = req.query;

        const chapter = await AssertionReasonChapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        // Get total question count
        const totalCount = await AssertionReasonQuestion.countDocuments({ chapterId });

        // Get status counts
        const newCount = totalCount - await AssertionReasonProgress.countDocuments({
            userId,
            chapterId
        });

        const learningCount = await AssertionReasonProgress.countDocuments({
            userId,
            chapterId,
            status: 'learning'
        });

        const reviewingCount = await AssertionReasonProgress.countDocuments({
            userId,
            chapterId,
            status: 'reviewing'
        });

        const masteredCount = await AssertionReasonProgress.countDocuments({
            userId,
            chapterId,
            status: 'mastered'
        });

        // Calculate due count
        const neverReviewedCount = totalCount - await AssertionReasonProgress.countDocuments({
            userId,
            chapterId
        });
        const cardsNeedingReview = await AssertionReasonProgress.countDocuments({
            userId,
            chapterId,
            nextReview: { $lte: new Date() },
            status: { $ne: 'mastered' }
        });
        const dueCount = neverReviewedCount + cardsNeedingReview;

        res.json({
            chapter: {
                _id: chapter._id,
                name: chapter.name,
                description: chapter.description,
                newCount,
                learningCount,
                reviewingCount,
                masteredCount,
                totalCount,
                dueCount
            }
        });
    } catch (error) {
        console.error('Error fetching chapter details:', error);
        res.status(500).json({ message: 'Error fetching chapter details', error: error.message });
    }
};

// Get questions for practice
exports.getQuestionsForPractice = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const { userId = 'guest', mode = 'all' } = req.query;

        let questions;

        if (mode === 'due') {
            // Get questions that are due for review
            const reviewedProgress = await AssertionReasonProgress.find({
                userId,
                chapterId,
                nextReview: { $lte: new Date() },
                status: { $ne: 'mastered' }
            }).select('questionId');

            const reviewedQuestionIds = reviewedProgress.map(p => p.questionId);

            // Get new questions (never reviewed)
            const allQuestions = await AssertionReasonQuestion.find({ chapterId }).select('_id');
            const allQuestionIds = allQuestions.map(q => q._id.toString());
            const reviewedIds = await AssertionReasonProgress.find({
                userId,
                chapterId
            }).select('questionId');
            const reviewedIdStrings = reviewedIds.map(p => p.questionId.toString());
            const newQuestionIds = allQuestionIds.filter(id => !reviewedIdStrings.includes(id));

            // Combine due and new questions
            const dueQuestionIds = [...reviewedQuestionIds, ...newQuestionIds.map(id => ({ questionId: id }))];
            questions = await AssertionReasonQuestion.find({
                _id: { $in: dueQuestionIds.map(q => q.questionId || q) }
            }).sort({ order: 1 });
        } else {
            // Get all questions
            questions = await AssertionReasonQuestion.find({ chapterId }).sort({ order: 1 });
        }

        // Get chapter name
        const chapter = await AssertionReasonChapter.findById(chapterId);

        const questionsWithChapter = questions.map(q => ({
            _id: q._id,
            chapterName: chapter.name,
            assertion: q.assertion,
            reason: q.reason,
            assertionTrue: q.assertionTrue,
            reasonTrue: q.reasonTrue,
            correctAnswer: q.reasonExplainsAssertion ? 'yes' : 'no',
            explanation: q.explanation || '',
            difficulty: q.difficulty
        }));

        res.json({ questions: questionsWithChapter });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
};

// Update question progress
exports.updateQuestionProgress = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { userId = 'guest', quality } = req.body; // quality: 1-5 (1=again, 5=easy)

        const question = await AssertionReasonQuestion.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        let progress = await AssertionReasonProgress.findOne({
            userId,
            questionId,
            chapterId: question.chapterId
        });

        if (!progress) {
            progress = new AssertionReasonProgress({
                userId,
                questionId,
                chapterId: question.chapterId,
                status: 'new',
                repetitions: 0,
                easeFactor: 2.5,
                interval: 0,
                nextReview: new Date()
            });
        }

        // Update based on quality (SM-2 algorithm)
        progress.repetitions += 1;
        progress.lastReview = new Date();

        if (quality >= 4) {
            // Good or Easy
            if (progress.status === 'new') {
                progress.status = 'learning';
                progress.interval = 1;
            } else if (progress.status === 'learning') {
                progress.status = 'reviewing';
                progress.interval = 3;
            } else {
                progress.interval = Math.round(progress.interval * progress.easeFactor);
                if (progress.interval >= 21) {
                    progress.status = 'mastered';
                }
            }
        } else if (quality === 3) {
            // Hard
            if (progress.status === 'new') {
                progress.status = 'learning';
            }
            progress.interval = 1;
        } else {
            // Again
            progress.status = 'learning';
            progress.interval = 1;
            progress.repetitions = 0;
        }

        // Update ease factor
        progress.easeFactor = Math.max(1.3, progress.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

        // Set next review date
        progress.nextReview = new Date(Date.now() + progress.interval * 24 * 60 * 60 * 1000);

        await progress.save();

        res.json({
            message: 'Progress updated',
            progress: {
                status: progress.status,
                nextReview: progress.nextReview,
                interval: progress.interval
            }
        });
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ message: 'Error updating progress', error: error.message });
    }
};

// ============ ADMIN ROUTES ============

// Get all chapters (admin)
exports.getChaptersAdmin = async (req, res) => {
    try {
        const chapters = await AssertionReasonChapter.find().sort({ order: 1, createdAt: 1 });

        const chaptersWithCount = await Promise.all(chapters.map(async (chapter) => {
            const questionCount = await AssertionReasonQuestion.countDocuments({
                chapterId: chapter._id
            });

            return {
                ...chapter.toObject(),
                questionCount
            };
        }));

        res.json(chaptersWithCount);
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({ message: 'Error fetching chapters', error: error.message });
    }
};

// Create chapter (admin)
exports.createChapter = async (req, res) => {
    try {
        const chapter = new AssertionReasonChapter(req.body);
        await chapter.save();
        res.status(201).json(chapter);
    } catch (error) {
        console.error('Error creating chapter:', error);
        res.status(500).json({ message: 'Error creating chapter', error: error.message });
    }
};

// Update chapter (admin)
exports.updateChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const chapter = await AssertionReasonChapter.findByIdAndUpdate(
            chapterId,
            req.body,
            { new: true }
        );
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.json(chapter);
    } catch (error) {
        console.error('Error updating chapter:', error);
        res.status(500).json({ message: 'Error updating chapter', error: error.message });
    }
};

// Delete chapter (admin)
exports.deleteChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;

        // Delete all questions in this chapter
        await AssertionReasonQuestion.deleteMany({ chapterId });

        // Delete all progress for this chapter
        await AssertionReasonProgress.deleteMany({ chapterId });

        // Delete the chapter
        const chapter = await AssertionReasonChapter.findByIdAndDelete(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        res.json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        console.error('Error deleting chapter:', error);
        res.status(500).json({ message: 'Error deleting chapter', error: error.message });
    }
};

// Get questions for a chapter (admin)
exports.getQuestionsAdmin = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const questions = await AssertionReasonQuestion.find({ chapterId }).sort({ order: 1, createdAt: 1 });
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
};

// Create question (admin)
exports.createQuestion = async (req, res) => {
    try {
        const question = new AssertionReasonQuestion(req.body);
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ message: 'Error creating question', error: error.message });
    }
};

// Update question (admin)
exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await AssertionReasonQuestion.findByIdAndUpdate(
            questionId,
            req.body,
            { new: true }
        );
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: 'Error updating question', error: error.message });
    }
};

// Delete question (admin)
exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        // Delete progress for this question
        await AssertionReasonProgress.deleteMany({ questionId });

        // Delete the question
        const question = await AssertionReasonQuestion.findByIdAndDelete(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: 'Error deleting question', error: error.message });
    }
};
