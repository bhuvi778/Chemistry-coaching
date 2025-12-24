const mongoose = require('mongoose');
const Video = require('./models/Video');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ace2examz_db_user:2UuCZsIDWcWrGXAi@ace2examz-cluster.nmf7peg.mongodb.net/test?appName=Ace2Examz-Cluster';

async function fixVideos() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find all videos
    const videos = await mongoose.connection.db.collection('videos').find({}).toArray();
    console.log(`Found ${videos.length} videos`);

    let fixed = 0;
    let deleted = 0;

    for (const video of videos) {
      console.log(`\nProcessing: ${video.title}`);
      console.log(`  youtubeId: ${video.youtubeId || 'MISSING'}`);
      console.log(`  isActive: ${video.isActive !== undefined ? video.isActive : 'MISSING'}`);

      // If video has no youtubeId, delete it (invalid video)
      if (!video.youtubeId) {
        console.log(`  ❌ Deleting - no youtubeId`);
        await mongoose.connection.db.collection('videos').deleteOne({ _id: video._id });
        deleted++;
        continue;
      }

      // If video has youtubeId but no isActive, set it to true
      if (video.isActive === undefined) {
        console.log(`  ✅ Setting isActive = true`);
        await mongoose.connection.db.collection('videos').updateOne(
          { _id: video._id },
          { $set: { isActive: true } }
        );
        fixed++;
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Fixed: ${fixed} videos`);
    console.log(`   Deleted: ${deleted} invalid videos (no youtubeId)`);
    
    // Show remaining videos
    const remaining = await mongoose.connection.db.collection('videos').find({}).toArray();
    console.log(`\n📊 Remaining videos: ${remaining.length}`);
    remaining.forEach(v => {
      console.log(`   - ${v.title}: youtubeId=${v.youtubeId}, isActive=${v.isActive}`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixVideos();
