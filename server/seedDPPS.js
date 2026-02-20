const mongoose = require('mongoose');
const DPPSChapter = require('./models/DPPSChapter');
const DPPSQuestion = require('./models/DPPSQuestion');

// Connect to MongoDB
// MONGODB_URI should match the one in server/server.js
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chemistry_coaching';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const sampleChapters = [
    // Class 11 - Easy
    {
        name: 'Basic Concepts of Chemistry',
        subject: 'Chemistry',
        description: 'Introduction to chemistry, atoms, molecules, and mole concept',
        classLevel: '11',
        difficultyLevel: 'Easy',
        timeLimit: 30,
        icon: 'fa-flask',
        color: 'cyan',
        order: 1,
        isActive: true
    },
    {
        name: 'Structure of Atom',
        subject: 'Chemistry',
        description: 'Atomic models, quantum numbers, and electronic configuration',
        classLevel: '11',
        difficultyLevel: 'Easy',
        timeLimit: 30,
        icon: 'fa-atom',
        color: 'blue',
        order: 2,
        isActive: true
    },
    // Class 11 - Medium
    {
        name: 'Chemical Bonding',
        subject: 'Chemistry',
        description: 'Ionic, covalent, and coordinate bonds, VSEPR theory',
        classLevel: '11',
        difficultyLevel: 'Medium',
        timeLimit: 45,
        icon: 'fa-link',
        color: 'purple',
        order: 3,
        isActive: true
    },
    {
        name: 'States of Matter',
        subject: 'Chemistry',
        description: 'Gaseous state, liquid state, and solid state',
        classLevel: '11',
        difficultyLevel: 'Medium',
        timeLimit: 45,
        icon: 'fa-wind',
        color: 'green',
        order: 4,
        isActive: true
    },
    // Class 11 - Tough
    {
        name: 'Thermodynamics',
        subject: 'Chemistry',
        description: 'Laws of thermodynamics, enthalpy, entropy, and Gibbs energy',
        classLevel: '11',
        difficultyLevel: 'Tough',
        timeLimit: 60,
        icon: 'fa-fire',
        color: 'red',
        order: 5,
        isActive: true
    },
    {
        name: 'Equilibrium',
        subject: 'Chemistry',
        description: 'Chemical equilibrium, Le Chatelier principle, ionic equilibrium',
        classLevel: '11',
        difficultyLevel: 'Tough',
        timeLimit: 60,
        icon: 'fa-balance-scale',
        color: 'orange',
        order: 6,
        isActive: true
    },
    // Class 12 - Easy
    {
        name: 'Solid State',
        subject: 'Chemistry',
        description: 'Crystal lattices, unit cells, and packing efficiency',
        classLevel: '12',
        difficultyLevel: 'Easy',
        timeLimit: 30,
        icon: 'fa-cube',
        color: 'cyan',
        order: 7,
        isActive: true
    },
    {
        name: 'Solutions',
        subject: 'Chemistry',
        description: 'Types of solutions, concentration terms, colligative properties',
        classLevel: '12',
        difficultyLevel: 'Easy',
        timeLimit: 30,
        icon: 'fa-vial',
        color: 'blue',
        order: 8,
        isActive: true
    },
    // Class 12 - Medium
    {
        name: 'Electrochemistry',
        subject: 'Chemistry',
        description: 'Electrochemical cells, Nernst equation, batteries',
        classLevel: '12',
        difficultyLevel: 'Medium',
        timeLimit: 45,
        icon: 'fa-battery-full',
        color: 'purple',
        order: 9,
        isActive: true
    },
    {
        name: 'Chemical Kinetics',
        subject: 'Chemistry',
        description: 'Rate of reaction, order of reaction, Arrhenius equation',
        classLevel: '12',
        difficultyLevel: 'Medium',
        timeLimit: 45,
        icon: 'fa-tachometer-alt',
        color: 'green',
        order: 10,
        isActive: true
    },
    // Class 12 - Tough
    {
        name: 'Coordination Compounds',
        subject: 'Chemistry',
        description: 'Werner theory, nomenclature, isomerism, bonding theories',
        classLevel: '12',
        difficultyLevel: 'Tough',
        timeLimit: 60,
        icon: 'fa-project-diagram',
        color: 'red',
        order: 11,
        isActive: true
    },
    {
        name: 'Biomolecules',
        subject: 'Chemistry',
        description: 'Carbohydrates, proteins, nucleic acids, vitamins',
        classLevel: '12',
        difficultyLevel: 'Tough',
        timeLimit: 60,
        icon: 'fa-dna',
        color: 'pink',
        order: 12,
        isActive: true
    }
];

const createSampleQuestions = (chapterId, classLevel, difficulty) => {
    const questions = [];
    const numQuestions = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 15 : 20;

    for (let i = 1; i <= numQuestions; i++) {
        questions.push({
            chapterId,
            question: `<p>Sample question ${i} for ${difficulty} level. This is a placeholder question that demonstrates the structure.</p>`,
            options: [
                `<p>Option A - Incorrect answer ${i}</p>`,
                `<p>Option B - Correct answer ${i}</p>`,
                `<p>Option C - Incorrect answer ${i}</p>`,
                `<p>Option D - Incorrect answer ${i}</p>`
            ],
            correctAnswer: `<p>Option B - Correct answer ${i}</p>`,
            solution: `<p>This is the solution for question ${i}. The correct answer is Option B because of the following reasons...</p>`,
            hint: `Think about the basic concepts related to this topic`,
            classLevel,
            difficultyLevel: difficulty,
            questionType: 'MCQ',
            marks: 1,
            tags: ['sample', difficulty.toLowerCase()],
            order: i,
            isActive: true
        });
    }

    return questions;
};

async function seedDatabase() {
    try {
        console.log('🗑️  Clearing existing DPPS data...');
        await DPPSChapter.deleteMany({});
        await DPPSQuestion.deleteMany({});

        console.log('📚 Creating sample chapters...');
        const createdChapters = await DPPSChapter.insertMany(sampleChapters);
        console.log(`✅ Created ${createdChapters.length} chapters`);

        console.log('❓ Creating sample questions...');
        let totalQuestions = 0;

        for (const chapter of createdChapters) {
            const questions = createSampleQuestions(
                chapter._id,
                chapter.classLevel,
                chapter.difficultyLevel
            );
            await DPPSQuestion.insertMany(questions);
            totalQuestions += questions.length;
            console.log(`  ✓ Added ${questions.length} questions to "${chapter.name}"`);
        }

        console.log(`\n✅ Database seeded successfully!`);
        console.log(`📊 Summary:`);
        console.log(`   - Total Chapters: ${createdChapters.length}`);
        console.log(`   - Total Questions: ${totalQuestions}`);
        console.log(`\n📋 Breakdown by Class:`);
        console.log(`   Class 11:`);
        console.log(`     - Easy: 2 chapters (20 questions)`);
        console.log(`     - Medium: 2 chapters (30 questions)`);
        console.log(`     - Tough: 2 chapters (40 questions)`);
        console.log(`   Class 12:`);
        console.log(`     - Easy: 2 chapters (20 questions)`);
        console.log(`     - Medium: 2 chapters (30 questions)`);
        console.log(`     - Tough: 2 chapters (40 questions)`);

        console.log(`\n🎉 You can now test the DPPS module!`);
        console.log(`   1. Go to /dpps on the frontend`);
        console.log(`   2. Select Class 11 or 12`);
        console.log(`   3. Select difficulty level`);
        console.log(`   4. Start a test!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
