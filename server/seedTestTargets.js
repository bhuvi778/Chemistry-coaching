const mongoose = require('mongoose');
const PracticeTest = require('./models/PracticeTest');
const PracticeQuestion = require('./models/PracticeQuestion');

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/chemistry_coaching';

// Get today's date at start of day
const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

// Get tomorrow's date at start of day
const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
};

const testTests = [
    {
        title: 'Daily Target - Chemical Kinetics',
        description: 'Today\'s practice test on reaction rates and mechanisms',
        examType: 'NEET',
        startDate: getToday(), // Available today
        duration: 30,
        totalMarks: 40,
        passingMarks: 16,
        isActive: true,
        order: 1
    },
    {
        title: 'Daily Target - Thermodynamics',
        description: 'Tomorrow\'s practice test on energy and entropy',
        examType: 'JEE',
        startDate: getTomorrow(), // Available tomorrow
        duration: 45,
        totalMarks: 60,
        passingMarks: 24,
        isActive: true,
        order: 2
    }
];

const testQuestions = [
    {
        question: 'For a first-order reaction, the rate constant is 0.693 min⁻¹. What is the half-life of the reaction?',
        options: [
            '0.5 minutes',
            '1.0 minute',
            '1.5 minutes',
            '2.0 minutes'
        ],
        correctAnswer: 1,
        marks: 4,
        negativeMarks: 1,
        explanation: 'For a first-order reaction, half-life (t₁/₂) = 0.693/k. Therefore, t₁/₂ = 0.693/0.693 = 1.0 minute.',
        order: 1
    },
    {
        question: 'Which of the following statements is correct for an endothermic reaction?',
        options: [
            'ΔH is negative',
            'ΔH is positive',
            'ΔH is zero',
            'ΔH can be positive or negative'
        ],
        correctAnswer: 1,
        marks: 4,
        negativeMarks: 1,
        explanation: 'An endothermic reaction absorbs heat from the surroundings, so the enthalpy change (ΔH) is positive.',
        order: 2
    },
    {
        question: 'The equilibrium constant Kc for the reaction N₂ + 3H₂ ⇌ 2NH₃ is 0.5 at 400°C. What is the value of Kc for the reaction 2NH₃ ⇌ N₂ + 3H₂?',
        options: [
            '0.5',
            '2.0',
            '0.25',
            '4.0'
        ],
        correctAnswer: 1,
        marks: 4,
        negativeMarks: 1,
        explanation: 'When a reaction is reversed, the equilibrium constant of the reverse reaction is the reciprocal of the forward reaction. Therefore, Kc(reverse) = 1/0.5 = 2.0',
        order: 3
    },
    {
        question: 'The rate of a reaction increases by 2.5 times when the temperature is raised from 300 K to 310 K. The activation energy of the reaction is approximately:',
        options: [
            '50 kJ/mol',
            '75 kJ/mol',
            '100 kJ/mol',
            '125 kJ/mol'
        ],
        correctAnswer: 1,
        marks: 4,
        negativeMarks: 1,
        explanation: 'Using the Arrhenius equation and the given data, we can calculate that the activation energy is approximately 75 kJ/mol.',
        order: 4
    },
    {
        question: 'Which of the following is an intensive property?',
        options: [
            'Mass',
            'Volume',
            'Temperature',
            'Energy'
        ],
        correctAnswer: 2,
        marks: 4,
        negativeMarks: 1,
        explanation: 'Temperature is an intensive property as it does not depend on the amount of substance. Mass, volume, and energy are extensive properties.',
        order: 5
    },
    {
        question: 'For the reaction: 2A + B → C, the rate law is rate = k[A]²[B]. If the concentration of A is doubled and B is halved, the rate will:',
        options: [
            'Remain the same',
            'Double',
            'Become half',
            'Become four times'
        ],
        correctAnswer: 1,
        marks: 4,
        negativeMarks: 1,
        explanation: 'New rate = k(2[A])²(0.5[B]) = k × 4[A]² × 0.5[B] = 2k[A]²[B] = 2 × original rate. So the rate doubles.',
        order: 6
    },
    {
        question: 'The entropy change for the vaporization of water at 100°C is 109 J K⁻¹ mol⁻¹. What is the enthalpy of vaporization?',
        options: [
            '30.7 kJ/mol',
            '40.7 kJ/mol',
            '50.7 kJ/mol',
            '60.7 kJ/mol'
        ],
        correctAnswer: 1,
        marks: 4,
        negativeMarks: 1,
        explanation: 'At equilibrium (boiling point), ΔG = 0, so ΔH = TΔS. ΔH = 373 K × 109 J K⁻¹ mol⁻¹ = 40,657 J/mol ≈ 40.7 kJ/mol',
        order: 7
    },
    {
        question: 'Which of the following has the highest pH?',
        options: [
            '0.1 M HCl',
            '0.1 M CH₃COOH',
            '0.1 M NaOH',
            'Pure water'
        ],
        correctAnswer: 2,
        marks: 4,
        negativeMarks: 1,
        explanation: '0.1 M NaOH is a strong base and will have the highest pH (pH = 13). HCl is acidic (pH = 1), acetic acid is weakly acidic (pH ≈ 3), and pure water is neutral (pH = 7).',
        order: 8
    },
    {
        question: 'The unit of rate constant for a zero-order reaction is:',
        options: [
            'mol L⁻¹ s⁻¹',
            's⁻¹',
            'L mol⁻¹ s⁻¹',
            'L² mol⁻² s⁻¹'
        ],
        correctAnswer: 0,
        marks: 4,
        negativeMarks: 1,
        explanation: 'For a zero-order reaction, rate = k[A]⁰ = k. Since rate has units of mol L⁻¹ s⁻¹, k also has units of mol L⁻¹ s⁻¹.',
        order: 9
    },
    {
        question: 'The Gibbs free energy change (ΔG) for a spontaneous process at constant temperature and pressure is:',
        options: [
            'Positive',
            'Negative',
            'Zero',
            'Infinity'
        ],
        correctAnswer: 1,
        marks: 4,
        negativeMarks: 1,
        explanation: 'For a spontaneous process, ΔG must be negative. When ΔG = 0, the system is at equilibrium. When ΔG is positive, the process is non-spontaneous.',
        order: 10
    }
];

