const mongoose = require('mongoose');
const Video = require('./models/Video');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test';

mongoose.connect(MONGODB_URI).then(async () => {
    console.log('Connected');

    try {
        // Find a video with classNotes.data
        const video = await Video.findOne({ 'classNotes.data': { $exists: true, $ne: null } })
            .select('title classNotes.data classNotes.filename')
            .sort({ createdAt: -1 });

        if (video) {
            console.log(`Title: ${video.title}`);
            console.log(`Filename: ${video.classNotes.filename}`);
            const data = video.classNotes.data;
            console.log(`Data length: ${data.length}`);
            console.log(`Start of data: ${data.substring(0, 50)}`);

            const hasPrefix = data.startsWith('data:application/pdf;base64,');
            console.log(`Has PDF Prefix: ${hasPrefix}`);
        } else {
            console.log('No video with classnotes found');
        }

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
});
