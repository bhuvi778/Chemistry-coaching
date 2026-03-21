import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const InfinitePracticeResults = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReview, setShowReview] = useState(false);

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
                navigate('/infinite-practice');
            }
        } catch (error) {
            console.error('Error fetching session:', error);
            navigate('/infinite-practice');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400 text-lg">Loading results...</p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    const answered = session.questions.filter(q => q.userAnswer !== undefined && q.userAnswer !== null);
    const correct = session.questions.filter(q => q.isCorrect).length;
    const total = session.questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    const getScoreColor = () => {
        if (percentage >= 80) return 'text-green-400';
        if (percentage >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBg = () => {
        if (percentage >= 80) return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
        if (percentage >= 60) return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
        return 'from-red-500/20 to-pink-500/20 border-red-500/30';
    };

    const getScoreMessage = () => {
        if (percentage >= 90) return { text: 'Outstanding! 🏆', sub: 'Excellent performance!' };
        if (percentage >= 80) return { text: 'Great Job! 🎉', sub: 'Keep up the great work!' };
        if (percentage >= 60) return { text: 'Good Work! 👍', sub: 'Room for improvement.' };
        if (percentage >= 40) return { text: 'Keep Practicing! 💪', sub: 'Review the topics and try again.' };
        return { text: 'Need More Practice 📚', sub: 'Focus on the fundamentals and try again.' };
    };

    const msg = getScoreMessage();

    // Remaining chapters from other subjects (passed via navigation state)
    const { selectedExam, selectedSubjects, availableChapters, preferences } = location.state || {};
    const completedSubject = session?.subject;
    const remainingChapters = (availableChapters || []).filter(ch => ch.subject !== completedSubject);

    // Group remaining chapters by subject
    const remainingBySubject = remainingChapters.reduce((acc, ch) => {
        if (!acc[ch.subject]) acc[ch.subject] = [];
        acc[ch.subject].push(ch);
        return acc;
    }, {});

    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/infinite-practice')}
                    className="text-gray-400 hover:text-cyan-400 transition mb-6 flex items-center gap-2"
                >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Infinite Practice</span>
                </button>

                {/* Score Card */}
                <div className={`glass-panel rounded-2xl p-10 border mb-6 bg-gradient-to-br ${getScoreBg()} text-center`}>
                    <h1 className="text-4xl font-bold text-white mb-2">{msg.text}</h1>
                    <p className="text-gray-400 mb-8">{msg.sub}</p>

                    <div className={`text-8xl font-black mb-4 ${getScoreColor()}`}>
                        {percentage}%
                    </div>

                    <p className="text-gray-300 text-lg mb-8">
                        <span className="text-green-400 font-bold">{correct}</span> correct out of <span className="font-bold text-white">{total}</span> questions
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <div className="px-5 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                            <p className="text-xs text-gray-400 mb-1">Mode</p>
                            <p className="text-white font-semibold">{session.mode === 'Practice' ? '📚 Practice' : '🎯 Exam'}</p>
                        </div>
                        <div className="px-5 py-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                            <p className="text-xs text-gray-400 mb-1">Subject</p>
                            <p className="text-white font-semibold">{session.subject}</p>
                        </div>
                        <div className="px-5 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                            <p className="text-xs text-gray-400 mb-1">Chapter</p>
                            <p className="text-white font-semibold">{session.chapters?.[0]}</p>
                        </div>
                        <div className="px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
                            <p className="text-xs text-gray-400 mb-1">Answered</p>
                            <p className="text-white font-semibold">{answered.length}/{total}</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden mb-8">
                        <div
                            className={`h-full transition-all duration-1000 ${percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : percentage >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' : 'bg-gradient-to-r from-red-500 to-pink-400'}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => navigate('/infinite-practice')}
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all hover:scale-105 shadow-lg shadow-cyan-500/30"
                        >
                            <i className="fas fa-redo mr-2"></i>
                            Start Another Practice
                        </button>
                        <button
                            onClick={() => setShowReview(!showReview)}
                            className="px-8 py-4 bg-gray-800 border border-gray-700 text-white text-lg font-bold rounded-xl hover:bg-gray-700 transition-all"
                        >
                            <i className={`fas fa-${showReview ? 'chevron-up' : 'list-alt'} mr-2`}></i>
                            {showReview ? 'Hide Review' : 'Review Answers'}
                        </button>
                    </div>
                </div>

                {/* Remaining Subjects Section */}
                {remainingChapters.length > 0 && (
                    <div className="glass-panel rounded-2xl p-8 border border-cyan-500/30 mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            <i className="fas fa-infinity text-cyan-400"></i>
                            Continue with Remaining Subjects
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            You still have chapters from other subjects — keep going!
                        </p>

                        {Object.entries(remainingBySubject).map(([subject, chapters]) => (
                            <div key={subject} className="mb-6">
                                <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                                    <i className="fas fa-book-open"></i>
                                    {subject}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {chapters.map((chapter, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => navigate('/infinite-practice', {
                                                state: {
                                                    quickStart: true,
                                                    selectedExam,
                                                    selectedSubjects,
                                                    availableChapters,
                                                    selectedChapters: [chapter],
                                                    preferences
                                                }
                                            })}
                                            className="p-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:border-cyan-500/60 hover:bg-cyan-500/10 transition-all text-left group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                                                        {String(idx + 1).padStart(2, '0')}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-semibold text-sm group-hover:text-cyan-400 transition line-clamp-1">
                                                            {chapter.chapterName}
                                                        </p>
                                                        <p className="text-gray-500 text-xs">{chapter.questionCount} questions</p>
                                                    </div>
                                                </div>
                                                <i className="fas fa-arrow-right text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all"></i>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {showReview && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            <i className="fas fa-list-alt mr-2 text-cyan-400"></i>
                            Answer Review
                        </h2>
                        {session.questions.map((q, idx) => {
                            const qd = q.questionId;
                            if (!qd) return null;
                            const isCorrect = q.isCorrect;
                            const unanswered = q.userAnswer === undefined || q.userAnswer === null;

                            return (
                                <div
                                    key={idx}
                                    className={`glass-panel rounded-xl p-6 border ${
                                        unanswered
                                            ? 'border-gray-700'
                                            : isCorrect
                                            ? 'border-green-500/40'
                                            : 'border-red-500/40'
                                    }`}
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                                            unanswered
                                                ? 'bg-gray-700 text-gray-400'
                                                : isCorrect
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {unanswered ? '—' : isCorrect ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs text-gray-500 font-semibold">Q{idx + 1}</span>
                                                {unanswered && <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-400">Not Answered</span>}
                                            </div>
                                            <div
                                                className="text-white text-sm leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: qd.question }}
                                            />
                                        </div>
                                    </div>

                                    {/* Options */}
                                    {qd.options && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-13 pl-13">
                                            {qd.options.map((opt, oi) => {
                                                const optLabel = String.fromCharCode(65 + oi);
                                                const isUserAnswer = q.userAnswer === optLabel;
                                                const isCorrectAnswer = qd.correctAnswer === optLabel;

                                                return (
                                                    <div
                                                        key={oi}
                                                        className={`px-4 py-2 rounded-lg text-sm flex items-start gap-2 ${
                                                            isCorrectAnswer
                                                                ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                                                                : isUserAnswer && !isCorrectAnswer
                                                                ? 'bg-red-500/20 border border-red-500/50 text-red-300'
                                                                : 'bg-gray-800/50 border border-gray-700 text-gray-400'
                                                        }`}
                                                    >
                                                        <span className="font-bold flex-shrink-0">{optLabel}.</span>
                                                        <span dangerouslySetInnerHTML={{ __html: opt }} />
                                                        {isCorrectAnswer && <i className="fas fa-check ml-auto text-green-400 flex-shrink-0"></i>}
                                                        {isUserAnswer && !isCorrectAnswer && <i className="fas fa-times ml-auto text-red-400 flex-shrink-0"></i>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Explanation */}
                                    {qd.explanation && (
                                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                            <p className="text-xs text-blue-400 font-semibold mb-1">
                                                <i className="fas fa-lightbulb mr-1"></i>Explanation
                                            </p>
                                            <div
                                                className="text-gray-300 text-sm"
                                                dangerouslySetInnerHTML={{ __html: qd.explanation }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfinitePracticeResults;
