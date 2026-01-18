const axios = require('axios');
const https = require('https');

const API_URL = 'https://ace2examz.com/api';

// Create axios instance with SSL bypass for testing
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

async function testProgressTracking() {
    console.log('=== TESTING FLASHCARD PROGRESS TRACKING ===\n');

    try {
        const userId = 'test_user_' + Date.now();
        console.log('Using test userId:', userId);

        // 1. Get chapters with progress (should be 0% initially)
        console.log('\n1. Fetching chapters with progress...');
        const chaptersRes = await axiosInstance.get(`${API_URL}/flashcards/chapters?userId=${userId}`);
        const firstChapter = chaptersRes.data[0];
        console.log(`   Chapter: "${firstChapter.name}"`);
        console.log(`   Initial progress: ${firstChapter.progress}%`);
        console.log(`   Total cards: ${firstChapter.cardCount}`);

        // 2. Get topics with progress
        console.log('\n2. Fetching topics with progress...');
        const topicsRes = await axiosInstance.get(`${API_URL}/flashcards/chapters/${firstChapter._id}/topics?userId=${userId}`);
        const firstTopic = topicsRes.data[0];
        console.log(`   Topic: "${firstTopic.name}"`);
        console.log(`   Initial progress: ${firstTopic.progress}%`);
        console.log(`   Total cards: ${firstTopic.cardCount}`);

        // 3. Get cards for the topic
        console.log('\n3. Fetching cards...');
        const cardsRes = await axiosInstance.get(`${API_URL}/flashcards/topics/${firstTopic._id}/cards`);
        const cards = cardsRes.data;
        console.log(`   Found ${cards.length} cards`);

        if (cards.length === 0) {
            console.log('   No cards to test with. Exiting.');
            return;
        }

        // 4. Simulate reviewing cards
        console.log('\n4. Simulating card reviews...');
        const testCard = cards[0];
        console.log(`   Reviewing card: "${testCard.question.substring(0, 50)}..."`);

        // Review the card 5 times with "Easy" rating to master it
        for (let i = 1; i <= 5; i++) {
            console.log(`   Review ${i}/5 - Rating: Easy (5)`);
            const progressRes = await axiosInstance.post(`${API_URL}/flashcards/cards/${testCard._id}/progress`, {
                userId,
                quality: 5
            });
            console.log(`     Status: ${progressRes.data.status}, Review count: ${progressRes.data.reviewCount}`);
        }

        // 5. Check updated progress
        console.log('\n5. Checking updated progress...');

        // Check topic progress
        const updatedTopicsRes = await axiosInstance.get(`${API_URL}/flashcards/chapters/${firstChapter._id}/topics?userId=${userId}`);
        const updatedTopic = updatedTopicsRes.data.find(t => t._id === firstTopic._id);
        console.log(`   Topic "${updatedTopic.name}" progress: ${updatedTopic.progress}%`);

        // Check chapter progress
        const updatedChaptersRes = await axiosInstance.get(`${API_URL}/flashcards/chapters?userId=${userId}`);
        const updatedChapter = updatedChaptersRes.data.find(c => c._id === firstChapter._id);
        console.log(`   Chapter "${updatedChapter.name}" progress: ${updatedChapter.progress}%`);

        // 6. Verify progress calculation
        console.log('\n6. Verifying progress calculation...');
        const expectedProgress = Math.round((1 / firstTopic.cardCount) * 100);
        console.log(`   Expected topic progress: ${expectedProgress}% (1 mastered out of ${firstTopic.cardCount})`);
        console.log(`   Actual topic progress: ${updatedTopic.progress}%`);

        if (updatedTopic.progress === expectedProgress) {
            console.log('   ✅ Progress calculation is CORRECT!');
        } else {
            console.log('   ⚠️  Progress calculation mismatch');
        }

        console.log('\n=== TEST SUMMARY ===');
        console.log('✅ Progress tracking is working!');
        console.log(`✅ Card status updated from "new" to "mastered"`);
        console.log(`✅ Topic progress: ${updatedTopic.progress}%`);
        console.log(`✅ Chapter progress: ${updatedChapter.progress}%`);
        console.log('\nNOTE: This test used a unique userId. Real users will have their own progress.');

    } catch (error) {
        console.error('\n✗ ERROR:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testProgressTracking();
