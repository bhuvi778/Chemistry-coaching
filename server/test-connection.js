// Test if server can fetch data from new database
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Enquiry = require('./models/Enquiry');

const NEW_DB = 'mongodb+srv://ace2examz_db_user:2UuCZsIDWcWrGXAi@ace2examz-cluster.nmf7peg.mongodb.net/test?appName=Ace2Examz-Cluster';

async function testConnection() {
    try {
        console.log('🔍 Testing connection to NEW database...\n');

        const conn = await mongoose.connect(NEW_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Connected successfully!\n');

        // Test fetching courses
        console.log('📊 Fetching courses...');
        const courses = await Course.find();
        console.log(`Found ${courses.length} courses:`);
        courses.forEach(c => console.log(`  - ${c.title}`));

        console.log('\n📊 Fetching enquiries...');
        const enquiries = await Enquiry.find();
        console.log(`Found ${enquiries.length} enquiries`);

        // Test bulk endpoint simulation
        console.log('\n🔄 Simulating /api/bulk endpoint...');
        const [bulkCourses, bulkEnquiries] = await Promise.all([
            Course.find().lean(),
            Enquiry.find().lean()
        ]);

        console.log(`Bulk API would return:`);
        console.log(`  - Courses: ${bulkCourses.length}`);
        console.log(`  - Enquiries: ${bulkEnquiries.length}`);

        if (bulkCourses.length === 0) {
            console.log('\n❌ PROBLEM: No courses found!');
            console.log('This means the server is connecting to the wrong database or collection.');
        } else {
            console.log('\n✅ Data exists and can be fetched!');
            console.log('If data still not showing in app, it\'s a frontend/API issue.');
        }

        await mongoose.connection.close();
        console.log('\n🔌 Disconnected');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testConnection();
