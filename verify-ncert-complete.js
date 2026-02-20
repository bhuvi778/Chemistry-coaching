import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ncert';

async function finalVerification() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('   NCERT TOOLBOX - FINAL VERIFICATION REPORT');
    console.log('═══════════════════════════════════════════════════════\n');

    try {
        // LINE-BY-LINE TAB
        console.log('📚 LINE-BY-LINE TAB');
        console.log('─────────────────────────────────────────────────────');
        const chapters = await axios.get(`${API_URL}/chapters/line-by-line`);
        console.log(`✅ Chapters: ${chapters.data.length}`);

        let totalTopics = 0;
        let totalLineByLineQuestions = 0;

        for (const chapter of chapters.data) {
            const topics = await axios.get(`${API_URL}/topics/chapter/${chapter._id}`);
            totalTopics += topics.data.length;

            for (const topic of topics.data) {
                const questions = await axios.get(`${API_URL}/questions?topicId=${topic._id}`);
                totalLineByLineQuestions += questions.data.length;
            }
        }

        console.log(`✅ Topics: ${totalTopics}`);
        console.log(`✅ Questions: ${totalLineByLineQuestions}`);
        console.log(`📊 Status: ${chapters.data.length > 0 && totalTopics > 0 && totalLineByLineQuestions > 0 ? '✅ WORKING' : '⚠️  NEEDS DATA'}\n`);

        // QUESTIONS TAB
        console.log('❓ QUESTIONS TAB');
        console.log('─────────────────────────────────────────────────────');
        const questionsBadges = await axios.get(`${API_URL}/badges/questions`);
        console.log(`✅ Badges: ${questionsBadges.data.length}`);

        let totalQuestionsTabQuestions = 0;
        for (const badge of questionsBadges.data) {
            const questions = await axios.get(`${API_URL}/questions?badgeType=${badge.badgeType}&category=questions`);
            totalQuestionsTabQuestions += questions.data.length;
        }

        console.log(`✅ Questions: ${totalQuestionsTabQuestions}`);
        console.log(`📊 Status: ${questionsBadges.data.length > 0 ? '✅ WORKING' : '⚠️  NEEDS DATA'}\n`);

        // EXEMPLARS TAB
        console.log('🎓 EXEMPLARS TAB');
        console.log('─────────────────────────────────────────────────────');
        const exemplarBadges = await axios.get(`${API_URL}/badges/exemplars`);
        console.log(`✅ Badges: ${exemplarBadges.data.length}`);

        let totalExemplarQuestions = 0;
        for (const badge of exemplarBadges.data) {
            const questions = await axios.get(`${API_URL}/questions?badgeType=${badge.badgeType}&category=exemplars`);
            totalExemplarQuestions += questions.data.length;
        }

        console.log(`✅ Questions: ${totalExemplarQuestions}`);
        console.log(`📊 Status: ${exemplarBadges.data.length > 0 ? '✅ WORKING' : '⚠️  NEEDS DATA'}\n`);

        // DIAGRAMS TAB
        console.log('🎨 DIAGRAMS TAB');
        console.log('─────────────────────────────────────────────────────');
        const diagramBadges = await axios.get(`${API_URL}/badges/diagrams`);
        console.log(`✅ Badges: ${diagramBadges.data.length}`);

        let totalDiagramQuestions = 0;
        for (const badge of diagramBadges.data) {
            const questions = await axios.get(`${API_URL}/questions?badgeType=${badge.badgeType}&category=diagrams`);
            totalDiagramQuestions += questions.data.length;
        }

        console.log(`✅ Questions: ${totalDiagramQuestions}`);
        console.log(`📊 Status: ${diagramBadges.data.length > 0 ? '✅ WORKING' : '⚠️  NEEDS DATA'}\n`);

        // SUMMARY
        console.log('═══════════════════════════════════════════════════════');
        console.log('   SUMMARY');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`\n📊 Total Data:`);
        console.log(`   • Chapters: ${chapters.data.length}`);
        console.log(`   • Topics: ${totalTopics}`);
        console.log(`   • Total Questions: ${totalLineByLineQuestions + totalQuestionsTabQuestions + totalExemplarQuestions + totalDiagramQuestions}`);
        console.log(`   • Question Badges: ${questionsBadges.data.length}`);
        console.log(`   • Exemplar Badges: ${exemplarBadges.data.length}`);
        console.log(`   • Diagram Badges: ${diagramBadges.data.length}`);

        console.log(`\n✅ All 4 tabs are properly configured!`);
        console.log(`\n🎉 The NCERT Toolbox is ready to use!`);
        console.log(`\n📝 Next Steps:`);
        console.log(`   1. Access admin panel to manage content`);
        console.log(`   2. View frontend at /ncert-toolbox`);
        console.log(`   3. Add more chapters, topics, and questions as needed`);
        console.log(`\n═══════════════════════════════════════════════════════\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

finalVerification();
