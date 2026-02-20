import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';
import ManageNTAAbhyas from './ManageNTAAbhyas';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchErrorReports, updateErrorReport, deleteErrorReport } from '../../services/ncertApi';
import Pagination from '../../components/UI/Pagination';

// Set worker for PDF parsing
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const ManageNCERT = () => {
    // ReactQuill modules configuration for rich text editor
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

    // Top Level Tabs
    const [activeTab, setActiveTab] = useState('line-by-line');

    // State for Drill-Down Navigation in Line-By-Line
    // null = list chapters, object = view topics for chapter, object (topic) = view questions for topic
    const [currentChapter, setCurrentChapter] = useState(null);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [currentBadge, setCurrentBadge] = useState(null);

    // Data Loading
    const [loading, setLoading] = useState(false);

    // Main Data
    const [chapters, setChapters] = useState([]);
    const [questionsBadges, setQuestionsBadges] = useState([]);
    const [exemplarBadges, setExemplarBadges] = useState([]);
    const [diagramBadges, setDiagramBadges] = useState([]);

    // Drill Down Data
    const [topics, setTopics] = useState([]); // When viewing a chapter
    const [questions, setQuestions] = useState([]); // When viewing a topic or badge
    const [errorReports, setErrorReports] = useState([]); // Error reports
    const [errorReportFilter, setErrorReportFilter] = useState('all'); // all, pending, reviewed, resolved, rejected
    const [errorReportsPage, setErrorReportsPage] = useState(1); // Pagination for error reports
    const REPORTS_PER_PAGE = 5;

    // Forms
    const [showChapterForm, setShowChapterForm] = useState(false);
    const [showBadgeForm, setShowBadgeForm] = useState(false);
    const [showTopicForm, setShowTopicForm] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);

    const [editingItem, setEditingItem] = useState(null);

    // Form States
    const [newItem, setNewItem] = useState({
        name: '',
        chapterNumber: '',
        description: '',
        icon: 'fa-book',
        color: 'cyan',
        classLevel: '11',
        category: 'line-by-line',
        badgeType: '',
        difficulty: 'Medium',
        // Topic specific
        order: 0,
        // Question specific
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        solution: '',
        questionType: 'MCQ',
        chapterId: '',
        ncertLine: '',
        concept: '',
        paraname: '',
        imageFile: null,
        solutionImageFile: null
    });

    const API_URL = '/api/ncert';

    useEffect(() => {
        // Reset drill down when tab changes
        if (activeTab === 'line-by-line') {
            setCurrentChapter(null);
            setCurrentTopic(null);
            setCurrentBadge(null);
        } else {
            setCurrentChapter(null);
            setCurrentTopic(null);
            setCurrentBadge(null);
        }

        // Reset form Item clean slate
        setNewItem({
            name: '',
            chapterNumber: '',
            description: '',
            icon: 'fa-book',
            color: 'cyan',
            classLevel: '11',
            category: activeTab, // Update category
            badgeType: '',
            difficulty: 'Medium',
            order: 0,
            questionText: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            solution: '',
            questionType: 'MCQ',
            chapterId: '',
            ncertLine: '',
            concept: '',
            paraname: '',
            imageFile: null,
            solutionImageFile: null
        });

        fetchData();
    }, [activeTab]);

    // Fetch Topics when Current Chapter Changes
    useEffect(() => {
        if (currentChapter && activeTab === 'line-by-line') {
            fetchTopics(currentChapter._id);
        }
    }, [currentChapter]);

    // Fetch Questions when Current Topic or Badge Changes
    useEffect(() => {
        if (currentTopic) {
            fetchQuestions({ topicId: currentTopic._id });
        } else if (currentBadge) {
            fetchQuestions({ badgeType: currentBadge.badgeType, category: activeTab });
        }
    }, [currentTopic, currentBadge]);

    // --- Data Fetching ---

    const fetchData = async () => {
        setLoading(true);
        try {
            // Always fetch chapters for dropdowns
            const chaptersRes = await axios.get(`${API_URL}/chapters/line-by-line`);
            setChapters(chaptersRes.data);

            if (activeTab === 'line-by-line') {
                // Chapters already fetched
            } else if (activeTab === 'questions') {
                const res = await axios.get(`${API_URL}/badges/questions`);
                setQuestionsBadges(res.data);
            } else if (activeTab === 'exemplars') {
                const res = await axios.get(`${API_URL}/badges/exemplars`);
                setExemplarBadges(res.data);
            } else if (activeTab === 'diagrams') {
                const res = await axios.get(`${API_URL}/badges/diagrams`);
                setDiagramBadges(res.data);
            } else if (activeTab === 'error-reports') {
                const reports = await fetchErrorReports();
                setErrorReports(reports);
            }
        } catch (error) {
            console.error(error);
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

    const fetchQuestions = async (filters) => {
        setLoading(true);
        try {
            // Build query string from filters object
            const params = new URLSearchParams(filters).toString();
            const res = await axios.get(`${API_URL}/questions?${params}`);
            setQuestions(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    // --- CRUD Handlers ---

    // Generic delete handler
    const handleDelete = async (id, type) => {
        if (!window.confirm('Are you sure? This will delete all associated data.')) return;
        try {
            let endpoint = '';
            if (type === 'chapter' || type === 'badge') endpoint = type === 'chapter' ? 'chapters' : 'badges';
            else if (type === 'topic') endpoint = 'topics';
            else if (type === 'question') endpoint = 'questions';

            await axios.delete(`${API_URL}/${endpoint}/${id}`);
            toast.success('Deleted successfully');

            // Refresh correct data
            if (type === 'chapter' || type === 'badge') fetchData();
            else if (type === 'topic') fetchTopics(currentChapter._id);
            else if (type === 'question') {
                if (currentTopic) fetchQuestions({ topicId: currentTopic._id });
                else if (currentBadge) fetchQuestions({ badgeType: currentBadge.badgeType, category: activeTab });
            }

        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    // Generic Submit Handler logic
    const handleFormSubmit = async (endpoint, payload, refreshCallback) => {
        setLoading(true);
        try {
            if (editingItem) {
                await axios.put(`${API_URL}/${endpoint}/${editingItem._id}`, payload);
                toast.success('Updated successfully');
            } else {
                await axios.post(`${API_URL}/${endpoint}`, payload);
                toast.success('Created successfully');
            }
            closeForm();
            refreshCallback();
        } catch (error) {
            console.error(error);
            toast.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChapterSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: newItem.name,
            chapterNumber: newItem.chapterNumber,
            description: newItem.description,
            icon: newItem.icon,
            color: newItem.color,
            classLevel: newItem.classLevel,
            category: 'line-by-line'
        };
        handleFormSubmit('chapters', payload, fetchData);
    };

    const handleBadgeSubmit = (e) => {
        e.preventDefault();
        const payload = { ...newItem, category: activeTab }; // activeTab is questions/exemplars
        handleFormSubmit('badges', payload, fetchData);
    };

    const handleTopicSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: newItem.name,
            description: newItem.description,
            order: newItem.order,
            chapterId: currentChapter._id
        };
        handleFormSubmit('topics', payload, () => fetchTopics(currentChapter._id));
    };

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('question', newItem.questionText);
            formData.append('correctAnswer', newItem.correctAnswer || (newItem.questionType === 'MCQ' ? '' : 'N/A'));
            formData.append('solution', newItem.solution || 'Solution will be updated soon.');
            formData.append('difficulty', newItem.difficulty);
            formData.append('questionType', newItem.questionType || 'MCQ');
            formData.append('category', activeTab);
            formData.append('classLevel', newItem.classLevel || '11');

            // Context specific fields
            if (activeTab === 'line-by-line') {
                formData.append('chapterId', currentChapter._id);
                formData.append('topicId', currentTopic._id);
                formData.append('ncertLine', newItem.ncertLine || 'Page 1');
                formData.append('concept', newItem.concept || '');
                formData.append('paraname', newItem.paraname || '');
            } else {
                // For badges (questions/exemplars/diagrams)
                if (newItem.chapterId) {
                    formData.append('chapterId', newItem.chapterId);
                } else {
                    formData.append('chapterId', '000000000000000000000000');
                }
                // No topicId for badge based questions usually, unless we add topic selection too
                // Link to badge
                if (currentBadge) {
                    // actually backend expects badgeType? No field in backend yet?
                    // We just added badgeType to schema
                    formData.append('badgeType', currentBadge.badgeType);
                }
            }

            // Options
            if (newItem.questionType === 'MCQ' || newItem.questionType === 'Exemplar-MCQ' || !newItem.questionType) {
                formData.append('options', JSON.stringify(newItem.options));
            } else {
                formData.append('options', '[]');
            }

            // Files
            if (newItem.imageFile) {
                formData.append('image', newItem.imageFile);
            }
            if (newItem.solutionImageFile) {
                formData.append('solutionImage', newItem.solutionImageFile);
            }

            // Debug Payload
            console.log('--- Submitting Question Payload ---');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            setLoading(true);

            let res;
            if (editingItem) {
                res = await axios.put(`${API_URL}/questions/${editingItem._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Question updated successfully');
            } else {
                res = await axios.post(`${API_URL}/questions`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Question added successfully');
            }

            closeForm();
            // Refresh
            if (currentTopic) fetchQuestions({ topicId: currentTopic._id });
            else if (currentBadge) fetchQuestions({ badgeType: currentBadge.badgeType, category: activeTab });

        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.error || error.message || 'Failed to save question';
            toast.error(errMsg);

        } finally {
            setLoading(false);
        }
    };


    // Bulk Upload
    const [showBulkUploadForm, setShowBulkUploadForm] = useState(false);
    const [bulkFile, setBulkFile] = useState(null);

    const handleBulkUpload = async (e) => {
        e.preventDefault();
        if (!bulkFile) return;

        setLoading(true);

        try {
            let questionsToUpload = [];

            if (bulkFile.name.endsWith('.json')) {
                const text = await bulkFile.text();
                const json = JSON.parse(text);
                if (!Array.isArray(json)) throw new Error('Root must be an array');
                questionsToUpload = json;
            } else if (bulkFile.name.endsWith('.pdf')) {
                // PDF Parsing Logic
                const arrayBuffer = await bulkFile.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                let fullText = '';

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items.map(item => item.str);
                    fullText += strings.join(' ') + '\n';
                }

                // Heuristic Parsing of fullText into Questions
                const rawLines = fullText.split('\n').map(l => l.trim()).filter(l => l);
                let currentQ = null;

                // Regex patterns
                const qStartRegex = /^(\d+|Q\d+)[\.\)]\s+(.+)/i;
                const optionRegex = /^(\([a-d]\)|[a-d][\.\)])\s+(.+)/i;
                const ansRegex = /^(Answer|Ans|Correct)[:\s-]*([a-d])/i;

                for (let line of rawLines) {
                    const qMatch = line.match(qStartRegex);
                    if (qMatch) {
                        if (currentQ) questionsToUpload.push(currentQ);
                        currentQ = {
                            question: qMatch[2],
                            options: [],
                            correctAnswer: '',
                            solution: '',
                            difficulty: 'Medium',
                            questionType: 'MCQ'
                        };
                        continue;
                    }

                    const ansMatch = line.match(ansRegex);
                    if (ansMatch && currentQ) {
                        const letter = ansMatch[2].toLowerCase();
                        const index = letter.charCodeAt(0) - 97; // a=0
                        if (currentQ.options[index]) {
                            currentQ.correctAnswer = currentQ.options[index];
                        } else {
                            currentQ.correctAnswer = letter.toUpperCase();
                        }
                        continue;
                    }

                    const optMatch = line.match(optionRegex);
                    if (optMatch && currentQ) {
                        currentQ.options.push(optMatch[2]);
                        continue;
                    }

                    // Append to current question text if not option/answer
                    if (currentQ && currentQ.options.length === 0 && !line.match(/^Page/)) {
                        currentQ.question += ' ' + line;
                    }
                }
                if (currentQ) questionsToUpload.push(currentQ);

                if (questionsToUpload.length === 0) {
                    toast.error('No questions found in PDF. Ensure format is "1. Question... (a) Option... Answer: A"');
                    setLoading(false);
                    return;
                }
            } else {
                toast.error('Unsupported file type. Use JSON or PDF.');
                setLoading(false);
                return;
            }

            let successCount = 0;
            let failCount = 0;

            for (const item of questionsToUpload) {
                try {
                    const payload = {
                        question: item.question,
                        options: item.options || [],
                        correctAnswer: item.correctAnswer,
                        solution: item.solution || '',
                        difficulty: item.difficulty || 'Medium',
                        questionType: item.questionType || 'MCQ',
                        category: activeTab,
                        // Context
                        chapterId: item.chapterId || (currentChapter ? currentChapter._id : newItem.chapterId),
                        topicId: item.topicId || (currentTopic ? currentTopic._id : undefined),
                        badgeType: item.badgeType || (currentBadge ? currentBadge.badgeType : undefined),
                        ncertLine: item.ncertLine
                    };

                    await axios.post(`${API_URL}/questions`, payload);
                    successCount++;
                } catch (err) {
                    console.error(err);
                    failCount++;
                }
            }

            toast.success(`Uploaded ${successCount} questions. Failed: ${failCount}`);
            setShowBulkUploadForm(false);
            setBulkFile(null);

            // Refresh
            if (currentTopic) fetchQuestions({ topicId: currentTopic._id });
            else if (currentBadge) fetchQuestions({ badgeType: currentBadge.badgeType, category: activeTab });

        } catch (error) {
            console.error(error);
            toast.error('Upload failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- UI Helpers ---

    const openEdit = (item, type) => {
        setEditingItem(item);
        // Populate newItem based on item type
        if (type === 'chapter' || type === 'badge') {
            setNewItem({ ...item });
            if (type === 'chapter') setShowChapterForm(true);
            else setShowBadgeForm(true);
        } else if (type === 'topic') {
            setNewItem({
                name: item.name,
                description: item.description,
                order: item.order || 0
            });
            setShowTopicForm(true);
        } else if (type === 'question') {
            setNewItem({
                questionText: item.question, // Note: backend field is 'question'
                options: item.options || ['', '', '', ''],
                correctAnswer: item.correctAnswer,
                solution: item.solution || '',
                difficulty: item.difficulty || 'Medium',
                questionType: item.questionType || 'MCQ',
                ncertLine: item.ncertLine || '',
                concept: item.concept || '',
                paraname: item.paraname || '',
                chapterId: item.chapterId?._id || item.chapterId, // Handle populated or id
                topicId: item.topicId?._id || item.topicId,
                classLevel: item.classLevel || '11'
            });
            setShowQuestionForm(true);
        }
    };

    const closeForm = () => {
        setShowChapterForm(false);
        setShowBadgeForm(false);
        setShowTopicForm(false);
        setShowQuestionForm(false);
        setEditingItem(null);
        // Reset base state
        setNewItem({
            name: '',
            chapterNumber: '',
            description: '',
            icon: 'fa-book',
            color: 'cyan',
            classLevel: '11',
            category: activeTab,
            badgeType: '',
            difficulty: 'Medium',
            order: 0,
            questionText: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            solution: '',
            questionType: 'MCQ',
            chapterId: '', // For badge based
            ncertLine: '',
            concept: '',
            paraname: '',
            imageFile: null,
            solutionImageFile: null
        });
    };

    const icons = [
        'fa-book', 'fa-flask', 'fa-atom', 'fa-dna', 'fa-microscope',
        'fa-question-circle', 'fa-graduation-cap', 'fa-star', 'fa-chart-bar',
        'fa-brain', 'fa-calculator', 'fa-check-double', 'fa-edit'
    ];
    const colors = ['cyan', 'blue', 'purple', 'pink', 'green', 'yellow', 'orange', 'red'];


    // ================= RENDER =================

    // 1. Navigation Breadcrumb for Drill Down
    // 1. Navigation Breadcrumb for Drill Down
    const renderBreadcrumb = () => {
        if (currentBadge) {
            return (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 bg-gray-900/50 p-3 rounded-lg border border-gray-700 w-fit">
                    <button
                        onClick={() => setCurrentBadge(null)}
                        className="hover:text-cyan-400 font-bold capitalize"
                    >
                        {activeTab} Categories
                    </button>
                    <i className="fas fa-chevron-right text-xs"></i>
                    <span className="text-white font-bold">{currentBadge.name}</span>
                </div>
            );
        }

        if (!currentChapter) return null;
        return (
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 bg-gray-900/50 p-3 rounded-lg border border-gray-700 w-fit">
                <button
                    onClick={() => { setCurrentChapter(null); setCurrentTopic(null); }}
                    className="hover:text-cyan-400 font-bold"
                >
                    Chapters
                </button>
                <i className="fas fa-chevron-right text-xs"></i>
                <button
                    onClick={() => setCurrentTopic(null)} // If on question view, clicking topic goes back to topic list
                    className={`hover:text-cyan-400 ${!currentTopic ? 'text-white font-bold' : ''}`}
                    disabled={!currentTopic}
                >
                    {currentChapter.name}
                </button>
                {currentTopic && (
                    <>
                        <i className="fas fa-chevron-right text-xs"></i>
                        <span className="text-white font-bold">{currentTopic.name}</span>
                    </>
                )}
            </div>
        );
    };

    // 2. Main View (Chapters list)
    if (!currentChapter && activeTab === 'line-by-line') {
        return (
            <div className="w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Manage NCERT Toolbox</h2>

                {/* Tabs */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {['line-by-line', 'questions', 'exemplars', 'diagrams', 'nta-abhyas', 'error-reports'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-lg font-bold capitalize transition ${activeTab === tab ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                        >
                            {tab.replace(/-/g, ' ')}
                        </button>
                    ))}
                </div>

                {renderBreadcrumb()}

                <div className="glass-panel p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white capitalize">Manage Chapters</h3>
                        <button
                            onClick={() => setShowChapterForm(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            <i className="fas fa-plus mr-2"></i> Add Chapter
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chapters.map(chapter => (
                            <div
                                key={chapter._id}
                                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 relative group hover:border-cyan-500/50 transition-all cursor-pointer"
                                onClick={() => setCurrentChapter(chapter)}
                            >
                                {/* Actions */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-100 z-10 bg-gray-900/50 rounded-lg p-1">
                                    <button onClick={(e) => { e.stopPropagation(); openEdit(chapter, 'chapter'); }} className="text-blue-400 hover:text-blue-300 p-1">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(chapter._id, 'chapter'); }} className="text-red-400 hover:text-red-300 p-1">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-16 h-16 rounded-xl bg-${chapter.color}-500/20 flex items-center justify-center text-${chapter.color}-400 text-2xl flex-shrink-0`}>
                                        <i className={`fas ${chapter.icon}`}></i>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="text-sm text-gray-400">{chapter.chapterNumber}</div>
                                            {chapter.classLevel && (
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${chapter.classLevel === '11'
                                                    ? 'bg-purple-500/20 text-purple-400'
                                                    : 'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    Class {chapter.classLevel}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2 line-clamp-1">{chapter.name}</h4>
                                        <p className="text-sm text-gray-500 line-clamp-2">{chapter.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
                                    <span>Click to manage topics</span>
                                    <i className="fas fa-arrow-right text-cyan-400"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chapter Form Modal */}
                {showChapterForm && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 rounded-xl w-full max-w-lg border border-gray-700 p-6">
                            <h3 className="text-2xl font-bold text-white mb-6">{editingItem ? 'Edit' : 'Add'} Chapter</h3>
                            <form onSubmit={handleChapterSubmit} className="space-y-4">
                                <input type="text" placeholder="Name" required className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                                <input type="text" placeholder="Chapter Number" required className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.chapterNumber} onChange={e => setNewItem({ ...newItem, chapterNumber: e.target.value })} />
                                <textarea placeholder="Description" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white h-24" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })}></textarea>
                                <div className="grid grid-cols-2 gap-4">
                                    <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.color} onChange={e => setNewItem({ ...newItem, color: e.target.value })}>{colors.map(c => <option key={c} value={c}>{c}</option>)}</select>
                                    <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.icon} onChange={e => setNewItem({ ...newItem, icon: e.target.value })}>{icons.map(i => <option key={i} value={i}>{i.replace('fa-', '')}</option>)}</select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Class Level</label>
                                    <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.classLevel} onChange={e => setNewItem({ ...newItem, classLevel: e.target.value })}>
                                        <option value="11">Class 11</option>
                                        <option value="12">Class 12</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={closeForm} className="text-gray-400">Cancel</button><button type="submit" className="px-6 py-2 bg-cyan-500 text-black font-bold rounded">Save</button></div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // 3. Topics View (Inside a Chapter)
    if (currentChapter && !currentTopic && activeTab === 'line-by-line') {
        return (
            <div className="w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Manage NCERT Toolbox</h2>
                {renderBreadcrumb()}
                <div className="glass-panel p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Topics in {currentChapter.name}</h3>
                        <button onClick={() => setShowTopicForm(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"><i className="fas fa-plus mr-2"></i> Add Topic</button>
                    </div>

                    <div className="space-y-4">
                        {topics.length === 0 && <div className="text-center text-gray-500 py-10">No topics yet. Add one to get started.</div>}
                        {topics.map(topic => (
                            <div key={topic._id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex justify-between items-center cursor-pointer hover:border-cyan-500/50" onClick={() => setCurrentTopic(topic)}>
                                <div>
                                    <h4 className="text-white font-bold">{topic.name}</h4>
                                    <p className="text-sm text-gray-400">{topic.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-xs text-gray-500">Click to manage questions</div>
                                    <button onClick={(e) => { e.stopPropagation(); openEdit(topic, 'topic'); }} className="text-blue-400 hover:text-blue-300"><i className="fas fa-edit"></i></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(topic._id, 'topic'); }} className="text-red-400 hover:text-red-300"><i className="fas fa-trash"></i></button>
                                    <i className="fas fa-chevron-right text-cyan-400"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Topic Form Modal */}
                {showTopicForm && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 rounded-xl w-full max-w-lg border border-gray-700 p-6">
                            <h3 className="text-2xl font-bold text-white mb-6">{editingItem ? 'Edit' : 'Add'} Topic</h3>
                            <form onSubmit={handleTopicSubmit} className="space-y-4">
                                <input type="text" placeholder="Topic Name" required className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                                <input type="number" placeholder="Order (Sort Index)" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.order} onChange={e => setNewItem({ ...newItem, order: parseInt(e.target.value) })} />
                                <textarea placeholder="Description (Optional)" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white h-24" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })}></textarea>
                                <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={closeForm} className="text-gray-400">Cancel</button><button type="submit" className="px-6 py-2 bg-cyan-500 text-black font-bold rounded">Save</button></div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // 4. Questions View (Inside a Topic)
    if (currentChapter && currentTopic && activeTab === 'line-by-line') {
        return (
            <div className="w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Manage NCERT Toolbox</h2>
                {renderBreadcrumb()}
                <div className="glass-panel p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Questions in {currentTopic.name}</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setShowBulkUploadForm(true)} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"><i className="fas fa-file-upload mr-2"></i> Bulk Upload</button>
                            <button onClick={() => setShowQuestionForm(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"><i className="fas fa-plus mr-2"></i> Add Question</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {questions.length === 0 && <div className="text-center text-gray-500 py-10">No questions yet.</div>}
                        {questions.map((q, idx) => (
                            <div key={q._id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-gray-700 text-xs px-2 py-1 rounded">Q{idx + 1}</span>
                                        {q.classLevel && (
                                            <span className={`text-xs px-2 py-1 rounded ${q.classLevel === '11' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                Class {q.classLevel}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(q, 'question')} className="text-blue-400 hover:text-blue-300"><i className="fas fa-edit"></i></button>
                                        <button onClick={() => handleDelete(q._id, 'question')} className="text-red-400 hover:text-red-300"><i className="fas fa-trash"></i></button>
                                    </div>
                                </div>
                                <p className="text-white mb-2 ql-editor-content" dangerouslySetInnerHTML={{ __html: q.question }}></p>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                                    {q.options.map((opt, i) => (
                                        <div key={i} className={opt === q.correctAnswer ? 'text-green-400 font-bold' : ''}>
                                            <span className="font-semibold">{String.fromCharCode(65 + i)}. </span>
                                            <span className="ql-editor-content" dangerouslySetInnerHTML={{ __html: opt }}></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Question Form Modal */}
                {showQuestionForm && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-gray-900 rounded-xl w-full max-w-2xl border border-gray-700 p-6 my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
                            <h3 className="text-2xl font-bold text-white mb-6">{editingItem ? 'Edit' : 'Add'} Question</h3>
                            <form onSubmit={handleQuestionSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 mb-1">Class Level</label>
                                        <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.classLevel} onChange={e => setNewItem({ ...newItem, classLevel: e.target.value })}>
                                            <option value="11">Class 11</option>
                                            <option value="12">Class 12</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-1">Question Type</label>
                                        <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.questionType || 'MCQ'} onChange={e => setNewItem({ ...newItem, questionType: e.target.value })}>
                                            <option value="MCQ">MCQ</option>
                                            <option value="Subjective">Subjective (Q&A)</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Concept</label>
                                    <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.concept || ''} onChange={e => setNewItem({ ...newItem, concept: e.target.value })} placeholder="e.g., Atomic Structure, Mole Concept, etc." />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Paraname / Reference</label>
                                    <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.paraname || ''} onChange={e => setNewItem({ ...newItem, paraname: e.target.value })} placeholder="e.g., Page 45, Section 3.2, etc." />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Question Text</label>
                                    <div className="ncert-question-editor">
                                        <ReactQuill
                                            theme="snow"
                                            value={newItem.questionText}
                                            onChange={(content) => setNewItem({ ...newItem, questionText: content })}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Enter the question..."
                                            className="bg-gray-900 text-white rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {newItem.options.map((opt, i) => (
                                        <div key={i}>
                                            <label className="block text-gray-400 mb-1">Option {String.fromCharCode(65 + i)}</label>
                                            <div className="ncert-option-editor">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={opt}
                                                    onChange={(content) => {
                                                        const newOptions = [...newItem.options];
                                                        newOptions[i] = content;
                                                        setNewItem({ ...newItem, options: newOptions });
                                                    }}
                                                    modules={quillModules}
                                                    formats={quillFormats}
                                                    placeholder={`Enter option ${String.fromCharCode(65 + i)}...`}
                                                    className="bg-gray-900 text-white rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Correct Answer (Select from options)</label>
                                    <select required className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.correctAnswer} onChange={e => setNewItem({ ...newItem, correctAnswer: e.target.value })}>
                                        <option value="">Select Correct Answer</option>
                                        {newItem.options.map((opt, i) => {
                                            // Strip HTML tags for display in dropdown
                                            const tempDiv = document.createElement("div");
                                            tempDiv.innerHTML = opt;
                                            const textContent = tempDiv.textContent || tempDiv.innerText || "";
                                            return opt && <option key={i} value={opt}>{textContent || `Option ${String.fromCharCode(65 + i)}`}</option>;
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Solution / Explanation</label>
                                    <div className="ncert-explanation-editor">
                                        <ReactQuill
                                            theme="snow"
                                            value={newItem.solution}
                                            onChange={(content) => setNewItem({ ...newItem, solution: content })}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Explain the correct answer..."
                                            className="bg-gray-900 text-white rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={closeForm} className="text-gray-400">Cancel</button><button type="submit" className="px-6 py-2 bg-cyan-500 text-black font-bold rounded">Save Question</button></div>
                            </form>
                        </div>
                    </div >
                )}
            </div >
        );
    }

    // Fallback/Legacy Views for other tabs (Simple badge management)
    // Special case: NTA Abhyas has its own component
    if (activeTab === 'nta-abhyas') {
        return (
            <div className="w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Manage NCERT Toolbox</h2>
                <div className="flex flex-wrap gap-4 mb-8">
                    {['line-by-line', 'questions', 'exemplars', 'diagrams', 'nta-abhyas', 'error-reports'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-lg font-bold capitalize transition ${activeTab === tab ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{tab.replace(/-/g, ' ')}</button>
                    ))}
                </div>
                <ManageNTAAbhyas />
            </div>
        );
    }

    // Error Reports Management View
    if (activeTab === 'error-reports') {
        const handleStatusUpdate = async (reportId, newStatus, adminNotes = '') => {
            try {
                await updateErrorReport(reportId, { status: newStatus, adminNotes });
                toast.success('Report status updated successfully');
                // Refresh reports
                const reports = await fetchErrorReports();
                setErrorReports(reports);
            } catch (error) {
                console.error('Failed to update report:', error);
                toast.error('Failed to update report status');
            }
        };

        const handleDeleteReport = async (reportId) => {
            if (!window.confirm('Are you sure you want to delete this error report?')) return;
            try {
                await deleteErrorReport(reportId);
                toast.success('Report deleted successfully');
                // Refresh reports
                const reports = await fetchErrorReports();
                setErrorReports(reports);
            } catch (error) {
                console.error('Failed to delete report:', error);
                toast.error('Failed to delete report');
            }
        };

        const filteredReports = errorReportFilter === 'all'
            ? errorReports
            : errorReports.filter(report => report.status === errorReportFilter);

        // Pagination logic
        const totalPages = Math.ceil(filteredReports.length / REPORTS_PER_PAGE);
        const startIndex = (errorReportsPage - 1) * REPORTS_PER_PAGE;
        const endIndex = startIndex + REPORTS_PER_PAGE;
        const paginatedReports = filteredReports.slice(startIndex, endIndex);

        return (
            <div className="w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Manage NCERT Toolbox</h2>
                <div className="flex flex-wrap gap-4 mb-8">
                    {['line-by-line', 'questions', 'exemplars', 'diagrams', 'nta-abhyas', 'error-reports'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-lg font-bold capitalize transition ${activeTab === tab ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{tab.replace(/-/g, ' ')}</button>
                    ))}
                </div>

                <div className="glass-panel p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Error Reports</h3>
                        <div className="flex gap-2">
                            {['all', 'pending', 'reviewed', 'resolved', 'rejected'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => {
                                        setErrorReportFilter(filter);
                                        setErrorReportsPage(1); // Reset to first page when filter changes
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${errorReportFilter === filter
                                        ? 'bg-cyan-500 text-black'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {filter} ({filter === 'all' ? errorReports.length : errorReports.filter(r => r.status === filter).length})
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredReports.length === 0 && (
                            <div className="text-center text-gray-500 py-10">No error reports found.</div>
                        )}

                        {paginatedReports.map((report) => (
                            <div key={report._id} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                                {/* Report Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${report.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                report.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                                                    report.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {report.status.toUpperCase()}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="text-orange-400 font-semibold mb-1">
                                            <i className="fas fa-exclamation-triangle mr-2"></i>
                                            {report.errorType}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDeleteReport(report._id)}
                                            className="text-red-400 hover:text-red-300 p-2"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Question Details */}
                                {report.questionId && (
                                    <div className="mb-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                        <div className="text-xs text-gray-500 mb-2">REPORTED QUESTION</div>
                                        <div className="text-white mb-2 ql-editor-content" dangerouslySetInnerHTML={{ __html: report.questionId.question }}></div>
                                        {report.questionId.options && report.questionId.options.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mt-2">
                                                {report.questionId.options.map((opt, i) => (
                                                    <div key={i} className={opt === report.questionId.correctAnswer ? 'text-green-400 font-bold' : ''}>
                                                        <span className="font-semibold">{String.fromCharCode(65 + i)}. </span>
                                                        <span className="ql-editor-content" dangerouslySetInnerHTML={{ __html: opt }}></span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {report.questionId.chapterId && (
                                            <div className="text-xs text-gray-500 mt-2">
                                                Chapter: {report.questionId.chapterId.name || 'N/A'}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Additional Details */}
                                {report.additionalDetails && (
                                    <div className="mb-4 p-3 bg-blue-500/10 border-l-4 border-blue-500 rounded">
                                        <div className="text-xs text-blue-400 font-semibold mb-1">ADDITIONAL DETAILS</div>
                                        <p className="text-gray-300 text-sm">{report.additionalDetails}</p>
                                    </div>
                                )}

                                {/* Reporter Information */}
                                <div className="mb-4 p-3 bg-gray-900/30 rounded border border-gray-700">
                                    <div className="text-xs text-gray-500 mb-2">REPORTER INFORMATION</div>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Name:</span>
                                            <span className="text-white ml-2">{report.reporterName}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Email:</span>
                                            <span className="text-white ml-2">{report.reporterEmail}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Mobile:</span>
                                            <span className="text-white ml-2">{report.reporterMobile}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Notes */}
                                {report.adminNotes && (
                                    <div className="mb-4 p-3 bg-purple-500/10 border-l-4 border-purple-500 rounded">
                                        <div className="text-xs text-purple-400 font-semibold mb-1">ADMIN NOTES</div>
                                        <p className="text-gray-300 text-sm">{report.adminNotes}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-4 border-t border-gray-700">
                                    <button
                                        onClick={() => handleStatusUpdate(report._id, 'pending')}
                                        className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/30 transition"
                                    >
                                        Mark Pending
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(report._id, 'reviewed')}
                                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition"
                                    >
                                        Mark Reviewed
                                    </button>
                                    <button
                                        onClick={() => {
                                            const notes = prompt('Add admin notes (optional):');
                                            handleStatusUpdate(report._id, 'resolved', notes || '');
                                        }}
                                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition"
                                    >
                                        Mark Resolved
                                    </button>
                                    <button
                                        onClick={() => {
                                            const notes = prompt('Add rejection reason:');
                                            if (notes) handleStatusUpdate(report._id, 'rejected', notes);
                                        }}
                                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {filteredReports.length > 0 && (
                        <Pagination
                            currentPage={errorReportsPage}
                            totalPages={totalPages}
                            onPageChange={setErrorReportsPage}
                        />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-white mb-6">Manage NCERT Toolbox</h2>
            <div className="flex flex-wrap gap-4 mb-8">
                {['line-by-line', 'questions', 'exemplars', 'diagrams', 'nta-abhyas', 'error-reports'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-lg font-bold capitalize transition ${activeTab === tab ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{tab.replace(/-/g, ' ')}</button>
                ))}
            </div>

            {renderBreadcrumb()}

            {!currentBadge ? (
                <div className="glass-panel p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white capitalize">Manage {activeTab} Categories</h3>
                        <button onClick={() => setShowBadgeForm(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"><i className="fas fa-plus mr-2"></i> Add Category</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(activeTab === 'questions' ? questionsBadges : (activeTab === 'exemplars' ? exemplarBadges : diagramBadges)).map(badge => (
                            <div key={badge._id} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 relative group cursor-pointer hover:border-cyan-500/50" onClick={() => setCurrentBadge(badge)}>
                                <div className="flex items-start justify-between">
                                    <div className={`w-12 h-12 rounded-lg bg-${badge.color}-500/20 flex items-center justify-center text-${badge.color}-400 text-2xl mb-4`}><i className={`fas ${badge.icon}`}></i></div>
                                    <div className="flex gap-2">
                                        <div className="flex gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); openEdit(badge, 'badge'); }} className="text-blue-400 hover:text-blue-300"><i className="fas fa-edit"></i></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(badge._id, 'badge'); }} className="text-red-400 hover:text-red-300"><i className="fas fa-trash"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-lg font-bold text-white mb-1">{badge.name}</h4>
                                    {badge.classLevel && (
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${badge.classLevel === '11'
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            Class {badge.classLevel}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">{badge.description}</p>
                                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-400">
                                    <span>Manage Questions</span>
                                    <i className="fas fa-arrow-right text-cyan-400"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="glass-panel p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Questions in {currentBadge.name}</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setShowBulkUploadForm(true)} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"><i className="fas fa-file-upload mr-2"></i> Bulk Upload</button>
                            <button onClick={() => setShowQuestionForm(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"><i className="fas fa-plus mr-2"></i> Add Question</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {questions.length === 0 && <div className="text-center text-gray-500 py-10">No questions yet.</div>}
                        {questions.map((q, idx) => (
                            <div key={q._id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-gray-700 text-xs px-2 py-1 rounded">Q{idx + 1}</span>
                                        <span className={`text-xs px-2 py-1 rounded ${q.questionType === 'MCQ' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'}`}>{q.questionType}</span>
                                        {q.classLevel && (
                                            <span className={`text-xs px-2 py-1 rounded ${q.classLevel === '11' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                Class {q.classLevel}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(q, 'question')} className="text-blue-400 hover:text-blue-300"><i className="fas fa-edit"></i></button>
                                        <button onClick={() => handleDelete(q._id, 'question')} className="text-red-400 hover:text-red-300"><i className="fas fa-trash"></i></button>
                                    </div>
                                </div>
                                <p className="text-white mb-2 ql-editor-content" dangerouslySetInnerHTML={{ __html: q.question || q.questionText }}></p>
                                {/* {q.imageUrl && <img src={q.imageUrl} alt="Question" className="max-w-[200px] max-h-[200px] mb-2 rounded border border-gray-600" />} */}

                                {q.options && q.options.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-2">
                                        {q.options.map((opt, i) => (
                                            <div key={i} className={opt === q.correctAnswer ? 'text-green-400 font-bold' : ''}>
                                                <span className="font-semibold">{String.fromCharCode(65 + i)}. </span>
                                                <span className="ql-editor-content" dangerouslySetInnerHTML={{ __html: opt }}></span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* <div className="mt-2 pt-2 border-t border-gray-700 text-sm">
                                    <div className="text-cyan-400 font-semibold">Solution:</div>
                                    <p className="text-gray-300 whitespace-pre-wrap">{q.solution}</p>
                                </div> */}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Badge Form Modal */}
            {showBadgeForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl w-full max-w-lg border border-gray-700 p-6">
                        <h3 className="text-2xl font-bold text-white mb-6">{editingItem ? 'Edit' : 'Add'} Category</h3>
                        <form onSubmit={handleBadgeSubmit} className="space-y-4">
                            <input type="text" placeholder="Name" required className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                            <input type="text" placeholder="Type ID" required className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.badgeType} onChange={e => setNewItem({ ...newItem, badgeType: e.target.value })} />
                            <textarea placeholder="Description" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white h-24" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })}></textarea>
                            <div className="grid grid-cols-2 gap-4">
                                <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.color} onChange={e => setNewItem({ ...newItem, color: e.target.value })}>{colors.map(c => <option key={c} value={c}>{c}</option>)}</select>
                                <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.icon} onChange={e => setNewItem({ ...newItem, icon: e.target.value })}>{icons.map(i => <option key={i} value={i}>{i.replace('fa-', '')}</option>)}</select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Class Level</label>
                                <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.classLevel} onChange={e => setNewItem({ ...newItem, classLevel: e.target.value })}>
                                    <option value="11">Class 11</option>
                                    <option value="12">Class 12</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={closeForm} className="text-gray-400">Cancel</button><button type="submit" className="px-6 py-2 bg-cyan-500 text-black font-bold rounded">Save</button></div>
                        </form>
                    </div>
                </div>
            )}

            {/* Question Form Modal */}
            {showQuestionForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-gray-900 rounded-xl w-full max-w-2xl border border-gray-700 p-6 my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        <h3 className="text-2xl font-bold text-white mb-6">{editingItem ? 'Edit' : 'Add'} Question</h3>
                        <form onSubmit={handleQuestionSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-1">Class Level</label>
                                    <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.classLevel} onChange={e => setNewItem({ ...newItem, classLevel: e.target.value })}>
                                        <option value="11">Class 11</option>
                                        <option value="12">Class 12</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Question Type</label>
                                    <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.questionType || 'MCQ'} onChange={e => setNewItem({ ...newItem, questionType: e.target.value })}>
                                        <option value="MCQ">MCQ</option>
                                        <option value="Subjective">Subjective (Q&A)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1">Question Text</label>
                                <div className="ncert-question-editor">
                                    <ReactQuill
                                        theme="snow"
                                        value={newItem.questionText}
                                        onChange={(content) => setNewItem({ ...newItem, questionText: content })}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter the question..."
                                        className="bg-gray-900 text-white rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1">Question Image (Optional)</label>
                                <input type="file" accept="image/*" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" onChange={e => setNewItem({ ...newItem, imageFile: e.target.files[0] })} />
                            </div>

                            {(newItem.questionType === 'MCQ' || newItem.questionType === 'Exemplar-MCQ') && (
                                <div className="grid grid-cols-2 gap-4">
                                    {newItem.options.map((opt, i) => (
                                        <div key={i}>
                                            <label className="block text-gray-400 mb-1">Option {String.fromCharCode(65 + i)}</label>
                                            <div className="ncert-option-editor">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={opt}
                                                    onChange={(content) => {
                                                        const newOptions = [...newItem.options];
                                                        newOptions[i] = content;
                                                        setNewItem({ ...newItem, options: newOptions });
                                                    }}
                                                    modules={quillModules}
                                                    formats={quillFormats}
                                                    placeholder={`Enter option ${String.fromCharCode(65 + i)}...`}
                                                    className="bg-gray-900 text-white rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-400 mb-1">
                                    {(newItem.questionType === 'MCQ' || newItem.questionType === 'Exemplar-MCQ') ? 'Correct Answer (Select from options)' : 'Answer Key / Short Answer'}
                                </label>
                                {(newItem.questionType === 'MCQ' || newItem.questionType === 'Exemplar-MCQ') ? (
                                    <select required className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.correctAnswer} onChange={e => setNewItem({ ...newItem, correctAnswer: e.target.value })}>
                                        <option value="">Select Correct Answer</option>
                                        {newItem.options.map((opt, i) => {
                                            // Strip HTML tags for display in dropdown
                                            const tempDiv = document.createElement("div");
                                            tempDiv.innerHTML = opt;
                                            const textContent = tempDiv.textContent || tempDiv.innerText || "";
                                            return opt && <option key={i} value={opt}>{textContent || `Option ${String.fromCharCode(65 + i)}`}</option>;
                                        })}
                                    </select>
                                ) : (
                                    <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" value={newItem.correctAnswer} onChange={e => setNewItem({ ...newItem, correctAnswer: e.target.value })} placeholder="Short answer for reference" />
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1">Detailed Solution</label>
                                <div className="ncert-explanation-editor">
                                    <ReactQuill
                                        theme="snow"
                                        value={newItem.solution}
                                        onChange={(content) => setNewItem({ ...newItem, solution: content })}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Explain the correct answer..."
                                        className="bg-gray-900 text-white rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1">Solution Image (Optional)</label>
                                <input type="file" accept="image/*" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" onChange={e => setNewItem({ ...newItem, solutionImageFile: e.target.files[0] })} />
                            </div>

                            <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={closeForm} className="text-gray-400">Cancel</button><button type="submit" className="px-6 py-2 bg-cyan-500 text-black font-bold rounded">Save Question</button></div>
                        </form>
                    </div>
                </div>
            )}
            {/* Bulk Upload Modal */}
            {showBulkUploadForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl w-full max-w-lg border border-gray-700 p-6">
                        <h3 className="text-2xl font-bold text-white mb-4">Bulk Upload Questions</h3>
                        <p className="text-gray-400 mb-6 text-sm">
                            Upload a <strong>JSON</strong> file or a <strong>PDF</strong> (Experimental). <br />
                            Format: "1. Question... (a) Option... Answer: A"
                        </p>
                        <form onSubmit={handleBulkUpload} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Select File (JSON/PDF)</label>
                                <input
                                    type="file"
                                    accept=".json, .pdf"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                    onChange={e => setBulkFile(e.target.files[0])}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => { setShowBulkUploadForm(false); setBulkFile(null); }} className="text-gray-400">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-purple-500 text-white font-bold rounded">Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}; // Close ManageNCERT function

// Add custom styles for ReactQuill editors
const styleSheet = document.createElement("style");
styleSheet.textContent = `
            /* NCERT Question Editor */
            .ncert-question-editor .ql-toolbar {
                display: block !important;
            background-color: rgb(31, 41, 55);
            border: 1px solid rgb(55, 65, 81);
            border-radius: 0.5rem 0.5rem 0 0;
    }

            .ncert-question-editor .ql-container {
                background - color: rgb(17, 24, 39);
            border: 1px solid rgb(55, 65, 81);
            border-radius: 0 0 0.5rem 0.5rem;
            min-height: 120px;
    }

            /* NCERT Option Editor */
            .ncert-option-editor .ql-toolbar {
                display: block !important;
            background-color: rgb(31, 41, 55);
            border: 1px solid rgb(55, 65, 81);
            border-radius: 0.5rem 0.5rem 0 0;
    }

            .ncert-option-editor .ql-container {
                background - color: rgb(17, 24, 39);
            border: 1px solid rgb(55, 65, 81);
            border-radius: 0 0 0.5rem 0.5rem;
            min-height: 80px;
    }

            /* NCERT Explanation Editor */
            .ncert-explanation-editor .ql-toolbar {
                display: block !important;
            background-color: rgb(31, 41, 55);
            border: 1px solid rgb(55, 65, 81);
            border-radius: 0.5rem 0.5rem 0 0;
    }

            .ncert-explanation-editor .ql-container {
                background - color: rgb(17, 24, 39);
            border: 1px solid rgb(55, 65, 81);
            border-radius: 0 0 0.5rem 0.5rem;
            min-height: 120px;
    }

            /* Common Quill styles for NCERT */
            .ncert-question-editor .ql-editor,
            .ncert-option-editor .ql-editor,
            .ncert-explanation-editor .ql-editor {
                color: white;
            font-size: 14px;
    }

            .ncert-question-editor .ql-editor.ql-blank::before,
            .ncert-option-editor .ql-editor.ql-blank::before,
            .ncert-explanation-editor .ql-editor.ql-blank::before {
                color: rgb(156, 163, 175);
    }

            .ncert-question-editor .ql-toolbar button,
            .ncert-option-editor .ql-toolbar button,
            .ncert-explanation-editor .ql-toolbar button {
                color: rgb(209, 213, 219);
    }

            .ncert-question-editor .ql-toolbar button:hover,
            .ncert-option-editor .ql-toolbar button:hover,
            .ncert-explanation-editor .ql-toolbar button:hover {
                color: rgb(96, 165, 250);
    }

            .ncert-question-editor .ql-toolbar .ql-stroke,
            .ncert-option-editor .ql-toolbar .ql-stroke,
            .ncert-explanation-editor .ql-toolbar .ql-stroke {
                stroke: rgb(209, 213, 219);
    }

            .ncert-question-editor .ql-toolbar .ql-fill,
            .ncert-option-editor .ql-toolbar .ql-fill,
            .ncert-explanation-editor .ql-toolbar .ql-fill {
                fill: rgb(209, 213, 219);
    }

            .ncert-question-editor .ql-toolbar .ql-picker-label,
            .ncert-option-editor .ql-toolbar .ql-picker-label,
            .ncert-explanation-editor .ql-toolbar .ql-picker-label {
                color: rgb(209, 213, 219);
    }

            /* Content rendering styles */
            .ql-editor-content {
                display: inline;
    }

            .ql-editor-content p {
                display: inline;
            margin: 0;
    }

            .ql-editor-content strong {
                font - weight: bold;
    }

            .ql-editor-content em {
                font - style: italic;
    }

            .ql-editor-content u {
                text - decoration: underline;
    }

            .ql-editor-content sub {
                vertical - align: sub;
            font-size: smaller;
    }

            .ql-editor-content sup {
                vertical - align: super;
            font-size: smaller;
    }
            `;

if (!document.head.querySelector('#ncert-quill-styles')) {
    styleSheet.id = 'ncert-quill-styles';
    document.head.appendChild(styleSheet);
}

export default ManageNCERT;
