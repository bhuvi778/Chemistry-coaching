import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import SubjectTag from '../../components/SubjectTag';

const ManagePYQ = () => {
    const [view, setView] = useState('chapters'); // 'chapters', 'topics', 'questions'
    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ chapters: 0, topics: 0, questions: 0 });

    // Form states
    const [showChapterForm, setShowChapterForm] = useState(false);
    const [showTopicForm, setShowTopicForm] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form data
    const [chapterForm, setChapterForm] = useState({
        examName: 'JEE Main',
        subject: 'Physical Chemistry',
        chapterName: '',
        chapterNumber: '',
        description: '',
        icon: 'fa-atom',
        color: 'cyan',
        batchName: '',
        shift: '',
        timing: '',
        isActive: true
    });

    const [topicForm, setTopicForm] = useState({
        topicName: '',
        description: '',
        isActive: true
    });

    const [questionForm, setQuestionForm] = useState({
        question: '',
        questionType: 'Single Correct',
        options: ['', '', '', ''],
        correctAnswer: '',
        solution: '',
        hint: '',
        difficulty: 'Medium',
        yearBadge: '',
        examYear: new Date().getFullYear(),
        isActive: true
    });

    const API_URL = '/api/pyq';

    useEffect(() => {
        fetchChapters();
        fetchStats();
    }, []);

    const fetchChapters = async () => {
        setLoading(true);
        console.log('📥 Fetching chapters from API...');
        try {
            const res = await axios.get(`${API_URL}/chapters`);
            console.log('✅ Chapters loaded:', res.data.length, 'chapters');
            console.log('📋 Chapter IDs:', res.data.map(ch => ({ id: ch._id, name: ch.chapterName })));
            setChapters(res.data);
        } catch (error) {
            console.error('❌ Failed to load chapters:', error);
            toast.error('Failed to load chapters');
        } finally {
            setLoading(false);
        }
    };

    const fetchTopics = async (chapterId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/topics/chapter/${chapterId}`);
            setTopics(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load topics');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestions = async (topicId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/questions?topicId=${topicId}`);
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

    // Chapter CRUD
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

    const handleDeleteChapter = async (id) => {
        if (!window.confirm('Delete this chapter and all its topics/questions?')) return;

        console.log('🗑️ Attempting to delete chapter:', id);

        try {
            const response = await axios.delete(`${API_URL}/chapters/${id}`);
            console.log('✅ Delete successful:', response.data);
            toast.success('Chapter deleted');
            // Immediately update UI
            setChapters(prevChapters => {
                const updated = prevChapters.filter(ch => ch._id !== id);
                console.log('📊 Chapters after delete:', updated.length);
                return updated;
            });
            fetchStats();
        } catch (error) {
            console.error('❌ Delete error:', error.response?.status, error.response?.data);
            // If 404, item already doesn't exist - still remove from UI
            if (error.response?.status === 404) {
                console.log('⚠️ Chapter not found in DB, removing from UI anyway');
                toast.success('Chapter already removed');
                setChapters(prevChapters => prevChapters.filter(ch => ch._id !== id));
            } else {
                toast.error('Failed to delete');
            }
        }
    };

    // Topic CRUD
    const handleTopicSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...topicForm, chapterId: selectedChapter._id };
            if (editingItem) {
                await axios.put(`${API_URL}/topics/${editingItem._id}`, payload);
                toast.success('Topic updated successfully');
            } else {
                await axios.post(`${API_URL}/topics`, payload);
                toast.success('Topic created successfully');
            }
            closeTopicForm();
            fetchTopics(selectedChapter._id);
            fetchStats();
        } catch (error) {
            console.error(error);
            toast.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTopic = async (id) => {
        if (!window.confirm('Delete this topic and all its questions?')) return;
        try {
            await axios.delete(`${API_URL}/topics/${id}`);
            toast.success('Topic deleted');
            // Immediately update UI
            setTopics(prevTopics => prevTopics.filter(t => t._id !== id));
            fetchStats();
        } catch (error) {
            // If 404, item already doesn't exist - still remove from UI
            if (error.response?.status === 404) {
                toast.success('Topic already removed');
                setTopics(prevTopics => prevTopics.filter(t => t._id !== id));
            } else {
                toast.error('Failed to delete');
            }
        }
    };

    // Question CRUD
    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...questionForm,
                chapterId: selectedChapter._id,
                topicId: selectedTopic._id,
                examName: selectedChapter.examName,
                subject: selectedChapter.subject
            };

            if (editingItem) {
                await axios.put(`${API_URL}/questions/${editingItem._id}`, payload);
                toast.success('Question updated successfully');
            } else {
                await axios.post(`${API_URL}/questions`, payload);
                toast.success('Question created successfully');
            }
            closeQuestionForm();
            fetchQuestions(selectedTopic._id);
            fetchStats();
        } catch (error) {
            console.error(error);
            toast.error('Operation failed: ' + (error.response?.data?.details || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            await axios.delete(`${API_URL}/questions/${id}`);
            toast.success('Question deleted');
            // Immediately update UI
            setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== id));
            fetchStats();
        } catch (error) {
            // If 404, item already doesn't exist - still remove from UI
            if (error.response?.status === 404) {
                toast.success('Question already removed');
                setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== id));
            } else {
                toast.error('Failed to delete');
            }
        }
    };

    // Form helpers
    const openEditChapter = (chapter) => {
        setEditingItem(chapter);
        setChapterForm({
            examName: chapter.examName,
            subject: chapter.subject,
            chapterName: chapter.chapterName,
            chapterNumber: chapter.chapterNumber,
            description: chapter.description || '',
            icon: chapter.icon,
            color: chapter.color,
            batchName: chapter.batchName || '',
            shift: chapter.shift || '',
            timing: chapter.timing || '',
            isActive: chapter.isActive
        });
        setShowChapterForm(true);
    };

    const openEditTopic = (topic) => {
        setEditingItem(topic);
        setTopicForm({
            topicName: topic.topicName,
            description: topic.description || '',
            isActive: topic.isActive
        });
        setShowTopicForm(true);
    };

    const openEditQuestion = (question) => {
        setEditingItem(question);
        setQuestionForm({
            question: question.question,
            questionType: question.questionType,
            options: question.options || ['', '', '', ''],
            correctAnswer: question.correctAnswer,
            solution: question.solution || '',
            hint: question.hint || '',
            difficulty: question.difficulty,
            yearBadge: question.yearBadge,
            examYear: question.examYear,
            isActive: question.isActive
        });
        setShowQuestionForm(true);
    };

    const closeChapterForm = () => {
        setShowChapterForm(false);
        setEditingItem(null);
        setChapterForm({
            examName: 'JEE Main',
            subject: 'Physical Chemistry',
            chapterName: '',
            chapterNumber: '',
            description: '',
            icon: 'fa-atom',
            color: 'cyan',
            batchName: '',
            shift: '',
            timing: '',
            isActive: true
        });
    };

    const closeTopicForm = () => {
        setShowTopicForm(false);
        setEditingItem(null);
        setTopicForm({
            topicName: '',
            description: '',
            isActive: true
        });
    };

    const closeQuestionForm = () => {
        setShowQuestionForm(false);
        setEditingItem(null);
        setQuestionForm({
            question: '',
            questionType: 'Single Correct',
            options: ['', '', '', ''],
            correctAnswer: '',
            solution: '',
            hint: '',
            difficulty: 'Medium',
            yearBadge: '',
            examYear: new Date().getFullYear(),
            isActive: true
        });
    };

    const handleChapterClick = (chapter) => {
        setSelectedChapter(chapter);
        setView('topics');
        fetchTopics(chapter._id);
    };

    const handleTopicClick = (topic) => {
        setSelectedTopic(topic);
        setView('questions');
        fetchQuestions(topic._id);
    };

    const handleBackToChapters = () => {
        setView('chapters');
        setSelectedChapter(null);
        setTopics([]);
    };

    const handleBackToTopics = () => {
        setView('topics');
        setSelectedTopic(null);
        setQuestions([]);
    };

    const renderBreadcrumb = () => {
        return (
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 bg-gray-900/50 p-3 rounded-lg border border-gray-700 w-fit">
                <button
                    onClick={handleBackToChapters}
                    className={`hover:text-cyan-400 ${view === 'chapters' ? 'font-bold text-white' : ''}`}
                >
                    Chapters
                </button>
                {selectedChapter && (
                    <>
                        <i className="fas fa-chevron-right text-xs"></i>
                        <button
                            onClick={handleBackToTopics}
                            className={`hover:text-cyan-400 ${view === 'topics' ? 'font-bold text-white' : ''}`}
                        >
                            {selectedChapter.chapterName}
                        </button>
                    </>
                )}
                {selectedTopic && (
                    <>
                        <i className="fas fa-chevron-right text-xs"></i>
                        <span className="text-white font-bold">{selectedTopic.topicName}</span>
                    </>
                )}
            </div>
        );
    };

    // Chapters View
    if (view === 'chapters') {
        return (
            <div className="w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Manage PYQ</h2>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="glass-panel p-4 rounded-xl border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Total Chapters</div>
                        <div className="text-3xl font-bold text-white">{stats.chapters || 0}</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Total Topics</div>
                        <div className="text-3xl font-bold text-white">{stats.topics || 0}</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Total Questions</div>
                        <div className="text-3xl font-bold text-white">{stats.questions || 0}</div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">PYQ Chapters</h3>
                        <button
                            onClick={() => setShowChapterForm(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            <i className="fas fa-plus mr-2"></i> Add Chapter
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading...</div>
                    ) : chapters.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            No chapters found. Click "Add Chapter" to create one.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {chapters.map(chapter => (
                                <div
                                    key={chapter._id}
                                    className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer group relative"
                                >
                                    {/* Action Buttons */}
                                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEditChapter(chapter); }}
                                            className="text-blue-400 hover:text-blue-300 p-2 bg-gray-900/80 rounded"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteChapter(chapter._id); }}
                                            className="text-red-400 hover:text-red-300 p-2 bg-gray-900/80 rounded"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>

                                    <div onClick={() => handleChapterClick(chapter)}>
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded">
                                                {chapter.examName}
                                            </span>
                                            {chapter.subject && (
                                                <SubjectTag subject={chapter.subject} size="sm" />
                                            )}
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition pr-20">
                                            {chapter.chapterName}
                                        </h4>
                                        {chapter.description && (
                                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                                {chapter.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{chapter.chapterNumber}</span>
                                            <i className="fas fa-arrow-right text-cyan-400"></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Exam Name *</label>
                                        <select
                                            value={chapterForm.examName}
                                            onChange={(e) => setChapterForm({ ...chapterForm, examName: e.target.value })}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                            required
                                        >
                                            <option value="JEE Main">JEE Main</option>
                                            <option value="JEE Advanced">JEE Advanced</option>
                                            <option value="NEET">NEET</option>
                                            <option value="BITSAT">BITSAT</option>
                                            <option value="NEST">NEST</option>
                                            <option value="IAT">IAT</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">Subject *</label>
                                        <select
                                            value={chapterForm.subject}
                                            onChange={(e) => setChapterForm({ ...chapterForm, subject: e.target.value })}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                            required
                                        >
                                            <option value="Physical Chemistry">Physical Chemistry</option>
                                            <option value="Inorganic Chemistry">Inorganic Chemistry</option>
                                            <option value="Organic Chemistry">Organic Chemistry</option>
                                            <option value="Practical">Practical</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Chapter Name *</label>
                                    <input
                                        type="text"
                                        value={chapterForm.chapterName}
                                        onChange={(e) => setChapterForm({ ...chapterForm, chapterName: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Chapter Number</label>
                                    <input
                                        type="text"
                                        value={chapterForm.chapterNumber}
                                        onChange={(e) => setChapterForm({ ...chapterForm, chapterNumber: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        placeholder="e.g., Chapter 1"
                                    />
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Icon</label>
                                        <select
                                            value={chapterForm.icon}
                                            onChange={(e) => setChapterForm({ ...chapterForm, icon: e.target.value })}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        >
                                            <option value="fa-atom">⚛️ Atom</option>
                                            <option value="fa-flask">🧪 Flask</option>
                                            <option value="fa-fire">🔥 Fire</option>
                                            <option value="fa-bolt">⚡ Bolt</option>
                                            <option value="fa-microscope">🔬 Microscope</option>
                                            <option value="fa-rocket">🚀 Rocket</option>
                                            <option value="fa-square-root-alt">√ Square Root</option>
                                        </select>
                                    </div>
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
                                        </select>
                                    </div>
                                </div>

                                {/* Batch Information Section */}
                                <div className="border-t border-gray-700 pt-4 mt-4">
                                    <h4 className="text-white font-semibold mb-3">Batch Information</h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-400 mb-2">Batch Name</label>
                                            <input
                                                type="text"
                                                value={chapterForm.batchName}
                                                onChange={(e) => setChapterForm({ ...chapterForm, batchName: e.target.value })}
                                                className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                                placeholder="e.g., Batch A"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-2">Shift</label>
                                            <select
                                                value={chapterForm.shift}
                                                onChange={(e) => setChapterForm({ ...chapterForm, shift: e.target.value })}
                                                className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                            >
                                                <option value="">Select Shift</option>
                                                <option value="Morning">Morning</option>
                                                <option value="Afternoon">Afternoon</option>
                                                <option value="Evening">Evening</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-gray-400 mb-2">Timing</label>
                                        <input
                                            type="text"
                                            value={chapterForm.timing}
                                            onChange={(e) => setChapterForm({ ...chapterForm, timing: e.target.value })}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                            placeholder="e.g., 9:00 AM - 12:00 PM"
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

    // Topics View
    if (view === 'topics') {
        return (
            <div className="w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Manage PYQ</h2>
                {renderBreadcrumb()}

                <div className="glass-panel p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white">{selectedChapter.chapterName}</h3>
                            <p className="text-sm text-gray-400 mt-1">{topics.length} topics</p>
                        </div>
                        <button
                            onClick={() => setShowTopicForm(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            <i className="fas fa-plus mr-2"></i> Add Topic
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading...</div>
                    ) : topics.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            No topics found. Click "Add Topic" to create one.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {topics.map((topic, index) => (
                                <div
                                    key={topic._id}
                                    className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer group relative"
                                >
                                    {/* Action Buttons */}
                                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEditTopic(topic); }}
                                            className="text-blue-400 hover:text-blue-300 p-2 bg-gray-900/80 rounded"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteTopic(topic._id); }}
                                            className="text-red-400 hover:text-red-300 p-2 bg-gray-900/80 rounded"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>

                                    <div onClick={() => handleTopicClick(topic)}>
                                        <div className="text-xs text-gray-500 mb-1">Topic {index + 1}</div>
                                        <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition pr-20">
                                            {topic.topicName}
                                        </h4>
                                        {topic.description && (
                                            <p className="text-sm text-gray-400 mt-1">{topic.description}</p>
                                        )}
                                        <div className="flex items-center justify-end mt-2">
                                            <i className="fas fa-arrow-right text-cyan-400"></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Topic Form Modal */}
                {showTopicForm && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full border border-gray-700">
                            <h3 className="text-2xl font-bold text-white mb-6">
                                {editingItem ? 'Edit Topic' : 'Add Topic'}
                            </h3>
                            <form onSubmit={handleTopicSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Topic Name *</label>
                                    <input
                                        type="text"
                                        value={topicForm.topicName}
                                        onChange={(e) => setTopicForm({ ...topicForm, topicName: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Description</label>
                                    <textarea
                                        value={topicForm.description}
                                        onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        rows="3"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={topicForm.isActive}
                                        onChange={(e) => setTopicForm({ ...topicForm, isActive: e.target.checked })}
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
                                        onClick={closeTopicForm}
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

    // Questions View - Continued in next part due to length...
    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-white mb-6">Manage PYQ</h2>
            {renderBreadcrumb()}

            <div className="glass-panel p-6 rounded-xl border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white">{selectedTopic.topicName}</h3>
                        <p className="text-sm text-gray-400 mt-1">{questions.length} questions</p>
                    </div>
                    <button
                        onClick={() => setShowQuestionForm(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                        <i className="fas fa-plus mr-2"></i> Add Question
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-400">Loading...</div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        No questions found. Click "Add Question" to create one.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.map((question, index) => (
                            <div
                                key={question._id}
                                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 relative"
                            >
                                {/* Action Buttons */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => openEditQuestion(question)}
                                        className="text-blue-400 hover:text-blue-300 p-2 bg-gray-900/80 rounded"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuestion(question._id)}
                                        className="text-red-400 hover:text-red-300 p-2 bg-gray-900/80 rounded"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>

                                <div className="flex items-start gap-4 pr-24">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-cyan-400 font-bold">Q{index + 1}</span>
                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded">
                                                {question.yearBadge}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded ${question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {question.difficulty}
                                            </span>
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded">
                                                {question.questionType}
                                            </span>
                                        </div>
                                        <div className="text-white mb-3">{question.question}</div>
                                        {question.options && question.options.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                {question.options.map((option, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`text-sm p-2 rounded border ${String.fromCharCode(65 + idx) === question.correctAnswer
                                                            ? 'border-green-500 bg-green-500/10 text-green-400'
                                                            : 'border-gray-700 text-gray-400'
                                                            }`}
                                                    >
                                                        {String.fromCharCode(65 + idx)}. {option}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {question.questionType === 'Numerical' && (
                                            <div className="text-sm text-green-400 mb-3">
                                                <i className="fas fa-check-circle mr-2"></i>
                                                Answer: {question.correctAnswer}
                                            </div>
                                        )}
                                        {question.hint && (
                                            <div className="text-sm text-yellow-400 mb-2">
                                                <i className="fas fa-lightbulb mr-2"></i>
                                                Hint: {question.hint}
                                            </div>
                                        )}
                                        {question.solution && (
                                            <div className="text-sm text-gray-400 bg-gray-900/50 p-3 rounded">
                                                <strong className="text-green-400">Solution:</strong> {question.solution}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
                                <textarea
                                    value={questionForm.question}
                                    onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Question Type *</label>
                                    <select
                                        value={questionForm.questionType}
                                        onChange={(e) => setQuestionForm({ ...questionForm, questionType: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        required
                                    >
                                        <option value="Single Correct">Single Correct</option>
                                        <option value="Multiple Correct">Multiple Correct</option>
                                        <option value="Numerical">Numerical</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Difficulty *</label>
                                    <select
                                        value={questionForm.difficulty}
                                        onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        required
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Exam Year *</label>
                                    <input
                                        type="number"
                                        value={questionForm.examYear}
                                        onChange={(e) => setQuestionForm({ ...questionForm, examYear: parseInt(e.target.value) })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Year Badge *</label>
                                <input
                                    type="text"
                                    value={questionForm.yearBadge}
                                    onChange={(e) => setQuestionForm({ ...questionForm, yearBadge: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                    placeholder="e.g., JEE Main 2024 – 1 Jan, Shift 1"
                                    required
                                />
                            </div>

                            {questionForm.questionType !== 'Numerical' && (
                                <div>
                                    <label className="block text-gray-400 mb-2">Options</label>
                                    {questionForm.options.map((option, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                                const newOptions = [...questionForm.options];
                                                newOptions[idx] = e.target.value;
                                                setQuestionForm({ ...questionForm, options: newOptions });
                                            }}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none mb-2"
                                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                        />
                                    ))}
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-400 mb-2">Correct Answer *</label>
                                <input
                                    type="text"
                                    value={questionForm.correctAnswer}
                                    onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                    placeholder={questionForm.questionType === 'Numerical' ? 'Enter numerical value' : 'A, B, C, or D'}
                                    required
                                />
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

                            <div>
                                <label className="block text-gray-400 mb-2">Solution</label>
                                <textarea
                                    value={questionForm.solution}
                                    onChange={(e) => setQuestionForm({ ...questionForm, solution: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                    rows="3"
                                />
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

export default ManagePYQ;
