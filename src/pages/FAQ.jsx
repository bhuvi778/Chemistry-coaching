import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How can I complete Chemistry in 2 months for boards?",
            answer: "Focus on NCERT thoroughly, practice previous year questions daily, make concise notes for quick revision, and dedicate 3-4 hours daily to Chemistry. Prioritize important chapters like Electrochemistry, Chemical Kinetics, and Organic Chemistry. Use our video lectures and concept notes for quick understanding."
        },
        {
            question: "What are the most important topics of Class 12 Biology for boards?",
            answer: "Key topics include: Reproduction (both human and plant), Genetics and Evolution, Biotechnology, Ecology and Environment, and Human Health and Disease. These topics carry maximum weightage. Focus on diagrams, NCERT examples, and understanding concepts rather than rote learning."
        },
        {
            question: "How should I start preparing for board exams if I'm already late?",
            answer: "Don't panic! Start with NCERT textbooks, focus on high-weightage topics first, solve previous 5 years' question papers, make short notes for quick revision, and practice daily. Avoid new reference books and stick to quality over quantity. Our daily target practice tests can help you stay on track."
        },
        {
            question: "How to prepare for practical and viva in Biology?",
            answer: "Practice all experiments from your lab manual, understand the theory behind each experiment, prepare common viva questions, know the scientific names and functions of apparatus, and practice drawing diagrams neatly. Record observations carefully and understand the principles involved."
        },
        {
            question: "What is the best strategy to crack JEE Chemistry?",
            answer: "Master NCERT first (especially for Inorganic Chemistry), practice numerical problems daily for Physical Chemistry, understand reaction mechanisms for Organic Chemistry, solve previous year JEE questions, take regular mock tests, and focus on weak areas. Use our assertion-reason questions to strengthen conceptual understanding."
        },
        {
            question: "How many hours should I study for NEET preparation?",
            answer: "Aim for 8-10 hours of focused study daily, divided into: 3-4 hours for Biology, 2-3 hours for Chemistry, 2-3 hours for Physics, and 1-2 hours for revision and practice tests. Quality matters more than quantity - take regular breaks and maintain consistency."
        },
        {
            question: "Which chapters are most important for JEE Main Chemistry?",
            answer: "High-weightage chapters include: Chemical Bonding, Thermodynamics, Equilibrium, Electrochemistry, Coordination Compounds, Aldehydes & Ketones, Alcohols & Ethers, and Biomolecules. Focus on numerical problems and conceptual questions from these topics."
        },
        {
            question: "How to improve memory retention for Chemistry formulas and reactions?",
            answer: "Use flashcards for regular revision, practice writing reactions daily, create mnemonics for complex mechanisms, understand the logic behind reactions rather than memorizing, make visual mind maps, and revise at regular intervals (daily, weekly, monthly). Our flashcard system is designed specifically for this purpose."
        },
        {
            question: "What are the best resources for Chemistry preparation?",
            answer: "Start with NCERT textbooks as your foundation, use our video lectures for concept clarity, practice with our ChemSnaps for quick revision, solve previous year questions, use our concept-wise notes for organized learning, and take regular practice tests. Supplement with standard reference books only after completing NCERT."
        },
        {
            question: "How to balance board exam and competitive exam preparation?",
            answer: "Follow the 70-30 rule: 70% focus on boards (NCERT-based) and 30% on advanced competitive topics. Complete your board syllabus first as it forms the foundation. Use the same study material for both - NCERT covers 80% of competitive exam basics. Take separate mock tests for each."
        },
        {
            question: "What should I do if I'm weak in Organic Chemistry?",
            answer: "Start with basic concepts (hybridization, resonance, inductive effects), practice naming compounds daily, understand reaction mechanisms step-by-step, make a reaction chart for quick reference, solve problems regularly, and use our video tutorials for visual learning. Focus on understanding patterns rather than memorizing individual reactions."
        },
        {
            question: "How to manage time during Chemistry exams?",
            answer: "Attempt easy questions first to build confidence, allocate time based on marks (1 mark = 1 minute), don't spend too much time on a single question, keep 10-15 minutes for revision, practice with timed mock tests regularly, and learn to identify question patterns. Our practice tests help you develop this skill."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Find answers to common questions about exam preparation, study strategies, and our platform
                    </p>
                </div>

                {/* Back to Blogs Link */}
                <Link
                    to="/blogs"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition"
                >
                    <i className="fas fa-arrow-left"></i>
                    Back to Blogs
                </Link>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="glass-panel rounded-xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-cyan-500"
                        >
                            {/* Question */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-gray-800/30"
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-white font-bold text-sm">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white pr-4">
                                        {faq.question}
                                    </h3>
                                </div>
                                <div className="flex-shrink-0">
                                    <i
                                        className={`fas fa-chevron-down text-cyan-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    ></i>
                                </div>
                            </button>

                            {/* Answer */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-6 pb-6 pl-18">
                                    <div className="pl-12 pr-4">
                                        <p className="text-gray-300 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-12 glass-panel rounded-xl p-8 border border-gray-700 text-center">
                    <i className="fas fa-question-circle text-5xl text-cyan-400 mb-4"></i>
                    <h2 className="text-2xl font-bold text-white mb-3">
                        Still have questions?
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Can't find the answer you're looking for? Feel free to reach out to us.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition"
                        >
                            <i className="fas fa-envelope mr-2"></i>
                            Contact Us
                        </Link>
                        <Link
                            to="/community"
                            className="px-6 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg font-medium hover:border-cyan-500 transition"
                        >
                            <i className="fas fa-users mr-2"></i>
                            Join Community
                        </Link>
                    </div>
                </div>

                {/* Related Resources */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        Explore More Resources
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            to="/blogs"
                            className="glass-panel rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition text-center group"
                        >
                            <i className="fas fa-blog text-3xl text-cyan-400 mb-3 group-hover:scale-110 transition-transform"></i>
                            <h3 className="text-white font-semibold mb-2">Study Blogs</h3>
                            <p className="text-gray-400 text-sm">
                                Expert tips and strategies
                            </p>
                        </Link>
                        <Link
                            to="/lectures"
                            className="glass-panel rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition text-center group"
                        >
                            <i className="fas fa-video text-3xl text-purple-400 mb-3 group-hover:scale-110 transition-transform"></i>
                            <h3 className="text-white font-semibold mb-2">Video Lectures</h3>
                            <p className="text-gray-400 text-sm">
                                Comprehensive video tutorials
                            </p>
                        </Link>
                        <Link
                            to="/my-daily-target"
                            className="glass-panel rounded-xl p-6 border border-gray-700 hover:border-green-500 transition text-center group"
                        >
                            <i className="fas fa-bullseye text-3xl text-green-400 mb-3 group-hover:scale-110 transition-transform"></i>
                            <h3 className="text-white font-semibold mb-2">Practice Tests</h3>
                            <p className="text-gray-400 text-sm">
                                Daily practice questions
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
