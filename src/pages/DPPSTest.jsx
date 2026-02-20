import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDPPSChapter, startDPPSTest, fetchDPPSTestSession, saveDPPSTestAnswer, submitDPPSTest } from '../services/dppsApi';
import { toast } from 'react-hot-toast';

const DPPSTest = () => {
    const { chapterId } = useParams();
    const navigate = useNavigate();

    const [chapter, setChapter] = useState(null);
    const [testSession, setTestSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [testStarted, setTestStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const timerRef = useRef(null);
    const questionStartTimeRef = useRef(null);

    useEffect(() => {
        loadChapter();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [chapterId]);

    useEffect(() => {
        if (testStarted && testSession) {
            startTimer();
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [testStarted, testSession]);

    const loadChapter = async () => {
        try {
            setLoading(true);
            const chapterData = await fetchDPPSChapter(chapterId);
            setChapter(chapterData);
        } catch (error) {
            console.error('Failed to load chapter:', error);
            toast.error('Failed to load test details');
        } finally {
            setLoading(false);
        }
    };

    const handleStartTest = async () => {
        try {
            let userId = localStorage.getItem('userId');
            if (!userId) {
                // Auto-generate userId instead of redirecting to login
                userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
                localStorage.setItem('userId', userId);
            }

            setLoading(true);
            const session = await startDPPSTest(userId, chapterId);
            setTestSession(session);
            setTimeRemaining(session.timeLimit * 60); // Convert minutes to seconds
            setTestStarted(true);
            questionStartTimeRef.current = Date.now();
            toast.success('Test started! Good luck!');
        } catch (error) {
            console.error('Failed to start test:', error);
            const errMsg = error.response?.data?.error || 'Failed to start test';
            if (errMsg.includes('No questions')) {
                toast.error('This chapter has no questions yet. Please check back later!');
            } else {
                toast.error(errMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    const startTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleAutoSubmit = async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        toast.error('Time\'s up! Test auto-submitted.');
        await handleSubmit(true);
    };

    const handleAnswerSelect = async (questionId, answer) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));

        // Calculate time spent on this question
        const timeSpent = questionStartTimeRef.current
            ? Math.floor((Date.now() - questionStartTimeRef.current) / 1000)
            : 0;

        try {
            await saveDPPSTestAnswer(testSession._id, questionId, answer, timeSpent);
        } catch (error) {
            console.error('Failed to save answer:', error);
            if (error.response?.data?.error === 'Test time has expired') {
                handleAutoSubmit();
            }
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < testSession.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            questionStartTimeRef.current = Date.now();
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            questionStartTimeRef.current = Date.now();
        }
    };

    const handleQuestionJump = (index) => {
        setCurrentQuestionIndex(index);
        questionStartTimeRef.current = Date.now();
    };

    const handleSubmit = async (isAutoSubmit = false) => {
        if (!isAutoSubmit) {
            const confirmed = window.confirm('Are you sure you want to submit the test? You cannot change your answers after submission.');
            if (!confirmed) return;
        }

        try {
            setSubmitting(true);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            const result = await submitDPPSTest(testSession._id, isAutoSubmit);
            toast.success('Test submitted successfully!');
            navigate(`/dpps/results/${testSession._id}`);
        } catch (error) {
            console.error('Failed to submit test:', error);
            toast.error('Failed to submit test');
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        const totalSeconds = testSession?.timeLimit * 60 || 3600;
        const percentage = (timeRemaining / totalSeconds) * 100;

        if (percentage > 50) return 'text-green-400';
        if (percentage > 25) return 'text-yellow-400';
        if (percentage > 10) return 'text-orange-400';
        return 'text-red-400 animate-pulse';
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400">Loading test...</p>
                </div>
            </div>
        );
    }

    // Test Instructions View
    if (!testStarted) {
        const hasQuestions = (chapter?.questionCount ?? 1) > 0;
        return (
            <div className="min-h-screen pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="glass-panel rounded-2xl p-8 border border-gray-700">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                {chapter?.name}
                            </h1>
                            <div className="flex items-center justify-center gap-6 text-gray-400 flex-wrap">
                                <span>
                                    <i className="fas fa-graduation-cap mr-2"></i>
                                    Class {chapter?.classLevel}
                                </span>
                                <span>
                                    <i className="fas fa-signal mr-2"></i>
                                    {chapter?.difficultyLevel}
                                </span>
                                <span>
                                    <i className="fas fa-clock mr-2"></i>
                                    {chapter?.timeLimit || 60} minutes
                                </span>
                                <span className={`font-semibold ${hasQuestions ? 'text-cyan-400' : 'text-red-400'}`}>
                                    <i className="fas fa-question-circle mr-2"></i>
                                    {chapter?.questionCount ?? '...'} questions
                                </span>
                            </div>
                        </div>

                        {/* No questions warning */}
                        {!hasQuestions && (
                            <div className="mb-8 p-5 bg-red-500/10 border border-red-500/40 rounded-xl text-center">
                                <i className="fas fa-exclamation-triangle text-red-400 text-3xl mb-3"></i>
                                <p className="text-red-300 text-lg font-semibold">No questions available yet</p>
                                <p className="text-gray-400 text-sm mt-1">This chapter doesn't have any questions added. Please check back later or try a different chapter.</p>
                            </div>
                        )}

                        {/* Instructions */}
                        {hasQuestions && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Test Instructions</h2>
                            <div className="space-y-3 text-gray-400">
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-green-400 mt-1"></i>
                                    <p>This is a timed test. You have <span className="text-cyan-400 font-semibold">{chapter?.timeLimit || 60} minutes</span> to complete all questions.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-green-400 mt-1"></i>
                                    <p>The timer will start as soon as you click "Start Test".</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-green-400 mt-1"></i>
                                    <p>You can navigate between questions and change your answers before submitting.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-exclamation-triangle text-yellow-400 mt-1"></i>
                                    <p>The test will <span className="text-red-400 font-semibold">auto-submit</span> when time expires.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-exclamation-triangle text-yellow-400 mt-1"></i>
                                    <p>Once submitted, you cannot resume or change your answers.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-green-400 mt-1"></i>
                                    <p>Results will be shown immediately after submission.</p>
                                </div>
                            </div>
                        </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                            <button
                                onClick={() => navigate('/dpps')}
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                            >
                                <i className="fas fa-arrow-left mr-2"></i>
                                Back
                            </button>
                            <button
                                onClick={handleStartTest}
                                disabled={!hasQuestions}
                                className={`px-8 py-3 font-semibold rounded-lg transition transform ${
                                    hasQuestions
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white hover:scale-105'
                                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {hasQuestions ? (
                                    <><i className="fas fa-play mr-2"></i>Start Test</>
                                ) : (
                                    <><i className="fas fa-lock mr-2"></i>No Questions Yet</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Test Interface
    const currentQuestion = testSession?.questions[currentQuestionIndex];
    const questionData = currentQuestion?.questionId;
    const attemptedCount = Object.keys(selectedAnswers).length;
    const totalQuestions = testSession?.questions.length || 0;

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-900">
            {/* Fixed Header with Timer */}
            <div className="fixed top-16 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">{chapter?.name}</h2>
                            <p className="text-sm text-gray-400">
                                Question {currentQuestionIndex + 1} of {totalQuestions}
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-xs text-gray-400 mb-1">Attempted</p>
                                <p className="text-lg font-bold text-cyan-400">{attemptedCount}/{totalQuestions}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400 mb-1">Time Remaining</p>
                                <p className={`text-2xl font-bold ${getTimerColor()}`}>
                                    <i className="fas fa-clock mr-2"></i>
                                    {formatTime(timeRemaining)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-32">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Question Panel */}
                    <div className="lg:col-span-3">
                        <div className="glass-panel rounded-xl p-6 border border-gray-700 mb-6">
                            {/* Question */}
                            <div className="mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        Question {currentQuestionIndex + 1}
                                    </h3>
                                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm">
                                        {questionData?.marks || 1} mark{(questionData?.marks || 1) > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div
                                    className="text-gray-300 text-lg leading-relaxed mb-4"
                                    dangerouslySetInnerHTML={{ __html: questionData?.question }}
                                />
                                {questionData?.imageUrl && (
                                    <img
                                        src={questionData.imageUrl}
                                        alt="Question"
                                        className="max-w-full h-auto rounded-lg mb-4"
                                    />
                                )}
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {questionData?.options?.map((option, index) => {
                                    const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
                                    const isSelected = selectedAnswers[questionData._id] === optionLabel;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => handleAnswerSelect(questionData._id, optionLabel)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                                    ? 'border-cyan-500 bg-cyan-500/10'
                                                    : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400'
                                                    }`}>
                                                    {optionLabel}
                                                </div>
                                                <div
                                                    className="text-gray-300 flex-grow"
                                                    dangerouslySetInnerHTML={{ __html: option }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
                                <button
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="fas fa-arrow-left mr-2"></i>
                                    Previous
                                </button>

                                {currentQuestionIndex === totalQuestions - 1 ? (
                                    <button
                                        onClick={() => handleSubmit(false)}
                                        disabled={submitting}
                                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition transform hover:scale-105 disabled:opacity-50"
                                    >
                                        <i className="fas fa-check mr-2"></i>
                                        {submitting ? 'Submitting...' : 'Submit Test'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNextQuestion}
                                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition"
                                    >
                                        Next
                                        <i className="fas fa-arrow-right ml-2"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Question Navigator */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel rounded-xl p-6 border border-gray-700 sticky top-32">
                            <h3 className="text-lg font-bold text-white mb-4">Questions</h3>
                            <div className="grid grid-cols-5 gap-2 mb-6">
                                {testSession?.questions.map((q, index) => {
                                    const isAnswered = !!selectedAnswers[q.questionId._id];
                                    const isCurrent = index === currentQuestionIndex;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleQuestionJump(index)}
                                            className={`w-10 h-10 rounded-lg font-semibold transition ${isCurrent
                                                    ? 'bg-cyan-500 text-white'
                                                    : isAnswered
                                                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/50"></div>
                                    <span className="text-gray-400">Answered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-gray-700"></div>
                                    <span className="text-gray-400">Not Answered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-cyan-500"></div>
                                    <span className="text-gray-400">Current</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={submitting}
                                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
                            >
                                <i className="fas fa-check mr-2"></i>
                                Submit Test
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DPPSTest;
