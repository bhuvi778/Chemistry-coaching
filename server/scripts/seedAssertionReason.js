const mongoose = require('mongoose');
const AssertionReasonChapter = require('../models/AssertionReasonChapter');
const AssertionReasonQuestion = require('../models/AssertionReasonQuestion');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/chemistry_coaching', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Sample chapters data
const chaptersData = [
    {
        name: 'Chemical Kinetics',
        description: 'Study reaction rates, rate laws, and mechanisms',
        icon: 'fas fa-bolt',
        iconColor: '#8b5cf6',
        category: 'Physical',
        order: 1,
        isActive: true
    },
    {
        name: 'Amines',
        description: 'Organic compounds containing nitrogen',
        icon: 'fas fa-flask',
        iconColor: '#3b82f6',
        category: 'Organic',
        order: 2,
        isActive: true
    },
    {
        name: 'Alcohols, Phenols and Ethers',
        description: 'Hydroxyl and ether functional groups',
        icon: 'fas fa-vial',
        iconColor: '#10b981',
        category: 'Organic',
        order: 3,
        isActive: true
    },
    {
        name: 'Aldehydes and Ketones',
        description: 'Carbonyl compounds and their reactions',
        icon: 'fas fa-atom',
        iconColor: '#f59e0b',
        category: 'Organic',
        order: 4,
        isActive: true
    },
    {
        name: 'Biomolecules',
        description: 'Carbohydrates, proteins, nucleic acids',
        icon: 'fas fa-dna',
        iconColor: '#ef4444',
        category: 'Organic',
        order: 5,
        isActive: true
    },
    {
        name: 'Coordination Compounds',
        description: 'Complex ions and coordination chemistry',
        icon: 'fas fa-cube',
        iconColor: '#ec4899',
        category: 'Inorganic',
        order: 6,
        isActive: true
    }
];

// Sample questions for Chemical Kinetics
const chemicalKineticsQuestions = [
    {
        assertion: 'The rate of a chemical reaction always increases with increase in temperature.',
        reason: 'The activation energy of the reaction decreases with increase in temperature.',
        assertionTrue: true,
        reasonTrue: false,
        reasonExplainsAssertion: false,
        difficulty: 'Medium',
        tags: ['temperature', 'rate', 'activation energy']
    },
    {
        assertion: 'For a first-order reaction, the time required for 99% completion is twice the time required for 90% completion.',
        reason: 'The half-life of a first-order reaction is independent of initial concentration.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: false,
        difficulty: 'Hard',
        tags: ['first-order', 'half-life', 'completion']
    },
    {
        assertion: 'The rate constant of a reaction is independent of temperature.',
        reason: 'Rate constant depends only on the nature of reactants.',
        assertionTrue: false,
        reasonTrue: false,
        reasonExplainsAssertion: false,
        difficulty: 'Easy',
        tags: ['rate constant', 'temperature']
    },
    {
        assertion: 'Catalyst increases the rate of a chemical reaction.',
        reason: 'Catalyst provides an alternate pathway with lower activation energy.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Easy',
        tags: ['catalyst', 'activation energy', 'rate']
    },
    {
        assertion: 'The order of a reaction can be determined from its balanced chemical equation.',
        reason: 'Order of reaction is always equal to the sum of stoichiometric coefficients.',
        assertionTrue: false,
        reasonTrue: false,
        reasonExplainsAssertion: false,
        difficulty: 'Medium',
        tags: ['order', 'stoichiometry']
    }
];

// Sample questions for Amines
const aminesQuestions = [
    {
        assertion: 'Aniline is less basic than methylamine.',
        reason: 'In aniline, the lone pair of electrons on nitrogen is delocalized over the benzene ring.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Medium',
        tags: ['basicity', 'aniline', 'delocalization']
    },
    {
        assertion: 'Primary amines have higher boiling points than tertiary amines.',
        reason: 'Primary amines can form more hydrogen bonds than tertiary amines.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Easy',
        tags: ['boiling point', 'hydrogen bonding']
    },
    {
        assertion: 'Aliphatic amines are stronger bases than aromatic amines.',
        reason: 'Aromatic amines undergo resonance stabilization.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Medium',
        tags: ['basicity', 'resonance', 'aliphatic', 'aromatic']
    },
    {
        assertion: 'Gabriel phthalimide synthesis is used for the preparation of primary amines.',
        reason: 'This method cannot be used for the preparation of aromatic primary amines.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: false,
        difficulty: 'Hard',
        tags: ['Gabriel synthesis', 'primary amines']
    }
];

