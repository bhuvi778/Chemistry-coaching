
const API_URL = 'http://localhost:5000/api/free-quizzes';

async function listQuizzes() {
    console.log('🔍 Listing Free Quizzes...');
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Found ${data.length} quizzes.`);
            if (data.length > 0) {
                console.log('First quiz:', JSON.stringify(data[0], null, 2));
            } else {
                console.log('⚠️ Database appears empty via API.');
            }
        } else {
            console.error('❌ Failed to fetch. Status:', response.status);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

listQuizzes();
