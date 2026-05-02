import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ManageNTAAbhyas = () => {
    const [activeExamCategory, setActiveExamCategory] = useState('JEE');
    const [loading, setLoading] = useState(false);

    // ReactQuill configuration
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

    // Data
    const [questions, setQuestions] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [stats, setStats] = useState({ totalQuestions: 0, totalChapters: 0 });

    // Filters
    const [filterChapter, setFilterChapter] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');

    // Forms
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        examCategory: 'JEE',
        chapter: '',
        chapterNumber: '',
        question: '',
        questionType: 'MCQ',
        options: ['', '', '', ''],
        correctAnswer: '',
        solution: '',
        solutionImageFile: null,
        hint: '',
        difficulty: 'Medium',
        marks: 1,
        imageFile: null,
        year: new Date().getFullYear(),
        topic: '',
        paperNumber: '',
        isActive: true,
        classLevel: '11'
    });

    const API_URL = '/api/nta-abhyas';

    useEffect(() => {
        fetchData();
    }, [activeExamCategory, filterChapter, filterDifficulty]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch chapters for the active exam category
            const chaptersRes = await axios.get(`${API_URL}/chapters/${activeExamCategory}`);
            setChapters(chaptersRes.data);

            // Fetch questions with filters
            const params = new URLSearchParams();
            params.append('examCategory', activeExamCategory);
            if (filterChapter) params.append('chapter', filterChapter);
            if (filterDifficulty) params.append('difficulty', filterDifficulty);

            const questionsRes = await axios.get(`${API_URL}/admin/all?${params}`);
            setQuestions(questionsRes.data);

            // Fetch stats
            const statsRes = await axios.get(`${API_URL}/stats`);
            const examStats = statsRes.data.find(s => s.examCategory === activeExamCategory);
            setStats(examStats || { totalQuestions: 0, totalChapters: 0 });

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();

            // Basic fields
            submitData.append('examCategory', formData.examCategory);
            submitData.append('chapter', formData.chapter);
            if (formData.chapterNumber) submitData.append('chapterNumber', formData.chapterNumber);
            submitData.append('question', formData.question);
            submitData.append('questionType', formData.questionType);
            submitData.append('correctAnswer', formData.correctAnswer);
            submitData.append('solution', formData.solution || '');
            submitData.append('hint', formData.hint || '');
            submitData.append('difficulty', formData.difficulty);
            submitData.append('marks', formData.marks);
            submitData.append('year', formData.year);
            if (formData.topic) submitData.append('topic', formData.topic);
            if (formData.paperNumber) submitData.append('paperNumber', formData.paperNumber);
            submitData.append('isActive', formData.isActive);
            submitData.append('classLevel', formData.classLevel);

            // Options for MCQ
            if (formData.questionType === 'MCQ') {
                submitData.append('options', JSON.stringify(formData.options));
            }

            // Image files
            if (formData.imageFile) {
                submitData.append('image', formData.imageFile);
            }
            if (formData.solutionImageFile) {
                submitData.append('solutionImage', formData.solutionImageFile);
            }

            if (editingQuestion) {
                await axios.put(`${API_URL}/admin/update/${editingQuestion._id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Question updated successfully!');
            } else {
                await axios.post(`${API_URL}/admin/create`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Question created successfully!');
            }

            closeForm();
            fetchData();

        } catch (error) {
            console.error('Error saving question:', error);
            toast.error(error.response?.data?.message || 'Failed to save question');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;

        try {
            await axios.delete(`${API_URL}/admin/delete/${id}`);
            toast.success('Question deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting question:', error);
            toast.error('Failed to delete question');
        }
    };

    const openEdit = (question) => {
        setEditingQuestion(question);
        setFormData({
            examCategory: question.examCategory,
            chapter: question.chapter,
            chapterNumber: question.chapterNumber || '',
            question: question.question,
            questionType: question.questionType || 'MCQ',
            options: question.options || ['', '', '', ''],
            correctAnswer: question.correctAnswer,
            solution: question.solution || '',
            solutionImageFile: null,
            hint: question.hint || '',
            difficulty: question.difficulty || 'Medium',
            marks: question.marks || 1,
            imageFile: null,
            year: question.year || new Date().getFullYear(),
            topic: question.topic || '',
            paperNumber: question.paperNumber || '',
            isActive: question.isActive !== false,
            classLevel: question.classLevel || '11'
        });
        setShowQuestionForm(true);
    };

    const closeForm = () => {
        setShowQuestionForm(false);
        setEditingQuestion(null);
        setFormData({
            examCategory: activeExamCategory,
            chapter: '',
            chapterNumber: '',
            question: '',
            questionType: 'MCQ',
            options: ['', '', '', ''],
            correctAnswer: '',
            solution: '',
            solutionImageFile: null,
            hint: '',
            difficulty: 'Medium',
            marks: 1,
            imageFile: null,
            year: new Date().getFullYear(),
            topic: '',
            paperNumber: '',
            isActive: true,
            classLevel: '11'
        });
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'Hard': return 'bg-red-500/20 text-red-400 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-white mb-6">Manage NTA Abhyas</h2>

            {/* Exam Category Tabs */}
            <div className="flex gap-4 mb-6">
                {['JEE', 'NEET'].map(exam => (
                    <button
                        key={exam}
                        onClick={() => {
                            setActiveExamCategory(exam);
                            setFilterChapter('');
                            setFilterDifficulty('');
                        }}
                        className={`px-6 py-3 rounded-lg font-bold transition ${activeExamCategory === exam
                            ? exam === 'JEE'
                                ? 'bg-blue-500 text-white'
                                : 'bg-green-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        <i className={`fas ${exam === 'JEE' ? 'fa-atom' : 'fa-microscope'} mr-2`}></i>
                        {exam}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-panel p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Total Questions</div>
                    <div className="text-2xl font-bold text-white">{stats.totalQuestions || questions.length}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Total Chapters</div>
                    <div className="text-2xl font-bold text-white">{stats.totalChapters || chapters.length}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Active Exam</div>
                    <div className="text-2xl font-bold text-white">{activeExamCategory}</div>
                </div>
            </div>

            {/* Filters and Add Button */}
            <div className="glass-panel p-6 rounded-xl border border-gray-700 mb-6">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-gray-400 text-sm mb-2">Filter by Chapter</label>
                        <select
                            value={filterChapter}
                            onChange={(e) => setFilterChapter(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                        >
                            <option value="">All Chapters</option>
                            {chapters.map((ch, idx) => (
                                <option key={idx} value={ch.name}>{ch.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-gray-400 text-sm mb-2">Filter by Difficulty</label>
                        <select
                            value={filterDifficulty}
                            onChange={(e) => setFilterDifficulty(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                        >
                            <option value="">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <button
                        onClick={() => {
                            setFormData({ ...formData, examCategory: activeExamCategory });
                            setShowQuestionForm(true);
                        }}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-bold"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Add Question
                    </button>
                </div>
            </div>

            {/* Questions List */}
            <div className="glass-panel p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">
                    Questions ({questions.length})
                </h3>

                {loading ? (
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-500 border-t-transparent"></div>
                        <p className="text-gray-400 mt-2">Loading...</p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <i className="fas fa-clipboard-list text-6xl mb-4"></i>
                        <p>No questions found. Add one to get started!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.map((q, idx) => (
                            <div
                                key={q._id}
                                className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded font-bold">
                                            Q{idx + 1}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(q.difficulty)}`}>
                                            {q.difficulty}
                                        </span>
                                        {q.classLevel && (
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${q.classLevel === '11'
                                                ? 'bg-purple-500/20 text-purple-400'
                                                : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                Class {q.classLevel}
                                            </span>
                                        )}
                                        <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded">
                                            {q.questionType}
                                        </span>
                                        <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">
                                            {q.chapter}
                                        </span>
                                        {q.marks && (
                                            <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded">
                                                {q.marks} marks
                                            </span>
                                        )}
                                        {q.paperNumber && (
                                            <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded border border-orange-500/50">
                                                <i className="fas fa-atom mr-1"></i>Paper {q.paperNumber}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEdit(q)}
                                            className="text-blue-400 hover:text-blue-300 transition"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(q._id)}
                                            className="text-red-400 hover:text-red-300 transition"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Question Text */}
                                <p className="text-white mb-3 font-medium ql-editor-content" dangerouslySetInnerHTML={{ __html: q.question }}></p>

                                {/* Image */}
                                {q.imageUrl && (
                                    <img
                                        src={q.imageUrl}
                                        alt="Question"
                                        className="max-w-xs rounded border border-gray-600 mb-3"
                                    />
                                )}

                                {/* Options */}
                                {q.options && q.options.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                                        {q.options.map((opt, i) => (
                                            <div
                                                key={i}
                                                className={`p-2 rounded ${opt === q.correctAnswer
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/50 font-bold'
                                                    : 'bg-gray-700/50 text-gray-300'
                                                    }`}
                                            >
                                                <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                                                <span className="ql-editor-content" dangerouslySetInnerHTML={{ __html: opt }} />
                                                {opt === q.correctAnswer && (
                                                    <i className="fas fa-check-circle ml-2"></i>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Additional Info */}
                                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                                    {q.topic && <span>Topic: {q.topic}</span>}
                                    {q.year && <span>Year: {q.year}</span>}
                                    {q.hint && <span className="text-yellow-400"><i className="fas fa-lightbulb mr-1"></i>Has Hint</span>}
                                    {q.solution && <span className="text-cyan-400"><i className="fas fa-check-double mr-1"></i>Has Solution</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Question Form Modal */}
            {showQuestionForm && (
                <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-gray-900 rounded-xl w-full max-w-3xl border border-gray-700 p-6 my-8">
                        <h3 className="text-2xl font-bold text-white mb-6">
                            {editingQuestion ? 'Edit' : 'Add'} Question
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Class Level */}
                            <div>
                                <label className="block text-gray-400 mb-2">Class Level</label>
                                <select
                                    value={formData.classLevel}
                                    onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                >
                                    <option value="11">Class 11</option>
                                    <option value="12">Class 12</option>
                                </select>
                            </div>

                            {/* Exam Category & Chapter */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Exam Category</label>
                                    <select
                                        required
                                        value={formData.examCategory}
                                        onChange={(e) => setFormData({ ...formData, examCategory: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                    >
                                        <option value="JEE">JEE</option>
                                        <option value="NEET">NEET</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Chapter *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.chapter}
                                        onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                        placeholder="e.g., Chemical Reactions"
                                    />
                                </div>
                            </div>

                            {/* Chapter Number & Question Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Chapter Number</label>
                                    <input
                                        type="text"
                                        value={formData.chapterNumber}
                                        onChange={(e) => setFormData({ ...formData, chapterNumber: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                        placeholder="e.g., 01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Question Type</label>
                                    <select
                                        value={formData.questionType}
                                        onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                    >
                                        <option value="MCQ">MCQ</option>
                                        <option value="Numerical">Numerical</option>
                                        <option value="Subjective">Subjective</option>
                                    </select>
                                </div>
                            </div>

                            {/* Question Text */}
                            <div>
                                <label className="block text-gray-400 mb-2">Question *</label>
                                <div className="nta-question-editor">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.question}
                                        onChange={(content) => setFormData({ ...formData, question: content })}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter the question text..."
                                        className="bg-gray-900 text-white rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Question Image */}
                            <div>
                                <label className="block text-gray-400 mb-2">Question Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                />
                            </div>

                            {/* Options (for MCQ) */}
                            {formData.questionType === 'MCQ' && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {formData.options.map((opt, i) => (
                                            <div key={i}>
                                                <label className="block text-gray-400 mb-2">
                                                    Option {String.fromCharCode(65 + i)} *
                                                </label>
                                                <div className="nta-option-editor">
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={opt}
                                                        onChange={(content) => {
                                                            const newOptions = [...formData.options];
                                                            newOptions[i] = content;
                                                            setFormData({ ...formData, options: newOptions });
                                                        }}
                                                        modules={quillModules}
                                                        formats={quillFormats}
                                                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                                        className="bg-gray-900 text-white rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-2">Correct Answer *</label>
                                        <select
                                            required
                                            value={formData.correctAnswer}
                                            onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                        >
                                            <option value="">Select Correct Answer</option>
                                            {formData.options.map((opt, i) => {
                                                const tmp = document.createElement('div');
                                                tmp.innerHTML = opt;
                                                const text = tmp.textContent || tmp.innerText || '';
                                                const letter = String.fromCharCode(65 + i); // 'A', 'B', 'C', 'D'
                                                return opt && <option key={i} value={letter}>{letter}. {text}</option>;
                                            })}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Correct Answer for Non-MCQ */}
                            {formData.questionType !== 'MCQ' && (
                                <div>
                                    <label className="block text-gray-400 mb-2">Correct Answer *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.correctAnswer}
                                        onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                        placeholder="Enter the correct answer"
                                    />
                                </div>
                            )}

                            {/* Solution */}
                            <div>
                                <label className="block text-gray-400 mb-2">Solution</label>
                                <div className="nta-solution-editor">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.solution}
                                        onChange={(content) => setFormData({ ...formData, solution: content })}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter detailed solution..."
                                        className="bg-gray-900 text-white rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Solution Image */}
                            <div>
                                <label className="block text-gray-400 mb-2">Solution Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, solutionImageFile: e.target.files[0] })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                />
                            </div>

                            {/* Hint */}
                            <div>
                                <label className="block text-gray-400 mb-2">Hint</label>
                                <input
                                    type="text"
                                    value={formData.hint}
                                    onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                    placeholder="Enter a hint..."
                                />
                            </div>

                            {/* Difficulty, Marks, Year, Topic */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Difficulty</label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Marks</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.marks}
                                        onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Year</label>
                                    <input
                                        type="number"
                                        min="2000"
                                        max="2100"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Topic</label>
                                    <input
                                        type="text"
                                        value={formData.topic}
                                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>

                            {/* Paper Number */}
                            <div>
                                <label className="block text-gray-400 mb-2">NTA Abhyas Paper Number <span className="text-gray-500 text-xs">(e.g. 109, 110)</span></label>
                                <input
                                    type="text"
                                    value={formData.paperNumber}
                                    onChange={(e) => setFormData({ ...formData, paperNumber: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                    placeholder="e.g. 109 (leave blank if not applicable)"
                                />
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="isActive" className="text-gray-400">Active (visible to students)</label>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="px-6 py-2 text-gray-400 hover:text-white transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : editingQuestion ? 'Update Question' : 'Add Question'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Inject NTA Abhyas Quill editor styles
const ntaStyleSheet = document.createElement('style');
ntaStyleSheet.id = 'nta-quill-styles';
ntaStyleSheet.textContent = `
    .nta-question-editor .ql-toolbar,
    .nta-option-editor .ql-toolbar,
    .nta-solution-editor .ql-toolbar {
        display: block !important;
        background-color: rgb(31, 41, 55);
        border: 1px solid rgb(55, 65, 81);
        border-radius: 0.5rem 0.5rem 0 0;
    }
    .nta-question-editor .ql-container,
    .nta-solution-editor .ql-container {
        background-color: rgb(17, 24, 39);
        border: 1px solid rgb(55, 65, 81);
        border-radius: 0 0 0.5rem 0.5rem;
        min-height: 100px;
    }
    .nta-option-editor .ql-container {
        background-color: rgb(17, 24, 39);
        border: 1px solid rgb(55, 65, 81);
        border-radius: 0 0 0.5rem 0.5rem;
        min-height: 70px;
    }
    .nta-question-editor .ql-editor,
    .nta-option-editor .ql-editor,
    .nta-solution-editor .ql-editor {
        color: white;
        font-size: 14px;
    }
    .nta-question-editor .ql-editor.ql-blank::before,
    .nta-option-editor .ql-editor.ql-blank::before,
    .nta-solution-editor .ql-editor.ql-blank::before {
        color: rgb(156, 163, 175);
    }
    .nta-question-editor .ql-toolbar button,
    .nta-option-editor .ql-toolbar button,
    .nta-solution-editor .ql-toolbar button { color: rgb(209, 213, 219); }
    .nta-question-editor .ql-toolbar button:hover,
    .nta-option-editor .ql-toolbar button:hover,
    .nta-solution-editor .ql-toolbar button:hover { color: rgb(96, 165, 250); }
    .nta-question-editor .ql-toolbar .ql-stroke,
    .nta-option-editor .ql-toolbar .ql-stroke,
    .nta-solution-editor .ql-toolbar .ql-stroke { stroke: rgb(209, 213, 219); }
    .nta-question-editor .ql-toolbar .ql-fill,
    .nta-option-editor .ql-toolbar .ql-fill,
    .nta-solution-editor .ql-toolbar .ql-fill { fill: rgb(209, 213, 219); }
    .nta-question-editor .ql-toolbar .ql-picker-label,
    .nta-option-editor .ql-toolbar .ql-picker-label,
    .nta-solution-editor .ql-toolbar .ql-picker-label { color: rgb(209, 213, 219); }
    .nta-question-editor .ql-picker-options,
    .nta-option-editor .ql-picker-options,
    .nta-solution-editor .ql-picker-options {
        background-color: rgb(31, 41, 55);
        border-color: rgb(55, 65, 81);
        color: rgb(209, 213, 219);
    }
`;
if (!document.head.querySelector('#nta-quill-styles')) {
    document.head.appendChild(ntaStyleSheet);
}

export default ManageNTAAbhyas;
