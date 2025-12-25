
const mongoose = require('mongoose');
const AudioBook = require('./models/AudioBook');

const run = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect('mongodb://127.0.0.1:27017/test');
        console.log('Connected. Fetching books...');
        const books = await AudioBook.find().lean();
        console.log(JSON.stringify(books, null, 2));
        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

run();
