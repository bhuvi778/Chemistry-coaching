import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { submitErrorReport } from '../services/pyqApi';

const PYQPractice = () => {
    const { examName, chapterId, topicId } = useParams();
    const navigate = useNavigate();

    // Data State
    const [questions, setQuestions] = useState([]);
    const [chapterName, setChapterName] = useState('');
    const [topicName, setTopicName] = useState('');

    // UI State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Interaction State
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: option }
    const [submittedAnswers, setSubmittedAnswers] = useState({}); // { [qId]: isCorrect }
    const [showSolution, setShowSolution] = useState({}); // { [qId]: boolean }
    const [showHint, setShowHint] = useState({}); // { [qId]: boolean }
    const [userAnswers, setUserAnswers] = useState({}); // { [qId]: string } (for numerical)

    // Error Report State
    const [showErrorReportModal, setShowErrorReportModal] = useState(false);
    const [reportingQuestionId, setReportingQuestionId] = useState(null);
    const [errorReportForm, setErrorReportForm] = useState({
        errorType: '',
        additionalDetails: '',
        reporterName: '',
        reporterEmail: '',
        reporterMobile: ''
    });

    useEffect(() => {
        loadData();
    }, [topicId]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const userId = localStorage.getItem('userId');

            // Load Topic/Chapter Info (Quick fetch or derive)
            // We can fetch questions and basic info
            const questionsRes = await axios.get(`${API_BASE_URL}/pyq/questions`, {
                params: { topicId, isActive: true }
            });

            const qData = questionsRes.data;
            setQuestions(qData);

            try {
                const topicsRes = await axios.get(`${API_BASE_URL}/pyq/topics/chapter/${chapterId}`);
                const currentTopic = topicsRes.data.find(t => t._id === topicId);
                if (currentTopic) {
                    setTopicName(currentTopic.topicName);
                    setChapterName(currentTopic.chapterName || 'Chapter'); // If available
                }
            } catch (e) {
                console.warn("Could not fetch topic details", e);
            }

        } catch (err) {
            console.error('Error loading questions:', err);
            setError('Failed to load questions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Modified to match NCERT logic: Auto-advance on rating
    const handleDifficultyRating = (difficulty) => {
        // Here we could save the rating to backend if API supported it
        // console.log(`Question rated as: ${difficulty}`);

        // Check if this is the last question
        if (currentIndex === questions.length - 1) {
            const score = getScore();
            toast.success(`🎉 Completed! Score: ${score.correct}/${Object.keys(submittedAnswers).length}`);
        } else {
            handleNext();
        }
    };

    const handleOptionSelect = (qId, option) => {
        if (submittedAnswers[qId]) return;
        setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
    };

    const handleNumericalChange = (qId, value) => {
        if (submittedAnswers[qId]) return;
        setUserAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const handleSubmitAnswer = async (qId, correctAnswer, type) => {
        let isCorrect = false;
        let userAnswer = '';
        if (type === 'Numerical') {
            userAnswer = userAnswers[qId]?.trim() || '';
            const correctVal = correctAnswer?.trim().toLowerCase();
            if (userAnswer.toLowerCase() === correctVal) isCorrect = true;
        } else {
            // MCQ
            userAnswer = selectedAnswers[qId] || '';
            if (!userAnswer) return;
            if (userAnswer === correctAnswer) isCorrect = true;
        }

        setSubmittedAnswers(prev => ({ ...prev, [qId]: isCorrect }));

        // Save progress to backend
        try {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                await axios.post(`${API_BASE_URL}/pyq/progress`, {
                    userId,
                    questionId: qId,
                    chapterId,
                    topicId,
                    status: isCorrect ? 'Correct' : 'Incorrect',
                    userAnswer,
                    timeSpent: 0
                });
            }
        } catch (err) {
            // Silent fail - progress tracking shouldn't block question flow
            console.warn('Progress save failed:', err.message);
        }

        if (!isCorrect) {
            // Optional: auto-show solution?
        }
    };

    const toggleSolution = (qId) => {
        setShowSolution(prev => ({ ...prev, [qId]: !prev[qId] }));
    };

    const toggleHint = (qId) => {
        setShowHint(prev => ({ ...prev, [qId]: !prev[qId] }));
    };

    const handleRetry = (qId) => {
        setSubmittedAnswers(prev => {
            const newState = { ...prev };
            delete newState[qId];
            return newState;
        });
        setShowSolution(prev => ({ ...prev, [qId]: false }));
        setSelectedAnswers(prev => {
            const newState = { ...prev };
            delete newState[qId];
            return newState;
        });
        setUserAnswers(prev => {
            const newState = { ...prev };
            delete newState[qId];
            return newState;
        });
    };

    // Helper to get score
    const getScore = () => {
        let correct = 0;
        let total = 0;
        Object.keys(submittedAnswers).forEach(key => {
            total++;
            if (submittedAnswers[key]) correct++;
        });
        return { correct, total };
    };

    const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n');
        return tmp.textContent || tmp.innerText || "";
    };

    // Error Report Handlers
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

    const handleErrorReportSubmit = async (e) => {
        e.preventDefault();

        if (!errorReportForm.errorType) {
            toast.error('Please select an error type');
            return;
        }

        try {
            setLoading(true);
            await submitErrorReport({
                questionId: reportingQuestionId,
                errorType: errorReportForm.errorType,
                additionalDetails: errorReportForm.additionalDetails,
                reporterName: errorReportForm.reporterName,
                reporterEmail: errorReportForm.reporterEmail,
                reporterMobile: errorReportForm.reporterMobile
            });

            toast.success('Error report submitted successfully! Thank you for your feedback.');
            handleCloseErrorReport();
        } catch (error) {
            console.error('Failed to submit error report:', error);
            toast.error('Failed to submit error report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center relative z-10">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400">Loading questions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-32 pb-20 relative z-10">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/10 text-center">
                        <i className="fas fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
                        <p className="text-red-400 text-lg mb-4">{error}</p>
                        <button onClick={loadData} className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition border border-red-500/50">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 relative z-10">
                <div className="max-w-4xl mx-auto px-4">
                    <button onClick={() => navigate(`/pyq/${examName}/chapters/${chapterId}`)} className="text-gray-400 hover:text-cyan-400 transition mb-6 flex items-center gap-2">
                        <i className="fas fa-arrow-left"></i><span>Back to Topics</span>
                    </button>
                    <div className="glass-panel rounded-xl p-12 border border-gray-700 text-center">
                        <i className="fas fa-question-circle text-gray-600 text-6xl mb-4"></i>
                        <p className="text-gray-400 text-lg">No questions available yet.</p>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const isSubmitted = submittedAnswers.hasOwnProperty(currentQuestion._id);
    const isCorrectAnswer = isSubmitted && submittedAnswers[currentQuestion._id];
    const isMCQ = currentQuestion.questionType !== 'Numerical';

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/pyq/${examName}/chapters/${chapterId}`)}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-6"
                >
                    <i className="fas fa-chevron-left"></i>
                    <span>Back to Topic List</span>
                </button>

                {/* Header */}
                <div className="glass-panel rounded-2xl p-8 mb-8 border border-gray-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
                        <i className="fas fa-history"></i>
                        <span>PYQ Practice</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="text-sm text-gray-400 mb-2">{chapterName || 'Chapter'}</div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{topicName || 'Topic Practice'}</h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-3 py-1 rounded-lg text-sm font-medium text-cyan-400 bg-cyan-500/20"><i className="fas fa-question-circle mr-2"></i>{questions.length} Questions</span>
                            </div>
                        </div>
                        {/* Question Progress Bar */}
                        <div className="w-full lg:w-72 bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Question Progress</span>
                                <span className="text-lg font-bold text-cyan-400">{currentIndex + 1}/{questions.length}</span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 text-center">
                                {Object.keys(submittedAnswers).length} answered · {getScore().correct} correct
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="space-y-6">
                    <div className={`glass-panel rounded-xl p-6 border transition-all duration-300 ${isSubmitted
                        ? (isCorrectAnswer ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5')
                        : 'border-gray-700 hover:border-cyan-500/50'
                        }`}>

                        {/* Question Header: Badges */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-cyan-400 font-bold">Q{currentIndex + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="px-2 py-1 rounded text-xs font-medium text-purple-400 bg-purple-500/20">
                                            {currentQuestion.questionType}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${currentQuestion.difficulty === 'Easy' ? 'text-green-400 bg-green-500/20 border-green-500/50' :
                                            currentQuestion.difficulty === 'Medium' ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50' :
                                                'text-red-400 bg-red-500/20 border-red-500/50'
                                            }`}>
                                            {currentQuestion.difficulty}
                                        </span>
                                        {currentQuestion.yearBadge && (
                                            <span className="px-2 py-1 rounded text-xs font-medium text-blue-400 bg-blue-500/20">
                                                {currentQuestion.yearBadge}
                                            </span>
                                        )}
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
                                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                            />
                            {currentQuestion.questionImage && (
                                <img
                                    src={currentQuestion.questionImage}
                                    alt="Question Visual"
                                    className="mt-4 max-w-full rounded-lg border border-gray-700"
                                />
                            )}
                        </div>

                        {/* MCQ Options */}
                        {isMCQ && currentQuestion.options && (
                            <div className="mb-6 space-y-2">
                                {currentQuestion.options.map((option, idx) => {
                                    const optionLetter = String.fromCharCode(65 + idx);
                                    const isSelected = selectedAnswers[currentQuestion._id] === optionLetter;
                                    const isCorrectOption = optionLetter === currentQuestion.correctAnswer;
                                    const showCorrect = isSubmitted && isCorrectOption;
                                    const showWrong = isSubmitted && isSelected && !isCorrectOption;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => !isSubmitted && handleOptionSelect(currentQuestion._id, optionLetter)}
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
                                                    ? (showCorrect ? 'border-green-500 bg-green-500' : (showWrong ? 'border-red-500 bg-red-500' : 'border-gray-600'))
                                                    : (isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-gray-600')
                                                    }`}>
                                                    {(isSelected || showCorrect) && (
                                                        <i className={`fas fa-${showCorrect ? 'check' : (showWrong ? 'times' : 'check')} text-white text-xs`}></i>
                                                    )}
                                                </div>
                                                <div className={`flex-1 ${isSubmitted
                                                    ? (showCorrect ? 'text-green-400' : (showWrong ? 'text-red-400' : 'text-gray-400'))
                                                    : (isSelected ? 'text-cyan-400' : 'text-gray-300')
                                                    }`}>
                                                    <span className="font-semibold mr-2">{optionLetter}.</span>
                                                    <span dangerouslySetInnerHTML={{ __html: option }} />
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Numerical Input */}
                        {!isMCQ && (
                            <div className="mb-6">
                                <input
                                    type="text"
                                    value={userAnswers[currentQuestion._id] || ''}
                                    onChange={(e) => handleNumericalChange(currentQuestion._id, e.target.value)}
                                    disabled={isSubmitted}
                                    placeholder="Enter your numerical answer"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition"
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        {!isSubmitted && (
                            <button
                                onClick={() => handleSubmitAnswer(currentQuestion._id, currentQuestion.correctAnswer, currentQuestion.questionType)}
                                disabled={isMCQ ? !selectedAnswers[currentQuestion._id] : !userAnswers[currentQuestion._id]}
                                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-cyan-500/20"
                            >
                                Submit Answer
                            </button>
                        )}

                        {/* Feedback & Actions */}
                        {isSubmitted && (
                            <div className="animate-fadeIn mt-6">
                                <div className={`mb-6 p-3 rounded-lg border ${isCorrectAnswer ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                    {isCorrectAnswer ?
                                        <div className="flex items-center gap-2"><i className="fas fa-check-circle"></i> Correct Answer!</div> :
                                        <div className="flex items-center gap-2"><i className="fas fa-times-circle"></i> Incorrect. Check solution below.</div>
                                    }
                                </div>

                                {/* Rating / Next Navigation - REPLACED BOTTOM NAV */}
                                <div className="border-t border-gray-700 pt-4">
                                    <p className="text-center text-gray-400 text-sm mb-3">Rate this question to continue</p>
                                    <div className="flex justify-center gap-3 flex-wrap">
                                        {!isCorrectAnswer && (
                                            <button onClick={() => handleRetry(currentQuestion._id)} className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition flex items-center gap-2 border border-gray-600">
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

                        {/* Hint Button - Always visible */}
                        {currentQuestion.hint && (
                            <div className="mt-4">
                                <button
                                    onClick={() => toggleHint(currentQuestion._id)}
                                    className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center gap-1"
                                >
                                    <i className="fas fa-lightbulb"></i>
                                    {showHint[currentQuestion._id] ? 'Hide Hint' : 'Show Hint'}
                                </button>
                                {showHint[currentQuestion._id] && (
                                    <div className="mt-2 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                        <div className="text-yellow-400 font-bold text-xs mb-1 uppercase tracking-wide">💡 Hint</div>
                                        <div
                                            className="text-yellow-200 text-sm leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: currentQuestion.hint }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Solution + Report Error — only shown after submitting */}
                        {isSubmitted && (
                            <div className="mt-4 flex gap-3">
                                <button onClick={() => toggleSolution(currentQuestion._id)} className="text-cyan-400 hover:text-cyan-300 text-sm">
                                    <i className="fas fa-check-double mr-1"></i> {showSolution[currentQuestion._id] ? 'Hide Solution' : 'Show Solution'}
                                </button>
                                <button
                                    onClick={() => handleOpenErrorReport(currentQuestion._id)}
                                    className="text-orange-400 hover:text-orange-300 text-sm"
                                >
                                    <i className="fas fa-flag mr-1"></i> Report Error
                                </button>
                            </div>
                        )}

                        {/* Report Error button for unanswered questions too */}
                        {!isSubmitted && (
                            <div className="mt-4">
                                <button
                                    onClick={() => handleOpenErrorReport(currentQuestion._id)}
                                    className="text-orange-400 hover:text-orange-300 text-sm"
                                >
                                    <i className="fas fa-flag mr-1"></i> Report Error
                                </button>
                            </div>
                        )}

                        {/* Solution */}
                        {showSolution[currentQuestion._id] && (
                            <div className="mt-4 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                                <div className="text-cyan-400 font-bold text-xs mb-2 uppercase tracking-wide">Solution</div>
                                {currentQuestion.correctAnswer && (
                                    <div className="mb-4 inline-block px-3 py-1 bg-cyan-900/50 rounded border border-cyan-500/30 text-sm text-cyan-200 font-bold">
                                        Answer: {currentQuestion.correctAnswer}
                                    </div>
                                )}
                                <div className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                                    <div dangerouslySetInnerHTML={{ __html: currentQuestion.solution }} />
                                </div>
                                {currentQuestion.solutionImage && (
                                    <img
                                        src={currentQuestion.solutionImage}
                                        alt="Solution Visual"
                                        className="mt-4 max-w-full rounded-lg border border-gray-700"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Exit Button (Bottom) - Only on Last Question & Completed */}
                    {currentIndex === questions.length - 1 && isSubmitted && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => navigate(`/pyq/${examName}/chapters/${chapterId}`)}
                                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-cyan-500 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center gap-2"
                            >
                                <i className="fas fa-door-open"></i>
                                Exit Topic
                            </button>
                        </div>
                    )}
                </div>

                {/* Error Report Modal */}
                {showErrorReportModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-gray-900 rounded-xl w-full max-w-2xl border border-gray-700 p-6 my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <i className="fas fa-flag text-orange-400"></i>
                                    Report Error
                                </h3>
                                <button
                                    onClick={handleCloseErrorReport}
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>

                            <form onSubmit={handleErrorReportSubmit} className="space-y-4">
                                {/* Error Type Selection */}
                                <div>
                                    <label className="block text-gray-400 mb-2 font-medium">
                                        Error Type <span className="text-red-400">*</span>
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            'Wrong/Unclear Question',
                                            'Wrong/Unclear Option(s)',
                                            'Wrong/Blury/No Images(s)',
                                            'Incorrect Answer Key',
                                            'Wrong/Unclear Solution'
                                        ].map((type) => (
                                            <label
                                                key={type}
                                                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${errorReportForm.errorType === type
                                                    ? 'border-orange-500 bg-orange-500/10'
                                                    : 'border-gray-700 bg-gray-800/30 hover:border-orange-500/50'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="errorType"
                                                    value={type}
                                                    checked={errorReportForm.errorType === type}
                                                    onChange={(e) => setErrorReportForm({ ...errorReportForm, errorType: e.target.value })}
                                                    className="w-5 h-5 text-orange-500 focus:ring-orange-500 focus:ring-2"
                                                />
                                                <span className={`flex-1 ${errorReportForm.errorType === type ? 'text-orange-400 font-medium' : 'text-gray-300'
                                                    }`}>
                                                    {type}
                                                </span>
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
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500 transition"
                                        rows="4"
                                        placeholder="Describe the error in detail..."
                                    ></textarea>
                                </div>

                                {/* Contact Information */}
                                <div className="border-t border-gray-700 pt-4">
                                    <h4 className="text-white font-semibold mb-4">Contact Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-gray-400 mb-1 text-sm">
                                                Name <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={errorReportForm.reporterName}
                                                onChange={(e) => setErrorReportForm({ ...errorReportForm, reporterName: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500 transition"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-1 text-sm">
                                                Email <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={errorReportForm.reporterEmail}
                                                onChange={(e) => setErrorReportForm({ ...errorReportForm, reporterEmail: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500 transition"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-1 text-sm">
                                                Mobile Number <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={errorReportForm.reporterMobile}
                                                onChange={(e) => setErrorReportForm({ ...errorReportForm, reporterMobile: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500 transition"
                                                placeholder="+91 XXXXX XXXXX"
                                                pattern="[0-9\+\s-]+"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                                    <button
                                        type="button"
                                        onClick={handleCloseErrorReport}
                                        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg shadow-lg hover:shadow-orange-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane mr-2"></i>
                                                Submit Report
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PYQPractice;
