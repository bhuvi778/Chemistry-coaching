import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FlashCardPractice = () => {
    const { chapterId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showCompletion, setShowCompletion] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';
    const topicIds = location.state?.topicIds || [];

    useEffect(() => {
        if (topicIds.length === 0) {
            navigate(`/flash-cards/${chapterId}`);
            return;
        }
        fetchCards();
    }, [topicIds]);

    const shuffleArray = (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    const fetchCards = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId') || 'guest';
            const response = await axios.post(`${API_URL}/flashcards/cards/by-topics`, {
                topicIds,
                userId
            });
            setCards(shuffleArray(response.data));
        } catch (error) {
            console.error('Error fetching cards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = async (quality = 3) => {
        // Track correct/incorrect based on quality
        if (quality >= 4) {
            setCorrectCount(prev => prev + 1);
        } else if (quality <= 2) {
            setIncorrectCount(prev => prev + 1);
        }

        // Save progress to backend
        try {
            const userId = localStorage.getItem('userId') || 'guest';
            await axios.post(`${API_URL}/flashcards/cards/${currentCard._id}/progress`, {
                userId,
                quality
            });
        } catch (error) {
            console.error('Error saving progress:', error);
            // Continue anyway - don't block user flow
        }

        setIsFlipped(false);
        if (currentIndex < cards.length - 1) {
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, 300);
        } else {
            // Show completion message
            setTimeout(() => {
                setShowCompletion(true);
            }, 300);
        }
    };

    const restartPractice = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setShowCompletion(false);
    };

    const exitPractice = () => {
        navigate(`/flash-cards/${chapterId}`, { state: { fromPractice: true } });
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-panel rounded-xl p-12 text-center">
                        <i className="fas fa-layer-group text-6xl text-gray-600 mb-4"></i>
                        <h2 className="text-2xl font-bold text-white mb-4">No Cards Available</h2>
                        <p className="text-gray-400 mb-6">There are no flashcards in the selected topics yet.</p>
                        <button
                            onClick={exitPractice}
                            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
                        >
                            Back to Topics
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showCompletion) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-panel rounded-xl p-12 text-center">
                        <div className="mb-8">
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                                <i className="fas fa-check-circle text-6xl text-white"></i>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">All Cards Reviewed!</h2>
                            <p className="text-gray-400">You've gone through all {cards.length} flashcards.</p>
                        </div>

                        <div className="mb-8">
                            <div className="bg-gray-800/50 rounded-xl p-6 inline-block">
                                <div className="text-5xl font-bold text-white mb-2">{cards.length}</div>
                                <div className="text-gray-400">Cards Completed</div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={restartPractice}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
                            >
                                <i className="fas fa-redo mr-2"></i>
                                Review Again
                            </button>
                            <button
                                onClick={exitPractice}
                                className="px-8 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                            >
                                <i className="fas fa-arrow-left mr-2"></i>
                                Back to Topics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    // If no current card (all cards completed or filtered), show completion
    if (!currentCard) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-panel rounded-xl p-12 text-center">
                        <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                        <h2 className="text-2xl font-bold text-white mb-4">All Cards Completed!</h2>
                        <p className="text-gray-400 mb-6">
                            Great job! You've reviewed all the cards that are due.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={exitPractice}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                            >
                                <i className="fas fa-arrow-left mr-2"></i>
                                Back to Topics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-16 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">
                            Card {currentIndex + 1} of {cards.length}
                        </span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-check text-green-400 text-sm"></i>
                                <span className="text-green-400 font-semibold">{correctCount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-times text-red-400 text-sm"></i>
                                <span className="text-red-400 font-semibold">{incorrectCount}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Flash Card */}
                <div className="perspective-1000 mb-6">
                    <div
                        onClick={handleFlip}
                        className={`relative w-full h-[400px] cursor-pointer transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
                            }`}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front of Card - Question */}
                        <div
                            className={`absolute inset-0 backface-hidden ${isFlipped ? 'invisible' : 'visible'}`}
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <div className="rounded-3xl p-8 h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/60 via-purple-800/60 to-purple-900/60 border border-purple-500/30 shadow-2xl">
                                {/* Card Number Badge */}
                                <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-purple-500/30 border border-purple-400/50">
                                    <span className="text-purple-200 text-sm font-semibold">
                                        Card {currentIndex + 1}/{cards.length}
                                    </span>
                                </div>

                                <div className="text-sm text-purple-300 mb-6 uppercase tracking-widest font-semibold">
                                    QUESTION
                                </div>
                                <div
                                    className="text-2xl md:text-3xl text-white text-center font-medium mb-8 leading-relaxed prose prose-lg max-w-none prose-invert"
                                    dangerouslySetInnerHTML={{ __html: currentCard.question }}
                                />
                                <div className="text-sm text-purple-300/70 flex items-center gap-2 mt-auto">
                                    <span>Click to reveal answer</span>
                                </div>
                            </div>
                        </div>

                        {/* Back of Card - Answer */}
                        <div
                            className={`absolute inset-0 backface-hidden rotate-y-180 ${isFlipped ? 'visible' : 'invisible'}`}
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                            <div className="rounded-3xl p-8 h-full flex flex-col items-center justify-center bg-gradient-to-br from-teal-900/60 via-teal-800/60 to-teal-900/60 border border-teal-500/30 shadow-2xl">
                                {/* Card Number Badge */}
                                <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-teal-500/30 border border-teal-400/50">
                                    <span className="text-teal-200 text-sm font-semibold">
                                        Card {currentIndex + 1}/{cards.length}
                                    </span>
                                </div>

                                <div className="text-sm text-teal-300 mb-6 uppercase tracking-widest font-semibold">
                                    ANSWER
                                </div>
                                <div
                                    className="text-2xl md:text-3xl text-white text-center font-medium leading-relaxed prose prose-lg max-w-none prose-invert"
                                    dangerouslySetInnerHTML={{ __html: currentCard.answer }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Topic Badge */}
                <div className="text-center mb-6">
                    <span className="inline-block px-4 py-2 rounded-full bg-gray-800/70 text-gray-300 text-sm border border-gray-700">
                        {currentCard.topicId?.name || 'General'}
                    </span>
                </div>

                {/* Self-Assessment Buttons - Only show when card is flipped */}
                {isFlipped && (
                    <div className="animate-fadeIn">
                        <p className="text-center text-gray-400 text-sm mb-4">How well did you know this?</p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => handleNext(1)}
                                className="px-6 py-4 bg-red-500/20 border-2 border-red-500/50 text-red-400 rounded-2xl font-semibold hover:bg-red-500/30 hover:border-red-500 transition-all flex flex-col items-center gap-2 min-w-[100px]"
                            >
                                <i className="fas fa-times text-2xl"></i>
                                <span className="text-sm">Again</span>
                            </button>
                            <button
                                onClick={() => handleNext(3)}
                                className="px-6 py-4 bg-amber-500/20 border-2 border-amber-500/50 text-amber-400 rounded-2xl font-semibold hover:bg-amber-500/30 hover:border-amber-500 transition-all flex flex-col items-center gap-2 min-w-[100px]"
                            >
                                <i className="fas fa-redo text-2xl"></i>
                                <span className="text-sm">Hard</span>
                            </button>
                            <button
                                onClick={() => handleNext(4)}
                                className="px-6 py-4 bg-green-500/20 border-2 border-green-500/50 text-green-400 rounded-2xl font-semibold hover:bg-green-500/30 hover:border-green-500 transition-all flex flex-col items-center gap-2 min-w-[100px]"
                            >
                                <i className="fas fa-check text-2xl"></i>
                                <span className="text-sm">Good</span>
                            </button>
                            <button
                                onClick={() => handleNext(5)}
                                className="px-6 py-4 bg-blue-500/20 border-2 border-blue-500/50 text-blue-400 rounded-2xl font-semibold hover:bg-blue-500/30 hover:border-blue-500 transition-all flex flex-col items-center gap-2 min-w-[100px]"
                            >
                                <i className="fas fa-bolt text-2xl"></i>
                                <span className="text-sm">Easy</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Exit Button */}
                <div className="text-center mt-8">
                    <button
                        onClick={exitPractice}
                        className="text-gray-400 hover:text-white transition"
                    >
                        Exit Practice
                    </button>
                </div>
            </div>

            <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default FlashCardPractice;
