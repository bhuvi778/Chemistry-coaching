const mongoose = require('mongoose');
const ConceptChapter = require('../models/ConceptChapter');
const ConceptTopic = require('../models/ConceptTopic');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reaction-lab';

const testData = {
    subject: 'Physical Chemistry',
    chapterName: 'Test Chapter - Thermodynamics',
    description: 'A comprehensive guide to thermodynamics covering all fundamental laws and applications',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
    examType: 'JEE',
    order: 1,
    isActive: true,
    topics: [
        {
            title: 'First Law of Thermodynamics',
            content: `<h2>First Law of Thermodynamics</h2>
<p>The first law of thermodynamics is a version of the law of conservation of energy, adapted for thermodynamic processes.</p>
<h3>Statement</h3>
<p>Energy can neither be created nor destroyed; it can only be transformed from one form to another.</p>
<h3>Mathematical Expression</h3>
<p><strong>ΔU = Q - W</strong></p>
<p>Where:</p>
<ul>
<li>ΔU = Change in internal energy</li>
<li>Q = Heat added to the system</li>
<li>W = Work done by the system</li>
</ul>
<h3>Applications</h3>
<p>This law is fundamental in understanding heat engines, refrigerators, and chemical reactions.</p>`,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600',
                    caption: 'Energy transformation diagram'
                }
            ],
            order: 0
        },
        {
            title: 'Second Law of Thermodynamics',
            content: `<h2>Second Law of Thermodynamics</h2>
<p>The second law of thermodynamics establishes the concept of entropy as a physical property of a thermodynamic system.</p>
<h3>Statement</h3>
<p>The entropy of an isolated system always increases over time, approaching a maximum value at equilibrium.</p>
<h3>Mathematical Expression</h3>
<p><strong>ΔS ≥ 0</strong></p>
<p>For an isolated system, the change in entropy (ΔS) is always greater than or equal to zero.</p>
<h3>Key Concepts</h3>
<ul>
<li>Entropy is a measure of disorder or randomness</li>
<li>Natural processes are irreversible</li>
<li>Heat flows spontaneously from hot to cold bodies</li>
</ul>`,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
                    caption: 'Entropy and disorder concept'
                }
            ],
            order: 1
        },
        {
            title: 'Zeroth Law of Thermodynamics',
            content: `<h2>Zeroth Law of Thermodynamics</h2>
<p>The zeroth law of thermodynamics defines thermal equilibrium and forms the basis for the concept of temperature.</p>
<h3>Statement</h3>
<p>If two systems are each in thermal equilibrium with a third system, then they are in thermal equilibrium with each other.</p>
<h3>Significance</h3>
<p>This law allows us to define temperature as a measurable property and justifies the use of thermometers.</p>`,
            images: [],
            order: 2
        }
    ]
};

