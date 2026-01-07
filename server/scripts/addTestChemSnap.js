const mongoose = require('mongoose');
const ChemSnap = require('../models/ChemSnap');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chemistry_coaching', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const testChemSnap = {
    title: 'Periodic Table Quick Reference',
    description: 'Complete periodic table with atomic numbers, symbols, and atomic masses for quick reference',
    fileUrl: 'https://example.com/periodic-table.pdf',
    fileType: 'PDF',
    category: 'General',
    examType: 'All',
    thumbnailUrl: 'https://via.placeholder.com/400x566/1e293b/06b6d4?text=Periodic+Table',
    fileSize: '2.5 MB',
    isActive: true
};

async function addTestChemSnap() {
    try {
        console.log('🧪 Adding test ChemSnap...');

        const chemSnap = new ChemSnap(testChemSnap);
        await chemSnap.save();

        console.log('✅ Test ChemSnap added successfully!');
        console.log('📋 ChemSnap Details:');
        console.log('   ID:', chemSnap._id);
        console.log('   Title:', chemSnap.title);
        console.log('   Category:', chemSnap.category);
        console.log('   Exam Type:', chemSnap.examType);
        console.log('   File Type:', chemSnap.fileType);

        // Verify it's in the database
        const count = await ChemSnap.countDocuments();
        console.log(`\n📊 Total ChemSnaps in database: ${count}`);

        // List all ChemSnaps
        const allChemSnaps = await ChemSnap.find();
        console.log('\n📚 All ChemSnaps:');
        allChemSnaps.forEach((snap, index) => {
            console.log(`   ${index + 1}. ${snap.title} (${snap.category})`);
        });

        mongoose.connection.close();
        console.log('\n✅ Database connection closed');

    } catch (error) {
        console.error('❌ Error adding test ChemSnap:', error);
        mongoose.connection.close();
        process.exit(1);
    }
}

addTestChemSnap();
