const mongoose = require('mongoose');
const AudioBook = require('./models/AudioBook');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test';

mongoose.connect(MONGODB_URI).then(async () => {
    console.log('Connected');

    try {
        // Find the most recent audiobook
        const book = await AudioBook.findOne({}).sort({ createdAt: -1 });

        if (book) {
            console.log(`Title: ${book.title}`);
            console.log(`ID: ${book._id}`);
            console.log(`Chapters count: ${book.chapters ? book.chapters.length : 0}`);

            if (book.chapters && book.chapters.length > 0) {
                book.chapters.forEach((ch, i) => {
                    console.log(`  Chapter ${i + 1}: ${ch.title} (${ch.topics ? ch.topics.length : 0} topics)`);
                });
            }
        } else {
            console.log('No audiobooks found');
        }

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
});
