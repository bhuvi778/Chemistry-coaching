import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ManageAssertionReason = () => {
    const [chapters, setChapters] = useState([]);
    const [expandedChapters, setExpandedChapters] = useState({});
    const [loading, setLoading] = useState(false);

    // Modals
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);

    // Forms
    const [chapterForm, setChapterForm] = useState({
        name: '',
        description: '',
        icon: 'fas fa-bolt',
        iconColor: '#8b5cf6',
        order: 0
    });

    const [questionForm, setQuestionForm] = useState({
        chapterId: '',
        assertion: '',
        reason: '',
        assertionTrue: true,
        reasonTrue: true,
        reasonExplainsAssertion: true,
        difficulty: 'Medium',
        explanation: '',
        videoUrls: [],
        additionalImages: [],
        tags: '',
        order: 0
    });

    const [editingId, setEditingId] = useState(null);
    const [editingType, setEditingType] = useState(null); // 'chapter' or 'question'
    const [selectedChapter, setSelectedChapter] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    useEffect(() => {
        fetchChapters();
    }, []);

    const fetchChapters = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/assertion-reason/admin/chapters`);
            setChapters(response.data || []);
        } catch (error) {
            console.error('Error fetching chapters:', error);
            alert('Failed to fetch chapters');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestions = async (chapterId) => {
        try {
            const response = await axios.get(`${API_URL}/assertion-reason/admin/chapters/${chapterId}/questions`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    };

    const toggleChapter = async (chapterId) => {
        if (expandedChapters[chapterId]) {
            setExpandedChapters({ ...expandedChapters, [chapterId]: null });
        } else {
            const questions = await fetchQuestions(chapterId);
            setExpandedChapters({ ...expandedChapters, [chapterId]: questions });
        }
    };

    // ============ CHAPTER OPERATIONS ============

    const openChapterModal = (chapter = null) => {
        if (chapter) {
            setChapterForm({
                name: chapter.name,
                description: chapter.description || '',
                icon: chapter.icon || 'fas fa-bolt',
                iconColor: chapter.iconColor || '#8b5cf6',
                order: chapter.order || 0
            });
            setEditingId(chapter._id);
            setEditingType('chapter');
        } else {
            resetChapterForm();
        }
        setShowChapterModal(true);
    };

    const handleChapterSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId && editingType === 'chapter') {
                await axios.put(`${API_URL}/assertion-reason/admin/chapters/${editingId}`, chapterForm);
                alert('Chapter updated successfully!');
            } else {
                await axios.post(`${API_URL}/assertion-reason/admin/chapters`, chapterForm);
                alert('Chapter created successfully!');
            }
            setShowChapterModal(false);
            resetChapterForm();
            fetchChapters();
        } catch (error) {
            console.error('Error saving chapter:', error);
            alert('Failed to save chapter');
        }
    };

    const deleteChapter = async (id) => {
        if (!confirm('Are you sure? This will delete all questions in this chapter.')) return;
        try {
            await axios.delete(`${API_URL}/assertion-reason/admin/chapters/${id}`);
            alert('Chapter deleted successfully!');
            fetchChapters();
            setExpandedChapters({});
        } catch (error) {
            console.error('Error deleting chapter:', error);
            alert('Failed to delete chapter');
        }
    };

    const resetChapterForm = () => {
        setChapterForm({
            name: '',
            description: '',
            icon: 'fas fa-bolt',
            iconColor: '#8b5cf6',
            order: 0
        });
        setEditingId(null);
        setEditingType(null);
    };

    // ============ QUESTION OPERATIONS ============

    const openQuestionModal = (chapterId, question = null) => {
        if (question) {
            setQuestionForm({
                chapterId: question.chapterId,
                assertion: question.assertion,
                reason: question.reason,
                assertionTrue: question.assertionTrue,
                reasonTrue: question.reasonTrue,
                reasonExplainsAssertion: question.reasonExplainsAssertion,
                difficulty: question.difficulty || 'Medium',
                explanation: question.explanation || '',
                videoUrls: question.videoUrls || [],
                additionalImages: question.additionalImages || [],
                tags: question.tags ? question.tags.join(', ') : '',
                order: question.order || 0
            });
            setEditingId(question._id);
            setEditingType('question');
        } else {
            setQuestionForm({
                chapterId: chapterId,
                assertion: '',
                reason: '',
                assertionTrue: true,
                reasonTrue: true,
                reasonExplainsAssertion: true,
                difficulty: 'Medium',
                explanation: '',
                videoUrls: [],
                additionalImages: [],
                tags: '',
                order: 0
            });
            setEditingId(null);
            setEditingType(null);
        }
        setSelectedChapter(chapters.find(c => c._id === chapterId));
        setShowQuestionModal(true);
    };

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        try {
            const questionData = {
                ...questionForm,
                tags: questionForm.tags ? questionForm.tags.split(',').map(t => t.trim()) : []
            };

            if (editingId && editingType === 'question') {
                await axios.put(`${API_URL}/assertion-reason/admin/questions/${editingId}`, questionData);
                alert('Question updated successfully!');
            } else {
                await axios.post(`${API_URL}/assertion-reason/admin/questions`, questionData);
                alert('Question created successfully!');
            }

            // Refresh questions for this chapter
            const questions = await fetchQuestions(questionForm.chapterId);
            setExpandedChapters({ ...expandedChapters, [questionForm.chapterId]: questions });

            // Reset form but keep chapterId for adding more questions
            const savedChapterId = questionForm.chapterId;
            resetQuestionForm();
            setQuestionForm(prev => ({ ...prev, chapterId: savedChapterId }));
        } catch (error) {
            console.error('Error saving question:', error);
            alert('Failed to save question');
        }
    };

    const deleteQuestion = async (questionId, chapterId) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            await axios.delete(`${API_URL}/assertion-reason/admin/questions/${questionId}`);
            alert('Question deleted successfully!');
            const questions = await fetchQuestions(chapterId);
            setExpandedChapters({ ...expandedChapters, [chapterId]: questions });
        } catch (error) {
            console.error('Error deleting question:', error);
            alert('Failed to delete question');
        }
    };

    const resetQuestionForm = () => {
        setQuestionForm({
            chapterId: '',
            assertion: '',
            reason: '',
            assertionTrue: true,
            reasonTrue: true,
            reasonExplainsAssertion: true,
            difficulty: 'Medium',
            explanation: '',
            videoUrls: [],
            additionalImages: [],
            tags: '',
            order: 0
        });
        setEditingId(null);
        setEditingType(null);
    };

    // ============ MEDIA UPLOAD HANDLERS ============

    const handleVideoUrlInput = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newUrl = e.target.value.trim();
            if (!questionForm.videoUrls.includes(newUrl)) {
                setQuestionForm(prev => ({ ...prev, videoUrls: [...prev.videoUrls, newUrl] }));
            }
            e.target.value = '';
        }
    };

    const handleVideoFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const uploadPromises = files.map(async (file) => {
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                const response = await axios.post(`${API_URL}/upload`, uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return response.data.fileUrl;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setQuestionForm(prev => ({
                ...prev,
                videoUrls: [...prev.videoUrls, ...uploadedUrls]
            }));
            alert(`${uploadedUrls.length} video(s) uploaded successfully!`);
            e.target.value = ''; // Reset file input
        } catch (error) {
            console.error('Error uploading videos:', error);
            alert('Error uploading videos');
        }
    };

    const removeVideoUrl = (urlToRemove) => {
        setQuestionForm(prev => ({
            ...prev,
            videoUrls: prev.videoUrls.filter(url => url !== urlToRemove)
        }));
    };

    const handleAdditionalImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const uploadPromises = files.map(async (file) => {
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                const response = await axios.post(`${API_URL}/upload`, uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return response.data.fileUrl;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setQuestionForm(prev => ({
                ...prev,
                additionalImages: [...prev.additionalImages, ...uploadedUrls]
            }));
            alert(`${uploadedUrls.length} image(s) uploaded successfully!`);
            e.target.value = ''; // Reset file input
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error uploading images');
        }
    };

    const removeAdditionalImage = (imageToRemove) => {
        setQuestionForm(prev => ({
            ...prev,
            additionalImages: prev.additionalImages.filter(img => img !== imageToRemove)
        }));
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Manage Assertion & Reason</h1>
                    <p className="text-gray-400">Create and organize assertion-reason questions by chapters</p>
                </div>
                <button
                    onClick={() => openChapterModal()}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
                >
                    <i className="fas fa-plus mr-2"></i>
                    New Chapter
                </button>
            </div>

            {/* Chapters List */}
            <div className="glass-panel rounded-xl p-6">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                ) : chapters.length === 0 ? (
                    <div className="text-center py-12">
                        <i className="fas fa-question-circle text-6xl text-gray-600 mb-4"></i>
                        <p className="text-gray-400 mb-4">No chapters created yet</p>
                        <button
                            onClick={() => openChapterModal()}
                            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
                        >
                            Create Your First Chapter
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {chapters.map((chapter) => (
                            <div key={chapter._id} className="bg-gray-800/50 rounded-lg overflow-hidden">
                                {/* Chapter Header */}
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <button
                                            onClick={() => toggleChapter(chapter._id)}
                                            className="text-gray-400 hover:text-cyan-400 transition"
                                        >
                                            <i className={`fas fa-chevron-${expandedChapters[chapter._id] ? 'down' : 'right'} text-lg`}></i>
                                        </button>
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                                            style={{ backgroundColor: `${chapter.iconColor}20`, color: chapter.iconColor }}
                                        >
                                            <i className={chapter.icon}></i>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold text-lg">{chapter.name}</h3>
                                            <p className="text-gray-400 text-sm">{chapter.description}</p>
                                            <div className="flex gap-4 mt-1 text-xs text-gray-500">
                                                <span><i className="fas fa-question-circle mr-1"></i>{chapter.questionCount || 0} questions</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openQuestionModal(chapter._id)}
                                            className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                                        >
                                            <i className="fas fa-plus mr-2"></i>
                                            Add Question
                                        </button>
                                        <button
                                            onClick={() => openChapterModal(chapter)}
                                            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => deleteChapter(chapter._id)}
                                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Questions List (Expanded) */}
                                {expandedChapters[chapter._id] && (
                                    <div className="border-t border-gray-700 bg-gray-900/30 p-4">
                                        {expandedChapters[chapter._id].length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-400 mb-3">No questions in this chapter yet</p>
                                                <button
                                                    onClick={() => openQuestionModal(chapter._id)}
                                                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition text-sm"
                                                >
                                                    <i className="fas fa-plus mr-2"></i>
                                                    Add First Question
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {expandedChapters[chapter._id].map((question, index) => (
                                                    <div key={question._id} className="bg-gray-800/50 rounded-lg p-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-cyan-400 font-semibold">Q{index + 1}</span>
                                                                    <span className={`px-2 py-0.5 rounded text-xs ${question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                                        question.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                                                                            'bg-amber-500/20 text-amber-400'
                                                                        }`}>
                                                                        {question.difficulty}
                                                                    </span>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="p-3 rounded bg-blue-500/10 border border-blue-500/30">
                                                                        <div className="flex items-start gap-2">
                                                                            <span className="text-blue-400 font-bold">A:</span>
                                                                            <div className="text-white text-sm prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: question.assertion }} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-3 rounded bg-purple-500/10 border border-purple-500/30">
                                                                        <div className="flex items-start gap-2">
                                                                            <span className="text-purple-400 font-bold">R:</span>
                                                                            <div className="text-white text-sm prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: question.reason }} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2 text-xs">
                                                                        <span className={`px-2 py-1 rounded ${question.assertionTrue ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                            A: {question.assertionTrue ? 'True' : 'False'}
                                                                        </span>
                                                                        <span className={`px-2 py-1 rounded ${question.reasonTrue ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                            R: {question.reasonTrue ? 'True' : 'False'}
                                                                        </span>
                                                                        <span className={`px-2 py-1 rounded ${question.reasonExplainsAssertion ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                                            {question.reasonExplainsAssertion ? 'R explains A' : 'R is just a fact'}
                                                                        </span>
                                                                    </div>
                                                                    {question.explanation && (
                                                                        <div className="mt-2 p-3 rounded bg-yellow-500/10 border border-yellow-500/30">
                                                                            <div className="flex items-start gap-2">
                                                                                <i className="fas fa-lightbulb text-yellow-400 text-sm mt-0.5"></i>
                                                                                <div className="flex-1">
                                                                                    <p className="text-yellow-400 text-xs font-semibold mb-1">Explanation:</p>
                                                                                    <p className="text-gray-300 text-xs leading-relaxed">{question.explanation}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => openQuestionModal(chapter._id, question)}
                                                                    className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition text-sm"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteQuestion(question._id, chapter._id)}
                                                                    className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition text-sm"
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

            {/* Chapter Modal */}
            {showChapterModal && (
                <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full my-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {editingId && editingType === 'chapter' ? 'Edit Chapter' : 'New Chapter'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowChapterModal(false);
                                    resetChapterForm();
                                }}
                                className="text-gray-400 hover:text-white transition"
                            >
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleChapterSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Chapter Name *</label>
                                <input
                                    type="text"
                                    value={chapterForm.name}
                                    onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    placeholder="e.g., Chemical Kinetics"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Description</label>
                                <textarea
                                    value={chapterForm.description}
                                    onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    rows="3"
                                    placeholder="Brief description of this chapter"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Icon Class</label>
                                    <input
                                        type="text"
                                        value={chapterForm.icon}
                                        onChange={(e) => setChapterForm({ ...chapterForm, icon: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="fas fa-bolt"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">FontAwesome icon class</p>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Icon Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={chapterForm.iconColor}
                                            onChange={(e) => setChapterForm({ ...chapterForm, iconColor: e.target.value })}
                                            className="w-16 h-12 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={chapterForm.iconColor}
                                            onChange={(e) => setChapterForm({ ...chapterForm, iconColor: e.target.value })}
                                            className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Order</label>
                                <input
                                    type="number"
                                    value={chapterForm.order}
                                    onChange={(e) => setChapterForm({ ...chapterForm, order: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    {editingId && editingType === 'chapter' ? 'Update Chapter' : 'Create Chapter'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowChapterModal(false);
                                        resetChapterForm();
                                    }}
                                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Question Modal */}
            {showQuestionModal && (
                <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full my-8 min-h-min">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {editingId && editingType === 'question' ? 'Edit Question' : 'New Question'}
                                </h2>
                                <p className="text-gray-400 text-sm">{selectedChapter?.name}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowQuestionModal(false);
                                    resetQuestionForm();
                                }}
                                className="text-gray-400 hover:text-white transition"
                            >
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleQuestionSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Assertion (Statement A) *</label>
                                <div className="quill-editor-wrapper quill-editor-black-text">
                                    <ReactQuill
                                        theme="snow"
                                        value={questionForm.assertion}
                                        onChange={(content) => setQuestionForm({ ...questionForm, assertion: content })}
                                        className="bg-white rounded-lg"
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'script': 'sub' }, { 'script': 'super' }],
                                                ['link', 'image'],
                                                ['clean']
                                            ]
                                        }}
                                        placeholder="Enter the assertion statement..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Reason (Statement R) *</label>
                                <div className="quill-editor-wrapper quill-editor-black-text">
                                    <ReactQuill
                                        theme="snow"
                                        value={questionForm.reason}
                                        onChange={(content) => setQuestionForm({ ...questionForm, reason: content })}
                                        className="bg-white rounded-lg"
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'script': 'sub' }, { 'script': 'super' }],
                                                ['link', 'image'],
                                                ['clean']
                                            ]
                                        }}
                                        placeholder="Enter the reason statement..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Is Assertion True?</label>
                                    <select
                                        value={questionForm.assertionTrue}
                                        onChange={(e) => setQuestionForm({ ...questionForm, assertionTrue: e.target.value === 'true' })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    >
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Is Reason True?</label>
                                    <select
                                        value={questionForm.reasonTrue}
                                        onChange={(e) => setQuestionForm({ ...questionForm, reasonTrue: e.target.value === 'true' })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    >
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Does R explain A?</label>
                                    <select
                                        value={questionForm.reasonExplainsAssertion}
                                        onChange={(e) => setQuestionForm({ ...questionForm, reasonExplainsAssertion: e.target.value === 'true' })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    >
                                        <option value="true">Yes, explains</option>
                                        <option value="false">No, just a fact</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Difficulty</label>
                                    <select
                                        value={questionForm.difficulty}
                                        onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Order</label>
                                    <input
                                        type="number"
                                        value={questionForm.order}
                                        onChange={(e) => setQuestionForm({ ...questionForm, order: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Explanation / Concept Card Content</label>
                                <div className="quill-editor-wrapper quill-editor-black-text">
                                    <ReactQuill
                                        theme="snow"
                                        value={questionForm.explanation}
                                        onChange={(content) => setQuestionForm({ ...questionForm, explanation: content })}
                                        className="bg-white rounded-lg"
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'color': [] }, { 'background': [] }],
                                                [{ 'script': 'sub' }, { 'script': 'super' }],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['link', 'image', 'video'],
                                                ['blockquote', 'code-block'],
                                                ['clean']
                                            ]
                                        }}
                                        placeholder="Detailed explanation shown when user answers incorrectly. Explain why the correct answer is what it is..."
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">This will be displayed in the concept card when users get the answer wrong</p>
                            </div>

                            {/* Video URLs */}
                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">
                                    Videos <span className="text-gray-500 text-sm">(upload files or paste URLs)</span>
                                </label>

                                {/* Video File Upload */}
                                <div className="mb-3">
                                    <label className="block text-gray-400 text-sm mb-1">Upload Video Files:</label>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        multiple
                                        onChange={handleVideoFileUpload}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>

                                {/* Video URL Input */}
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Or paste YouTube/Vimeo URL:</label>
                                    <input
                                        type="text"
                                        onKeyDown={handleVideoUrlInput}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="https://www.youtube.com/embed/VIDEO_ID (press Enter)"
                                    />
                                </div>

                                {/* Video List */}
                                <div className="flex flex-col gap-2 mt-3">
                                    {questionForm.videoUrls.map((url, index) => (
                                        <div
                                            key={index}
                                            className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm flex items-center justify-between gap-2"
                                        >
                                            <span className="truncate flex-1">
                                                <i className="fas fa-video mr-2"></i>
                                                {url}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeVideoUrl(url)}
                                                className="hover:text-red-400 flex-shrink-0"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-gray-500 text-xs mt-2">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    Upload video files or paste embed URLs. Videos will be shown in the explanation.
                                </p>
                            </div>

                            {/* Additional Images */}
                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">
                                    Additional Images <span className="text-gray-500 text-sm">(select multiple files)</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleAdditionalImageUpload}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                />
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {questionForm.additionalImages.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image}
                                                alt={`Additional ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeAdditionalImage(image)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <i className="fas fa-times text-xs"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-gray-500 text-xs mt-1">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    Select multiple images at once. They will be displayed in the explanation.
                                </p>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={questionForm.tags}
                                    onChange={(e) => setQuestionForm({ ...questionForm, tags: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    placeholder="e.g., kinetics, rate constant, order"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    {editingId && editingType === 'question' ? 'Update Question' : 'Create Question'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowQuestionModal(false);
                                        resetQuestionForm();
                                    }}
                                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
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

export default ManageAssertionReason;
