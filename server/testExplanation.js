const mongoose = require('mongoose');
const AssertionReasonQuestion = require('./models/AssertionReasonQuestion');

const MONGODB_URI = 'mongodb://localhost:27017/chemistry_coaching';

async function testExplanationField() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!\n');

        // Find all questions
        const questions = await AssertionReasonQuestion.find().limit(5);

        console.log(`📊 Found ${questions.length} questions\n`);

        if (questions.length > 0) {
            const firstQuestion = questions[0];
            console.log('📝 First Question Details:');
            console.log('   ID:', firstQuestion._id);
            console.log('   Assertion:', firstQuestion.assertion.substring(0, 50) + '...');
            console.log('   Reason:', firstQuestion.reason.substring(0, 50) + '...');
            console.log('   Has explanation field?', 'explanation' in firstQuestion ? '✅ YES' : '❌ NO');
            console.log('   Explanation value:', firstQuestion.explanation || '(empty)');
            console.log('\n');

            // Try to update the first question with an explanation
            console.log('🔄 Updating first question with test explanation...');
            firstQuestion.explanation = 'This is a test explanation to verify the field is working correctly. The assertion is true because... The reason correctly explains this because...';
            await firstQuestion.save();
            console.log('✅ Updated successfully!\n');

            // Fetch it again to verify
            const updated = await AssertionReasonQuestion.findById(firstQuestion._id);
            console.log('✅ Verification:');
            console.log('   Explanation after update:', updated.explanation);
        } else {
            console.log('⚠️  No questions found in database');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed.');
    }
}

testExplanationField();