async function seedTestData() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!\n');

        console.log('📅 Creating test data for Daily Target...');
        console.log(`   Today: ${getToday().toLocaleString()}`);
        console.log(`   Tomorrow: ${getTomorrow().toLocaleString()}\n`);

        // Create tests
        for (const testData of testTests) {
            const test = await PracticeTest.create(testData);
            console.log(`✓ Created: ${test.title}`);
            console.log(`  - Start Date: ${test.startDate.toLocaleString()}`);
            console.log(`  - Exam Type: ${test.examType}`);
            console.log(`  - Duration: ${test.duration} minutes`);
            console.log(`  - Total Marks: ${test.totalMarks}\n`);

            // Add questions to each test
            console.log(`  Adding ${testQuestions.length} questions...`);
            for (const questionData of testQuestions) {
                await PracticeQuestion.create({
                    ...questionData,
                    testId: test._id
                });
            }
            console.log(`  ✓ Added ${testQuestions.length} questions\n`);
        }

        console.log('✅ Test data created successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - Created ${testTests.length} practice tests`);
        console.log(`   - Created ${testQuestions.length * testTests.length} questions`);
        console.log('\n🎯 Check the Daily Target page to see:');
        console.log('   - 1 ACTIVE test (available today)');
        console.log('   - 1 UPCOMING test (available tomorrow)');

    } catch (error) {
        console.error('❌ Error creating test data:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed.');
    }
}

// Run the seed function
seedTestData();
