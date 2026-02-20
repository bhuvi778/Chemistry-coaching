import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ncert';

// Sample data for all tabs
const sampleData = {
    // Line-by-Line Chapters
    chapters: [
        {
            name: 'Chemical Reactions and Equations',
            chapterNumber: 'Chapter 1',
            description: 'Understanding chemical reactions, equations, and their types',
            icon: 'fa-flask',
            color: 'cyan',
            category: 'line-by-line'
        },
        {
            name: 'Acids, Bases and Salts',
            chapterNumber: 'Chapter 2',
            description: 'Properties and reactions of acids, bases, and salts',
            icon: 'fa-atom',
            color: 'blue',
            category: 'line-by-line'
        },
        {
            name: 'Metals and Non-metals',
            chapterNumber: 'Chapter 3',
            description: 'Physical and chemical properties of metals and non-metals',
            icon: 'fa-cube',
            color: 'purple',
            category: 'line-by-line'
        }
    ],

    // Questions Badges
    questionsBadges: [
        {
            name: 'In-text Questions',
            description: 'Questions asked within the chapter text',
            category: 'questions',
            badgeType: 'in-text',
            icon: 'fa-question-circle',
            color: 'pink',
            order: 1
        },
        {
            name: 'Exercise Questions',
            description: 'End of chapter exercise questions',
            category: 'questions',
            badgeType: 'exercise',
            icon: 'fa-tasks',
            color: 'cyan',
            order: 2
        },
        {
            name: 'Additional Questions',
            description: 'Extra practice questions for better understanding',
            category: 'questions',
            badgeType: 'additional',
            icon: 'fa-plus-circle',
            color: 'green',
            order: 3
        }
    ],

    // Exemplar Badges
    exemplarBadges: [
        {
            name: 'MCQ (Exemplar)',
            description: 'Multiple choice questions from NCERT Exemplar - Medium difficulty',
            category: 'exemplars',
            badgeType: 'exemplar-mcq',
            icon: 'fa-check-square',
            color: 'purple',
            order: 1
        },
        {
            name: 'Short Answer Questions',
            description: 'Short answer type questions from NCERT Exemplar',
            category: 'exemplars',
            badgeType: 'exemplar-short',
            icon: 'fa-edit',
            color: 'blue',
            order: 2
        },
        {
            name: 'Long Answer Questions',
            description: 'Detailed long answer questions - Hard difficulty',
            category: 'exemplars',
            badgeType: 'exemplar-long',
            icon: 'fa-book-open',
            color: 'red',
            order: 3
        }
    ],

    // Diagram Badges
    diagramBadges: [
        {
            name: 'Diagram Labeling',
            description: 'Label important diagrams from NCERT',
            category: 'diagrams',
            badgeType: 'diagram-label',
            icon: 'fa-image',
            color: 'cyan',
            order: 1
        },
        {
            name: 'Diagram Based MCQs',
            description: 'Multiple choice questions based on diagrams',
            category: 'diagrams',
            badgeType: 'diagram-mcq',
            icon: 'fa-chart-line',
            color: 'orange',
            order: 2
        },
        {
            name: 'Process Diagrams',
            description: 'Understand chemical processes through diagrams',
            category: 'diagrams',
            badgeType: 'diagram-process',
            icon: 'fa-project-diagram',
            color: 'purple',
            order: 3
        }
    ]
};

// Sample topics for chapters
const sampleTopics = [
    {
        name: 'Types of Chemical Reactions',
        description: 'Combination, decomposition, displacement, and double displacement reactions',
        order: 1
    },
    {
        name: 'Balancing Chemical Equations',
        description: 'Learn to balance chemical equations step by step',
        order: 2
    },
    {
        name: 'Oxidation and Reduction',
        description: 'Understanding redox reactions and their applications',
        order: 3
    }
];

