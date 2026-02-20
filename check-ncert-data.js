import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ncert';

async function checkData() {
    try {
        console.log('🔍 Checking NCERT data in database...\n');

        // Check Line-by-Line Chapters
        console.log('📚 LINE-BY-LINE CHAPTERS:');
        const chapters = await axios.get(`${API_URL}/chapters/line-by-line`);
        console.log(`   Found ${chapters.data.length} chapters`);
        chapters.data.forEach((ch, idx) => {
            console.log(`   ${idx + 1}. ${ch.name} (${ch.chapterNumber})`);
        });

        // Check topics for first chapter
        if (chapters.data.length > 0) {
            console.log(`\n📝 TOPICS for "${chapters.data[0].name}":`);
            const topics = await axios.get(`${API_URL}/topics/chapter/${chapters.data[0]._id}`);
            console.log(`   Found ${topics.data.length} topics`);
            topics.data.forEach((topic, idx) => {
                console.log(`   ${idx + 1}. ${topic.name}`);
            });

            // Check questions for first topic
            if (topics.data.length > 0) {
                console.log(`\n❓ QUESTIONS for "${topics.data[0].name}":`);
                const questions = await axios.get(`${API_URL}/questions?topicId=${topics.data[0]._id}`);
                console.log(`   Found ${questions.data.length} questions`);
                questions.data.forEach((q, idx) => {
                    console.log(`   ${idx + 1}. ${q.question.substring(0, 60)}...`);
                });
            }
        }

        // Check Questions Badges
        console.log('\n\n🏷️  QUESTIONS TAB BADGES:');
        const questionsBadges = await axios.get(`${API_URL}/badges/questions`);
        console.log(`   Found ${questionsBadges.data.length} badges`);
        questionsBadges.data.forEach((badge, idx) => {
            console.log(`   ${idx + 1}. ${badge.name} (${badge.badgeType})`);
        });

        // Check questions for first badge
        if (questionsBadges.data.length > 0) {
            console.log(`\n❓ QUESTIONS for "${questionsBadges.data[0].name}":`);
            const questions = await axios.get(`${API_URL}/questions?badgeType=${questionsBadges.data[0].badgeType}&category=questions`);
            console.log(`   Found ${questions.data.length} questions`);
            questions.data.forEach((q, idx) => {
                console.log(`   ${idx + 1}. ${q.question.substring(0, 60)}...`);
            });
        }

        // Check Exemplar Badges
        console.log('\n\n🏷️  EXEMPLARS TAB BADGES:');
        const exemplarBadges = await axios.get(`${API_URL}/badges/exemplars`);
        console.log(`   Found ${exemplarBadges.data.length} badges`);
        exemplarBadges.data.forEach((badge, idx) => {
            console.log(`   ${idx + 1}. ${badge.name} (${badge.badgeType})`);
        });

        // Check questions for first exemplar badge
        if (exemplarBadges.data.length > 0) {
            console.log(`\n❓ QUESTIONS for "${exemplarBadges.data[0].name}":`);
            const questions = await axios.get(`${API_URL}/questions?badgeType=${exemplarBadges.data[0].badgeType}&category=exemplars`);
            console.log(`   Found ${questions.data.length} questions`);
            questions.data.forEach((q, idx) => {
                console.log(`   ${idx + 1}. ${q.question.substring(0, 60)}...`);
            });
        }

        // Check Diagram Badges
        console.log('\n\n🏷️  DIAGRAMS TAB BADGES:');
        const diagramBadges = await axios.get(`${API_URL}/badges/diagrams`);
        console.log(`   Found ${diagramBadges.data.length} badges`);
        diagramBadges.data.forEach((badge, idx) => {
            console.log(`   ${idx + 1}. ${badge.name} (${badge.badgeType})`);
        });

        // Check questions for first diagram badge
        if (diagramBadges.data.length > 0) {
            console.log(`\n❓ QUESTIONS for "${diagramBadges.data[0].name}":`);
            const questions = await axios.get(`${API_URL}/questions?badgeType=${diagramBadges.data[0].badgeType}&category=diagrams`);
            console.log(`   Found ${questions.data.length} questions`);
            questions.data.forEach((q, idx) => {
                console.log(`   ${idx + 1}. ${q.question.substring(0, 60)}...`);
            });
        }

        console.log('\n\n✅ Data check completed!');

    } catch (error) {
        console.error('❌ Error checking data:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

checkData();
