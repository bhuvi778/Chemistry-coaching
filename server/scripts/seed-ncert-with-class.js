const mongoose = require('mongoose');
const NCERTChapter = require('../models/NCERTChapter');
const NCERTBadge = require('../models/NCERTBadge');
const NCERTQuestion = require('../models/NCERTQuestion');
const NCERTTopic = require('../models/NCERTTopic');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reaction-lab';

async function seedNCERTWithClass() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing NCERT data
        await NCERTChapter.deleteMany({});
        await NCERTBadge.deleteMany({});
        await NCERTQuestion.deleteMany({});
        await NCERTTopic.deleteMany({});
        console.log('🗑️  Cleared existing NCERT data\n');

        // Create Chapters for Line-by-Line
        const chapters = await NCERTChapter.create([
            {
                name: 'Some Basic Concepts of Chemistry',
                chapterNumber: 'Chapter 1',
                description: 'Introduction to chemistry fundamentals',
                icon: 'fa-flask',
                color: 'cyan',
                classLevel: '11',
                category: 'line-by-line',
                order: 1
            },
            {
                name: 'Structure of Atom',
                chapterNumber: 'Chapter 2',
                description: 'Understanding atomic structure',
                icon: 'fa-atom',
                color: 'purple',
                classLevel: '11',
                category: 'line-by-line',
                order: 2
            },
            {
                name: 'Solid State',
                chapterNumber: 'Chapter 1',
                description: 'Properties of solid materials',
                icon: 'fa-cube',
                color: 'blue',
                classLevel: '12',
                category: 'line-by-line',
                order: 1
            },
            {
                name: 'Solutions',
                chapterNumber: 'Chapter 2',
                description: 'Types and properties of solutions',
                icon: 'fa-vial',
                color: 'green',
                classLevel: '12',
                category: 'line-by-line',
                order: 2
            }
        ]);
        console.log(`✅ Created ${chapters.length} chapters (2 Class 11, 2 Class 12)`);

        // Create Badges for Questions/Exemplars/Diagrams
        const badges = await NCERTBadge.create([
            // Class 11 Badges
            {
                name: 'MCQ Questions',
                description: 'Multiple choice questions from NCERT',
                category: 'questions',
                badgeType: 'mcq-11',
                icon: 'fa-question-circle',
                color: 'pink',
                classLevel: '11',
                order: 1
            },
            {
                name: 'Exemplar MCQs',
                description: 'Advanced MCQs from NCERT Exemplar',
                category: 'exemplars',
                badgeType: 'exemplar-mcq-11',
                icon: 'fa-graduation-cap',
                color: 'purple',
                classLevel: '11',
                order: 1
            },
            {
                name: 'Diagram Based',
                description: 'Questions based on diagrams',
                category: 'diagrams',
                badgeType: 'diagram-11',
                icon: 'fa-image',
                color: 'orange',
                classLevel: '11',
                order: 1
            },
            // Class 12 Badges
            {
                name: 'MCQ Questions',
                description: 'Multiple choice questions from NCERT',
                category: 'questions',
                badgeType: 'mcq-12',
                icon: 'fa-question-circle',
                color: 'pink',
                classLevel: '12',
                order: 2
            },
            {
                name: 'Exemplar MCQs',
                description: 'Advanced MCQs from NCERT Exemplar',
                category: 'exemplars',
                badgeType: 'exemplar-mcq-12',
                icon: 'fa-graduation-cap',
                color: 'purple',
                classLevel: '12',
                order: 2
            },
            {
                name: 'Diagram Based',
                description: 'Questions based on diagrams',
                category: 'diagrams',
                badgeType: 'diagram-12',
                icon: 'fa-image',
                color: 'orange',
                classLevel: '12',
                order: 2
            }
        ]);
        console.log(`✅ Created ${badges.length} badges (3 Class 11, 3 Class 12)`);

        // Create sample topics for first chapter
        const topics = await NCERTTopic.create([
            {
                name: 'Importance of Chemistry',
                chapterId: chapters[0]._id,
                difficulty: 'Easy',
                order: 1
            },
            {
                name: 'Nature of Matter',
                chapterId: chapters[0]._id,
                difficulty: 'Medium',
                order: 2
            }
        ]);
        console.log(`✅ Created ${topics.length} topics for Chapter 1`);

        // Create sample questions
        const questions = await NCERTQuestion.create([
            // Line-by-Line Questions (Class 11)
            {
                chapterId: chapters[0]._id,
                topicId: topics[0]._id,
                category: 'line-by-line',
                classLevel: '11',
                questionType: 'MCQ',
                question: 'What is the SI unit of amount of substance?',
                questionText: 'What is the SI unit of amount of substance?',
                options: ['Kilogram', 'Mole', 'Litre', 'Gram'],
                correctAnswer: 'Mole',
                solution: 'The SI unit of amount of substance is mole (mol).',
                difficulty: 'Easy',
                concept: 'Basic Concepts',
                paraname: 'Page 5, Para 2'
            },
            // Badge-based Questions (Class 11)
            {
                chapterId: chapters[0]._id,
                category: 'questions',
                badgeType: 'mcq-11',
                classLevel: '11',
                questionType: 'MCQ',
                question: 'Which of the following is a pure substance?',
                questionText: 'Which of the following is a pure substance?',
                options: ['Air', 'Water', 'Milk', 'Soil'],
                correctAnswer: 'Water',
                solution: 'Water (H₂O) is a pure substance as it has a definite composition.',
                difficulty: 'Easy'
            },
            // Line-by-Line Questions (Class 12)
            {
                chapterId: chapters[2]._id,
                category: 'line-by-line',
                classLevel: '12',
                questionType: 'MCQ',
                question: 'What is the coordination number in a face-centered cubic (FCC) structure?',
                questionText: 'What is the coordination number in a face-centered cubic (FCC) structure?',
                options: ['4', '6', '8', '12'],
                correctAnswer: '12',
                solution: 'In FCC structure, each atom is surrounded by 12 nearest neighbors.',
                difficulty: 'Medium',
                concept: 'Crystal Structures',
                paraname: 'Page 8, Para 3'
            },
            // Badge-based Questions (Class 12)
            {
                chapterId: chapters[2]._id,
                category: 'questions',
                badgeType: 'mcq-12',
                classLevel: '12',
                questionType: 'MCQ',
                question: 'Which type of solid exhibits both electrical and thermal conductivity?',
                questionText: 'Which type of solid exhibits both electrical and thermal conductivity?',
                options: ['Ionic solids', 'Covalent solids', 'Metallic solids', 'Molecular solids'],
                correctAnswer: 'Metallic solids',
                solution: 'Metallic solids have free electrons that allow them to conduct electricity and heat.',
                difficulty: 'Easy'
            }
        ]);
        console.log(`✅ Created ${questions.length} sample questions (2 Class 11, 2 Class 12)`);

        console.log('\n📊 Summary:');
        console.log(`   ✅ ${chapters.length} Chapters (Class 11: 2, Class 12: 2)`);
        console.log(`   ✅ ${badges.length} Badges (Class 11: 3, Class 12: 3)`);
        console.log(`   ✅ ${topics.length} Topics`);
        console.log(`   ✅ ${questions.length} Questions (Class 11: 2, Class 12: 2)`);
        console.log('\n🎉 NCERT seed data created successfully with Class Tags!');
        console.log('\n📝 Next Steps:');
        console.log('   1. Visit the admin panel to see class tags on question cards');
        console.log('   2. Visit NCERT Toolbox pages to see class tags on chapter cards');
        console.log('   3. Add more content through the admin panel');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seedNCERTWithClass();
