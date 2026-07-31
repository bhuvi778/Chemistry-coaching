const FlashCardChapter = require('../models/FlashCardChapter');
const FlashCardTopic = require('../models/FlashCardTopic');
const FlashCard = require('../models/FlashCard');

let clearCache = () => { console.log('Cache clear function not initialized'); };

const setClearCacheFunction = (fn) => {
    clearCache = fn;
};

// ============ CHAPTER OPERATIONS ============

// Get all chapters with stats
const getChapters = async (req, res) => {
    try {
        const chapters = await FlashCardChapter.find().sort({ order: 1, createdAt: 1 });

        // Get stats for each chapter
        const chaptersWithStats = await Promise.all(chapters.map(async (chapter) => {
            const topicCount = await FlashCardTopic.countDocuments({ chapterId: chapter._id });
            const cardCount = await FlashCard.countDocuments({ chapterId: chapter._id });

            return {
                ...chapter.toObject(),
                topicCount,
                cardCount,
                dueCount: cardCount // For now, all cards are "due" - can be enhanced with spaced repetition
            };
        }));

        res.json(chaptersWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single chapter
const getChapterById = async (req, res) => {
    try {
        const chapter = await FlashCardChapter.findById(req.params.id);
        if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
        res.json(chapter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create chapter
const createChapter = async (req, res) => {
    const chapter = new FlashCardChapter(req.body);
    try {
        const newChapter = await chapter.save();
        clearCache('flashcards'); // Match the cache key from app.js route
        res.status(201).json(newChapter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update chapter
const updateChapter = async (req, res) => {
    try {
        const chapter = await FlashCardChapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
        clearCache('flashcards');
        res.json(chapter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete chapter
const deleteChapter = async (req, res) => {
    try {
        const chapter = await FlashCardChapter.findByIdAndDelete(req.params.id);
        if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

        // Delete all topics and cards in this chapter
        await FlashCardTopic.deleteMany({ chapterId: req.params.id });
        await FlashCard.deleteMany({ chapterId: req.params.id });

        clearCache('flashcards');
        res.json({ message: 'Chapter and all related content deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============ TOPIC OPERATIONS ============

// Get topics by chapter
const getTopicsByChapter = async (req, res) => {
    try {
        const topics = await FlashCardTopic.find({ chapterId: req.params.chapterId })
            .sort({ order: 1, createdAt: 1 });

        // Get card count for each topic
        const topicsWithStats = await Promise.all(topics.map(async (topic) => {
            const cardCount = await FlashCard.countDocuments({ topicId: topic._id });

            return {
                ...topic.toObject(),
                cardCount,
                dueCount: cardCount // For now, all cards are "due"
            };
        }));

        res.json(topicsWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create topic
const createTopic = async (req, res) => {
    const topic = new FlashCardTopic(req.body);
    try {
        const newTopic = await topic.save();
        clearCache('flashcards');
        res.status(201).json(newTopic);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update topic
const updateTopic = async (req, res) => {
    try {
        const topic = await FlashCardTopic.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!topic) return res.status(404).json({ message: 'Topic not found' });
        clearCache('flashcards');
        res.json(topic);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete topic
const deleteTopic = async (req, res) => {
    try {
        const topic = await FlashCardTopic.findByIdAndDelete(req.params.id);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });

        // Delete all cards in this topic
        await FlashCard.deleteMany({ topicId: req.params.id });

        clearCache('flashcards');
        res.json({ message: 'Topic and all related cards deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============ CARD OPERATIONS ============

// Get cards by topic
const getCardsByTopic = async (req, res) => {
    try {
        const cards = await FlashCard.find({ topicId: req.params.topicId })
            .sort({ order: 1, createdAt: 1 });
        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get cards by multiple topics (for practice mode)
const getCardsByTopics = async (req, res) => {
    try {
        const { topicIds, userId = 'guest' } = req.body;
        if (!topicIds || !Array.isArray(topicIds)) {
            return res.status(400).json({ message: 'topicIds array is required' });
        }

        // Get all cards for the selected topics
        const allCards = await FlashCard.find({ topicId: { $in: topicIds } })
            .populate('topicId', 'name')
            .populate('chapterId', 'name')
            .sort({ order: 1, createdAt: 1 });

        // Get user's progress for these cards
        const cardIds = allCards.map(card => card._id);
        const progressRecords = await FlashCardProgress.find({
            userId,
            cardId: { $in: cardIds }
        });

        // Create a map of card progress
        const progressMap = new Map();
        progressRecords.forEach(progress => {
            progressMap.set(progress.cardId.toString(), progress);
        });

        // Filter to only include cards that are due
        const dueCards = allCards.filter(card => {
            const progress = progressMap.get(card._id.toString());

            // If no progress record, card has never been reviewed - it's due
            if (!progress) {
                return true;
            }

            // If card is mastered, don't include it
            if (progress.status === 'mastered') {
                return false;
            }

            // If nextReview date is in the past or today, it's due
            if (progress.nextReview && progress.nextReview <= new Date()) {
                return true;
            }

            // Otherwise, not due yet
            return false;
        });

        res.json(dueCards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create card
const createCard = async (req, res) => {
    const card = new FlashCard(req.body);
    try {
        const newCard = await card.save();
        clearCache('flashcards');
        res.status(201).json(newCard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update card
const updateCard = async (req, res) => {
    try {
        const card = await FlashCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!card) return res.status(404).json({ message: 'Card not found' });
        clearCache('flashcards');
        res.json(card);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete card
const deleteCard = async (req, res) => {
    try {
        const card = await FlashCard.findByIdAndDelete(req.params.id);
        if (!card) return res.status(404).json({ message: 'Card not found' });
        clearCache('flashcards');
        res.json({ message: 'Card deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============ PROGRESS TRACKING ============

const FlashCardProgress = require('../models/FlashCardProgress');

// Get user progress for a chapter
const getChapterProgress = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const userId = req.query.userId || 'guest'; // For now, use guest or get from auth

        // Get all cards in the chapter
        const totalCards = await FlashCard.countDocuments({ chapterId });

        if (totalCards === 0) {
            return res.json({ progress: 0, completed: 0, total: 0 });
        }

        // Get completed cards (mastered status)
        const completedCards = await FlashCardProgress.countDocuments({
            userId,
            chapterId,
            status: 'mastered'
        });

        const progress = Math.round((completedCards / totalCards) * 100);

        res.json({
            progress,
            completed: completedCards,
            total: totalCards
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user progress for a topic
const getTopicProgress = async (req, res) => {
    try {
        const { topicId } = req.params;
        const userId = req.query.userId || 'guest';

        const totalCards = await FlashCard.countDocuments({ topicId });

        if (totalCards === 0) {
            return res.json({ progress: 0, completed: 0, total: 0 });
        }

        const completedCards = await FlashCardProgress.countDocuments({
            userId,
            topicId,
            status: 'mastered'
        });

        const progress = Math.round((completedCards / totalCards) * 100);

        res.json({
            progress,
            completed: completedCards,
            total: totalCards
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update card progress (when user reviews a card)
const updateCardProgress = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { userId = 'guest', quality } = req.body; // quality: 1-5 (how well user knew the answer)

        const card = await FlashCard.findById(cardId);
        if (!card) return res.status(404).json({ message: 'Card not found' });

        // Find or create progress record
        let progress = await FlashCardProgress.findOne({ userId, cardId });

        if (!progress) {
            progress = new FlashCardProgress({
                userId,
                chapterId: card.chapterId,
                topicId: card.topicId,
                cardId,
                status: 'new'
            });
        }

        // Update progress based on quality (simplified spaced repetition)
        progress.reviewCount += 1;
        progress.lastReviewed = new Date();

        if (quality === 5) {
            // Easy - immediately mark as mastered (user knows it very well)
            progress.status = 'mastered';
            progress.interval = 30; // Review in 30 days
        } else if (quality === 4) {
            // Good recall - progress forward normally
            if (progress.status === 'new') {
                progress.status = 'learning';
                progress.interval = 1; // Review tomorrow
            } else if (progress.status === 'learning') {
                // After 1 successful review in learning, move to mastered
                progress.status = 'mastered';
                progress.interval = 30; // Review in 30 days (essentially done)
            } else if (progress.status === 'reviewing') {
                // Move to mastered
                progress.status = 'mastered';
                progress.interval = 30;
            }
        } else if (quality === 3) {
            // Hard - stay in current status but review sooner
            if (progress.status === 'new') {
                progress.status = 'learning';
                progress.interval = 1;
            } else {
                progress.interval = 1; // Review tomorrow
            }
        } else {
            // Again (quality <= 2) - reset to learning
            progress.status = 'learning';
            progress.interval = 1;
        }

        // Calculate next review date
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + progress.interval);
        progress.nextReview = nextReview;

        await progress.save();
        clearCache('flashcards');

        res.json(progress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get chapters with user progress
const getChaptersWithProgress = async (req, res) => {
    try {
        const userId = req.query.userId || 'guest';
        const chapters = await FlashCardChapter.find().sort({ order: 1, createdAt: 1 });

        const chaptersWithStats = await Promise.all(chapters.map(async (chapter) => {
            const topicCount = await FlashCardTopic.countDocuments({ chapterId: chapter._id });
            const cardCount = await FlashCard.countDocuments({ chapterId: chapter._id });

            // Calculate progress
            let progress = 0;
            let dueCount = cardCount; // Default to all cards

            if (cardCount > 0) {
                // Calculate due count: cards that haven't been reviewed yet OR are due for review
                const reviewedCardsCount = await FlashCardProgress.countDocuments({
                    userId,
                    chapterId: chapter._id
                });

                // Cards that have never been reviewed
                const neverReviewedCount = cardCount - reviewedCardsCount;

                // Cards that are due for review (nextReview date is in the past)
                const cardsNeedingReview = await FlashCardProgress.countDocuments({
                    userId,
                    chapterId: chapter._id,
                    nextReview: { $lte: new Date() },
                    status: { $ne: 'mastered' } // Don't include mastered cards in due count
                });

                dueCount = neverReviewedCount + cardsNeedingReview;

                // Progress = cards that are NOT due (have been reviewed and scheduled for future)
                const completedCards = cardCount - dueCount;
                progress = Math.round((completedCards / cardCount) * 100);
            }

            return {
                ...chapter.toObject(),
                topicCount,
                cardCount,
                dueCount,
                progress
            };
        }));

        res.json(chaptersWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get topics with user progress
const getTopicsByChapterWithProgress = async (req, res) => {
    try {
        const userId = req.query.userId || 'guest';
        const topics = await FlashCardTopic.find({ chapterId: req.params.chapterId })
            .sort({ order: 1, createdAt: 1 });

        const topicsWithStats = await Promise.all(topics.map(async (topic) => {
            const cardCount = await FlashCard.countDocuments({ topicId: topic._id });

            // Calculate progress
            let progress = 0;
            let dueCount = cardCount; // Default to all cards

            if (cardCount > 0) {
                // Calculate due count: cards that haven't been reviewed yet OR are due for review
                const reviewedCardsCount = await FlashCardProgress.countDocuments({
                    userId,
                    topicId: topic._id
                });

                // Cards that have never been reviewed
                const neverReviewedCount = cardCount - reviewedCardsCount;

                // Cards that are due for review (nextReview date is in the past)
                const cardsNeedingReview = await FlashCardProgress.countDocuments({
                    userId,
                    topicId: topic._id,
                    nextReview: { $lte: new Date() },
                    status: { $ne: 'mastered' } // Don't include mastered cards in due count
                });

                dueCount = neverReviewedCount + cardsNeedingReview;

                // Progress = cards that are NOT due (have been reviewed and scheduled for future)
                const completedCards = cardCount - dueCount;
                progress = Math.round((completedCards / cardCount) * 100);
            }

            return {
                ...topic.toObject(),
                cardCount,
                dueCount,
                progress
            };
        }));

        res.json(topicsWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get chapter stats with card status breakdown
const getChapterStats = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const userId = req.query.userId || 'guest';

        // Get total cards in chapter
        const totalCards = await FlashCard.countDocuments({ chapterId });

        if (totalCards === 0) {
            return res.json({
                new: 0,
                learning: 0,
                reviewing: 0,
                mastered: 0,
                total: 0
            });
        }

        // Count cards by status
        const newCards = await FlashCardProgress.countDocuments({
            userId,
            chapterId,
            status: 'new'
        });

        const learningCards = await FlashCardProgress.countDocuments({
            userId,
            chapterId,
            status: 'learning'
        });

        const reviewingCards = await FlashCardProgress.countDocuments({
            userId,
            chapterId,
            status: 'reviewing'
        });

        const masteredCards = await FlashCardProgress.countDocuments({
            userId,
            chapterId,
            status: 'mastered'
        });

        // Cards that have never been reviewed are "new"
        const reviewedCardsCount = newCards + learningCards + reviewingCards + masteredCards;
        const neverReviewedCards = totalCards - reviewedCardsCount;

        res.json({
            new: neverReviewedCards + newCards,
            learning: learningCards,
            reviewing: reviewingCards,
            mastered: masteredCards,
            total: totalCards
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export all flashcards data for external integration
const exportFlashCards = async (req, res) => {
    try {
        const { format, chapterId, topicId } = req.query;

        // If a flat format is requested, or filtering by chapter/topic is requested
        if (format === 'flat' || chapterId || topicId) {
            const query = {};
            if (chapterId) query.chapterId = chapterId;
            if (topicId) query.topicId = topicId;

            const cards = await FlashCard.find(query)
                .populate('chapterId', 'name description icon iconColor subject category')
                .populate('topicId', 'name description')
                .sort({ order: 1, createdAt: 1 });

            return res.json({
                success: true,
                count: cards.length,
                cards
            });
        }

        // Default: export all structured data
        const chapters = await FlashCardChapter.find().sort({ order: 1, createdAt: 1 });
        const topics = await FlashCardTopic.find().sort({ order: 1, createdAt: 1 });
        const cards = await FlashCard.find().sort({ order: 1, createdAt: 1 });

        res.json({
            success: true,
            chapters,
            topics,
            cards
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    setClearCacheFunction,
    // Chapter operations
    getChapters,
    getChapterById,
    createChapter,
    updateChapter,
    deleteChapter,
    // Topic operations
    getTopicsByChapter,
    createTopic,
    updateTopic,
    deleteTopic,
    // Card operations
    getCardsByTopic,
    getCardsByTopics,
    createCard,
    updateCard,
    deleteCard,
    // Progress operations
    getChapterProgress,
    getTopicProgress,
    updateCardProgress,
    getChaptersWithProgress,
    getTopicsByChapterWithProgress,
    getChapterStats,
    exportFlashCards
};