// Sample questions for different categories
const sampleQuestions = {
    lineByLine: [
        {
            question: 'What is a chemical equation?',
            options: [
                'A symbolic representation of a chemical reaction',
                'A mathematical formula',
                'A physical change representation',
                'None of the above'
            ],
            correctAnswer: 'A symbolic representation of a chemical reaction',
            solution: 'A chemical equation is a symbolic representation of a chemical reaction where reactants are written on the left side and products on the right side, separated by an arrow.',
            difficulty: 'Easy',
            questionType: 'MCQ',
            ncertLine: 'Page 5, Para 1'
        },
        {
            question: 'Why should a chemical equation be balanced?',
            options: [
                'To follow the law of conservation of mass',
                'To make it look good',
                'To confuse students',
                'It is not necessary'
            ],
            correctAnswer: 'To follow the law of conservation of mass',
            solution: 'According to the law of conservation of mass, matter can neither be created nor destroyed. Therefore, the number of atoms of each element must be equal on both sides of a chemical equation.',
            difficulty: 'Medium',
            questionType: 'MCQ',
            ncertLine: 'Page 6, Para 2'
        }
    ],
    questions: [
        {
            question: 'Write the balanced equation for the following reaction: Zinc + Sulphuric acid → Zinc sulphate + Hydrogen',
            options: [
                'Zn + H₂SO₄ → ZnSO₄ + H₂',
                'Zn + SO₄ → ZnSO₄ + H',
                '2Zn + H₂SO₄ → ZnSO₄ + H₂',
                'Zn + 2H₂SO₄ → ZnSO₄ + 2H₂'
            ],
            correctAnswer: 'Zn + H₂SO₄ → ZnSO₄ + H₂',
            solution: 'The balanced equation is: Zn + H₂SO₄ → ZnSO₄ + H₂. This equation is already balanced as there is 1 Zn, 1 S, 4 O, and 2 H atoms on both sides.',
            difficulty: 'Medium',
            questionType: 'MCQ'
        },
        {
            question: 'What type of reaction is represented by the digestion of food in our body?',
            options: [
                'Decomposition reaction',
                'Combination reaction',
                'Displacement reaction',
                'Double displacement reaction'
            ],
            correctAnswer: 'Decomposition reaction',
            solution: 'Digestion of food is a decomposition reaction where complex food molecules are broken down into simpler substances that can be absorbed by the body.',
            difficulty: 'Easy',
            questionType: 'MCQ'
        }
    ],
    exemplars: [
        {
            question: 'Which of the following is NOT a sign of a chemical reaction?',
            options: [
                'Change in state',
                'Change in color',
                'Evolution of gas',
                'Change in shape of container'
            ],
            correctAnswer: 'Change in shape of container',
            solution: 'Change in shape of container is a physical change, not a chemical change. Chemical reactions are indicated by changes in state, color, temperature, evolution of gas, or formation of precipitate.',
            difficulty: 'Medium',
            questionType: 'MCQ'
        },
        {
            question: 'In the reaction 2Mg + O₂ → 2MgO, what is the role of oxygen?',
            options: [
                'Oxidizing agent',
                'Reducing agent',
                'Catalyst',
                'Product'
            ],
            correctAnswer: 'Oxidizing agent',
            solution: 'Oxygen acts as an oxidizing agent because it accepts electrons from magnesium. Magnesium is oxidized (loses electrons) while oxygen is reduced (gains electrons).',
            difficulty: 'Hard',
            questionType: 'MCQ'
        }
    ],
    diagrams: [
        {
            question: 'Identify the type of reaction shown in the diagram where AB → A + B',
            options: [
                'Decomposition reaction',
                'Combination reaction',
                'Displacement reaction',
                'Redox reaction'
            ],
            correctAnswer: 'Decomposition reaction',
            solution: 'This is a decomposition reaction where a single compound (AB) breaks down into two or more simpler substances (A and B). Example: 2H₂O → 2H₂ + O₂',
            difficulty: 'Easy',
            questionType: 'MCQ'
        },
        {
            question: 'In a diagram showing electrolysis of water, which gas is collected at the cathode?',
            options: [
                'Hydrogen',
                'Oxygen',
                'Carbon dioxide',
                'Nitrogen'
            ],
            correctAnswer: 'Hydrogen',
            solution: 'During electrolysis of water, hydrogen gas is collected at the cathode (negative electrode) and oxygen gas is collected at the anode (positive electrode). The volume ratio is 2:1.',
            difficulty: 'Medium',
            questionType: 'MCQ'
        }
    ]
};

