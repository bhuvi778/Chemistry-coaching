const mongoose = require('mongoose');
const NTAAbhyas = require('../models/NTAAbhyas');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chemistry_coaching';

async function checkNTAAbhyasData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get all unique chapters
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

        console.log('📊 NTA Abhyas Chapters:\n');

        if (chapters.length === 0) {
            console.log('❌ No chapters found!');
        } else {
            chapters.forEach((ch, index) => {
                console.log(`${index + 1}. ${ch._id.examCategory} - ${ch._id.chapter}`);
                console.log(`   Class Level: ${ch.classLevel || '❌ NOT SET'}`);
                console.log(`   Questions: ${ch.questionCount}`);
                console.log('');
            });
        }

        const totalQuestions = await NTAAbhyas.countDocuments();
        const withClassLevel = await NTAAbhyas.countDocuments({ classLevel: { $exists: true, $ne: null } });
        const withoutClassLevel = await NTAAbhyas.countDocuments({ $or: [{ classLevel: { $exists: false } }, { classLevel: null }] });

        console.log(`\n📊 Summary:`);
        console.log(`   Total Questions: ${totalQuestions}`);
        console.log(`   With classLevel: ${withClassLevel}`);
        console.log(`   Without classLevel: ${withoutClassLevel}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Check failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

checkNTAAbhyasData();
