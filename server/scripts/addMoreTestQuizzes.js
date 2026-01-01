const mongoose = require('mongoose');
const FreeQuiz = require('../models/FreeQuiz');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chemistry_coaching';

const additionalQuizzes = [
    {
        title: "Chemical Kinetics - Rate Laws",
        description: "Master the concepts of reaction rates, rate constants, and integrated rate equations for JEE Main.",
        examType: "JEE",
        subject: "Chemistry",
        chapter: "Chemical Kinetics",
        topic: "Rate Laws & Order",
        difficulty: "Medium",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/6"
    },
    {
        title: "Coordination Compounds Basics",
        description: "Test your knowledge on nomenclature, isomerism, and bonding in coordination chemistry.",
        examType: "NEET",
        subject: "Chemistry",
        chapter: "Coordination Compounds",
        topic: "Nomenclature & Isomerism",
        difficulty: "Medium",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/7"
    },
    {
        title: "Redox Reactions Quick Test",
        description: "Practice balancing redox equations and identifying oxidizing/reducing agents.",
        examType: "BOARDS",
        subject: "Chemistry",
        chapter: "Redox Reactions",
        topic: "Balancing Equations",
        difficulty: "Easy",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/8"
    },
    {
        title: "Organic Reaction Mechanisms",
        description: "Advanced quiz on SN1, SN2, E1, E2 mechanisms with stereochemistry considerations.",
        examType: "JEE",
        subject: "Chemistry",
        chapter: "Organic Chemistry",
        topic: "Reaction Mechanisms",
        difficulty: "Hard",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/9"
    },
    {
        title: "Solutions & Colligative Properties",
        description: "Comprehensive test on molarity, molality, and colligative properties for competitive exams.",
        examType: "NEET",
        subject: "Chemistry",
        chapter: "Solutions",
        topic: "Colligative Properties",
        difficulty: "Medium",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/10"
    },
    {
        title: "Acids, Bases & pH",
        description: "Foundation level quiz on acid-base concepts, pH calculations, and buffer solutions.",
        examType: "FOUNDATION",
        subject: "Chemistry",
        chapter: "Equilibrium",
        topic: "Acids & Bases",
        difficulty: "Easy",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/11"
    },
    {
        title: "Biomolecules & Polymers",
        description: "Test your understanding of carbohydrates, proteins, and synthetic polymers.",
        examType: "BOARDS",
        subject: "Chemistry",
        chapter: "Biomolecules",
        topic: "Carbohydrates & Proteins",
        difficulty: "Medium",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/12"
    },
    {
        title: "d-Block Elements Challenge",
        description: "Advanced quiz on transition metals, their properties, and complex formation.",
        examType: "JEE",
        subject: "Chemistry",
        chapter: "d-Block Elements",
        topic: "Transition Metals",
        difficulty: "Hard",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/13"
    },
    {
        title: "Environmental Chemistry",
        description: "Quick quiz on pollution, greenhouse effect, and environmental protection.",
        examType: "BOARDS",
        subject: "Chemistry",
        chapter: "Environmental Chemistry",
        topic: "Pollution",
        difficulty: "Easy",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/14"
    },
    {
        title: "Solid State Chemistry",
        description: "Master crystal systems, unit cells, and defects in solids for JEE Advanced.",
        examType: "JEE",
        subject: "Chemistry",
        chapter: "Solid State",
        topic: "Crystal Lattices",
        difficulty: "Hard",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/15"
    },
    {
        title: "Haloalkanes & Haloarenes",
        description: "Practice questions on nomenclature, preparation, and reactions of halogen compounds.",
        examType: "NEET",
        subject: "Chemistry",
        chapter: "Haloalkanes",
        topic: "Reactions & Mechanisms",
        difficulty: "Medium",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/16"
    },
    {
        title: "Surface Chemistry Essentials",
        description: "Test on adsorption, catalysis, colloids, and emulsions for competitive exams.",
        examType: "JEE",
        subject: "Chemistry",
        chapter: "Surface Chemistry",
        topic: "Adsorption & Catalysis",
        difficulty: "Medium",
        quizType: "LINK",
        quizLink: "https://docs.google.com/forms/d/17"
    }
];

const addQuizzes = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const inserted = await FreeQuiz.insertMany(additionalQuizzes);
        console.log(`✅ Successfully added ${inserted.length} new test quizzes!`);

        const total = await FreeQuiz.countDocuments();
        console.log(`📊 Total quizzes in database: ${total}`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error adding quizzes:', err);
        process.exit(1);
    }
};

addQuizzes();
