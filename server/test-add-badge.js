import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Simple schema definitions for testing
const conceptChapterSchema = new mongoose.Schema({
    subject: String,
    chapterName: String,
    description: String,
    thumbnailUrl: String,
    examType: String,
    badges: String,
    order: Number,
    isActive: Boolean
}, { timestamps: true });

const ConceptChapter = mongoose.model('ConceptChapter', conceptChapterSchema);

async function testBadges() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reaction-lab';
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all chapters
        const chapters = await ConceptChapter.find({}).lean();
        console.log(`📊 Found ${chapters.length} chapters in database\n`);

        if (chapters.length === 0) {
            console.log('⚠️  No chapters found. Please create a chapter first through the admin panel.');
            await mongoose.disconnect();
            return;
        }

        // Display current badge status
        console.log('📋 Current Badge Status:');
        console.log('─'.repeat(80));
        chapters.forEach((ch, index) => {
            const hasBadge = ch.badges && ch.badges.trim() !== '';
            console.log(`${index + 1}. ${ch.chapterName}`);
            console.log(`   Subject: ${ch.subject}`);
            console.log(`   Badge: ${hasBadge ? `"${ch.badges}" ✅` : '(empty) ❌'}`);
            console.log(`   Active: ${ch.isActive ? 'Yes' : 'No'}`);
            console.log('');
        });
        console.log('─'.repeat(80));

        // Find first chapter without a badge and add one
        const chapterWithoutBadge = chapters.find(ch => !ch.badges || ch.badges.trim() === '');

        if (chapterWithoutBadge) {
            console.log('\n🔧 Adding test badge to first chapter without one...');
            console.log(`   Chapter: "${chapterWithoutBadge.chapterName}"`);

            const result = await ConceptChapter.findByIdAndUpdate(
                chapterWithoutBadge._id,
                { badges: 'New' },
                { new: true }
            );

            console.log(`✅ Badge added successfully!`);
            console.log(`   Chapter: "${result.chapterName}"`);
            console.log(`   Badge: "${result.badges}"`);
            console.log('\n💡 Now check the frontend to see if the badge displays!');
        } else {
            console.log('\n✅ All chapters already have badges!');
            console.log('   You can verify them on the frontend.');
        }

        // Summary
        const chaptersWithBadges = chapters.filter(ch => ch.badges && ch.badges.trim() !== '');
        console.log('\n📊 Summary:');
        console.log(`   Total chapters: ${chapters.length}`);
        console.log(`   Chapters with badges: ${chaptersWithBadges.length}`);
        console.log(`   Chapters without badges: ${chapters.length - chaptersWithBadges.length}`);

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        console.log('\n🎯 Next Steps:');
        console.log('   1. Open the frontend: https://ace2examz.com/concept-wise-notes');
        console.log('   2. Press F12 to open browser console');
        console.log('   3. Look for badge debug messages');
        console.log('   4. Verify pink pulsing badges appear on cards');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testBadges();
