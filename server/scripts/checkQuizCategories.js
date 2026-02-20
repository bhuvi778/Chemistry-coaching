const mongoose = require('mongoose');
const FreeQuiz = require('../models/FreeQuiz');

mongoose.connect('mongodb://localhost:27017/chemistry_coaching', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function checkQuizCategories() {
    try {
        const quizzes = await FreeQuiz.find({});

        console.log('\n=== Free Quiz Category Check ===\n');
        console.log(`Total Quizzes: ${quizzes.length}\n`);

        // Group by quizCategory
        const categoryCount = {};
        const missingCategory = [];

        quizzes.forEach(quiz => {
            if (quiz.quizCategory) {
                categoryCount[quiz.quizCategory] = (categoryCount[quiz.quizCategory] || 0) + 1;
            } else {
                missingCategory.push(quiz._id);
            }
        });

        console.log('Quiz Category Distribution:');
        Object.entries(categoryCount).forEach(([category, count]) => {
            console.log(`  ${category}: ${count}`);
        });

        if (missingCategory.length > 0) {
            console.log(`\n⚠️  ${missingCategory.length} quizzes missing quizCategory field`);
            console.log('Quiz IDs:', missingCategory);

            // Ask if we should update them
            console.log('\nUpdating missing categories to default "Quiz"...');
            const result = await FreeQuiz.updateMany(
                { quizCategory: { $exists: false } },
                { $set: { quizCategory: 'Quiz' } }
            );
            console.log(`✅ Updated ${result.modifiedCount} quizzes`);
        } else {
            console.log('\n✅ All quizzes have quizCategory field');
        }

        // Show exam type distribution
        console.log('\n\nExam Type Distribution:');
        const examTypes = {};
        quizzes.forEach(quiz => {
            examTypes[quiz.examType] = (examTypes[quiz.examType] || 0) + 1;
        });
        Object.entries(examTypes).forEach(([type, count]) => {
            console.log(`  ${type}: ${count}`);
        });

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
}

checkQuizCategories();
