const mongoose = require('mongoose');
const ScoreMatchBatch = require('../models/ScoreMatchBatch');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chemistry_coaching';

const sampleBatches = [
    {
        title: "JEE Advanced Crash Course",
        subtitle: "Intensive preparation for JEE Advanced",
        desc: "Complete JEE Advanced syllabus coverage in 60 days with daily live classes, doubt sessions, and comprehensive test series.",
        exam: "JEE",
        batchType: "Crash Course",
        price: "₹15,000",
        duration: "60 Days",
        schedule: "Mon-Sat, 6 PM - 9 PM",
        startDate: "15th January 2026",
        features: [
            "Daily 3-hour live classes",
            "100+ Practice problems daily",
            "Weekly full-length tests",
            "Personal mentor support",
            "Recorded lectures access"
        ],
        color: "cyan",
        icon: "fa-bolt",
        badge: "Popular",
        enrollmentLink: "https://forms.google.com/jee-crash-course"
    },
    {
        title: "NEET Revision Batch",
        subtitle: "Complete syllabus revision for NEET",
        desc: "Systematic revision of entire NEET syllabus with focus on high-yield topics, previous year questions, and exam strategies.",
        exam: "NEET",
        batchType: "Revision Batch",
        price: "₹12,000",
        duration: "45 Days",
        schedule: "Daily, 5 PM - 8 PM",
        startDate: "20th January 2026",
        features: [
            "Topic-wise revision",
            "1000+ PYQs solved",
            "Daily revision tests",
            "Concept clarity sessions",
            "Doubt clearing support"
        ],
        color: "green",
        icon: "fa-redo",
        badge: "Best Seller",
        enrollmentLink: "https://forms.google.com/neet-revision"
    },
    {
        title: "JEE Main Practice Batch",
        subtitle: "Intensive problem-solving sessions",
        desc: "Focus on solving maximum variety of problems from all chapters with detailed solutions and shortcut techniques.",
        exam: "JEE",
        batchType: "Practice Batch",
        price: "₹10,000",
        duration: "30 Days",
        schedule: "Mon-Fri, 7 PM - 9 PM",
        startDate: "25th January 2026",
        features: [
            "500+ problems per week",
            "Speed solving techniques",
            "Pattern recognition training",
            "Time management tips",
            "Performance analytics"
        ],
        color: "purple",
        icon: "fa-dumbbell",
        enrollmentLink: "https://forms.google.com/jee-practice"
    },
    {
        title: "Organic Chemistry One Shot Course",
        subtitle: "Complete Organic Chemistry in one go",
        desc: "Marathon session covering complete Organic Chemistry with all reactions, mechanisms, and named reactions in a single comprehensive course.",
        exam: "JEE",
        batchType: "One Shot Course",
        price: "₹5,000",
        duration: "15 Days",
        schedule: "Daily, 4 PM - 7 PM",
        startDate: "10th January 2026",
        features: [
            "All reactions covered",
            "Mechanism clarity",
            "Named reactions focus",
            "Quick revision notes",
            "Practice worksheets"
        ],
        color: "orange",
        icon: "fa-bullseye",
        badge: "New",
        enrollmentLink: "https://forms.google.com/organic-oneshot"
    },
    {
        title: "NEET Fast Track Batch",
        subtitle: "Accelerated NEET preparation",
        desc: "Fast-paced comprehensive course covering entire NEET syllabus with emphasis on important topics and exam patterns.",
        exam: "NEET",
        batchType: "Fast Track Batch",
        price: "₹18,000",
        duration: "90 Days",
        schedule: "Daily, 6 PM - 10 PM",
        startDate: "5th January 2026",
        features: [
            "4 hours daily classes",
            "Complete syllabus coverage",
            "Weekly grand tests",
            "Study material included",
            "24/7 doubt support"
        ],
        color: "red",
        icon: "fa-rocket",
        badge: "Limited Seats",
        enrollmentLink: "https://forms.google.com/neet-fasttrack"
    },
    {
        title: "Physical Chemistry Crash Course",
        subtitle: "Master Physical Chemistry concepts",
        desc: "Intensive course focusing on numerical problem-solving and conceptual clarity in Physical Chemistry for JEE/NEET.",
        exam: "JEE",
        batchType: "Crash Course",
        price: "₹8,000",
        duration: "40 Days",
        schedule: "Tue-Thu-Sat, 8 PM - 10 PM",
        startDate: "12th January 2026",
        features: [
            "Numerical mastery",
            "Formula derivations",
            "Concept building",
            "Practice problems",
            "Quick revision sheets"
        ],
        color: "blue",
        icon: "fa-bolt",
        enrollmentLink: "https://forms.google.com/physical-crash"
    },
    {
        title: "CSIR NET Revision Batch",
        subtitle: "Complete NET syllabus revision",
        desc: "Comprehensive revision of CSIR NET Chemistry syllabus with focus on important topics and previous year analysis.",
        exam: "CSIR NET",
        batchType: "Revision Batch",
        price: "₹20,000",
        duration: "60 Days",
        schedule: "Mon-Sat, 7 PM - 10 PM",
        startDate: "18th January 2026",
        features: [
            "Topic-wise coverage",
            "PYQ analysis",
            "Mock tests",
            "Study notes",
            "Expert guidance"
        ],
        color: "indigo",
        icon: "fa-redo",
        enrollmentLink: "https://forms.google.com/csir-revision"
    },
    {
        title: "IIT JAM Practice Batch",
        subtitle: "Problem-solving for IIT JAM",
        desc: "Extensive practice sessions with previous year questions and mock tests designed specifically for IIT JAM Chemistry.",
        exam: "IIT JAM",
        batchType: "Practice Batch",
        price: "₹15,000",
        duration: "45 Days",
        schedule: "Daily, 6 PM - 8 PM",
        startDate: "22nd January 2026",
        features: [
            "PYQ solving",
            "Mock test series",
            "Detailed solutions",
            "Performance tracking",
            "Doubt sessions"
        ],
        color: "yellow",
        icon: "fa-dumbbell",
        enrollmentLink: "https://forms.google.com/jam-practice"
    }
];

const seedBatches = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing batches (optional - comment out if you want to keep old ones)
        await ScoreMatchBatch.deleteMany({});
        console.log('🗑️  Cleared existing batches');

        const inserted = await ScoreMatchBatch.insertMany(sampleBatches);
        console.log(`✅ Successfully added ${inserted.length} new Score Max Batches!`);

        const total = await ScoreMatchBatch.countDocuments();
        console.log(`📊 Total batches in database: ${total}`);

        console.log('\n📋 Batch Types Created:');
        const batchTypes = [...new Set(sampleBatches.map(b => b.batchType))];
        batchTypes.forEach(type => {
            const count = sampleBatches.filter(b => b.batchType === type).length;
            console.log(`   - ${type}: ${count} batches`);
        });

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding batches:', err);
        process.exit(1);
    }
};

seedBatches();
