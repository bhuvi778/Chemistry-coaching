const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');
const SelfLearnChapter = require('../models/SelfLearnChapter');
const SelfLearnTopic = require('../models/SelfLearnTopic');
const SelfLearnProgress = require('../models/SelfLearnProgress');
const { clearCache } = require('../middleware/cache');

// ============ BUNNY.NET TOKEN AUTHENTICATION ============

// Generate signed URL for Bunny.net video with token authentication
router.post('/generate-signed-url', async (req, res) => {
    try {
        const { videoId } = req.body;
        const libraryId = process.env.VITE_BUNNY_LIBRARY_ID || '585188';
        const securityKey = process.env.BUNNY_SECURITY_KEY;

        if (!videoId) {
            return res.status(400).json({ error: 'Video ID is required' });
        }

        if (!securityKey || securityKey === 'your-security-key-here') {
            return res.status(500).json({ 
                error: 'Bunny.net security key not configured. Please set BUNNY_SECURITY_KEY in .env file.'
            });
        }

        // Set expiration time (1 hour from now)
        const expirationTime = Math.floor(Date.now() / 1000) + 3600;

        // Create signature string
        const signatureString = `${libraryId}${securityKey}${expirationTime}${videoId}`;
        
        // Generate SHA256 hash
        const token = crypto
            .createHash('sha256')
            .update(signatureString)
            .digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');

        // Construct signed URL
        const signedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expirationTime}&autoplay=false&preload=true&responsive=true`;

        res.json({ signedUrl, expiresAt: expirationTime });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        res.status(500).json({ error: 'Failed to generate signed URL' });
    }
});

// ============ FRONTEND ROUTES ============

// Get all active chapters by exam and subject
router.get('/chapters', async (req, res) => {
    try {
        const { examType, subject } = req.query;

        const filter = { isActive: true };
        if (examType) filter.examType = examType;
        if (subject) filter.subject = subject;

        const chapters = await SelfLearnChapter.find(filter)
            .sort({ order: 1, chapterName: 1 });

        // Aggregate topic-level stats for each chapter
        const chapterIds = chapters.map(c => c._id);
        const topics = await SelfLearnTopic.find({ chapterId: { $in: chapterIds }, isActive: true });

        const statsMap = {};
        topics.forEach(topic => {
            const cId = topic.chapterId.toString();
            if (!statsMap[cId]) statsMap[cId] = { topicCount: 0, videoCount: 0, sheetCount: 0, exerciseCount: 0 };
            statsMap[cId].topicCount++;
            statsMap[cId].videoCount += (topic.learn?.videos?.length || 0);
            statsMap[cId].sheetCount += (topic.learn?.sheets?.length || 0);
            statsMap[cId].exerciseCount += (topic.learn?.exercises || []).reduce((sum, ex) => sum + (ex.questions?.length || 0), 0);
        });

        const chaptersWithStats = chapters.map(ch => ({
            ...ch.toObject(),
            topicCount: statsMap[ch._id.toString()]?.topicCount || 0,
            videoCount: statsMap[ch._id.toString()]?.videoCount || 0,
            sheetCount: statsMap[ch._id.toString()]?.sheetCount || 0,
            exerciseCount: statsMap[ch._id.toString()]?.exerciseCount || 0
        }));

        res.json(chaptersWithStats);
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single chapter by ID
router.get('/chapters/:id', async (req, res) => {
    try {
        const chapter = await SelfLearnChapter.findById(req.params.id);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }
        res.json(chapter);
    } catch (error) {
        console.error('Error fetching chapter:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user progress for a chapter
router.get('/progress/:chapterId', async (req, res) => {
    try {
        const { chapterId } = req.params;
        const { userId = 'guest' } = req.query;

        let progress = await SelfLearnProgress.findOne({ userId, chapterId });

        if (!progress) {
            // Create initial progress
            const chapter = await SelfLearnChapter.findById(chapterId);
            if (!chapter) {
                return res.status(404).json({ error: 'Chapter not found' });
            }

            progress = new SelfLearnProgress({
                userId,
                chapterId,
                examType: chapter.examType,
                subject: chapter.subject
            });
            await progress.save();
        }

        res.json(progress);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update progress
router.put('/progress/:chapterId', async (req, res) => {
    try {
        const { chapterId } = req.params;
        const { userId = 'guest' } = req.query;
        const updateData = req.body;

        const progress = await SelfLearnProgress.findOneAndUpdate(
            { userId, chapterId },
            {
                ...updateData,
                lastAccessedAt: Date.now()
            },
            { new: true, upsert: true }
        );

        res.json(progress);
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all progress for user by exam/subject
router.get('/progress', async (req, res) => {
    try {
        const { userId = 'guest', examType, subject } = req.query;

        const filter = { userId };
        if (examType) filter.examType = examType;
        if (subject) filter.subject = subject;

        const progressList = await SelfLearnProgress.find(filter)
            .populate('chapterId');

        res.json(progressList);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get topics for a chapter (Frontend)
router.get('/chapters/:chapterId/topics', async (req, res) => {
    try {
        const topics = await SelfLearnTopic.find({ 
            chapterId: req.params.chapterId,
            isActive: true 
        }).sort({ order: 1, topicName: 1 });

        // Compute content counts for each topic
        const topicsWithStats = topics.map(topic => {
            const t = topic.toObject();
            t.videoCount = t.learn?.videos?.length || 0;
            t.sheetCount = t.learn?.sheets?.length || 0;
            // Total questions across all exercise sets
            t.exerciseCount = (t.learn?.exercises || []).reduce((sum, ex) => sum + (ex.questions?.length || 0), 0);
            // Legacy questions array count
            t.questionCount = t.questions?.length || 0;
            return t;
        });

        res.json(topicsWithStats);
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single topic (Frontend)
router.get('/topics/:id', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findById(req.params.id);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        res.json(topic);
    } catch (error) {
        console.error('Error fetching topic:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============ ADMIN ROUTES ============

// Get all chapters (admin)
router.get('/admin/chapters', async (req, res) => {
    try {
        const chapters = await SelfLearnChapter.find()
            .sort({ examType: 1, subject: 1, order: 1 });
        res.json(chapters);
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create chapter (admin)
router.post('/admin/chapters', async (req, res) => {
    try {
        const chapter = new SelfLearnChapter(req.body);
        await chapter.save();
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after chapter creation');
        res.status(201).json(chapter);
    } catch (error) {
        console.error('Error creating chapter:', error);
        res.status(400).json({ error: error.message });
    }
});

// Update chapter (admin)
router.put('/admin/chapters/:id', async (req, res) => {
    try {
        const chapter = await SelfLearnChapter.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after chapter update');
        res.json(chapter);
    } catch (error) {
        console.error('Error updating chapter:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete chapter (admin)
router.delete('/admin/chapters/:id', async (req, res) => {
    try {
        const chapter = await SelfLearnChapter.findByIdAndDelete(req.params.id);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        // Delete associated progress
        await SelfLearnProgress.deleteMany({ chapterId: req.params.id });

        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after chapter deletion');

        res.json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        console.error('Error deleting chapter:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get stats (admin)
router.get('/admin/stats', async (req, res) => {
    try {
        const totalChapters = await SelfLearnChapter.countDocuments();
        const activeChapters = await SelfLearnChapter.countDocuments({ isActive: true });
        const totalTopics = await SelfLearnTopic.countDocuments();
        const activeTopics = await SelfLearnTopic.countDocuments({ isActive: true });

        const byExam = await SelfLearnChapter.aggregate([
            { $group: { _id: '$examType', count: { $sum: 1 } } }
        ]);

        const bySubject = await SelfLearnChapter.aggregate([
            { $group: { _id: '$subject', count: { $sum: 1 } } }
        ]);

        res.json({
            totalChapters,
            activeChapters,
            totalTopics,
            activeTopics,
            byExam,
            bySubject
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============ TOPIC ROUTES (ADMIN) ============

// Get all topics for a chapter
router.get('/admin/chapters/:chapterId/topics', async (req, res) => {
    try {
        // Let mongoose handle the ObjectId conversion automatically
        const topics = await SelfLearnTopic.find({ chapterId: req.params.chapterId })
            .sort({ order: 1, topicName: 1 });
        res.json(topics);
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single topic
router.get('/admin/topics/:id', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findById(req.params.id);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        res.json(topic);
    } catch (error) {
        console.error('Error fetching topic:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create topic
router.post('/admin/topics', async (req, res) => {
    try {
        // Let mongoose handle ObjectId conversion based on schema
        const topic = new SelfLearnTopic(req.body);
        await topic.save();
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after topic creation');
        res.status(201).json(topic);
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(400).json({ error: error.message });
    }
});

// Update topic
router.put('/admin/topics/:id', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after topic update');
        res.json(topic);
    } catch (error) {
        console.error('Error updating topic:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete topic
router.delete('/admin/topics/:id', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findByIdAndDelete(req.params.id);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after topic deletion');
        res.json({ message: 'Topic deleted successfully' });
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({ error: error.message });
    }
});

// ========== Videos Management ==========

// Add video to topic
router.post('/admin/topics/:topicId/videos', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findById(req.params.topicId);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        if (!topic.learn) {
            topic.learn = { videos: [], sheets: [], exercises: [] };
        }
        
        topic.learn.videos.push(req.body);
        await topic.save();
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after video addition');
        res.status(201).json(topic);
    } catch (error) {
        console.error('Error adding video:', error);
        res.status(400).json({ error: error.message });
    }
});

// Update video in topic
router.put('/admin/topics/:topicId/videos/:videoId', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findById(req.params.topicId);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        const video = topic.learn.videos.id(req.params.videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        
        Object.assign(video, req.body);
        await topic.save();
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after video update');
        res.json(topic);
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete video from topic
router.delete('/admin/topics/:topicId/videos/:videoId', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findById(req.params.topicId);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        topic.learn.videos.pull(req.params.videoId);
        await topic.save();
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after video deletion');
        res.json(topic);
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ error: error.message });
    }
});

// ========== Sheets Management ==========

// Add sheet to topic
router.post('/admin/topics/:topicId/sheets', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findById(req.params.topicId);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        if (!topic.learn) {
            topic.learn = { videos: [], sheets: [], exercises: [] };
        }
        
        topic.learn.sheets.push(req.body);
        await topic.save();
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after sheet addition');
        res.status(201).json(topic);
    } catch (error) {
        console.error('Error adding sheet:', error);
        res.status(400).json({ error: error.message });
    }
});

// Update sheet in topic
router.put('/admin/topics/:topicId/sheets/:sheetId', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findById(req.params.topicId);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        const sheet = topic.learn.sheets.id(req.params.sheetId);
        if (!sheet) {
            return res.status(404).json({ error: 'Sheet not found' });
        }
        
        Object.assign(sheet, req.body);
        await topic.save();
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after sheet update');
        res.json(topic);
    } catch (error) {
        console.error('Error updating sheet:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete sheet from topic
router.delete('/admin/topics/:topicId/sheets/:sheetId', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findById(req.params.topicId);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        topic.learn.sheets.pull(req.params.sheetId);
        await topic.save();
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after sheet deletion');
        res.json(topic);
    } catch (error) {
        console.error('Error deleting sheet:', error);
        res.status(500).json({ error: error.message });
    }
});

// ========== Exercise Sets Management ==========

// Add exercise set to topic
router.post('/admin/topics/:topicId/exercise-sets', async (req, res) => {
    try {
        console.log('📝 Adding exercise set. Request body:', req.body);
        
        // Validate required fields
        if (!req.body.exerciseName || req.body.exerciseName.trim() === '') {
            return res.status(400).json({ error: 'Exercise set name is required' });
        }
        
        // Create the exercise set object
        const newExerciseSet = {
            exerciseName: req.body.exerciseName.trim(),
            description: req.body.description ? req.body.description.trim() : '',
            order: typeof req.body.order === 'number' ? req.body.order : 0,
            questions: []
        };
        
        console.log('📦 Creating exercise set:', newExerciseSet);
        
        // Use findByIdAndUpdate with $push for better nested array handling
        const topic = await SelfLearnTopic.findByIdAndUpdate(
            req.params.topicId,
            {
                $push: { 'learn.exercises': newExerciseSet }
            },
            { 
                new: true, // Return updated document
                runValidators: true, // Run schema validators
                upsert: false
            }
        );
        
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        console.log('✅ Exercise set saved successfully. Total sets:', topic.learn.exercises.length);
        
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after exercise set addition');
        
        res.status(201).json(topic);
    } catch (error) {
        console.error('❌ Error adding exercise set:', error);
        console.error('Error details:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Update exercise set
router.put('/admin/topics/:topicId/exercise-sets/:setId', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findById(req.params.topicId);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        const exerciseSet = topic.learn.exercises.id(req.params.setId);
        if (!exerciseSet) {
            return res.status(404).json({ error: 'Exercise set not found' });
        }
        
        if (req.body.exerciseName) exerciseSet.exerciseName = req.body.exerciseName;
        if (req.body.description !== undefined) exerciseSet.description = req.body.description;
        if (req.body.order !== undefined) exerciseSet.order = req.body.order;
        
        await topic.save();
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after exercise set update');
        res.json(topic);
    } catch (error) {
        console.error('Error updating exercise set:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete exercise set
router.delete('/admin/topics/:topicId/exercise-sets/:setId', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findById(req.params.topicId);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        topic.learn.exercises.pull(req.params.setId);
        await topic.save();
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after exercise set deletion');
        res.json(topic);
    } catch (error) {
        console.error('Error deleting exercise set:', error);
        res.status(500).json({ error: error.message });
    }
});

// ========== Questions within Exercise Sets Management ==========

// Add question to exercise set
router.post('/admin/topics/:topicId/exercise-sets/:setId/questions', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findById(req.params.topicId);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        const exerciseSet = topic.learn.exercises.id(req.params.setId);
        if (!exerciseSet) {
            return res.status(404).json({ error: 'Exercise set not found' });
        }
        
        exerciseSet.questions.push(req.body);
        await topic.save();
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after question addition');
        res.status(201).json(topic);
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(400).json({ error: error.message });
    }
});

// Update question in exercise set
router.put('/admin/topics/:topicId/exercise-sets/:setId/questions/:questionId', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findById(req.params.topicId);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        const exerciseSet = topic.learn.exercises.id(req.params.setId);
        if (!exerciseSet) {
            return res.status(404).json({ error: 'Exercise set not found' });
        }
        
        const question = exerciseSet.questions.id(req.params.questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        Object.assign(question, req.body);
        await topic.save();
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after question update');
        res.json(topic);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete question from exercise set
router.delete('/admin/topics/:topicId/exercise-sets/:setId/questions/:questionId', async (req, res) => {
    try {
        const topic = await SelfLearnTopic.findById(req.params.topicId);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        const exerciseSet = topic.learn.exercises.id(req.params.setId);
        if (!exerciseSet) {
            return res.status(404).json({ error: 'Exercise set not found' });
        }
        
        exerciseSet.questions.pull(req.params.questionId);
        await topic.save();
        clearCache('self-learn');
        console.log('✅ Self Learn cache cleared after question deletion');
        res.json(topic);
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
