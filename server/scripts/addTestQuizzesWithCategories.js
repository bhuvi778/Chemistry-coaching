const mongoose = require('mongoose');
const FreeQuiz = require('../models/FreeQuiz');

const testQuizzes = [
    {
        title: 'Chemical Bonding Quick Quiz',
        description: 'Test your understanding of ionic, covalent, and metallic bonds',
        examType: 'NEET',
        subject: 'Chemistry',
        chapter: 'Chemical Bonding',
        topic: 'Types of Bonds',
        difficulty: 'Easy',
        quizCategory: 'Quiz',
        quizType: 'LINK',
        quizLink: 'https://docs.google.com/forms/d/2'
    },
    {
        title: 'JEE Main 2024 Mock Test',
        description: 'Full-length mock test based on JEE Main pattern',
        examType: 'JEE',
        subject: 'Chemistry',
        chapter: 'General Chemistry',
        difficulty: 'Medium',
        quizCategory: 'Mock Test',
        quizType: 'LINK',
        quizLink: 'https://docs.google.com/forms/d/3'
    },
    {
        title: 'NEET 2023 Previous Year Paper',
        description: 'Solve actual questions from NEET 2023 exam',
        examType: 'NEET',
        subject: 'Chemistry',
        chapter: 'All Chapters',
        difficulty: 'Hard',
        quizCategory: 'PYPs',
        quizType: 'LINK',
        quizLink: 'https://docs.google.com/forms/d/4'
    },
    {
        title: 'Organic Chemistry Mechanisms Quiz',
        description: 'Practice reaction mechanisms and organic conversions',
        examType: 'JEE',
        subject: 'Chemistry',
        chapter: 'Organic Chemistry',
        topic: 'Reaction Mechanisms',
        difficulty: 'Hard',
        quizCategory: 'Quiz',
        quizType: 'LINK',
        quizLink: 'https://docs.google.com/forms/d/5'
    },
    {
        title: 'JEE Advanced 2022 PYP',
        description: 'Previous year questions from JEE Advanced 2022',
        examType: 'JEE',
        subject: 'Chemistry',
        chapter: 'All Chapters',
        difficulty: 'Hard',
        quizCategory: 'PYPs',
        quizType: 'LINK',
        quizLink: 'https://docs.google.com/forms/d/6'
    }
];

const addTestQuizzes = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/chemistry_coaching');
        console.log('✅ Connected to MongoDB');

        // Add test quizzes
        for (const quiz of testQuizzes) {
            await FreeQuiz.create(quiz);
            console.log(`✅ Added: ${quiz.title} (${quiz.quizCategory})`);
        }

        // Show all quizzes grouped by category
        const allQuizzes = await FreeQuiz.find({}).sort({ quizCategory: 1, title: 1 });

        console.log('\n📊 Quizzes by Category:');
        const categories = ['Quiz', 'Mock Test', 'PYPs'];
        categories.forEach(category => {
            const categoryQuizzes = allQuizzes.filter(q => q.quizCategory === category);
            console.log(`\n${category} (${categoryQuizzes.length}):`);
            categoryQuizzes.forEach(q => {
                console.log(`  - ${q.title} [${q.examType}]`);
            });
        });

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

addTestQuizzes();
