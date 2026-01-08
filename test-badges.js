// Quick test script to check if badges are in the database
import mongoose from 'mongoose';
import ConceptChapter from './server/models/ConceptChapter.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reaction-lab';

async function checkBadges() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const chapters = await ConceptChapter.find({}).lean();
        console.log(`\n📊 Found ${chapters.length} chapters in database\n`);

        if (chapters.length === 0) {
            console.log('⚠️  No chapters found in database. Please create some chapters first.');
        }

        chapters.forEach((chapter, index) => {
            console.log(`Chapter ${index + 1}:`);
            console.log(`  - Name: ${chapter.chapterName}`);
            console.log(`  - Subject: ${chapter.subject}`);
            console.log(`  - Badges: "${chapter.badges}" (type: ${typeof chapter.badges})`);
            console.log(`  - Has badges field: ${chapter.hasOwnProperty('badges') ? 'YES' : 'NO'}`);
            console.log(`  - Badges is truthy: ${!!chapter.badges ? 'YES' : 'NO'}`);
            console.log(`  - Badges is empty string: ${chapter.badges === '' ? 'YES' : 'NO'}`);
            console.log('---');
        });

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkBadges();
