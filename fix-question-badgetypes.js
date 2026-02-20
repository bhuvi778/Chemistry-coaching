import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ncert';

async function fixQuestionBadgeTypes() {
    console.log('🔧 Fixing question badgeType fields...\n');

    try {
        // Get all badges
        const questionsBadges = await axios.get(`${API_URL}/badges/questions`);
        const exemplarBadges = await axios.get(`${API_URL}/badges/exemplars`);
        const diagramBadges = await axios.get(`${API_URL}/badges/diagrams`);

        console.log(`Found ${questionsBadges.data.length} question badges`);
        console.log(`Found ${exemplarBadges.data.length} exemplar badges`);
        console.log(`Found ${diagramBadges.data.length} diagram badges\n`);

        // Get all questions for each category
        const questionsData = await axios.get(`${API_URL}/questions?category=questions`);
        const exemplarsData = await axios.get(`${API_URL}/questions?category=exemplars`);
        const diagramsData = await axios.get(`${API_URL}/questions?category=diagrams`);

        console.log(`Found ${questionsData.data.length} questions in 'questions' category`);
        console.log(`Found ${exemplarsData.data.length} questions in 'exemplars' category`);
        console.log(`Found ${diagramsData.data.length} questions in 'diagrams' category\n`);

        // Update questions category questions
        if (questionsData.data.length > 0 && questionsBadges.data.length > 0) {
            console.log('Updating Questions tab questions...');
            const firstBadge = questionsBadges.data.find(b => b.badgeType === 'in-text') || questionsBadges.data[0];

            for (const question of questionsData.data) {
                if (!question.badgeType) {
                    try {
                        await axios.put(`${API_URL}/questions/${question._id}`, {
                            ...question,
                            badgeType: firstBadge.badgeType
                        });
                        console.log(`  ✅ Updated question: ${question.question.substring(0, 50)}...`);
                    } catch (error) {
                        console.log(`  ⚠️  Failed to update question: ${error.message}`);
                    }
                }
            }
        }

        // Update exemplars category questions
        if (exemplarsData.data.length > 0 && exemplarBadges.data.length > 0) {
            console.log('\nUpdating Exemplars tab questions...');
            const firstBadge = exemplarBadges.data.find(b => b.badgeType === 'exemplar-mcq') || exemplarBadges.data[0];

            for (const question of exemplarsData.data) {
                if (!question.badgeType) {
                    try {
                        await axios.put(`${API_URL}/questions/${question._id}`, {
                            ...question,
                            badgeType: firstBadge.badgeType
                        });
                        console.log(`  ✅ Updated question: ${question.question.substring(0, 50)}...`);
                    } catch (error) {
                        console.log(`  ⚠️  Failed to update question: ${error.message}`);
                    }
                }
            }
        }

        // Diagrams already have badgeType from our earlier script
        console.log('\n✨ Question badgeType update completed!');

        // Verify the updates
        console.log('\n📊 Verification:');
        const verifyQuestions = await axios.get(`${API_URL}/questions?category=questions&badgeType=${questionsBadges.data[0]?.badgeType}`);
        const verifyExemplars = await axios.get(`${API_URL}/questions?category=exemplars&badgeType=${exemplarBadges.data[0]?.badgeType}`);
        const verifyDiagrams = await axios.get(`${API_URL}/questions?category=diagrams&badgeType=${diagramBadges.data[0]?.badgeType}`);

        console.log(`  Questions with badgeType: ${verifyQuestions.data.length}`);
        console.log(`  Exemplars with badgeType: ${verifyExemplars.data.length}`);
        console.log(`  Diagrams with badgeType: ${verifyDiagrams.data.length}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

fixQuestionBadgeTypes();
