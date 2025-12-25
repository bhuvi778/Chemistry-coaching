const mongoose = require('mongoose');
const Video = require('./models/Video');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test';

mongoose.connect(MONGODB_URI).then(async () => {
    console.log('Connected');

    try {
        const videos = await Video.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5);

        console.log('--- Checking last 5 videos ---');
        videos.forEach(v => {
            console.log(`Title: ${v.title}`);
            console.log(`ID: ${v._id}`);
            console.log(`Has classNotes field: ${!!v.classNotes}`);
            if (v.classNotes) {
                console.log(`classNotes keys: ${Object.keys(v.classNotes)}`);
                console.log(`Filename: ${v.classNotes.filename}`);
                console.log(`Data length: ${v.classNotes.data ? v.classNotes.data.length : 0}`);
            }
            console.log('---');
        });

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
});
