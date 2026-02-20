const ConceptChapter = require('../models/ConceptChapter');
const ConceptTopic = require('../models/ConceptTopic');

let clearCacheFunction = null;

const setClearCacheFunction = (fn) => {
    clearCacheFunction = fn;
};

// Get all subjects
const getSubjects = async (req, res) => {
    try {
        const subjects = await ConceptChapter.distinct('subject', { isActive: true });
        res.json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ message: 'Error fetching subjects' });
    }
};

// Get chapters by subject
// Returns minimal info: id, chapterName, topicCount
const getChaptersBySubject = async (req, res) => {
    try {
        const { subject } = req.params;
        const chapters = await ConceptChapter.find({
            subject,
            isActive: true
        })
            .sort({ order: 1 })
            .lean();

        // Populate topic counts manually or via aggregation
        const chaptersWithCounts = await Promise.all(chapters.map(async (ch) => {
            const topicCount = await ConceptTopic.countDocuments({ chapterId: ch._id });
            return {
                ...ch,
                topicCount
            };
        }));

        res.json(chaptersWithCounts);
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({ message: 'Error fetching chapters' });
    }
};

// Get full chapter with topics
const getChapterDetails = async (req, res) => {
    try {
        const { subject, chapterName } = req.params;
        const chapter = await ConceptChapter.findOne({
            subject,
            chapterName,
            isActive: true
        }).lean();

        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const topics = await ConceptTopic.find({ chapterId: chapter._id })
            .sort({ order: 1 });

        res.json({ ...chapter, topics });
    } catch (error) {
        console.error('Error fetching chapter details:', error);
        res.status(500).json({ message: 'Error fetching chapter details' });
    }
};

// Admin: Get all chapters
const getAllChapters = async (req, res) => {
    try {
        const chapters = await ConceptChapter.find()
            .sort({ subject: 1, order: 1 })
            .lean();

        // In admin list, we might want topic counts
        // For efficiency, maybe we don't fetch counts for "All" instantly if list is huge
        // But let's do it for now
        const chaptersWithCounts = await Promise.all(chapters.map(async (ch) => {
            const topicCount = await ConceptTopic.countDocuments({ chapterId: ch._id });
            // Also fetch topics if we want to show them in the edit form instantly?
            // Actually, for the "Edit" function, we should ideally fetch topics on demand or
            // populate them here. If the user wants to "Edit Chapter", we need the topics.
            // Let's populate topics lightly (including content and images for display)
            const topics = await ConceptTopic.find({ chapterId: ch._id }).select('title content images').sort({ order: 1 });
            return {
                ...ch,
                _id: ch._id, // Explicitly preserve _id
                topics
            }; // topics is array of { _id, title, content, images }
        }));

        res.json(chaptersWithCounts);
    } catch (error) {
        console.error('Error fetching all chapters:', error);
        res.status(500).json({ message: 'Error fetching chapters' });
    }
};

