const mongoose = require('mongoose');
const NCERTChapter = require('../models/NCERTChapter');
const NCERTBadge = require('../models/NCERTBadge');
const NCERTQuestion = require('../models/NCERTQuestion');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reaction-lab';

async function checkNCERTData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Check Chapters
        const totalChapters = await NCERTChapter.countDocuments();
        const chaptersWithClass = await NCERTChapter.countDocuments({ classLevel: { $exists: true } });
        const chaptersWithoutClass = await NCERTChapter.countDocuments({ classLevel: { $exists: false } });

        console.log('📚 NCERT Chapters:');
        console.log(`   Total: ${totalChapters}`);
        console.log(`   With classLevel: ${chaptersWithClass}`);
        console.log(`   Without classLevel: ${chaptersWithoutClass}`);

        if (totalChapters > 0) {
            const sampleChapter = await NCERTChapter.findOne();
            console.log(`   Sample chapter classLevel: ${sampleChapter?.classLevel || 'NOT SET'}`);
        }

        // Check Badges
        const totalBadges = await NCERTBadge.countDocuments();
        const badgesWithClass = await NCERTBadge.countDocuments({ classLevel: { $exists: true } });
        const badgesWithoutClass = await NCERTBadge.countDocuments({ classLevel: { $exists: false } });

        console.log('\n🏅 NCERT Badges:');
        console.log(`   Total: ${totalBadges}`);
        console.log(`   With classLevel: ${badgesWithClass}`);
        console.log(`   Without classLevel: ${badgesWithoutClass}`);

        if (totalBadges > 0) {
            const sampleBadge = await NCERTBadge.findOne();
            console.log(`   Sample badge classLevel: ${sampleBadge?.classLevel || 'NOT SET'}`);
        }

        // Check Questions
        const totalQuestions = await NCERTQuestion.countDocuments();
        const questionsWithClass = await NCERTQuestion.countDocuments({ classLevel: { $exists: true } });
        const questionsWithoutClass = await NCERTQuestion.countDocuments({ classLevel: { $exists: false } });

        console.log('\n❓ NCERT Questions:');
        console.log(`   Total: ${totalQuestions}`);
        console.log(`   With classLevel: ${questionsWithClass}`);
        console.log(`   Without classLevel: ${questionsWithoutClass}`);

        if (totalQuestions > 0) {
            const sampleQuestion = await NCERTQuestion.findOne();
            console.log(`   Sample question classLevel: ${sampleQuestion?.classLevel || 'NOT SET'}`);
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Check failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

checkNCERTData();
