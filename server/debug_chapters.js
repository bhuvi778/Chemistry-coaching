const mongoose = require('mongoose');

const checkChampions = async () => {
    try {
        const uri = 'mongodb://127.0.0.1:27017/chemistry_coaching';
        await mongoose.connect(uri);
        console.log('Connected to DB:', uri);

        const ConceptChapter = require('./models/ConceptChapter');

        const chapters = await ConceptChapter.find({ subject: 'Physical Chemistry' });
        console.log(`\nFound ${chapters.length} chapters in 'Physical Chemistry':`);
        chapters.forEach(ch => {
            console.log(`- "${ch.chapterName}" (id: ${ch._id}, active: ${ch.isActive}, order: ${ch.order})`);
        });

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkChampions();
