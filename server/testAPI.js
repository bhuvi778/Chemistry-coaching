const axios = require('axios');

async function testAPI() {
    try {
        const API_URL = 'http://localhost:5000/api';

        console.log('🌐 Testing API endpoint...\n');

        // Get chapters first
        const chaptersResponse = await axios.get(`${API_URL}/assertion-reason/chapters?userId=test-user`);
        const chapters = chaptersResponse.data.chapters;

        if (chapters.length === 0) {
            console.log('❌ No chapters found');
            return;
        }

        const firstChapter = chapters[0];
        console.log(`📚 Testing with chapter: ${firstChapter.name}`);
        console.log(`   Chapter ID: ${firstChapter._id}\n`);

        // Get questions for this chapter
        const questionsResponse = await axios.get(
            `${API_URL}/assertion-reason/chapters/${firstChapter._id}/questions?userId=test-user&mode=all`
        );

        const questions = questionsResponse.data.questions;
        console.log(`📝 Received ${questions.length} questions\n`);

        if (questions.length > 0) {
            const firstQuestion = questions[0];
            console.log('🔍 First Question from API:');
            console.log('   ID:', firstQuestion._id);
            console.log('   Assertion:', firstQuestion.assertion.substring(0, 60) + '...');
            console.log('   Reason:', firstQuestion.reason.substring(0, 60) + '...');
            console.log('   Has explanation field?', 'explanation' in firstQuestion ? '✅ YES' : '❌ NO');
            console.log('   Explanation value:', firstQuestion.explanation || '(empty)');

            if (firstQuestion.explanation) {
                console.log('\n✅ SUCCESS! Explanation is being sent by the API');
            } else {
                console.log('\n⚠️  Explanation field exists but is empty');
            }
        }

    } catch (error) {
        console.error('❌ API Error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testAPI();
