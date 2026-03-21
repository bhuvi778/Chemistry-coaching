import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const InfinitePracticeSession = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [session, setSession] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(null);
    const [timerActive, setTimerActive] = useState(false);
    const timerRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchSession();
    }, [sessionId]);

    // Timer logic
    useEffect(() => {
        if (timerActive && timeLeft !== null && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        toast.error('⏰ Time is up! Submitting session...');
                        handleCompleteSession();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [timerActive, timeLeft]);

    // Warn user if they try to close/leave via browser controls
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const fetchSession = async () => {
        try {
            const response = await fetch(`${API_URL}/infinite-practice/session/${sessionId}`);
            const data = await response.json();

            if (response.ok) {
                setSession(data);
                // Start timer if session has timed mode
                if (data.timeLimitSeconds) {
                    setTimeLeft(data.timeLimitSeconds);
                    setTimerActive(true);
                }
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

    const formatTime = (secs) => {
        if (secs === null || secs === undefined) return '--:--';
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        if (timeLeft === null) return 'text-white';
        if (timeLeft < 60) return 'text-red-400 animate-pulse';
        if (timeLeft < 300) return 'text-orange-400';
        return 'text-cyan-400';
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
                    userAnswer: selectedAnswer   // Fixed: was 'answer', now 'userAnswer'
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Update session score in local state
                setSession(prev => ({
                    ...prev,
                    score: data.score,
                    questions: prev.questions.map((q, idx) =>
                        idx === currentQuestionIndex
                            ? { ...q, userAnswer: selectedAnswer, isCorrect: data.isCorrect }
                            : q
                    )
                }));

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
        if (currentQuestionIndex < (session.questions?.length ?? 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setShowAnswer(false);
        } else {
            handleCompleteSession();
        }
    };

    const handleCompleteSession = async () => {
        clearInterval(timerRef.current);
        setTimerActive(false);
        try {
            const timeTaken = session?.timeLimitSeconds ? (session.timeLimitSeconds - (timeLeft || 0)) : 0;
            const response = await fetch(`${API_URL}/infinite-practice/session/${sessionId}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ totalTimeTaken: timeTaken })
            });

            if (response.ok) {
                navigate(`/infinite-practice/results/${sessionId}`, { state: location.state });
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
                body: JSON.stringify({ questionIndex: currentQuestionIndex })
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

    const currentQuestion = session.questions?.[currentQuestionIndex];
    const questionData = currentQuestion?.questionId;
    const progress = session.questions?.length ? ((currentQuestionIndex + 1) / session.questions.length) * 100 : 0;
    const answeredCount = session.questions?.filter(q => q.userAnswer !== null && q.userAnswer !== undefined).length || 0;

    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            {/* Exit Confirmation Modal */}
            {showExitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="glass-panel rounded-2xl p-8 border border-red-500/40 max-w-md w-full mx-4 shadow-2xl shadow-red-500/20">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mb-4">
                                <i className="fas fa-exclamation-triangle text-red-400 text-2xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Exit Practice?</h3>
                            <p className="text-gray-400 mb-2">
                                You have answered <span className="text-cyan-400 font-semibold">{answeredCount}</span> out of <span className="text-cyan-400 font-semibold">{session.questions?.length}</span> questions.
                            </p>
                            <p className="text-red-400 text-sm mb-6 font-semibold">
                                <i className="fas fa-info-circle mr-2"></i>
                                Your progress will be lost if you exit now.
                            </p>
                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={() => setShowExitModal(false)}
                                    className="flex-1 px-6 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition"
                                >
                                    <i className="fas fa-arrow-left mr-2"></i>
                                    Continue Practice
                                </button>
                                <button
                                    onClick={() => navigate('/infinite-practice')}
                                    className="flex-1 px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition"
                                >
                                    <i className="fas fa-sign-out-alt mr-2"></i>
                                    Exit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="glass-panel rounded-2xl p-6 border border-gray-700 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                {session.mode === 'Practice' ? '📚 Practice Mode' : '🎯 Exam Mode'}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {session.subject} • {session.chapters?.join(', ')}
                            </p>
                            {session.negativeMarking && (
                                <p className="text-red-400 text-xs mt-1">
                                    <i className="fas fa-minus-circle mr-1"></i>
                                    Negative marking: −{session.negativeMarkValue} per wrong answer
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Timer */}
                            {timeLeft !== null && (
                                <div className={`text-center px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 ${getTimerColor()}`}>
                                    <div className="text-2xl font-mono font-bold">{formatTime(timeLeft)}</div>
                                    <div className="text-xs text-gray-500">Time Left</div>
                                </div>
                            )}
                            <div className="text-right">
                                <div className="text-3xl font-bold text-white">
                                    {currentQuestionIndex + 1}<span className="text-gray-500">/{session.questions?.length}</span>
                                </div>
                                <p className="text-gray-400 text-sm">Questions</p>
                            </div>
                            <button
                                onClick={() => setShowExitModal(true)}
                                className="px-4 py-2 bg-red-500/10 border border-red-500/40 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 hover:border-red-500 transition flex items-center gap-2"
                            >
                                <i className="fas fa-sign-out-alt"></i>
                                <span className="hidden sm:inline">Exit</span>
                            </button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{answeredCount} answered</span>
                        <span>{session.questions?.length - answeredCount} remaining</span>
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
                                    {questionData?.difficulty}
                                </span>
                                <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-purple-400 text-xs font-semibold">
                                    {questionData?.questionType || 'Single Correct'}
                                </span>
                            </div>
                            <button
                                onClick={handleMarkForReview}
                                className={`px-4 py-2 rounded-lg border-2 transition ${currentQuestion?.markedForReview
                                        ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                                        : 'border-gray-700 text-gray-400 hover:border-yellow-500'
                                    }`}
                            >
                                <i className="fas fa-flag mr-2"></i>
                                {currentQuestion?.markedForReview ? 'Marked' : 'Mark for Review'}
                            </button>
                        </div>

                        <div
                            className="text-xl text-white leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: questionData?.question }}
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-8">
                        {(questionData?.options || []).map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === questionData?.correctAnswer;
                            const showCorrect = showAnswer && isCorrect;
                            const showIncorrect = showAnswer && isSelected && !isCorrect;

                            return (
                                <button
                                    key={index}
                                    onClick={() => !showAnswer && setSelectedAnswer(index)}
                                    disabled={showAnswer}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${showCorrect
                                            ? 'border-green-500 bg-green-500/20'
                                            : showIncorrect
                                                ? 'border-red-500 bg-red-500/20'
                                                : isSelected
                                                    ? 'border-cyan-500 bg-cyan-500/20'
                                                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                        } disabled:cursor-not-allowed`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${showCorrect
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
                    {showAnswer && questionData?.solution && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
                            <h4 className="text-blue-400 font-bold text-lg mb-3 flex items-center gap-2">
                                <i className="fas fa-lightbulb"></i>
                                Solution
                            </h4>
                            <div
                                className="text-gray-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: questionData?.solution }}
                            />
                        </div>
                    )}

                    {/* Hint */}
                    {questionData?.hint && !showAnswer && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                            <details>
                                <summary className="text-yellow-400 font-semibold cursor-pointer flex items-center gap-2">
                                    <i className="fas fa-info-circle"></i>
                                    Need a hint?
                                </summary>
                                <div
                                    className="text-gray-300 mt-3 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: questionData?.hint }}
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
                                    <><i className="fas fa-spinner fa-spin mr-2"></i>Submitting...</>
                                ) : (
                                    <><i className="fas fa-check mr-2"></i>Submit Answer</>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleNextQuestion}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition"
                            >
                                {currentQuestionIndex < (session.questions?.length ?? 1) - 1 ? (
                                    <>Next Question <i className="fas fa-arrow-right ml-2"></i></>
                                ) : (
                                    <>Complete Session <i className="fas fa-check-circle ml-2"></i></>
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

                {/* Score Summary (Exam Mode Live) */}
                {session.mode === 'Exam' && session.score && (
                    <div className="glass-panel rounded-2xl p-4 border border-gray-700 mb-6">
                        <div className="flex items-center justify-around text-center">
                            <div>
                                <div className="text-2xl font-bold text-green-400">{session.score.correct}</div>
                                <div className="text-xs text-gray-400">Correct</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-red-400">{session.score.incorrect}</div>
                                <div className="text-xs text-gray-400">Incorrect</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-400">{session.score.unattempted}</div>
                                <div className="text-xs text-gray-400">Unattempted</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Question Navigator (Exam Mode) */}
                {session.mode === 'Exam' && (
                    <div className="glass-panel rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-white font-bold mb-4">Question Navigator</h3>
                        <div className="grid grid-cols-10 gap-2">
                            {(session.questions || []).map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCurrentQuestionIndex(idx);
                                        setSelectedAnswer(null);
                                        setShowAnswer(false);
                                    }}
                                    className={`w-10 h-10 rounded-lg font-bold transition ${idx === currentQuestionIndex
                                            ? 'bg-cyan-500 text-white'
                                            : q.userAnswer !== undefined && q.userAnswer !== null
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
                        <div className="flex items-center gap-6 mt-4 text-sm flex-wrap">
                            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-cyan-500"></div><span className="text-gray-400">Current</span></div>
                            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-green-500/30 border border-green-500"></div><span className="text-gray-400">Answered</span></div>
                            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-yellow-500/30 border border-yellow-500"></div><span className="text-gray-400">Review</span></div>
                            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-gray-800 border border-gray-700"></div><span className="text-gray-400">Not Visited</span></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfinitePracticeSession;
