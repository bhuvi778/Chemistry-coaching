import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/UI/Pagination';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ManageDPPS = () => {
    // ReactQuill modules configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ]
    };

    const quillFormats = [
        'header', 'size',
        'bold', 'italic', 'underline', 'strike',
        'script',
        'color', 'background',
        'list', 'bullet',
        'align',
        'link', 'image'
    ];

    // State
    const [loading, setLoading] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [stats, setStats] = useState({ chapters: 0, questions: 0, byDifficulty: {} });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPage, setQuestionsPage] = useState(1);
    const CHAPTERS_PER_PAGE = 18;
    const QUESTIONS_PER_PAGE = 10;

    // Forms
    const [showChapterForm, setShowChapterForm] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form Data
    const [chapterForm, setChapterForm] = useState({
        name: '',
        subject: 'Physical Chemistry',
        description: '',
        classLevel: '11',
        difficultyLevel: 'Medium',
        timeLimit: 60,
        icon: 'fa-book',
        color: 'cyan',
        order: 0,
        isActive: true
    });

    const [questionForm, setQuestionForm] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        solution: '',
        hint: '',
        classLevel: '11',
        difficultyLevel: 'Medium',
        questionType: 'MCQ',
        marks: 4,
        negativeMarks: 1,
        tags: [],
        order: 0,
        isActive: true
    });

    const API_URL = '/api/dpps';

    // Fetch Data
    useEffect(() => {
        fetchChapters();
        fetchStats();
    }, []);

    useEffect(() => {
        if (currentChapter) {
            setQuestionsPage(1);
            fetchQuestions(currentChapter._id);
        }
    }, [currentChapter]);

    const fetchChapters = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/chapters`);
            setChapters(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load chapters');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestions = async (chapterId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/questions?chapterId=${chapterId}`);
            setQuestions(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_URL}/stats`);
            setStats(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // CRUD Handlers
    const handleDeleteChapter = async (id) => {
        if (!window.confirm('Are you sure? This will delete all questions in this chapter.')) return;
        try {
            await axios.delete(`${API_URL}/chapters/${id}`);
            toast.success('Chapter deleted successfully');
            // Immediately update UI
            setChapters(prevChapters => prevChapters.filter(ch => ch._id !== id));
            fetchStats();
            // Don't need to change existing code here, just noting I should reset page in useEffect
            if (currentChapter?._id === id) {
                setCurrentChapter(null);
            }
        } catch (error) {
            // If 404, item already doesn't exist - still remove from UI
            if (error.response?.status === 404) {
                toast.success('Chapter already removed');
                setChapters(prevChapters => prevChapters.filter(ch => ch._id !== id));
                if (currentChapter?._id === id) {
                    setCurrentChapter(null);
                }
            } else {
                toast.error('Failed to delete chapter');
            }
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        try {
            await axios.delete(`${API_URL}/questions/${id}`);
            toast.success('Question deleted successfully');
            // Immediately update UI
            setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== id));
            fetchStats();
        } catch (error) {
            // If 404, item already doesn't exist - still remove from UI
            if (error.response?.status === 404) {
                toast.success('Question already removed');
                setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== id));
            } else {
                toast.error('Failed to delete question');
            }
        }
    };

    const handleChapterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingItem) {
                await axios.put(`${API_URL}/chapters/${editingItem._id}`, chapterForm);
                toast.success('Chapter updated successfully');
            } else {
                await axios.post(`${API_URL}/chapters`, chapterForm);
                toast.success('Chapter created successfully');
            }
            closeChapterForm();
            fetchChapters();
            fetchStats();
        } catch (error) {
            console.error(error);
            toast.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...questionForm,
                chapterId: currentChapter._id
            };

            if (editingItem) {
                await axios.put(`${API_URL}/questions/${editingItem._id}`, payload);
                toast.success('Question updated successfully');
            } else {
                await axios.post(`${API_URL}/questions`, payload);
                toast.success('Question created successfully');
            }
            closeQuestionForm();
            fetchQuestions(currentChapter._id);
            fetchStats();
        } catch (error) {
            console.error(error);
            toast.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    // Form Helpers
    const openEditChapter = (chapter) => {
        setEditingItem(chapter);
        setChapterForm({
            name: chapter.name,
            subject: chapter.subject || 'Physical Chemistry',
            description: chapter.description,
            classLevel: chapter.classLevel || '11',
            difficultyLevel: chapter.difficultyLevel,
            timeLimit: chapter.timeLimit || 60,
            icon: chapter.icon,
            color: chapter.color,
            order: chapter.order,
            isActive: chapter.isActive
        });
        setShowChapterForm(true);
    };

    const openEditQuestion = (question) => {
        setEditingItem(question);
        setQuestionForm({
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            solution: question.solution,
            hint: question.hint,
            classLevel: question.classLevel || '11',
            difficultyLevel: question.difficultyLevel,
            questionType: question.questionType,
            marks: question.marks,
            negativeMarks: question.negativeMarks ?? 1,
            tags: question.tags || [],
            order: question.order,
            isActive: question.isActive
        });
        setShowQuestionForm(true);
    };

    const closeChapterForm = () => {
        setShowChapterForm(false);
        setEditingItem(null);
        setChapterForm({
            name: '',
            subject: 'Physical Chemistry',
            description: '',
            classLevel: '11',
            difficultyLevel: 'Medium',
            timeLimit: 60,
            icon: 'fa-book',
            color: 'cyan',
            order: 0,
            isActive: true
        });
    };

    const closeQuestionForm = () => {
        setShowQuestionForm(false);
        setEditingItem(null);
        setQuestionForm({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            solution: '',
            hint: '',
            classLevel: '11',
            difficultyLevel: 'Medium',
            questionType: 'MCQ',
            marks: 4,
            negativeMarks: 1,
            tags: [],
            order: 0,
            isActive: true
        });
    };

    // Breadcrumb
    const renderBreadcrumb = () => {
        if (!currentChapter) return null;
        return (
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 bg-gray-900/50 p-3 rounded-lg border border-gray-700 w-fit">
                <button
                    onClick={() => setCurrentChapter(null)}
                    className="hover:text-cyan-400 font-bold"
                >
                    Chapters
                </button>
                <i className="fas fa-chevron-right text-xs"></i>
                <span className="text-white font-bold">{currentChapter.name}</span>
            </div>
        );
    };

    // Main View - Chapters List
    if (!currentChapter) {
        return (
            <div className="w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Manage DPPs</h2>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass-panel p-4 rounded-xl border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Total Chapters</div>
                        <div className="text-3xl font-bold text-white">{stats.chapters}</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Total Questions</div>
                        <div className="text-3xl font-bold text-white">{stats.questions}</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Easy Questions</div>
                        <div className="text-3xl font-bold text-green-400">{stats.byDifficulty?.Easy || 0}</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Medium Questions</div>
                        <div className="text-3xl font-bold text-yellow-400">{stats.byDifficulty?.Medium || 0}</div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">DPPs Chapters</h3>
                        <button
                            onClick={() => setShowChapterForm(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            <i className="fas fa-plus mr-2"></i> Add Chapter
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chapters
                            .slice((currentPage - 1) * CHAPTERS_PER_PAGE, currentPage * CHAPTERS_PER_PAGE)
                            .map(chapter => (
                                <div
                                    key={chapter._id}
                                    className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 relative group hover:border-cyan-500/50 transition-all cursor-pointer"
                                    onClick={() => setCurrentChapter(chapter)}
                                >
                                    {/* Actions */}
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-100 z-10 bg-gray-900/50 rounded-lg p-1">
                                        <button onClick={(e) => { e.stopPropagation(); openEditChapter(chapter); }} className="text-blue-400 hover:text-blue-300 p-1">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteChapter(chapter._id); }} className="text-red-400 hover:text-red-300 p-1">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-16 h-16 rounded-xl bg-${chapter.color}-500/20 flex items-center justify-center text-${chapter.color}-400 text-2xl flex-shrink-0`}>
                                            <i className={`fas ${chapter.icon}`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded">
                                                    Class {chapter.classLevel || '11'}
                                                </span>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded ${chapter.difficultyLevel === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                    chapter.difficultyLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {chapter.difficultyLevel}
                                                </span>
                                            </div>
                                            <h4 className="text-xl font-bold text-white mb-2 line-clamp-1">{chapter.name}</h4>
                                            {chapter.subject && (
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2 ${
                                                    chapter.subject === 'Physical Chemistry' ? 'bg-purple-500/20 text-purple-400' :
                                                    chapter.subject === 'Inorganic Chemistry' ? 'bg-green-500/20 text-green-400' :
                                                    chapter.subject === 'Organic Chemistry' ? 'bg-orange-500/20 text-orange-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                    {chapter.subject}
                                                </span>
                                            )}
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-2">{chapter.description}</p>
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                <span>
                                                    <i className="fas fa-clock mr-1"></i>
                                                    {chapter.timeLimit || 60} min
                                                </span>
                                                <span>
                                                    <i className="fas fa-question-circle mr-1"></i>
                                                    {chapter.questionCount || 0} questions
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
                                        <span>Click to manage questions</span>
                                        <i className="fas fa-arrow-right text-cyan-400"></i>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Chapters Pagination */}
                    {chapters.length > CHAPTERS_PER_PAGE && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(chapters.length / CHAPTERS_PER_PAGE)}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>

                {/* Chapter Form Modal */}
                {showChapterForm && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                            <h3 className="text-2xl font-bold text-white mb-6">
                                {editingItem ? 'Edit Chapter' : 'Add Chapter'}
                            </h3>
                            <form onSubmit={handleChapterSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Chapter Name *</label>
                                    <input
                                        type="text"
                                        value={chapterForm.name}
                                        onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Subject *</label>
                                    <select
                                        value={chapterForm.subject}
                                        onChange={(e) => setChapterForm({ ...chapterForm, subject: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        required
                                    >
                                        <option value="Physical Chemistry">⚛️ Physical Chemistry</option>
                                        <option value="Inorganic Chemistry">🧪 Inorganic Chemistry</option>
                                        <option value="Organic Chemistry">🌿 Organic Chemistry</option>
                                        <option value="Practical">🔬 Practical</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Description</label>
                                    <textarea
                                        value={chapterForm.description}
                                        onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        rows="3"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Class Level *</label>
                                        <select
                                            value={chapterForm.classLevel}
                                            onChange={(e) => setChapterForm({ ...chapterForm, classLevel: e.target.value })}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                            required
                                        >
                                            <option value="11">Class 11</option>
                                            <option value="12">Class 12</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-2">Difficulty Level</label>
                                        <select
                                            value={chapterForm.difficultyLevel}
                                            onChange={(e) => setChapterForm({ ...chapterForm, difficultyLevel: e.target.value })}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Tough">Tough</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-2">Time Limit (minutes)</label>
                                        <input
                                            type="number"
                                            value={chapterForm.timeLimit}
                                            onChange={(e) => setChapterForm({ ...chapterForm, timeLimit: parseInt(e.target.value) })}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Icon</label>
                                        <select
                                            value={chapterForm.icon}
                                            onChange={(e) => setChapterForm({ ...chapterForm, icon: e.target.value })}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        >
                                            <option value="fa-flask">🧪 Flask (fa-flask)</option>
                                            <option value="fa-atom">⚛️  Atom (fa-atom)</option>
                                            <option value="fa-fire">🔥 Fire (fa-fire)</option>
                                            <option value="fa-vial">🧫 Vial (fa-vial)</option>
                                            <option value="fa-microscope">🔬 Microscope (fa-microscope)</option>
                                            <option value="fa-book">📚 Book (fa-book)</option>
                                            <option value="fa-graduation-cap">🎓 Graduation Cap (fa-graduation-cap)</option>
                                            <option value="fa-dna">🧬 DNA (fa-dna)</option>
                                            <option value="fa-cube">📦 Cube (fa-cube)</option>
                                            <option value="fa-battery-full">🔋 Battery (fa-battery-full)</option>
                                            <option value="fa-link">🔗 Link (fa-link)</option>
                                            <option value="fa-balance-scale">⚖️  Balance (fa-balance-scale)</option>
                                            <option value="fa-wind">💨 Wind (fa-wind)</option>
                                            <option value="fa-tachometer-alt">⏱️  Tachometer (fa-tachometer-alt)</option>
                                            <option value="fa-project-diagram">📊 Diagram (fa-project-diagram)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Color</label>
                                        <select
                                            value={chapterForm.color}
                                            onChange={(e) => setChapterForm({ ...chapterForm, color: e.target.value })}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        >
                                            <option value="cyan">Cyan</option>
                                            <option value="blue">Blue</option>
                                            <option value="green">Green</option>
                                            <option value="yellow">Yellow</option>
                                            <option value="orange">Orange</option>
                                            <option value="red">Red</option>
                                            <option value="purple">Purple</option>
                                            <option value="pink">Pink</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-2">Order</label>
                                        <input
                                            type="number"
                                            value={chapterForm.order}
                                            onChange={(e) => setChapterForm({ ...chapterForm, order: parseInt(e.target.value) })}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={chapterForm.isActive}
                                        onChange={(e) => setChapterForm({ ...chapterForm, isActive: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label className="text-gray-400">Active</label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-cyan-500 text-black px-6 py-3 rounded font-bold hover:bg-cyan-400 transition disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeChapterForm}
                                        className="flex-1 bg-gray-700 text-white px-6 py-3 rounded font-bold hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Questions View
    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-white mb-6">Manage DPPs</h2>

            {renderBreadcrumb()}

            <div className="glass-panel p-6 rounded-xl border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white">{currentChapter.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">{questions.length} questions</p>
                    </div>
                    <button
                        onClick={() => setShowQuestionForm(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                        <i className="fas fa-plus mr-2"></i> Add Question
                    </button>
                </div>

                <div className="space-y-4">
                    {questions
                        .slice((questionsPage - 1) * QUESTIONS_PER_PAGE, questionsPage * QUESTIONS_PER_PAGE)
                        .map((question, index) => (
                            <div
                                key={question._id}
                                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-cyan-400 font-bold">Q{((questionsPage - 1) * QUESTIONS_PER_PAGE) + index + 1}</span>
                                            <span className={`text-xs px-2 py-1 rounded ${question.difficultyLevel === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                question.difficultyLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {question.difficultyLevel}
                                            </span>
                                            <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                                                {question.questionType}
                                            </span>
                                            <span className="text-xs text-green-500">+{question.marks} marks</span>
                                            {(question.negativeMarks ?? 0) > 0 && (
                                                <span className="text-xs text-red-400">-{question.negativeMarks} neg</span>
                                            )}
                                        </div>
                                        <div
                                            className="text-white mb-3"
                                            dangerouslySetInnerHTML={{ __html: question.question }}
                                        />
                                        {question.options && question.options.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2 mt-3">
                                                {question.options.map((option, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`text-sm p-2 rounded border ${option === question.correctAnswer
                                                            ? 'border-green-500 bg-green-500/10 text-green-400 [&_*]:!text-green-400'
                                                            : 'border-gray-700 bg-gray-800/30 text-white [&_*]:!text-white'
                                                            }`}
                                                        dangerouslySetInnerHTML={{ __html: option }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => openEditQuestion(question)}
                                            className="text-blue-400 hover:text-blue-300 p-2"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuestion(question._id)}
                                            className="text-red-400 hover:text-red-300 p-2"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {/* Questions Pagination */}
                    {questions.length > QUESTIONS_PER_PAGE && (
                        <Pagination
                            currentPage={questionsPage}
                            totalPages={Math.ceil(questions.length / QUESTIONS_PER_PAGE)}
                            onPageChange={setQuestionsPage}
                        />
                    )}

                    {questions.length === 0 && (
                        <div className="text-center text-gray-500 py-12">
                            No questions added yet. Click "Add Question" to create one.
                        </div>
                    )}
                </div>
            </div>

            {/* Question Form Modal */}
            {showQuestionForm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                        <h3 className="text-2xl font-bold text-white mb-6">
                            {editingItem ? 'Edit Question' : 'Add Question'}
                        </h3>
                        <form onSubmit={handleQuestionSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-2">Question *</label>
                                <div className="quill-dark-text">
                                    <ReactQuill
                                        value={questionForm.question}
                                        onChange={(value) => setQuestionForm({ ...questionForm, question: value })}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        className="bg-white rounded"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Options (for MCQ)</label>
                                {questionForm.options.map((option, idx) => (
                                    <div key={idx} className="mb-2">
                                        <div className="quill-dark-text">
                                            <ReactQuill
                                                value={option}
                                                onChange={(value) => {
                                                    const newOptions = [...questionForm.options];
                                                    newOptions[idx] = value;
                                                    setQuestionForm({ ...questionForm, options: newOptions });
                                                }}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                className="bg-white rounded"
                                                placeholder={`Option ${idx + 1}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Correct Answer *</label>
                                <input
                                    type="text"
                                    value={questionForm.correctAnswer}
                                    onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Solution</label>
                                <div className="quill-dark-text">
                                    <ReactQuill
                                        value={questionForm.solution}
                                        onChange={(value) => setQuestionForm({ ...questionForm, solution: value })}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        className="bg-white rounded"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Hint</label>
                                <input
                                    type="text"
                                    value={questionForm.hint}
                                    onChange={(e) => setQuestionForm({ ...questionForm, hint: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Class Level *</label>
                                    <select
                                        value={questionForm.classLevel}
                                        onChange={(e) => setQuestionForm({ ...questionForm, classLevel: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        required
                                    >
                                        <option value="11">Class 11</option>
                                        <option value="12">Class 12</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Type</label>
                                    <select
                                        value={questionForm.questionType}
                                        onChange={(e) => setQuestionForm({ ...questionForm, questionType: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                    >
                                        <option value="MCQ">MCQ</option>
                                        <option value="Subjective">Subjective</option>
                                        <option value="Numerical">Numerical</option>
                                        <option value="True/False">True/False</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Marks (for correct)</label>
                                    <input
                                        type="number"
                                        value={questionForm.marks}
                                        onChange={(e) => setQuestionForm({ ...questionForm, marks: parseFloat(e.target.value) })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        min="0"
                                        step="0.5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Negative Marks (for wrong)</label>
                                    <input
                                        type="number"
                                        value={questionForm.negativeMarks}
                                        onChange={(e) => setQuestionForm({ ...questionForm, negativeMarks: parseFloat(e.target.value) })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-red-500 outline-none"
                                        min="0"
                                        step="0.25"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={questionForm.isActive}
                                    onChange={(e) => setQuestionForm({ ...questionForm, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label className="text-gray-400">Active</label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-cyan-500 text-black px-6 py-3 rounded font-bold hover:bg-cyan-400 transition disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeQuestionForm}
                                    className="flex-1 bg-gray-700 text-white px-6 py-3 rounded font-bold hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDPPS;
