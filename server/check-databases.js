// Simple script to list collections in both databases
const mongoose = require('mongoose');

const OLD_DB = 'mongodb+srv://bhupeshsingh778_db_user:qwerty12345@cluster0.u70wcn8.mongodb.net/test';
const NEW_DB = 'mongodb+srv://ace2examz_db_user:2UuCZsIDWcWrGXAi@ace2examz-cluster.nmf7peg.mongodb.net/test';

const Course = require('./models/Course');

async function checkData() {
    try {
        console.log('🔍 Checking OLD database...\n');

        const oldConn = await mongoose.createConnection(OLD_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const OldCourse = oldConn.model('courses', Course.schema);
        const oldCount = await OldCourse.countDocuments();
        const oldCourses = await OldCourse.find().limit(3);

        console.log(`📊 OLD Database - Courses: ${oldCount} documents`);
        if (oldCourses.length > 0) {
            console.log('Sample course:', oldCourses[0].title);
        }

        await oldConn.close();

        console.log('\n🔍 Checking NEW database...\n');

        const newConn = await mongoose.createConnection(NEW_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const NewCourse = newConn.model('courses', Course.schema);
        const newCount = await NewCourse.countDocuments();
        const newCourses = await NewCourse.find().limit(3);

        console.log(`📊 NEW Database - Courses: ${newCount} documents`);
        if (newCourses.length > 0) {
            console.log('Sample course:', newCourses[0].title);
        } else {
            console.log('⚠️  No courses found in NEW database!');
        }

        await newConn.close();

        if (oldCount > 0 && newCount === 0) {
            console.log('\n❌ PROBLEM: Data exists in OLD but not in NEW database!');
            console.log('💡 Solution: Re-run migration with correct database names');
        } else if (oldCount === newCount) {
            console.log('\n✅ Data successfully migrated!');
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkData();
