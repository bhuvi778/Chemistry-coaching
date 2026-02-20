import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchNCERTChapter, fetchNCERTQuestions, submitErrorReport } from '../services/ncertApi';
import { toast } from 'react-hot-toast';

const NCERTQuestionViewer = () => {
    const { typeId, chapterId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [chapter, setChapter] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // User answers and submission state
    const [userAnswers, setUserAnswers] = useState({});
    const [submittedQuestions, setSubmittedQuestions] = useState(new Set());
    const [showSolution, setShowSolution] = useState({});

    // Current question index for one-by-one display
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const isExemplar = location.pathname.includes('exemplars');
    const isDiagrams = location.pathname.includes('diagrams');

    let category = 'questions';
    if (isExemplar) category = 'exemplars';
    if (isDiagrams) category = 'diagrams';

    useEffect(() => {
        loadData();
    }, [typeId, chapterId, isExemplar, isDiagrams]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Fetch questions by badgeType and category
            const filters = {
                badgeType: typeId,
                category: category
            };

            // Only include chapterId if it exists
            if (chapterId) {
                filters.chapterId = chapterId;
            }

            const questionsRes = await fetchNCERTQuestions(filters);

            // Also fetch chapter details if available
            if (chapterId) {
                const chapterData = await fetchNCERTChapter(chapterId);
                setChapter(chapterData);
            }

            setQuestions(questionsRes || []);

        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, selectedOption) => {
        // Only allow selection if not yet submitted
        if (!submittedQuestions.has(questionId)) {
            setUserAnswers(prev => ({
                ...prev,
                [questionId]: selectedOption
            }));
        }
    };

    const handleSubmitAnswer = (questionId) => {
        if (!userAnswers[questionId]) {
            alert('Please select an answer first!');
            return;
        }
        setSubmittedQuestions(prev => new Set([...prev, questionId]));
    };

    const toggleSolution = (qId) => {
        setShowSolution(prev => ({ ...prev, [qId]: !prev[qId] }));
    };

    const handleRetry = (qId) => {
        // Remove from submitted questions
        setSubmittedQuestions(prev => {
            const newSet = new Set(prev);
            newSet.delete(qId);
            return newSet;
        });
        // Clear user answer
        setUserAnswers(prev => {
            const newState = { ...prev };
            delete newState[qId];
            return newState;
        });
        // Hide solution
        setShowSolution(prev => ({ ...prev, [qId]: false }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            // Scroll to top when moving to next question
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            // Scroll to top when moving to previous question
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleDifficultyRating = (difficulty) => {
        // You can save the difficulty rating to backend here if needed
        console.log(`Question rated as: ${difficulty}`);

        // Check if this is the last question
        if (currentQuestionIndex === questions.length - 1) {
            // Show completion message or redirect
            setTimeout(() => {
                alert(`🎉 Congratulations! You've completed all ${questions.length} questions!\n\nScore: ${score.correct}/${submittedQuestions.size} correct`);
            }, 300);
        } else {
            // Auto-advance to next question
            handleNextQuestion();
        }
    };

    // Error Report Modal State
    const [showErrorReportModal, setShowErrorReportModal] = useState(false);
    const [reportingQuestionId, setReportingQuestionId] = useState(null);
    const [errorReportForm, setErrorReportForm] = useState({
        errorType: '',
        additionalDetails: '',
        reporterName: '',
        reporterEmail: '',
        reporterMobile: ''
    });

    const handleOpenErrorReport = (questionId) => {
        setReportingQuestionId(questionId);
        setShowErrorReportModal(true);
    };

    const handleCloseErrorReport = () => {
        setShowErrorReportModal(false);
        setReportingQuestionId(null);
        setErrorReportForm({
            errorType: '',
            additionalDetails: '',
            reporterName: '',
            reporterEmail: '',
            reporterMobile: ''
        });
    };

    const handleSubmitErrorReport = async (e) => {
        e.preventDefault();

        if (!errorReportForm.errorType) {
            toast.error('Please select an error type');
            return;
        }

        try {
            const reportData = {
                questionId: reportingQuestionId,
                errorType: errorReportForm.errorType,
                additionalDetails: errorReportForm.additionalDetails,
                reporterName: errorReportForm.reporterName,
                reporterEmail: errorReportForm.reporterEmail,
                reporterMobile: errorReportForm.reporterMobile
            };

            await submitErrorReport(reportData);
            toast.success('Error report submitted successfully! Thank you for your feedback.');
            handleCloseErrorReport();
        } catch (error) {
            console.error('Failed to submit error report:', error);
            toast.error('Failed to submit error report. Please try again.');
        }
    };



    const isCorrect = (questionId) => {
        const question = questions.find(q => q._id === questionId);
        if (!question) return false;

        // Check if MCQ
        const isMCQ = question.questionType === 'MCQ' || (question.options && question.options.length > 0);

        if (!isMCQ) {
            // For subjective, if it's in submittedQuestions logic, we count it as "Correct/Done" 
            // because the user self-verified with the buttons.
            return submittedQuestions.has(questionId);
        }

        return userAnswers[questionId] === question.correctAnswer;
    };

    const handleSubjectiveRating = (questionId, rating) => {
        // Mark as submitted (and thus correct/completed)
        setSubmittedQuestions(prev => new Set([...prev, questionId]));

        // Log rating and convert to "Hard/Medium/Easy" flow
        handleDifficultyRating(rating);
    };

    const getScore = () => {
        let correct = 0;
        submittedQuestions.forEach(qId => {
            if (isCorrect(qId)) correct++;
        });
        return { correct, total: submittedQuestions.size, percentage: submittedQuestions.size > 0 ? Math.round((correct / submittedQuestions.size) * 100) : 0 };
    };

    const score = getScore();

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-400 bg-green-500/20 border-green-500/50';
            case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
            case 'Hard': return 'text-red-400 bg-red-500/20 border-red-500/50';
            default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
        }
    };

    const getBackPath = () => {
        // If there's a chapter, go back to the type/chapter selection
        // If no chapter, go back to the main category page
        if (chapterId) {
            if (isExemplar) return `/ncert-toolbox/exemplars/${typeId}`;
            if (isDiagrams) return `/ncert-toolbox/diagrams/${typeId}`;
            return `/ncert-toolbox/questions/${typeId}`;
        } else {
            if (isExemplar) return '/ncert-toolbox/exemplars';
            if (isDiagrams) return '/ncert-toolbox/diagrams';
            return '/ncert-toolbox/questions';
        }
    };

    const getBackLabel = () => {
        if (isExemplar) return 'Exemplar Category';
        if (isDiagrams) return 'Diagram Category';
        return 'Question Category';
    };

    const getIcon = () => {
        if (isExemplar) return 'fa-graduation-cap';
        if (isDiagrams) return 'fa-image';
        return 'fa-question-circle';
    };

    const getLabel = () => {
        if (isExemplar) return 'NCERT Exemplar';
        if (isDiagrams) return 'Diagram Based Questions';
        return 'NCERT Questions';
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

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(getBackPath())}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-6"
                >
                    <i className="fas fa-chevron-left"></i>
                    <span>Back to {getBackLabel()}</span>
                </button>

                {/* Header */}
                <div className="glass-panel rounded-2xl p-8 mb-8 border border-gray-700">
                    {/* Tag */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 border ${isExemplar ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                        (isDiagrams ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-pink-500/10 border-pink-500/30 text-pink-400')
                        }`}>
                        <i className={`fas ${getIcon()}`}></i>
                        <span>{getLabel()}</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            {chapter && <div className="text-sm text-gray-400 mb-2">{chapter.chapterNumber}</div>}
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                {chapter ? chapter.name : 'Practice Questions'}
                            </h1>
                            <p className="text-gray-300 mb-4 text-lg">
                                {isExemplar ? 'Exemplar Questions & Solutions' : (isDiagrams ? 'Diagram Based Questions & Analysis' : 'Complete Chapter Questions & Solutions')}
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-3 py-1 rounded-lg text-sm font-medium text-cyan-400 bg-cyan-500/20">
                                    <i className="fas fa-question-circle mr-2"></i>{questions.length} Questions
                                </span>
                                <span className="px-3 py-1 rounded-lg text-sm font-medium text-green-400 bg-green-500/20">
                                    <i className="fas fa-check-double mr-2"></i>{score.correct}/{score.total} Correct
                                </span>
                            </div>
                        </div>

                        {/* Question Progress Bar - Always Visible */}
                        <div className="w-full lg:w-72 bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Question Progress</span>
                                <span className="text-lg font-bold text-cyan-400">{currentQuestionIndex + 1}/{questions.length}</span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 text-center">
                                {submittedQuestions.size} answered · {score.correct} correct
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-6">
                    {questions.length === 0 ? (
                        <div className="text-center py-20 glass-panel rounded-xl border border-gray-700">
                            <i className="fas fa-clipboard-list text-gray-600 text-6xl mb-4"></i>
                            <p className="text-gray-400 text-lg">No questions available yet.</p>
                            <button
                                onClick={() => navigate(getBackPath())}
                                className="mt-4 px-6 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition border border-cyan-500/50"
                            >
                                Go back
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Current Question Display */}
                            {(() => {
                                const question = questions[currentQuestionIndex];
                                const index = currentQuestionIndex;
                                const isSubmitted = submittedQuestions.has(question._id);
                                const userAnswer = userAnswers[question._id];
                                const correct = isCorrect(question._id);
                                const isMCQ = question.questionType === 'MCQ' || (question.options && question.options.length > 0);

                                return (
                                    <div
                                        key={question._id}
                                        className={`glass-panel rounded-xl p-6 border transition-all duration-300 ${isSubmitted
                                            ? (correct ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5')
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
                                                            {isMCQ ? 'MCQ' : 'Subjective'}
                                                        </span>
                                                        {isSubmitted && (
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${correct ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'}`}>
                                                                <i className={`fas fa-${correct ? 'check' : 'times'} mr-1`}></i>
                                                                {correct ? 'Correct' : 'Incorrect'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Concept Name - Only show for line-by-line category */}
                                        {question.ncertLine && category === 'line-by-line' && (
                                            <div className="mb-4 p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded">
                                                <div className="text-xs text-blue-400 font-semibold mb-1 uppercase tracking-wide">
                                                    <i className="fas fa-lightbulb mr-2"></i>Concept Name
                                                </div>
                                                <p className="text-gray-300 text-sm italic">{question.ncertLine}</p>
                                            </div>
                                        )}

                                        {/* Question Text */}
                                        <div className="mb-4">
                                            <div
                                                className="text-lg text-white font-medium leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: question.question }}
                                            />
                                        </div>

                                        {/* Question Image */}
                                        {question.imageUrl && (
                                            <div className="mb-4">
                                                <img
                                                    src={question.imageUrl}
                                                    alt="Question"
                                                    className="max-w-full h-auto rounded-lg border border-gray-600"
                                                />
                                            </div>
                                        )}

                                        {/* MCQ Options */}
                                        {isMCQ && (
                                            <div className="mb-4 space-y-2">
                                                {question.options.map((option, optIndex) => {
                                                    const isSelected = userAnswer === option;
                                                    const isCorrectOption = option === question.correctAnswer;
                                                    const showCorrect = isSubmitted && isCorrectOption;
                                                    const showWrong = isSubmitted && isSelected && !isCorrectOption;

                                                    return (
                                                        <button
                                                            key={optIndex}
                                                            onClick={() => handleAnswerSelect(question._id, option)}
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
                                                                    {option}
                                                                </span>
                                                                {showCorrect && (
                                                                    <i className="fas fa-check-circle text-green-400"></i>
                                                                )}
                                                                {showWrong && (
                                                                    <i className="fas fa-times-circle text-red-400"></i>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        {isMCQ && !isSubmitted && (
                                            <div className="mb-6">
                                                <button
                                                    onClick={() => handleSubmitAnswer(question._id)}
                                                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition"
                                                >
                                                    Submit Answer
                                                </button>
                                            </div>
                                        )}

                                        {/* Feedback & Feedback Options */}
                                        {isSubmitted && (
                                            <div className="animate-fadeIn">
                                                <div className={`mb-6 p-3 rounded-lg border ${correct ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                                    {correct ?
                                                        <div className="flex items-center gap-2"><i className="fas fa-check-circle"></i> Correct Answer!</div> :
                                                        <div className="flex items-center gap-2"><i className="fas fa-times-circle"></i> Incorrect. Check solution below.</div>
                                                    }
                                                </div>

                                                {/* Flashcard Style Feedback + Retry */}
                                                <div className="mt-4 border-t border-gray-700 pt-4">
                                                    <p className="text-center text-gray-400 text-sm mb-3">Rate this question</p>
                                                    <div className="flex justify-center gap-3 flex-wrap">
                                                        {/* Retry Button - Only if Wrong */}
                                                        {!correct && (
                                                            <button onClick={() => handleRetry(question._id)} className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition flex items-center gap-2 border border-gray-600">
                                                                <i className="fas fa-redo"></i> Retry
                                                            </button>
                                                        )}

                                                        <button onClick={() => handleDifficultyRating('Hard')} className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition"><i className="fas fa-brain mr-2"></i>Hard</button>
                                                        <button onClick={() => handleDifficultyRating('Medium')} className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/20 transition"><i className="fas fa-balance-scale mr-2"></i>Medium</button>
                                                        <button onClick={() => handleDifficultyRating('Easy')} className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm hover:bg-green-500/20 transition"><i className="fas fa-bolt mr-2"></i>Easy</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Solution Toggle Button */}
                                        <div className="flex gap-3 mt-4">
                                            <button onClick={() => toggleSolution(question._id)} className="text-cyan-400 hover:text-cyan-300 text-sm"><i className="fas fa-check-double mr-1"></i> {showSolution[question._id] ? 'Hide Solution' : 'Solution'}</button>
                                            <button onClick={() => handleOpenErrorReport(question._id)} className="text-orange-400 hover:text-orange-300 text-sm"><i className="fas fa-flag mr-1"></i> Report Error</button>
                                        </div>

                                        {/* Solution Content */}
                                        {showSolution[question._id] && (
                                            <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg animate-fadeIn">
                                                <div className="text-cyan-400 font-bold text-xs mb-2">SOLUTION</div>
                                                {question.correctAnswer && <div className="mb-2 inline-block px-2 py-1 bg-cyan-900/50 rounded border border-cyan-500/30 text-xs text-cyan-200 font-bold">Answer: {question.correctAnswer}</div>}
                                                <div
                                                    className="text-gray-300 text-sm whitespace-pre-line"
                                                    dangerouslySetInnerHTML={{ __html: question.solution }}
                                                />
                                                {question.solutionImageUrl && (
                                                    <img
                                                        src={question.solutionImageUrl}
                                                        alt="Solution"
                                                        className="mt-3 max-w-full h-auto rounded-lg border border-gray-600"
                                                    />
                                                )}

                                                {/* Subjective Feedback Buttons */}
                                                {!isMCQ && !isSubmitted && (
                                                    <div className="mt-6 pt-4 border-t border-cyan-500/30">
                                                        <p className="text-center text-gray-400 text-sm mb-4">Did you get it right?</p>
                                                        <div className="flex justify-center gap-3 flex-wrap">
                                                            <button
                                                                onClick={() => handleRetry(question._id)}
                                                                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition flex items-center gap-2 border border-gray-600"
                                                            >
                                                                <i className="fas fa-redo"></i> Retry
                                                            </button>
                                                            <button onClick={() => handleSubjectiveRating(question._id, 'Hard')} className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition"><i className="fas fa-brain mr-2"></i>Hard</button>
                                                            <button onClick={() => handleSubjectiveRating(question._id, 'Medium')} className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/20 transition"><i className="fas fa-balance-scale mr-2"></i>Medium</button>
                                                            <button onClick={() => handleSubjectiveRating(question._id, 'Easy')} className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm hover:bg-green-500/20 transition"><i className="fas fa-bolt mr-2"></i>Easy</button>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        )}

                                    </div>
                                );
                            })()}
                        </>
                    )}
                </div>

                {/* Exit/Back Button - Bottom Navigation (Only on Last Question & Completed) */}
                {(() => {
                    if (questions.length === 0) return null;
                    const isLastQuestion = currentQuestionIndex === questions.length - 1;
                    const lastQId = questions[currentQuestionIndex]?._id;
                    const isCompleted = submittedQuestions.has(lastQId);

                    if (isLastQuestion && isCompleted) {
                        return (
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={() => navigate(getBackPath())}
                                    className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-cyan-500 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center gap-2"
                                >
                                    <i className="fas fa-door-open"></i>
                                    Exit {getLabel()}
                                </button>
                            </div>
                        );
                    }
                    return null;
                })()}

            </div>

            {/* Error Report Modal */}
            {showErrorReportModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl w-full max-w-lg border border-gray-700 p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white">Report Error</h3>
                            <button onClick={handleCloseErrorReport} className="text-gray-400 hover:text-white">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmitErrorReport} className="space-y-4">
                            {/* Error Type Selection */}
                            <div>
                                <label className="block text-gray-400 mb-2 font-medium">Error Type *</label>
                                <div className="space-y-2">
                                    {[
                                        'Wrong/Unclear Question',
                                        'Wrong/Unclear Option(s)',
                                        'Wrong/Blury/No Images(s)',
                                        'Incorrect Answer Key',
                                        'Wrong/Unclear Solution'
                                    ].map((type) => (
                                        <label key={type} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500/50 cursor-pointer transition">
                                            <input
                                                type="radio"
                                                name="errorType"
                                                value={type}
                                                checked={errorReportForm.errorType === type}
                                                onChange={(e) => setErrorReportForm({ ...errorReportForm, errorType: e.target.value })}
                                                className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
                                            />
                                            <span className="text-white">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div>
                                <label className="block text-gray-400 mb-2 font-medium">
                                    Please mention any additional details (Optional)
                                </label>
                                <textarea
                                    value={errorReportForm.additionalDetails}
                                    onChange={(e) => setErrorReportForm({ ...errorReportForm, additionalDetails: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white h-24 focus:border-cyan-500 focus:outline-none"
                                    placeholder="Describe the issue in detail..."
                                ></textarea>
                            </div>

                            {/* User Information */}
                            <div className="border-t border-gray-700 pt-4">
                                <h4 className="text-white font-semibold mb-3">Your Information</h4>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-gray-400 mb-1 text-sm">Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={errorReportForm.reporterName}
                                            onChange={(e) => setErrorReportForm({ ...errorReportForm, reporterName: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-1 text-sm">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={errorReportForm.reporterEmail}
                                            onChange={(e) => setErrorReportForm({ ...errorReportForm, reporterEmail: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-1 text-sm">Mobile Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={errorReportForm.reporterMobile}
                                            onChange={(e) => setErrorReportForm({ ...errorReportForm, reporterMobile: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
                                            placeholder="Enter your mobile number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseErrorReport}
                                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg shadow-lg hover:shadow-orange-500/50 transition"
                                >
                                    Submit Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NCERTQuestionViewer;
