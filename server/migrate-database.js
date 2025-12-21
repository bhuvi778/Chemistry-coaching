// MongoDB Data Migration Script
// Migrates all data from old database to new database

const mongoose = require('mongoose');

// Database URLs
const OLD_DB = 'mongodb+srv://bhupeshsingh778_db_user:qwerty12345@cluster0.u70wcn8.mongodb.net/?appName=Cluster0';
const NEW_DB = 'mongodb+srv://ace2examz_db_user:2UuCZsIDWcWrGXAi@ace2examz-cluster.nmf7peg.mongodb.net/?appName=Ace2Examz-Cluster';

// Import models
const Course = require('./models/Course');
const Enquiry = require('./models/Enquiry');
const Contact = require('./models/Contact');
const Video = require('./models/Video');
const AudioBook = require('./models/AudioBook');
const StudyMaterial = require('./models/StudyMaterial');
const Magazine = require('./models/Magazine');
const MeetingRequest = require('./models/MeetingRequest');
const WebinarCard = require('./models/WebinarCard');
const Doubt = require('./models/Doubt');
const Feedback = require('./models/Feedback');
const Crossword = require('./models/Crossword');
const CrosswordAnswer = require('./models/CrosswordAnswer');
const PuzzleSet = require('./models/PuzzleSet');

// Collections to migrate
const collections = [
    { name: 'Courses', model: Course },
    { name: 'Enquiries', model: Enquiry },
    { name: 'Contacts', model: Contact },
    { name: 'Videos', model: Video },
    { name: 'AudioBooks', model: AudioBook },
    { name: 'StudyMaterials', model: StudyMaterial },
    { name: 'Magazines', model: Magazine },
    { name: 'MeetingRequests', model: MeetingRequest },
    { name: 'WebinarCards', model: WebinarCard },
    { name: 'Doubts', model: Doubt },
    { name: 'Feedback', model: Feedback },
    { name: 'Crosswords', model: Crossword },
    { name: 'CrosswordAnswers', model: CrosswordAnswer },
    { name: 'PuzzleSets', model: PuzzleSet }
];

async function migrateData() {
    let oldConnection = null;
    let newConnection = null;

    try {
        console.log('🚀 Starting MongoDB Data Migration...\n');

        // Connect to OLD database
        console.log('📡 Connecting to OLD database...');
        oldConnection = await mongoose.createConnection(OLD_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to OLD database\n');

        // Connect to NEW database
        console.log('📡 Connecting to NEW database...');
        newConnection = await mongoose.createConnection(NEW_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to NEW database\n');

        console.log('📊 Migration Summary:\n');
        console.log('─'.repeat(60));

        let totalDocuments = 0;
        let totalCollections = 0;

        // Migrate each collection
        for (const { name, model } of collections) {
            try {
                // Get model from old connection
                const OldModel = oldConnection.model(name, model.schema);

                // Get model from new connection
                const NewModel = newConnection.model(name, model.schema);

                // Fetch all documents from old database
                const documents = await OldModel.find().lean();

                if (documents.length === 0) {
                    console.log(`⚪ ${name.padEnd(20)} - No data to migrate`);
                    continue;
                }

                // Clear existing data in new database (optional - comment out if you want to keep existing data)
                await NewModel.deleteMany({});

                // Insert documents into new database
                if (documents.length > 0) {
                    // Remove _id to let MongoDB generate new ones, or keep them for consistency
                    const documentsToInsert = documents.map(doc => {
                        const { _id, ...rest } = doc;
                        return { _id, ...rest }; // Keep original _id for consistency
                    });

                    await NewModel.insertMany(documentsToInsert);
                    console.log(`✅ ${name.padEnd(20)} - Migrated ${documents.length} documents`);
                    totalDocuments += documents.length;
                    totalCollections++;
                }
            } catch (error) {
                console.log(`❌ ${name.padEnd(20)} - Error: ${error.message}`);
            }
        }

        console.log('─'.repeat(60));
        console.log(`\n🎉 Migration Complete!`);
        console.log(`📊 Total Collections Migrated: ${totalCollections}`);
        console.log(`📄 Total Documents Migrated: ${totalDocuments}\n`);

        // Create indexes on new database
        console.log('🔧 Creating indexes on new database...');

        const VideoModel = newConnection.model('Videos', Video.schema);
        const AudioBookModel = newConnection.model('AudioBooks', AudioBook.schema);
        const StudyMaterialModel = newConnection.model('StudyMaterials', StudyMaterial.schema);
        const MagazineModel = newConnection.model('Magazines', Magazine.schema);
        const EnquiryModel = newConnection.model('Enquiries', Enquiry.schema);
        const ContactModel = newConnection.model('Contacts', Contact.schema);
        const MeetingRequestModel = newConnection.model('MeetingRequests', MeetingRequest.schema);

        await VideoModel.collection.createIndex({ isActive: 1, createdAt: -1 });
        await AudioBookModel.collection.createIndex({ isActive: 1, createdAt: -1 });
        await StudyMaterialModel.collection.createIndex({ isActive: 1, createdAt: -1 });
        await MagazineModel.collection.createIndex({ isActive: 1, createdAt: -1 });
        await EnquiryModel.collection.createIndex({ date: -1 });
        await ContactModel.collection.createIndex({ date: -1 });
        await MeetingRequestModel.collection.createIndex({ submittedAt: -1 });

        console.log('✅ Indexes created successfully!\n');

        // Verify migration
        console.log('🔍 Verifying migration...\n');
        console.log('─'.repeat(60));

        for (const { name, model } of collections) {
            try {
                const OldModel = oldConnection.model(name, model.schema);
                const NewModel = newConnection.model(name, model.schema);

                const oldCount = await OldModel.countDocuments();
                const newCount = await NewModel.countDocuments();

                if (oldCount === newCount) {
                    console.log(`✅ ${name.padEnd(20)} - OLD: ${oldCount}, NEW: ${newCount} ✓`);
                } else {
                    console.log(`⚠️  ${name.padEnd(20)} - OLD: ${oldCount}, NEW: ${newCount} ✗`);
                }
            } catch (error) {
                console.log(`❌ ${name.padEnd(20)} - Verification failed`);
            }
        }

        console.log('─'.repeat(60));
        console.log('\n✅ Migration and verification complete!\n');

        console.log('📝 Next Steps:');
        console.log('1. Update server.js to use the new database URL');
        console.log('2. Test the application with the new database');
        console.log('3. Once confirmed working, you can delete the old database\n');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        // Close connections
        if (oldConnection) {
            await oldConnection.close();
            console.log('🔌 Disconnected from OLD database');
        }
        if (newConnection) {
            await newConnection.close();
            console.log('🔌 Disconnected from NEW database');
        }
        process.exit(0);
    }
}

// Run migration
console.log('\n' + '='.repeat(60));
console.log('  MongoDB Data Migration Tool');
console.log('='.repeat(60) + '\n');
console.log('OLD DB: ' + OLD_DB.substring(0, 50) + '...');
console.log('NEW DB: ' + NEW_DB.substring(0, 50) + '...\n');
console.log('⚠️  WARNING: This will replace all data in the NEW database!');
console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

// Wait 5 seconds before starting
setTimeout(() => {
    migrateData();
}, 5000);
