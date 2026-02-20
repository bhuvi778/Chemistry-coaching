import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchDPPSChapter, fetchDPPSQuestions, saveDPPSProgress, fetchDPPSProgress } from '../services/dppsApi';
import { toast } from 'react-hot-toast';

const DPPSQuestions = () => {
    const { chapterId } = useParams();
    const navigate = useNavigate();

    const [chapter, setChapter] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showSolution, setShowSolution] = useState({});
    const [completedQuestions, setCompletedQuestions] = useState(new Set());

    // User interactivity state
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submittedAnswers, setSubmittedAnswers] = useState({});

    // Current question index for one-by-one display
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        loadData();
    }, [chapterId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId');

            const [chapterData, questionsData, userProgress] = await Promise.all([
                fetchDPPSChapter(chapterId),
                fetchDPPSQuestions({ chapterId, isActive: true }),
                userId ? fetchDPPSProgress(userId) : Promise.resolve([])
            ]);

            setChapter(chapterData);
            setQuestions(questionsData);

            // Hydrate progress
            if (userProgress && Array.isArray(userProgress)) {
                const chapterProgress = userProgress.filter(p => p.chapterId === chapterId);
                const completeSet = new Set();
                const submittedMap = {};
                chapterProgress.forEach(p => {
                    if (p.isCompleted) {
                        completeSet.add(p.questionId);
                        submittedMap[p.questionId] = p.isCorrect;
                    }
                });
                setCompletedQuestions(completeSet);
                setSubmittedAnswers(prev => ({ ...prev, ...submittedMap }));
            }

        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const toggleSolution = (qId) => {
        setShowSolution(prev => ({ ...prev, [qId]: !prev[qId] }));
    };

    const markAsCompletedLocal = (qId) => {
        setCompletedQuestions(prev => {
            const newSet = new Set(prev);
            if (!newSet.has(qId)) newSet.add(qId);
            return newSet;
        });
    };

    const handleOptionSelect = (qId, option) => {
        if (submittedAnswers[qId]) return;
        setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
    };

    const handleRetry = (qId) => {
        setSubmittedAnswers(prev => {
            const newState = { ...prev };
            delete newState[qId];
            return newState;
        });
        setSelectedAnswers(prev => {
            const newState = { ...prev };
            delete newState[qId];
            return newState;
        });
        setShowSolution(prev => ({ ...prev, [qId]: false }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmitAnswer = async (qId, correctAnswer) => {
        if (!selectedAnswers[qId] || submittedAnswers[qId]) return;

        const isCorrect = selectedAnswers[qId] === correctAnswer;

        // Update UI state
        setSubmittedAnswers(prev => ({ ...prev, [qId]: isCorrect }));

        if (isCorrect) {
            markAsCompletedLocal(qId);
        }

        // Save to Backend
        try {
            const userId = localStorage.getItem('userId') || 'guest';
            await saveDPPSProgress({
                userId,
                questionId: qId,
                chapterId,
                isCorrect
            });
        } catch (error) {
            console.error('Failed to save progress', error);
        }
    };

    const handleFeedback = (difficulty) => {
        // Here we could save the user's difficulty rating (Easy/Medium/Hard)
        // For now, we simply move to the next question as requested
        handleNextQuestion();
    };

    const getScore = () => {
        let correct = 0;
        let total = 0;
        Object.keys(submittedAnswers).forEach(qId => {
            total++;
            if (submittedAnswers[qId]) correct++;
        });
        return { correct, total, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 };
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-400 bg-green-500/20 border-green-500/50';
            case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
            case 'Tough': return 'text-red-400 bg-red-500/20 border-red-500/50';
            default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400">Loading questions...</p>
                </div>
            </div>
        );
    }

    if (!chapter) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-exclamation-triangle text-yellow-500 text-6xl mb-4"></i>
                    <p className="text-gray-400 text-lg">Chapter not found</p>
                    <button onClick={() => navigate('/dpps')} className="text-cyan-400 hover:underline mt-4 inline-block">
                        Back to DPPS
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dpps')}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-6"
                >
                    <i className="fas fa-chevron-left"></i>
                    <span>Back to DPPS</span>
                </button>

                {/* Header */}
                <div className="glass-panel rounded-2xl p-8 mb-8 border border-gray-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
                        <i className="fas fa-clipboard-list"></i>
                        <span>DPPS</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{chapter.name}</h1>
                            {chapter.subject && (
                                <p className="text-gray-400 mb-2">
                                    <i className="fas fa-flask mr-2"></i>{chapter.subject}
                                </p>
                            )}
                            {chapter.description && (
                                <p className="text-gray-300 mb-4 text-lg">{chapter.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-3 py-1 rounded-lg text-sm font-medium text-cyan-400 bg-cyan-500/20">
                                    <i className="fas fa-question-circle mr-2"></i>{questions.length} Questions
                                </span>
                                <span className="px-3 py-1 rounded-lg text-sm font-medium text-pink-400 bg-pink-500/20">
                                    <i className="fas fa-check-circle mr-2"></i>{completedQuestions.size} Completed
                                </span>
                                <span className="px-3 py-1 rounded-lg text-sm font-medium text-green-400 bg-green-500/20">
                                    <i className="fas fa-trophy mr-2"></i>{getScore().percentage}% Mastery
                                </span>
                                <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getDifficultyColor(chapter.difficultyLevel)}`}>
                                    {chapter.difficultyLevel}
                                </span>
                            </div>
                        </div>

                        {/* Question Progress Bar */}
                        <div className="w-full lg:w-72 bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Question Progress</span>
                                <span className="text-lg font-bold text-cyan-400">{currentQuestionIndex + 1}/{questions.length}</span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                                    style={{ width: `${((currentQuestionIndex + 1) / (questions.length || 1)) * 100}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 text-center">
                                {Object.keys(submittedAnswers).length} answered · {getScore().correct} correct
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Display */}
                {questions.length === 0 ? (
                    <div className="text-center py-20">
                        <i className="fas fa-inbox text-gray-600 text-6xl mb-4"></i>
                        <p className="text-gray-400 text-lg">No questions available in this chapter yet.</p>
                    </div>
                ) : currentQuestion && (
                    <div className="space-y-6">
                        {(() => {
                            const question = currentQuestion;
                            const index = currentQuestionIndex;

                            const isSubmitted = submittedAnswers.hasOwnProperty(question._id);
                            const isCorrectAnswer = isSubmitted && submittedAnswers[question._id];
                            const isMCQ = question.options && question.options.length > 0;

                            return (
                                <div
                                    key={question._id}
                                    className={`glass-panel rounded-xl p-6 border transition-all duration-300 ${isSubmitted
                                        ? (isCorrectAnswer ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5')
                                        : 'border-gray-700 hover:border-cyan-500/50'
                                        }`}
                                >
                                    {/* Question Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-cyan-400 font-bold">Q{index + 1}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                                    <span className="px-2 py-1 rounded text-xs font-medium text-purple-400 bg-purple-500/20">
                                                        {isMCQ ? 'MCQ' : question.questionType || 'Subjective'}
                                                    </span>
                                                    {question.marks && (
                                                        <span className="px-2 py-1 rounded text-xs font-medium text-gray-400 bg-gray-500/20">
                                                            {question.marks} Marks
                                                        </span>
                                                    )}
                                                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(question.difficultyLevel)}`}>
                                                        {question.difficultyLevel}
                                                    </span>
                                                    {isSubmitted && (
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${isCorrectAnswer ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'}`}>
                                                            <i className={`fas fa-${isCorrectAnswer ? 'check' : 'times'} mr-1`}></i>
                                                            {isCorrectAnswer ? 'Correct' : 'Incorrect'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Question Text */}
                                    <div className="mb-4">
                                        <div
                                            className="text-lg text-white font-medium leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: question.question }}
                                        />
                                    </div>

                                    {/* MCQ Options */}
                                    {isMCQ && (
                                        <div className="mb-4 space-y-2">
                                            {question.options.map((option, optIndex) => {
                                                const isSelected = selectedAnswers[question._id] === option;
                                                const isCorrectOption = option === question.correctAnswer;
                                                const showCorrect = isSubmitted && isCorrectOption;
                                                const showWrong = isSubmitted && isSelected && !isCorrectOption;

                                                return (
                                                    <button
                                                        key={optIndex}
                                                        onClick={() => handleOptionSelect(question._id, option)}
                                                        disabled={isSubmitted}
                                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSubmitted
                                                            ? (showCorrect
                                                                ? 'border-green-500 bg-green-500/10'
                                                                : (showWrong
                                                                    ? 'border-red-500 bg-red-500/10'
                                                                    : 'border-gray-700 bg-gray-800/30'))
                                                            : (isSelected
                                                                ? 'border-cyan-500 bg-cyan-500/10'
                                                                : 'border-gray-700 bg-gray-800/30 hover:border-cyan-500/50')
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSubmitted
                                                                ? (showCorrect
                                                                    ? 'border-green-500 bg-green-500'
                                                                    : (showWrong
                                                                        ? 'border-red-500 bg-red-500'
                                                                        : 'border-gray-600'))
                                                                : (isSelected
                                                                    ? 'border-cyan-500 bg-cyan-500'
                                                                    : 'border-gray-600')
                                                                }`}>
                                                                {(isSelected || showCorrect) && (
                                                                    <i className={`fas fa-${showCorrect ? 'check' : (showWrong ? 'times' : 'check')} text-white text-xs`}></i>
                                                                )}
                                                            </div>
                                                            <span className={`flex-1 ${isSubmitted
                                                                ? (showCorrect ? 'text-green-400' : (showWrong ? 'text-red-400' : 'text-gray-400'))
                                                                : (isSelected ? 'text-cyan-400' : 'text-gray-300')
                                                                }`}>
                                                                <span className="font-semibold mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                                                                <span dangerouslySetInnerHTML={{ __html: option }} />
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    {selectedAnswers[question._id] && !isSubmitted && (
                                        <div className="mb-6">
                                            <button
                                                onClick={() => handleSubmitAnswer(question._id, question.correctAnswer)}
                                                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition"
                                            >
                                                Submit Answer
                                            </button>
                                        </div>
                                    )}

                                    {/* Feedback & Retry */}
                                    {isSubmitted && (
                                        <div className="animate-fadeIn">
                                            <div className={`mb-6 p-3 rounded-lg border ${isCorrectAnswer ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                                {isCorrectAnswer ? (
                                                    <div className="flex items-center gap-2"><i className="fas fa-check-circle"></i> Correct Answer!</div>
                                                ) : (
                                                    <div className="flex items-center gap-2"><i className="fas fa-times-circle"></i> Incorrect. Check solution below.</div>
                                                )}
                                            </div>

                                            {/* Feedback Options */}
                                            <div className="mt-4 border-t border-gray-700 pt-4">
                                                <p className="text-center text-gray-400 text-sm mb-3">Rate this question to continue</p>
                                                <div className="flex justify-center gap-3 flex-wrap">
                                                    {/* Retry Button - Only if Wrong */}
                                                    {!isCorrectAnswer && (
                                                        <button onClick={() => handleRetry(question._id)} className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition flex items-center gap-2 border border-gray-600">
                                                            <i className="fas fa-redo"></i> Retry
                                                        </button>
                                                    )}

                                                    <button onClick={() => handleFeedback('Hard')} className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition"><i className="fas fa-brain mr-2"></i>Hard</button>
                                                    <button onClick={() => handleFeedback('Medium')} className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/20 transition"><i className="fas fa-balance-scale mr-2"></i>Medium</button>
                                                    <button onClick={() => handleFeedback('Easy')} className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm hover:bg-green-500/20 transition"><i className="fas fa-bolt mr-2"></i>Easy</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Solution Toggle Button */}
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={() => toggleSolution(question._id)} className="text-cyan-400 hover:text-cyan-300 text-sm">
                                            <i className="fas fa-check-double mr-1"></i> Solution
                                        </button>
                                    </div>

                                    {/* Solution Content */}
                                    {showSolution[question._id] && (
                                        <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                                            <div className="text-cyan-400 font-bold text-xs mb-2">SOLUTION</div>
                                            {question.correctAnswer && (
                                                <div className="mb-2 inline-block px-2 py-1 bg-cyan-900/50 rounded border border-cyan-500/30 text-xs text-cyan-200 font-bold">
                                                    Answer: {question.correctAnswer}
                                                </div>
                                            )}
                                            <div
                                                className="text-gray-300 text-sm whitespace-pre-line"
                                                dangerouslySetInnerHTML={{ __html: question.solution || 'Solution not available yet.' }}
                                            />
                                        </div>
                                    )}

                                    {/* Navigation Buttons - Hidden if submitted (user must use feedback to proceed) */}
                                    {!isSubmitted && (
                                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                                            <button
                                                onClick={handlePreviousQuestion}
                                                disabled={currentQuestionIndex === 0}
                                                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition"
                                            >
                                                <i className="fas fa-chevron-left mr-2"></i> Previous
                                            </button>
                                            <button
                                                onClick={handleNextQuestion}
                                                disabled={currentQuestionIndex === questions.length - 1}
                                                className="px-4 py-2 bg-cyan-500 text-black font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-400 transition"
                                            >
                                                Next <i className="fas fa-chevron-right ml-2"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DPPSQuestions;
