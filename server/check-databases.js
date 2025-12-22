// Simple script to list collections in both databases
const mongoose = require('mongoose');

const NEW_DB = 'mongodb+srv://ace2examz_db_user:2UuCZsIDWcWrGXAi@ace2examz-cluster.nmf7peg.mongodb.net/test?appName=Ace2Examz-Cluster';

const Course = require('./models/Course');
const Video = require('./models/Video');
const AudioBook = require('./models/AudioBook');
const StudyMaterial = require('./models/StudyMaterial');
const Magazine = require('./models/Magazine');
const Crossword = require('./models/Crossword');
const PuzzleSet = require('./models/PuzzleSet');
const Doubt = require('./models/Doubt');
const WebinarCard = require('./models/WebinarCard');
const Feedback = require('./models/Feedback');
const Enquiry = require('./models/Enquiry');
const Contact = require('./models/Contact');

async function checkData() {
    try {
        console.log('🔍 Checking ace2examz database...\n');

        const conn = await mongoose.connect(NEW_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Connected to MongoDB\n');

        // Check all collections
        const collections = [
            { name: 'Courses', model: Course },
            { name: 'Videos', model: Video },
            { name: 'AudioBooks', model: AudioBook },
            { name: 'StudyMaterials', model: StudyMaterial },
            { name: 'Magazines', model: Magazine },
            { name: 'Crosswords', model: Crossword },
            { name: 'Puzzles', model: PuzzleSet },
            { name: 'Doubts', model: Doubt },
            { name: 'Webinars', model: WebinarCard },
            { name: 'Feedback', model: Feedback },
            { name: 'Enquiries', model: Enquiry },
            { name: 'Contacts', model: Contact }
        ];

        console.log('📊 Database Contents:\n');
        console.log('='.repeat(60));

        for (const { name, model } of collections) {
            const count = await model.countDocuments();
            const items = await model.find().limit(2);
            
            console.log(`\n${name}: ${count} documents`);
            if (items.length > 0) {
                items.forEach((item, idx) => {
                    const title = item.title || item.name || item.question || item.subject || item._id;
                    console.log(`  ${idx + 1}. ${title}`);
                });
            } else {
                console.log('  (empty)');
            }
        }

        console.log('\n' + '='.repeat(60));

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkData();
