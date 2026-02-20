const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = 'mongodb://127.0.0.1:27017/chemistry_coaching';

const infinitePracticeQuestionSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
        enum: ['NEET', 'JEE Main', 'JEE Advanced']
    },
    subject: {
        type: String,
        required: true,
        enum: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Practical', 'Physics', 'Mathematics', 'Biology', 'Zoology', 'Botany']
    },
    chapterName: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ['Single Correct', 'Multiple Correct', 'Numerical', 'Integer'],
        default: 'Single Correct'
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    solution: {
        type: String,
        default: ''
    },
    hint: {
        type: String,
        default: ''
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    tags: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const InfinitePracticeQuestion = mongoose.model('InfinitePracticeQuestion', infinitePracticeQuestionSchema);

const sampleQuestions = [
    // Physical Chemistry - Thermodynamics
    {
        examName: 'JEE Main',
        subject: 'Physical Chemistry',
        chapterName: 'Thermodynamics',
        question: 'For an ideal gas, the work of reversible expansion under isothermal condition can be calculated by:',
        questionType: 'Single Correct',
        options: [
            'W = -2.303 nRT log(V₂/V₁)',
            'W = -nRT ln(P₁/P₂)',
            'W = -PΔV',
            'W = nCvΔT'
        ],
        correctAnswer: 1,
        solution: 'For isothermal reversible expansion of an ideal gas, work done W = -nRT ln(V₂/V₁) = -nRT ln(P₁/P₂). Using natural logarithm (ln) is the correct form, though it can be converted to log base 10 using 2.303 factor.',
        hint: 'Remember the formula for isothermal reversible process and the relationship between pressure and volume.',
        difficulty: 'Medium',
        tags: ['thermodynamics', 'work', 'isothermal process'],
        isActive: true
    },
    {
        examName: 'JEE Main',
        subject: 'Physical Chemistry',
        chapterName: 'Thermodynamics',
        question: 'Which of the following statements is correct for an adiabatic process?',
        questionType: 'Single Correct',
        options: [
            'ΔH = 0',
            'ΔU = 0',
            'q = 0',
            'w = 0'
        ],
        correctAnswer: 2,
        solution: 'In an adiabatic process, there is no heat exchange between the system and surroundings, therefore q = 0. ΔU = q + w = 0 + w = w. The internal energy change equals the work done.',
        hint: 'Adiabatic means thermally insulated - no heat transfer.',
        difficulty: 'Easy',
        tags: ['thermodynamics', 'adiabatic process'],
        isActive: true
    },
    {
        examName: 'JEE Main',
        subject: 'Physical Chemistry',
        chapterName: 'Thermodynamics',
        question: 'Calculate the entropy change when 1 mole of an ideal gas expands isothermally and reversibly from 10 atm to 1 atm at 300 K. (R = 8.314 J/mol·K)',
        questionType: 'Single Correct',
        options: [
            '19.15 J/K',
            '38.30 J/K',
            '57.45 J/K',
            '9.58 J/K'
        ],
        correctAnswer: 0,
        solution: 'ΔS = nR ln(P₁/P₂) = 1 × 8.314 × ln(10/1) = 8.314 × 2.303 = 19.15 J/K. For isothermal reversible expansion, entropy increases.',
        hint: 'Use the formula ΔS = nR ln(V₂/V₁) = nR ln(P₁/P₂) for isothermal process.',
        difficulty: 'Medium',
        tags: ['thermodynamics', 'entropy', 'numerical'],
        isActive: true
    },
    {
        examName: 'JEE Main',
        subject: 'Physical Chemistry',
        chapterName: 'Thermodynamics',
        question: 'The enthalpy of formation of methane is -74.8 kJ/mol. The bond enthalpy of C-H bond is approximately:',
        questionType: 'Single Correct',
        options: [
            '412 kJ/mol',
            '99 kJ/mol',
            '415 kJ/mol',
            '540 kJ/mol'
        ],
        correctAnswer: 2,
        solution: 'For CH₄: ΔHf = -74.8 kJ/mol. CH₄ has 4 C-H bonds. Using bond enthalpy calculations with sublimation energy of carbon (716 kJ/mol) and dissociation energy of H₂ (436 kJ/mol), average C-H bond energy ≈ 415 kJ/mol.',
        hint: 'Consider the formation of methane from its elements in their standard states.',
        difficulty: 'Hard',
        tags: ['thermodynamics', 'enthalpy', 'bond energy'],
        isActive: true
    },
    {
        examName: 'JEE Main',
        subject: 'Physical Chemistry',
        chapterName: 'Thermodynamics',
        question: 'For which process, ΔH = ΔU?',
        questionType: 'Single Correct',
        options: [
            'H₂(g) + I₂(g) → 2HI(g)',
            '2H₂(g) + O₂(g) → 2H₂O(l)',
            'N₂(g) + 3H₂(g) → 2NH₃(g)',
            'PCl₅(g) → PCl₃(g) + Cl₂(g)'
        ],
        correctAnswer: 0,
        solution: 'ΔH = ΔU + ΔngRT, where Δng = (moles of gaseous products) - (moles of gaseous reactants). For H₂ + I₂ → 2HI: Δng = 2 - 2 = 0, therefore ΔH = ΔU.',
        hint: 'Check which reaction has no change in the number of moles of gas.',
        difficulty: 'Easy',
        tags: ['thermodynamics', 'enthalpy', 'internal energy'],
        isActive: true
    },

    // Inorganic Chemistry - Periodic Table
    {
        examName: 'JEE Main',
        subject: 'Inorganic Chemistry',
        chapterName: 'Periodic Table and Periodicity',
        question: 'The correct order of ionic radii is:',
        questionType: 'Single Correct',
        options: [
            'N³⁻ > O²⁻ > F⁻ > Na⁺',
            'Na⁺ > F⁻ > O²⁻ > N³⁻',
            'N³⁻ > Na⁺ > O²⁻ > F⁻',
            'O²⁻ > F⁻ > Na⁺ > N³⁻'
        ],
        correctAnswer: 0,
        solution: 'All ions are isoelectronic (10 electrons). As nuclear charge increases, ionic radius decreases. N³⁻ (Z=7) > O²⁻ (Z=8) > F⁻ (Z=9) > Na⁺ (Z=11). Lower nuclear charge means larger ionic radius.',
        hint: 'These are isoelectronic species. Compare their nuclear charges.',
        difficulty: 'Medium',
        tags: ['periodic table', 'ionic radius', 'isoelectronic'],
        isActive: true
    },
    {
        examName: 'JEE Main',
        subject: 'Inorganic Chemistry',
        chapterName: 'Periodic Table and Periodicity',
        question: 'Which element has the highest first ionization energy?',
        questionType: 'Single Correct',
        options: [
            'Nitrogen',
            'Oxygen',
            'Fluorine',
            'Neon'
        ],
        correctAnswer: 3,
        solution: 'Neon has the highest first ionization energy due to its stable noble gas configuration (2s²2p⁶). It requires maximum energy to remove an electron from this stable configuration.',
        hint: 'Noble gases have completely filled orbitals.',
        difficulty: 'Easy',
        tags: ['periodic table', 'ionization energy'],
        isActive: true
    },
    {
        examName: 'JEE Main',
        subject: 'Inorganic Chemistry',
        chapterName: 'Periodic Table and Periodicity',
        question: 'The element with electronic configuration [Ar] 3d¹⁰ 4s² 4p³ belongs to which group?',
        questionType: 'Single Correct',
        options: [
            'Group 13',
            'Group 14',
            'Group 15',
            'Group 16'
        ],
        correctAnswer: 2,
        solution: 'The electronic configuration shows 5 valence electrons (4s² 4p³), which corresponds to Group 15. This is Arsenic (As). The d-block is completely filled.',
        hint: 'Count the valence electrons in the outermost shell (4s and 4p).',
        difficulty: 'Medium',
        tags: ['periodic table', 'electronic configuration', 'groups'],
        isActive: true
    },

    // Organic Chemistry - Hydrocarbons
    {
        examName: 'JEE Main',
        subject: 'Organic Chemistry',
        chapterName: 'Hydrocarbons',
        question: 'Which alkene will undergo fastest addition of HBr?',
        questionType: 'Single Correct',
        options: [
            'CH₃-CH=CH₂',
            'CH₃-CH=CH-CH₃',
            '(CH₃)₂C=CH₂',
            'CH₂=CH₂'
        ],
        correctAnswer: 2,
        solution: '(CH₃)₂C=CH₂ will react fastest due to formation of most stable tertiary carbocation intermediate. More substituted alkenes form more stable carbocations, increasing reaction rate.',
        hint: 'Consider carbocation stability - more substituted carbocations are more stable.',
        difficulty: 'Easy',
        tags: ['hydrocarbons', 'alkenes', 'electrophilic addition'],
        isActive: true
    },
    {
        examName: 'JEE Main',
        subject: 'Organic Chemistry',
        chapterName: 'Hydrocarbons',
        question: 'The product of ozonolysis of 2-methyl-2-butene followed by reduction with Zn/H₂O is:',
        questionType: 'Single Correct',
        options: [
            'Acetone and acetaldehyde',
            'Acetone and formaldehyde',
            'Two molecules of acetone',
            'Acetaldehyde and propanal'
        ],
        correctAnswer: 0,
        solution: '2-Methyl-2-butene: (CH₃)₂C=CH-CH₃. Ozonolysis cleaves the C=C bond. Products: (CH₃)₂C=O (acetone) and CH₃-CH=O (acetaldehyde).',
        hint: 'Ozonolysis breaks the double bond and forms carbonyl compounds at each broken end.',
        difficulty: 'Medium',
        tags: ['hydrocarbons', 'ozonolysis', 'reactions'],
        isActive: true
    },
    {
        examName: 'JEE Main',
        subject: 'Organic Chemistry',
        chapterName: 'Hydrocarbons',
        question: 'Benzene reacts with excess Cl₂ in presence of sunlight to give:',
        questionType: 'Single Correct',
        options: [
            'Chlorobenzene',
            'Benzene hexachloride (BHC)',
            'Hexachlorobenzene',
            'o-Dichlorobenzene'
        ],
        correctAnswer: 1,
        solution: 'In presence of sunlight (UV light), benzene undergoes free radical addition with Cl₂ to form benzene hexachloride (BHC) or gammaxene, C₆H₆Cl₆. This is an addition reaction, not substitution.',
        hint: 'Sunlight promotes addition reaction rather than substitution in benzene.',
        difficulty: 'Easy',
        tags: ['hydrocarbons', 'benzene', 'halogenation', 'addition'],
        isActive: true
    },

    // NEET - Physical Chemistry
    {
        examName: 'NEET',
        subject: 'Physical Chemistry',
        chapterName: 'Chemical Kinetics',
        question: 'For a first order reaction, the time required for 99% completion is approximately:',
        questionType: 'Single Correct',
        options: [
            'twice the half-life',
            'thrice the half-life',
            'five times the half-life',
            'seven times the half-life'
        ],
        correctAnswer: 3,
        solution: 'For first order: t = (2.303/k) log([A₀]/[A]). For 99% completion, [A] = 0.01[A₀]. t₉₉% = (2.303/k) log(100) = (2.303/k) × 2 = 4.606/k. Since t₁/₂ = 0.693/k, t₉₉% ≈ 6.65 t₁/₂ ≈ 7 t₁/₂.',
        hint: 'Use the integrated rate law for first order reaction.',
        difficulty: 'Medium',
        tags: ['kinetics', 'first order', 'half-life'],
        isActive: true
    },
    {
        examName: 'NEET',
        subject: 'Physical Chemistry',
        chapterName: 'Chemical Kinetics',
        question: 'The rate constant of a reaction is 1.5 × 10⁻³ s⁻¹. The order of reaction is:',
        questionType: 'Single Correct',
        options: [
            'Zero order',
            'First order',
            'Second order',
            'Cannot be determined'
        ],
        correctAnswer: 1,
        solution: 'The unit of rate constant is s⁻¹, which is characteristic of first order reactions. For zero order: mol L⁻¹ s⁻¹, for second order: L mol⁻¹ s⁻¹.',
        hint: 'Check the units of the rate constant to determine the order.',
        difficulty: 'Easy',
        tags: ['kinetics', 'rate constant', 'order'],
        isActive: true
    },

    // Practical
    {
        examName: 'JEE Main',
        subject: 'Practical',
        chapterName: 'Salt Analysis',
        question: 'A white precipitate soluble in hot water and gives a pop sound with a burning splinter indicates the presence of:',
        questionType: 'Single Correct',
        options: [
            'Carbonate',
            'Sulphate',
            'Chloride',
            'Nitrate'
        ],
        correctAnswer: 0,
        solution: 'Carbonates give CO₂ on heating, which extinguishes a burning splinter with a pop sound. Many carbonates are white and dissolve in hot water forming bicarbonates.',
        hint: 'Think about which anion produces a gas that can extinguish fire.',
        difficulty: 'Easy',
        tags: ['practical', 'salt analysis', 'carbonates'],
        isActive: true
    },
    {
        examName: 'NEET',
        subject: 'Practical',
        chapterName: 'Volumetric Analysis',
        question: 'Phenolphthalein is a suitable indicator for titration between:',
        questionType: 'Single Correct',
        options: [
            'Strong acid and weak base',
            'Weak acid and strong base',
            'Weak acid and weak base',
            'Strong acid and strong base only'
        ],
        correctAnswer: 1,
        solution: 'Phenolphthalein has a pH range of 8.3-10.0. It is suitable for titrations where the equivalence point is in the basic range, such as weak acid vs strong base. At equivalence point, the solution is basic due to hydrolysis of salt formed.',
        hint: 'Consider the pH range where phenolphthalein changes color.',
        difficulty: 'Medium',
        tags: ['practical', 'titration', 'indicators'],
        isActive: true
    }
];

async function addSampleData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await InfinitePracticeQuestion.deleteMany({});
        console.log('Cleared existing questions');

        // Insert sample questions
        const result = await InfinitePracticeQuestion.insertMany(sampleQuestions);
        console.log(`Added ${result.length} sample questions successfully!`);

        // Display summary
        const summary = await InfinitePracticeQuestion.aggregate([
            {
                $group: {
                    _id: { exam: '$examName', subject: '$subject', chapter: '$chapterName' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.exam': 1, '_id.subject': 1, '_id.chapter': 1 } }
        ]);

        console.log('\n=== Data Summary ===');
        summary.forEach(item => {
            console.log(`${item._id.exam} - ${item._id.subject} - ${item._id.chapter}: ${item.count} questions`);
        });

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error adding sample data:', error);
        process.exit(1);
    }
}

addSampleData();
