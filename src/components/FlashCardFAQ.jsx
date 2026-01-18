import { useState } from 'react';

const FlashCardFAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What are Chemistry Flashcards?",
            answer: "Chemistry Flashcards are digital study cards designed to help you master chemistry concepts through active recall and spaced repetition. Each card contains a question on one side and the answer on the other, making it easy to test your knowledge and reinforce learning."
        },
        {
            question: "How does spaced repetition help in learning?",
            answer: "Spaced repetition is a learning technique that involves reviewing information at increasing intervals over time. Our algorithm tracks which cards you know well and which need more practice, showing you cards at optimal times to maximize retention and minimize study time."
        },
        {
            question: "Which chemistry chapters are covered?",
            answer: "Our flashcard collection covers all major chemistry topics including Physical Chemistry, Organic Chemistry, and Inorganic Chemistry. Topics range from basic concepts like chemical bonding and periodic table to advanced topics like thermodynamics, organic reactions, and coordination compounds."
        },
        {
            question: "Are these flashcards aligned with NCERT?",
            answer: "Yes! Our flashcards are carefully designed to align with NCERT curriculum and cover all important concepts from Class 11 and Class 12 chemistry. They're perfect for board exam preparation as well as competitive exams like JEE and NEET."
        },
        {
            question: "How do I track my progress?",
            answer: "Your progress is automatically tracked as you practice. You can see your completion percentage for each topic and chapter, view how many cards are due for review, and monitor your mastery level. The progress bars update in real-time as you complete cards."
        },
        {
            question: "Can I practice specific topics within a chapter?",
            answer: "Absolutely! You can select individual topics to practice, or choose multiple topics at once. This allows you to focus on specific areas where you need more practice, or review an entire chapter comprehensively."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="glass-panel rounded-xl p-8 mt-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                    Frequently Asked Questions
                </h2>
                <p className="text-gray-400">
                    Everything you need to know about Chemistry Flashcards
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700/30 transition-colors"
                        >
                            <span className="text-white font-semibold pr-4">
                                {faq.question}
                            </span>
                            <i
                                className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                    }`}
                            ></i>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                }`}
                        >
                            <div className="px-6 pb-4 pt-2">
                                <p className="text-gray-400 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlashCardFAQ;
