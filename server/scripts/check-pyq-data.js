const mongoose = require('mongoose');
const PYQChapter = require('../models/PYQChapter');
const PYQTopic = require('../models/PYQTopic');
const PYQQuestion = require('../models/PYQQuestion');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chemistry_coaching';

async function checkPYQData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Check chapters
        const chapters = await PYQChapter.find().select('examName subject chapterName chapterNumber');
        console.log(`📚 PYQ Chapters: ${chapters.length}`);
        chapters.forEach((ch, i) => {
            console.log(`  ${i + 1}. [${ch.examName}] ${ch.subject} - ${ch.chapterName} (${ch.chapterNumber || 'No number'})`);
        });

        // Check topics
        const topics = await PYQTopic.find().populate('chapterId', 'chapterName');
        console.log(`\n📝 PYQ Topics: ${topics.length}`);
        topics.forEach((t, i) => {
            console.log(`  ${i + 1}. ${t.topicName} (Chapter: ${t.chapterId?.chapterName || 'Unknown'})`);
        });

        // Check questions
        const questions = await PYQQuestion.find().populate('topicId', 'topicName');
        console.log(`\n❓ PYQ Questions: ${questions.length}`);
        questions.forEach((q, i) => {
            console.log(`  ${i + 1}. ${q.question?.substring(0, 50)}... (Topic: ${q.topicId?.topicName || 'Unknown'})`);
        });

        console.log('\n📊 Summary:');
        console.log(`   Chapters: ${chapters.length}`);
        console.log(`   Topics: ${topics.length}`);
        console.log(`   Questions: ${questions.length}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Check failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

checkPYQData();
