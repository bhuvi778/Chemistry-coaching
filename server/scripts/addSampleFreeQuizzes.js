const mongoose = require('mongoose');
const FreeQuiz = require('../models/FreeQuiz');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chemistry_coaching';

const sampleQuizzes = [
    {
        title: "Thermodynamics Master Quiz",
        description: "Comprehensive quiz covering First Law, Entropy, and Gibbs Free Energy. Perfect for JEE Advanced aspirants.",
        examType: "JEE",
        subject: "Chemistry",
        chapter: "Thermodynamics",
        topic: "Entropy & Gibbs Energy",
        difficulty: "Hard",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/1"
    },
    {
        title: "Periodic Table Trends",
        description: "Test your understanding of atomic radius, ionization energy, and electronegativity trends.",
        examType: "NEET",
        subject: "Chemistry",
        chapter: "Periodic Classification",
        topic: "Periodic Trends",
        difficulty: "Medium",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/2"
    },
    {
        title: "Electrochemistry Basics",
        description: "Fundamental questions on Nernst Equation and electrochemical cells for Board exams.",
        examType: "BOARDS",
        subject: "Chemistry",
        chapter: "Electrochemistry",
        topic: "Nernst Equation",
        difficulty: "Easy",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/3"
    },
    {
        title: "GOC - Resonance & Hyperconjugation",
        description: "Deep dive into General Organic Chemistry mechanism stability concepts.",
        examType: "JEE",
        subject: "Chemistry",
        chapter: "GOC",
        topic: "Electronic Effects",
        difficulty: "Hard",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/4"
    },
    {
        title: "Atomic Structure Foundation",
        description: "Building blocks of chemistry: Quantum numbers and electronic configuration.",
        examType: "FOUNDATION",
        subject: "Chemistry",
        chapter: "Atomic Structure",
        topic: "Quantum Numbers",
        difficulty: "Medium",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/5"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if data exists
        const count = await FreeQuiz.countDocuments();
        if (count > 0) {
            console.log(`⚠️ Database already has ${count} quizzes. Skipping seed.`);
            process.exit(0);
        }

        await FreeQuiz.insertMany(sampleQuizzes);
        console.log('✅ Added 5 sample free quizzes!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error Seeding Data:', err);
        process.exit(1);
    }
};

seedDB();
