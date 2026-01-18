// Sample data creation script for Flash Cards
// Run this from the server directory: node create-sample-flashcards.js

const mongoose = require('mongoose');
require('dotenv').config();

const FlashCardChapter = require('./models/FlashCardChapter');
const FlashCardTopic = require('./models/FlashCardTopic');
const FlashCard = require('./models/FlashCard');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chemistry_coaching';

// Sample data
const sampleData = {
    chapters: [
        {
            name: 'Solutions',
            description: 'Types of solutions, concentration terms, and colligative properties',
            icon: 'fas fa-flask',
            iconColor: '#a855f7',
            subject: 'Physical Chemistry',
            order: 1
        },
        {
            name: 'Electrochemistry',
            description: 'Electrochemical cells, Nernst equation, and electrolysis',
            icon: 'fas fa-bolt',
            iconColor: '#3b82f6',
            subject: 'Physical Chemistry',
            order: 2
        },
        {
            name: 'Chemical Kinetics',
            description: 'Rate of reaction, order, and mechanisms',
            icon: 'fas fa-tachometer-alt',
            iconColor: '#10b981',
            subject: 'Physical Chemistry',
            order: 3
        }
    ],
    topics: {
        'Solutions': [
            { name: 'Classification of Solutions', description: 'Types and properties of solutions', order: 1 },
            { name: 'Concentration Terms', description: 'Molarity, molality, mole fraction, etc.', order: 2 },
            { name: 'Henry\'s Law', description: 'Gas solubility in liquids', order: 3 },
            { name: 'Raoult\'s Law', description: 'Vapor pressure of solutions', order: 4 },
            { name: 'Colligative Properties', description: 'Properties depending on particle concentration', order: 5 }
        ],
        'Electrochemistry': [
            { name: 'Electrochemical Cells', description: 'Galvanic and electrolytic cells', order: 1 },
            { name: 'Electrode Potential', description: 'Standard electrode potential and EMF', order: 2 },
            { name: 'Nernst Equation', description: 'Effect of concentration on cell potential', order: 3 }
        ],
        'Chemical Kinetics': [
            { name: 'Rate of Reaction', description: 'Factors affecting reaction rate', order: 1 },
            { name: 'Order of Reaction', description: 'Zero, first, and second order reactions', order: 2 }
        ]
    },
    cards: {
        'Classification of Solutions': [
            {
                question: 'Name a solution where liquid is solute and solid is solvent.',
                answer: 'Amalgam (mercury dissolved in solid metals)',
                difficulty: 'Medium'
            },
            {
                question: 'What type of solution is formed when a gas dissolves in a liquid?',
                answer: 'Gas-liquid solution (e.g., carbonated water, oxygen in water)',
                difficulty: 'Easy'
            },
            {
                question: 'Define a saturated solution.',
                answer: 'A solution that contains the maximum amount of solute that can dissolve at a given temperature and pressure.',
                difficulty: 'Easy'
            }
        ],
        'Concentration Terms': [
            {
                question: 'What is molarity?',
                answer: 'Number of moles of solute per liter of solution (mol/L)',
                difficulty: 'Easy'
            },
            {
                question: 'How does molality differ from molarity?',
                answer: 'Molality is moles of solute per kg of solvent, while molarity is moles per liter of solution. Molality is temperature-independent.',
                difficulty: 'Medium'
            },
            {
                question: 'Define mole fraction.',
                answer: 'Ratio of moles of one component to total moles of all components in the solution.',
                difficulty: 'Easy'
            }
        ],
        'Henry\'s Law': [
            {
                question: 'State Henry\'s Law.',
                answer: 'The partial pressure of a gas above a solution is directly proportional to its mole fraction in the solution: P = KH × x',
                difficulty: 'Medium'
            },
            {
                question: 'Why do deep-sea divers get "the bends"?',
                answer: 'Due to rapid decrease in pressure, nitrogen gas dissolved in blood (per Henry\'s Law) forms bubbles causing pain.',
                difficulty: 'Hard'
            }
        ],
        'Electrochemical Cells': [
            {
                question: 'What is the difference between galvanic and electrolytic cells?',
                answer: 'Galvanic cells convert chemical energy to electrical energy (spontaneous). Electrolytic cells use electrical energy to drive non-spontaneous reactions.',
                difficulty: 'Medium'
            },
            {
                question: 'In which direction do electrons flow in a galvanic cell?',
                answer: 'From anode (oxidation) to cathode (reduction) through the external circuit.',
                difficulty: 'Easy'
            }
        ],
        'Nernst Equation': [
            {
                question: 'Write the Nernst equation for a cell.',
                answer: 'E_cell = E°_cell - (RT/nF) × ln(Q) or E_cell = E°_cell - (0.0591/n) × log(Q) at 25°C',
                difficulty: 'Hard'
            }
        ],
        'Rate of Reaction': [
            {
                question: 'What are the four main factors affecting rate of reaction?',
                answer: '1. Concentration of reactants, 2. Temperature, 3. Catalyst, 4. Surface area',
                difficulty: 'Easy'
            }
        ]
    }
};

async function createSampleData() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing flashcard data
        console.log('🗑️  Clearing existing flashcard data...');
        await FlashCard.deleteMany({});
        await FlashCardTopic.deleteMany({});
        await FlashCardChapter.deleteMany({});
        console.log('✅ Cleared existing data');

        // Create chapters
        console.log('📚 Creating chapters...');
        const chapterMap = {};
        for (const chapterData of sampleData.chapters) {
            const chapter = await FlashCardChapter.create(chapterData);
            chapterMap[chapter.name] = chapter._id;
            console.log(`  ✓ Created chapter: ${chapter.name}`);
        }

        // Create topics
        console.log('📖 Creating topics...');
        const topicMap = {};
        for (const [chapterName, topics] of Object.entries(sampleData.topics)) {
            const chapterId = chapterMap[chapterName];
            for (const topicData of topics) {
                const topic = await FlashCardTopic.create({
                    ...topicData,
                    chapterId
                });
                topicMap[topic.name] = { _id: topic._id, chapterId };
                console.log(`  ✓ Created topic: ${topic.name} in ${chapterName}`);
            }
        }

        // Create cards
        console.log('🎴 Creating flashcards...');
        let totalCards = 0;
        for (const [topicName, cards] of Object.entries(sampleData.cards)) {
            const { _id: topicId, chapterId } = topicMap[topicName];
            for (const cardData of cards) {
                await FlashCard.create({
                    ...cardData,
                    topicId,
                    chapterId,
                    tags: []
                });
                totalCards++;
            }
            console.log(`  ✓ Created ${cards.length} cards for: ${topicName}`);
        }

        console.log('\n✨ Sample data created successfully!');
        console.log(`📊 Summary:`);
        console.log(`   - Chapters: ${Object.keys(chapterMap).length}`);
        console.log(`   - Topics: ${Object.keys(topicMap).length}`);
        console.log(`   - Cards: ${totalCards}`);
        console.log('\n🎯 You can now test the flashcard system!');

    } catch (error) {
        console.error('❌ Error creating sample data:', error);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
    }
}

// Run the script
createSampleData();
