const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/reaction-lab', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

const NCERTChapter = require('./models/NCERTChapter');

async function migrateChapters() {
    try {
        console.log('🔄 Starting migration: Adding classLevel to existing NCERT chapters...');

        // Find all chapters without classLevel
        const chaptersWithoutClass = await NCERTChapter.find({
            classLevel: { $exists: false }
        });

        console.log(`📊 Found ${chaptersWithoutClass.length} chapters without classLevel`);

        if (chaptersWithoutClass.length === 0) {
            console.log('✅ All chapters already have classLevel field');
            process.exit(0);
        }

        // Update all chapters without classLevel to default '11'
        const result = await NCERTChapter.updateMany(
            { classLevel: { $exists: false } },
            { $set: { classLevel: '11' } }
        );

        console.log(`✅ Migration completed!`);
        console.log(`   - Updated ${result.modifiedCount} chapters`);
        console.log(`   - Default classLevel set to '11'`);
        console.log('');
        console.log('ℹ️  You can now update individual chapters from the admin panel');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateChapters();
