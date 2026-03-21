import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ManageFreeQuizzes = () => {
    const API_URL = '/api/free-quizzes';

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ script: 'sub' }, { script: 'super' }],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean']
        ]
    };
    const quillFormats = ['header', 'bold', 'italic', 'underline', 'strike', 'script', 'color', 'background', 'list', 'bullet', 'link', 'image'];

    // ---- Quiz state ----
    const [quizzes, setQuizzes] = useState([]);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [showQuizForm, setShowQuizForm] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [quizForm, setQuizForm] = useState({
        title: '', description: '', examType: 'JEE', subject: 'Chemistry',
        chapter: '', topic: '', difficulty: 'Medium', quizCategory: 'Quiz',
        marks: 4, negativeMarks: 1, timeLimit: 30, isActive: true
    });

    // ---- Question state ----
    const [questions, setQuestions] = useState([]);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [questionForm, setQuestionForm] = useState({
        question: '', options: ['', '', '', ''], correctAnswer: 'A',
        explanation: '', difficulty: 'Medium', marks: 4, negativeMarks: 1, order: 0, isActive: true
    });

    const [loading, setLoading] = useState(false);

    // ---- Tabs & Attempts ----
    const [activeTab, setActiveTab] = useState('quizzes');
    const [attempts, setAttempts] = useState([]);
    const [attemptsLoading, setAttemptsLoading] = useState(false);
    const [attemptsFilter, setAttemptsFilter] = useState('all'); // quizId or 'all'

    useEffect(() => { fetchQuizzes(); }, []);
    useEffect(() => { if (currentQuiz) fetchQuestions(currentQuiz._id); }, [currentQuiz]);
    useEffect(() => { if (activeTab === 'attempts') fetchAttempts(); }, [activeTab]);

    // ===================== Quiz API =====================
    const fetchQuizzes = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/all`);
            setQuizzes(res.data);
        } catch { toast.error('Failed to load quizzes'); }
    };

    const fetchAttempts = async () => {
        setAttemptsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/attempts/all`);
            setAttempts(res.data);
        } catch { toast.error('Failed to load attempts'); }
        finally { setAttemptsLoading(false); }
    };

    const fetchQuestions = async (quizId) => {
        try {
            const res = await axios.get(`${API_URL}/${quizId}/questions/admin`);
            setQuestions(res.data);
        } catch { toast.error('Failed to load questions'); }
    };

    const handleSaveQuiz = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingQuiz) {
                await axios.patch(`${API_URL}/${editingQuiz._id}`, quizForm);
                toast.success('Quiz updated!');
                if (currentQuiz?._id === editingQuiz._id) {
                    setCurrentQuiz({ ...currentQuiz, ...quizForm });
                }
            } else {
                await axios.post(API_URL, quizForm);
                toast.success('Quiz created!');
            }
            resetQuizForm();
            fetchQuizzes();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to save quiz');
        } finally { setLoading(false); }
    };

    const handleDeleteQuiz = async (quizId) => {
        if (!window.confirm('Delete this quiz and all its questions?')) return;
        try {
            await axios.delete(`${API_URL}/${quizId}`);
            toast.success('Quiz deleted!');
            if (currentQuiz?._id === quizId) { setCurrentQuiz(null); setQuestions([]); }
            fetchQuizzes();
        } catch { toast.error('Failed to delete quiz'); }
    };

    const resetQuizForm = () => {
        setShowQuizForm(false);
        setEditingQuiz(null);
        setQuizForm({ title: '', description: '', examType: 'JEE', subject: 'Chemistry', chapter: '', topic: '', difficulty: 'Medium', quizCategory: 'Quiz', marks: 4, negativeMarks: 1, timeLimit: 30, isActive: true });
    };

    const startEditQuiz = (quiz) => {
        setEditingQuiz(quiz);
        setQuizForm({ title: quiz.title, description: quiz.description || '', examType: quiz.examType, subject: quiz.subject, chapter: quiz.chapter, topic: quiz.topic || '', difficulty: quiz.difficulty, quizCategory: quiz.quizCategory, marks: quiz.marks ?? 4, negativeMarks: quiz.negativeMarks ?? 1, timeLimit: quiz.timeLimit ?? 30, isActive: quiz.isActive });
        setShowQuizForm(true);
    };

    // ===================== Question API =====================
    const handleSaveQuestion = async (e) => {
        e.preventDefault();
        if (!currentQuiz) return;
        setLoading(true);
        try {
            if (editingQuestion) {
                await axios.patch(`${API_URL}/${currentQuiz._id}/questions/${editingQuestion._id}`, questionForm);
                toast.success('Question updated!');
            } else {
                await axios.post(`${API_URL}/${currentQuiz._id}/questions`, questionForm);
                toast.success('Question added!');
            }
            resetQuestionForm();
            fetchQuestions(currentQuiz._id);
            fetchQuizzes();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to save question');
        } finally { setLoading(false); }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            await axios.delete(`${API_URL}/${currentQuiz._id}/questions/${questionId}`);
            toast.success('Question deleted!');
            fetchQuestions(currentQuiz._id);
            fetchQuizzes();
        } catch { toast.error('Failed to delete question'); }
    };

    const resetQuestionForm = () => {
        setShowQuestionForm(false);
        setEditingQuestion(null);
        setQuestionForm({ question: '', options: ['', '', '', ''], correctAnswer: 'A', explanation: '', difficulty: 'Medium', marks: 4, negativeMarks: 1, order: 0, isActive: true });
    };

    const startEditQuestion = (q) => {
        setEditingQuestion(q);
        setQuestionForm({ question: q.question, options: [...q.options], correctAnswer: q.correctAnswer, explanation: q.explanation || '', difficulty: q.difficulty, marks: q.marks ?? 4, negativeMarks: q.negativeMarks ?? 1, order: q.order ?? 0, isActive: q.isActive });
        setShowQuestionForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const examOptions = (
        <>
            <optgroup label="UG Entrance Exams"><option value="NEET">NEET</option><option value="JEE">JEE</option><option value="IAT">IAT</option><option value="NEST">NEST</option><option value="CUET UG">CUET UG</option><option value="BITSAT">BITSAT</option></optgroup>
            <optgroup label="PG Entrance Exams"><option value="IIT JAM">IIT JAM</option><option value="CUET PG">CUET PG</option></optgroup>
            <optgroup label="Research Level"><option value="CSIR NET">CSIR NET</option><option value="GATE">GATE</option><option value="TIFR">TIFR</option></optgroup>
            <optgroup label="Govt. Job"><option value="PSTET">PSTET</option><option value="Master Cadre">Master Cadre</option><option value="UPSC - Mains (Chemistry)">UPSC Mains</option></optgroup>
            <optgroup label="Other"><option value="BOARDS">BOARDS</option><option value="KVPY">KVPY</option><option value="OLYMPIAD">OLYMPIAD</option><option value="FOUNDATION">FOUNDATION</option><option value="OTHER">OTHER</option></optgroup>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <i className="fas fa-clipboard-list text-cyan-400"></i>
                    Manage Free Quizzes
                </h1>
                {activeTab === 'quizzes' && (
                    <button
                        onClick={() => { resetQuizForm(); setShowQuizForm(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition"
                    >
                        <i className="fas fa-plus"></i>
                        New Quiz
                    </button>
                )}
                {activeTab === 'attempts' && (
                    <button
                        onClick={() => fetchAttempts()}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition"
                    >
                        <i className="fas fa-sync"></i> Refresh
                    </button>
                )}
            </div>

            {/* TABS */}
            <div className="flex gap-2 border-b border-gray-700 pb-0">
                <button
                    onClick={() => setActiveTab('quizzes')}
                    className={`px-5 py-2.5 font-semibold text-sm rounded-t-lg transition border-b-2 -mb-px ${
                        activeTab === 'quizzes'
                            ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                            : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                >
                    <i className="fas fa-clipboard-list mr-2"></i>Quiz Sets
                </button>
                <button
                    onClick={() => setActiveTab('attempts')}
                    className={`px-5 py-2.5 font-semibold text-sm rounded-t-lg transition border-b-2 -mb-px ${
                        activeTab === 'attempts'
                            ? 'border-purple-400 text-purple-400 bg-purple-500/10'
                            : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                >
                    <i className="fas fa-users mr-2"></i>Attempts
                    {attempts.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 bg-purple-500/30 text-purple-300 rounded text-xs">{attempts.length}</span>
                    )}
                </button>
            </div>

            {/* ====== ATTEMPTS TAB ====== */}
            {activeTab === 'attempts' && (
                <div className="space-y-6">
                    {attemptsLoading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-3"></div>
                            <p className="text-gray-400">Loading attempts...</p>
                        </div>
                    ) : attempts.length === 0 ? (
                        <div className="glass-panel p-12 rounded-xl text-center text-gray-500">
                            <i className="fas fa-users text-5xl mb-4 text-gray-600"></i>
                            <p className="text-lg font-semibold">No attempts yet</p>
                            <p className="text-sm mt-1">Students will appear here once they attempt a quiz</p>
                        </div>
                    ) : (() => {
                        const filtered = attemptsFilter === 'all' ? attempts : attempts.filter(a => a.quizId?.toString() === attemptsFilter || a.quizTitle === attemptsFilter);
                        const uniqueEmails = new Set(filtered.map(a => a.email)).size;
                        const avgScore = filtered.length > 0 ? Math.round(filtered.reduce((s, a) => s + a.percentage, 0) / filtered.length) : 0;
                        return (
                            <>
                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { icon: 'fa-list-check', label: 'Total Attempts', val: filtered.length, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
                                        { icon: 'fa-users', label: 'Unique Students', val: uniqueEmails, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
                                        { icon: 'fa-chart-line', label: 'Avg Score', val: `${avgScore}%`, color: 'text-green-400 bg-green-500/10 border-green-500/30' },
                                        { icon: 'fa-clipboard-list', label: 'Quiz Sets', val: quizzes.length, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
                                    ].map(({ icon, label, val, color }) => (
                                        <div key={label} className={`glass-panel p-4 rounded-xl border ${color.split(' ').slice(1).join(' ')}`}>
                                            <i className={`fas ${icon} ${color.split(' ')[0]} text-2xl mb-2`}></i>
                                            <p className="text-2xl font-bold text-white">{val}</p>
                                            <p className="text-xs text-gray-400 mt-1">{label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Filter */}
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-gray-400 flex-shrink-0">Filter by Quiz:</label>
                                    <select
                                        value={attemptsFilter}
                                        onChange={e => setAttemptsFilter(e.target.value)}
                                        className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-sm focus:border-purple-400 outline-none"
                                    >
                                        <option value="all">All Quizzes</option>
                                        {quizzes.map(q => <option key={q._id} value={q._id}>{q.title}</option>)}
                                    </select>
                                    <span className="text-gray-500 text-sm">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto rounded-xl border border-gray-700">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-700 bg-gray-800/60">
                                                {['#', 'Date', 'Name', 'Email', 'Phone', 'Target Exam', 'Quiz', 'Score', '%'].map(h => (
                                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {filtered.map((a, idx) => {
                                                const pct = a.percentage ?? 0;
                                                const pctColor = pct >= 80 ? 'text-green-400' : pct >= 60 ? 'text-yellow-400' : 'text-red-400';
                                                return (
                                                    <tr key={a._id} className="hover:bg-gray-800/40 transition">
                                                        <td className="px-4 py-3 text-gray-500">{filtered.length - idx}</td>
                                                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                                                            {new Date(a.attemptedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </td>
                                                        <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{a.name}</td>
                                                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{a.email}</td>
                                                        <td className="px-4 py-3 text-gray-400">{a.phone || '—'}</td>
                                                        <td className="px-4 py-3">
                                                            {a.examTarget ? (
                                                                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-semibold">{a.examTarget}</span>
                                                            ) : '—'}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-300 max-w-[160px] truncate">{a.quizTitle || '—'}</td>
                                                        <td className="px-4 py-3 text-white whitespace-nowrap">{a.score}<span className="text-gray-500">/{a.totalMarks}</span></td>
                                                        <td className="px-4 py-3">
                                                            <span className={`font-bold ${pctColor}`}>{pct}%</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}

            {/* ====== QUIZ TAB ====== */}
            {activeTab === 'quizzes' && (
            <>
            {/* ====== QUIZ FORM ====== */}
            {showQuizForm && (
                <div className="glass-panel p-6 rounded-xl border border-cyan-500/30">
                    <h2 className="text-lg font-bold text-white mb-4">{editingQuiz ? 'Edit Quiz' : 'Add New Quiz'}</h2>
                    <form onSubmit={handleSaveQuiz} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input required placeholder="Quiz Title *" value={quizForm.title} onChange={e => setQuizForm({ ...quizForm, title: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white col-span-2" />
                            <textarea placeholder="Description" rows={2} value={quizForm.description} onChange={e => setQuizForm({ ...quizForm, description: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white col-span-2" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <select value={quizForm.examType} onChange={e => setQuizForm({ ...quizForm, examType: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white">{examOptions}</select>
                            <input required placeholder="Subject *" value={quizForm.subject} onChange={e => setQuizForm({ ...quizForm, subject: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
                            <input required placeholder="Chapter *" value={quizForm.chapter} onChange={e => setQuizForm({ ...quizForm, chapter: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
                            <input placeholder="Topic" value={quizForm.topic} onChange={e => setQuizForm({ ...quizForm, topic: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <select value={quizForm.difficulty} onChange={e => setQuizForm({ ...quizForm, difficulty: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white">
                                <option>Easy</option><option>Medium</option><option>Hard</option>
                            </select>
                            <select value={quizForm.quizCategory} onChange={e => setQuizForm({ ...quizForm, quizCategory: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white">
                                <option value="Quiz">Quiz</option><option value="Mock Test">Mock Test</option><option value="PYPs">PYPs</option>
                            </select>
                            <div className="flex flex-col">
                                <label className="text-xs text-gray-400 mb-1">Marks/Q</label>
                                <input type="number" min="0" step="0.5" value={quizForm.marks} onChange={e => setQuizForm({ ...quizForm, marks: parseFloat(e.target.value) })} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-gray-400 mb-1">Neg. Marks</label>
                                <input type="number" min="0" step="0.25" value={quizForm.negativeMarks} onChange={e => setQuizForm({ ...quizForm, negativeMarks: parseFloat(e.target.value) })} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-gray-400 mb-1">Time (mins)</label>
                                <input type="number" min="1" value={quizForm.timeLimit} onChange={e => setQuizForm({ ...quizForm, timeLimit: parseInt(e.target.value) })} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
                            </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={quizForm.isActive} onChange={e => setQuizForm({ ...quizForm, isActive: e.target.checked })} className="w-4 h-4 accent-cyan-500" />
                            <span className="text-gray-300">Active (visible to students)</span>
                        </label>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={loading} className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition flex items-center gap-2">
                                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                                {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                            </button>
                            <button type="button" onClick={resetQuizForm} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* ====== MAIN LAYOUT ====== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* QUIZ LIST (left) */}
                <div className="lg:col-span-1 space-y-3">
                    <h3 className="text-gray-400 font-semibold text-sm uppercase tracking-wide">
                        Quiz Sets ({quizzes.length})
                    </h3>
                    {quizzes.length === 0 ? (
                        <div className="glass-panel p-6 rounded-xl text-center text-gray-500">
                            <i className="fas fa-clipboard-list text-3xl mb-2"></i>
                            <p>No quizzes yet</p>
                        </div>
                    ) : quizzes.map(quiz => (
                        <div
                            key={quiz._id}
                            onClick={() => { setCurrentQuiz(quiz); resetQuestionForm(); setShowQuestionForm(false); }}
                            className={`glass-panel p-4 rounded-xl cursor-pointer transition-all border-2 ${currentQuiz?._id === quiz._id ? 'border-cyan-500 bg-cyan-500/5' : 'border-transparent hover:border-gray-600'}`}
                        >
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white text-sm truncate">{quiz.title}</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">{quiz.examType}</span>
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">{quiz.quizCategory}</span>
                                        {!quiz.isActive && <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">Hidden</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{quiz.chapter} • {quiz.questionCount ?? 0} questions</p>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    <button onClick={ev => { ev.stopPropagation(); startEditQuiz(quiz); }} className="p-1.5 text-cyan-400 hover:bg-cyan-500/10 rounded transition">
                                        <i className="fas fa-edit text-xs"></i>
                                    </button>
                                    <button onClick={ev => { ev.stopPropagation(); handleDeleteQuiz(quiz._id); }} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition">
                                        <i className="fas fa-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* QUESTIONS PANEL (right) */}
                <div className="lg:col-span-2">
                    {!currentQuiz ? (
                        <div className="glass-panel p-12 rounded-xl text-center text-gray-500">
                            <i className="fas fa-hand-pointer text-5xl mb-4 text-gray-600"></i>
                            <p className="text-lg font-semibold">Select a quiz to manage questions</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{currentQuiz.title}</h3>
                                    <p className="text-gray-400 text-sm">{questions.length} questions</p>
                                </div>
                                <button
                                    onClick={() => { resetQuestionForm(); setShowQuestionForm(true); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition text-sm"
                                >
                                    <i className="fas fa-plus"></i>
                                    Add Question
                                </button>
                            </div>

                            {/* QUESTION FORM */}
                            {showQuestionForm && (
                                <div className="glass-panel p-6 rounded-xl border border-green-500/30">
                                    <h4 className="font-bold text-white mb-4">{editingQuestion ? 'Edit Question' : 'New Question'}</h4>
                                    <form onSubmit={handleSaveQuestion} className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Question *</label>
                                            <ReactQuill
                                                theme="snow"
                                                value={questionForm.question}
                                                onChange={val => setQuestionForm({ ...questionForm, question: val })}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                className="bg-gray-900 rounded-lg text-white"
                                                style={{ minHeight: '120px' }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm text-gray-400">Options (A, B, C, D) *</label>
                                            {['A', 'B', 'C', 'D'].map((letter, i) => (
                                                <div key={letter} className="flex items-center gap-3">
                                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${questionForm.correctAnswer === letter ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300'}`}>{letter}</span>
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={questionForm.options[i]}
                                                        onChange={val => {
                                                            const opts = [...questionForm.options];
                                                            opts[i] = val;
                                                            setQuestionForm({ ...questionForm, options: opts });
                                                        }}
                                                        modules={{ toolbar: [['bold', 'italic', 'underline'], [{ script: 'sub' }, { script: 'super' }], [{ color: [] }]] }}
                                                        formats={['bold', 'italic', 'underline', 'script', 'color']}
                                                        className="flex-1 bg-gray-900 rounded-lg text-white min-h-[60px]"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Correct Answer</label>
                                                <select value={questionForm.correctAnswer} onChange={e => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-white w-full">
                                                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Difficulty</label>
                                                <select value={questionForm.difficulty} onChange={e => setQuestionForm({ ...questionForm, difficulty: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-white w-full">
                                                    <option>Easy</option><option>Medium</option><option>Hard</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Marks</label>
                                                <input type="number" min="0" step="0.5" value={questionForm.marks} onChange={e => setQuestionForm({ ...questionForm, marks: parseFloat(e.target.value) })} className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-white w-full" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Neg. Marks</label>
                                                <input type="number" min="0" step="0.25" value={questionForm.negativeMarks} onChange={e => setQuestionForm({ ...questionForm, negativeMarks: parseFloat(e.target.value) })} className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-white w-full" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Explanation (optional)</label>
                                            <ReactQuill
                                                theme="snow"
                                                value={questionForm.explanation}
                                                onChange={val => setQuestionForm({ ...questionForm, explanation: val })}
                                                modules={{ toolbar: [['bold', 'italic', 'underline'], [{ script: 'sub' }, { script: 'super' }], [{ color: [] }], ['link']] }}
                                                formats={['bold', 'italic', 'underline', 'script', 'color', 'link']}
                                                className="bg-gray-900 rounded-lg text-white"
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <button type="submit" disabled={loading} className="px-6 py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition flex items-center gap-2">
                                                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                                                {editingQuestion ? 'Update' : 'Save Question'}
                                            </button>
                                            <button type="button" onClick={resetQuestionForm} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* QUESTION LIST */}
                            {questions.length === 0 ? (
                                <div className="glass-panel p-8 rounded-xl text-center text-gray-500">
                                    <i className="fas fa-question-circle text-4xl mb-2 text-gray-600"></i>
                                    <p>No questions yet. Click "Add Question" to get started.</p>
                                </div>
                            ) : questions.map((q, idx) => (
                                <div key={q._id} className="glass-panel p-4 rounded-xl border border-gray-700">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex gap-3 flex-1 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div
                                                    className="text-white text-sm line-clamp-2 ql-editor-content"
                                                    dangerouslySetInnerHTML={{ __html: q.question }}
                                                />
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">✓ {q.correctAnswer}</span>
                                                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">{q.difficulty}</span>
                                                    <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">+{q.marks} / -{q.negativeMarks}</span>
                                                    {!q.isActive && <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Hidden</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0">
                                            <button onClick={() => startEditQuestion(q)} className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded transition">
                                                <i className="fas fa-edit text-sm"></i>
                                            </button>
                                            <button onClick={() => handleDeleteQuestion(q._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded transition">
                                                <i className="fas fa-trash text-sm"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>            </>
            )}        </div>
    );
};

export default ManageFreeQuizzes;
