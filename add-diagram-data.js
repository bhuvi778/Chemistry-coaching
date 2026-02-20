import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ncert';

async function addDiagramData() {
    try {
        console.log('🎨 Adding Diagram badges and questions...\n');

        // Get first chapter for linking
        const chaptersRes = await axios.get(`${API_URL}/chapters/line-by-line`);
        const firstChapter = chaptersRes.data[0];

        if (!firstChapter) {
            console.log('❌ No chapters found. Please create chapters first.');
            return;
        }

        // Diagram Badges
        const diagramBadges = [
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
        ];

        // Create badges
        console.log('🏷️  Creating Diagram badges...');
        const createdBadges = [];
        for (const badge of diagramBadges) {
            try {
                const response = await axios.post(`${API_URL}/badges`, badge);
                createdBadges.push(response.data);
                console.log(`✅ Created badge: ${badge.name}`);
            } catch (error) {
                console.log(`⚠️  Badge might already exist: ${badge.name}`);
                // Try to fetch existing badge
                const existingBadges = await axios.get(`${API_URL}/badges/diagrams`);
                const existing = existingBadges.data.find(b => b.badgeType === badge.badgeType);
                if (existing) {
                    createdBadges.push(existing);
                }
            }
        }

        // Sample diagram questions
        const diagramQuestions = [
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
                questionType: 'MCQ',
                badgeType: 'diagram-label'
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
                questionType: 'MCQ',
                badgeType: 'diagram-label'
            },
            {
                question: 'In the diagram of a displacement reaction, what happens when zinc is added to copper sulphate solution?',
                options: [
                    'Zinc displaces copper and forms zinc sulphate',
                    'Copper displaces zinc',
                    'No reaction occurs',
                    'Both metals dissolve'
                ],
                correctAnswer: 'Zinc displaces copper and forms zinc sulphate',
                solution: 'Zn + CuSO₄ → ZnSO₄ + Cu. Zinc is more reactive than copper, so it displaces copper from copper sulphate solution. The blue color of CuSO₄ fades and reddish-brown copper is deposited.',
                difficulty: 'Medium',
                questionType: 'MCQ',
                badgeType: 'diagram-mcq'
            },
            {
                question: 'According to the pH scale diagram, which range indicates a strong acid?',
                options: [
                    '0-3',
                    '4-6',
                    '7',
                    '8-14'
                ],
                correctAnswer: '0-3',
                solution: 'The pH scale ranges from 0 to 14. Strong acids have pH values between 0-3, weak acids 4-6, neutral solutions have pH 7, and bases have pH 8-14.',
                difficulty: 'Easy',
                questionType: 'MCQ',
                badgeType: 'diagram-mcq'
            },
            {
                question: 'In the diagram showing the process of rusting, what are the essential conditions required?',
                options: [
                    'Presence of both oxygen and water',
                    'Only oxygen',
                    'Only water',
                    'High temperature'
                ],
                correctAnswer: 'Presence of both oxygen and water',
                solution: 'Rusting of iron requires the presence of both oxygen (from air) and water (moisture). The chemical formula for rust is Fe₂O₃·xH₂O (hydrated iron(III) oxide).',
                difficulty: 'Medium',
                questionType: 'MCQ',
                badgeType: 'diagram-process'
            },
            {
                question: 'The diagram shows the reactivity series of metals. Which metal can displace hydrogen from dilute acids?',
                options: [
                    'All metals above hydrogen in the series',
                    'All metals below hydrogen in the series',
                    'Only sodium and potassium',
                    'No metal can displace hydrogen'
                ],
                correctAnswer: 'All metals above hydrogen in the series',
                solution: 'Metals that are more reactive than hydrogen (placed above hydrogen in the reactivity series) can displace hydrogen from dilute acids. Examples include Zn, Mg, Al, etc.',
                difficulty: 'Hard',
                questionType: 'MCQ',
                badgeType: 'diagram-process'
            }
        ];

        // Create questions for each badge type
        console.log('\n❓ Creating diagram questions...');
        let questionCount = 0;

        for (const question of diagramQuestions) {
            try {
                const questionData = {
                    ...question,
                    category: 'diagrams',
                    chapterId: firstChapter._id
                };
                await axios.post(`${API_URL}/questions`, questionData);
                questionCount++;
                console.log(`✅ Created question: ${question.question.substring(0, 60)}...`);
            } catch (error) {
                console.log(`⚠️  Failed to create question: ${error.response?.data?.error || error.message}`);
            }
        }

        console.log(`\n✨ Successfully created ${createdBadges.length} badges and ${questionCount} questions for Diagrams tab!`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

addDiagramData();
