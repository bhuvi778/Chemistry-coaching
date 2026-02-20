const mongoose = require('mongoose');
const PYQChapter = require('../models/PYQChapter');
const PYQTopic = require('../models/PYQTopic');
const PYQQuestion = require('../models/PYQQuestion');

const seedPYQData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chemistry_coaching');
        console.log('Connected to MongoDB');

        await PYQQuestion.deleteMany({});
        await PYQTopic.deleteMany({});
        await PYQChapter.deleteMany({});
        console.log('Cleared existing PYQ data');

        // JEE MAIN - PHYSICS - Thermodynamics
        const thermoChapter = await PYQChapter.create({
            examName: 'JEE Main', subject: 'Physics', chapterName: 'Thermodynamics',
            chapterNumber: 'Chapter 11', description: 'Laws of thermodynamics, heat engines, and entropy',
            icon: 'fa-fire', color: 'orange', isActive: true
        });

        const thermoTopic1 = await PYQTopic.create({
            chapterId: thermoChapter._id, topicName: 'First Law of Thermodynamics',
            description: 'Internal energy, work, and heat transfer', isActive: true
        });

        await PYQQuestion.create({
            chapterId: thermoChapter._id, topicId: thermoTopic1._id,
            examName: 'JEE Main', examYear: 2023, subject: 'Physics',
            question: 'A gas is compressed isothermally. Which of the following statements is true?',
            questionType: 'Single Correct',
            options: ['The internal energy increases', 'The internal energy decreases', 'The internal energy remains constant', 'Work done is zero'],
            correctAnswer: 'C',
            solution: 'In isothermal process, temperature is constant. For ideal gas, internal energy depends only on temperature.',
            hint: 'Think about the relationship between temperature and internal energy.',
            difficulty: 'Medium', yearBadge: 'JEE Main 2023 – 25 Jan, Shift 1', isActive: true
        });

        // JEE MAIN - PHYSICS - Electrostatics
        const electroChapter = await PYQChapter.create({
            examName: 'JEE Main', subject: 'Physics', chapterName: 'Electrostatics',
            chapterNumber: 'Chapter 1', description: 'Electric charge, field, and potential',
            icon: 'fa-bolt', color: 'yellow', isActive: true
        });

        const electroTopic1 = await PYQTopic.create({
            chapterId: electroChapter._id, topicName: 'Electric Field',
            description: 'Coulomb law and electric field', isActive: true
        });

        await PYQQuestion.create({
            chapterId: electroChapter._id, topicId: electroTopic1._id,
            examName: 'JEE Main', examYear: 2023, subject: 'Physics',
            question: 'Two charges +q and -q are at distance d. Electric field at midpoint?',
            questionType: 'Single Correct',
            options: ['Zero', 'kq/d²', '2kq/d²', '4kq/d²'],
            correctAnswer: 'D',
            solution: 'Both fields add up at midpoint. E = 2×kq/(d/2)² = 8kq/d²',
            hint: 'Calculate field due to each charge and add vectorially.',
            difficulty: 'Medium', yearBadge: 'JEE Main 2023 – 1 Feb, Shift 1', isActive: true
        });

        // JEE MAIN - CHEMISTRY
        const organicChapter = await PYQChapter.create({
            examName: 'JEE Main', subject: 'Chemistry', chapterName: 'Organic Chemistry',
            chapterNumber: 'Chapter 12', description: 'Nomenclature and isomerism',
            icon: 'fa-flask', color: 'green', isActive: true
        });

        const organicTopic1 = await PYQTopic.create({
            chapterId: organicChapter._id, topicName: 'IUPAC Nomenclature',
            description: 'Naming of organic compounds', isActive: true
        });

        await PYQQuestion.create({
            chapterId: organicChapter._id, topicId: organicTopic1._id,
            examName: 'JEE Main', examYear: 2023, subject: 'Chemistry',
            question: 'IUPAC name of CH₃-CH(CH₃)-CH₂-CH₃?',
            questionType: 'Single Correct',
            options: ['2-Methylbutane', '3-Methylbutane', 'Isopentane', 'Neopentane'],
            correctAnswer: 'A',
            solution: 'Longest chain has 4 carbons. Methyl at position 2.',
            hint: 'Find longest chain and number to give lowest number to substituent.',
            difficulty: 'Easy', yearBadge: 'JEE Main 2023 – 10 April, Shift 2', isActive: true
        });

        // JEE MAIN - MATHEMATICS
        const calculusChapter = await PYQChapter.create({
            examName: 'JEE Main', subject: 'Mathematics', chapterName: 'Differential Calculus',
            chapterNumber: 'Chapter 13', description: 'Limits and differentiation',
            icon: 'fa-square-root-alt', color: 'blue', isActive: true
        });

        const calculusTopic1 = await PYQTopic.create({
            chapterId: calculusChapter._id, topicName: 'Limits',
            description: 'Evaluation of limits', isActive: true
        });

        await PYQQuestion.create({
            chapterId: calculusChapter._id, topicId: calculusTopic1._id,
            examName: 'JEE Main', examYear: 2022, subject: 'Mathematics',
            question: 'Evaluate: lim(x→0) (sin x)/x',
            questionType: 'Single Correct',
            options: ['0', '1', '∞', 'Does not exist'],
            correctAnswer: 'B',
            solution: 'This is a standard limit. lim(x→0) (sin x)/x = 1',
            hint: 'This is a fundamental limit in calculus.',
            difficulty: 'Easy', yearBadge: 'JEE Main 2022 – 25 July, Shift 1', isActive: true
        });

        // NEET - BIOLOGY
        const cellChapter = await PYQChapter.create({
            examName: 'NEET', subject: 'Biology', chapterName: 'Cell Biology',
            chapterNumber: 'Chapter 8', description: 'Cell structure and functions',
            icon: 'fa-microscope', color: 'purple', isActive: true
        });

        const cellTopic1 = await PYQTopic.create({
            chapterId: cellChapter._id, topicName: 'Cell Organelles',
            description: 'Structure and function of organelles', isActive: true
        });

        await PYQQuestion.create({
            chapterId: cellChapter._id, topicId: cellTopic1._id,
            examName: 'NEET', examYear: 2023, subject: 'Biology',
            question: 'Which organelle is the powerhouse of the cell?',
            questionType: 'Single Correct',
            options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
            correctAnswer: 'B',
            solution: 'Mitochondria produce ATP through cellular respiration.',
            hint: 'Which organelle produces energy (ATP)?',
            difficulty: 'Easy', yearBadge: 'NEET 2023 – 7 May', isActive: true
        });

        // NEET - PHYSICS
        const mechanicsChapter = await PYQChapter.create({
            examName: 'NEET', subject: 'Physics', chapterName: 'Laws of Motion',
            chapterNumber: 'Chapter 5', description: 'Newton\'s laws',
            icon: 'fa-rocket', color: 'red', isActive: true
        });

        const mechanicsTopic1 = await PYQTopic.create({
            chapterId: mechanicsChapter._id, topicName: 'Newton\'s Laws',
            description: 'Three laws of motion', isActive: true
        });

        await PYQQuestion.create({
            chapterId: mechanicsChapter._id, topicId: mechanicsTopic1._id,
            examName: 'NEET', examYear: 2023, subject: 'Physics',
            question: 'A 5 kg body is acted upon by 20 N force. Find acceleration.',
            questionType: 'Numerical',
            correctAnswer: '4',
            solution: 'F = ma, so a = F/m = 20/5 = 4 m/s²',
            hint: 'Use Newton\'s second law: F = ma',
            difficulty: 'Easy', yearBadge: 'NEET 2023 – 7 May', isActive: true
        });

        // NEET - CHEMISTRY
        const kineticsChapter = await PYQChapter.create({
            examName: 'NEET', subject: 'Chemistry', chapterName: 'Chemical Kinetics',
            chapterNumber: 'Chapter 4', description: 'Rate of reaction',
            icon: 'fa-atom', color: 'cyan', isActive: true
        });

        const kineticsTopic1 = await PYQTopic.create({
            chapterId: kineticsChapter._id, topicName: 'Rate of Reaction',
            description: 'Factors affecting rate', isActive: true
        });

        await PYQQuestion.create({
            chapterId: kineticsChapter._id, topicId: kineticsTopic1._id,
            examName: 'NEET', examYear: 2022, subject: 'Chemistry',
            question: 'Which does NOT affect reaction rate?',
            questionType: 'Single Correct',
            options: ['Temperature', 'Concentration', 'Catalyst', 'Molecular mass of products'],
            correctAnswer: 'D',
            solution: 'Product molecular mass doesn\'t affect rate.',
            hint: 'Think about what happens during reaction, not after.',
            difficulty: 'Medium', yearBadge: 'NEET 2022 – 17 July', isActive: true
        });

        console.log('✅ PYQ seed data created!');
        console.log('Total: 7 chapters, 7 topics, 7 questions');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedPYQData();
