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

            setQuestions(response.data.questions || []);
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

    const saveProgress = async (isCorrect) => {
        try {
            const userId = localStorage.getItem('userId') || 'guest';
            // If correct, quality = 5 (Easy/Good), if incorrect, quality = 1 (Again)
            const quality = isCorrect ? 5 : 1;

            await axios.post(`${API_URL}/assertion-reason/progress/${currentQuestion._id}`, {
                userId,
                quality
            });
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const handleAnswer = (answer) => {
        if (currentStep === 1) {
            setUserAnswers({ ...userAnswers, assertion: answer });
            setCurrentStep(2);
        } else if (currentStep === 2) {
            setUserAnswers({ ...userAnswers, reason: answer });
            setCurrentStep(3);
        } else if (currentStep === 3) {
            // Final answer - check if correct
            const isCorrect = answer === currentQuestion.correctAnswer;

            // Save progress to backend
            saveProgress(isCorrect);

            setScore({
                correct: score.correct + (isCorrect ? 1 : 0),
                incorrect: score.incorrect + (isCorrect ? 0 : 1)
            });

            // Show feedback briefly before moving on (optional, but good UX)
            // For now, we keep the auto-advance logic
            setTimeout(() => {
                if (currentIndex < questions.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                    setCurrentStep(1);
                    setUserAnswers({ assertion: null, reason: null, relationship: null });
                } else {
                    // Practice complete
                    navigate(`/assertion-reason/${chapterId}`);
                }
            }, 1000);
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

    return (
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Progress Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm font-medium">
                            Question {currentIndex + 1} of {questions.length}
                        </span>
                        <div className="flex items-center gap-4">
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
                <div className="glass-panel rounded-xl p-8">
                    {/* Close Button */}
                    <button
                        onClick={() => navigate(`/assertion-reason/${chapterId}`)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>

                    {/* Chapter Name */}
                    <div className="text-gray-400 text-sm mb-6">{currentQuestion.chapterName}</div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-600'}`}>
                            1
                        </div>
                        <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${currentStep >= 2 ? 'bg-purple-500' : 'bg-gray-600'}`}>
                            2
                        </div>
                        <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-indigo-500' : 'bg-gray-600'}`}></div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${currentStep >= 3 ? 'bg-indigo-500' : 'bg-gray-600'}`}>
                            3
                        </div>
                    </div>

                    {/* Step 1: Assertion */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                        A
                                    </div>
                                    <p className="text-white text-lg leading-relaxed">{currentQuestion.assertion}</p>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-gray-300 text-lg mb-6">Is the Assertion TRUE?</p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => handleAnswer(true)}
                                        className="px-8 py-3 rounded-lg bg-green-500/20 border-2 border-green-500 text-green-400 font-semibold hover:bg-green-500/30 transition"
                                    >
                                        True
                                    </button>
                                    <button
                                        onClick={() => handleAnswer(false)}
                                        className="px-8 py-3 rounded-lg bg-red-500/20 border-2 border-red-500 text-red-400 font-semibold hover:bg-red-500/30 transition"
                                    >
                                        False
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Reason */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded bg-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                        R
                                    </div>
                                    <p className="text-white text-lg leading-relaxed">{currentQuestion.reason}</p>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-gray-300 text-lg mb-6">Is the Reason TRUE?</p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => handleAnswer(true)}
                                        className="px-8 py-3 rounded-lg bg-green-500/20 border-2 border-green-500 text-green-400 font-semibold hover:bg-green-500/30 transition"
                                    >
                                        True
                                    </button>
                                    <button
                                        onClick={() => handleAnswer(false)}
                                        className="px-8 py-3 rounded-lg bg-red-500/20 border-2 border-red-500 text-red-400 font-semibold hover:bg-red-500/30 transition"
                                    >
                                        False
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Relationship */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                        A
                                    </div>
                                    <p className="text-white leading-relaxed">{currentQuestion.assertion}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded bg-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                        R
                                    </div>
                                    <p className="text-white leading-relaxed">{currentQuestion.reason}</p>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-gray-300 text-lg mb-6">Does the Reason CORRECTLY explain the Assertion?</p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => handleAnswer('yes')}
                                        className="px-8 py-3 rounded-lg bg-blue-500/20 border-2 border-blue-500 text-blue-400 font-semibold hover:bg-blue-500/30 transition"
                                    >
                                        Yes, it explains
                                    </button>
                                    <button
                                        onClick={() => handleAnswer('no')}
                                        className="px-8 py-3 rounded-lg bg-amber-500/20 border-2 border-amber-500 text-amber-400 font-semibold hover:bg-amber-500/30 transition"
                                    >
                                        No, just a fact
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
