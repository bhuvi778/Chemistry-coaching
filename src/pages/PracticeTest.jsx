import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PracticeTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    useEffect(() => {
        fetchTest();
    }, [testId]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && test) {
            // Auto-submit when time runs out
            handleSubmit();
        }
    }, [timeLeft]);

    const fetchTest = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/practice-tests/tests/${testId}`);
            setTest(response.data.test);
            setQuestions(response.data.questions);
            setTimeLeft(response.data.test.duration * 60); // Convert minutes to seconds
        } catch (error) {
            console.error('Error fetching test:', error);
            alert('Failed to load test');
            navigate('/my-daily-target');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, optionIndex) => {
        setAnswers({
            ...answers,
            [questionId]: optionIndex
        });
    };

    const handleSubmit = async () => {
        try {
            const userId = localStorage.getItem('userId') || 'guest';
            const email = localStorage.getItem('userEmail'); // Get email from localStorage
            const formattedAnswers = Object.keys(answers).map(questionId => ({
                questionId,
                selectedAnswer: answers[questionId]
            }));

            const timeTaken = (test.duration * 60) - timeLeft;

            const response = await axios.post(`${API_URL}/practice-tests/tests/${testId}/submit`, {
                userId,
                email, // Include email in submission
                answers: formattedAnswers,
                timeTaken
            });

            // Mark test as attempted in localStorage
            if (email) {
                localStorage.setItem(`test_attempted_${testId}`, 'true');
            }

            // Navigate to results page
            navigate(`/practice-test/${testId}/results`, {
                state: { results: response.data }
            });
        } catch (error) {
            console.error('Error submitting test:', error);
            alert('Failed to submit test');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getAnsweredCount = () => {
        return Object.keys(answers).length;
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

    const currentQ = questions[currentQuestion];

    return (
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header with Timer */}
                <div className="glass-panel rounded-xl p-4 mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">{test.title}</h2>
                        <p className="text-sm text-gray-400">
                            Question {currentQuestion + 1} of {questions.length}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-sm text-gray-400">Time Left</div>
                            <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-cyan-400'}`}>
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowSubmitConfirm(true)}
                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold hover:shadow-lg transition"
                        >
                            Submit Test
                        </button>
                    </div>
                </div>

                {/* Question Card */}
                <div className="glass-panel rounded-xl p-8 mb-6">
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-semibold">
                                Q{currentQuestion + 1}
                            </span>
                            <span className="text-gray-400 text-sm">
                                Marks: {currentQ.marks} | Negative: {currentQ.negativeMarks}
                            </span>
                        </div>
                        <div
                            className="text-white text-lg leading-relaxed ql-editor-content"
                            dangerouslySetInnerHTML={{ __html: currentQ.question }}
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {currentQ.options.map((option, index) => {
                            const isSelected = answers[currentQ._id] === index;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(currentQ._id, index)}
                                    className={`w-full p-4 rounded-lg text-left transition-all ${isSelected
                                        ? 'bg-cyan-500/20 border-2 border-cyan-500 text-white'
                                        : 'bg-gray-800/50 border-2 border-gray-700 text-gray-300 hover:border-gray-600'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${isSelected ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400'
                                            }`}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <span
                                            className="ql-editor-content flex-1"
                                            dangerouslySetInnerHTML={{ __html: option }}
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        className="px-6 py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <i className="fas fa-chevron-left mr-2"></i>
                        Previous
                    </button>
                    <div className="text-center">
                        <div className="text-sm text-gray-400">Answered</div>
                        <div className="text-xl font-bold text-cyan-400">
                            {getAnsweredCount()} / {questions.length}
                        </div>
                    </div>
                    <button
                        onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                        disabled={currentQuestion === questions.length - 1}
                        className="px-6 py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                        <i className="fas fa-chevron-right ml-2"></i>
                    </button>
                </div>

                {/* Question Palette */}
                <div className="glass-panel rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4">Question Palette</h3>
                    <div className="grid grid-cols-10 gap-2">
                        {questions.map((q, index) => {
                            const isAnswered = answers[q._id] !== undefined;
                            const isCurrent = index === currentQuestion;
                            return (
                                <button
                                    key={q._id}
                                    onClick={() => setCurrentQuestion(index)}
                                    className={`w-10 h-10 rounded-lg font-semibold transition ${isCurrent
                                        ? 'bg-cyan-500 text-white'
                                        : isAnswered
                                            ? 'bg-green-500/30 text-green-400 border border-green-500'
                                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Submit Confirmation Modal */}
                {showSubmitConfirm && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
                            <h3 className="text-2xl font-bold text-white mb-4">Submit Test?</h3>
                            <p className="text-gray-400 mb-6">
                                You have answered {getAnsweredCount()} out of {questions.length} questions.
                                {getAnsweredCount() < questions.length && (
                                    <span className="block mt-2 text-amber-400">
                                        {questions.length - getAnsweredCount()} questions are unanswered.
                                    </span>
                                )}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold hover:shadow-lg transition"
                                >
                                    Yes, Submit
                                </button>
                                <button
                                    onClick={() => setShowSubmitConfirm(false)}
                                    className="flex-1 py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PracticeTest;
