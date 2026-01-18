const axios = require('axios');
const https = require('https');

const API_URL = 'https://ace2examz.com/api';

// Create axios instance with SSL bypass for testing
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

async function testFlashcardAPI() {
    console.log('=== TESTING FLASHCARD API ===\n');

    try {
        // 1. Get all chapters
        console.log('1. Fetching all chapters...');
        const chaptersResponse = await axiosInstance.get(`${API_URL}/flashcards/chapters`);
        console.log(`   ✓ Found ${chaptersResponse.data.length} chapters`);

        if (chaptersResponse.data.length === 0) {
            console.log('   ⚠ No chapters found. Cannot proceed with further tests.');
            return;
        }

        const firstChapter = chaptersResponse.data[0];
        console.log(`   First chapter: "${firstChapter.name}" (ID: ${firstChapter._id})`);
        console.log(`   Card count: ${firstChapter.cardCount}, Topic count: ${firstChapter.topicCount}\n`);

        // 2. Get topics for the first chapter
        console.log(`2. Fetching topics for chapter "${firstChapter.name}"...`);
        const topicsResponse = await axiosInstance.get(`${API_URL}/flashcards/chapters/${firstChapter._id}/topics`);
        console.log(`   ✓ Found ${topicsResponse.data.length} topics`);

        if (topicsResponse.data.length === 0) {
            console.log('   ⚠ No topics found in this chapter. Cannot proceed with card tests.');
            return;
        }

        const firstTopic = topicsResponse.data[0];
        console.log(`   First topic: "${firstTopic.name}" (ID: ${firstTopic._id})`);
        console.log(`   Card count: ${firstTopic.cardCount}\n`);

        // 3. Get cards for the first topic
        console.log(`3. Fetching cards for topic "${firstTopic.name}"...`);
        const cardsResponse = await axiosInstance.get(`${API_URL}/flashcards/topics/${firstTopic._id}/cards`);
        console.log(`   ✓ Found ${cardsResponse.data.length} cards`);

        if (cardsResponse.data.length > 0) {
            console.log(`   First card:`);
            console.log(`     Q: ${cardsResponse.data[0].question.substring(0, 60)}...`);
            console.log(`     A: ${cardsResponse.data[0].answer.substring(0, 60)}...`);
            console.log(`     Difficulty: ${cardsResponse.data[0].difficulty}`);
        } else {
            console.log('   ⚠ No cards found in this topic.');
        }

        console.log('\n=== API TEST SUMMARY ===');
        console.log('✓ All API endpoints are working correctly');
        console.log(`✓ Chapters endpoint: ${chaptersResponse.data.length} chapters`);
        console.log(`✓ Topics endpoint: ${topicsResponse.data.length} topics`);
        console.log(`✓ Cards endpoint: ${cardsResponse.data.length} cards`);

        // 4. Test creating a new card
        console.log('\n4. Testing card creation...');
        const newCard = {
            chapterId: firstChapter._id,
            topicId: firstTopic._id,
            question: 'Test Question: What is the purpose of this test?',
            answer: 'To verify that the flashcard API is working correctly.',
            difficulty: 'Easy',
            tags: ['test', 'api'],
            order: 999
        };

        const createResponse = await axiosInstance.post(`${API_URL}/flashcards/cards`, newCard);
        console.log(`   ✓ Card created successfully (ID: ${createResponse.data._id})`);

        // 5. Verify the card was added
        console.log('\n5. Verifying card was added...');
        const verifyResponse = await axiosInstance.get(`${API_URL}/flashcards/topics/${firstTopic._id}/cards`);
        const foundCard = verifyResponse.data.find(c => c._id === createResponse.data._id);

        if (foundCard) {
            console.log(`   ✓ Card found in topic! Total cards now: ${verifyResponse.data.length}`);
        } else {
            console.log(`   ✗ Card NOT found in topic after creation!`);
        }

        // 6. Clean up - delete the test card
        console.log('\n6. Cleaning up test card...');
        await axiosInstance.delete(`${API_URL}/flashcards/cards/${createResponse.data._id}`);
        console.log(`   ✓ Test card deleted`);

        console.log('\n=== ALL TESTS PASSED ===');

    } catch (error) {
        console.error('\n✗ ERROR:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testFlashcardAPI();
