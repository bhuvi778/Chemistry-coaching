import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../services/ntaAbhyasApi';
import { submitErrorReport } from '../services/ncertApi';
import { toast } from 'react-hot-toast';

const NTAAbhyasQuestions = () => {
    const { examCategory, chapter } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // User answers and submission state
    const [userAnswers, setUserAnswers] = useState({});
    const [submittedQuestions, setSubmittedQuestions] = useState(new Set());
    const [showSolution, setShowSolution] = useState({});
    const [showHint, setShowHint] = useState({});

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

    // Current question index for one-by-one display
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        loadData();
    }, [examCategory, chapter]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const questionsRes = await fetchQuestions(examCategory, decodeURIComponent(chapter));
            setQuestions(questionsRes || []);
        } catch (err) {
            console.error('Failed to load questions:', err);
            setError('Failed to load questions. Please try again.');
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

    const toggleHint = (qId) => {
        setShowHint(prev => ({ ...prev, [qId]: !prev[qId] }));
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
        // Hide solution and hint
        setShowSolution(prev => ({ ...prev, [qId]: false }));
        setShowHint(prev => ({ ...prev, [qId]: false }));
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
        return question && userAnswers[questionId] === question.correctAnswer;
    };

    const getScore = () => {
        let correct = 0;
        submittedQuestions.forEach(qId => {
            if (isCorrect(qId)) correct++;
        });
        return { correct, total: submittedQuestions.size, percentage: submittedQuestions.size > 0 ? Math.round((correct / submittedQuestions.size) * 100) : 0 };
    };

    const score = getScore();

    const getExamInfo = () => {
        if (examCategory === 'JEE') {
            return {
                name: 'JEE',
                icon: 'fa-atom',
                color: 'from-blue-500 to-cyan-500',
                textColor: 'text-blue-400',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/30'
            };
        } else {
            return {
                name: 'NEET',
                icon: 'fa-microscope',
                color: 'from-green-500 to-emerald-500',
                textColor: 'text-green-400',
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/30'
            };
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-400 bg-green-500/20 border-green-500/50';
            case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
            case 'Hard': return 'text-red-400 bg-red-500/20 border-red-500/50';
            default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
        }
    };

    const examInfo = getExamInfo();

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
                        <button
                            onClick={loadData}
                            className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition border border-red-500/50"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/ncert-toolbox/nta-abhyas/${examCategory}`)}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-6"
                >
                    <i className="fas fa-chevron-left"></i>
                    <span>Back to Chapters</span>
                </button>

                {/* Header */}
                <div className="glass-panel rounded-2xl p-8 mb-8 border border-gray-700">
                    {/* Tag */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 border ${examInfo.bgColor} ${examInfo.borderColor} ${examInfo.textColor}`}>
                        <i className={`fas ${examInfo.icon}`}></i>
                        <span>NTA Abhyas - {examInfo.name}</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                {decodeURIComponent(chapter)}
                            </h1>
                            <p className="text-gray-300 mb-4 text-lg">
                                Practice questions for {examInfo.name} preparation
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
                                onClick={() => navigate(`/ncert-toolbox/nta-abhyas/${examCategory}`)}
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
                                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
                                                            {question.difficulty || 'Medium'}
                                                        </span>
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

                                        {/* NCERT Line Reference */}
                                        {question.ncertLine && (
                                            <div className="mb-4 p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded">
                                                <div className="text-xs text-blue-400 font-semibold mb-1 uppercase tracking-wide">
                                                    <i className="fas fa-book-open mr-2"></i>NCERT Reference
                                                </div>
                                                <p className="text-gray-300 text-sm italic">{question.ncertLine}</p>
                                            </div>
                                        )}

                                        {/* Question Text */}
                                        <div className="mb-4">
                                            <h3 className="text-lg text-white font-medium leading-relaxed">
                                                {question.question}
                                            </h3>
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
                                                <div className={`mb-6 p-3 rounded-lg border ${isCorrect(question._id) ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                                    {isCorrect(question._id) ?
                                                        <div className="flex items-center gap-2"><i className="fas fa-check-circle"></i> Correct Answer!</div> :
                                                        <div className="flex items-center gap-2"><i className="fas fa-times-circle"></i> Incorrect. Check solution below.</div>
                                                    }
                                                </div>

                                                {/* Flashcard Style Feedback + Retry */}
                                                <div className="mt-4 border-t border-gray-700 pt-4">
                                                    <p className="text-center text-gray-400 text-sm mb-3">Rate this question</p>
                                                    <div className="flex justify-center gap-3 flex-wrap">
                                                        {/* Retry Button - Only if Wrong */}
                                                        {!isCorrect(question._id) && (
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

                                        {/* Solution & Hint Toggle Buttons */}
                                        <div className="flex gap-3 mt-4">
                                            <button onClick={() => toggleHint(question._id)} className="text-yellow-400 hover:text-yellow-300 text-sm"><i className="fas fa-lightbulb mr-1"></i> Hint</button>
                                            <button onClick={() => toggleSolution(question._id)} className="text-cyan-400 hover:text-cyan-300 text-sm"><i className="fas fa-check-double mr-1"></i> Solution</button>
                                            <button onClick={() => handleOpenErrorReport(question._id)} className="text-orange-400 hover:text-orange-300 text-sm"><i className="fas fa-flag mr-1"></i> Report Error</button>
                                        </div>

                                        {/* Hint Content */}
                                        {showHint[question._id] && (
                                            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                                <div className="text-yellow-400 font-bold text-xs mb-1">HINT</div>
                                                <p className="text-gray-300 text-sm">{question.hint || 'No hint available for this question.'}</p>
                                            </div>
                                        )}

                                        {/* Solution Content */}
                                        {showSolution[question._id] && (
                                            <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                                                <div className="text-cyan-400 font-bold text-xs mb-2">SOLUTION</div>
                                                {question.correctAnswer && <div className="mb-2 inline-block px-2 py-1 bg-cyan-900/50 rounded border border-cyan-500/30 text-xs text-cyan-200 font-bold">Answer: {question.correctAnswer}</div>}
                                                <p className="text-gray-300 text-sm whitespace-pre-line">{question.solution}</p>
                                                {question.solutionImageUrl && (
                                                    <img
                                                        src={question.solutionImageUrl}
                                                        alt="Solution"
                                                        className="mt-3 max-w-full h-auto rounded-lg border border-gray-600"
                                                    />
                                                )}
                                            </div>
                                        )}

                                    </div>
                                );
                            })()}
                        </>
                    )}
                </div>
            </div>

            {/* Error Report Modal */}
            {showErrorReportModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl w-full max-w-lg border border-gray-700 p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                <i className="fas fa-flag text-orange-400"></i>
                                Report Error
                            </h3>
                            <button onClick={handleCloseErrorReport} className="text-gray-400 hover:text-white transition">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmitErrorReport} className="space-y-4">
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
                                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg shadow-lg hover:shadow-orange-500/50 transition"
                                >
                                    <i className="fas fa-paper-plane mr-2"></i>
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

export default NTAAbhyasQuestions;
