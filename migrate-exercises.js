import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SelfLearnTopic from './server/models/SelfLearnTopic.js';

dotenv.config();

async function migrateExercises() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chemistry_coaching', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connected to MongoDB');
        
        // Find all topics with exercises
        const topics = await SelfLearnTopic.find({ 'learn.exercises.0': { $exists: true } });
        
        console.log(`📊 Found ${topics.length} topics with exercises to migrate`);
        
        let migratedCount = 0;
        
        for (const topic of topics) {
            // Check if exercises are already in new format (has exerciseName field)
            const firstExercise = topic.learn.exercises[0];
            
            if (firstExercise && firstExercise.exerciseName) {
                console.log(`⏭️  Skipping topic "${topic.title}" - already migrated`);
                continue;
            }
            
            // Old format detected - migrate to new format
            if (firstExercise && firstExercise.question) {
                console.log(`🔄 Migrating topic "${topic.title}"`);
                
                // Store old exercises
                const oldExercises = [...topic.learn.exercises];
                
                // Clear exercises array
                topic.learn.exercises = [];
                
                // Create new exercise set with all old questions
                const newExerciseSet = {
                    exerciseName: 'Exercise Set 1',
                    description: 'Default exercise set',
                    order: 0,
                    questions: oldExercises
                };
                
                topic.learn.exercises.push(newExerciseSet);
                
                // Save the topic
                await topic.save();
                
                migratedCount++;
                console.log(`✅ Migrated topic "${topic.title}" - ${oldExercises.length} questions moved to "Exercise Set 1"`);
            }
        }
        
        console.log(`\n🎉 Migration complete! ${migratedCount} topics migrated.`);
        
        // Disconnect
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        
    } catch (error) {
        console.error('❌ Migration error:', error);
        process.exit(1);
    }
}

// Run migration
migrateExercises();
