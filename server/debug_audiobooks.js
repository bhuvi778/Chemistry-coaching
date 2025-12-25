
const mongoose = require('mongoose');
const AudioBook = require('./models/AudioBook');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/test';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Connected to MongoDB');

    try {
        const books = await AudioBook.find({});
        console.log(`Found ${books.length} audiobooks`);

        books.forEach(book => {
            console.log(`\nID: ${book._id}`);
            console.log(`Title: ${book.title}`);
            console.log(`Chapters count: ${book.chapters ? book.chapters.length : 0}`);
            if (book.chapters && book.chapters.length > 0) {
                book.chapters.forEach((ch, i) => {
                    console.log(`  Chapter ${i + 1}: ${ch.title} (${ch.topics ? ch.topics.length : 0} topics)`);
                });
            }
        });

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}).catch(err => {
    console.error('Connection error:', err);
});
