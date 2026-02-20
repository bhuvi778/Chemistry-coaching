import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConceptNoteCard from '../components/ConceptNoteCard';

/**
 * Demo page to showcase the ConceptNoteCard component
 * Displays sample concept cards with different subjects and difficulties
 */
const ConceptCardDemo = () => {
    const [selectedConcept, setSelectedConcept] = useState(null);

    // Sample concept data
    const sampleConcepts = [
        {
            conceptName: "Electrochemistry Basics",
            content: `<p>Electrochemistry is the branch of chemistry that deals with the relationship between electrical energy and chemical changes. It involves the study of chemical reactions that produce electric current (galvanic cells) and reactions that are driven by electric current (electrolytic cells).</p>
            <p>Key concepts include oxidation-reduction reactions, electrode potentials, and the Nernst equation.</p>`,
            images: [
                {
                    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500",
                    caption: "Electrochemical Cell Diagram"
                },
                {
                    url: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=500",
                    caption: "Battery Components"
                }
            ],
            practiceQuestions: [
                {
                    question: "What is the standard electrode potential of hydrogen electrode?",
                    options: ["0.00 V", "1.00 V", "-1.00 V", "0.76 V"],
                    correctAnswer: 0,
                    difficulty: "Easy",
                    explanation: "By convention, the standard hydrogen electrode (SHE) is assigned a potential of exactly 0.00 V at all temperatures."
                },
                {
                    question: "In a galvanic cell, electrons flow from:",
                    options: ["Anode to cathode", "Cathode to anode", "Positive to negative", "Salt bridge to electrodes"],
                    correctAnswer: 0,
                    difficulty: "Medium",
                    explanation: "In a galvanic cell, oxidation occurs at the anode (negative electrode) and electrons flow from anode to cathode through the external circuit."
                },
                {
                    question: "Calculate the EMF of a cell with E°(cathode) = 0.80V and E°(anode) = -0.76V",
                    options: ["0.04 V", "1.56 V", "0.80 V", "-1.56 V"],
                    correctAnswer: 1,
                    difficulty: "Hard",
                    explanation: "EMF = E°(cathode) - E°(anode) = 0.80 - (-0.76) = 1.56 V"
                }
            ],
            subject: "Physical Chemistry",
            difficulty: "Medium"
        },
        {
            conceptName: "Organic Reaction Mechanisms",
            content: `<p>Understanding reaction mechanisms is crucial for predicting products and controlling reaction conditions. A mechanism shows the step-by-step process of how reactants are converted to products, including all intermediates formed.</p>
            <p>Common mechanisms include SN1, SN2, E1, E2, and addition reactions.</p>`,
            images: [
                {
                    url: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=500",
                    caption: "Molecular Structure"
                }
            ],
            practiceQuestions: [
                {
                    question: "Which mechanism involves a carbocation intermediate?",
                    options: ["SN2", "SN1", "E2", "Addition"],
                    correctAnswer: 1,
                    difficulty: "Easy",
                    explanation: "SN1 (Substitution Nucleophilic Unimolecular) mechanism proceeds through a carbocation intermediate formed after the leaving group departs."
                },
                {
                    question: "What is the rate-determining step in SN1 reaction?",
                    options: ["Nucleophile attack", "Leaving group departure", "Proton transfer", "Rearrangement"],
                    correctAnswer: 1,
                    difficulty: "Medium",
                    explanation: "The rate-determining step in SN1 is the formation of carbocation by departure of the leaving group."
                }
            ],
            subject: "Organic Chemistry",
            difficulty: "Hard"
        },
        {
            conceptName: "Coordination Compounds",
            content: `<p>Coordination compounds consist of a central metal atom or ion bonded to surrounding molecules or ions called ligands. These compounds exhibit unique properties including color, magnetism, and catalytic activity.</p>
            <p>Important concepts include coordination number, geometry, isomerism, and crystal field theory.</p>`,
            images: [
                {
                    url: "https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=500",
                    caption: "Crystal Structure"
                },
                {
                    url: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=500",
                    caption: "Complex Formation"
                },
                {
                    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500",
                    caption: "Ligand Bonding"
                }
            ],
            practiceQuestions: [
                {
                    question: "What is the coordination number of [Fe(CN)6]³⁻?",
                    options: ["4", "5", "6", "8"],
                    correctAnswer: 2,
                    difficulty: "Easy",
                    explanation: "The coordination number is 6 as there are 6 cyanide ligands bonded to the central Fe³⁺ ion."
                },
                {
                    question: "Which ligand is a strong field ligand?",
                    options: ["Cl⁻", "F⁻", "CN⁻", "Br⁻"],
                    correctAnswer: 2,
                    difficulty: "Medium",
                    explanation: "CN⁻ (cyanide) is a strong field ligand that causes large crystal field splitting."
                },
                {
                    question: "What is the geometry of [Ni(CO)4]?",
                    options: ["Square planar", "Tetrahedral", "Octahedral", "Linear"],
                    correctAnswer: 1,
                    difficulty: "Hard",
                    explanation: "[Ni(CO)4] has tetrahedral geometry with sp³ hybridization of Ni."
                }
            ],
            subject: "Inorganic Chemistry",
            difficulty: "Medium"
        },
        {
            conceptName: "Chemical Kinetics",
            content: `<p>Chemical kinetics is the study of reaction rates and the factors that affect them. It helps us understand how fast reactions occur and what conditions can speed them up or slow them down.</p>
            <p>Key topics include rate laws, reaction order, activation energy, and catalysis.</p>`,
            images: [],
            practiceQuestions: [
                {
                    question: "For a first-order reaction, the half-life is:",
                    options: ["Dependent on initial concentration", "Independent of initial concentration", "Proportional to concentration", "Inversely proportional to rate constant"],
                    correctAnswer: 1,
                    difficulty: "Easy",
                    explanation: "For first-order reactions, t₁/₂ = 0.693/k, which is independent of initial concentration."
                },
                {
                    question: "What is the unit of rate constant for a second-order reaction?",
                    options: ["s⁻¹", "mol L⁻¹ s⁻¹", "L mol⁻¹ s⁻¹", "mol² L⁻² s⁻¹"],
                    correctAnswer: 2,
                    difficulty: "Medium",
                    explanation: "For a second-order reaction, the unit of k is L mol⁻¹ s⁻¹ to make the rate equation dimensionally correct."
                }
            ],
            subject: "Physical Chemistry",
            difficulty: "Easy"
        },
        {
            conceptName: "Thermodynamics Laws",
            content: `<p>Thermodynamics deals with energy transformations and the relationship between heat, work, and other forms of energy. The laws of thermodynamics govern all physical and chemical processes.</p>
            <p>Understanding entropy, enthalpy, and Gibbs free energy is essential for predicting reaction spontaneity.</p>`,
            images: [
                {
                    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500",
                    caption: "Energy Diagram"
                }
            ],
            practiceQuestions: [
                {
                    question: "Which thermodynamic function determines spontaneity at constant T and P?",
                    options: ["Enthalpy", "Entropy", "Gibbs free energy", "Internal energy"],
                    correctAnswer: 2,
                    difficulty: "Easy",
                    explanation: "Gibbs free energy (G) determines spontaneity at constant temperature and pressure. ΔG < 0 indicates a spontaneous process."
                },
                {
                    question: "For an exothermic reaction, ΔH is:",
                    options: ["Positive", "Negative", "Zero", "Undefined"],
                    correctAnswer: 1,
                    difficulty: "Easy",
                    explanation: "Exothermic reactions release heat, so ΔH (change in enthalpy) is negative."
                },
                {
                    question: "Calculate ΔG° for a reaction with ΔH° = -100 kJ and ΔS° = -200 J/K at 298K",
                    options: ["-40.4 kJ", "-159.6 kJ", "-40400 J", "40.4 kJ"],
                    correctAnswer: 0,
                    difficulty: "Hard",
                    explanation: "ΔG° = ΔH° - TΔS° = -100 - (298 × -0.2) = -100 + 59.6 = -40.4 kJ"
                }
            ],
            subject: "Physical Chemistry",
            difficulty: "Medium"
        },
        {
            conceptName: "Aromatic Compounds",
            content: `<p>Aromatic compounds are cyclic, planar molecules with delocalized π-electrons that follow Hückel's rule (4n+2 π electrons). Benzene is the most common example, exhibiting unique stability and reactivity patterns.</p>
            <p>Key reactions include electrophilic aromatic substitution, directing effects, and resonance stabilization.</p>`,
            images: [
                {
                    url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500",
                    caption: "Benzene Ring Structure"
                },
                {
                    url: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=500",
                    caption: "Aromatic Resonance"
                }
            ],
            practiceQuestions: [
                {
                    question: "Which of the following is aromatic?",
                    options: ["Cyclobutadiene", "Benzene", "Cyclooctatetraene", "1,3-Cyclohexadiene"],
                    correctAnswer: 1,
                    difficulty: "Easy",
                    explanation: "Benzene has 6 π electrons (4n+2 where n=1), is planar and cyclic, satisfying all aromaticity criteria."
                },
                {
                    question: "What is the major product when benzene reacts with Br₂/FeBr₃?",
                    options: ["Bromobenzene", "1,2-Dibromobenzene", "1,4-Dibromobenzene", "Hexabromobenzene"],
                    correctAnswer: 0,
                    difficulty: "Medium",
                    explanation: "Electrophilic aromatic substitution with Br₂/FeBr₃ gives bromobenzene as the major product."
                }
            ],
            subject: "Organic Chemistry",
            difficulty: "Medium"
        }
    ];

    const handleCardClick = (concept) => {
        setSelectedConcept(concept);
        console.log('Concept clicked:', concept.conceptName);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-20">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                {/* Title Section */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                        <i className="fas fa-graduation-cap mr-3"></i>
                        Concept Note Cards Demo
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
                        Interactive, flip-able cards showcasing concept-wise notes with practice questions, images, and difficulty levels
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/30">
                            <i className="fas fa-sync-alt mr-2"></i>
                            Flip Animation
                        </span>
                        <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold border border-purple-500/30">
                            <i className="fas fa-palette mr-2"></i>
                            Subject Colors
                        </span>
                        <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
                            <i className="fas fa-question-circle mr-2"></i>
                            Practice Questions
                        </span>
                        <span className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold border border-orange-500/30">
                            <i className="fas fa-image mr-2"></i>
                            Visual Resources
                        </span>
                    </div>
                </div>

                {/* Instructions */}
                <div className="glass-panel rounded-2xl p-6 mb-12 border border-cyan-500/30">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <i className="fas fa-info-circle text-cyan-400"></i>
                        How to Use
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-cyan-400 font-bold">1</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Hover for Glow</h3>
                                <p className="text-sm text-gray-400">Hover over cards to see the subject-specific glow effect</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-purple-400 font-bold">2</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Click to Flip</h3>
                                <p className="text-sm text-gray-400">Click the "Flip" button to see practice questions preview</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-green-400 font-bold">3</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">View Details</h3>
                                <p className="text-sm text-gray-400">Click anywhere on the card to view full concept details</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sampleConcepts.map((concept, index) => (
                        <ConceptNoteCard
                            key={index}
                            conceptName={concept.conceptName}
                            content={concept.content}
                            images={concept.images}
                            practiceQuestions={concept.practiceQuestions}
                            subject={concept.subject}
                            difficulty={concept.difficulty}
                            onClick={() => handleCardClick(concept)}
                        />
                    ))}
                </div>

                {/* Selected Concept Modal */}
                {selectedConcept && (
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedConcept(null)}
                    >
                        <div
                            className="glass-panel rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                    <i className="fas fa-atom text-cyan-400"></i>
                                    {selectedConcept.conceptName}
                                </h2>
                                <button
                                    onClick={() => setSelectedConcept(null)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <i className="fas fa-times text-2xl"></i>
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold border border-purple-500/30">
                                    {selectedConcept.subject}
                                </span>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${selectedConcept.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border-green-500/40' :
                                        selectedConcept.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' :
                                            'bg-red-500/20 text-red-400 border-red-500/40'
                                    }`}>
                                    {selectedConcept.difficulty}
                                </span>
                            </div>

                            <div
                                className="prose prose-invert max-w-none mb-6"
                                dangerouslySetInnerHTML={{ __html: selectedConcept.content }}
                            />

                            {selectedConcept.practiceQuestions.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <i className="fas fa-question-circle text-orange-400"></i>
                                        Practice Questions ({selectedConcept.practiceQuestions.length})
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedConcept.practiceQuestions.map((q, idx) => (
                                            <div key={idx} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                                <p className="text-white font-semibold mb-2">
                                                    <span className="text-cyan-400">Q{idx + 1}:</span> {q.question}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${q.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/40' :
                                                            q.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' :
                                                                'bg-red-500/20 text-red-400 border border-red-500/40'
                                                        }`}>
                                                        {q.difficulty}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {q.options.length} options
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setSelectedConcept(null)}
                                className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer Info */}
                <div className="mt-16 text-center">
                    <div className="glass-panel rounded-2xl p-8 border border-gray-700/50">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            <i className="fas fa-lightbulb text-yellow-400 mr-2"></i>
                            Component Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                            <div>
                                <h4 className="font-semibold text-cyan-400 mb-2">🎨 Dynamic Theming</h4>
                                <p className="text-sm text-gray-400">Subject-specific color gradients and icons</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-purple-400 mb-2">🔄 Flip Animation</h4>
                                <p className="text-sm text-gray-400">Smooth 3D card flip to reveal more info</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-orange-400 mb-2">📝 Practice Preview</h4>
                                <p className="text-sm text-gray-400">Quick view of practice questions on back</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-400 mb-2">✨ Premium Design</h4>
                                <p className="text-sm text-gray-400">Glassmorphism with glow effects</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConceptCardDemo;
