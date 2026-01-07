const mongoose = require('mongoose');
const ExamCountdown = require('../models/ExamCountdown');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chemistry_coaching', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create a test countdown for JEE Main 2026
const testCountdown = {
    examName: 'JEE Main 2026 - Session 1',
    examDate: new Date('2026-04-15'), // April 15, 2026
    description: 'First attempt for JEE Main 2026',
    isActive: true,
    color: 'cyan',
    icon: 'fa-graduation-cap'
};

async function addTestCountdown() {
    try {
        console.log('🎯 Creating exam countdown...');

        const countdown = new ExamCountdown(testCountdown);
        await countdown.save();

        console.log('✅ Exam countdown created successfully!');
        console.log('📋 Countdown Details:');
        console.log('   ID:', countdown._id);
        console.log('   Exam:', countdown.examName);
        console.log('   Date:', countdown.examDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }));
        console.log('   Description:', countdown.description);
        console.log('   Color:', countdown.color);
        console.log('   Icon:', countdown.icon);
        console.log('   Active:', countdown.isActive);

        // Calculate days remaining
        const now = new Date();
        const diff = countdown.examDate - now;
        const daysRemaining = Math.floor(diff / (1000 * 60 * 60 * 24));

        console.log('\n⏰ Time Remaining:');
        console.log('   Days:', daysRemaining);

        // Verify it's in the database
        const count = await ExamCountdown.countDocuments();
        console.log(`\n📊 Total countdowns in database: ${count}`);

        mongoose.connection.close();
        console.log('\n✅ Database connection closed');

    } catch (error) {
        console.error('❌ Error creating countdown:', error);
        mongoose.connection.close();
        process.exit(1);
    }
}

addTestCountdown();