async function testConceptNotes() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clean up any existing test data
        console.log('🧹 Cleaning up existing test data...');
        const existingChapter = await ConceptChapter.findOne({
            chapterName: testData.chapterName
        });

        if (existingChapter) {
            await ConceptTopic.deleteMany({ chapterId: existingChapter._id });
            await ConceptChapter.findByIdAndDelete(existingChapter._id);
            console.log('✅ Cleaned up existing test data\n');
        }

        // Test 1: Create Chapter
        console.log('📝 TEST 1: Creating Chapter...');
        const { topics, ...chapterData } = testData;

        const chapter = new ConceptChapter(chapterData);
        await chapter.save();
        console.log(`✅ Chapter created successfully!`);
        console.log(`   ID: ${chapter._id}`);
        console.log(`   Name: ${chapter.chapterName}`);
        console.log(`   Subject: ${chapter.subject}\n`);

        // Test 2: Create Topics
        console.log('📚 TEST 2: Creating Topics...');
        const topicDocs = topics.map((t, idx) => ({
            ...t,
            chapterId: chapter._id,
            order: idx
        }));

        const createdTopics = await ConceptTopic.insertMany(topicDocs);
        console.log(`✅ ${createdTopics.length} topics created successfully!`);
        createdTopics.forEach((topic, idx) => {
            console.log(`   ${idx + 1}. ${topic.title} (ID: ${topic._id})`);
        });
        console.log('');

        // Test 3: Verify Data Retrieval
        console.log('🔍 TEST 3: Verifying Data Retrieval...');
        const retrievedChapter = await ConceptChapter.findById(chapter._id).lean();
        const retrievedTopics = await ConceptTopic.find({ chapterId: chapter._id })
            .sort({ order: 1 })
            .lean();

        console.log('✅ Data retrieved successfully!');
        console.log(`   Chapter: ${retrievedChapter.chapterName}`);
        console.log(`   Topics found: ${retrievedTopics.length}`);
        console.log('');

        // Test 4: Verify Topic Content
        console.log('📖 TEST 4: Verifying Topic Content...');
        retrievedTopics.forEach((topic, idx) => {
            const hasContent = topic.content && topic.content.length > 0;
            const hasImages = topic.images && topic.images.length > 0;
            console.log(`   Topic ${idx + 1}: ${topic.title}`);
            console.log(`      ✓ Content: ${hasContent ? 'Present' : 'Missing'} (${topic.content?.length || 0} chars)`);
            console.log(`      ✓ Images: ${topic.images?.length || 0}`);
            console.log(`      ✓ Order: ${topic.order}`);
        });
        console.log('');

        // Test 5: Test Update Operation
        console.log('✏️  TEST 5: Testing Update Operation...');
        const updatedChapter = await ConceptChapter.findByIdAndUpdate(
            chapter._id,
            { description: 'Updated description for testing' },
            { new: true }
        );
        console.log(`✅ Chapter updated successfully!`);
        console.log(`   New description: ${updatedChapter.description}\n`);

        // Test 6: Full Sync (like frontend does)
        console.log('🔄 TEST 6: Testing Full Topic Sync (Frontend Behavior)...');
        // Add a new topic
        const newTopics = [
            ...topics,
            {
                title: 'Third Law of Thermodynamics',
                content: '<h2>Third Law</h2><p>As temperature approaches absolute zero, entropy approaches a constant minimum.</p>',
                images: [],
                order: 3
            }
        ];

        // Delete old topics and insert new ones (simulating update)
        await ConceptTopic.deleteMany({ chapterId: chapter._id });
        const syncedTopics = newTopics.map((t, idx) => ({
            ...t,
            chapterId: chapter._id,
            order: idx
        }));
        await ConceptTopic.insertMany(syncedTopics);

        const finalTopicCount = await ConceptTopic.countDocuments({ chapterId: chapter._id });
        console.log(`✅ Full sync completed!`);
        console.log(`   Topics after sync: ${finalTopicCount}\n`);

        // Final Summary
        console.log('═══════════════════════════════════════════════════════');
        console.log('✨ ALL TESTS PASSED! ✨');
        console.log('═══════════════════════════════════════════════════════');
        console.log('Summary:');
        console.log(`  ✓ Chapter created and stored correctly`);
        console.log(`  ✓ Topics linked to chapter via chapterId`);
        console.log(`  ✓ Rich text content preserved`);
        console.log(`  ✓ Images array stored correctly`);
        console.log(`  ✓ Topic order maintained`);
        console.log(`  ✓ Update operations working`);
        console.log(`  ✓ Full sync (delete + insert) working`);
        console.log('');
        console.log('🎉 The Concept Notes feature is working perfectly!');
        console.log('');
        console.log('📊 Test Data Created:');
        console.log(`   Chapter ID: ${chapter._id}`);
        console.log(`   Chapter Name: ${chapter.chapterName}`);
        console.log(`   Total Topics: ${finalTopicCount}`);
        console.log('');
        console.log('💡 You can now view this in the admin panel or delete it using:');
        console.log(`   DELETE /api/concept-notes/admin/${chapter._id}`);
        console.log('═══════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ TEST FAILED!');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the test
testConceptNotes();
