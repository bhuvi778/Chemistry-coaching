import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ncert';

async function addTestQuestions() {
    console.log('🎯 Adding test questions for all tabs...\n');

    try {
        // Get badges
        const questionsBadges = await axios.get(`${API_URL}/badges/questions`);
        const exemplarBadges = await axios.get(`${API_URL}/badges/exemplars`);
        const diagramBadges = await axios.get(`${API_URL}/badges/diagrams`);

        // Get a chapter
        const chapters = await axios.get(`${API_URL}/chapters/line-by-line`);
        const chapter = chapters.data[0];

        if (!chapter) {
            console.log('❌ No chapters found. Please create a chapter first.');
            return;
        }

        console.log(`Using chapter: ${chapter.name}\n`);

        // Add questions for each badge type
        const questionsToAdd = [
            // Questions Tab - In-text Questions
            {
                category: 'questions',
                badgeType: 'in-text',
                question: 'What is the law of conservation of mass?',
                options: [
                    'Mass can be created or destroyed',
                    'Mass cannot be created or destroyed in a chemical reaction',
                    'Mass always increases in a reaction',
                    'Mass always decreases in a reaction'
                ],
                correctAnswer: 'Mass cannot be created or destroyed in a chemical reaction',
                solution: 'The law of conservation of mass states that mass can neither be created nor destroyed in a chemical reaction. The total mass of reactants equals the total mass of products.',
                difficulty: 'Easy',
                questionType: 'MCQ',
                chapterId: chapter._id,
                marks: 1
            },
            // Questions Tab - Exercise Questions
            {
                category: 'questions',
                badgeType: 'exercise',
                question: 'Balance the equation: Fe + O₂ → Fe₂O₃',
                options: [
                    '2Fe + 3O₂ → 2Fe₂O₃',
                    '4Fe + 3O₂ → 2Fe₂O₃',
                    'Fe + O₂ → Fe₂O₃',
                    '3Fe + 2O₂ → Fe₂O₃'
                ],
                correctAnswer: '4Fe + 3O₂ → 2Fe₂O₃',
                solution: 'To balance this equation, we need 4 Fe atoms and 3 O₂ molecules to produce 2 Fe₂O₃ molecules. This ensures equal atoms on both sides.',
                difficulty: 'Medium',
                questionType: 'MCQ',
                chapterId: chapter._id,
                marks: 2
            },
            // Exemplars Tab - MCQ
            {
                category: 'exemplars',
                badgeType: 'exemplar-mcq',
                question: 'Which of the following is an exothermic reaction?',
                options: [
                    'Photosynthesis',
                    'Respiration',
                    'Decomposition of calcium carbonate',
                    'Electrolysis of water'
                ],
                correctAnswer: 'Respiration',
                solution: 'Respiration is an exothermic reaction as it releases energy. Glucose is broken down to release energy, carbon dioxide, and water.',
                difficulty: 'Medium',
                questionType: 'MCQ',
                chapterId: chapter._id,
                marks: 1
            },
            // Exemplars Tab - Short Answer
            {
                category: 'exemplars',
                badgeType: 'exemplar-short',
                question: 'What is a redox reaction? Give an example.',
                options: [
                    'A reaction where oxidation and reduction occur simultaneously; Example: Zn + CuSO₄ → ZnSO₄ + Cu',
                    'A reaction where only oxidation occurs',
                    'A reaction where only reduction occurs',
                    'A reaction with no electron transfer'
                ],
                correctAnswer: 'A reaction where oxidation and reduction occur simultaneously; Example: Zn + CuSO₄ → ZnSO₄ + Cu',
                solution: 'A redox reaction involves simultaneous oxidation (loss of electrons) and reduction (gain of electrons). In the example, Zn loses electrons (oxidation) while Cu²⁺ gains electrons (reduction).',
                difficulty: 'Hard',
                questionType: 'MCQ',
                chapterId: chapter._id,
                marks: 3
            },
            // Diagrams Tab - Diagram Labeling
            {
                category: 'diagrams',
                badgeType: 'diagram-label',
                question: 'In a diagram of a decomposition reaction, what happens to a compound AB?',
                options: [
                    'It breaks down into A and B',
                    'It combines with another compound',
                    'It remains unchanged',
                    'It forms a new compound ABC'
                ],
                correctAnswer: 'It breaks down into A and B',
                solution: 'In a decomposition reaction, a single compound breaks down into two or more simpler substances. AB → A + B is the general form.',
                difficulty: 'Easy',
                questionType: 'MCQ',
                chapterId: chapter._id,
                marks: 1
            },
            // Diagrams Tab - Diagram MCQ
            {
                category: 'diagrams',
                badgeType: 'diagram-mcq',
                question: 'In a diagram showing the reaction between zinc and copper sulfate, what color change is observed?',
                options: [
                    'Blue to colorless',
                    'Colorless to blue',
                    'Green to red',
                    'No color change'
                ],
                correctAnswer: 'Blue to colorless',
                solution: 'When zinc is added to copper sulfate solution, the blue color (due to Cu²⁺ ions) fades as copper is displaced and zinc sulfate (colorless) is formed.',
                difficulty: 'Medium',
                questionType: 'MCQ',
                chapterId: chapter._id,
                marks: 2
            }
        ];

        console.log(`Adding ${questionsToAdd.length} test questions...\n`);

        for (const q of questionsToAdd) {
            try {
                const response = await axios.post(`${API_URL}/questions`, q);
                console.log(`✅ Added: [${q.category}/${q.badgeType}] ${q.question.substring(0, 50)}...`);
            } catch (error) {
                console.log(`❌ Failed: ${q.question.substring(0, 50)}... - ${error.message}`);
            }
        }

        console.log('\n✨ Test questions added successfully!');
        console.log('\n📊 Summary:');

        // Verify
        const allQuestions = await axios.get(`${API_URL}/questions`);
        const byCategory = allQuestions.data.reduce((acc, q) => {
            const key = `${q.category}/${q.badgeType || 'no-badge'}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        Object.entries(byCategory).forEach(([key, count]) => {
            console.log(`  ${key}: ${count} questions`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

addTestQuestions();
