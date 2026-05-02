import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ManageInfinitePractice = () => {
    const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'attempts'

    // ---- QUESTIONS STATE ----
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [filters, setFilters] = useState({ examName: '', subject: '', chapterName: '', difficulty: '' });
    const [allChapters, setAllChapters] = useState([]);
    const [showChapterDropdown, setShowChapterDropdown] = useState(false);
    const [chapterSuggestions, setChapterSuggestions] = useState([]);

    const [questionForm, setQuestionForm] = useState({
        examName: 'JEE Main',
        subject: 'Physical Chemistry',
        chapterName: '',
        question: '',
        questionType: 'Single Correct',
        options: ['', '', '', ''],
        correctAnswer: 0,
        solution: '',
        hint: '',
        difficulty: 'Medium',
        tags: [],
        isActive: true
    });

    // ---- ATTEMPTS STATE ----
    const [sessions, setSessions] = useState([]);
    const [sessionStats, setSessionStats] = useState(null);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessionFilters, setSessionFilters] = useState({ mode: '', status: '', examName: '', search: '' });
    const [sessionPage, setSessionPage] = useState(1);
    const [sessionTotalPages, setSessionTotalPages] = useState(1);
    const [sessionTotal, setSessionTotal] = useState(0);

    const API_URL = '/api/infinite-practice';
    const exams = [
        { value: 'NEET', label: 'NEET' },
        { value: 'JEE Main', label: 'JEE (Main & Advanced)' },
        { value: 'JEE Advanced', label: 'IAT/NEST' }
    ];
    const EXAM_LABEL = { 'NEET': 'NEET', 'JEE Main': 'JEE (Main & Advanced)', 'JEE Advanced': 'IAT/NEST' };
    const examLabel = (v) => EXAM_LABEL[v] || v;
    const subjects = ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Practical'];

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image', 'formula'],
            ['clean']
        ]
    };
    const quillModulesSimple = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'color': [] }],
            ['clean']
        ]
    };
    const quillFormats = ['header', 'bold', 'italic', 'underline', 'strike', 'script', 'list', 'bullet', 'color', 'background', 'link', 'image', 'formula'];

    useEffect(() => { fetchQuestions(); }, [filters]);
    useEffect(() => { fetchAllChapters(); }, []);
    useEffect(() => {
        if (activeTab === 'attempts') {
            fetchSessions();
            fetchSessionStats();
        }
    }, [activeTab, sessionFilters, sessionPage]);

    // ===================== QUESTIONS LOGIC =====================
    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.examName) params.append('examName', filters.examName);
            if (filters.subject) params.append('subject', filters.subject);
            if (filters.chapterName) params.append('chapterName', filters.chapterName);
            if (filters.difficulty) params.append('difficulty', filters.difficulty);

            const response = await axios.get(`${API_URL}/admin/questions?${params}`);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
            toast.error('Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllChapters = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/questions`);
            const seen = new Set();
            const chapters = [];
            response.data.forEach(q => {
                const key = `${q.examName}|${q.subject}|${q.chapterName.toLowerCase()}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    chapters.push({ examName: q.examName, subject: q.subject, chapterName: q.chapterName });
                }
            });
            setAllChapters(chapters);
        } catch (error) {
            console.error('Error fetching chapters:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingQuestion) {
                await axios.put(`${API_URL}/admin/questions/${editingQuestion._id}`, questionForm);
                toast.success('Question updated successfully');
            } else {
                await axios.post(`${API_URL}/admin/questions`, questionForm);
                toast.success('Question created successfully');
            }
            setShowForm(false);
            setEditingQuestion(null);
            resetForm();
            fetchQuestions();
            fetchAllChapters();
        } catch (error) {
            console.error('Error saving question:', error);
            toast.error('Failed to save question');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        setLoading(true);
        try {
            await axios.delete(`${API_URL}/admin/questions/${id}`);
            toast.success('Question deleted successfully');
            fetchQuestions();
        } catch (error) {
            console.error('Error deleting question:', error);
            toast.error('Failed to delete question');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (question) => {
        setEditingQuestion(question);
        setQuestionForm({
            examName: question.examName,
            subject: question.subject,
            chapterName: question.chapterName,
            question: question.question,
            questionType: question.questionType,
            options: question.options,
            correctAnswer: question.correctAnswer,
            solution: question.solution || '',
            hint: question.hint || '',
            difficulty: question.difficulty,
            tags: question.tags || [],
            isActive: question.isActive
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setQuestionForm({
            examName: 'JEE Main',
            subject: 'Physical Chemistry',
            chapterName: '',
            question: '',
            questionType: 'Single Correct',
            options: ['', '', '', ''],
            correctAnswer: 0,
            solution: '',
            hint: '',
            difficulty: 'Medium',
            tags: [],
            isActive: true
        });
        setEditingQuestion(null);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...questionForm.options];
        newOptions[index] = value;
        setQuestionForm({ ...questionForm, options: newOptions });
    };

    const getChapterSuggestions = (inputValue, examName, subject) => {
        const relevant = allChapters.filter(ch =>
            ch.examName === examName && ch.subject === subject
        );
        if (!inputValue) return relevant.map(ch => ch.chapterName);
        return relevant
            .filter(ch => ch.chapterName.toLowerCase().includes(inputValue.toLowerCase()))
            .map(ch => ch.chapterName);
    };

    const handleChapterInputChange = (e) => {
        const value = e.target.value;
        setQuestionForm(prev => ({ ...prev, chapterName: value }));
        const suggestions = getChapterSuggestions(value, questionForm.examName, questionForm.subject);
        setChapterSuggestions(suggestions);
        setShowChapterDropdown(suggestions.length > 0);
    };

    const handleChapterInputFocus = () => {
        const suggestions = getChapterSuggestions(questionForm.chapterName, questionForm.examName, questionForm.subject);
        setChapterSuggestions(suggestions);
        setShowChapterDropdown(suggestions.length > 0);
    };

    const handleChapterInputBlur = () => {
        setTimeout(() => {
            setShowChapterDropdown(false);
            if (questionForm.chapterName) {
                const exactMatch = allChapters.find(
                    ch => ch.chapterName.toLowerCase() === questionForm.chapterName.toLowerCase() &&
                          ch.examName === questionForm.examName &&
                          ch.subject === questionForm.subject
                );
                if (exactMatch && exactMatch.chapterName !== questionForm.chapterName) {
                    setQuestionForm(prev => ({ ...prev, chapterName: exactMatch.chapterName }));
                    toast.success(`Chapter name corrected to: "${exactMatch.chapterName}"`);
                }
            }
        }, 200);
    };

    const selectChapter = (chapterName) => {
        setQuestionForm(prev => ({ ...prev, chapterName }));
        setShowChapterDropdown(false);
    };

    // ===================== ATTEMPTS LOGIC =====================
    const fetchSessions = async () => {
        setSessionsLoading(true);
        try {
            const params = new URLSearchParams({ page: sessionPage, limit: 20 });
            if (sessionFilters.mode) params.append('mode', sessionFilters.mode);
            if (sessionFilters.status) params.append('status', sessionFilters.status);
            if (sessionFilters.examName) params.append('examName', sessionFilters.examName);
            if (sessionFilters.search) params.append('search', sessionFilters.search);

            const res = await axios.get(`${API_URL}/admin/sessions?${params}`);
            setSessions(res.data.sessions || []);
            setSessionTotal(res.data.total || 0);
            setSessionTotalPages(res.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            toast.error('Failed to fetch student attempts');
        } finally {
            setSessionsLoading(false);
        }
    };

    const fetchSessionStats = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/session-stats`);
            setSessionStats(res.data);
        } catch (error) {
            console.error('Error fetching session stats:', error);
        }
    };

    const fetchSessionDetail = async (sessionId) => {
        try {
            const res = await axios.get(`${API_URL}/admin/sessions/${sessionId}`);
            setSelectedSession(res.data);
        } catch (error) {
            toast.error('Failed to load session detail');
        }
    };

    const deleteSession = async (sessionId, studentName) => {
        if (!confirm(`Delete session for "${studentName || 'Unknown'}"? This cannot be undone.`)) return;
        try {
            await axios.delete(`${API_URL}/admin/sessions/${sessionId}`);
            toast.success('Session deleted');
            setSessions(prev => prev.filter(s => s._id !== sessionId));
            setSessionTotal(prev => Math.max(0, prev - 1));
            fetchSessionStats();
        } catch (error) {
            toast.error('Failed to delete session');
        }
    };

    const deleteAllSessions = async () => {
        if (!confirm('⚠️ Delete ALL student session data? This is permanent and cannot be undone!')) return;
        if (!confirm('Are you absolutely sure? ALL attempts will be erased.')) return;
        try {
            await axios.delete(`${API_URL}/admin/sessions?confirm=true`);
            toast.success('All sessions deleted');
            setSessions([]);
            setSessionTotal(0);
            fetchSessionStats();
        } catch (error) {
            toast.error('Failed to delete all sessions');
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatDuration = (secs) => {
        if (!secs) return '—';
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}m ${s}s`;
    };

    const getScoreColor = (pct) => {
        if (pct >= 70) return 'text-green-400';
        if (pct >= 40) return 'text-yellow-400';
        return 'text-red-400';
    };

    // ===================== RENDER =====================
    return (
        <div className="min-h-screen pt-32 pb-16 px-4 bg-gradient-to-b from-gray-900 via-black to-gray-900">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="glass-panel rounded-xl p-6 mb-6 border border-cyan-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                <i className="fas fa-infinity mr-3 text-cyan-400"></i>
                                Manage Infinite Practice
                            </h1>
                            <p className="text-gray-400">Add questions and view student attempt data</p>
                        </div>
                        {activeTab === 'questions' && (
                            <button
                                onClick={() => { resetForm(); setShowForm(!showForm); }}
                                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-semibold"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Add Question
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${activeTab === 'questions'
                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                            : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700'
                            }`}
                    >
                        <i className="fas fa-book"></i>
                        Questions
                        <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
                            {questions.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('attempts')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${activeTab === 'attempts'
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700'
                            }`}
                    >
                        <i className="fas fa-users"></i>
                        Student Attempts
                        {sessionTotal > 0 && (
                            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
                                {sessionTotal}
                            </span>
                        )}
                    </button>
                </div>

                {/* ========== QUESTIONS TAB ========== */}
                {activeTab === 'questions' && (
                    <>
                        {/* Filters */}
                        <div className="glass-panel rounded-xl p-6 mb-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">
                                <i className="fas fa-filter mr-2"></i>Filters
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Exam</label>
                                    <select value={filters.examName} onChange={(e) => setFilters({ ...filters, examName: e.target.value })} className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none">
                                        <option value="">All Exams</option>
                                        {exams.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Subject</label>
                                    <select value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })} className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none">
                                        <option value="">All Subjects</option>
                                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Chapter</label>
                                    <input type="text" value={filters.chapterName} onChange={(e) => setFilters({ ...filters, chapterName: e.target.value })} placeholder="Enter chapter name" className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Difficulty</label>
                                    <select value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })} className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none">
                                        <option value="">All Levels</option>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Question Form Modal */}
                        {showForm && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                                <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                    <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 z-10">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-bold text-white">
                                                {editingQuestion ? 'Edit Question' : 'Add New Question'}
                                            </h2>
                                            <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-400 hover:text-white">
                                                <i className="fas fa-times text-2xl"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-gray-400 mb-2">Exam *</label>
                                                <select value={questionForm.examName} onChange={(e) => setQuestionForm({ ...questionForm, examName: e.target.value, subject: '' })} className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none" required>
                                                    {exams.map(exam => <option key={exam.value} value={exam.value}>{exam.label}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 mb-2">Subject *</label>
                                                <select value={questionForm.subject} onChange={(e) => setQuestionForm({ ...questionForm, subject: e.target.value })} className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none" required>
                                                    {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-gray-400 mb-2">Chapter Name *</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={questionForm.chapterName}
                                                        onChange={handleChapterInputChange}
                                                        onFocus={handleChapterInputFocus}
                                                        onBlur={handleChapterInputBlur}
                                                        placeholder="Type or select chapter..."
                                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                                        required
                                                    />
                                                    {showChapterDropdown && chapterSuggestions.length > 0 && (
                                                        <ul className="absolute z-50 w-full mt-1 bg-gray-800 border border-cyan-500/40 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                                            {chapterSuggestions.map((ch, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    onMouseDown={() => selectChapter(ch)}
                                                                    className="px-4 py-2 text-white hover:bg-cyan-500/20 cursor-pointer text-sm border-b border-gray-700/50 last:border-0"
                                                                >
                                                                    <i className="fas fa-book-open mr-2 text-cyan-400 text-xs"></i>
                                                                    {ch}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 mb-2">Difficulty *</label>
                                                <select value={questionForm.difficulty} onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })} className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none" required>
                                                    <option value="Easy">Easy</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Hard">Hard</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-2">Question *</label>
                                            <div className="bg-gray-800 rounded border border-gray-700">
                                                <ReactQuill theme="snow" value={questionForm.question} onChange={(v) => setQuestionForm({ ...questionForm, question: v })} modules={quillModules} formats={quillFormats} className="text-white quill-editor" placeholder="Enter question with formatting..." />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-2">Options *</label>
                                            <div className="space-y-3">
                                                {questionForm.options.map((option, index) => (
                                                    <div key={index}>
                                                        <label className="block text-gray-300 mb-1 text-sm">Option {String.fromCharCode(65 + index)}</label>
                                                        <div className="bg-gray-800 rounded border border-gray-700">
                                                            <ReactQuill theme="snow" value={option} onChange={(v) => handleOptionChange(index, v)} modules={quillModulesSimple} formats={quillFormats} className="text-white quill-editor quill-option" placeholder={`Enter option ${String.fromCharCode(65 + index)}...`} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-2">Correct Answer *</label>
                                            <select value={questionForm.correctAnswer} onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: parseInt(e.target.value) })} className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none" required>
                                                {questionForm.options.map((_, index) => (
                                                    <option key={index} value={index}>Option {String.fromCharCode(65 + index)}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-2">Solution</label>
                                            <div className="bg-gray-800 rounded border border-gray-700">
                                                <ReactQuill theme="snow" value={questionForm.solution} onChange={(v) => setQuestionForm({ ...questionForm, solution: v })} modules={quillModules} formats={quillFormats} className="text-white quill-editor" placeholder="Enter solution..." />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-2">Hint</label>
                                            <div className="bg-gray-800 rounded border border-gray-700">
                                                <ReactQuill theme="snow" value={questionForm.hint} onChange={(v) => setQuestionForm({ ...questionForm, hint: v })} modules={quillModules} formats={quillFormats} className="text-white quill-editor" placeholder="Enter hint..." />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" checked={questionForm.isActive} onChange={(e) => setQuestionForm({ ...questionForm, isActive: e.target.checked })} className="w-4 h-4" />
                                            <label className="text-gray-400">Active</label>
                                        </div>
                                        <div className="flex gap-4 pt-4">
                                            <button type="submit" disabled={loading} className="flex-1 bg-cyan-500 text-white px-6 py-3 rounded font-bold hover:bg-cyan-600 transition disabled:opacity-50">
                                                {loading ? 'Saving...' : editingQuestion ? 'Update' : 'Create'}
                                            </button>
                                            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="flex-1 bg-gray-700 text-white px-6 py-3 rounded font-bold hover:bg-gray-600 transition">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Questions List */}
                        <div className="glass-panel rounded-xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Questions ({questions.length})</h3>
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                                    <p className="text-gray-400">Loading questions...</p>
                                </div>
                            ) : questions.length === 0 ? (
                                <div className="text-center py-12">
                                    <i className="fas fa-inbox text-gray-600 text-6xl mb-4"></i>
                                    <p className="text-gray-400">No questions found</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {questions.map((question) => (
                                        <div key={question._id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-semibold">{examLabel(question.examName)}</span>
                                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">{question.subject}</span>
                                                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-semibold">{question.chapterName}</span>
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                                            {question.difficulty}
                                                        </span>
                                                        {!question.isActive && <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs font-semibold">Inactive</span>}
                                                    </div>
                                                    <div className="text-white font-medium mb-2" dangerouslySetInnerHTML={{ __html: question.question }} />
                                                    <div className="text-sm text-gray-400 space-y-1">
                                                        {question.options.map((option, idx) => (
                                                            <div key={idx} className={idx === question.correctAnswer ? 'text-green-400 font-semibold' : ''}>
                                                                <span>{String.fromCharCode(65 + idx)}. </span>
                                                                <span dangerouslySetInnerHTML={{ __html: option }} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <button onClick={() => handleEdit(question)} className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button onClick={() => handleDelete(question._id)} className="px-3 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition">
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ========== ATTEMPTS TAB ========== */}
                {activeTab === 'attempts' && (
                    <>
                        {/* Stats Cards */}
                        {sessionStats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                                {[
                                    { label: 'Total Sessions', value: sessionStats.totalSessions, icon: 'fa-layer-group', color: 'text-cyan-400' },
                                    { label: 'Completed', value: sessionStats.completedSessions, icon: 'fa-check-circle', color: 'text-green-400' },
                                    { label: 'In Progress', value: sessionStats.activeSessions, icon: 'fa-spinner', color: 'text-yellow-400' },
                                    { label: 'Practice', value: sessionStats.practiceCount, icon: 'fa-book', color: 'text-blue-400' },
                                    { label: 'Exam', value: sessionStats.examCount, icon: 'fa-trophy', color: 'text-orange-400' },
                                    { label: 'Avg Score', value: `${sessionStats.avgScore}%`, icon: 'fa-chart-line', color: 'text-purple-400' },
                                    { label: 'Last 7 Days', value: sessionStats.recentSessions, icon: 'fa-calendar-week', color: 'text-pink-400' },
                                ].map((stat, i) => (
                                    <div key={i} className="glass-panel rounded-xl p-4 border border-gray-700 text-center">
                                        <i className={`fas ${stat.icon} ${stat.color} text-xl mb-2`}></i>
                                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                                        <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Filters */}
                        <div className="glass-panel rounded-xl p-5 mb-6 border border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-400 mb-2 text-sm">Search (Name / Email / Mobile)</label>
                                    <div className="relative">
                                        <i className="fas fa-search absolute left-3 top-3 text-gray-500"></i>
                                        <input
                                            type="text"
                                            value={sessionFilters.search}
                                            onChange={(e) => { setSessionFilters({ ...sessionFilters, search: e.target.value }); setSessionPage(1); }}
                                            placeholder="Search student..."
                                            className="w-full bg-gray-800 text-white pl-9 pr-4 py-2 rounded border border-gray-700 focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm">Mode</label>
                                    <select value={sessionFilters.mode} onChange={(e) => { setSessionFilters({ ...sessionFilters, mode: e.target.value }); setSessionPage(1); }} className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-purple-500 outline-none">
                                        <option value="">All Modes</option>
                                        <option value="Practice">Practice</option>
                                        <option value="Exam">Exam</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm">Status</label>
                                    <select value={sessionFilters.status} onChange={(e) => { setSessionFilters({ ...sessionFilters, status: e.target.value }); setSessionPage(1); }} className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-purple-500 outline-none">
                                        <option value="">All Status</option>
                                        <option value="active">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm">Exam</label>
                                    <select value={sessionFilters.examName} onChange={(e) => { setSessionFilters({ ...sessionFilters, examName: e.target.value }); setSessionPage(1); }} className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-purple-500 outline-none">
                                        <option value="">All Exams</option>
                                        {exams.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Sessions Table */}
                        <div className="glass-panel rounded-xl border border-gray-700 overflow-hidden">
                            <div className="p-5 border-b border-gray-700 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">
                                    <i className="fas fa-users mr-2 text-purple-400"></i>
                                    Student Attempts ({sessionTotal} total)
                                </h3>
                                <div className="flex gap-2">
                                    <button onClick={() => { fetchSessions(); fetchSessionStats(); }} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition text-sm">
                                        <i className="fas fa-sync-alt mr-2"></i>Refresh
                                    </button>
                                    {sessionTotal > 0 && (
                                        <button
                                            onClick={deleteAllSessions}
                                            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/40 rounded-lg hover:bg-red-500/30 transition text-sm font-semibold"
                                        >
                                            <i className="fas fa-trash-alt mr-2"></i>Delete All
                                        </button>
                                    )}
                                </div>
                            </div>

                            {sessionsLoading ? (
                                <div className="text-center py-16">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                                    <p className="text-gray-400">Loading student attempts...</p>
                                </div>
                            ) : sessions.length === 0 ? (
                                <div className="text-center py-16">
                                    <i className="fas fa-inbox text-gray-600 text-5xl mb-4"></i>
                                    <p className="text-gray-400 text-lg">No student attempts found</p>
                                    <p className="text-gray-500 text-sm mt-2">Students need to complete the feedback form when starting a session</p>
                                </div>
                            ) : (
                                <>
                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-800/60 text-gray-400 text-sm">
                                                    <th className="px-4 py-3 text-left font-semibold">Student</th>
                                                    <th className="px-4 py-3 text-left font-semibold">Contact</th>
                                                    <th className="px-4 py-3 text-left font-semibold">Exam / Subject</th>
                                                    <th className="px-4 py-3 text-center font-semibold">Mode</th>
                                                    <th className="px-4 py-3 text-center font-semibold">Score</th>
                                                    <th className="px-4 py-3 text-center font-semibold">Status</th>
                                                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                                                    <th className="px-4 py-3 text-center font-semibold">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sessions.map((session, i) => (
                                                    <tr key={session._id} className={`border-t border-gray-700/50 hover:bg-gray-800/30 transition ${i % 2 === 0 ? '' : 'bg-gray-800/10'}`}>
                                                        {/* Student */}
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                                    {(session.studentInfo?.name || session.userId || '?')[0].toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="text-white font-semibold text-sm">
                                                                        {session.studentInfo?.name || <span className="text-gray-500 italic">Unknown</span>}
                                                                    </div>
                                                                    {session.studentInfo?.class && (
                                                                        <div className="text-xs text-gray-500">Class {session.studentInfo.class}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {/* Contact */}
                                                        <td className="px-4 py-4">
                                                            <div className="text-sm">
                                                                {session.studentInfo?.email ? (
                                                                    <div className="flex items-center gap-1 text-gray-300 mb-1">
                                                                        <i className="fas fa-envelope text-xs text-gray-500 w-4"></i>
                                                                        <span className="text-xs">{session.studentInfo.email}</span>
                                                                    </div>
                                                                ) : null}
                                                                {session.studentInfo?.mobile ? (
                                                                    <div className="flex items-center gap-1 text-gray-300">
                                                                        <i className="fas fa-phone text-xs text-gray-500 w-4"></i>
                                                                        <span className="text-xs">{session.studentInfo.mobile}</span>
                                                                    </div>
                                                                ) : null}
                                                                {!session.studentInfo?.email && !session.studentInfo?.mobile && (
                                                                    <span className="text-gray-500 text-xs italic">No contact info</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        {/* Exam */}
                                                        <td className="px-4 py-4">
                                                            <div className="text-sm font-semibold text-white">{examLabel(session.examName)}</div>
                                                            <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[140px]">{session.subject}</div>
                                                            <div className="text-xs text-gray-600 mt-0.5">{session.difficulty}</div>
                                                        </td>
                                                        {/* Mode */}
                                                        <td className="px-4 py-4 text-center">
                                                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${session.mode === 'Practice' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                                {session.mode === 'Practice' ? '📚' : '🎯'} {session.mode}
                                                            </span>
                                                            <div className="text-xs text-gray-500 mt-1">{session.totalQuestions} Qs</div>
                                                            {session.negativeMarking && (
                                                                <div className="text-xs text-red-400 mt-0.5">−{session.negativeMarkValue}/wrong</div>
                                                            )}
                                                        </td>
                                                        {/* Score */}
                                                        <td className="px-4 py-4 text-center">
                                                            <div className={`text-xl font-bold ${getScoreColor(session.score?.percentage)}`}>
                                                                {session.score?.percentage ?? '—'}%
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                ✓{session.score?.correct} ✗{session.score?.incorrect} ○{session.score?.unattempted}
                                                            </div>
                                                        </td>
                                                        {/* Status */}
                                                        <td className="px-4 py-4 text-center">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${session.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                                {session.status === 'completed' ? '✓ Done' : '⏳ Active'}
                                                            </span>
                                                            {session.totalTimeTaken && (
                                                                <div className="text-xs text-gray-500 mt-1">{formatDuration(session.totalTimeTaken)}</div>
                                                            )}
                                                        </td>
                                                        {/* Date */}
                                                        <td className="px-4 py-4">
                                                            <div className="text-xs text-gray-300">{formatDate(session.createdAt)}</div>
                                                            {session.completedAt && (
                                                                <div className="text-xs text-gray-500 mt-1">Ended: {formatDate(session.completedAt)}</div>
                                                            )}
                                                        </td>
                                                        {/* Actions */}
                                                        <td className="px-4 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => fetchSessionDetail(session._id)}
                                                                    className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-xs font-semibold"
                                                                >
                                                                    <i className="fas fa-eye mr-1"></i>View
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteSession(session._id, session.studentInfo?.name)}
                                                                    className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-xs font-semibold"
                                                                    title="Delete this session"
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {sessionTotalPages > 1 && (
                                        <div className="flex items-center justify-between p-4 border-t border-gray-700">
                                            <span className="text-gray-400 text-sm">
                                                Page {sessionPage} of {sessionTotalPages}
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSessionPage(p => Math.max(1, p - 1))}
                                                    disabled={sessionPage === 1}
                                                    className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-40 text-sm"
                                                >
                                                    <i className="fas fa-chevron-left mr-1"></i>Prev
                                                </button>
                                                <button
                                                    onClick={() => setSessionPage(p => Math.min(sessionTotalPages, p + 1))}
                                                    disabled={sessionPage === sessionTotalPages}
                                                    className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-40 text-sm"
                                                >
                                                    Next<i className="fas fa-chevron-right ml-1"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Session Detail Modal */}
            {selectedSession && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-gray-900 rounded-2xl border border-purple-500/40 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/20">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 z-10 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Session Detail</h2>
                                <p className="text-gray-400 text-sm mt-1">ID: {selectedSession._id}</p>
                            </div>
                            <button onClick={() => setSelectedSession(null)} className="text-gray-400 hover:text-white transition">
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Student Info */}
                            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <i className="fas fa-user-graduate text-purple-400"></i>
                                    Student Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: 'fa-user', label: 'Name', value: selectedSession.studentInfo?.name },
                                        { icon: 'fa-envelope', label: 'Email', value: selectedSession.studentInfo?.email },
                                        { icon: 'fa-phone', label: 'Mobile', value: selectedSession.studentInfo?.mobile },
                                        { icon: 'fa-graduation-cap', label: 'Class', value: selectedSession.studentInfo?.class },
                                    ].map(({ icon, label, value }) => (
                                        <div key={label}>
                                            <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                                                <i className={`fas ${icon} w-4`}></i>{label}
                                            </div>
                                            <div className="text-white font-semibold">{value || <span className="text-gray-500 italic">Not provided</span>}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Session Info */}
                            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <i className="fas fa-clipboard-list text-cyan-400"></i>
                                    Session Details
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div><div className="text-gray-500 text-xs mb-1">Exam</div><div className="text-white font-semibold">{examLabel(selectedSession.examName)}</div></div>
                                    <div><div className="text-gray-500 text-xs mb-1">Subject</div><div className="text-white font-semibold">{selectedSession.subject}</div></div>
                                    <div><div className="text-gray-500 text-xs mb-1">Difficulty</div><div className="text-white font-semibold">{selectedSession.difficulty}</div></div>
                                    <div><div className="text-gray-500 text-xs mb-1">Mode</div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${selectedSession.mode === 'Practice' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                            {selectedSession.mode}
                                        </span>
                                    </div>
                                    <div><div className="text-gray-500 text-xs mb-1">Total Questions</div><div className="text-white font-semibold">{selectedSession.totalQuestions}</div></div>
                                    <div><div className="text-gray-500 text-xs mb-1">Status</div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${selectedSession.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {selectedSession.status}
                                        </span>
                                    </div>
                                    <div><div className="text-gray-500 text-xs mb-1">Timed Mode</div><div className="text-white font-semibold">{selectedSession.timedMode ? `Yes (${Math.round(selectedSession.timeLimitSeconds / 60)} min)` : 'No'}</div></div>
                                    <div><div className="text-gray-500 text-xs mb-1">Negative Marking</div><div className="text-white font-semibold">{selectedSession.negativeMarking ? `−${selectedSession.negativeMarkValue}/wrong` : 'None'}</div></div>
                                    <div><div className="text-gray-500 text-xs mb-1">Time Taken</div><div className="text-white font-semibold">{formatDuration(selectedSession.totalTimeTaken)}</div></div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-gray-500 text-xs mb-1">Chapters Practiced</div>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedSession.chapters || []).map(ch => (
                                            <span key={ch} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">{ch}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="text-xs text-gray-500">Started: <span className="text-gray-300">{formatDate(selectedSession.createdAt)}</span></div>
                                    {selectedSession.completedAt && (
                                        <div className="text-xs text-gray-500">Completed: <span className="text-gray-300">{formatDate(selectedSession.completedAt)}</span></div>
                                    )}
                                </div>
                            </div>

                            {/* Score */}
                            {selectedSession.score && (
                                <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <i className="fas fa-chart-bar text-green-400"></i>
                                        Score Summary
                                    </h3>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <div className={`text-5xl font-bold ${getScoreColor(selectedSession.score.percentage)}`}>
                                                {selectedSession.score.percentage}%
                                            </div>
                                            <div className="text-gray-400 text-sm mt-1">Overall Score</div>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-green-400"><i className="fas fa-check-circle mr-2"></i>Correct</span>
                                                <span className="font-bold text-green-400">{selectedSession.score.correct}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-red-400"><i className="fas fa-times-circle mr-2"></i>Incorrect</span>
                                                <span className="font-bold text-red-400">{selectedSession.score.incorrect}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400"><i className="fas fa-minus-circle mr-2"></i>Unattempted/Skipped</span>
                                                <span className="font-bold text-gray-400">{selectedSession.score.unattempted}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Score bar */}
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${selectedSession.score.percentage >= 70 ? 'bg-green-500' : selectedSession.score.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${selectedSession.score.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Quill dark theme styles */}
            <style>{`
                .quill-editor .ql-toolbar { background: #1f2937; border-color: #374151 !important; border-radius: 0.375rem 0.375rem 0 0; }
                .quill-editor .ql-container { background: #1f2937; border-color: #374151 !important; border-radius: 0 0 0.375rem 0.375rem; min-height: 150px; }
                .quill-option .ql-container { min-height: 80px; }
                .quill-editor .ql-editor { color: white; font-size: 14px; min-height: 120px; }
                .quill-option .ql-editor { min-height: 50px; }
                .quill-editor .ql-editor.ql-blank::before { color: #9ca3af; font-style: normal; }
                .quill-editor .ql-stroke { stroke: #9ca3af !important; }
                .quill-editor .ql-fill { fill: #9ca3af !important; }
                .quill-editor .ql-picker-label { color: #9ca3af !important; }
                .quill-editor .ql-picker-options { background: #1f2937; border-color: #374151; }
                .quill-editor .ql-picker-item { color: #9ca3af; }
                .quill-editor .ql-picker-item:hover { color: #06b6d4; }
                .quill-editor .ql-toolbar button:hover, .quill-editor .ql-toolbar button.ql-active { color: #06b6d4 !important; }
                .quill-editor .ql-toolbar button:hover .ql-stroke, .quill-editor .ql-toolbar button.ql-active .ql-stroke { stroke: #06b6d4 !important; }
                .quill-editor .ql-toolbar button:hover .ql-fill, .quill-editor .ql-toolbar button.ql-active .ql-fill { fill: #06b6d4 !important; }
            `}</style>
        </div>
    );
};

export default ManageInfinitePractice;
