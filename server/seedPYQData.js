const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/reaction-lab')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

const PYQChapter = require('./models/PYQChapter');
const PYQTopic = require('./models/PYQTopic');
const PYQQuestion = require('./models/PYQQuestion');

async function seedPYQData() {
    try {
        console.log('🌱 Starting PYQ data seeding...\n');

        // Clear existing data
        await PYQChapter.deleteMany({});
        await PYQTopic.deleteMany({});
        await PYQQuestion.deleteMany({});
        console.log('🗑️  Cleared existing PYQ data\n');

        // ==================== JEE MAIN - PHYSICS ====================

        // Create Chapter: Thermodynamics
        const thermoChapter = await PYQChapter.create({
            examName: 'JEE Main',
            subject: 'Physics',
            chapterName: 'Thermodynamics',
            chapterNumber: 'Chapter 12',
            description: 'Heat, work, and laws of thermodynamics',
            icon: 'fa-fire',
            color: 'red',
            order: 12
        });
        console.log('✅ Created chapter: Thermodynamics');

        // Create Topics
        const firstLawTopic = await PYQTopic.create({
            chapterId: thermoChapter._id,
            topicName: 'First Law of Thermodynamics',
            description: 'Conservation of energy in thermodynamic processes',
            order: 1
        });

        const heatEngineTopic = await PYQTopic.create({
            chapterId: thermoChapter._id,
            topicName: 'Heat Engines and Carnot Cycle',
            description: 'Efficiency and working of heat engines',
            order: 2
        });
        console.log('✅ Created 2 topics for Thermodynamics\n');

        // Create Questions
        const questions = [
            {
                chapterId: thermoChapter._id,
                topicId: firstLawTopic._id,
                examName: 'JEE Main',
                yearBadge: 'JEE Main 2022 – 25 July, Shift 2',
                examYear: 2022,
                subject: 'Physics',
                question: 'A gas is compressed from volume V to V/2 at constant pressure P. The work done on the gas is:',
                hint: 'Work done at constant pressure = P × ΔV',
                difficulty: 'Easy',
                questionType: 'Single Correct',
                options: ['PV/2', '-PV/2', 'PV', '-PV'],
                correctAnswer: 'B',
                solution: 'Work done W = P(V_final - V_initial) = P(V/2 - V) = -PV/2. The negative sign indicates work is done on the gas.',
                order: 1
            },
            {
                chapterId: thermoChapter._id,
                topicId: firstLawTopic._id,
                examName: 'JEE Main',
                yearBadge: 'JEE Main 2021 – 27 August, Shift 1',
                examYear: 2021,
                subject: 'Physics',
                question: 'An ideal gas undergoes an adiabatic process. If the initial temperature is 300K and volume doubles, the final temperature is (γ = 1.4):',
                hint: 'For adiabatic process: TV^(γ-1) = constant',
                difficulty: 'Medium',
                questionType: 'Numerical',
                options: [],
                correctAnswer: '227',
                solution: 'Using TV^(γ-1) = constant: 300 × V^0.4 = T × (2V)^0.4. Solving: T = 300/(2^0.4) ≈ 227K',
                order: 2
            },
            {
                chapterId: thermoChapter._id,
                topicId: heatEngineTopic._id,
                examName: 'JEE Main',
                yearBadge: 'JEE Main 2023 – 31 January, Shift 2',
                examYear: 2023,
                subject: 'Physics',
                question: 'A Carnot engine operates between 500K and 300K. Its efficiency is:',
                hint: 'Carnot efficiency η = 1 - (T_cold/T_hot)',
                difficulty: 'Easy',
                questionType: 'Single Correct',
                options: ['20%', '40%', '60%', '80%'],
                correctAnswer: 'B',
                solution: 'η = 1 - (300/500) = 1 - 0.6 = 0.4 = 40%',
                order: 3
            },
            {
                chapterId: thermoChapter._id,
                topicId: heatEngineTopic._id,
                examName: 'JEE Main',
                yearBadge: 'JEE Main 2022 – 29 June, Shift 1',
                examYear: 2022,
                subject: 'Physics',
                question: 'A refrigerator works between 250K and 300K. The coefficient of performance is:',
                hint: 'COP = T_cold/(T_hot - T_cold)',
                difficulty: 'Medium',
                questionType: 'Single Correct',
                options: ['3', '4', '5', '6'],
                correctAnswer: 'C',
                solution: 'COP = 250/(300-250) = 250/50 = 5',
                order: 4
            }
        ];

        await PYQQuestion.insertMany(questions);
        console.log('✅ Created 4 sample questions for Thermodynamics\n');

        // ==================== JEE MAIN - CHEMISTRY ====================

        const organicChapter = await PYQChapter.create({
            examName: 'JEE Main',
            subject: 'Chemistry',
            chapterName: 'Organic Chemistry - Basic Principles',
            chapterNumber: 'Chapter 13',
            description: 'Nomenclature, isomerism, and reaction mechanisms',
            icon: 'fa-flask',
            color: 'green',
            order: 13
        });
        console.log('✅ Created chapter: Organic Chemistry\n');

        const nomenclatureTopic = await PYQTopic.create({
            chapterId: organicChapter._id,
            topicName: 'IUPAC Nomenclature',
            description: 'Naming organic compounds',
            order: 1
        });

        const organicQuestions = [
            {
                chapterId: organicChapter._id,
                topicId: nomenclatureTopic._id,
                examName: 'JEE Main',
                yearBadge: 'JEE Main 2023 – 24 January, Shift 1',
                examYear: 2023,
                subject: 'Chemistry',
                question: 'The IUPAC name of CH₃-CH(CH₃)-CH₂-CH₃ is:',
                hint: 'Find the longest carbon chain and number from the end closest to the branch',
                difficulty: 'Easy',
                questionType: 'Single Correct',
                options: ['2-methylbutane', '2-methylpropane', 'isopentane', 'neopentane'],
                correctAnswer: 'A',
                solution: 'The longest chain has 4 carbons (butane). The methyl group is at position 2. Hence, 2-methylbutane.',
                order: 1
            }
        ];

        await PYQQuestion.insertMany(organicQuestions);
        console.log('✅ Created 1 sample question for Organic Chemistry\n');

        // ==================== NEET - BIOLOGY ====================

        const cellBioChapter = await PYQChapter.create({
            examName: 'NEET',
            subject: 'Biology',
            chapterName: 'Cell: The Unit of Life',
            chapterNumber: 'Chapter 8',
            description: 'Cell structure and functions',
            icon: 'fa-microscope',
            color: 'purple',
            order: 8
        });
        console.log('✅ Created chapter: Cell Biology\n');

        const cellStructureTopic = await PYQTopic.create({
            chapterId: cellBioChapter._id,
            topicName: 'Cell Organelles',
            description: 'Structure and function of cell organelles',
            order: 1
        });

        const bioQuestions = [
            {
                chapterId: cellBioChapter._id,
                topicId: cellStructureTopic._id,
                examName: 'NEET',
                yearBadge: 'NEET 2022 – 17 July',
                examYear: 2022,
                subject: 'Biology',
                question: 'Which of the following is called the "powerhouse of the cell"?',
                hint: 'This organelle produces ATP through cellular respiration',
                difficulty: 'Easy',
                questionType: 'Single Correct',
                options: ['Ribosome', 'Mitochondria', 'Golgi apparatus', 'Endoplasmic reticulum'],
                correctAnswer: 'B',
                solution: 'Mitochondria are called the powerhouse of the cell because they produce ATP through cellular respiration.',
                order: 1
            },
            {
                chapterId: cellBioChapter._id,
                topicId: cellStructureTopic._id,
                examName: 'NEET',
                yearBadge: 'NEET 2023 – 7 May',
                examYear: 2023,
                subject: 'Biology',
                question: 'Which organelles are involved in protein synthesis?',
                hint: 'Think about where translation occurs',
                difficulty: 'Easy',
                questionType: 'Multiple Correct',
                options: ['Ribosomes', 'Rough ER', 'Mitochondria', 'Smooth ER'],
                correctAnswer: 'A,B',
                solution: 'Ribosomes are the sites of protein synthesis. Rough ER has ribosomes attached and is also involved in protein synthesis and modification.',
                order: 2
            }
        ];

        await PYQQuestion.insertMany(bioQuestions);
        console.log('✅ Created 2 sample questions for Cell Biology\n');

        // ==================== JEE ADVANCED - PHYSICS ====================

        const electrostaticsChapter = await PYQChapter.create({
            examName: 'JEE Advanced',
            subject: 'Physics',
            chapterName: 'Electrostatics',
            chapterNumber: 'Chapter 1',
            description: 'Electric charges, fields, and potentials',
            icon: 'fa-bolt',
            color: 'cyan',
            order: 1
        });
        console.log('✅ Created chapter: Electrostatics (JEE Advanced)\n');

        const electricFieldTopic = await PYQTopic.create({
            chapterId: electrostaticsChapter._id,
            topicName: 'Electric Field and Potential',
            description: 'Concepts of electric field and electric potential',
            order: 1
        });

        const capacitorsTopic = await PYQTopic.create({
            chapterId: electrostaticsChapter._id,
            topicName: 'Capacitors',
            description: 'Capacitance and energy stored in capacitors',
            order: 2
        });

        const advancedPhysicsQuestions = [
            {
                chapterId: electrostaticsChapter._id,
                topicId: electricFieldTopic._id,
                examName: 'JEE Advanced',
                yearBadge: 'JEE Advanced 2023 – Paper 1',
                examYear: 2023,
                subject: 'Physics',
                question: 'Two point charges +q and -q are placed at distance d apart. The electric field at the midpoint is:',
                hint: 'Electric field is a vector quantity. Consider direction.',
                difficulty: 'Medium',
                questionType: 'Single Correct',
                options: ['0', '2kq/d²', '4kq/d²', '8kq/d²'],
                correctAnswer: 'D',
                solution: 'At midpoint, distance from each charge is d/2. E₁ = kq/(d/2)² = 4kq/d² (towards -q). E₂ = kq/(d/2)² = 4kq/d² (towards -q). Total E = E₁ + E₂ = 8kq/d²',
                order: 1
            },
            {
                chapterId: electrostaticsChapter._id,
                topicId: capacitorsTopic._id,
                examName: 'JEE Advanced',
                yearBadge: 'JEE Advanced 2022 – Paper 2',
                examYear: 2022,
                subject: 'Physics',
                question: 'A parallel plate capacitor has capacitance C. If the distance between plates is doubled and area is halved, new capacitance is:',
                hint: 'C = ε₀A/d',
                difficulty: 'Medium',
                questionType: 'Single Correct',
                options: ['C/4', 'C/2', 'C', '2C'],
                correctAnswer: 'A',
                solution: 'C = ε₀A/d. New capacitance C\' = ε₀(A/2)/(2d) = ε₀A/(4d) = C/4',
                order: 2
            },
            {
                chapterId: electrostaticsChapter._id,
                topicId: electricFieldTopic._id,
                examName: 'JEE Advanced',
                yearBadge: 'JEE Advanced 2021 – Paper 1',
                examYear: 2021,
                subject: 'Physics',
                question: 'The work done in moving a charge of 2C from point A to point B having potential difference of 10V is:',
                hint: 'W = qV',
                difficulty: 'Easy',
                questionType: 'Numerical',
                options: [],
                correctAnswer: '20',
                solution: 'Work done W = qV = 2 × 10 = 20 Joules',
                order: 3
            }
        ];

        await PYQQuestion.insertMany(advancedPhysicsQuestions);
        console.log('✅ Created 3 sample questions for Electrostatics (JEE Advanced)\n');

        // ==================== JEE ADVANCED - MATHEMATICS ====================

        const calculusChapter = await PYQChapter.create({
            examName: 'JEE Advanced',
            subject: 'Mathematics',
            chapterName: 'Differential Calculus',
            chapterNumber: 'Chapter 10',
            description: 'Limits, derivatives, and applications',
            icon: 'fa-square-root-alt',
            color: 'blue',
            order: 10
        });
        console.log('✅ Created chapter: Differential Calculus (JEE Advanced)\n');

        const limitsTopic = await PYQTopic.create({
            chapterId: calculusChapter._id,
            topicName: 'Limits and Continuity',
            description: 'Evaluation of limits and continuity of functions',
            order: 1
        });

        const derivativesTopic = await PYQTopic.create({
            chapterId: calculusChapter._id,
            topicName: 'Derivatives',
            description: 'Differentiation and its applications',
            order: 2
        });

        const advancedMathQuestions = [
            {
                chapterId: calculusChapter._id,
                topicId: limitsTopic._id,
                examName: 'JEE Advanced',
                yearBadge: 'JEE Advanced 2023 – Paper 1',
                examYear: 2023,
                subject: 'Mathematics',
                question: 'The value of lim(x→0) [sin(x)/x] is:',
                hint: 'This is a standard limit',
                difficulty: 'Easy',
                questionType: 'Single Correct',
                options: ['0', '1', '∞', 'Does not exist'],
                correctAnswer: 'B',
                solution: 'This is a standard limit: lim(x→0) [sin(x)/x] = 1',
                order: 1
            },
            {
                chapterId: calculusChapter._id,
                topicId: derivativesTopic._id,
                examName: 'JEE Advanced',
                yearBadge: 'JEE Advanced 2022 – Paper 2',
                examYear: 2022,
                subject: 'Mathematics',
                question: 'If f(x) = x³ - 3x² + 4, then f\'(2) equals:',
                hint: 'Find the derivative first, then substitute x = 2',
                difficulty: 'Medium',
                questionType: 'Numerical',
                options: [],
                correctAnswer: '0',
                solution: 'f\'(x) = 3x² - 6x. At x = 2: f\'(2) = 3(4) - 6(2) = 12 - 12 = 0',
                order: 2
            },
            {
                chapterId: calculusChapter._id,
                topicId: derivativesTopic._id,
                examName: 'JEE Advanced',
                yearBadge: 'JEE Advanced 2021 – Paper 1',
                examYear: 2021,
                subject: 'Mathematics',
                question: 'The derivative of ln(sin x) with respect to x is:',
                hint: 'Use chain rule',
                difficulty: 'Medium',
                questionType: 'Single Correct',
                options: ['cos x', 'cot x', 'tan x', 'sec x'],
                correctAnswer: 'B',
                solution: 'd/dx[ln(sin x)] = (1/sin x) × cos x = cot x',
                order: 3
            }
        ];

        await PYQQuestion.insertMany(advancedMathQuestions);
        console.log('✅ Created 3 sample questions for Differential Calculus (JEE Advanced)\n');


        // Summary
        const totalChapters = await PYQChapter.countDocuments();
        const totalTopics = await PYQTopic.countDocuments();
        const totalQuestions = await PYQQuestion.countDocuments();

        console.log('═══════════════════════════════════════');
        console.log('✅ PYQ Data Seeding Complete!');
        console.log('═══════════════════════════════════════');
        console.log(`📚 Total Chapters: ${totalChapters}`);
        console.log(`📝 Total Topics: ${totalTopics}`);
        console.log(`❓ Total Questions: ${totalQuestions}`);
        console.log('═══════════════════════════════════════\n');

        console.log('Sample Data Created:');
        console.log('1. JEE Main - Physics - Thermodynamics (4 questions)');
        console.log('2. JEE Main - Chemistry - Organic Chemistry (1 question)');
        console.log('3. NEET - Biology - Cell Biology (2 questions)');
        console.log('4. JEE Advanced - Physics - Electrostatics (3 questions)');
        console.log('5. JEE Advanced - Mathematics - Differential Calculus (3 questions)');
        console.log('\nYou can now test the API endpoints!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

// Run the seeder
seedPYQData();
