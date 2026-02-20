const mongoose = require('mongoose');
const NCERTChapter = require('../models/NCERTChapter');
const NCERTBadge = require('../models/NCERTBadge');
const NCERTQuestion = require('../models/NCERTQuestion');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reaction-lab';

async function updateExistingNCERTData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        console.log('🔄 Updating existing NCERT data with classLevel field...\n');

        // Update ALL Chapters - set classLevel to '11' if missing or null
        const chaptersResult = await NCERTChapter.updateMany(
            { $or: [{ classLevel: { $exists: false } }, { classLevel: null }, { classLevel: '' }] },
            { $set: { classLevel: '11' } }
        );
        console.log(`📚 Chapters:`);
        console.log(`   - Found and updated: ${chaptersResult.modifiedCount} chapters`);
        console.log(`   - Matched: ${chaptersResult.matchedCount} chapters`);

        // Update ALL Badges - set classLevel to '11' if missing or null
        const badgesResult = await NCERTBadge.updateMany(
            { $or: [{ classLevel: { $exists: false } }, { classLevel: null }, { classLevel: '' }] },
            { $set: { classLevel: '11' } }
        );
        console.log(`\n🏅 Badges:`);
        console.log(`   - Found and updated: ${badgesResult.modifiedCount} badges`);
        console.log(`   - Matched: ${badgesResult.matchedCount} badges`);

        // Update ALL Questions - set classLevel to '11' if missing or null
        const questionsResult = await NCERTQuestion.updateMany(
            { $or: [{ classLevel: { $exists: false } }, { classLevel: null }, { classLevel: '' }] },
            { $set: { classLevel: '11' } }
        );
        console.log(`\n❓ Questions:`);
        console.log(`   - Found and updated: ${questionsResult.modifiedCount} questions`);
        console.log(`   - Matched: ${questionsResult.matchedCount} questions`);

        // Verify the updates
        console.log('\n🔍 Verification:');
        const totalChapters = await NCERTChapter.countDocuments();
        const chaptersWithClass = await NCERTChapter.countDocuments({ classLevel: { $exists: true, $ne: null, $ne: '' } });
        console.log(`   Chapters: ${chaptersWithClass}/${totalChapters} now have classLevel`);

        const totalBadges = await NCERTBadge.countDocuments();
        const badgesWithClass = await NCERTBadge.countDocuments({ classLevel: { $exists: true, $ne: null, $ne: '' } });
        console.log(`   Badges: ${badgesWithClass}/${totalBadges} now have classLevel`);

        const totalQuestions = await NCERTQuestion.countDocuments();
        const questionsWithClass = await NCERTQuestion.countDocuments({ classLevel: { $exists: true, $ne: null, $ne: '' } });
        console.log(`   Questions: ${questionsWithClass}/${totalQuestions} now have classLevel`);

        console.log('\n✅ Migration completed successfully!');
        console.log('\n📝 Next Steps:');
        console.log('   1. Refresh your browser to see the class tags');
        console.log('   2. All existing cards should now show "Class 11" badge');
        console.log('   3. You can edit individual items to change them to Class 12 if needed');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

updateExistingNCERTData();
