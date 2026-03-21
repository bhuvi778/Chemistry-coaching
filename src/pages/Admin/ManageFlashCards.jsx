import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ManageFlashCards = () => {
    // Refs for Quill editors
    const questionQuillRef = useRef(null);
    const answerQuillRef = useRef(null);

    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);
    const [cards, setCards] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expandedChapters, setExpandedChapters] = useState({});

    // Form states
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);

    const [chapterForm, setChapterForm] = useState({
        name: '',
        description: '',
        icon: 'fas fa-layer-group',
        iconColor: '#a855f7',
        subject: 'Chemistry',
        category: '',
        order: 0
    });

    const [topicForm, setTopicForm] = useState({
        chapterId: '',
        name: '',
        description: '',
        order: 0
    });

    const [cardForm, setCardForm] = useState({
        chapterId: '',
        topicId: '',
        question: '',
        answer: '',
        difficulty: 'Medium',
        tags: '',
        order: 0
    });

    const [editingId, setEditingId] = useState(null);
    const [editingType, setEditingType] = useState(null); // 'chapter', 'topic', or 'card'

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    // Quill editor configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'formula'],
            ['clean']
        ],
    };

    // Handler to clear selection after paste
    const handleQuillChange = (content, delta, source, editor, field) => {
        // Update the form state
        setCardForm({ ...cardForm, [field]: content });

        // Clear selection after a short delay to allow paste to complete
        setTimeout(() => {
            const quillRef = field === 'question' ? questionQuillRef : answerQuillRef;
            if (quillRef.current) {
                const quill = quillRef.current.getEditor();
                if (quill) {
                    // Get current selection
                    const selection = quill.getSelection();
                    if (selection) {
                        // Move cursor to end of selection and collapse it
                        quill.setSelection(selection.index + selection.length, 0);
                    }
                }
            }
        }, 10);
    };

    useEffect(() => {
        fetchChapters();
    }, []);

    // ============ FETCH FUNCTIONS ============

    const fetchChapters = async () => {
        try {
            setLoading(true);
            // Add timestamp to bypass cache
            const timestamp = Date.now();
            const response = await axios.get(`${API_URL}/flashcards/chapters?_t=${timestamp}`);
            setChapters(response.data);
        } catch (error) {
            console.error('Error fetching chapters:', error);
            alert('Failed to fetch chapters');
        } finally {
            setLoading(false);
        }
    };

    const fetchTopics = async (chapterId) => {
        try {
            const timestamp = Date.now();
            const response = await axios.get(`${API_URL}/flashcards/chapters/${chapterId}/topics?_t=${timestamp}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching topics:', error);
            return [];
        }
    };

    const fetchCards = async (topicId) => {
        try {
            console.log('=== FETCH CARDS DEBUG ===');
            console.log('Topic ID:', topicId);
            console.log('API URL:', API_URL);
            const timestamp = Date.now();
            const fullUrl = `${API_URL}/flashcards/topics/${topicId}/cards?_t=${timestamp}`;
            console.log('Full URL:', fullUrl);

            const response = await axios.get(fullUrl);

            console.log('Response status:', response.status);
            console.log('Response data type:', typeof response.data);
            console.log('Response data length:', response.data?.length);
            console.log('Response data:', JSON.stringify(response.data, null, 2));

            setCards(response.data);
            console.log('Cards state updated with:', response.data.length, 'cards');
            console.log('========================');
        } catch (error) {
            console.error('=== FETCH CARDS ERROR ===');
            console.error('Error:', error);
            console.error('Error message:', error.message);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('========================');
        }
    };

    const toggleChapter = async (chapterId) => {
        if (expandedChapters[chapterId]) {
            setExpandedChapters({ ...expandedChapters, [chapterId]: null });
        } else {
            const topicsData = await fetchTopics(chapterId);
            setExpandedChapters({ ...expandedChapters, [chapterId]: topicsData });
        }
    };

    // ============ CHAPTER OPERATIONS ============

    const openChapterModal = (chapter = null) => {
        if (chapter) {
            setChapterForm({
                name: chapter.name,
                description: chapter.description || '',
                icon: chapter.icon || 'fas fa-layer-group',
                iconColor: chapter.iconColor || '#a855f7',
                subject: chapter.subject || 'Chemistry',
                category: chapter.category || '',
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
                await axios.put(`${API_URL}/flashcards/chapters/${editingId}`, chapterForm);
                alert('Chapter updated successfully!');
            } else {
                await axios.post(`${API_URL}/flashcards/chapters`, chapterForm);
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
        if (!confirm('Are you sure? This will delete all topics and cards in this chapter.')) return;
        try {
            await axios.delete(`${API_URL}/flashcards/chapters/${id}`);
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
            icon: 'fas fa-layer-group',
            iconColor: '#a855f7',
            subject: 'Chemistry',
            category: '',
            order: 0
        });
        setEditingId(null);
        setEditingType(null);
    };

    // ============ TOPIC OPERATIONS ============

    const openTopicModal = (chapterId, topic = null) => {
        if (topic) {
            setTopicForm({
                chapterId: topic.chapterId,
                name: topic.name,
                description: topic.description || '',
                order: topic.order || 0
            });
            setEditingId(topic._id);
            setEditingType('topic');
        } else {
            setTopicForm({
                chapterId: chapterId,
                name: '',
                description: '',
                order: 0
            });
            setEditingId(null);
            setEditingType(null);
        }
        setShowTopicModal(true);
    };

    const handleTopicSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId && editingType === 'topic') {
                await axios.put(`${API_URL}/flashcards/topics/${editingId}`, topicForm);
                alert('Topic updated successfully!');
            } else {
                await axios.post(`${API_URL}/flashcards/topics`, topicForm);
                alert('Topic created successfully!');
            }
            setShowTopicModal(false);
            resetTopicForm();
            // Refresh the expanded chapter
            const topicsData = await fetchTopics(topicForm.chapterId);
            setExpandedChapters({ ...expandedChapters, [topicForm.chapterId]: topicsData });
            // Also refresh chapters to update topic count
            await fetchChapters();
        } catch (error) {
            console.error('Error saving topic:', error);
            alert('Failed to save topic');
        }
    };

    const deleteTopic = async (chapterId, topicId) => {
        if (!confirm('Are you sure? This will delete all cards in this topic.')) return;
        try {
            await axios.delete(`${API_URL}/flashcards/topics/${topicId}`);
            alert('Topic deleted successfully!');
            const topicsData = await fetchTopics(chapterId);
            setExpandedChapters({ ...expandedChapters, [chapterId]: topicsData });
            // Also refresh chapters to update topic count
            await fetchChapters();
        } catch (error) {
            console.error('Error deleting topic:', error);
            alert('Failed to delete topic');
        }
    };

    const resetTopicForm = () => {
        setTopicForm({
            chapterId: '',
            name: '',
            description: '',
            order: 0
        });
        setEditingId(null);
        setEditingType(null);
    };

    // ============ CARD OPERATIONS ============

    const openCardModal = async (chapterId, topicId, card = null) => {
        console.log('Opening card modal for topic:', topicId);

        // Set the form first
        if (card) {
            setCardForm({
                chapterId: card.chapterId,
                topicId: card.topicId,
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty || 'Medium',
                tags: card.tags ? card.tags.join(', ') : '',
                order: card.order || 0
            });
            setEditingId(card._id);
            setEditingType('card');
        } else {
            setCardForm({
                chapterId: chapterId,
                topicId: topicId,
                question: '',
                answer: '',
                difficulty: 'Medium',
                tags: '',
                order: 0
            });
            setEditingId(null);
            setEditingType(null);
        }

        setSelectedChapter(chapters.find(c => c._id === chapterId));
        setSelectedTopic({ _id: topicId });

        // Fetch cards first, then open modal
        await fetchCards(topicId);
        setShowCardModal(true);
    };

    const handleCardSubmit = async (e) => {
        e.preventDefault();
        try {
            const cardData = {
                ...cardForm,
                tags: cardForm.tags ? cardForm.tags.split(',').map(t => t.trim()) : []
            };

            console.log('Submitting card:', cardData);

            if (editingId && editingType === 'card') {
                await axios.put(`${API_URL}/flashcards/cards/${editingId}`, cardData);
                alert('Card updated successfully!');
            } else {
                const response = await axios.post(`${API_URL}/flashcards/cards`, cardData);
                console.log('Card created:', response.data);
                alert('Card created successfully!');
            }

            // Save IDs before reset
            const savedChapterId = cardForm.chapterId;
            const savedTopicId = cardForm.topicId;

            resetCardForm();

            // Restore IDs for next card
            setCardForm(prev => ({
                ...prev,
                chapterId: savedChapterId,
                topicId: savedTopicId
            }));

            // Immediately refresh cards list
            console.log('Immediately fetching cards for topic:', savedTopicId);
            await fetchCards(savedTopicId);

            // Refresh topics to update card count in topic list
            const topicsData = await fetchTopics(savedChapterId);
            setExpandedChapters({ ...expandedChapters, [savedChapterId]: topicsData });

            // Refresh chapters to update card count in chapter list
            await fetchChapters();
        } catch (error) {
            console.error('Error saving card:', error);
            console.error('Error details:', error.response?.data);
            alert('Failed to save card: ' + (error.response?.data?.message || error.message));
        }
    };

    const deleteCard = async (cardId) => {
        if (!confirm('Are you sure you want to delete this card?')) return;
        try {
            await axios.delete(`${API_URL}/flashcards/cards/${cardId}`);
            alert('Card deleted successfully!');
            await fetchCards(cardForm.topicId);

            // Refresh topics to update card count in topic list
            const topicsData = await fetchTopics(cardForm.chapterId);
            setExpandedChapters({ ...expandedChapters, [cardForm.chapterId]: topicsData });

            // Refresh chapters to update card count in chapter list
            await fetchChapters();
        } catch (error) {
            console.error('Error deleting card:', error);
            alert('Failed to delete card');
        }
    };

    const resetCardForm = () => {
        setCardForm({
            chapterId: cardForm.chapterId,
            topicId: cardForm.topicId,
            question: '',
            answer: '',
            difficulty: 'Medium',
            tags: '',
            order: 0
        });
        setEditingId(null);
        setEditingType(null);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Manage Flash Cards</h1>
                    <p className="text-gray-400">Create and organize flashcards by chapters and topics</p>
                </div>
                <button
                    onClick={() => openChapterModal()}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
                >
                    <i className="fas fa-plus mr-2"></i>
                    New Chapter
                </button>
            </div>

            {/* Chapters List with Nested Topics */}
            <div className="glass-panel rounded-xl p-6">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                ) : chapters.length === 0 ? (
                    <div className="text-center py-12">
                        <i className="fas fa-layer-group text-6xl text-gray-600 mb-4"></i>
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
                                                <span><i className="fas fa-layer-group mr-1"></i>{chapter.cardCount} cards</span>
                                                <span><i className="fas fa-book mr-1"></i>{chapter.topicCount} topics</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openTopicModal(chapter._id)}
                                            className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                                        >
                                            <i className="fas fa-plus mr-2"></i>
                                            Add Topic
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

                                {/* Topics List (Expanded) */}
                                {expandedChapters[chapter._id] && (
                                    <div className="border-t border-gray-700 bg-gray-900/30 p-4">
                                        {expandedChapters[chapter._id].length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-400 mb-3">No topics in this chapter yet</p>
                                                <button
                                                    onClick={() => openTopicModal(chapter._id)}
                                                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition text-sm"
                                                >
                                                    <i className="fas fa-plus mr-2"></i>
                                                    Add First Topic
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {expandedChapters[chapter._id].map((topic) => (
                                                    <div key={topic._id} className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="text-white font-medium">{topic.name}</h4>
                                                            <p className="text-gray-400 text-sm">{topic.description}</p>
                                                            <span className="text-xs text-gray-500 mt-1 inline-block">
                                                                <i className="fas fa-layer-group mr-1"></i>
                                                                {topic.cardCount} cards
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => openCardModal(chapter._id, topic._id)}
                                                                className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition text-sm"
                                                            >
                                                                <i className="fas fa-plus mr-1"></i>
                                                                Add Cards
                                                            </button>
                                                            <button
                                                                onClick={() => openTopicModal(chapter._id, topic)}
                                                                className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition text-sm"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => deleteTopic(chapter._id, topic._id)}
                                                                className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition text-sm"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
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
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                                    placeholder="e.g., Chemical Bonding"
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
                                        placeholder="fas fa-layer-group"
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

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Subject</label>
                                    <select
                                        value={chapterForm.subject}
                                        onChange={(e) => setChapterForm({ ...chapterForm, subject: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    >
                                        <option value="Chemistry">Chemistry</option>
                                        <option value="Physical Chemistry">Physical Chemistry</option>
                                        <option value="Organic Chemistry">Organic Chemistry</option>
                                        <option value="Inorganic Chemistry">Inorganic Chemistry</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Category</label>
                                    <select
                                        value={chapterForm.category}
                                        onChange={(e) => setChapterForm({ ...chapterForm, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    >
                                        <option value="">None</option>
                                        <option value="Physical">Physical</option>
                                        <option value="Organic">Organic</option>
                                        <option value="Inorganic">Inorganic</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">For filtering on frontend</p>
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

            {/* Topic Modal */}
            {showTopicModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {editingId && editingType === 'topic' ? 'Edit Topic' : 'New Topic'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowTopicModal(false);
                                    resetTopicForm();
                                }}
                                className="text-gray-400 hover:text-white transition"
                            >
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleTopicSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Topic Name *</label>
                                <input
                                    type="text"
                                    value={topicForm.name}
                                    onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    placeholder="e.g., Ionic Bonds"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Description</label>
                                <textarea
                                    value={topicForm.description}
                                    onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    rows="3"
                                    placeholder="Brief description of this topic"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Order</label>
                                <input
                                    type="number"
                                    value={topicForm.order}
                                    onChange={(e) => setTopicForm({ ...topicForm, order: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    {editingId && editingType === 'topic' ? 'Update Topic' : 'Create Topic'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowTopicModal(false);
                                        resetTopicForm();
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

            {/* Card Modal */}
            {showCardModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    Manage Cards
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    {selectedChapter?.name} - Topic Cards
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowCardModal(false);
                                    resetCardForm();
                                    setCards([]);
                                }}
                                className="text-gray-400 hover:text-white transition"
                            >
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Card Form */}
                            <div className="bg-gray-900/50 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-white mb-4">
                                    {editingId && editingType === 'card' ? 'Edit Card' : 'Add New Card'}
                                </h3>
                                <form onSubmit={handleCardSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-semibold">Question *</label>
                                        <div className="quill-wrapper" style={{ minHeight: '230px', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
                                            <ReactQuill
                                                ref={questionQuillRef}
                                                theme="snow"
                                                value={cardForm.question}
                                                onChange={(content, delta, source, editor) => handleQuillChange(content, delta, source, editor, 'question')}
                                                modules={quillModules}
                                                placeholder="Enter the question..."
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 mb-2 font-semibold">Answer *</label>
                                        <div className="quill-wrapper" style={{ minHeight: '230px', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                                            <ReactQuill
                                                ref={answerQuillRef}
                                                theme="snow"
                                                value={cardForm.answer}
                                                onChange={(content, delta, source, editor) => handleQuillChange(content, delta, source, editor, 'answer')}
                                                modules={quillModules}
                                                placeholder="Enter the answer..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-300 mb-2 font-semibold">Difficulty</label>
                                            <select
                                                value={cardForm.difficulty}
                                                onChange={(e) => setCardForm({ ...cardForm, difficulty: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
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
                                                value={cardForm.order}
                                                onChange={(e) => setCardForm({ ...cardForm, order: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 mb-2 font-semibold">Tags (comma-separated)</label>
                                        <input
                                            type="text"
                                            value={cardForm.tags}
                                            onChange={(e) => setCardForm({ ...cardForm, tags: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            placeholder="equilibrium, acids, bases"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
                                        >
                                            <i className="fas fa-save mr-2"></i>
                                            {editingId && editingType === 'card' ? 'Update Card' : 'Add Card'}
                                        </button>
                                        {editingId && editingType === 'card' && (
                                            <button
                                                type="button"
                                                onClick={resetCardForm}
                                                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
                                            >
                                                Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Cards List */}
                            <div className="bg-gray-900/50 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-white">
                                        Cards ({cards.length})
                                    </h3>
                                </div>
                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                    {cards.length === 0 ? (
                                        <div className="text-center py-12">
                                            <i className="fas fa-layer-group text-5xl text-gray-600 mb-3"></i>
                                            <p className="text-gray-400">No cards yet. Create your first card!</p>
                                        </div>
                                    ) : (
                                        cards.map((card, index) => (
                                            <div key={card._id} className="bg-gray-800/70 rounded-lg p-4 hover:bg-gray-800 transition">
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className="text-xs text-gray-500 font-mono">#{index + 1}</span>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${card.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                        card.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                                                            'bg-yellow-500/20 text-yellow-400'
                                                        }`}>
                                                        {card.difficulty}
                                                    </span>
                                                </div>
                                                <div className="mb-2">
                                                    <div className="text-xs text-purple-400 mb-1 font-semibold">Q:</div>
                                                    <div
                                                        className="text-white text-sm prose prose-sm max-w-none prose-invert"
                                                        dangerouslySetInnerHTML={{ __html: card.question }}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <div className="text-xs text-cyan-400 mb-1 font-semibold">A:</div>
                                                    <div
                                                        className="text-gray-300 text-sm prose prose-sm max-w-none prose-invert"
                                                        dangerouslySetInnerHTML={{ __html: card.answer }}
                                                    />
                                                </div>
                                                {card.tags && card.tags.length > 0 && (
                                                    <div className="mb-3 flex flex-wrap gap-1">
                                                        {card.tags.map((tag, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="flex gap-2 pt-2 border-t border-gray-700">
                                                    <button
                                                        onClick={() => openCardModal(card.chapterId, card.topicId, card)}
                                                        className="flex-1 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition text-sm font-semibold"
                                                    >
                                                        <i className="fas fa-edit mr-1"></i>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCard(card._id)}
                                                        className="flex-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition text-sm font-semibold"
                                                    >
                                                        <i className="fas fa-trash mr-1"></i>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Quill Editor Styling */}
            <style>{`
                /* Quill Editor Dark Theme - scoped to .quill-wrapper */
                .quill-wrapper .ql-toolbar.ql-snow {
                    background: #1f2937 !important;
                    border: 1px solid #374151 !important;
                    border-radius: 8px 8px 0 0 !important;
                    border-bottom: none !important;
                }
                .quill-wrapper .ql-container.ql-snow {
                    background: #111827 !important;
                    border: 1px solid #374151 !important;
                    border-top: none !important;
                    border-radius: 0 0 8px 8px !important;
                    color: #fff !important;
                    height: auto !important;
                    min-height: 180px !important;
                }
                .quill-wrapper .ql-editor {
                    color: #fff !important;
                    min-height: 180px !important;
                    height: auto !important;
                    padding: 12px 15px !important;
                    cursor: text !important;
                    caret-color: #fff !important;
                }
                .quill-wrapper .ql-editor:focus {
                    outline: none !important;
                    caret-color: #fff !important;
                }
                .quill-wrapper .ql-editor.ql-blank::before {
                    color: #6b7280 !important;
                    font-style: normal !important;
                    padding-left: 0 !important;
                }
                .quill-wrapper .ql-snow .ql-stroke { stroke: #9ca3af; }
                .quill-wrapper .ql-snow .ql-fill { fill: #9ca3af; }
                .quill-wrapper .ql-snow .ql-picker-label { color: #9ca3af; }
                .quill-wrapper .ql-snow.ql-toolbar button:hover .ql-stroke,
                .quill-wrapper .ql-snow .ql-toolbar button:hover .ql-stroke,
                .quill-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke,
                .quill-wrapper .ql-snow .ql-toolbar button.ql-active .ql-stroke { stroke: #06b6d4; }
                .quill-wrapper .ql-snow.ql-toolbar button:hover .ql-fill,
                .quill-wrapper .ql-snow .ql-toolbar button:hover .ql-fill,
                .quill-wrapper .ql-snow.ql-toolbar button.ql-active .ql-fill,
                .quill-wrapper .ql-snow .ql-toolbar button.ql-active .ql-fill { fill: #06b6d4; }
                .quill-wrapper .ql-snow.ql-toolbar button:hover,
                .quill-wrapper .ql-snow .ql-toolbar button:hover,
                .quill-wrapper .ql-snow.ql-toolbar button.ql-active,
                .quill-wrapper .ql-snow .ql-toolbar button.ql-active { background: #374151; }
                .quill-wrapper .ql-snow .ql-picker-options {
                    background: #1f2937 !important;
                    border: 1px solid #374151 !important;
                }
                .quill-wrapper .ql-snow .ql-picker-item { color: #9ca3af; }
                .quill-wrapper .ql-snow .ql-picker-item:hover { background: #374151; color: #06b6d4; }
            `}</style>
        </div>
    );
};

export default ManageFlashCards;
