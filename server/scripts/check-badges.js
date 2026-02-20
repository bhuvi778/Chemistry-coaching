const mongoose = require('mongoose');
const NCERTBadge = require('../models/NCERTBadge');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reaction-lab';

async function checkBadges() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const badges = await NCERTBadge.find().select('name category badgeType classLevel');

        console.log('🏅 All NCERT Badges:\n');

        if (badges.length === 0) {
            console.log('❌ No badges found in database!');
        } else {
            badges.forEach((badge, index) => {
                console.log(`${index + 1}. ${badge.name}`);
                console.log(`   Category: ${badge.category}`);
                console.log(`   BadgeType: ${badge.badgeType}`);
                console.log(`   ClassLevel: ${badge.classLevel || '❌ NOT SET'}`);
                console.log('');
            });
        }

        console.log(`\n📊 Total Badges: ${badges.length}`);
        const badgesWithClass = badges.filter(b => b.classLevel).length;
        const badgesWithoutClass = badges.filter(b => !b.classLevel).length;
        console.log(`   With classLevel: ${badgesWithClass}`);
        console.log(`   Without classLevel: ${badgesWithoutClass}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Check failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

checkBadges();
