const mongoose = require('mongoose');
const NTAAbhyas = require('../models/NTAAbhyas');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chemistry_coaching';

async function updateNTAAbhyasClassLevel() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        console.log('🔄 Updating NTA Abhyas questions with classLevel field...\n');

        // Update ALL NTA Abhyas questions - set classLevel to '11' if missing or null
        const result = await NTAAbhyas.updateMany(
            { $or: [{ classLevel: { $exists: false } }, { classLevel: null }, { classLevel: '' }] },
            { $set: { classLevel: '11' } }
        );

        console.log(`📊 Update Results:`);
        console.log(`   - Matched: ${result.matchedCount} questions`);
        console.log(`   - Modified: ${result.modifiedCount} questions`);

        // Verify the updates
        console.log('\n🔍 Verification:');
        const totalQuestions = await NTAAbhyas.countDocuments();
        const withClassLevel = await NTAAbhyas.countDocuments({ classLevel: { $exists: true, $ne: null, $ne: '' } });
        console.log(`   Total Questions: ${totalQuestions}`);
        console.log(`   With classLevel: ${withClassLevel}`);

        // Show updated chapters
        const chapters = await NTAAbhyas.aggregate([
            {
                $group: {
                    _id: {
                        examCategory: '$examCategory',
                        chapter: '$chapter'
                    },
                    classLevel: { $first: '$classLevel' },
                    questionCount: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.examCategory': 1, '_id.chapter': 1 }
            }
        ]);

        console.log('\n📚 Updated Chapters:');
        chapters.forEach((ch, index) => {
            console.log(`${index + 1}. ${ch._id.examCategory} - ${ch._id.chapter}`);
            console.log(`   Class Level: ${ch.classLevel}`);
            console.log(`   Questions: ${ch.questionCount}`);
        });

        console.log('\n✅ Migration completed successfully!');
        console.log('\n📝 Next Steps:');
        console.log('   1. Refresh your browser to see the class tags');
        console.log('   2. All NTA Abhyas chapters should now show "Class 11" badge');
        console.log('   3. You can edit individual questions to change them to Class 12 if needed');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

updateNTAAbhyasClassLevel();
