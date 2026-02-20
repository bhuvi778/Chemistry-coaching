import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ManageInfinitePractice = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [filters, setFilters] = useState({
        examName: '',
        subject: '',
        chapterName: '',
        difficulty: ''
    });

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

    const API_URL = '/api/infinite-practice';

    const exams = ['NEET', 'JEE Main', 'JEE Advanced'];
    
    // Chemistry subjects only
    const subjects = ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Practical'];

    // Quill editor modules with formatting options
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image', 'formula'],
            ['clean']
        ]
    };

    // Simplified toolbar for options
    const quillModulesSimple = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'color': [] }],
            ['clean']
        ]
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'script', 'list', 'bullet', 'color', 'background',
        'link', 'image', 'formula'
    ];

    useEffect(() => {
        fetchQuestions();
    }, [filters]);

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

    return (
        <div className="min-h-screen pt-32 pb-16 px-4 bg-gradient-to-b from-gray-900 via-black to-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="glass-panel rounded-xl p-6 mb-8 border border-cyan-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                <i className="fas fa-infinity mr-3 text-cyan-400"></i>
                                Manage Infinite Practice
                            </h1>
                            <p className="text-gray-400">Add and manage unlimited practice questions</p>
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowForm(!showForm);
                            }}
                            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-semibold"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            Add Question
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-panel rounded-xl p-6 mb-8 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">
                        <i className="fas fa-filter mr-2"></i>Filters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-2">Exam</label>
                            <select
                                value={filters.examName}
                                onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
                                className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                            >
                                <option value="">All Exams</option>
                                {exams.map(exam => (
                                    <option key={exam} value={exam}>{exam}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Subject</label>
                            <select
                                value={filters.subject}
                                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                                className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                            >
                                <option value="">All Subjects</option>
                                {subjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Chapter</label>
                            <input
                                type="text"
                                value={filters.chapterName}
                                onChange={(e) => setFilters({ ...filters, chapterName: e.target.value })}
                                placeholder="Enter chapter name"
                                className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Difficulty</label>
                            <select
                                value={filters.difficulty}
                                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                                className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                            >
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
                                    <button
                                        onClick={() => {
                                            setShowForm(false);
                                            resetForm();
                                        }}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <i className="fas fa-times text-2xl"></i>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Exam *</label>
                                        <select
                                            value={questionForm.examName}
                                            onChange={(e) => setQuestionForm({ ...questionForm, examName: e.target.value, subject: '' })}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                            required
                                        >
                                            {exams.map(exam => (
                                                <option key={exam} value={exam}>{exam}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">Subject *</label>
                                        <select
                                            value={questionForm.subject}
                                            onChange={(e) => setQuestionForm({ ...questionForm, subject: e.target.value })}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                            required
                                        >
                                            {subjects.map(subject => (
                                                <option key={subject} value={subject}>{subject}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Chapter Name *</label>
                                        <input
                                            type="text"
                                            value={questionForm.chapterName}
                                            onChange={(e) => setQuestionForm({ ...questionForm, chapterName: e.target.value })}
                                            className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                            required
                                        />
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
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Question *</label>
                                    <div className="bg-gray-800 rounded border border-gray-700 focus-within:border-cyan-500">
                                        <ReactQuill
                                            theme="snow"
                                            value={questionForm.question}
                                            onChange={(value) => setQuestionForm({ ...questionForm, question: value })}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            className="text-white quill-editor"
                                            placeholder="Enter question with formatting..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Options *</label>
                                    <div className="space-y-3">
                                        {questionForm.options.map((option, index) => (
                                            <div key={index}>
                                                <label className="block text-gray-300 mb-1 text-sm">
                                                    Option {String.fromCharCode(65 + index)}
                                                </label>
                                                <div className="bg-gray-800 rounded border border-gray-700 focus-within:border-cyan-500">
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={option}
                                                        onChange={(value) => handleOptionChange(index, value)}
                                                        modules={quillModulesSimple}
                                                        formats={quillFormats}
                                                        className="text-white quill-editor quill-option"
                                                        placeholder={`Enter option ${String.fromCharCode(65 + index)}...`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Correct Answer *</label>
                                    <select
                                        value={questionForm.correctAnswer}
                                        onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: parseInt(e.target.value) })}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-cyan-500 outline-none"
                                        required
                                    >
                                        {questionForm.options.map((_, index) => (
                                            <option key={index} value={index}>
                                                Option {String.fromCharCode(65 + index)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Solution</label>
                                    <div className="bg-gray-800 rounded border border-gray-700 focus-within:border-cyan-500">
                                        <ReactQuill
                                            theme="snow"
                                            value={questionForm.solution}
                                            onChange={(value) => setQuestionForm({ ...questionForm, solution: value })}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            className="text-white quill-editor"
                                            placeholder="Enter solution with formatting..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Hint</label>
                                    <div className="bg-gray-800 rounded border border-gray-700 focus-within:border-cyan-500">
                                        <ReactQuill
                                            theme="snow"
                                            value={questionForm.hint}
                                            onChange={(value) => setQuestionForm({ ...questionForm, hint: value })}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            className="text-white quill-editor"
                                            placeholder="Enter hint with formatting..."
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
                                        className="flex-1 bg-cyan-500 text-white px-6 py-3 rounded font-bold hover:bg-cyan-600 transition disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : editingQuestion ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            resetForm();
                                        }}
                                        className="flex-1 bg-gray-700 text-white px-6 py-3 rounded font-bold hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Questions List */}
                <div className="glass-panel rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">
                        Questions ({questions.length})
                    </h3>
                    
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
                            {questions.map((question, index) => (
                                <div key={question._id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-semibold">
                                                    {question.examName}
                                                </span>
                                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                                                    {question.subject}
                                                </span>
                                                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-semibold">
                                                    {question.chapterName}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                    question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {question.difficulty}
                                                </span>
                                                {!question.isActive && (
                                                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs font-semibold">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                            <div 
                                                className="text-white font-medium mb-2"
                                                dangerouslySetInnerHTML={{ __html: question.question }}
                                            />
                                            <div className="text-sm text-gray-400 space-y-1">
                                                {question.options.map((option, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={idx === question.correctAnswer ? 'text-green-400 font-semibold' : ''}
                                                    >
                                                        <span>{String.fromCharCode(65 + idx)}. </span>
                                                        <span dangerouslySetInnerHTML={{ __html: option }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(question)}
                                                className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(question._id)}
                                                className="px-3 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
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
            </div>
            
            {/* Custom styles for Quill editor dark theme */}
            <style jsx global>{`
                .quill-editor .ql-toolbar {
                    background: #1f2937;
                    border-color: #374151 !important;
                    border-radius: 0.375rem 0.375rem 0 0;
                }
                
                .quill-editor .ql-container {
                    background: #1f2937;
                    border-color: #374151 !important;
                    border-radius: 0 0 0.375rem 0.375rem;
                    min-height: 150px;
                }
                
                .quill-option .ql-container {
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
            `}</style>
        </div>
    );
};

export default ManageInfinitePractice;
