const mongoose = require('mongoose');
const PYQChapter = require('../models/PYQChapter');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chemistry_coaching';

async function checkIsActive() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const allChapters = await PYQChapter.find();
        console.log('📚 All Chapters:');
        allChapters.forEach((ch, i) => {
            console.log(`${i + 1}. ${ch.chapterName}`);
            console.log(`   isActive: ${ch.isActive}`);
            console.log(`   examName: ${ch.examName}`);
            console.log('');
        });

        const activeChapters = await PYQChapter.find({ isActive: true });
        console.log(`\n✅ Active chapters: ${activeChapters.length}`);

        const inactiveChapters = await PYQChapter.find({ isActive: false });
        console.log(`❌ Inactive chapters: ${inactiveChapters.length}`);

        const noIsActive = await PYQChapter.find({ isActive: { $exists: false } });
        console.log(`⚠️  Chapters without isActive field: ${noIsActive.length}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Check failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

checkIsActive();
