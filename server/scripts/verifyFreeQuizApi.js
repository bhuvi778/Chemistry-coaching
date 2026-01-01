
const API_URL = 'http://localhost:5000/api/free-quizzes';

const sampleQuiz = {
    title: "Test Full Stack Quiz",
    description: "This is a test quiz created via API script to verify functionality.",
    examType: "JEE",
    subject: "Chemistry",
    chapter: "Thermodynamics",
    topic: "Entropy",
    difficulty: "Medium",
    quizType: "LINK",
    quizLink: "https://docs.google.com/forms/d/e/1FAIpQLSd_sample/viewform"
};

async function testApi() {
    console.log('🧪 Testing Free Quiz API...');

    try {
        console.log('Sending POST request to:', API_URL);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sampleQuiz)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Success! Quiz created.');
            console.log('New Quiz ID:', data._id);
            console.log('Title:', data.title);

            // Cleanup
            console.log('🧹 Cleaning up (Deleting test quiz)...');
            const deleteRes = await fetch(`${API_URL}/${data._id}`, {
                method: 'DELETE'
            });

            if (deleteRes.ok) {
                console.log('✅ Cleanup successful.');
            } else {
                console.log('⚠️ Cleanup failed.');
            }

        } else {
            console.error('❌ Failed to create quiz.');
            console.error('Status:', response.status);
            console.error('Error:', data);
        }

    } catch (error) {
        console.error('❌ Network or Server Error:', error.message);
        console.error(error);
        console.log('Ensure the server is running on localhost:5000');
    }
}

testApi();
