import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TopicContentManager from '../../components/TopicContentManager';

const ManageSelfLearn = () => {
    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState({});
    const [expandedChapters, setExpandedChapters] = useState({});
    const [expandedTopics, setExpandedTopics] = useState({});
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ totalChapters: 0, activeChapters: 0, totalTopics: 0, activeTopics: 0 });
    
    const [showChapterForm, setShowChapterForm] = useState(false);
    const [showTopicForm, setShowTopicForm] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [showContentManager, setShowContentManager] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    
    const [editingChapter, setEditingChapter] = useState(null);
    const [editingTopic, setEditingTopic] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [selectedChapterId, setSelectedChapterId] = useState(null);
    const [selectedTopicId, setSelectedTopicId] = useState(null);

    const BASE_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';
    const API_URL = `${BASE_URL}/self-learn`;

    // Form states
    const [chapterForm, setChapterForm] = useState({
        examType: 'NEET',
        subject: 'Physical Chemistry',
        class: '11',
        chapterName: '',
        description: '',
        order: 1,
        icon: 'fa-book',
        color: 'blue',
        isActive: true
    });

    const [topicForm, setTopicForm] = useState({
        chapterId: '',
        topicName: '',
        description: '',
        category: 'learn',
        order: 1,
        isActive: true
    });

    const [questionForm, setQuestionForm] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        difficulty: 'Medium',
        marks: 4,
        negativeMarks: 1,
        order: 1
    });

    // Quill editor modules with formatting options
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link'],
            ['clean']
        ]
    };

    // Option toolbar — compact but includes sub/super
    const quillModulesSimple = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'color': [] }],
            ['clean']
        ]
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'script', 'list', 'bullet', 'indent',
        'color', 'background', 'link'
    ];

    useEffect(() => {
        fetchChapters();
        fetchStats();
    }, []);

    const fetchChapters = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/admin/chapters?_t=${Date.now()}`);
            setChapters(res.data);
        } catch (error) {
            console.error('Error fetching chapters:', error);
            toast.error('Failed to load chapters');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/stats?_t=${Date.now()}`);
            setStats(res.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchTopics = async (chapterId) => {
        try {
            const res = await axios.get(`${API_URL}/admin/chapters/${chapterId}/topics?_t=${Date.now()}`);
            setTopics(prev => ({ ...prev, [chapterId]: res.data }));
        } catch (error) {
            console.error('Error fetching topics:', error);
            toast.error('Failed to load topics');
        }
    };

    const toggleChapter = async (chapterId) => {
        const willBeExpanded = !expandedChapters[chapterId];
        
        // If expanding, fetch latest topics
        if (willBeExpanded) {
            await fetchTopics(chapterId);
        }
        
        setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
    };

    const toggleTopic = (topicId) => {
        setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
    };

    // Chapter operations
    const handleChapterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingChapter) {
                await axios.put(`${API_URL}/admin/chapters/${editingChapter._id}`, chapterForm);
                toast.success('Chapter updated successfully');
            } else {
                await axios.post(`${API_URL}/admin/chapters`, chapterForm);
                toast.success('Chapter created successfully');
            }
            closeChapterForm();
            fetchChapters();
            fetchStats();
        } catch (error) {
            console.error('Error saving chapter:', error);
            toast.error(error.response?.data?.error || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const deleteChapter = async (id) => {
        if (!window.confirm('Delete this chapter and all its topics? This cannot be undone.')) return;
        try {
            await axios.delete(`${API_URL}/admin/chapters/${id}`);
            toast.success('Chapter deleted');
            fetchChapters();
            fetchStats();
        } catch (error) {
            console.error('Error deleting chapter:', error);
            toast.error('Failed to delete chapter');
        }
    };

    const openChapterEdit = (chapter) => {
        setEditingChapter(chapter);
        setChapterForm({
            examType: chapter.examType,
            subject: chapter.subject,
            class: chapter.class || '11',
            chapterName: chapter.chapterName,
            description: chapter.description || '',
            order: chapter.order || 1,
            icon: chapter.icon || 'fa-book',
            color: chapter.color || 'blue',
            isActive: chapter.isActive
        });
        setShowChapterForm(true);
    };

    const closeChapterForm = () => {
        setShowChapterForm(false);
        setEditingChapter(null);
        setChapterForm({
            examType: 'NEET',
            subject: 'Physical Chemistry',
            class: '11',
            chapterName: '',
            description: '',
            order: 1,
            icon: 'fa-book',
            color: 'blue',
            isActive: true
        });
    };

    // Topic operations
    const handleTopicSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingTopic) {
                await axios.put(`${API_URL}/admin/topics/${editingTopic._id}`, topicForm);
                toast.success('Topic updated successfully');
            } else {
                const data = { ...topicForm, chapterId: selectedChapterId };
                await axios.post(`${API_URL}/admin/topics`, data);
                toast.success('Topic created successfully');
            }
            
            closeTopicForm();
            await fetchTopics(selectedChapterId);
            // Ensure chapter is expanded to show the new topic
            setExpandedChapters(prev => ({ ...prev, [selectedChapterId]: true }));
            fetchStats();
        } catch (error) {
            console.error('Error saving topic:', error);
            toast.error(error.response?.data?.error || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const deleteTopic = async (chapterId, topicId) => {
        if (!window.confirm('Delete this topic and all its questions? This cannot be undone.')) return;
        try {
            await axios.delete(`${API_URL}/admin/topics/${topicId}`);
            toast.success('Topic deleted');
            await fetchTopics(chapterId);
            fetchStats();
        } catch (error) {
            console.error('Error deleting topic:', error);
            toast.error('Failed to delete topic');
        }
    };

    const openTopicEdit = (topic, chapterId) => {
        setSelectedChapterId(chapterId);
        setEditingTopic(topic);
        setTopicForm({
            chapterId: topic.chapterId,
            topicName: topic.topicName,
            description: topic.description || '',
            category: topic.category || 'learn',
            order: topic.order || 1,
            isActive: topic.isActive
        });
        setShowTopicForm(true);
    };

    const openAddTopic = async (chapterId) => {
        setSelectedChapterId(chapterId);
        setEditingTopic(null);
        setTopicForm({
            chapterId,
            topicName: '',
            description: '',
            category: 'learn',
            order: 1,
            isActive: true
        });
        setShowTopicForm(true);
        // Fetch topics if not already fetched
        if (!topics[chapterId]) {
            await fetchTopics(chapterId);
        }
        // Ensure chapter is expanded
        setExpandedChapters(prev => ({ ...prev, [chapterId]: true }));
    };

    const closeTopicForm = () => {
        setShowTopicForm(false);
        setEditingTopic(null);
        setSelectedChapterId(null);
        setTopicForm({
            chapterId: '',
            topicName: '',
            description: '',
            category: 'learn',
            order: 1,
            isActive: true
        });
    };

    // Question operations
    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const topic = await axios.get(`${API_URL}/admin/topics/${selectedTopicId}`);
            const updatedQuestions = editingQuestion !== null
                ? topic.data.questions.map((q, i) => i === editingQuestion ? questionForm : q)
                : [...(topic.data.questions || []), questionForm];

            await axios.put(`${API_URL}/admin/topics/${selectedTopicId}`, {
                ...topic.data,
                questions: updatedQuestions
            });
            
            toast.success(editingQuestion !== null ? 'Question updated' : 'Question added');
            closeQuestionForm();
            await fetchTopics(topic.data.chapterId);
            // Ensure chapter and topic are expanded to show the new question
            setExpandedChapters(prev => ({ ...prev, [topic.data.chapterId]: true }));
            setExpandedTopics(prev => ({ ...prev, [selectedTopicId]: true }));
        } catch (error) {
            console.error('Error saving question:', error);
            toast.error('Failed to save question');
        } finally {
            setLoading(false);
        }
    };

    const deleteQuestion = async (topicId, questionIndex) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            const topic = await axios.get(`${API_URL}/admin/topics/${topicId}`);
            const updatedQuestions = topic.data.questions.filter((_, i) => i !== questionIndex);
            
            await axios.put(`${API_URL}/admin/topics/${topicId}`, {
                ...topic.data,
                questions: updatedQuestions
            });
            
            toast.success('Question deleted');
            await fetchTopics(topic.data.chapterId);
        } catch (error) {
            console.error('Error deleting question:', error);
            toast.error('Failed to delete question');
        }
    };

    const openQuestionEdit = (topic, questionIndex) => {
        setSelectedTopicId(topic._id);
        setEditingQuestion(questionIndex);
        setQuestionForm(topic.questions[questionIndex]);
        setShowQuestionForm(true);
    };

    const openAddQuestion = (topicId) => {
        setSelectedTopicId(topicId);
        setEditingQuestion(null);
        setQuestionForm({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: '',
            difficulty: 'Medium',
            marks: 4,
            negativeMarks: 1,
            order: 1
        });
        setShowQuestionForm(true);
    };

    const closeQuestionForm = () => {
        setShowQuestionForm(false);
        setEditingQuestion(null);
        setSelectedTopicId(null);
        setQuestionForm({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: '',
            difficulty: 'Medium',
            marks: 4,
            negativeMarks: 1,
            order: 1
        });
    };

    // Content Manager operations
    const openContentManager = async (topic, chapterId) => {
        setSelectedTopic(topic);
        setSelectedChapterId(chapterId);
        setShowContentManager(true);
    };

    const closeContentManager = async () => {
        setShowContentManager(false);
        setSelectedTopic(null);
        // Refresh the topic data to show updated counts
        if (selectedChapterId) {
            await fetchTopics(selectedChapterId);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-white mb-6">Manage Self Learn</h2>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-panel p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Total Chapters</div>
                    <div className="text-3xl font-bold text-white">{stats.totalChapters || 0}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Active Chapters</div>
                    <div className="text-3xl font-bold text-green-400">{stats.activeChapters || 0}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Total Topics</div>
                    <div className="text-3xl font-bold text-cyan-400">{stats.totalTopics || 0}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Active Topics</div>
                    <div className="text-3xl font-bold text-blue-400">{stats.activeTopics || 0}</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="glass-panel p-6 rounded-xl border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Chapters → Topics → Questions</h3>
                    <button
                        onClick={() => setShowChapterForm(true)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded hover:opacity-90 transition shadow-lg shadow-blue-500/20"
                    >
                        <i className="fas fa-plus mr-2"></i> Add Chapter
                    </button>
                </div>

                {loading && !showChapterForm && !showTopicForm && !showQuestionForm ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading...</p>
                    </div>
                ) : chapters.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 bg-gray-800/30 rounded-xl border border-gray-700/50">
                        <i className="fas fa-book-open text-4xl mb-3 opacity-50"></i>
                        <p>No chapters found. Click "Add Chapter" to create one.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {chapters.map((chapter) => (
                            <div key={chapter._id} className="border border-gray-700 rounded-lg overflow-hidden">
                                {/* Chapter Header */}
                                <div className="bg-gray-800/50 p-4 flex items-center justify-between hover:bg-gray-800 transition">
                                    <div className="flex items-center gap-3 flex-1">
                                        <button
                                            onClick={() => toggleChapter(chapter._id)}
                                            className="text-gray-400 hover:text-white transition"
                                        >
                                            <i className={`fas fa-chevron-${expandedChapters[chapter._id] ? 'down' : 'right'} w-4`}></i>
                                        </button>
                                        <div className={`w-8 h-8 rounded-lg bg-${chapter.color || 'blue'}-500/20 flex items-center justify-center border border-${chapter.color || 'blue'}-500/30`}>
                                            <i className={`fas ${chapter.icon || 'fa-book'} text-${chapter.color || 'blue'}-400 text-sm`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="text-white font-bold">{chapter.chapterName}</h4>
                                                <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                                    Class {chapter.class || '11'}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                                                    {chapter.examType} • {chapter.subject}
                                                </span>
                                                {!chapter.isActive && (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Inactive</span>
                                                )}
                                            </div>
                                            {chapter.description && (
                                                <p className="text-gray-400 text-sm mt-1">{chapter.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openAddTopic(chapter._id)}
                                            className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500 hover:text-white transition text-sm"
                                        >
                                            <i className="fas fa-plus mr-1"></i> Topic
                                        </button>
                                        <button
                                            onClick={() => openChapterEdit(chapter)}
                                            className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => deleteChapter(chapter._id)}
                                            className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Topics */}
                                {expandedChapters[chapter._id] && (
                                    <div className="bg-gray-900/50 p-4 pl-12">
                                        {topics[chapter._id]?.length === 0 || !topics[chapter._id] ? (
                                            <div className="text-center py-6 text-gray-500 text-sm bg-gray-800/30 rounded border border-gray-700/50">
                                                No topics yet. Click "+ Topic" to add one.
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {topics[chapter._id].map((topic) => (
                                                    <div key={topic._id} className="border border-gray-700 rounded-lg overflow-hidden">
                                                        {/* Topic Header */}
                                                        <div className="bg-gray-800/50 p-3 flex items-center justify-between hover:bg-gray-800 transition">
                                                            <div className="flex items-center gap-3 flex-1">
                                                                <button
                                                                    onClick={() => toggleTopic(topic._id)}
                                                                    className="text-gray-400 hover:text-white transition"
                                                                >
                                                                    <i className={`fas fa-chevron-${expandedTopics[topic._id] ? 'down' : 'right'} w-4`}></i>
                                                                </button>
                                                                <i className="fas fa-bookmark text-cyan-400"></i>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <h5 className="text-white font-semibold">{topic.topicName}</h5>
                                                                        {/* Category Badge */}
                                                                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                                                                            topic.category === 'learn' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                                            topic.category === 'practice' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                                            topic.category === 'revise' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                                                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                                                        }`}>
                                                                            {topic.category === 'learn' ? '📚 Learn' :
                                                                             topic.category === 'practice' ? '💪 Practice' :
                                                                             topic.category === 'revise' ? '🔄 Revise' : '❓ Uncategorized'}
                                                                        </span>
                                                                        <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                                                                            <i className="fas fa-video mr-1"></i>{topic.videoCount || 0}
                                                                        </span>
                                                                        <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                                                                            <i className="fas fa-file-pdf mr-1"></i>{topic.sheetCount || 0}
                                                                        </span>
                                                                        <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                                                                            <i className="fas fa-tasks mr-1"></i>{topic.exerciseCount || 0}
                                                                        </span>
                                                                        {!topic.isActive && (
                                                                            <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Inactive</span>
                                                                        )}
                                                                    </div>
                                                                    {topic.description && (
                                                                        <p className="text-gray-400 text-xs mt-1">{topic.description}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => openContentManager(topic, chapter._id)}
                                                                    className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded hover:opacity-90 transition text-xs font-medium"
                                                                >
                                                                    <i className="fas fa-layer-group mr-1"></i> Manage Content
                                                                </button>
                                                                <button
                                                                    onClick={() => openTopicEdit(topic, chapter._id)}
                                                                    className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition text-sm"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteTopic(chapter._id, topic._id)}
                                                                    className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition text-sm"
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Chapter Form Modal - Shortened for brevity, includes all form fields */}
            {showChapterForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full border border-gray-700 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl font-bold text-white mb-6">
                            {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
                        </h3>
                        <form onSubmit={handleChapterSubmit} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm">Exam Type</label>
                                    <select
                                        value={chapterForm.examType}
                                        onChange={(e) => setChapterForm({ ...chapterForm, examType: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                    >
                                        <option value="NEET">NEET</option>
                                        <option value="JEE">JEE</option>
                                        <option value="IAT/NEST">IAT/NEST</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm">Subject</label>
                                    <select
                                        value={chapterForm.subject}
                                        onChange={(e) => setChapterForm({ ...chapterForm, subject: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                    >
                                        <option value="Physical Chemistry">Physical Chemistry</option>
                                        <option value="Inorganic Chemistry">Inorganic Chemistry</option>
                                        <option value="Organic Chemistry">Organic Chemistry</option>
                                        <option value="Practical">Practical</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm">Class</label>
                                    <select
                                        value={chapterForm.class}
                                        onChange={(e) => setChapterForm({ ...chapterForm, class: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                    >
                                        <option value="11">Class 11</option>
                                        <option value="12">Class 12</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Chapter Name</label>
                                <input
                                    type="text"
                                    value={chapterForm.chapterName}
                                    onChange={(e) => setChapterForm({ ...chapterForm, chapterName: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Description</label>
                                <textarea
                                    value={chapterForm.description}
                                    onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                    rows="3"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm">Order</label>
                                    <input
                                        type="number"
                                        value={chapterForm.order}
                                        onChange={(e) => setChapterForm({ ...chapterForm, order: parseInt(e.target.value) })}
                                        className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm">Icon</label>
                                    <select
                                        value={chapterForm.icon}
                                        onChange={(e) => setChapterForm({ ...chapterForm, icon: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                    >
                                        <option value="fa-book">Book</option>
                                        <option value="fa-atom">Atom</option>
                                        <option value="fa-flask">Flask</option>
                                        <option value="fa-fire">Fire</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm">Color</label>
                                    <select
                                        value={chapterForm.color}
                                        onChange={(e) => setChapterForm({ ...chapterForm, color: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                    >
                                        <option value="blue">Blue</option>
                                        <option value="cyan">Cyan</option>
                                        <option value="green">Green</option>
                                        <option value="purple">Purple</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="chapterActive"
                                    checked={chapterForm.isActive}
                                    onChange={(e) => setChapterForm({ ...chapterForm, isActive: e.target.checked })}
                                    className="w-5 h-5"
                                />
                                <label htmlFor="chapterActive" className="text-white">Active</label>
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={closeChapterForm}
                                    className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : editingChapter ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Topic Form Modal */}
            {showTopicForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full border border-gray-700 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl font-bold text-white mb-6">
                            {editingTopic ? 'Edit Topic' : 'Add New Topic'}
                        </h3>
                        <form onSubmit={handleTopicSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Topic Name</label>
                                <input
                                    type="text"
                                    value={topicForm.topicName}
                                    onChange={(e) => setTopicForm({ ...topicForm, topicName: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Description</label>
                                <textarea
                                    value={topicForm.description}
                                    onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Category</label>
                                <select
                                    value={topicForm.category}
                                    onChange={(e) => setTopicForm({ ...topicForm, category: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                >
                                    <option value="learn">Learn - Videos & Study Material</option>
                                    <option value="practice">Practice - MCQ Exercises</option>
                                    <option value="revise">Revise - Quick Review</option>
                                </select>
                                <p className="text-gray-500 text-xs mt-1">Choose which tab this topic will appear under</p>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Order</label>
                                <input
                                    type="number"
                                    value={topicForm.order}
                                    onChange={(e) => setTopicForm({ ...topicForm, order: parseInt(e.target.value) })}
                                    className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                    min="1"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="topicActive"
                                    checked={topicForm.isActive}
                                    onChange={(e) => setTopicForm({ ...topicForm, isActive: e.target.checked })}
                                    className="w-5 h-5"
                                />
                                <label htmlFor="topicActive" className="text-white">Active</label>
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={closeTopicForm}
                                    className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : editingTopic ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Question Form Modal */}
            {showQuestionForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-gray-900 rounded-xl p-6 max-w-3xl w-full border border-gray-700 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl font-bold text-white mb-6">
                            {editingQuestion !== null ? 'Edit Question' : 'Add New Question'}
                        </h3>
                        <form onSubmit={handleQuestionSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Question</label>
                                <div className="quill-wrapper">
                                    <ReactQuill
                                        theme="snow"
                                        value={questionForm.question}
                                        onChange={(value) => setQuestionForm({ ...questionForm, question: value })}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter question text with formatting..."
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {questionForm.options.map((option, idx) => (
                                    <div key={idx}>
                                        <label className="block text-gray-400 mb-2 text-sm">Option {String.fromCharCode(65 + idx)}</label>
                                        <div className="quill-wrapper quill-wrapper-sm">
                                            <ReactQuill
                                                theme="snow"
                                                value={option}
                                                onChange={(value) => {
                                                    const newOptions = [...questionForm.options];
                                                    newOptions[idx] = value;
                                                    setQuestionForm({ ...questionForm, options: newOptions });
                                                }}
                                                modules={quillModulesSimple}
                                                formats={quillFormats}
                                                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm">Correct Answer</label>
                                    <select
                                        value={questionForm.correctAnswer}
                                        onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: parseInt(e.target.value) })}
                                        className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                    >
                                        <option value={0}>Option A</option>
                                        <option value={1}>Option B</option>
                                        <option value={2}>Option C</option>
                                        <option value={3}>Option D</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm">Difficulty</label>
                                    <select
                                        value={questionForm.difficulty}
                                        onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                                        className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Explanation</label>
                                <div className="quill-wrapper">
                                    <ReactQuill
                                        theme="snow"
                                        value={questionForm.explanation}
                                        onChange={(value) => setQuestionForm({ ...questionForm, explanation: value })}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter explanation with formatting..."
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm">Marks</label>
                                    <input
                                        type="number"
                                        value={questionForm.marks}
                                        onChange={(e) => setQuestionForm({ ...questionForm, marks: parseInt(e.target.value) })}
                                        className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm">Negative Marks</label>
                                    <input
                                        type="number"
                                        value={questionForm.negativeMarks}
                                        onChange={(e) => setQuestionForm({ ...questionForm, negativeMarks: parseInt(e.target.value) })}
                                        className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={closeQuestionForm}
                                    className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : editingQuestion !== null ? 'Update' : 'Add Question'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Content Manager Modal */}
            {showContentManager && selectedTopic && (
                <TopicContentManager
                    topic={selectedTopic}
                    onUpdate={closeContentManager}
                    onClose={closeContentManager}
                />
            )}

            {/* Dark theme styling for Quill editor */}
            <style>{`
                .quill-editor .ql-toolbar {
                    background: #1f2937;
                    border: 1px solid #374151;
                    border-radius: 0.5rem 0.5rem 0 0;
                }
                
                .quill-editor .ql-container {
                    background: #111827;
                    border: 1px solid #374151;
                    border-top: none;
                    border-radius: 0 0 0.5rem 0.5rem;
                    min-height: 150px;
                }
                
                .quill-option .ql-toolbar {
                    background: #1f2937;
                    border: 1px solid #374151;
                    border-radius: 0.5rem 0.5rem 0 0;
                }
                
                .quill-option .ql-container {
                    background: #111827;
                    border: 1px solid #374151;
                    border-top: none;
                    border-radius: 0 0 0.5rem 0.5rem;
                    min-height: 80px;
                }
                
                .quill-editor .ql-editor {
                    color: white;
                    font-size: 14px;
                    min-height: 120px;
                }
                
                .quill-option .ql-editor {
                    min-height: 50px;
                }
                
                .quill-editor .ql-editor.ql-blank::before {
                    color: #9ca3af;
                    font-style: normal;
                }
                
                .quill-editor .ql-stroke {
                    stroke: #9ca3af !important;
                }
                
                .quill-editor .ql-fill {
                    fill: #9ca3af !important;
                }
                
                .quill-editor .ql-picker-label {
                    color: #9ca3af !important;
                }
                
                .quill-editor .ql-picker-options {
                    background: #1f2937;
                    border-color: #374151;
                }
                
                .quill-editor .ql-picker-item {
                    color: #9ca3af;
                }
                
                .quill-editor .ql-picker-item:hover {
                    color: #06b6d4;
                }
                
                .quill-editor .ql-toolbar button:hover,
                .quill-editor .ql-toolbar button.ql-active {
                    color: #06b6d4 !important;
                }
                
                .quill-editor .ql-toolbar button:hover .ql-stroke,
                .quill-editor .ql-toolbar button.ql-active .ql-stroke {
                    stroke: #06b6d4 !important;
                }
                
                .quill-editor .ql-toolbar button:hover .ql-fill,
                .quill-editor .ql-toolbar button.ql-active .ql-fill {
                    fill: #06b6d4 !important;
                }
                
                .quill-editor .ql-snow .ql-tooltip {
                    background: #1f2937;
                    border-color: #374151;
                    color: white;
                }
                
                .quill-editor .ql-snow .ql-tooltip input[type=text] {
                    background: #374151;
                    color: white;
                    border-color: #4b5563;
                }
                
                .quill-editor sup {
                    vertical-align: super;
                    font-size: smaller;
                }
                
                .quill-editor sub {
                    vertical-align: sub;
                    font-size: smaller;
                }
                
                .quill-option .ql-stroke {
                    stroke: #9ca3af !important;
                }
                
                .quill-option .ql-fill {
                    fill: #9ca3af !important;
                }
                
                .quill-option .ql-picker-label {
                    color: #9ca3af !important;
                }
                
                .quill-option .ql-toolbar button:hover .ql-stroke,
                .quill-option .ql-toolbar button.ql-active .ql-stroke {
                    stroke: #06b6d4 !important;
                }
                
                .quill-option .ql-toolbar button:hover .ql-fill,
                .quill-option .ql-toolbar button.ql-active .ql-fill {
                    fill: #06b6d4 !important;
                }
                
                .quill-option .ql-editor {
                    color: white;
                }
                
                .quill-option .ql-editor.ql-blank::before {
                    color: #9ca3af;
                }
            `}</style>
        </div>
    );
};

export default ManageSelfLearn;
