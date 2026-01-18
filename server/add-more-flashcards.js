// Add more comprehensive flashcards for better testing
const mongoose = require('mongoose');
require('dotenv').config();

const FlashCardChapter = require('./models/FlashCardChapter');
const FlashCardTopic = require('./models/FlashCardTopic');
const FlashCard = require('./models/FlashCard');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chemistry_coaching';

async function addMoreCards() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Get existing chapters and topics
        const chapters = await FlashCardChapter.find();
        const topics = await FlashCardTopic.find();

        console.log('📊 Current state:');
        console.log(`   - Chapters: ${chapters.length}`);
        console.log(`   - Topics: ${topics.length}`);

        // Find specific topics and add more cards
        const raoultsLaw = topics.find(t => t.name === "Raoult's Law");
        const colligativeProps = topics.find(t => t.name === "Colligative Properties");
        const electrodePotential = topics.find(t => t.name === "Electrode Potential");
        const orderOfReaction = topics.find(t => t.name === "Order of Reaction");

        const newCards = [];

        // Add cards for Raoult's Law
        if (raoultsLaw) {
            newCards.push(
                {
                    chapterId: raoultsLaw.chapterId,
                    topicId: raoultsLaw._id,
                    question: "State Raoult's Law for ideal solutions.",
                    answer: "For an ideal solution, the partial vapor pressure of each component is equal to the product of its mole fraction and its vapor pressure in pure state: P_A = X_A × P°_A",
                    difficulty: 'Medium',
                    tags: ['raoult', 'vapor pressure', 'ideal solution']
                },
                {
                    chapterId: raoultsLaw.chapterId,
                    topicId: raoultsLaw._id,
                    question: "What is a positive deviation from Raoult's Law?",
                    answer: "When A-B interactions are weaker than A-A and B-B interactions, vapor pressure is higher than expected. Example: Ethanol + Cyclohexane",
                    difficulty: 'Hard',
                    tags: ['deviation', 'non-ideal']
                },
                {
                    chapterId: raoultsLaw.chapterId,
                    topicId: raoultsLaw._id,
                    question: "Give an example of negative deviation from Raoult's Law.",
                    answer: "Chloroform + Acetone (due to hydrogen bonding, vapor pressure is lower than expected)",
                    difficulty: 'Medium',
                    tags: ['deviation', 'hydrogen bonding']
                }
            );
        }

        // Add cards for Colligative Properties
        if (colligativeProps) {
            newCards.push(
                {
                    chapterId: colligativeProps.chapterId,
                    topicId: colligativeProps._id,
                    question: "What are the four colligative properties?",
                    answer: "1. Relative lowering of vapor pressure, 2. Elevation of boiling point, 3. Depression of freezing point, 4. Osmotic pressure",
                    difficulty: 'Easy',
                    tags: ['colligative', 'properties']
                },
                {
                    chapterId: colligativeProps.chapterId,
                    topicId: colligativeProps._id,
                    question: "Why is salt added to water when boiling vegetables?",
                    answer: "Salt increases the boiling point of water (boiling point elevation), allowing vegetables to cook faster at a higher temperature.",
                    difficulty: 'Easy',
                    tags: ['boiling point', 'application']
                },
                {
                    chapterId: colligativeProps.chapterId,
                    topicId: colligativeProps._id,
                    question: "What is van't Hoff factor (i)?",
                    answer: "The ratio of actual number of particles after dissociation to the number of formula units initially dissolved. For NaCl, i ≈ 2; for glucose, i = 1",
                    difficulty: 'Hard',
                    tags: ['vant hoff', 'dissociation']
                },
                {
                    chapterId: colligativeProps.chapterId,
                    topicId: colligativeProps._id,
                    question: "Why is CaCl₂ more effective than NaCl for melting ice?",
                    answer: "CaCl₂ dissociates into 3 ions (i ≈ 3) while NaCl gives 2 ions (i ≈ 2), causing greater freezing point depression per mole.",
                    difficulty: 'Medium',
                    tags: ['freezing point', 'application', 'dissociation']
                }
            );
        }

        // Add cards for Electrode Potential
        if (electrodePotential) {
            newCards.push(
                {
                    chapterId: electrodePotential.chapterId,
                    topicId: electrodePotential._id,
                    question: "What is standard electrode potential (E°)?",
                    answer: "The potential of an electrode measured against standard hydrogen electrode (SHE) under standard conditions (1M, 1 atm, 25°C)",
                    difficulty: 'Medium',
                    tags: ['electrode potential', 'standard']
                },
                {
                    chapterId: electrodePotential.chapterId,
                    topicId: electrodePotential._id,
                    question: "How do you calculate standard cell potential?",
                    answer: "E°_cell = E°_cathode - E°_anode (reduction potential of cathode minus reduction potential of anode)",
                    difficulty: 'Medium',
                    tags: ['cell potential', 'calculation']
                },
                {
                    chapterId: electrodePotential.chapterId,
                    topicId: electrodePotential._id,
                    question: "What does a positive E°_cell indicate?",
                    answer: "A positive E°_cell indicates a spontaneous reaction (ΔG° is negative). The reaction will proceed in the forward direction.",
                    difficulty: 'Easy',
                    tags: ['spontaneity', 'thermodynamics']
                }
            );
        }

        // Add cards for Order of Reaction
        if (orderOfReaction) {
            newCards.push(
                {
                    chapterId: orderOfReaction.chapterId,
                    topicId: orderOfReaction._id,
                    question: "What is a zero-order reaction?",
                    answer: "A reaction whose rate is independent of reactant concentration. Rate = k. Example: Photochemical reactions, enzyme-catalyzed reactions at high substrate concentration.",
                    difficulty: 'Medium',
                    tags: ['zero order', 'kinetics']
                },
                {
                    chapterId: orderOfReaction.chapterId,
                    topicId: orderOfReaction._id,
                    question: "Write the integrated rate law for a first-order reaction.",
                    answer: "ln[A] = ln[A]₀ - kt or [A] = [A]₀ e^(-kt). Half-life: t₁/₂ = 0.693/k",
                    difficulty: 'Hard',
                    tags: ['first order', 'integrated rate law']
                },
                {
                    chapterId: orderOfReaction.chapterId,
                    topicId: orderOfReaction._id,
                    question: "How does half-life vary with initial concentration for different orders?",
                    answer: "Zero order: t₁/₂ ∝ [A]₀; First order: t₁/₂ is constant (independent of [A]₀); Second order: t₁/₂ ∝ 1/[A]₀",
                    difficulty: 'Hard',
                    tags: ['half-life', 'order comparison']
                }
            );
        }

        // Insert all new cards
        if (newCards.length > 0) {
            console.log(`\n🎴 Adding ${newCards.length} more flashcards...`);
            await FlashCard.insertMany(newCards);
            console.log('✅ Successfully added new cards!');
        }

        // Get final counts
        const finalCardCount = await FlashCard.countDocuments();
        const topicStats = await Promise.all(
            topics.map(async (topic) => {
                const count = await FlashCard.countDocuments({ topicId: topic._id });
                return { name: topic.name, count };
            })
        );

        console.log('\n📊 Final Statistics:');
        console.log(`   Total Cards: ${finalCardCount}`);
        console.log('\n   Cards per Topic:');
        topicStats.forEach(stat => {
            if (stat.count > 0) {
                console.log(`   - ${stat.name}: ${stat.count} cards`);
            }
        });

        console.log('\n✨ Flashcard system is now fully populated and ready for testing!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
    }
}

addMoreCards();