// Full chapter for admin edit
const getChapterById = async (req, res) => {
    try {
        const chapter = await ConceptChapter.findById(req.params.id).lean();
        if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

        const topics = await ConceptTopic.find({ chapterId: chapter._id }).sort({ order: 1 });
        res.json({ ...chapter, topics });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Create chapter
const createChapter = async (req, res) => {
    try {
        // If request contains topics, we create them too!
        const { topics, ...chapterData } = req.body;

        const chapter = new ConceptChapter(chapterData);
        await chapter.save();

        // If topics provided, create them
        if (topics && Array.isArray(topics) && topics.length > 0) {
            const topicDocs = topics.map((t, idx) => ({
                ...t,
                chapterId: chapter._id,
                order: idx // Preserve order
            }));
            await ConceptTopic.insertMany(topicDocs);
        }

        if (clearCacheFunction) clearCacheFunction('concept-notes');

        res.status(201).json(chapter);
    } catch (error) {
        console.error('Error creating chapter:', error);
        res.status(500).json({ message: 'Error creating chapter' });
    }
};

// Admin: Update chapter details (Metadata only)
const updateChapter = async (req, res) => {
    try {
        // We ignore topics array here. Topics must be managed via topic endpoints
        // OR we could handle full sync (delete missing, add new). 
        // For "Unlimited" safety, better to handle topics separately or incrementally.
        // However, for user convenience "Edit Chapter" usually sends the whole state.
        // Let's support "Sync Topics" mode if topics array is sent.

        const { topics, ...chapterData } = req.body;

        const chapter = await ConceptChapter.findByIdAndUpdate(
            req.params.id,
            chapterData,
            { new: true, runValidators: true }
        );

        if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

        if (topics !== undefined) {
            // Full Sync Mode: Expensive but easy for frontend
            // 1. Delete all existing topics for this chapter
            // 2. Insert new ones
            // This allows reordering and deletion implicitly.
            // BUT for 100+ topics, deleting and re-inserting is heavy.
            // Better strategy: Use IDs to match.

            // Since frontend sends everything, let's try a smart sync or just brute force replace for now.
            // To strictly follow "Unlimited" and large size, maybe we shouldn't do this in one request.
            // BUT the user asked for "Add as much as I want".
            // If they have 500 topics, the request body will be huge.
            // It's safer if the Frontend manages topics individually.

            // Let's support creating new topics via this array for convenience but rely on individual endpoints for heavy edits.
            // Actually, let's keep it simple: If topics is passed, we REPLACE all topics.
            // This is the "AudioBook" behavior.

            await ConceptTopic.deleteMany({ chapterId: chapter._id });
            if (Array.isArray(topics) && topics.length > 0) {
                const topicDocs = topics.map((t, idx) => ({
                    ...t,
                    chapterId: chapter._id,
                    order: idx
                }));
                await ConceptTopic.insertMany(topicDocs);
            }
        }

        if (clearCacheFunction) clearCacheFunction('concept-notes');

        // Return full data
        const updatedTopics = await ConceptTopic.find({ chapterId: chapter._id }).sort({ order: 1 });
        res.json({ ...chapter.toObject(), topics: updatedTopics });
    } catch (error) {
        console.error('Error updating chapter:', error);
        res.status(500).json({ message: 'Error updating chapter' });
    }
};

// Admin: Delete chapter
const deleteChapter = async (req, res) => {
    try {
        // Validate that ID exists
        if (!req.params.id || req.params.id === 'undefined') {
            return res.status(400).json({ message: 'Invalid chapter ID' });
        }

        const chapter = await ConceptChapter.findByIdAndDelete(req.params.id);
        if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

        // Delete all associated topics
        await ConceptTopic.deleteMany({ chapterId: req.params.id });

        if (clearCacheFunction) clearCacheFunction('concept-notes');

        res.json({ message: 'Chapter and all topics deleted successfully' });
    } catch (error) {
        console.error('Error deleting chapter:', error);
        res.status(500).json({ message: 'Error deleting chapter', error: error.message });
    }
};

// --- Topic Specific Endpoints (for granular control) ---

const createTopic = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const topic = new ConceptTopic({ ...req.body, chapterId });
        await topic.save();
        if (clearCacheFunction) clearCacheFunction('concept-notes');
        res.status(201).json(topic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTopic = async (req, res) => {
    try {
        const topic = await ConceptTopic.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (clearCacheFunction) clearCacheFunction('concept-notes');
        res.json(topic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTopic = async (req, res) => {
    try {
        await ConceptTopic.findByIdAndDelete(req.params.id);
        if (clearCacheFunction) clearCacheFunction('concept-notes');
        res.json({ message: 'Topic deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get topic details with concepts (for frontend display)
const getTopicWithConcepts = async (req, res) => {
    try {
        const { topicId } = req.params;
        const topic = await ConceptTopic.findById(topicId).lean();

        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        // Concepts are already embedded in the topic
        res.json(topic);
    } catch (error) {
        console.error('Error fetching topic with concepts:', error);
        res.status(500).json({ message: 'Error fetching topic details' });
    }
};

module.exports = {
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
    getTopicWithConcepts,
    setClearCacheFunction
};