// Sample questions for Alcohols
const alcoholsQuestions = [
    {
        assertion: 'Phenol is more acidic than ethanol.',
        reason: 'Phenoxide ion is stabilized by resonance.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Easy',
        tags: ['acidity', 'phenol', 'resonance']
    },
    {
        assertion: 'Tertiary alcohols are oxidized more easily than primary alcohols.',
        reason: 'Tertiary alcohols have more alkyl groups attached to the carbon bearing OH group.',
        assertionTrue: false,
        reasonTrue: true,
        reasonExplainsAssertion: false,
        difficulty: 'Medium',
        tags: ['oxidation', 'alcohols']
    },
    {
        assertion: 'Ethers have lower boiling points than alcohols of comparable molecular mass.',
        reason: 'Ethers cannot form hydrogen bonds among themselves.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Easy',
        tags: ['boiling point', 'ethers', 'hydrogen bonding']
    }
];

// Sample questions for Aldehydes and Ketones
const aldehydesQuestions = [
    {
        assertion: 'Aldehydes are more reactive than ketones towards nucleophilic addition reactions.',
        reason: 'The carbonyl carbon in aldehydes is less sterically hindered and more electrophilic.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Medium',
        tags: ['reactivity', 'nucleophilic addition', 'steric hindrance']
    },
    {
        assertion: 'Formaldehyde gives Cannizzaro reaction.',
        reason: 'Formaldehyde has no α-hydrogen.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Medium',
        tags: ['Cannizzaro', 'formaldehyde', 'alpha-hydrogen']
    },
    {
        assertion: 'Acetaldehyde gives positive Fehling\'s test.',
        reason: 'Acetaldehyde can be easily oxidized to acetic acid.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Easy',
        tags: ['Fehling test', 'oxidation', 'acetaldehyde']
    }
];

// Sample questions for Biomolecules
const biomoleculesQuestions = [
    {
        assertion: 'Glucose and fructose are functional isomers.',
        reason: 'Glucose is an aldose while fructose is a ketose.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Easy',
        tags: ['glucose', 'fructose', 'isomers']
    },
    {
        assertion: 'All monosaccharides are reducing sugars.',
        reason: 'Monosaccharides contain free aldehyde or ketone groups.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Medium',
        tags: ['monosaccharides', 'reducing sugars']
    },
    {
        assertion: 'DNA is more stable than RNA.',
        reason: 'DNA contains thymine while RNA contains uracil.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: false,
        difficulty: 'Hard',
        tags: ['DNA', 'RNA', 'stability']
    }
];

// Sample questions for Coordination Compounds
const coordinationQuestions = [
    {
        assertion: 'EDTA is a hexadentate ligand.',
        reason: 'EDTA has six donor atoms.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Easy',
        tags: ['EDTA', 'ligand', 'dentate']
    },
    {
        assertion: 'Square planar complexes show geometrical isomerism.',
        reason: 'Square planar geometry allows for cis-trans arrangements.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Medium',
        tags: ['square planar', 'isomerism']
    },
    {
        assertion: 'Crystal field splitting energy is greater for octahedral complexes than tetrahedral complexes.',
        reason: 'In octahedral complexes, there are six ligands while in tetrahedral there are only four.',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Hard',
        tags: ['crystal field', 'octahedral', 'tetrahedral']
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await AssertionReasonQuestion.deleteMany({});
        await AssertionReasonChapter.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create chapters
        console.log('📚 Creating chapters...');
        const createdChapters = await AssertionReasonChapter.insertMany(chaptersData);
        console.log(`✅ Created ${createdChapters.length} chapters\n`);

        // Create questions for each chapter
        const questionsMap = {
            'Chemical Kinetics': chemicalKineticsQuestions,
            'Amines': aminesQuestions,
            'Alcohols, Phenols and Ethers': alcoholsQuestions,
            'Aldehydes and Ketones': aldehydesQuestions,
            'Biomolecules': biomoleculesQuestions,
            'Coordination Compounds': coordinationQuestions
        };

        console.log('❓ Creating questions...');
        let totalQuestions = 0;

        for (const chapter of createdChapters) {
            const questions = questionsMap[chapter.name] || [];

            if (questions.length > 0) {
                const questionsWithChapterId = questions.map((q, index) => ({
                    ...q,
                    chapterId: chapter._id,
                    order: index + 1
                }));

                await AssertionReasonQuestion.insertMany(questionsWithChapterId);
                totalQuestions += questions.length;
                console.log(`   ✓ ${chapter.name}: ${questions.length} questions`);
            }
        }

        console.log(`\n✅ Created ${totalQuestions} total questions\n`);

        // Display summary
        console.log('📊 Database Seeding Summary:');
        console.log('================================');
        console.log(`Total Chapters: ${createdChapters.length}`);
        console.log(`Total Questions: ${totalQuestions}`);
        console.log('================================\n');

        console.log('🎉 Database seeding completed successfully!\n');

        // Display chapter details
        console.log('📋 Chapter Details:');
        for (const chapter of createdChapters) {
            const count = await AssertionReasonQuestion.countDocuments({ chapterId: chapter._id });
            console.log(`   - ${chapter.name}: ${count} questions`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeder
connectDB().then(() => {
    seedDatabase();
});
