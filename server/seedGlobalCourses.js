const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chemistry_coaching', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Global Course Schema
const globalCourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    thumbnail: String,
    exam: String,
    category: String,
    instructor: String,
    duration: String,
    language: String,
    level: String,
    price: String,
    originalPrice: String,
    enrollmentLink: String,
    features: [String],
    badge: String,
    icon: String,
    color: String,
    isActive: Boolean,
    order: Number,
    createdAt: Date
});

const GlobalCourse = mongoose.model('GlobalCourse', globalCourseSchema);

// Dummy Data
const dummyCourses = [
    {
        title: "NEET Chemistry Mastery Course",
        description: "Complete chemistry preparation for NEET aspirants covering all three branches - Physical, Organic, and Inorganic Chemistry with detailed concept explanations and problem-solving techniques.",
        thumbnail: "",
        exam: "NEET",
        category: "All Chemistry",
        instructor: "Dr. Rajesh Kumar",
        duration: "6 months",
        language: "English & Hindi",
        level: "Intermediate",
        price: "₹9,999",
        originalPrice: "₹19,999",
        enrollmentLink: "https://ace2examz.com/enroll",
        features: [
            "300+ Video Lectures",
            "1000+ Practice Questions",
            "Weekly Live Doubt Sessions",
            "Previous Year Papers Analysis",
            "Mobile App Access"
        ],
        badge: "POPULAR",
        icon: "fa-heartbeat",
        color: "green",
        isActive: true,
        order: 1
    },
    {
        title: "JEE Advanced Physical Chemistry",
        description: "Intensive course focusing on Physical Chemistry for JEE Advanced. Master thermodynamics, chemical kinetics, electrochemistry, and quantum mechanics with advanced problem-solving strategies.",
        thumbnail: "",
        exam: "JEE",
        category: "Physical Chemistry",
        instructor: "Prof. Amit Sharma",
        duration: "4 months",
        language: "English",
        level: "Advanced",
        price: "₹12,999",
        originalPrice: "₹24,999",
        enrollmentLink: "https://ace2examz.com/enroll",
        features: [
            "200+ Concept Videos",
            "Advanced Problem Sets",
            "IIT-JEE Pattern Questions",
            "Personal Mentorship",
            "Study Material PDFs"
        ],
        badge: "NEW",
        icon: "fa-atom",
        color: "blue",
        isActive: true,
        order: 2
    },
    {
        title: "Organic Chemistry for JEE Main",
        description: "Comprehensive organic chemistry course designed specifically for JEE Main preparation. Learn reaction mechanisms, named reactions, and organic synthesis with easy-to-understand methods.",
        thumbnail: "",
        exam: "JEE",
        category: "Organic Chemistry",
        instructor: "Dr. Priya Verma",
        duration: "5 months",
        language: "English & Hindi",
        level: "Intermediate",
        price: "₹8,999",
        originalPrice: "₹17,999",
        enrollmentLink: "https://ace2examz.com/enroll",
        features: [
            "250+ Video Lectures",
            "Reaction Mechanism Videos",
            "Memory Techniques",
            "Daily Practice Problems",
            "Doubt Clearing Sessions"
        ],
        badge: "",
        icon: "fa-flask",
        color: "purple",
        isActive: true,
        order: 3
    },
    {
        title: "CSIR NET Chemical Sciences Complete Course",
        description: "Comprehensive preparation course for CSIR NET Chemical Sciences covering all topics from basic to advanced level. Includes physical, organic, inorganic chemistry, and spectroscopy.",
        thumbnail: "",
        exam: "CSIR NET",
        category: "All Chemistry",
        instructor: "Dr. Suresh Patel",
        duration: "8 months",
        language: "English",
        level: "Advanced",
        price: "₹15,999",
        originalPrice: "₹29,999",
        enrollmentLink: "https://ace2examz.com/enroll",
        features: [
            "400+ Hours of Content",
            "Research Methodology",
            "Previous 10 Years Papers",
            "Mock Tests Series",
            "Expert Faculty Support"
        ],
        badge: "BEST SELLER",
        icon: "fa-flask",
        color: "amber",
        isActive: true,
        order: 4
    },
    {
        title: "IIT JAM Chemistry Crash Course",
        description: "Fast-track preparation course for IIT JAM Chemistry. Covers all important topics with focus on exam pattern, time management, and scoring strategies for maximum marks.",
        thumbnail: "",
        exam: "IIT JAM",
        category: "All Chemistry",
        instructor: "Prof. Neha Singh",
        duration: "3 months",
        language: "English",
        level: "Intermediate",
        price: "₹7,999",
        originalPrice: "₹14,999",
        enrollmentLink: "https://ace2examz.com/enroll",
        features: [
            "150+ Focused Lectures",
            "Exam Pattern Analysis",
            "Time Management Tips",
            "20+ Mock Tests",
            "Revision Notes"
        ],
        badge: "TRENDING",
        icon: "fa-university",
        color: "cyan",
        isActive: true,
        order: 5
    },
    {
        title: "Inorganic Chemistry for NEET",
        description: "Specialized course for NEET inorganic chemistry covering coordination compounds, metallurgy, p-block, d-block, and f-block elements with memory techniques and shortcuts.",
        thumbnail: "",
        exam: "NEET",
        category: "Inorganic Chemistry",
        instructor: "Dr. Vikram Malhotra",
        duration: "4 months",
        language: "Hindi",
        level: "Beginner",
        price: "₹6,999",
        originalPrice: "₹12,999",
        enrollmentLink: "https://ace2examz.com/enroll",
        features: [
            "180+ Video Lessons",
            "Color Coding Techniques",
            "Periodic Table Tricks",
            "NEET Pattern Questions",
            "Weekly Tests"
        ],
        badge: "",
        icon: "fa-cube",
        color: "red",
        isActive: true,
        order: 6
    },
    {
        title: "GATE Chemistry Complete Package",
        description: "All-inclusive GATE Chemistry preparation covering physical, organic, inorganic chemistry, and mathematics. Designed for engineering graduates aiming for PSUs and higher studies.",
        thumbnail: "",
        exam: "GATE",
        category: "All Chemistry",
        instructor: "Dr. Arun Kumar",
        duration: "7 months",
        language: "English",
        level: "Advanced",
        price: "₹13,999",
        originalPrice: "₹25,999",
        enrollmentLink: "https://ace2examz.com/enroll",
        features: [
            "350+ Video Lectures",
            "Mathematics for GATE",
            "Previous Year Solutions",
            "30+ Mock Tests",
            "Interview Preparation"
        ],
        badge: "COMPREHENSIVE",
        icon: "fa-door-open",
        color: "indigo",
        isActive: true,
        order: 7
    },
    {
        title: "Physical Chemistry Fundamentals",
        description: "Foundation course for physical chemistry covering thermodynamics, chemical equilibrium, ionic equilibrium, and electrochemistry. Perfect for beginners and competitive exam aspirants.",
        thumbnail: "",
        exam: "All",
        category: "Physical Chemistry",
        instructor: "Prof. Kavita Reddy",
        duration: "3 months",
        language: "English & Hindi",
        level: "Beginner",
        price: "₹5,999",
        originalPrice: "₹10,999",
        enrollmentLink: "https://ace2examz.com/enroll",
        features: [
            "120+ Concept Videos",
            "Numerical Problem Solving",
            "Formula Sheet",
            "Practice Worksheets",
            "Lifetime Access"
        ],
        badge: "",
        icon: "fa-atom",
        color: "teal",
        isActive: true,
        order: 8
    },
    {
        title: "CUET PG Chemistry Preparation",
        description: "Targeted preparation for CUET PG Chemistry entrance exam. Covers all UG level chemistry topics with focus on MCQ solving techniques and time management.",
        thumbnail: "",
        exam: "CUET PG",
        category: "All Chemistry",
        instructor: "Dr. Meera Joshi",
        duration: "4 months",
        language: "English",
        level: "Intermediate",
        price: "₹8,499",
        originalPrice: "₹15,999",
        enrollmentLink: "https://ace2examz.com/enroll",
        features: [
            "200+ Video Lectures",
            "MCQ Practice Sets",
            "University-wise Analysis",
            "15+ Mock Tests",
            "Study Material"
        ],
        badge: "",
        icon: "fa-user-graduate",
        color: "pink",
        isActive: true,
        order: 9
    },
    {
        title: "Organic Reaction Mechanisms Masterclass",
        description: "Deep dive into organic reaction mechanisms for JEE Advanced and NEET. Learn arrow pushing, intermediate stability, and predict products with confidence.",
        thumbnail: "",
        exam: "JEE",
        category: "Organic Chemistry",
        instructor: "Dr. Rohit Gupta",
        duration: "2 months",
        language: "English",
        level: "Advanced",
        price: "₹6,499",
        originalPrice: "₹11,999",
        enrollmentLink: "https://ace2examz.com/enroll",
        features: [
            "100+ Mechanism Videos",
            "3D Molecular Animations",
            "Practice Problems",
            "Shortcut Techniques",
            "Expert Doubt Support"
        ],
        badge: "ADVANCED",
        icon: "fa-flask",
        color: "purple",
        isActive: true,
        order: 10
    },
    {
        title: "BITSAT Chemistry Booster",
        description: "High-speed preparation course for BITSAT Chemistry section. Focus on speed, accuracy, and smart guessing techniques to maximize your score in limited time.",
        thumbnail: "",
        exam: "BITSAT",
        category: "All Chemistry",
        instructor: "Prof. Sandeep Rao",
        duration: "2 months",
        language: "English",
        level: "Intermediate",
        price: "₹5,499",
        originalPrice: "₹9,999",
        enrollmentLink: "https://ace2examz.com/enroll",
        features: [
            "150+ Quick Revision Videos",
            "Speed Enhancement Drills",
            "BITSAT Pattern Tests",
            "Negative Marking Strategy",
            "Last Minute Tips"
        ],
        badge: "QUICK PREP",
        icon: "fa-laptop-code",
        color: "cyan",
        isActive: true,
        order: 11
    },
    {
        title: "TIFR Chemistry Entrance Preparation",
        description: "Elite preparation course for TIFR Chemistry entrance exam. Advanced topics, research-oriented questions, and conceptual clarity for aspiring researchers.",
        thumbnail: "",
        exam: "TIFR",
        category: "All Chemistry",
        instructor: "Dr. Ananya Chakraborty",
        duration: "6 months",
        language: "English",
        level: "Advanced",
        price: "₹16,999",
        originalPrice: "₹32,999",
        enrollmentLink: "https://ace2examz.com/enroll",
        features: [
            "300+ Advanced Lectures",
            "Research Paper Analysis",
            "Conceptual Problem Solving",
            "One-on-One Mentoring",
            "Interview Preparation"
        ],
        badge: "ELITE",
        icon: "fa-atom",
        color: "amber",
        isActive: true,
        order: 12
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing Global Courses...');
        await GlobalCourse.deleteMany({});

        console.log('📝 Inserting dummy courses...');
        const inserted = await GlobalCourse.insertMany(dummyCourses);

        console.log(`✅ Successfully inserted ${inserted.length} courses!`);
        console.log('\n📊 Courses by Exam:');
        const exams = {};
        inserted.forEach(course => {
            exams[course.exam] = (exams[course.exam] || 0) + 1;
        });
        Object.entries(exams).forEach(([exam, count]) => {
            console.log(`   ${exam}: ${count} courses`);
        });

        console.log('\n📚 Courses by Category:');
        const categories = {};
        inserted.forEach(course => {
            categories[course.category] = (categories[course.category] || 0) + 1;
        });
        Object.entries(categories).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} courses`);
        });

        console.log('\n✨ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeder
seedDatabase();
