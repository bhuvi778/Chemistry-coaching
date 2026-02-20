const mongoose = require('mongoose');
const NCERTChapter = require('../models/NCERTChapter');
const NCERTBadge = require('../models/NCERTBadge');
const NCERTQuestion = require('../models/NCERTQuestion');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reaction-lab';

async function addClassLevelToNCERT() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Update Chapters without classLevel
        const chaptersUpdated = await NCERTChapter.updateMany(
            { classLevel: { $exists: false } },
            { $set: { classLevel: '11' } }
        );
        console.log(`✅ Updated ${chaptersUpdated.modifiedCount} chapters with default classLevel: 11`);

        // Update Badges without classLevel
        const badgesUpdated = await NCERTBadge.updateMany(
            { classLevel: { $exists: false } },
            { $set: { classLevel: '11' } }
        );
        console.log(`✅ Updated ${badgesUpdated.modifiedCount} badges with default classLevel: 11`);

        // Update Questions without classLevel
        const questionsUpdated = await NCERTQuestion.updateMany(
            { classLevel: { $exists: false } },
            { $set: { classLevel: '11' } }
        );
        console.log(`✅ Updated ${questionsUpdated.modifiedCount} questions with default classLevel: 11`);

        console.log('\n📊 Summary:');
        console.log(`   Chapters: ${chaptersUpdated.modifiedCount} updated`);
        console.log(`   Badges: ${badgesUpdated.modifiedCount} updated`);
        console.log(`   Questions: ${questionsUpdated.modifiedCount} updated`);
        console.log('\n✅ Migration completed successfully!');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

addClassLevelToNCERT();