async function seedData() {
    try {
        console.log('🌱 Starting NCERT data seeding...\n');

        // 1. Create Chapters
        console.log('📚 Creating chapters...');
        const createdChapters = [];
        for (const chapter of sampleData.chapters) {
            try {
                const response = await axios.post(`${API_URL}/chapters`, chapter);
                createdChapters.push(response.data);
                console.log(`✅ Created chapter: ${chapter.name}`);
            } catch (error) {
                console.log(`⚠️  Chapter might already exist: ${chapter.name}`);
            }
        }

        // 2. Create Topics for first chapter
        if (createdChapters.length > 0) {
            console.log('\n📝 Creating topics for first chapter...');
            const firstChapter = createdChapters[0];
            const createdTopics = [];

            for (const topic of sampleTopics) {
                try {
                    const topicData = { ...topic, chapterId: firstChapter._id };
                    const response = await axios.post(`${API_URL}/topics`, topicData);
                    createdTopics.push(response.data);
                    console.log(`✅ Created topic: ${topic.name}`);
                } catch (error) {
                    console.log(`⚠️  Topic might already exist: ${topic.name}`);
                }
            }

            // 3. Create Line-by-Line Questions
            if (createdTopics.length > 0) {
                console.log('\n❓ Creating line-by-line questions...');
                const firstTopic = createdTopics[0];

                for (const question of sampleQuestions.lineByLine) {
                    try {
                        const questionData = {
                            ...question,
                            category: 'line-by-line',
                            chapterId: firstChapter._id,
                            topicId: firstTopic._id
                        };
                        await axios.post(`${API_URL}/questions`, questionData);
                        console.log(`✅ Created question: ${question.question.substring(0, 50)}...`);
                    } catch (error) {
                        console.log(`⚠️  Failed to create question`);
                    }
                }
            }
        }

        // 4. Create Questions Badges
        console.log('\n🏷️  Creating Questions badges...');
        const createdQuestionsBadges = [];
        for (const badge of sampleData.questionsBadges) {
            try {
                const response = await axios.post(`${API_URL}/badges`, badge);
                createdQuestionsBadges.push(response.data);
                console.log(`✅ Created badge: ${badge.name}`);
            } catch (error) {
                console.log(`⚠️  Badge might already exist: ${badge.name}`);
            }
        }

        // 5. Create Questions for Questions tab
        if (createdQuestionsBadges.length > 0 && createdChapters.length > 0) {
            console.log('\n❓ Creating questions for Questions tab...');
            const firstBadge = createdQuestionsBadges[0];

            for (const question of sampleQuestions.questions) {
                try {
                    const questionData = {
                        ...question,
                        category: 'questions',
                        badgeType: firstBadge.badgeType,
                        chapterId: createdChapters[0]._id
                    };
                    await axios.post(`${API_URL}/questions`, questionData);
                    console.log(`✅ Created question: ${question.question.substring(0, 50)}...`);
                } catch (error) {
                    console.log(`⚠️  Failed to create question`);
                }
            }
        }

        // 6. Create Exemplar Badges
        console.log('\n🏷️  Creating Exemplar badges...');
        const createdExemplarBadges = [];
        for (const badge of sampleData.exemplarBadges) {
            try {
                const response = await axios.post(`${API_URL}/badges`, badge);
                createdExemplarBadges.push(response.data);
                console.log(`✅ Created badge: ${badge.name}`);
            } catch (error) {
                console.log(`⚠️  Badge might already exist: ${badge.name}`);
            }
        }

        // 7. Create Exemplar Questions
        if (createdExemplarBadges.length > 0 && createdChapters.length > 0) {
            console.log('\n❓ Creating exemplar questions...');
            const firstBadge = createdExemplarBadges[0];

            for (const question of sampleQuestions.exemplars) {
                try {
                    const questionData = {
                        ...question,
                        category: 'exemplars',
                        badgeType: firstBadge.badgeType,
                        chapterId: createdChapters[0]._id
                    };
                    await axios.post(`${API_URL}/questions`, questionData);
                    console.log(`✅ Created question: ${question.question.substring(0, 50)}...`);
                } catch (error) {
                    console.log(`⚠️  Failed to create question`);
                }
            }
        }

        // 8. Create Diagram Badges
        console.log('\n🏷️  Creating Diagram badges...');
        const createdDiagramBadges = [];
        for (const badge of sampleData.diagramBadges) {
            try {
                const response = await axios.post(`${API_URL}/badges`, badge);
                createdDiagramBadges.push(response.data);
                console.log(`✅ Created badge: ${badge.name}`);
            } catch (error) {
                console.log(`⚠️  Badge might already exist: ${badge.name}`);
            }
        }

        // 9. Create Diagram Questions
        if (createdDiagramBadges.length > 0 && createdChapters.length > 0) {
            console.log('\n❓ Creating diagram questions...');
            const firstBadge = createdDiagramBadges[0];

            for (const question of sampleQuestions.diagrams) {
                try {
                    const questionData = {
                        ...question,
                        category: 'diagrams',
                        badgeType: firstBadge.badgeType,
                        chapterId: createdChapters[0]._id
                    };
                    await axios.post(`${API_URL}/questions`, questionData);
                    console.log(`✅ Created question: ${question.question.substring(0, 50)}...`);
                } catch (error) {
                    console.log(`⚠️  Failed to create question`);
                }
            }
        }

        console.log('\n✨ NCERT data seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Chapters: ${createdChapters.length}`);
        console.log(`   - Questions Badges: ${createdQuestionsBadges.length}`);
        console.log(`   - Exemplar Badges: ${createdExemplarBadges.length}`);
        console.log(`   - Diagram Badges: ${createdDiagramBadges.length}`);
        console.log('\n🎉 You can now test all NCERT tabs in the admin panel and frontend!');

    } catch (error) {
        console.error('❌ Error seeding data:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the seeding
seedData();
