// Test Data Creation Script for Concept Notes
// Run this with: node createTestData.js

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const ConceptChapter = require('./models/ConceptChapter');
const ConceptTopic = require('./models/ConceptTopic');

const createTestData = async () => {
    try {
        // Connect to MongoDB - using the same database as the server
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chemistry_coaching';
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Create a Test Chapter
        const testChapter = new ConceptChapter({
            subject: 'Physical Chemistry',
            chapterName: 'Test Chapter - Thermodynamics Basics',
            description: 'A comprehensive test chapter demonstrating all features: topics, concepts, images, and practice questions with PDFs',
            thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
            examType: 'JEE',
            badges: 'NEW',
            order: 999,
            isActive: true
        });

        await testChapter.save();
        console.log('✅ Created Test Chapter:', testChapter.chapterName);

        // 2. Create Topics with Concepts
        const topic1 = new ConceptTopic({
            chapterId: testChapter._id,
            title: 'First Law of Thermodynamics',
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
                    caption: 'Energy conservation diagram'
                }
            ],
            concepts: [
                {
                    conceptName: 'Internal Energy',
                    content: `
                        <h2>Internal Energy (U)</h2>
                        <p>Internal energy is the total energy contained within a system. It includes:</p>
                        <ul>
                            <li><strong>Kinetic Energy:</strong> Energy due to molecular motion</li>
                            <li><strong>Potential Energy:</strong> Energy due to molecular interactions</li>
                            <li><strong>Bond Energy:</strong> Energy stored in chemical bonds</li>
                        </ul>
                        <h3>Key Points:</h3>
                        <p>1. Internal energy is a <em>state function</em></p>
                        <p>2. Change in internal energy: <strong>ΔU = q + w</strong></p>
                        <p>3. For ideal gases: U depends only on temperature</p>
                        <blockquote>
                            <p>"Energy can neither be created nor destroyed, only transformed from one form to another."</p>
                        </blockquote>
                    `,
                    images: [
                        {
                            url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600',
                            caption: 'Molecular kinetic energy representation'
                        }
                    ],
                    practiceQuestions: [
                        {
                            question: 'What is the change in internal energy when a system absorbs 500J of heat and does 200J of work?',
                            questionPdfUrl: '',
                            options: [
                                '300 J',
                                '700 J',
                                '500 J',
                                '200 J'
                            ],
                            correctAnswer: 0,
                            explanation: 'Using ΔU = q + w, where q = +500J (absorbed) and w = -200J (work done by system), we get ΔU = 500 + (-200) = 300J',
                            difficulty: 'Easy'
                        },
                        {
                            question: 'Which of the following is NOT a state function?',
                            questionPdfUrl: '',
                            options: [
                                'Internal Energy',
                                'Enthalpy',
                                'Heat',
                                'Entropy'
                            ],
                            correctAnswer: 2,
                            explanation: 'Heat (q) and work (w) are path functions, not state functions. State functions depend only on initial and final states, not on the path taken.',
                            difficulty: 'Medium'
                        },
                        {
                            question: 'For an ideal gas undergoing isothermal expansion, what is the change in internal energy?',
                            questionPdfUrl: '',
                            options: [
                                'Zero',
                                'Positive',
                                'Negative',
                                'Cannot be determined'
                            ],
                            correctAnswer: 0,
                            explanation: 'For an ideal gas, internal energy depends only on temperature. In an isothermal process, temperature is constant, so ΔU = 0.',
                            difficulty: 'Hard'
                        }
                    ],
                    order: 1
                },
                {
                    conceptName: 'Heat and Work',
                    content: `
                        <h2>Heat (q) and Work (w)</h2>
                        <p>Heat and work are two ways energy can be transferred between a system and its surroundings.</p>
                        
                        <h3>Heat (q):</h3>
                        <ul>
                            <li>Energy transfer due to temperature difference</li>
                            <li><strong>Positive (+q):</strong> Heat absorbed by system (endothermic)</li>
                            <li><strong>Negative (-q):</strong> Heat released by system (exothermic)</li>
                        </ul>

                        <h3>Work (w):</h3>
                        <ul>
                            <li>Energy transfer due to force acting through distance</li>
                            <li><strong>Positive (+w):</strong> Work done on system (compression)</li>
                            <li><strong>Negative (-w):</strong> Work done by system (expansion)</li>
                        </ul>

                        <h3>Sign Convention:</h3>
                        <table border="1" style="width:100%; border-collapse: collapse;">
                            <tr>
                                <th>Process</th>
                                <th>Heat (q)</th>
                                <th>Work (w)</th>
                            </tr>
                            <tr>
                                <td>Endothermic + Expansion</td>
                                <td>+</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>Exothermic + Compression</td>
                                <td>-</td>
                                <td>+</td>
                            </tr>
                        </table>
                    `,
                    images: [],
                    practiceQuestions: [
                        {
                            question: 'A gas expands against external pressure and absorbs heat. What are the signs of q and w?',
                            questionPdfUrl: '',
                            options: [
                                'q = +, w = -',
                                'q = -, w = +',
                                'q = +, w = +',
                                'q = -, w = -'
                            ],
                            correctAnswer: 0,
                            explanation: 'Heat absorbed means q is positive. Expansion means work done BY system, so w is negative.',
                            difficulty: 'Medium'
                        },
                        {
                            question: 'Calculate work done when 2 moles of ideal gas expands from 5L to 10L against constant pressure of 2 atm. (1 L·atm = 101.3 J)',
                            questionPdfUrl: '',
                            options: [
                                '-1013 J',
                                '+1013 J',
                                '-506.5 J',
                                '+506.5 J'
                            ],
                            correctAnswer: 0,
                            explanation: 'w = -PΔV = -2 atm × (10-5) L = -10 L·atm = -10 × 101.3 J = -1013 J. Negative because work is done by the system.',
                            difficulty: 'Hard'
                        }
                    ],
                    order: 2
                }
            ],
            order: 1
        });

        await topic1.save();
        console.log('✅ Created Topic 1:', topic1.title);

        const topic2 = new ConceptTopic({
            chapterId: testChapter._id,
            title: 'Enthalpy and Heat Capacity',
            images: [],
            concepts: [
                {
                    conceptName: 'Enthalpy (H)',
                    content: `
                        <h2>Enthalpy (H)</h2>
                        <p>Enthalpy is a thermodynamic property defined as:</p>
                        <p style="text-align: center; font-size: 1.2em;"><strong>H = U + PV</strong></p>
                        
                        <h3>Why Enthalpy?</h3>
                        <p>At constant pressure (most common condition), heat change equals enthalpy change:</p>
                        <p style="text-align: center;"><strong>q<sub>p</sub> = ΔH</strong></p>

                        <h3>Types of Enthalpy Changes:</h3>
                        <ol>
                            <li><strong>ΔH<sub>f</sub>:</strong> Enthalpy of formation</li>
                            <li><strong>ΔH<sub>c</sub>:</strong> Enthalpy of combustion</li>
                            <li><strong>ΔH<sub>vap</sub>:</strong> Enthalpy of vaporization</li>
                            <li><strong>ΔH<sub>fus</sub>:</strong> Enthalpy of fusion</li>
                        </ol>

                        <h3>Hess's Law:</h3>
                        <p>The total enthalpy change is independent of the path taken.</p>
                        <p><em>Example:</em> If A → B → C, then ΔH<sub>total</sub> = ΔH<sub>AB</sub> + ΔH<sub>BC</sub></p>
                    `,
                    images: [
                        {
                            url: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600',
                            caption: 'Energy diagram showing enthalpy changes'
                        }
                    ],
                    practiceQuestions: [
                        {
                            question: 'If ΔU = 100 kJ and PΔV = 20 kJ for a process at constant pressure, what is ΔH?',
                            questionPdfUrl: '',
                            options: [
                                '120 kJ',
                                '80 kJ',
                                '100 kJ',
                                '20 kJ'
                            ],
                            correctAnswer: 0,
                            explanation: 'ΔH = ΔU + Δ(PV) = ΔU + PΔV (at constant P) = 100 + 20 = 120 kJ',
                            difficulty: 'Easy'
                        },
                        {
                            question: 'For an exothermic reaction at constant pressure, which statement is TRUE?',
                            questionPdfUrl: '',
                            options: [
                                'ΔH < 0',
                                'ΔH > 0',
                                'ΔH = 0',
                                'ΔH cannot be determined'
                            ],
                            correctAnswer: 0,
                            explanation: 'Exothermic reactions release heat, so enthalpy of products is less than reactants, making ΔH negative.',
                            difficulty: 'Easy'
                        },
                        {
                            question: 'Using Hess\'s Law: If A→B (ΔH₁ = -50 kJ) and B→C (ΔH₂ = -30 kJ), what is ΔH for A→C?',
                            questionPdfUrl: '',
                            options: [
                                '-80 kJ',
                                '-20 kJ',
                                '+80 kJ',
                                '+20 kJ'
                            ],
                            correctAnswer: 0,
                            explanation: 'By Hess\'s Law, ΔH(A→C) = ΔH₁ + ΔH₂ = -50 + (-30) = -80 kJ',
                            difficulty: 'Medium'
                        }
                    ],
                    order: 1
                },
                {
                    conceptName: 'Heat Capacity',
                    content: `
                        <h2>Heat Capacity</h2>
                        <p>Heat capacity is the amount of heat required to raise the temperature of a substance by 1°C or 1K.</p>

                        <h3>Types:</h3>
                        <ul>
                            <li><strong>C<sub>p</sub>:</strong> Heat capacity at constant pressure</li>
                            <li><strong>C<sub>v</sub>:</strong> Heat capacity at constant volume</li>
                        </ul>

                        <h3>Relationship:</h3>
                        <p style="text-align: center; font-size: 1.1em;"><strong>C<sub>p</sub> - C<sub>v</sub> = R</strong></p>
                        <p style="text-align: center;">where R = 8.314 J/(mol·K)</p>

                        <h3>Heat Capacity Ratio (γ):</h3>
                        <p style="text-align: center;"><strong>γ = C<sub>p</sub> / C<sub>v</sub></strong></p>
                        <ul>
                            <li>Monoatomic gas: γ = 5/3 = 1.67</li>
                            <li>Diatomic gas: γ = 7/5 = 1.4</li>
                            <li>Polyatomic gas: γ ≈ 1.33</li>
                        </ul>

                        <h3>Formulas:</h3>
                        <p>Heat absorbed: <strong>q = nCΔT</strong></p>
                        <p>where n = moles, C = heat capacity, ΔT = temperature change</p>
                    `,
                    images: [],
                    practiceQuestions: [
                        {
                            question: 'If C_v for a gas is 20.8 J/(mol·K), what is C_p?',
                            questionPdfUrl: '',
                            options: [
                                '29.1 J/(mol·K)',
                                '12.5 J/(mol·K)',
                                '20.8 J/(mol·K)',
                                '25.0 J/(mol·K)'
                            ],
                            correctAnswer: 0,
                            explanation: 'C_p = C_v + R = 20.8 + 8.314 = 29.114 ≈ 29.1 J/(mol·K)',
                            difficulty: 'Easy'
                        },
                        {
                            question: 'What is the heat capacity ratio (γ) for a diatomic gas?',
                            questionPdfUrl: '',
                            options: [
                                '1.4',
                                '1.67',
                                '1.33',
                                '1.5'
                            ],
                            correctAnswer: 0,
                            explanation: 'For diatomic gases, γ = C_p/C_v = 7/5 = 1.4',
                            difficulty: 'Easy'
                        },
                        {
                            question: 'How much heat is required to raise the temperature of 2 moles of a gas from 300K to 350K at constant pressure? (C_p = 29 J/(mol·K))',
                            questionPdfUrl: '',
                            options: [
                                '2900 J',
                                '1450 J',
                                '5800 J',
                                '14500 J'
                            ],
                            correctAnswer: 0,
                            explanation: 'q = nC_pΔT = 2 × 29 × (350-300) = 2 × 29 × 50 = 2900 J',
                            difficulty: 'Medium'
                        }
                    ],
                    order: 2
                }
            ],
            order: 2
        });

        await topic2.save();
        console.log('✅ Created Topic 2:', topic2.title);

        console.log('\n🎉 Test data created successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Chapter: ${testChapter.chapterName}`);
        console.log(`   Topics: 2`);
        console.log(`   Concepts: 4 (2 per topic)`);
        console.log(`   Practice Questions: 11 total`);
        console.log(`   Images: 3`);
        console.log('\n✅ All features demonstrated:');
        console.log('   ✓ Rich text content with HTML formatting');
        console.log('   ✓ Images with captions');
        console.log('   ✓ Practice questions with all difficulty levels');
        console.log('   ✓ Detailed explanations');
        console.log('   ✓ Multiple concepts per topic');
        console.log('   ✓ PDF upload support (fields ready)');
        console.log('\n🔗 Access the test chapter:');
        console.log('   Subject: Physical Chemistry');
        console.log('   Chapter: Test Chapter - Thermodynamics Basics');

    } catch (error) {
        console.error('❌ Error creating test data:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    }
};

// Run the script
createTestData();
