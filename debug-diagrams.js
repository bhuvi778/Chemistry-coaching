import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ncert';

async function debugDiagrams() {
    try {
        // Try to create a simple diagram badge
        console.log('🔍 Testing diagram badge creation...\n');

        const testBadge = {
            name: 'Test Diagram Badge',
            description: 'Testing if diagrams category works',
            category: 'diagrams',
            badgeType: 'test-diagram',
            icon: 'fa-image',
            color: 'cyan'
        };

        console.log('Attempting to create badge with data:');
        console.log(JSON.stringify(testBadge, null, 2));

        try {
            const response = await axios.post(`${API_URL}/badges`, testBadge);
            console.log('\n✅ Badge created successfully!');
            console.log('Response:', JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log('\n❌ Failed to create badge');
            console.log('Error:', error.response?.data || error.message);
        }

        // Try to fetch all badges (not filtered by category)
        console.log('\n\n🔍 Fetching all badges from database...');
        try {
            // Since there's no "get all" endpoint, let's try each category
            const categories = ['line-by-line', 'questions', 'exemplars', 'diagrams'];
            for (const cat of categories) {
                const response = await axios.get(`${API_URL}/badges/${cat}`);
                console.log(`\n${cat}: ${response.data.length} badges`);
                if (response.data.length > 0) {
                    response.data.forEach(b => console.log(`  - ${b.name} (${b.badgeType})`));
                }
            }
        } catch (error) {
            console.log('Error fetching badges:', error.message);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

debugDiagrams();
