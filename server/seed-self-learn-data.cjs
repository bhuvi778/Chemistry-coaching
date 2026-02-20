const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reaction-lab';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Define Schema (same as model)
const selfLearnChapterSchema = new mongoose.Schema({
    examType: {
        type: String,
        required: true,
        enum: ['NEET', 'JEE', 'IAT/NEST']
    },
    subject: {
        type: String,
        required: true,
        enum: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Practical']
    },
    chapterName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    order: {
        type: Number,
        default: 0
    },
    icon: {
        type: String,
        default: 'fa-book'
    },
    color: {
        type: String,
        default: 'cyan'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    learn: {
        videoLectures: [{
            title: String,
            url: String,
            duration: String,
            order: Number
        }],
        classNotes: [{
            title: String,
            pdfUrl: String,
            order: Number
        }],
        exercises: [{
            title: String,
            questions: [{
                question: String,
                options: [String],
                correctAnswer: Number,
                explanation: String
            }]
        }]
    },
    practice: {
        dpps: [{
            title: String,
            questions: [{
                question: String,
                options: [String],
                correctAnswer: Number,
                explanation: String,
                difficulty: String
            }],
            timeLimit: Number
        }],
        dppVideoSolutions: [{
            title: String,
            url: String,
            duration: String
        }]
    },
    revise: {
        revisionClasses: [{
            title: String,
            url: String,
            duration: String,
            order: Number
        }],
        mockTests: [{
            title: String,
            questions: [{
                question: String,
                options: [String],
                correctAnswer: Number,
                explanation: String,
                difficulty: String
            }],
            timeLimit: Number,
            totalMarks: Number
        }]
    },
    progress: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const SelfLearnChapter = mongoose.model('SelfLearnChapter', selfLearnChapterSchema);

// Sample Data
const sampleChapters = [
    // NEET - Physical Chemistry
    {
        examType: 'NEET',
        subject: 'Physical Chemistry',
        chapterName: 'Chemical Kinetics',
        description: 'Study of reaction rates, order, molecularity, and factors affecting reaction rates',
        order: 1,
        icon: 'fa-clock',
        color: 'purple',
        isActive: true,
        learn: {
            videoLectures: [
                {
                    title: 'Introduction to Chemical Kinetics',
                    url: 'https://www.youtube.com/watch?v=sample1',
                    duration: '45:00',
                    order: 1
                },
                {
                    title: 'Rate Laws and Rate Constants',
                    url: 'https://www.youtube.com/watch?v=sample2',
                    duration: '38:30',
                    order: 2
                },
                {
                    title: 'Integrated Rate Equations',
                    url: 'https://www.youtube.com/watch?v=sample3',
                    duration: '52:15',
                    order: 3
                }
            ],
            classNotes: [
                {
                    title: 'Chemical Kinetics - Complete Notes',
                    pdfUrl: 'https://example.com/notes/kinetics.pdf',
                    order: 1
                },
                {
                    title: 'Important Formulas & Concepts',
                    pdfUrl: 'https://example.com/notes/kinetics-formulas.pdf',
                    order: 2
                }
            ],
            exercises: [{
                title: 'Basic Concepts Practice',
                questions: [
                    {
                        question: 'What is the SI unit of rate constant for a first-order reaction?',
                        options: ['mol L⁻¹ s⁻¹', 's⁻¹', 'L mol⁻¹ s⁻¹', 'mol⁻¹ L s⁻¹'],
                        correctAnswer: 1,
                        explanation: 'For a first-order reaction, the rate constant k has units of s⁻¹ (per second).'
                    },
                    {
                        question: 'The half-life of a first-order reaction is 100 seconds. What is the rate constant?',
                        options: ['0.00693 s⁻¹', '0.693 s⁻¹', '69.3 s⁻¹', '6.93 s⁻¹'],
                        correctAnswer: 0,
                        explanation: 'k = 0.693/t₁/₂ = 0.693/100 = 0.00693 s⁻¹'
                    }
                ]
            }]
        },
        practice: {
            dpps: [{
                title: 'DPP 1 - Chemical Kinetics Basics',
                timeLimit: 60,
                questions: [
                    {
                        question: 'For a reaction A → B, the rate of reaction is doubled when the concentration of A is doubled. The order of reaction is:',
                        options: ['Zero', 'One', 'Two', 'Three'],
                        correctAnswer: 1,
                        explanation: 'When rate doubles with doubling of concentration, the reaction is first order.',
                        difficulty: 'Easy'
                    },
                    {
                        question: 'The rate constant of a reaction is 1.5 × 10⁻³ s⁻¹ at 25°C and 3.0 × 10⁻³ s⁻¹ at 35°C. Calculate the activation energy.',
                        options: ['52.9 kJ/mol', '62.9 kJ/mol', '72.9 kJ/mol', '82.9 kJ/mol'],
                        correctAnswer: 0,
                        explanation: 'Using Arrhenius equation: ln(k₂/k₁) = (Ea/R)(1/T₁ - 1/T₂)',
                        difficulty: 'Medium'
                    }
                ]
            }],
            dppVideoSolutions: [{
                title: 'DPP 1 Solutions - Chemical Kinetics',
                url: 'https://www.youtube.com/watch?v=solution1',
                duration: '25:00'
            }]
        },
        revise: {
            revisionClasses: [{
                title: 'Quick Revision - Chemical Kinetics',
                url: 'https://www.youtube.com/watch?v=revision1',
                duration: '30:00',
                order: 1
            }],
            mockTests: [{
                title: 'Chemical Kinetics Mock Test',
                timeLimit: 45,
                totalMarks: 100,
                questions: [
                    {
                        question: 'The order of reaction can be:',
                        options: ['Only integer', 'Only fractional', 'Integer or fractional', 'Only zero'],
                        correctAnswer: 2,
                        explanation: 'Order can be integer, fractional, or even zero depending on the reaction mechanism.',
                        difficulty: 'Easy'
                    }
                ]
            }]
        },
        progress: 0
    },
    
    // NEET - Physical Chemistry
    {
        examType: 'NEET',
        subject: 'Physical Chemistry',
        chapterName: 'Thermodynamics',
        description: 'Laws of thermodynamics, enthalpy, entropy, Gibbs free energy, and spontaneity',
        order: 2,
        icon: 'fa-fire',
        color: 'purple',
        isActive: true,
        learn: {
            videoLectures: [
                {
                    title: 'First Law of Thermodynamics',
                    url: 'https://www.youtube.com/watch?v=thermo1',
                    duration: '42:00',
                    order: 1
                },
                {
                    title: 'Enthalpy and Heat Changes',
                    url: 'https://www.youtube.com/watch?v=thermo2',
                    duration: '36:45',
                    order: 2
                }
            ],
            classNotes: [
                {
                    title: 'Thermodynamics Complete Notes',
                    pdfUrl: 'https://example.com/notes/thermodynamics.pdf',
                    order: 1
                }
            ],
            exercises: [{
                title: 'Thermodynamics Practice Questions',
                questions: [
                    {
                        question: 'For an isolated system, what remains constant?',
                        options: ['Temperature', 'Pressure', 'Energy', 'Volume'],
                        correctAnswer: 2,
                        explanation: 'An isolated system cannot exchange energy or matter with surroundings, so total energy remains constant.'
                    }
                ]
            }]
        },
        practice: {
            dpps: [{
                title: 'DPP 1 - Thermodynamics Fundamentals',
                timeLimit: 60,
                questions: [
                    {
                        question: 'Which of the following is a state function?',
                        options: ['Work', 'Heat', 'Internal Energy', 'All of these'],
                        correctAnswer: 2,
                        explanation: 'Internal energy is a state function; work and heat are path functions.',
                        difficulty: 'Easy'
                    }
                ]
            }],
            dppVideoSolutions: [{
                title: 'DPP 1 Solutions - Thermodynamics',
                url: 'https://www.youtube.com/watch?v=thermo-solution',
                duration: '28:00'
            }]
        },
        revise: {
            revisionClasses: [{
                title: 'Thermodynamics Rapid Revision',
                url: 'https://www.youtube.com/watch?v=thermo-revision',
                duration: '35:00',
                order: 1
            }],
            mockTests: [{
                title: 'Thermodynamics Full Test',
                timeLimit: 50,
                totalMarks: 100,
                questions: []
            }]
        },
        progress: 0
    },

    // NEET - Organic Chemistry
    {
        examType: 'NEET',
        subject: 'Organic Chemistry',
        chapterName: 'Hydrocarbons',
        description: 'Alkanes, alkenes, alkynes, aromatic hydrocarbons and their reactions',
        order: 1,
        icon: 'fa-atom',
        color: 'amber',
        isActive: true,
        learn: {
            videoLectures: [
                {
                    title: 'Introduction to Hydrocarbons',
                    url: 'https://www.youtube.com/watch?v=hydro1',
                    duration: '40:00',
                    order: 1
                },
                {
                    title: 'Alkanes - Structure and Properties',
                    url: 'https://www.youtube.com/watch?v=hydro2',
                    duration: '45:30',
                    order: 2
                }
            ],
            classNotes: [
                {
                    title: 'Hydrocarbons Detailed Notes',
                    pdfUrl: 'https://example.com/notes/hydrocarbons.pdf',
                    order: 1
                }
            ],
            exercises: [{
                title: 'Hydrocarbon Reactions',
                questions: [
                    {
                        question: 'Which reaction is used to convert alkyl halide to alkane?',
                        options: ['Wurtz reaction', 'Friedel-Crafts', 'Kolbe electrolysis', 'Sandmeyer'],
                        correctAnswer: 0,
                        explanation: 'Wurtz reaction: 2RX + 2Na → R-R + 2NaX'
                    }
                ]
            }]
        },
        practice: {
            dpps: [{
                title: 'DPP 1 - Hydrocarbons',
                timeLimit: 60,
                questions: [
                    {
                        question: 'The general formula of alkynes is:',
                        options: ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙH₂ₙ₋₄'],
                        correctAnswer: 2,
                        explanation: 'Alkynes have triple bond, general formula CₙH₂ₙ₋₂',
                        difficulty: 'Easy'
                    }
                ]
            }],
            dppVideoSolutions: []
        },
        revise: {
            revisionClasses: [{
                title: 'Hydrocarbons Quick Review',
                url: 'https://www.youtube.com/watch?v=hydro-rev',
                duration: '32:00',
                order: 1
            }],
            mockTests: []
        },
        progress: 0
    },

    // NEET - Inorganic Chemistry
    {
        examType: 'NEET',
        subject: 'Inorganic Chemistry',
        chapterName: 'Periodic Table and Periodicity',
        description: 'Modern periodic law, periodic trends, and chemical properties',
        order: 1,
        icon: 'fa-table',
        color: 'green',
        isActive: true,
        learn: {
            videoLectures: [
                {
                    title: 'Periodic Table - History and Development',
                    url: 'https://www.youtube.com/watch?v=periodic1',
                    duration: '38:00',
                    order: 1
                },
                {
                    title: 'Periodic Trends - Part 1',
                    url: 'https://www.youtube.com/watch?v=periodic2',
                    duration: '44:20',
                    order: 2
                }
            ],
            classNotes: [
                {
                    title: 'Periodic Table Complete Guide',
                    pdfUrl: 'https://example.com/notes/periodic-table.pdf',
                    order: 1
                }
            ],
            exercises: [{
                title: 'Periodic Trends Practice',
                questions: [
                    {
                        question: 'Along a period, atomic radius:',
                        options: ['Increases', 'Decreases', 'Remains same', 'First increases then decreases'],
                        correctAnswer: 1,
                        explanation: 'Atomic radius decreases along a period due to increasing nuclear charge.'
                    }
                ]
            }]
        },
        practice: {
            dpps: [{
                title: 'DPP 1 - Periodic Properties',
                timeLimit: 60,
                questions: [
                    {
                        question: 'Which element has the highest electronegativity?',
                        options: ['Oxygen', 'Nitrogen', 'Fluorine', 'Chlorine'],
                        correctAnswer: 2,
                        explanation: 'Fluorine has the highest electronegativity value of 4.0 on Pauling scale.',
                        difficulty: 'Easy'
                    }
                ]
            }],
            dppVideoSolutions: []
        },
        revise: {
            revisionClasses: [],
            mockTests: []
        },
        progress: 0
    },

    // JEE - Physical Chemistry
    {
        examType: 'JEE',
        subject: 'Physical Chemistry',
        chapterName: 'Electrochemistry',
        description: 'Electrochemical cells, Nernst equation, conductance, and electrolysis',
        order: 1,
        icon: 'fa-battery-full',
        color: 'purple',
        isActive: true,
        learn: {
            videoLectures: [
                {
                    title: 'Electrochemical Cells - Introduction',
                    url: 'https://www.youtube.com/watch?v=electro1',
                    duration: '48:00',
                    order: 1
                },
                {
                    title: 'Nernst Equation and Applications',
                    url: 'https://www.youtube.com/watch?v=electro2',
                    duration: '41:15',
                    order: 2
                }
            ],
            classNotes: [
                {
                    title: 'Electrochemistry Notes - JEE Advanced',
                    pdfUrl: 'https://example.com/notes/electrochemistry-jee.pdf',
                    order: 1
                }
            ],
            exercises: [{
                title: 'Electrochemistry Problems',
                questions: [
                    {
                        question: 'The EMF of a cell is independent of:',
                        options: ['Temperature', 'Concentration', 'Nature of electrodes', 'Amount of electrolyte'],
                        correctAnswer: 3,
                        explanation: 'EMF depends on intensive properties, not extensive ones like amount.',
                    }
                ]
            }]
        },
        practice: {
            dpps: [{
                title: 'DPP 1 - Electrochemistry JEE',
                timeLimit: 75,
                questions: [
                    {
                        question: 'Calculate the cell potential for Zn|Zn²⁺(0.1M)||Cu²⁺(0.01M)|Cu. (E°cell = 1.10V)',
                        options: ['1.07V', '1.13V', '1.10V', '1.16V'],
                        correctAnswer: 0,
                        explanation: 'Use Nernst equation: E = E° - (0.0591/n)log(Q)',
                        difficulty: 'Medium'
                    }
                ]
            }],
            dppVideoSolutions: [{
                title: 'Electrochemistry DPP Solutions',
                url: 'https://www.youtube.com/watch?v=electro-sol',
                duration: '35:00'
            }]
        },
        revise: {
            revisionClasses: [{
                title: 'Electrochemistry Revision - JEE',
                url: 'https://www.youtube.com/watch?v=electro-rev',
                duration: '40:00',
                order: 1
            }],
            mockTests: [{
                title: 'Electrochemistry Mock - JEE Pattern',
                timeLimit: 60,
                totalMarks: 120,
                questions: []
            }]
        },
        progress: 0
    },

    // JEE - Organic Chemistry
    {
        examType: 'JEE',
        subject: 'Organic Chemistry',
        chapterName: 'Reaction Mechanisms',
        description: 'SN1, SN2, E1, E2 reactions and their mechanisms',
        order: 1,
        icon: 'fa-project-diagram',
        color: 'amber',
        isActive: true,
        learn: {
            videoLectures: [
                {
                    title: 'Nucleophilic Substitution Reactions',
                    url: 'https://www.youtube.com/watch?v=mech1',
                    duration: '52:00',
                    order: 1
                }
            ],
            classNotes: [
                {
                    title: 'Reaction Mechanisms - Detailed Notes',
                    pdfUrl: 'https://example.com/notes/mechanisms.pdf',
                    order: 1
                }
            ],
            exercises: []
        },
        practice: {
            dpps: [{
                title: 'DPP 1 - Reaction Mechanisms',
                timeLimit: 75,
                questions: [
                    {
                        question: 'SN2 reaction follows:',
                        options: ['First order kinetics', 'Second order kinetics', 'Zero order', 'Third order'],
                        correctAnswer: 1,
                        explanation: 'SN2 is bimolecular, follows second order kinetics.',
                        difficulty: 'Easy'
                    }
                ]
            }],
            dppVideoSolutions: []
        },
        revise: {
            revisionClasses: [],
            mockTests: []
        },
        progress: 0
    }
];

async function seedDatabase() {
    try {
        console.log('🗑️  Clearing existing Self Learn chapters...');
        await SelfLearnChapter.deleteMany({});
        
        console.log('📝 Inserting sample chapters...');
        const result = await SelfLearnChapter.insertMany(sampleChapters);
        
        console.log(`✅ Successfully added ${result.length} chapters!`);
        console.log('\n📊 Summary:');
        
        // Group by exam type and subject
        const summary = {};
        result.forEach(chapter => {
            if (!summary[chapter.examType]) {
                summary[chapter.examType] = {};
            }
            if (!summary[chapter.examType][chapter.subject]) {
                summary[chapter.examType][chapter.subject] = 0;
            }
            summary[chapter.examType][chapter.subject]++;
        });
        
        Object.keys(summary).forEach(exam => {
            console.log(`\n${exam}:`);
            Object.keys(summary[exam]).forEach(subject => {
                console.log(`  - ${subject}: ${summary[exam][subject]} chapters`);
            });
        });
        
        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();
