const mongoose = require('mongoose');
const FreeQuiz = require('../models/FreeQuiz');

const updateExistingQuizzes = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/chemistry_coaching');
        console.log('✅ Connected to MongoDB');

        // Update all quizzes that don't have quizCategory
        const result = await FreeQuiz.updateMany(
            { quizCategory: { $exists: false } },
            { $set: { quizCategory: 'Quiz' } }
        );

        console.log(`✅ Updated ${result.modifiedCount} quizzes with default quizCategory`);

        // Show all quizzes
        const quizzes = await FreeQuiz.find({}, { title: 1, quizCategory: 1 });
        console.log('\n📋 All quizzes:');
        quizzes.forEach(quiz => {
            console.log(`  - ${quiz.title}: ${quiz.quizCategory}`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

updateExistingQuizzes();
