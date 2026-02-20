import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchNCERTChapter, fetchNCERTTopic, fetchNCERTQuestions, saveNCERTProgress, fetchNCERTProgress, submitErrorReport } from '../services/ncertApi';
import { toast } from 'react-hot-toast';

const NCERTLineByLineTopic = () => {
    const { chapterId, topicId } = useParams();
    const navigate = useNavigate();

    const [chapter, setChapter] = useState(null);
    const [topic, setTopic] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showSolution, setShowSolution] = useState({});
    const [completedQuestions, setCompletedQuestions] = useState(new Set());

    // New state for user interactivity
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: 'OptionString' }
    const [submittedAnswers, setSubmittedAnswers] = useState({}); // { [questionId]: true/false (result) }

    // Current question index for one-by-one display
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [filterDifficulty, setFilterDifficulty] = useState('all');
    const [filterType, setFilterType] = useState('all');

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
    }, [chapterId, topicId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId');

            const [chapterData, topicData, questionsData, userProgress] = await Promise.all([
                fetchNCERTChapter(chapterId),
                fetchNCERTTopic(topicId),
                fetchNCERTQuestions({ chapterId, topicId, category: 'line-by-line' }),
                userId ? fetchNCERTProgress(userId) : Promise.resolve([])
            ]);

            setChapter(chapterData);
            setTopic(topicData);
            setQuestions(questionsData);

            // Hydrate progress
            if (userProgress && Array.isArray(userProgress)) {
                const topicProgress = userProgress.filter(p => p.topicId === topicId);
                const completeSet = new Set();
                const submittedMap = {};
                topicProgress.forEach(p => {
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
        } finally {
            setLoading(false);
        }
    };

    // Filter questions
    const filteredQuestions = questions.filter(q => {
        if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;
        if (filterType !== 'all' && q.questionType !== filterType) return false;
        return true;
    });

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-400 bg-green-500/20 border-green-500/50';
            case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
            case 'Hard': return 'text-red-400 bg-red-500/20 border-red-500/50';
            default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Conceptual': return 'text-blue-400 bg-blue-500/20';
            case 'Numerical': return 'text-purple-400 bg-purple-500/20';
            case 'Derivation': return 'text-pink-400 bg-pink-500/20';
            case 'Diagram-based': return 'text-cyan-400 bg-cyan-500/20';
            case 'Comparison': return 'text-orange-400 bg-orange-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
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
        if (submittedAnswers[qId]) return; // Prevent changing answer after submit
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
        if (currentQuestionIndex < filteredQuestions.length - 1) {
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

    const handleDifficultyRating = (difficulty) => {
        console.log(`Question rated as: ${difficulty}`);

        // Check if this is the last question
        if (currentQuestionIndex === filteredQuestions.length - 1) {
            setTimeout(() => {
                const score = getScore();
                alert(`🎉 Congratulations! You've completed all ${filteredQuestions.length} questions!\n\nScore: ${score.correct}/${score.total} correct`);
            }, 300);
        } else {
            handleNextQuestion();
        }
    };


    const handleSubmitAnswer = async (qId, correctAnswer) => {
        if (!selectedAnswers[qId] || submittedAnswers[qId]) return;

        const isCorrect = selectedAnswers[qId] === correctAnswer;

        // 1. Update UI state
        setSubmittedAnswers(prev => ({ ...prev, [qId]: isCorrect }));

        if (isCorrect) {
            markAsCompletedLocal(qId);
        } else {
            // Automatically show solution if wrong? Maybe not, let user decide.
        }

        // 2. Save to Backend
        try {
            const userId = localStorage.getItem('userId') || 'guest';
            await saveNCERTProgress({
                userId,
                questionId: qId,
                chapterId,
                topicId,
                isCorrect
            });
        } catch (error) {
            console.error('Failed to save progress', error);
        }
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

    // Error Report Handlers
    const openErrorReportModal = (questionId) => {
        setReportingQuestionId(questionId);
        setShowErrorReportModal(true);
    };

    const closeErrorReportModal = () => {
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
            closeErrorReportModal();
        } catch (error) {
            console.error('Failed to submit error report:', error);
            toast.error('Failed to submit error report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const progress = Math.round((completedQuestions.size / (questions.length || 1)) * 100);

    const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n');
        return tmp.textContent || tmp.innerText || "";
    };

    // ===================================
    // RENDER
    // ===================================

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400">Loading topic...</p>
                </div>
            </div>
        );
    }

    if (!topic || !chapter) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-exclamation-triangle text-yellow-500 text-6xl mb-4"></i>
                    <p className="text-gray-400 text-lg">Topic not found</p>
                    <button onClick={() => navigate(`/ncert-toolbox/line-by-line/${chapterId}`)} className="text-cyan-400 hover:underline mt-4 inline-block">
                        Back to Topics
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/ncert-toolbox/line-by-line/${chapterId}`)}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-6"
                >
                    <i className="fas fa-chevron-left"></i>
                    <span>Back to {chapter.name}</span>
                </button>

                {/* Header */}
                <div className="glass-panel rounded-2xl p-8 mb-8 border border-gray-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
                        <i className="fas fa-list-ol"></i>
                        <span>NCERT Line by Line</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="text-sm text-gray-400 mb-2">{chapter.chapterNumber} - {chapter.name}</div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{topic.name}</h1>
                            <p className="text-gray-300 mb-4 text-lg">{topic.description || chapter.description}</p>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-3 py-1 rounded-lg text-sm font-medium text-cyan-400 bg-cyan-500/20"><i className="fas fa-question-circle mr-2"></i>{questions.length} Questions</span>
                                <span className="px-3 py-1 rounded-lg text-sm font-medium text-pink-400 bg-pink-500/20"><i className="fas fa-check-circle mr-2"></i>{completedQuestions.size} Completed</span>
                            </div>
                        </div>
                        {/* Question Progress Bar - Always Visible */}
                        <div className="w-full lg:w-72 bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Question Progress</span>
                                <span className="text-lg font-bold text-cyan-400">{currentQuestionIndex + 1}/{filteredQuestions.length}</span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                                    style={{ width: `${((currentQuestionIndex + 1) / (filteredQuestions.length || 1)) * 100}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 text-center">
                                {Object.keys(submittedAnswers).length} answered · {getScore().correct} correct
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="ml-auto text-sm text-gray-400">{filteredQuestions.length} Questions</div>
                </div>

                {/* Questions List */}
                <div className="space-y-6">
                    {(() => {
                        const question = filteredQuestions[currentQuestionIndex];
                        const index = currentQuestionIndex;

                        if (!question) return null;

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
                                                    {isMCQ ? 'MCQ' : 'Subjective'}
                                                </span>
                                                {question.marks && (
                                                    <span className="px-2 py-1 rounded text-xs font-medium text-gray-400 bg-gray-500/20">
                                                        {question.marks} Marks
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

                                {/* Concept and Paraname */}
                                {(question.concept || question.paraname) && (
                                    <div className="mb-4 space-y-2">
                                        {question.concept && (
                                            <div className="p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded">
                                                <div className="text-xs text-blue-400 font-semibold mb-1 uppercase tracking-wide">
                                                    <i className="fas fa-lightbulb mr-2"></i>Concept
                                                </div>
                                                <p className="text-gray-300 text-sm">{question.concept}</p>
                                            </div>
                                        )}
                                        {question.paraname && (
                                            <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded">
                                                <div className="text-xs text-purple-400 font-semibold mb-1 uppercase tracking-wide">
                                                    <i className="fas fa-bookmark mr-2"></i>Reference / Paragraph
                                                </div>
                                                <p className="text-gray-300 text-sm">{question.paraname}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

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

                                {/* Feedback & Feedback Options */}
                                {isSubmitted && (
                                    <div className="animate-fadeIn">
                                        <div className={`mb-6 p-3 rounded-lg border ${isCorrectAnswer ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                            {isCorrectAnswer ?
                                                <div className="flex items-center gap-2"><i className="fas fa-check-circle"></i> Correct Answer!</div> :
                                                <div className="flex items-center gap-2"><i className="fas fa-times-circle"></i> Incorrect. Check solution below.</div>
                                            }
                                        </div>

                                        {/* Flashcard Style Feedback + Retry */}
                                        <div className="mt-4 border-t border-gray-700 pt-4">
                                            <p className="text-center text-gray-400 text-sm mb-3">Rate this question</p>
                                            <div className="flex justify-center gap-3 flex-wrap">
                                                {/* Retry Button - Only if Wrong */}
                                                {!isCorrectAnswer && (
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
                                    <button onClick={() => toggleSolution(question._id)} className="text-cyan-400 hover:text-cyan-300 text-sm"><i className="fas fa-check-double mr-1"></i> Solution</button>
                                    <button
                                        onClick={() => openErrorReportModal(question._id)}
                                        className="text-orange-400 hover:text-orange-300 text-sm"
                                    >
                                        <i className="fas fa-flag mr-1"></i> Report Error
                                    </button>
                                </div>

                                {/* Solution Content */}
                                {showSolution[question._id] && (
                                    <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                                        <div className="text-cyan-400 font-bold text-xs mb-2">SOLUTION</div>
                                        {question.correctAnswer && <div className="mb-2 inline-block px-2 py-1 bg-cyan-900/50 rounded border border-cyan-500/30 text-xs text-cyan-200 font-bold">Answer: {stripHtml(question.correctAnswer)}</div>}
                                        <div className="text-gray-300 text-sm whitespace-pre-line">
                                            {stripHtml(question.solution)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>

                {/* Exit Button - Bottom Navigation */}
                {currentQuestionIndex === filteredQuestions.length - 1 && submittedAnswers.hasOwnProperty(filteredQuestions[currentQuestionIndex]?._id) && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => navigate(`/ncert-toolbox/line-by-line/${chapterId}`)}
                            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-cyan-500 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center gap-2"
                        >
                            <i className="fas fa-door-open"></i>
                            Exit Topic
                        </button>
                    </div>
                )}

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
                                    onClick={closeErrorReportModal}
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
                                        onClick={closeErrorReportModal}
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

export default NCERTLineByLineTopic;
