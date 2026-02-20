const mongoose = require('mongoose');
const SelfLearnChapter = require('./models/SelfLearnChapter');
require('dotenv').config();

const seedSelfLearnData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reaction-lab');
        console.log('Connected to MongoDB');

        // Clear existing data
        await SelfLearnChapter.deleteMany({});
        console.log('Cleared existing Self Learn chapters');

        const chapters = [
            {
                examType: 'NEET',
                subject: 'Physical Chemistry',
                chapterName: 'States of Matter',
                description: 'Understand the properties of gases, liquids, and solids with in-depth analysis of ideal gas laws and intermolecular forces.',
                order: 1,
                icon: 'fa-cube',
                color: 'blue',
                learn: {
                    videoLectures: [
                        { title: 'Introduction to States of Matter', url: '#', duration: '45:00' },
                        { title: 'Ideal Gas Laws', url: '#', duration: '50:00' }
                    ],
                    classNotes: [
                        { title: 'States of Matter - Lecture 1 Notes', pdfUrl: '#' }
                    ],
                    exercises: []
                },
                practice: {
                    dpps: [
                        { title: 'DPP 1: Gas Laws', order: 1 }
                    ],
                    dppVideoSolutions: []
                },
                revise: {
                    revisionClasses: [],
                    notes: [],
                    mockTests: []
                }
            },
            {
                examType: 'NEET',
                subject: 'Physical Chemistry',
                chapterName: 'Thermodynamics',
                description: 'Dive into the laws of thermodynamics, enthalpy, entropy, and Gibbs free energy.',
                order: 2,
                icon: 'fa-fire',
                color: 'red',
                learn: {
                    videoLectures: [
                        { title: 'First Law of Thermodynamics', url: '#', duration: '55:00' }
                    ]
                }
            },
            {
                examType: 'NEET',
                subject: 'Organic Chemistry',
                chapterName: 'General Organic Chemistry',
                description: 'The foundation of organic chemistry: inductive effect, resonance, and reaction intermediates.',
                order: 1,
                icon: 'fa-vector-square',
                color: 'purple'
            },
            {
                examType: 'JEE',
                subject: 'Inorganic Chemistry',
                chapterName: 'Chemical Bonding',
                description: 'Master VSEPR theory, hybridization, and molecular orbital theory.',
                order: 1,
                icon: 'fa-link',
                color: 'green'
            }
        ];

        await SelfLearnChapter.insertMany(chapters);
        console.log('Seed data inserted successfully');

        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedSelfLearnData();
