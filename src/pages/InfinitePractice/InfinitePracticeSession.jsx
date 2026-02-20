import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const InfinitePracticeSession = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchSession();
    }, [sessionId]);

    const fetchSession = async () => {
        try {
            const response = await fetch(`${API_URL}/infinite-practice/session/${sessionId}`);
            const data = await response.json();
            
            if (response.ok) {
                setSession(data);
            } else {
                toast.error('Failed to load session');
                navigate('/infinite-practice');
            }
        } catch (error) {
            console.error('Error fetching session:', error);
            toast.error('Failed to load session');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSubmit = async () => {
        if (selectedAnswer === null) {
            toast.error('Please select an answer');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/infinite-practice/session/${sessionId}/answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionIndex: currentQuestionIndex,
                    answer: selectedAnswer
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setSession(data);
                
                if (session.mode === 'Practice') {
                    setShowAnswer(true);
                } else {
                    // Exam mode - go to next question immediately
                    handleNextQuestion();
                }
            } else {
                toast.error(data.message || 'Failed to submit answer');
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            toast.error('Failed to submit answer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < session.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setShowAnswer(false);
        } else {
            handleCompleteSession();
        }
    };

    const handleCompleteSession = async () => {
        try {
            const response = await fetch(`${API_URL}/infinite-practice/session/${sessionId}/complete`, {
                method: 'POST'
            });

            if (response.ok) {
                navigate(`/infinite-practice/results/${sessionId}`);
            } else {
                toast.error('Failed to complete session');
            }
        } catch (error) {
            console.error('Error completing session:', error);
            toast.error('Failed to complete session');
        }
    };

    const handleMarkForReview = async () => {
        try {
            await fetch(`${API_URL}/infinite-practice/session/${sessionId}/mark-review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionIndex: currentQuestionIndex
                })
            });
            
            const updatedSession = { ...session };
            updatedSession.questions[currentQuestionIndex].markedForReview = 
                !updatedSession.questions[currentQuestionIndex].markedForReview;
            setSession(updatedSession);
            
            toast.success('Marked for review');
        } catch (error) {
            console.error('Error marking for review:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400 text-lg">Loading session...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-exclamation-circle text-red-500 text-6xl mb-4"></i>
                    <p className="text-gray-400 text-lg">Session not found</p>
                    <button
                        onClick={() => navigate('/infinite-practice')}
                        className="mt-4 px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = session.questions[currentQuestionIndex];
    const questionData = currentQuestion.questionId;
    const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="glass-panel rounded-2xl p-6 border border-gray-700 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                {session.mode === 'Practice' ? '📚 Practice Mode' : '🎯 Exam Mode'}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {session.subject} • {session.chapters[0]}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">
                                {currentQuestionIndex + 1}<span className="text-gray-500">/{session.questions.length}</span>
                            </div>
                            <p className="text-gray-400 text-sm">Questions</p>
                        </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="glass-panel rounded-2xl p-8 border border-gray-700 mb-6">
                    {/* Question */}
                    <div className="mb-8">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white">
                                    {currentQuestionIndex + 1}
                                </div>
                                <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/40 rounded-full text-orange-400 text-xs font-semibold">
                                    {questionData.difficulty}
                                </span>
                            </div>
                            <button
                                onClick={handleMarkForReview}
                                className={`px-4 py-2 rounded-lg border-2 transition ${
                                    currentQuestion.markedForReview
                                        ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                                        : 'border-gray-700 text-gray-400 hover:border-yellow-500'
                                }`}
                            >
                                <i className="fas fa-flag mr-2"></i>
                                {currentQuestion.markedForReview ? 'Marked' : 'Mark for Review'}
                            </button>
                        </div>
                        
                        <div 
                            className="text-xl text-white leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: questionData.question }}
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-8">
                        {questionData.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === questionData.correctAnswer;
                            const showCorrect = showAnswer && isCorrect;
                            const showIncorrect = showAnswer && isSelected && !isCorrect;

                            return (
                                <button
                                    key={index}
                                    onClick={() => !showAnswer && setSelectedAnswer(index)}
                                    disabled={showAnswer}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                        showCorrect
                                            ? 'border-green-500 bg-green-500/20'
                                            : showIncorrect
                                            ? 'border-red-500 bg-red-500/20'
                                            : isSelected
                                            ? 'border-cyan-500 bg-cyan-500/20'
                                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                    } disabled:cursor-not-allowed`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                                            showCorrect
                                                ? 'bg-green-500 text-white'
                                                : showIncorrect
                                                ? 'bg-red-500 text-white'
                                                : isSelected
                                                ? 'bg-cyan-500 text-white'
                                                : 'bg-gray-700 text-gray-300'
                                        }`}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <div 
                                            className="flex-1 text-white"
                                            dangerouslySetInnerHTML={{ __html: option }}
                                        />
                                        {showCorrect && <i className="fas fa-check-circle text-green-400 text-xl"></i>}
                                        {showIncorrect && <i className="fas fa-times-circle text-red-400 text-xl"></i>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Solution (shown in practice mode after answering) */}
                    {showAnswer && questionData.solution && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
                            <h4 className="text-blue-400 font-bold text-lg mb-3 flex items-center gap-2">
                                <i className="fas fa-lightbulb"></i>
                                Solution
                            </h4>
                            <div 
                                className="text-gray-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: questionData.solution }}
                            />
                        </div>
                    )}

                    {/* Hint */}
                    {questionData.hint && !showAnswer && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                            <details>
                                <summary className="text-yellow-400 font-semibold cursor-pointer flex items-center gap-2">
                                    <i className="fas fa-info-circle"></i>
                                    Need a hint?
                                </summary>
                                <div 
                                    className="text-gray-300 mt-3 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: questionData.hint }}
                                />
                            </details>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                        {!showAnswer ? (
                            <button
                                onClick={handleAnswerSubmit}
                                disabled={selectedAnswer === null || submitting}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check mr-2"></i>
                                        Submit Answer
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleNextQuestion}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition"
                            >
                                {currentQuestionIndex < session.questions.length - 1 ? (
                                    <>
                                        Next Question
                                        <i className="fas fa-arrow-right ml-2"></i>
                                    </>
                                ) : (
                                    <>
                                        Complete Session
                                        <i className="fas fa-check-circle ml-2"></i>
                                    </>
                                )}
                            </button>
                        )}
                        
                        {session.mode === 'Exam' && (
                            <button
                                onClick={handleCompleteSession}
                                className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition"
                            >
                                Complete & Submit
                            </button>
                        )}
                    </div>
                </div>

                {/* Question Navigator (for exam mode) */}
                {session.mode === 'Exam' && (
                    <div className="glass-panel rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-white font-bold mb-4">Question Navigator</h3>
                        <div className="grid grid-cols-10 gap-2">
                            {session.questions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCurrentQuestionIndex(idx);
                                        setSelectedAnswer(null);
                                        setShowAnswer(false);
                                    }}
                                    className={`w-10 h-10 rounded-lg font-bold transition ${
                                        idx === currentQuestionIndex
                                            ? 'bg-cyan-500 text-white'
                                            : q.userAnswer !== undefined
                                            ? 'bg-green-500/30 text-green-400 border border-green-500'
                                            : q.markedForReview
                                            ? 'bg-yellow-500/30 text-yellow-400 border border-yellow-500'
                                            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-6 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-cyan-500"></div>
                                <span className="text-gray-400">Current</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-green-500/30 border border-green-500"></div>
                                <span className="text-gray-400">Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-yellow-500/30 border border-yellow-500"></div>
                                <span className="text-gray-400">Review</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-gray-800 border border-gray-700"></div>
                                <span className="text-gray-400">Not Visited</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfinitePracticeSession;
