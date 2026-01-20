const mongoose = require('mongoose');
const PracticeTest = require('./models/PracticeTest');
const PracticeQuestion = require('./models/PracticeQuestion');

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/chemistry_coaching';

const sampleTests = [
    {
        title: 'JEE Main Mock Test - Physical Chemistry',
        description: 'Comprehensive test covering Chemical Kinetics, Thermodynamics, and Equilibrium',
        examType: 'JEE',
        duration: 60,
        totalMarks: 100,
        passingMarks: 40,
        isActive: true,
        order: 1
    },
    {
        title: 'JEE Main Mock Test - Organic Chemistry',
        description: 'Practice test on Alcohols, Amines, Aldehydes, and Biomolecules',
        examType: 'JEE',
        duration: 45,
        totalMarks: 80,
        passingMarks: 32,
        isActive: true,
        order: 2
    },
    {
        title: 'JEE Main Mock Test - Inorganic Chemistry',
        description: 'Complete test on Coordination Compounds, p-block elements, and d-block elements',
        examType: 'JEE',
        duration: 50,
        totalMarks: 80,
        passingMarks: 32,
        isActive: true,
        order: 3
    }
];

const sampleQuestions = {
    'Physical Chemistry': [
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
    ],
    'Organic Chemistry': [
        {
            question: 'Which of the following alcohols will give a positive iodoform test?',
            options: [
                'Methanol',
                'Ethanol',
                'Propan-1-ol',
                'Butan-1-ol'
            ],
            correctAnswer: 1,
            marks: 4,
            negativeMarks: 1,
            explanation: 'Ethanol (CH₃CH₂OH) has a CH₃CH(OH)- group which gives a positive iodoform test. The test is positive for compounds with CH₃CO- or CH₃CH(OH)- groups.',
            order: 1
        },
        {
            question: 'The IUPAC name of CH₃-CH(NH₂)-CH₃ is:',
            options: [
                'Propan-1-amine',
                'Propan-2-amine',
                'Isopropylamine',
                'N-methylethanamine'
            ],
            correctAnswer: 1,
            marks: 4,
            negativeMarks: 1,
            explanation: 'The compound is propan-2-amine. The amino group (-NH₂) is attached to the second carbon of the propane chain.',
            order: 2
        },
        {
            question: 'Which of the following is the strongest nucleophile in aqueous solution?',
            options: [
                'F⁻',
                'Cl⁻',
                'Br⁻',
                'I⁻'
            ],
            correctAnswer: 3,
            marks: 4,
            negativeMarks: 1,
            explanation: 'In aqueous solution, I⁻ is the strongest nucleophile among halides because it is the least solvated (largest size, lowest charge density). Nucleophilicity in protic solvents increases down the group.',
            order: 3
        },
        {
            question: 'Aldehydes can be distinguished from ketones by:',
            options: [
                'Fehling\'s test',
                'Iodoform test',
                'Lucas test',
                'Victor Meyer test'
            ],
            correctAnswer: 0,
            marks: 4,
            negativeMarks: 1,
            explanation: 'Fehling\'s test distinguishes aldehydes from ketones. Aldehydes reduce Fehling\'s reagent to give a red precipitate of Cu₂O, while ketones do not.',
            order: 4
        },
        {
            question: 'Which of the following is a reducing sugar?',
            options: [
                'Sucrose',
                'Glucose',
                'Starch',
                'Cellulose'
            ],
            correctAnswer: 1,
            marks: 4,
            negativeMarks: 1,
            explanation: 'Glucose is a reducing sugar because it has a free aldehyde group that can reduce Fehling\'s or Benedict\'s reagent. Sucrose is a non-reducing sugar.',
            order: 5
        },
        {
            question: 'The reaction of aniline with bromine water gives:',
            options: [
                '2-bromoaniline',
                '4-bromoaniline',
                '2,4,6-tribromoaniline',
                'No reaction'
            ],
            correctAnswer: 2,
            marks: 4,
            negativeMarks: 1,
            explanation: 'Aniline is highly activated towards electrophilic substitution due to the -NH₂ group. With bromine water, it gives 2,4,6-tribromoaniline as a white precipitate.',
            order: 6
        },
        {
            question: 'Which vitamin is also known as ascorbic acid?',
            options: [
                'Vitamin A',
                'Vitamin B',
                'Vitamin C',
                'Vitamin D'
            ],
            correctAnswer: 2,
            marks: 4,
            negativeMarks: 1,
            explanation: 'Vitamin C is also known as ascorbic acid. It is a water-soluble vitamin essential for the synthesis of collagen.',
            order: 7
        },
        {
            question: 'The correct order of basicity of amines in aqueous solution is:',
            options: [
                'Primary > Secondary > Tertiary',
                'Tertiary > Secondary > Primary',
                'Secondary > Primary > Tertiary',
                'Primary > Tertiary > Secondary'
            ],
            correctAnswer: 2,
            marks: 4,
            negativeMarks: 1,
            explanation: 'In aqueous solution, the order is: Secondary > Primary > Tertiary. This is due to a combination of inductive effect and steric hindrance affecting solvation.',
            order: 8
        },
        {
            question: 'Which of the following gives a silver mirror with Tollen\'s reagent?',
            options: [
                'Acetone',
                'Formaldehyde',
                'Diethyl ketone',
                'Cyclohexanone'
            ],
            correctAnswer: 1,
            marks: 4,
            negativeMarks: 1,
            explanation: 'Formaldehyde (an aldehyde) reduces Tollen\'s reagent to give a silver mirror. Ketones do not give this test.',
            order: 9
        },
        {
            question: 'The linkage between two monosaccharides in a disaccharide is called:',
            options: [
                'Peptide linkage',
                'Glycosidic linkage',
                'Ester linkage',
                'Hydrogen bond'
            ],
            correctAnswer: 1,
            marks: 4,
            negativeMarks: 1,
            explanation: 'The linkage between two monosaccharides is called a glycosidic linkage. It is formed by the elimination of a water molecule.',
            order: 10
        }
    ],
    'Inorganic Chemistry': [
        {
            question: 'The coordination number of the central metal ion in [Fe(CN)₆]³⁻ is:',
            options: [
                '3',
                '4',
                '6',
                '8'
            ],
            correctAnswer: 2,
            marks: 4,
            negativeMarks: 1,
            explanation: 'The coordination number is 6 because there are six CN⁻ ligands attached to the central Fe³⁺ ion.',
            order: 1
        },
        {
            question: 'Which of the following is an example of a chelating ligand?',
            options: [
                'Cl⁻',
                'NH₃',
                'Ethylenediamine (en)',
                'H₂O'
            ],
            correctAnswer: 2,
            marks: 4,
            negativeMarks: 1,
            explanation: 'Ethylenediamine (en) is a bidentate chelating ligand that can form two coordinate bonds with the metal ion through its two nitrogen atoms.',
            order: 2
        },
        {
            question: 'The oxidation state of chromium in K₂Cr₂O₇ is:',
            options: [
                '+3',
                '+4',
                '+6',
                '+7'
            ],
            correctAnswer: 2,
            marks: 4,
            negativeMarks: 1,
            explanation: 'In K₂Cr₂O₇, let oxidation state of Cr be x. 2(+1) + 2(x) + 7(-2) = 0. Therefore, 2x = 12, x = +6.',
            order: 3
        },
        {
            question: 'Which of the following d-block elements has the highest melting point?',
            options: [
                'Zinc',
                'Copper',
                'Tungsten',
                'Mercury'
            ],
            correctAnswer: 2,
            marks: 4,
            negativeMarks: 1,
            explanation: 'Tungsten has the highest melting point (3422°C) among all d-block elements due to strong metallic bonding.',
            order: 4
        },
        {
            question: 'Which of the following is paramagnetic?',
            options: [
                '[Ni(CN)₄]²⁻',
                '[Ni(CO)₄]',
                '[NiCl₄]²⁻',
                '[Zn(NH₃)₄]²⁺'
            ],
            correctAnswer: 2,
            marks: 4,
            negativeMarks: 1,
            explanation: '[NiCl₄]²⁻ is paramagnetic because it has unpaired electrons. Cl⁻ is a weak field ligand, so it doesn\'t cause pairing of electrons in Ni²⁺.',
            order: 5
        },
        {
            question: 'The noble gas configuration is NOT found in:',
            options: [
                'O²⁻',
                'F⁻',
                'Na⁺',
                'Al³⁺'
            ],
            correctAnswer: 3,
            marks: 4,
            negativeMarks: 1,
            explanation: 'Al³⁺ has the configuration [Ne] (10 electrons), which is a noble gas configuration. However, among the options, all have noble gas configurations. This question tests understanding of electron configurations.',
            order: 6
        },
        {
            question: 'Which of the following oxides is amphoteric?',
            options: [
                'Na₂O',
                'Al₂O₃',
                'SO₂',
                'CO₂'
            ],
            correctAnswer: 1,
            marks: 4,
            negativeMarks: 1,
            explanation: 'Al₂O₃ is amphoteric - it reacts with both acids and bases. It reacts with HCl to form AlCl₃ and with NaOH to form sodium aluminate.',
            order: 7
        },
        {
            question: 'The geometry of [Ni(CN)₄]²⁻ is:',
            options: [
                'Tetrahedral',
                'Square planar',
                'Octahedral',
                'Linear'
            ],
            correctAnswer: 1,
            marks: 4,
            negativeMarks: 1,
            explanation: '[Ni(CN)₄]²⁻ has square planar geometry. CN⁻ is a strong field ligand causing dsp² hybridization in Ni²⁺.',
            order: 8
        },
        {
            question: 'Which of the following is the strongest oxidizing agent?',
            options: [
                'F₂',
                'Cl₂',
                'Br₂',
                'I₂'
            ],
            correctAnswer: 0,
            marks: 4,
            negativeMarks: 1,
            explanation: 'F₂ is the strongest oxidizing agent among halogens due to its highest electronegativity and low bond dissociation energy.',
            order: 9
        },
        {
            question: 'The color of transition metal complexes is due to:',
            options: [
                's-s transition',
                'p-p transition',
                'd-d transition',
                'f-f transition'
            ],
            correctAnswer: 2,
            marks: 4,
            negativeMarks: 1,
            explanation: 'The color of transition metal complexes is due to d-d transitions. When light is absorbed, electrons jump from lower energy d-orbitals to higher energy d-orbitals.',
            order: 10
        }
    ]
};

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully!');

        // Clear existing data
        console.log('\nClearing existing practice tests and questions...');
        await PracticeTest.deleteMany({});
        await PracticeQuestion.deleteMany({});
        console.log('Cleared existing data.');

        // Create tests and questions
        console.log('\nCreating practice tests...');

        for (let i = 0; i < sampleTests.length; i++) {
            const testData = sampleTests[i];
            const test = await PracticeTest.create(testData);
            console.log(`✓ Created test: ${test.title}`);

            // Get questions for this test
            const testType = Object.keys(sampleQuestions)[i];
            const questions = sampleQuestions[testType];

            console.log(`  Adding ${questions.length} questions...`);
            for (const questionData of questions) {
                await PracticeQuestion.create({
                    ...questionData,
                    testId: test._id
                });
            }
            console.log(`  ✓ Added ${questions.length} questions to ${test.title}`);
        }

        // Update question counts
        console.log('\nUpdating question counts...');
        const tests = await PracticeTest.find();
        for (const test of tests) {
            const count = await PracticeQuestion.countDocuments({ testId: test._id });
            console.log(`  ${test.title}: ${count} questions`);
        }

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Created ${sampleTests.length} practice tests`);
        console.log(`   - Created ${Object.values(sampleQuestions).flat().length} questions`);
        console.log('\n🎯 You can now test the system at: /my-daily-target');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
    }
}

// Run the seed function
seedDatabase();
