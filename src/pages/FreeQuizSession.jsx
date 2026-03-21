import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const FreeQuizSession = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [started, setStarted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { [questionId]: 'A'|'B'|'C'|'D' }
    const [timeRemaining, setTimeRemaining] = useState(0);
    const timerRef = useRef(null);

    // Registration
    const [registered, setRegistered] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '', examTarget: '' });

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    useEffect(() => {
        fetchQuiz();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [quizId]);

    useEffect(() => {
        if (started && !submitted && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [started, submitted]);

    const fetchQuiz = async () => {
        try {
            const [quizRes, questionsRes] = await Promise.all([
                fetch(`${API_URL}/free-quizzes/${quizId}`),
                fetch(`${API_URL}/free-quizzes/${quizId}/questions`)
            ]);
            const quizData = await quizRes.json();
            const questionsData = await questionsRes.json();
            if (quizRes.ok) setQuiz(quizData); else navigate('/free-quiz');
            if (questionsRes.ok) setQuestions(Array.isArray(questionsData) ? questionsData : []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load quiz');
            navigate('/free-quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleStart = () => {
        setTimeRemaining((quiz.timeLimit ?? 30) * 60);
        setStarted(true);
    };

    const handleSelectAnswer = (questionId, letter) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: letter }));
    };

    const handleSubmit = async (auto = false) => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (!auto && Object.keys(answers).length < questions.length) {
            if (!window.confirm(`You have ${questions.length - Object.keys(answers).length} unanswered question(s). Submit anyway?`)) return;
        }
        // Calculate results and save attempt
        let correct = 0, incorrect = 0, unattempted = 0, score = 0;
        questions.forEach(q => {
            const ans = answers[q._id];
            if (!ans) { unattempted++; }
            else if (ans === q.correctAnswer) { correct++; score += (q.marks ?? 4); }
            else { incorrect++; score -= (q.negativeMarks ?? 1); }
        });
        const totalMarks = questions.reduce((s, q) => s + (q.marks ?? 4), 0);
        const percentage = totalMarks > 0 ? Math.max(0, Math.round((Math.max(0, score) / totalMarks) * 100)) : 0;
        try {
            await fetch(`${API_URL}/free-quizzes/${quizId}/attempts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: userInfo.name,
                    email: userInfo.email,
                    phone: userInfo.phone,
                    examTarget: userInfo.examTarget,
                    score: Math.max(0, score),
                    totalMarks,
                    percentage,
                    correct,
                    incorrect,
                    unattempted,
                    timeTaken: Math.max(0, (quiz.timeLimit ?? 30) * 60 - timeRemaining)
                })
            });
        } catch (err) { console.error('Failed to save attempt:', err); }
        setSubmitted(true);
    };

    // Results calculation
    const calcResults = () => {
        let correct = 0, incorrect = 0, unattempted = 0, score = 0;
        questions.forEach(q => {
            const ans = answers[q._id];
            if (!ans) { unattempted++; }
            else if (ans === q.correctAnswer) {
                correct++;
                score += (q.marks ?? 4);
            } else {
                incorrect++;
                score -= (q.negativeMarks ?? 1);
            }
        });
        const totalMarks = questions.reduce((s, q) => s + (q.marks ?? 4), 0);
        const percentage = totalMarks > 0 ? Math.max(0, Math.round((score / totalMarks) * 100)) : 0;
        return { correct, incorrect, unattempted, score: Math.max(0, score), totalMarks, percentage };
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const optionLabel = (i) => ['A', 'B', 'C', 'D'][i];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400 text-lg">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (!quiz || questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-exclamation-circle text-red-500 text-6xl mb-4"></i>
                    <p className="text-gray-400 text-lg mb-4">No questions available for this quiz yet.</p>
                    <button onClick={() => navigate('/free-quiz')} className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition">
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    // ── REGISTRATION FORM ──
    if (!registered) {
        const examOpts = ['JEE', 'NEET', 'IAT', 'NEST', 'CUET UG', 'BITSAT', 'IIT JAM', 'CUET PG', 'CSIR NET', 'GATE', 'TIFR', 'PSTET', 'Master Cadre', 'BOARDS', 'OLYMPIAD', 'OTHER'];
        return (
            <div className="min-h-screen pt-24 pb-16 px-4">
                <div className="max-w-lg mx-auto">
                    <button onClick={() => navigate('/free-quiz')} className="text-gray-400 hover:text-cyan-400 transition mb-6 flex items-center gap-2">
                        <i className="fas fa-arrow-left"></i> Back to Quizzes
                    </button>
                    <div className="glass-panel rounded-2xl p-8 border border-gray-700">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-user-circle text-3xl text-cyan-400"></i>
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-1">Before you begin</h1>
                            <p className="text-gray-400 text-sm">Enter your details to access <span className="text-cyan-400 font-semibold">{quiz.title}</span></p>
                        </div>
                        <form onSubmit={e => { e.preventDefault(); setRegistered(true); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-1">Full Name <span className="text-red-400">*</span></label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Rahul Sharma"
                                    value={userInfo.name}
                                    onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-400 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-1">Email Address <span className="text-red-400">*</span></label>
                                <input
                                    required
                                    type="email"
                                    placeholder="e.g. rahul@gmail.com"
                                    value={userInfo.email}
                                    onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-400 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="e.g. 9876543210"
                                    value={userInfo.phone}
                                    onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-400 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-1">Target Exam</label>
                                <select
                                    value={userInfo.examTarget}
                                    onChange={e => setUserInfo({ ...userInfo, examTarget: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-400 outline-none transition"
                                >
                                    <option value="">Select your target exam</option>
                                    {examOpts.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all hover:scale-[1.02] shadow-lg shadow-cyan-500/20 mt-2"
                            >
                                <i className="fas fa-arrow-right mr-2"></i>Continue to Quiz
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // ── RESULTS VIEW ──
    if (submitted) {
        const { correct, incorrect, unattempted, score, totalMarks, percentage } = calcResults();
        const scoreColor = percentage >= 80 ? 'text-green-400' : percentage >= 60 ? 'text-yellow-400' : 'text-red-400';
        const barColor = percentage >= 80 ? 'from-green-500 to-emerald-400' : percentage >= 60 ? 'from-yellow-500 to-orange-400' : 'from-red-500 to-pink-400';
        const msg = percentage >= 90 ? '🏆 Outstanding!' : percentage >= 80 ? '🎉 Great Job!' : percentage >= 60 ? '👍 Good Work!' : percentage >= 40 ? '💪 Keep Practicing!' : '📚 Need More Practice';

        return (
            <div className="min-h-screen pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => navigate('/free-quiz')} className="text-gray-400 hover:text-cyan-400 transition mb-6 flex items-center gap-2">
                        <i className="fas fa-arrow-left"></i> Back to Quizzes
                    </button>

                    {/* Score Card */}
                    <div className="glass-panel rounded-2xl p-10 border border-gray-700 mb-8 text-center">
                        <h1 className="text-4xl font-bold text-white mb-1">{msg}</h1>
                        <p className="text-gray-400 mb-6">{quiz.title}</p>

                        <div className={`text-8xl font-black mb-3 ${scoreColor}`}>{percentage}%</div>
                        <p className="text-gray-300 text-lg mb-6">
                            Score: <span className={`font-bold ${scoreColor}`}>{score}</span> / {totalMarks}
                        </p>

                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden mb-8">
                            <div className={`h-full bg-gradient-to-r ${barColor} transition-all duration-1000`} style={{ width: `${percentage}%` }} />
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                                <p className="text-3xl font-bold text-green-400">{correct}</p>
                                <p className="text-sm text-gray-400 mt-1">Correct</p>
                            </div>
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                                <p className="text-3xl font-bold text-red-400">{incorrect}</p>
                                <p className="text-sm text-gray-400 mt-1">Incorrect</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/30">
                                <p className="text-3xl font-bold text-gray-400">{unattempted}</p>
                                <p className="text-sm text-gray-400 mt-1">Skipped</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button onClick={() => { setAnswers({}); setCurrentIndex(0); setSubmitted(false); setStarted(false); setTimeRemaining(0); }} className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all hover:scale-105">
                                <i className="fas fa-redo mr-2"></i> Retry Quiz
                            </button>
                            <button onClick={() => navigate('/free-quiz')} className="px-8 py-3 bg-gray-800 border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-700 transition">
                                <i className="fas fa-list mr-2"></i> All Quizzes
                            </button>
                        </div>
                    </div>

                    {/* Answer Review */}
                    <h2 className="text-2xl font-bold text-white mb-4"><i className="fas fa-list-alt mr-2 text-cyan-400"></i>Answer Review</h2>
                    <div className="space-y-4">
                        {questions.map((q, idx) => {
                            const userAns = answers[q._id];
                            const isCorrect = userAns === q.correctAnswer;
                            const unanswered = !userAns;

                            return (
                                <div key={q._id} className={`glass-panel rounded-xl p-5 border ${unanswered ? 'border-gray-700' : isCorrect ? 'border-green-500/40' : 'border-red-500/40'}`}>
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${unanswered ? 'bg-gray-700 text-gray-400' : isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {unanswered ? '–' : isCorrect ? '✓' : '✗'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Q{idx + 1}</p>
                                            <div className="text-white text-sm ql-editor-content" dangerouslySetInnerHTML={{ __html: q.question }} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-11">
                                        {q.options.map((opt, oi) => {
                                            const letter = optionLabel(oi);
                                            const isUserAns = userAns === letter;
                                            const isCorrectAns = q.correctAnswer === letter;
                                            return (
                                                <div key={oi} className={`px-3 py-2 rounded-lg text-sm flex items-start gap-2 ${isCorrectAns ? 'bg-green-500/20 border border-green-500/50 text-green-300' : isUserAns && !isCorrectAns ? 'bg-red-500/20 border border-red-500/50 text-red-300' : 'bg-gray-800/50 border border-gray-700 text-gray-400'}`}>
                                                    <span className="font-bold flex-shrink-0">{letter}.</span>
                                                    <span className="ql-editor-content" dangerouslySetInnerHTML={{ __html: opt }} />
                                                    {isCorrectAns && <i className="fas fa-check ml-auto text-green-400 flex-shrink-0 mt-0.5"></i>}
                                                    {isUserAns && !isCorrectAns && <i className="fas fa-times ml-auto text-red-400 flex-shrink-0 mt-0.5"></i>}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {q.explanation && (
                                        <div className="mt-3 pl-11 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                            <p className="text-xs text-blue-400 font-semibold mb-1"><i className="fas fa-lightbulb mr-1"></i>Explanation</p>
                                            <div className="text-gray-300 text-sm ql-editor-content" dangerouslySetInnerHTML={{ __html: q.explanation }} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // ── START SCREEN ──
    if (!started) {
        return (
            <div className="min-h-screen pt-24 pb-16 px-4">
                <div className="max-w-2xl mx-auto">
                    <button onClick={() => navigate('/free-quiz')} className="text-gray-400 hover:text-cyan-400 transition mb-6 flex items-center gap-2">
                        <i className="fas fa-arrow-left"></i> Back to Quizzes
                    </button>
                    <div className="glass-panel rounded-2xl p-10 border border-gray-700 text-center">
                        <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-clipboard-list text-4xl text-cyan-400"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
                        {quiz.description && <p className="text-gray-400 mb-6">{quiz.description}</p>}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { icon: 'fa-graduation-cap', label: 'Exam', val: quiz.examType, color: 'text-cyan-400' },
                                { icon: 'fa-book', label: 'Chapter', val: quiz.chapter, color: 'text-blue-400' },
                                { icon: 'fa-question-circle', label: 'Questions', val: questions.length, color: 'text-green-400' },
                                { icon: 'fa-clock', label: 'Time', val: `${quiz.timeLimit ?? 30} min`, color: 'text-orange-400' }
                            ].map(({ icon, label, val, color }) => (
                                <div key={label} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                                    <i className={`fas ${icon} ${color} text-xl mb-2`}></i>
                                    <p className="text-xs text-gray-400">{label}</p>
                                    <p className="font-bold text-white text-sm mt-1 truncate">{val}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 text-left">
                            <p className="text-yellow-400 font-semibold mb-2"><i className="fas fa-info-circle mr-2"></i>Marking Scheme</p>
                            <p className="text-gray-300 text-sm">+{quiz.marks ?? 4} marks for correct answer &nbsp;|&nbsp; -{quiz.negativeMarks ?? 1} mark for wrong answer</p>
                        </div>

                        <button onClick={handleStart} className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all hover:scale-105 shadow-lg shadow-cyan-500/30">
                            <i className="fas fa-play mr-3"></i>Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── QUESTION VIEW ──
    const currentQ = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="glass-panel rounded-2xl p-4 border border-gray-700 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-white font-bold">{quiz.title}</p>
                            <p className="text-gray-400 text-sm">{quiz.chapter}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <p className={`text-2xl font-bold font-mono ${timeRemaining < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{formatTime(timeRemaining)}</p>
                                <p className="text-xs text-gray-400">Remaining</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{currentIndex + 1}<span className="text-gray-500 text-lg">/{questions.length}</span></p>
                                <p className="text-xs text-gray-400">Question</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Question Card */}
                <div className="glass-panel rounded-2xl p-8 border border-gray-700 mb-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white flex-shrink-0">
                            {currentIndex + 1}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${currentQ.difficulty === 'Easy' ? 'bg-green-500/15 border-green-500/40 text-green-400' : currentQ.difficulty === 'Hard' ? 'bg-red-500/15 border-red-500/40 text-red-400' : 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400'}`}>
                            {currentQ.difficulty}
                        </span>
                    </div>

                    <div className="text-white text-lg leading-relaxed mb-8 ql-editor-content" dangerouslySetInnerHTML={{ __html: currentQ.question }} />

                    <div className="space-y-3">
                        {currentQ.options.map((opt, i) => {
                            const letter = optionLabel(i);
                            const isSelected = answers[currentQ._id] === letter;
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSelectAnswer(currentQ._id, letter)}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${isSelected ? 'border-cyan-500 bg-cyan-500/15 text-white' : 'border-gray-700 hover:border-gray-500 text-gray-300 hover:bg-gray-800/50'}`}
                                >
                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${isSelected ? 'bg-cyan-500 text-black' : 'bg-gray-700 text-gray-300'}`}>{letter}</span>
                                    <span className="ql-editor-content" dangerouslySetInnerHTML={{ __html: opt }} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                        disabled={currentIndex === 0}
                        className="px-6 py-3 bg-gray-800 border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <i className="fas fa-arrow-left"></i> Previous
                    </button>

                    <div className="text-sm text-gray-400">{answeredCount}/{questions.length} answered</div>

                    {currentIndex < questions.length - 1 ? (
                        <button
                            onClick={() => setCurrentIndex(i => i + 1)}
                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition flex items-center gap-2"
                        >
                            Next <i className="fas fa-arrow-right"></i>
                        </button>
                    ) : (
                        <button
                            onClick={() => handleSubmit()}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition flex items-center gap-2"
                        >
                            <i className="fas fa-check-circle"></i> Submit Quiz
                        </button>
                    )}
                </div>

                {/* Question Navigator */}
                <div className="glass-panel rounded-2xl p-5 border border-gray-700 mt-4">
                    <p className="text-white font-semibold text-sm mb-3">Question Navigator</p>
                    <div className="flex flex-wrap gap-2">
                        {questions.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-9 h-9 rounded-lg font-bold text-sm transition ${idx === currentIndex ? 'bg-cyan-500 text-black' : answers[q._id] ? 'bg-green-500/30 text-green-400 border border-green-500' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-cyan-500"></div> Current</div>
                        <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-green-500/30 border border-green-500"></div> Answered</div>
                        <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-gray-800 border border-gray-700"></div> Unanswered</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreeQuizSession;
