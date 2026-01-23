import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const AssertionReasonPractice = () => {
    const { chapterId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'all';

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentStep, setCurrentStep] = useState(1); // 1: Assertion, 2: Reason, 3: Relationship
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });
    const [userAnswers, setUserAnswers] = useState({
        assertion: null,
        reason: null,
        relationship: null
    });
    const [answerSubmitted, setAnswerSubmitted] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    useEffect(() => {
        fetchQuestions();
    }, [chapterId, mode]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId') || 'guest';
            const timestamp = Date.now();
            const response = await axios.get(
                `${API_URL}/assertion-reason/chapters/${chapterId}/questions?userId=${userId}&mode=${mode}&_t=${timestamp}`
            );

            const fetchedQuestions = response.data.questions || [];
            console.log('📚 Fetched questions:', fetchedQuestions);
            console.log('💡 First question explanation:', fetchedQuestions[0]?.explanation);
            setQuestions(fetchedQuestions);
        } catch (error) {
            console.error('Error fetching questions:', error);
            // Mock data
            setQuestions([
                {
                    _id: '1',
                    chapterName: 'Chemical Kinetics',
                    assertion: 'The units of the rate constant (k) vary depending on the order of the reaction.',
                    reason: 'The rate constant is related to the rate and concentration such that k = Rate/[Concentration]ⁿ, where n is the order.',
                    correctAnswer: 'yes', // yes or no - does reason explain assertion
                    assertionTrue: true,
                    reasonTrue: true
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const currentQuestion = questions[currentIndex];

    const saveProgress = async (quality) => {
        try {
            const userId = localStorage.getItem('userId') || 'guest';
            await axios.post(`${API_URL}/assertion-reason/progress/${currentQuestion._id}`, {
                userId,
                quality
            });
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const [showConceptCard, setShowConceptCard] = useState(false);

    useEffect(() => {
        // Reset concept card when question changes or step changes
        setShowConceptCard(false);
    }, [currentIndex, currentStep]);

    const handleRating = (quality) => {
        // Save progress with user-selected quality
        saveProgress(quality);

        // Check if this was a correct or incorrect answer
        const wasCorrect = currentStep === 3 &&
            userAnswers.assertion === currentQuestion.assertionTrue &&
            userAnswers.reason === currentQuestion.reasonTrue &&
            userAnswers.relationship === currentQuestion.correctAnswer;

        // Update score only if incorrect (correct answers already updated score in handleAnswer)
        if (!wasCorrect) {
            setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }

        // If user clicked "Again" (quality 1), restart the same question
        if (quality === 1) {
            // Reset to step 1 of the same question
            setCurrentStep(1);
            setUserAnswers({ assertion: null, reason: null, relationship: null });
            setShowConceptCard(false);
            setAnswerSubmitted(false);
        } else {
            // For other ratings, advance to next question
            advanceToNext();
        }
    };

    const advanceToNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setCurrentStep(1);
            setUserAnswers({ assertion: null, reason: null, relationship: null });
            setShowConceptCard(false);
            setAnswerSubmitted(false);
        } else {
            // Practice complete
            navigate(`/assertion-reason/${chapterId}`);
        }
    };

    const handleAnswer = (answer) => {
        setAnswerSubmitted(true);

        if (currentStep === 1) {
            // Check if Assertion answer is correct
            if (answer !== currentQuestion.assertionTrue) {
                setShowConceptCard(true);
                return;
            }
            setShowConceptCard(false);

            // Update state with the answer before moving to next step
            setUserAnswers(prev => ({ ...prev, assertion: answer }));

            // Add smooth transition to next step
            setTimeout(() => {
                setCurrentStep(2);
                setAnswerSubmitted(false);
            }, 400);
        } else if (currentStep === 2) {
            // Check if Reason answer is correct
            if (answer !== currentQuestion.reasonTrue) {
                setShowConceptCard(true);
                return;
            }
            setShowConceptCard(false);

            // Update state with the answer before moving to next step
            setUserAnswers(prev => ({ ...prev, reason: answer }));

            // Add smooth transition to next step
            setTimeout(() => {
                setCurrentStep(3);
                setAnswerSubmitted(false);
            }, 400);
        } else if (currentStep === 3) {
            // Save the relationship answer
            setUserAnswers(prev => ({ ...prev, relationship: answer }));

            // Final answer - check if correct
            const isCorrect = answer === currentQuestion.correctAnswer;

            if (!isCorrect) {
                setShowConceptCard(true);
                return;
            }

            // If correct: Show success card with quality rating
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
            setShowConceptCard(true); // Show feedback card even for correct answers
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-white text-xl">No questions available</p>
                    <button
                        onClick={() => navigate(`/assertion-reason/${chapterId}`)}
                        className="mt-4 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
                    >
                        Back to Chapter
                    </button>
                </div>
            </div>
        );
    }

    const getExplanation = () => {
        const aText = currentQuestion.assertionTrue ? "True" : "False";
        const rText = currentQuestion.reasonTrue ? "True" : "False";
        const linkText = currentQuestion.correctAnswer === 'yes' ? "correctly explains" : "does not explain";

        let base = `The Assertion is ${aText} and the Reason is ${rText}.`;
        if (currentQuestion.assertionTrue && currentQuestion.reasonTrue) {
            base += ` The Reason ${linkText} the Assertion.`;
        }
        return base;
    };

    return (
        <div className="min-h-screen pt-20 sm:pt-32 pb-8 sm:pb-16 px-3 sm:px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-4 sm:mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-xs sm:text-sm font-medium">
                            Question {currentIndex + 1} of {questions.length}
                        </span>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-check text-green-400"></i>
                                <span className="text-green-400 font-semibold">{score.correct}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-times text-red-400"></i>
                                <span className="text-red-400 font-semibold">{score.incorrect}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="glass-panel rounded-xl p-4 sm:p-6 md:p-8 relative">
                    {/* Close Button */}
                    <button
                        onClick={() => navigate(`/assertion-reason/${chapterId}`)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>

                    {/* Chapter Name */}
                    <div className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">{currentQuestion.chapterName}</div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-600'}`}>
                            1
                        </div>
                        <div className={`w-8 sm:w-16 h-1 ${currentStep >= 2 ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold ${currentStep >= 2 ? 'bg-purple-500' : 'bg-gray-600'}`}>
                            2
                        </div>
                        <div className={`w-8 sm:w-16 h-1 ${currentStep >= 3 ? 'bg-indigo-500' : 'bg-gray-600'}`}></div>
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold ${currentStep >= 3 ? 'bg-indigo-500' : 'bg-gray-600'}`}>
                            3
                        </div>
                    </div>

                    {/* Step 1: Assertion */}
                    {currentStep === 1 && (
                        <div className="space-y-4 sm:space-y-6 transition-all duration-300">
                            <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-blue-500 flex items-center justify-center text-white text-sm sm:text-base font-bold flex-shrink-0">
                                        A
                                    </div>
                                    <div
                                        className="text-white text-base sm:text-lg leading-relaxed prose prose-invert max-w-none prose-sm sm:prose-base"
                                        dangerouslySetInnerHTML={{ __html: currentQuestion.assertion }}
                                    />
                                </div>
                            </div>

                            {!showConceptCard && (
                                <div className={`text-center transition-all duration-300 ${answerSubmitted ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                                    <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6">Is the Assertion TRUE?</p>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                        <button
                                            onClick={() => handleAnswer(true)}
                                            disabled={answerSubmitted}
                                            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg bg-green-500/20 border-2 border-green-500 text-green-400 font-semibold hover:bg-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            True
                                        </button>
                                        <button
                                            onClick={() => handleAnswer(false)}
                                            disabled={answerSubmitted}
                                            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg bg-red-500/20 border-2 border-red-500 text-red-400 font-semibold hover:bg-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            False
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Reason */}
                    {currentStep === 2 && (
                        <div className="space-y-4 sm:space-y-6 transition-all duration-300">
                            {/* Show Assertion (already answered) */}
                            <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 opacity-75">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-blue-500 flex items-center justify-center text-white text-sm sm:text-base font-bold flex-shrink-0">
                                        A
                                    </div>
                                    <div
                                        className="text-white text-base sm:text-lg leading-relaxed prose prose-invert max-w-none prose-sm sm:prose-base"
                                        dangerouslySetInnerHTML={{ __html: currentQuestion.assertion }}
                                    />
                                </div>
                            </div>

                            {/* Show Reason (current question) */}
                            <div className="p-3 sm:p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-purple-500 flex items-center justify-center text-white text-sm sm:text-base font-bold flex-shrink-0">
                                        R
                                    </div>
                                    <div
                                        className="text-white text-base sm:text-lg leading-relaxed prose prose-invert max-w-none prose-sm sm:prose-base"
                                        dangerouslySetInnerHTML={{ __html: currentQuestion.reason }}
                                    />
                                </div>
                            </div>

                            {!showConceptCard && (
                                <div className={`text-center transition-all duration-300 ${answerSubmitted ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                                    <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6">Is the Reason TRUE?</p>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                        <button
                                            onClick={() => handleAnswer(true)}
                                            disabled={answerSubmitted}
                                            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg bg-green-500/20 border-2 border-green-500 text-green-400 font-semibold hover:bg-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            True
                                        </button>
                                        <button
                                            onClick={() => handleAnswer(false)}
                                            disabled={answerSubmitted}
                                            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg bg-red-500/20 border-2 border-red-500 text-red-400 font-semibold hover:bg-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            False
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Relationship */}
                    {currentStep === 3 && (
                        <div className="space-y-3 sm:space-y-4 transition-all duration-300">
                            <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-blue-500 flex items-center justify-center text-white text-sm sm:text-base font-bold flex-shrink-0">
                                        A
                                    </div>
                                    <div
                                        className="text-white text-sm sm:text-base leading-relaxed prose prose-invert max-w-none prose-sm sm:prose-base"
                                        dangerouslySetInnerHTML={{ __html: currentQuestion.assertion }}
                                    />
                                </div>

                            </div>

                            <div className="p-3 sm:p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-purple-500 flex items-center justify-center text-white text-sm sm:text-base font-bold flex-shrink-0">
                                        R
                                    </div>
                                    <div
                                        className="text-white text-sm sm:text-base leading-relaxed prose prose-invert max-w-none prose-sm sm:prose-base"
                                        dangerouslySetInnerHTML={{ __html: currentQuestion.reason }}
                                    />
                                </div>
                            </div>

                            {!showConceptCard && (
                                <div className={`text-center transition-all duration-300 pt-2 ${answerSubmitted ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                                    <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6">Does the Reason CORRECTLY explain the Assertion?</p>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                        <button
                                            onClick={() => handleAnswer('yes')}
                                            disabled={answerSubmitted}
                                            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg bg-blue-500/20 border-2 border-blue-500 text-blue-400 font-semibold hover:bg-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                        >
                                            Yes, it explains
                                        </button>
                                        <button
                                            onClick={() => handleAnswer('no')}
                                            disabled={answerSubmitted}
                                            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg bg-amber-500/20 border-2 border-amber-500 text-amber-400 font-semibold hover:bg-amber-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                        >
                                            No, just a fact
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


                    {/* Concept Card Feedback */}
                    {showConceptCard && (
                        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {/* Banner - Success or Error */}
                            {currentStep === 3 &&
                                userAnswers.assertion === currentQuestion.assertionTrue &&
                                userAnswers.reason === currentQuestion.reasonTrue &&
                                userAnswers.relationship === currentQuestion.correctAnswer ? (
                                // Success Banner
                                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-4 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <span className="text-green-400 font-bold text-lg">Correct!</span>
                                    <span className="text-green-300 text-sm">🎉 Great job!</span>
                                </div>
                            ) : (
                                // Error Banner
                                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-4 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-times text-white text-sm"></i>
                                    </div>
                                    <span className="text-red-400 font-bold text-lg">Not quite right</span>
                                </div>
                            )}

                            {/* Card */}
                            <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm mb-8">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <i className="fas fa-lightbulb text-yellow-400 text-xl"></i>
                                        <span className="text-white font-bold text-lg">Concept Card</span>
                                    </div>

                                    {/* Explanation */}
                                    <div
                                        className="text-gray-300 mb-6 leading-relaxed prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: currentQuestion.explanation || getExplanation() }}
                                    />

                                    <div className="h-px bg-slate-700/50 mb-4"></div>

                                    {/* Details */}
                                    <div className="space-y-3 font-mono text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-400 w-24">Assertion:</span>
                                            <span className={currentQuestion.assertionTrue ? "text-green-400" : "text-red-400"}>
                                                {currentQuestion.assertionTrue ? "True" : "False"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-400 w-24">Reason:</span>
                                            <span className={currentQuestion.reasonTrue ? "text-green-400" : "text-red-400"}>
                                                {currentQuestion.reasonTrue ? "True" : "False"}
                                            </span>
                                        </div>
                                        {currentQuestion.assertionTrue && currentQuestion.reasonTrue && (
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-slate-400 w-24">Link:</span>
                                                <span className="text-blue-400">
                                                    {currentQuestion.correctAnswer === 'yes' ? "R explains A" : "R does not explain A"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Quality Rating */}
                            <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150">
                                <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">How well did you know this?</p>
                                <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-3 justify-center">
                                    <button
                                        onClick={() => handleRating(1)}
                                        className="flex flex-col items-center justify-center w-full sm:w-20 h-16 sm:h-20 rounded-xl bg-red-900/30 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all group"
                                    >
                                        <i className="fas fa-times mb-1 sm:mb-2 text-lg sm:text-xl group-hover:scale-110 transition-transform"></i>
                                        <span className="text-xs font-bold">Again</span>
                                    </button>
                                    <button
                                        onClick={() => handleRating(2)}
                                        className="flex flex-col items-center justify-center w-full sm:w-20 h-16 sm:h-20 rounded-xl bg-orange-900/30 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:scale-105 transition-all group"
                                    >
                                        <i className="fas fa-history mb-1 sm:mb-2 text-lg sm:text-xl group-hover:rotate-12 transition-transform"></i>
                                        <span className="text-xs font-bold">Hard</span>
                                    </button>
                                    <button
                                        onClick={() => handleRating(4)}
                                        className="flex flex-col items-center justify-center w-full sm:w-20 h-16 sm:h-20 rounded-xl bg-green-900/30 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:scale-105 transition-all group"
                                    >
                                        <i className="fas fa-check mb-1 sm:mb-2 text-lg sm:text-xl group-hover:scale-110 transition-transform"></i>
                                        <span className="text-xs font-bold">Good</span>
                                    </button>
                                    <button
                                        onClick={() => handleRating(5)}
                                        className="flex flex-col items-center justify-center w-full sm:w-20 h-16 sm:h-20 rounded-xl bg-blue-900/30 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:scale-105 transition-all group"
                                    >
                                        <i className="fas fa-bolt mb-1 sm:mb-2 text-lg sm:text-xl group-hover:scale-110 transition-transform"></i>
                                        <span className="text-xs font-bold">Easy</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssertionReasonPractice;
