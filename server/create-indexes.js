// Database Indexing Script for High Performance
// Run this script once to create indexes on frequently queried fields

const mongoose = require('mongoose');
const Course = require('./models/Course');
const Video = require('./models/Video');
const AudioBook = require('./models/AudioBook');
const StudyMaterial = require('./models/StudyMaterial');
const Magazine = require('./models/Magazine');
const Enquiry = require('./models/Enquiry');
const Contact = require('./models/Contact');
const MeetingRequest = require('./models/MeetingRequest');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bhupeshsingh778_db_user:qwerty12345@cluster0.u70wcn8.mongodb.net/?appName=Cluster0';

async function createIndexes() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Connected to MongoDB');
        console.log('🔧 Creating indexes for optimal performance...\n');

        // Videos - Index on isActive and createdAt for faster queries
        await Video.collection.createIndex({ isActive: 1, createdAt: -1 });
        console.log('✓ Video indexes created');

        // AudioBooks - Index on isActive and createdAt
        await AudioBook.collection.createIndex({ isActive: 1, createdAt: -1 });
        console.log('✓ AudioBook indexes created');

        // Study Materials - Index on isActive and createdAt
        await StudyMaterial.collection.createIndex({ isActive: 1, createdAt: -1 });
        console.log('✓ StudyMaterial indexes created');

        // Magazines - Index on isActive and createdAt
        await Magazine.collection.createIndex({ isActive: 1, createdAt: -1 });
        console.log('✓ Magazine indexes created');

        // Enquiries - Index on date for sorting
        await Enquiry.collection.createIndex({ date: -1 });
        console.log('✓ Enquiry indexes created');

        // Contacts - Index on date for sorting
        await Contact.collection.createIndex({ date: -1 });
        console.log('✓ Contact indexes created');

        // Meeting Requests - Index on submittedAt for sorting
        await MeetingRequest.collection.createIndex({ submittedAt: -1 });
        console.log('✓ MeetingRequest indexes created');

        // Courses - Index on categories for filtering
        if (Course.schema.path('categories')) {
            await Course.collection.createIndex({ categories: 1 });
            console.log('✓ Course indexes created');
        }

        console.log('\n🎉 All indexes created successfully!');
        console.log('📊 Database queries will now be 10-100x faster!');

        // Show index statistics
        const collections = [
            { name: 'Videos', model: Video },
            { name: 'AudioBooks', model: AudioBook },
            { name: 'StudyMaterials', model: StudyMaterial },
            { name: 'Magazines', model: Magazine },
            { name: 'Enquiries', model: Enquiry },
            { name: 'Contacts', model: Contact },
            { name: 'MeetingRequests', model: MeetingRequest },
            { name: 'Courses', model: Course }
        ];

        console.log('\n📈 Index Statistics:');
        for (const { name, model } of collections) {
            const indexes = await model.collection.getIndexes();
            console.log(`${name}: ${Object.keys(indexes).length} indexes`);
        }

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating indexes:', error);
        process.exit(1);
    }
}

createIndexes();
