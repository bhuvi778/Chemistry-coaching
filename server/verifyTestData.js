// Verify Test Data Script
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const ConceptChapter = require('./models/ConceptChapter');
const ConceptTopic = require('./models/ConceptTopic');

const verifyData = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test';
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find the test chapter
        const testChapter = await ConceptChapter.findOne({
            chapterName: 'Test Chapter - Thermodynamics Basics'
        });

        if (!testChapter) {
            console.log('❌ Test chapter not found in database');
            console.log('📊 Total chapters in database:', await ConceptChapter.countDocuments());

            // List all chapters
            const allChapters = await ConceptChapter.find().select('chapterName subject');
            console.log('\n📚 Existing chapters:');
            allChapters.forEach(ch => {
                console.log(`   - ${ch.chapterName} (${ch.subject})`);
            });
        } else {
            console.log('✅ Test chapter found!');
            console.log('   ID:', testChapter._id);
            console.log('   Name:', testChapter.chapterName);
            console.log('   Subject:', testChapter.subject);

            // Find topics for this chapter
            const topics = await ConceptTopic.find({ chapterId: testChapter._id });
            console.log(`\n✅ Found ${topics.length} topics:`);

            topics.forEach((topic, idx) => {
                console.log(`\n   Topic ${idx + 1}: ${topic.title}`);
                console.log(`   - Concepts: ${topic.concepts?.length || 0}`);

                topic.concepts?.forEach((concept, cIdx) => {
                    const qCount = concept.practiceQuestions?.length || 0;
                    console.log(`     ${cIdx + 1}. ${concept.conceptName} (${qCount} questions)`);
                });
            });

            console.log('\n✅ Test data is in the database!');
            console.log('🔗 Access it at: Physical Chemistry → Test Chapter - Thermodynamics Basics');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    }
};

verifyData();
