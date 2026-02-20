const mongoose = require('mongoose');
const NTAAbhyas = require('../models/NTAAbhyas');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chemistry_coaching';

const sampleQuestions = [
    // JEE - Chemical Bonding
    {
        examCategory: 'JEE',
        chapter: 'Chemical Bonding',
        chapterNumber: '04',
        question: 'Which of the following species has a linear shape?',
        questionType: 'MCQ',
        options: ['NO₂⁺', 'SO₂', 'O₃', 'NO₂⁻'],
        correctAnswer: 'NO₂⁺',
        solution: 'NO₂⁺ has sp hybridization with 0 lone pairs on Nitrogen, resulting in a linear geometry. SO₂, O₃, and NO₂⁻ are bent.',
        hint: 'Check the hybridization of the central atom.',
        difficulty: 'Easy',
        marks: 4,
        year: 2023,
        topic: 'Molecular Geometry',
        isActive: true
    },
    {
        examCategory: 'JEE',
        chapter: 'Chemical Bonding',
        chapterNumber: '04',
        question: 'The bond order of O₂⁺ is:',
        questionType: 'MCQ',
        options: ['2.5', '2.0', '1.5', '3.0'],
        correctAnswer: '2.5',
        solution: 'O₂ has 16 electrons. O₂⁺ has 15 electrons. Using MO theory, Bond Order = (Nb - Na)/2 = (10 - 5)/2 = 2.5',
        hint: 'Use Molecular Orbital Theory.',
        difficulty: 'Medium',
        marks: 4,
        year: 2022,
        topic: 'MOT',
        isActive: true
    },
    {
        examCategory: 'JEE',
        chapter: 'Chemical Bonding',
        chapterNumber: '04',
        question: 'Intramolecular hydrogen bonding is present in:',
        questionType: 'MCQ',
        options: ['o-Nitrophenol', 'p-Nitrophenol', 'Phenol', 'p-Cresol'],
        correctAnswer: 'o-Nitrophenol',
        solution: 'In o-Nitrophenol, the -OH and -NO₂ groups are adjacent (ortho position), allowing hydrogen bonding within the same molecule.',
        hint: 'Look for groups close to each other on the benzene ring.',
        difficulty: 'Medium',
        marks: 4,
        year: 2021,
        topic: 'Hydrogen Bonding',
        isActive: true
    },

    // JEE - Thermodynamics
    {
        examCategory: 'JEE',
        chapter: 'Thermodynamics',
        chapterNumber: '06',
        question: 'For an adiabatic process, which relation is correct?',
        questionType: 'MCQ',
        options: ['PV^γ = constant', 'PV = constant', 'P/V = constant', 'V/P = constant'],
        correctAnswer: 'PV^γ = constant',
        solution: 'For a reversible adiabatic process of an ideal gas, PV^γ = constant, where γ is the adiabatic index.',
        hint: 'Adiabatic means no heat exchange (q=0).',
        difficulty: 'Easy',
        marks: 4,
        year: 2023,
        topic: 'Thermodynamic Processes',
        isActive: true
    },

    // NEET - Atomic Structure
    {
        examCategory: 'NEET',
        chapter: 'Atomic Structure',
        chapterNumber: '02',
        question: 'The maximum number of electrons in a subshell is given by the expression:',
        questionType: 'MCQ',
        options: ['4l + 2', '4l - 2', '2l + 1', '2n^2'],
        correctAnswer: '4l + 2',
        solution: 'A subshell with azimuthal quantum number "l" has (2l + 1) orbitals. Each orbital holds 2 electrons. So total electrons = 2(2l + 1) = 4l + 2.',
        hint: 'Remember the number of orbitals in a subshell first.',
        difficulty: 'Easy',
        marks: 4,
        year: 2022,
        topic: 'Quantum Numbers',
        isActive: true
    },
    {
        examCategory: 'NEET',
        chapter: 'Atomic Structure',
        chapterNumber: '02',
        question: 'Which of the following series of transitions in the spectrum of hydrogen atom falls in visible region?',
        questionType: 'MCQ',
        options: ['Balmer series', 'Lyman series', 'Paschen series', 'Brackett series'],
        correctAnswer: 'Balmer series',
        solution: 'The Balmer series corresponds to electron transitions to the n=2 energy level. These emissions typically fall within the visible spectrum.',
        hint: 'Lyman is UV, Paschen is IR.',
        difficulty: 'Easy',
        marks: 4,
        year: 2020,
        topic: 'Hydrogen Spectrum',
        isActive: true
    },
    {
        examCategory: 'NEET',
        chapter: 'Atomic Structure',
        chapterNumber: '02',
        question: 'The orbital angular momentum of a p-electron is given as:',
        questionType: 'MCQ',
        options: ['h/2π * √2', 'h/2π * √3', 'h/2π * √6', 'Zero'],
        correctAnswer: 'h/2π * √2',
        solution: 'Orbital angular momentum L = (h/2π) * √[l(l+1)]. For a p-electron, l=1. So L = (h/2π) * √[1(2)] = (h/2π) * √2.',
        hint: 'For p-orbital, l = 1.',
        difficulty: 'Medium',
        marks: 4,
        year: 2021,
        topic: 'Quantum Mechanics',
        isActive: true
    },

    // NEET - Solutions
    {
        examCategory: 'NEET',
        chapter: 'Solutions',
        chapterNumber: '05',
        question: 'Which condition is not satisfied by an ideal solution?',
        questionType: 'MCQ',
        options: ['ΔH_mix = 0', 'ΔV_mix = 0', 'Raoults Law is obeyed', 'ΔS_mix = 0'],
        correctAnswer: 'ΔS_mix = 0',
        solution: 'For an ideal solution, ΔH_mix = 0 and ΔV_mix = 0. However, mixing is always a spontaneous process that increases disorder, so ΔS_mix > 0 (always positive), never zero.',
        hint: 'Entropy always increases during mixing.',
        difficulty: 'Medium',
        marks: 4,
        year: 2019,
        topic: 'Ideal Solutions',
        isActive: true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        // Clear existing questions to avoid duplicates during dev
        await NTAAbhyas.deleteMany({});
        console.log('🧹 Cleared existing NTA Abhyas questions');

        // Insert new questions
        const result = await NTAAbhyas.insertMany(sampleQuestions);
        console.log(`✅ Successfully added ${result.length} sample questions!`);
        console.log('   - JEE Questions: ' + result.filter(q => q.examCategory === 'JEE').length);
        console.log('   - NEET Questions: ' + result.filter(q => q.examCategory === 'NEET').length);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
