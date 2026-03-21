import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDPPSTestResults } from '../services/dppsApi';
import { toast } from 'react-hot-toast';

const DPPSTestResults = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReview, setShowReview] = useState(false);

    useEffect(() => {
        loadResults();
    }, [sessionId]);

    const loadResults = async () => {
        try {
            setLoading(true);
            const data = await fetchDPPSTestResults(sessionId);
            setResults(data);
        } catch (error) {
            console.error('Failed to load results:', error);
            toast.error('Failed to load test results');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        }
        if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        }
        return `${secs}s`;
    };

    const getPerformanceMessage = (percentage) => {
        if (percentage >= 90) return { message: 'Outstanding! 🎉', color: 'text-green-400' };
        if (percentage >= 75) return { message: 'Excellent Work! 👏', color: 'text-green-400' };
        if (percentage >= 60) return { message: 'Good Job! 👍', color: 'text-cyan-400' };
        if (percentage >= 40) return { message: 'Keep Practicing! 💪', color: 'text-yellow-400' };
        return { message: 'Need More Practice 📚', color: 'text-orange-400' };
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400">Loading results...</p>
                </div>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-exclamation-triangle text-red-400 text-6xl mb-4"></i>
                    <p className="text-gray-400 text-lg">Results not found</p>
                    <button
                        onClick={() => navigate('/dpps')}
                        className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition"
                    >
                        Back to DPPS
                    </button>
                </div>
            </div>
        );
    }

    const performance = getPerformanceMessage(results.percentage);
    const timeTaken = results.submittedAt && results.startTime
        ? Math.floor((new Date(results.submittedAt) - new Date(results.startTime)) / 1000)
        : 0;

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="mb-6">
                        {results.isAutoSubmitted ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 mb-4">
                                <i className="fas fa-clock"></i>
                                <span>Auto-submitted (Time Expired)</span>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 mb-4">
                                <i className="fas fa-check-circle"></i>
                                <span>Test Completed</span>
                            </div>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Test Results
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {results.chapterId?.name}
                    </p>
                    <p className={`text-2xl font-bold mt-4 ${performance.color}`}>
                        {performance.message}
                    </p>
                </div>

                {/* Score Card */}
                <div className="glass-panel rounded-2xl p-8 border border-gray-700 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Score */}
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white">{results.percentage}%</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm">Overall Score</p>
                            <p className="text-white font-semibold">{results.correctAnswers}/{results.totalQuestions}</p>
                        </div>

                        {/* Attempted */}
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-500/20 border-4 border-purple-500/50 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-purple-400">{results.attemptedQuestions}</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm">Questions Attempted</p>
                            <p className="text-white font-semibold">out of {results.totalQuestions}</p>
                        </div>

                        {/* Correct */}
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-500/20 border-4 border-green-500/50 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-green-400">{results.correctAnswers}</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm">Correct Answers</p>
                            <p className="text-white font-semibold">
                                {results.attemptedQuestions > 0
                                    ? Math.round((results.correctAnswers / results.attemptedQuestions) * 100)
                                    : 0}% accuracy
                            </p>
                        </div>

                        {/* Incorrect */}
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-red-500/20 border-4 border-red-500/50 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-red-400">{results.incorrectAnswers}</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm">Incorrect Answers</p>
                            <p className="text-white font-semibold">
                                {results.totalQuestions - results.attemptedQuestions} unattempted
                            </p>
                        </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="mt-8 pt-8 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Marks Scored</p>
                            <p className="text-white font-semibold text-lg">
                                <span className="text-green-400">{results.score ?? results.correctAnswers}</span>
                                {results.totalMarks > 0 && <span className="text-gray-500"> / {results.totalMarks}</span>}
                            </p>
                            {(results.negativeScore ?? 0) > 0 && (
                                <p className="text-red-400 text-xs mt-1">-{results.negativeScore} negative marks</p>
                            )}
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Time Taken</p>
                            <p className="text-white font-semibold text-lg">{formatTime(timeTaken)}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Submission</p>
                            <p className="text-white font-semibold text-lg">
                                {results.isAutoSubmitted ? 'Auto' : 'Manual'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Question Review Toggle */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => setShowReview(!showReview)}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                    >
                        <i className={`fas fa-${showReview ? 'eye-slash' : 'eye'} mr-2`}></i>
                        {showReview ? 'Hide' : 'Show'} Question Review
                    </button>
                </div>

                {/* Question Review */}
                {showReview && (
                    <div className="space-y-6 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Question-wise Review</h2>
                        {results.questions.map((q, index) => {
                            const question = q.questionId;
                            const isCorrect = q.isCorrect;
                            const isAttempted = q.isAttempted;

                            return (
                                <div
                                    key={index}
                                    className={`glass-panel rounded-xl p-6 border-2 ${!isAttempted
                                            ? 'border-gray-700'
                                            : isCorrect
                                                ? 'border-green-500/50'
                                                : 'border-red-500/50'
                                        }`}
                                >
                                    {/* Question Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white">
                                            Question {index + 1}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            {!isAttempted ? (
                                                <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-lg text-sm">
                                                    Not Attempted
                                                </span>
                                            ) : isCorrect ? (
                                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
                                                    <i className="fas fa-check mr-1"></i>
                                                    Correct
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm">
                                                    <i className="fas fa-times mr-1"></i>
                                                    Incorrect
                                                </span>
                                            )}
                                            {q.timeSpent > 0 && (
                                                <span className="text-gray-400 text-sm">
                                                    <i className="fas fa-clock mr-1"></i>
                                                    {formatTime(q.timeSpent)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Question Text */}
                                    <div
                                        className="text-gray-300 mb-4"
                                        dangerouslySetInnerHTML={{ __html: question?.question }}
                                    />

                                    {/* Options */}
                                    <div className="space-y-2 mb-4">
                                        {question?.options?.map((option, optIndex) => {
                                            const optionLabel = String.fromCharCode(65 + optIndex);
                                            const isUserAnswer = q.selectedAnswer === optionLabel;
                                            const isCorrectAnswer = question.correctAnswer === optionLabel;

                                            return (
                                                <div
                                                    key={optIndex}
                                                    className={`p-3 rounded-lg border ${isCorrectAnswer
                                                            ? 'border-green-500 bg-green-500/10'
                                                            : isUserAnswer && !isCorrectAnswer
                                                                ? 'border-red-500 bg-red-500/10'
                                                                : 'border-gray-700 bg-gray-800/50'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${isCorrectAnswer
                                                                ? 'bg-green-500 text-white'
                                                                : isUserAnswer
                                                                    ? 'bg-red-500 text-white'
                                                                    : 'bg-gray-700 text-gray-400'
                                                            }`}>
                                                            {optionLabel}
                                                        </div>
                                                        <div
                                                            className="text-gray-300 text-sm flex-grow"
                                                            dangerouslySetInnerHTML={{ __html: option }}
                                                        />
                                                        {isCorrectAnswer && (
                                                            <i className="fas fa-check text-green-400"></i>
                                                        )}
                                                        {isUserAnswer && !isCorrectAnswer && (
                                                            <i className="fas fa-times text-red-400"></i>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Solution */}
                                    {question?.solution && (
                                        <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                                            <p className="text-cyan-400 font-semibold mb-2">
                                                <i className="fas fa-lightbulb mr-2"></i>
                                                Solution:
                                            </p>
                                            <div
                                                className="text-gray-300 text-sm"
                                                dangerouslySetInnerHTML={{ __html: question.solution }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/dpps')}
                        className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition transform hover:scale-105"
                    >
                        <i className="fas fa-home mr-2"></i>
                        Back to DPPS
                    </button>
                    <button
                        onClick={() => navigate(`/dpps/test/${results.chapterId._id}`)}
                        className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
                    >
                        <i className="fas fa-redo mr-2"></i>
                        Retake Test
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DPPSTestResults;
