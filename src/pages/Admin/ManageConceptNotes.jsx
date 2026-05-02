import { useState, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import mammoth from 'mammoth';

// Register custom fonts for Quill
const Font = Quill.import('formats/font');
Font.whitelist = [
    'sans-serif',
    'serif',
    'monospace',
    'arial',
    'times-new-roman',
    'georgia',
    'courier',
    'verdana',
    'comic-sans',
    'impact'
];
Quill.register(Font, true);

const ManageConceptNotes = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // State Management
    const [chapters, setChapters] = useState([]);
    const [expandedChapters, setExpandedChapters] = useState({});
    const [expandedTopics, setExpandedTopics] = useState({});

    // Form States
    const [isEditingChapter, setIsEditingChapter] = useState(false);
    const [currentChapterId, setCurrentChapterId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Chapter Form
    const initialChapterState = {
        subject: 'Physical Chemistry',
        chapterName: '',
        description: '',
        thumbnailUrl: '',
        examType: 'All',
        order: 0,
        isActive: true,
        badges: '',
        topics: []
    };
    const [chapterForm, setChapterForm] = useState(initialChapterState);
    const [thumbnailFileName, setThumbnailFileName] = useState('');

    // Topic Form
    const [currentTopic, setCurrentTopic] = useState({
        title: '',
        images: [],
        concepts: []
    });
    const [editingTopicIndex, setEditingTopicIndex] = useState(null);

    // Concept Form
    const [currentConcept, setCurrentConcept] = useState({
        conceptName: '',
        content: '',
        images: [],
        practiceQuestions: []
    });
    const [editingConceptIndex, setEditingConceptIndex] = useState(null);

    // Practice Question Form
    const [currentQuestion, setCurrentQuestion] = useState({
        question: '',
        questionPdfUrl: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        difficulty: 'Medium'
    });
    const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

    // UI States
    const [imageUrl, setImageUrl] = useState('');
    const [imageCaption, setImageCaption] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [isEditorFocused, setIsEditorFocused] = useState(false);
    const [activeTab, setActiveTab] = useState('chapters'); // chapters, topics, concepts, questions

    // Quill modules
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': ['sans-serif', 'serif', 'monospace', 'arial', 'times-new-roman', 'georgia', 'courier', 'verdana', 'comic-sans', 'impact'] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'formula'],
            ['clean']
        ],
    };

    const quillModulesQuestion = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'formula'],
            ['clean']
        ],
    };

    const quillModulesOption = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'color': [] }],
            ['formula'],
            ['clean']
        ],
    };

    useEffect(() => {
        fetchChapters();
    }, []);

    const fetchChapters = async () => {
        try {
            const timestamp = new Date().getTime();
            const response = await fetch(`${API_URL}/concept-notes/admin/all?v=${timestamp}`, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            const data = await response.json();
            setChapters(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching chapters:', error);
        }
    };

    // File Upload
    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            return data.fileUrl || data.url;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    // Chapter Management
    const handleSubmitChapter = async (e) => {
        e.preventDefault();
        if (chapterForm.topics.length === 0) {
            alert('Please add at least one topic to the chapter.');
            return;
        }

        setIsSubmitting(true);
        try {
            const url = isEditingChapter
                ? `${API_URL}/concept-notes/admin/${currentChapterId}`
                : `${API_URL}/concept-notes/admin`;

            const method = isEditingChapter ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chapterForm)
            });

            if (!response.ok) throw new Error('Failed to save chapter');

            alert(isEditingChapter ? 'Chapter updated successfully!' : 'Chapter created successfully!');
            resetChapterForm();
            fetchChapters();
        } catch (error) {
            console.error('Error saving chapter:', error);
            alert('Error saving chapter: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetChapterForm = () => {
        setChapterForm(initialChapterState);
        setCurrentTopic({ title: '', images: [], concepts: [] });
        setCurrentConcept({ conceptName: '', content: '', images: [], practiceQuestions: [] });
        setCurrentQuestion({ question: '', questionPdfUrl: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', difficulty: 'Medium' });
        setThumbnailFileName('');
        setIsEditingChapter(false);
        setCurrentChapterId(null);
        setEditingTopicIndex(null);
        setEditingConceptIndex(null);
        setEditingQuestionIndex(null);
    };

    const handleEditChapter = async (chapter) => {
        setIsEditingChapter(true);
        setCurrentChapterId(chapter._id);

        try {
            const res = await fetch(`${API_URL}/concept-notes/admin/${chapter._id}`);
            if (!res.ok) throw new Error('Failed to fetch chapter details');

            const fullData = await res.json();
            setChapterForm({
                subject: fullData.subject,
                chapterName: fullData.chapterName,
                description: fullData.description || '',
                thumbnailUrl: fullData.thumbnailUrl || '',
                examType: fullData.examType,
                order: fullData.order,
                isActive: fullData.isActive,
                badges: fullData.badges || '',
                topics: fullData.topics || []
            });
            setThumbnailFileName(fullData.thumbnailUrl ? 'Current thumbnail' : '');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error fetching chapter details:', error);
            alert('Error loading chapter details. Please try again.');
            setIsEditingChapter(false);
        }
    };

    const handleDeleteChapter = async (id) => {
        if (!id || id === 'undefined') {
            alert('Error: Invalid chapter ID.');
            return;
        }

        if (!window.confirm('Delete this chapter and all its topics and concepts?')) return;

        try {
            const response = await fetch(`${API_URL}/concept-notes/admin/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete chapter');

            alert('Chapter deleted successfully');
            fetchChapters();
        } catch (error) {
            console.error('Error deleting chapter:', error);
            alert('Error deleting chapter: ' + error.message);
        }
    };

    // Topic Management
    const handleAddTopic = () => {
        if (!currentTopic.title || !currentTopic.title.trim()) {
            alert('Please provide topic title');
            return;
        }

        const updatedTopics = [...chapterForm.topics];
        if (editingTopicIndex !== null) {
            updatedTopics[editingTopicIndex] = { ...currentTopic };
            setEditingTopicIndex(null);
        } else {
            updatedTopics.push({ ...currentTopic });
        }

        setChapterForm({ ...chapterForm, topics: updatedTopics });
        setCurrentTopic({ title: '', images: [], concepts: [] });
        setCurrentConcept({ conceptName: '', content: '', images: [], practiceQuestions: [] });
    };

    const handleEditTopic = (index) => {
        const topic = chapterForm.topics[index];
        setCurrentTopic({ ...topic });
        setEditingTopicIndex(index);
    };

    const handleDeleteTopic = (index) => {
        if (window.confirm('Delete this topic and all its concepts?')) {
            const updatedTopics = chapterForm.topics.filter((_, i) => i !== index);
            setChapterForm({ ...chapterForm, topics: updatedTopics });
        }
    };

    // Concept Management
    const handleAddConcept = () => {
        if (!currentConcept.conceptName || !currentConcept.conceptName.trim()) {
            alert('Please provide concept name');
            return;
        }

        if (!currentConcept.content || !currentConcept.content.trim()) {
            alert('Please provide concept content');
            return;
        }

        const updatedConcepts = [...currentTopic.concepts];
        if (editingConceptIndex !== null) {
            updatedConcepts[editingConceptIndex] = { ...currentConcept };
            setEditingConceptIndex(null);
        } else {
            updatedConcepts.push({ ...currentConcept });
        }

        setCurrentTopic({ ...currentTopic, concepts: updatedConcepts });
        setCurrentConcept({ conceptName: '', content: '', images: [], practiceQuestions: [] });
        setCurrentQuestion({ question: '', questionPdfUrl: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', difficulty: 'Medium' });
    };

    const handleEditConcept = (index) => {
        const concept = currentTopic.concepts[index];
        setCurrentConcept({ ...concept });
        setEditingConceptIndex(index);
    };

    const handleDeleteConcept = (index) => {
        if (window.confirm('Delete this concept and all its practice questions?')) {
            const updatedConcepts = currentTopic.concepts.filter((_, i) => i !== index);
            setCurrentTopic({ ...currentTopic, concepts: updatedConcepts });
        }
    };

    // Practice Question Management
    const handleAddQuestion = () => {
        const isQuillEmpty = (val) => !val || val === '<p><br></p>' || !val.replace(/<[^>]*>/g, '').trim();

        if (isQuillEmpty(currentQuestion.question)) {
            alert('Please provide a question');
            return;
        }

        if (currentQuestion.options.some(opt => isQuillEmpty(opt))) {
            alert('Please fill all options');
            return;
        }

        const updatedQuestions = [...currentConcept.practiceQuestions];
        if (editingQuestionIndex !== null) {
            updatedQuestions[editingQuestionIndex] = { ...currentQuestion };
            setEditingQuestionIndex(null);
        } else {
            updatedQuestions.push({ ...currentQuestion });
        }

        setCurrentConcept({ ...currentConcept, practiceQuestions: updatedQuestions });
        setCurrentQuestion({ question: '', questionPdfUrl: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', difficulty: 'Medium' });
    };

    const handleEditQuestion = (index) => {
        const question = currentConcept.practiceQuestions[index];
        setCurrentQuestion({ ...question });
        setEditingQuestionIndex(index);
    };

    const handleDeleteQuestion = (index) => {
        if (window.confirm('Delete this practice question?')) {
            const updatedQuestions = currentConcept.practiceQuestions.filter((_, i) => i !== index);
            setCurrentConcept({ ...currentConcept, practiceQuestions: updatedQuestions });
        }
    };

    // Image Management (for both topics and concepts)
    const handleImageUpload = async (e, target = 'concept') => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingImage(true);
        try {
            const newImages = [];
            for (const file of files) {
                const url = await uploadFile(file);
                if (url) newImages.push({ url, caption: '' });
            }

            if (target === 'concept') {
                setCurrentConcept(prev => ({
                    ...prev,
                    images: [...prev.images, ...newImages]
                }));
            } else {
                setCurrentTopic(prev => ({
                    ...prev,
                    images: [...prev.images, ...newImages]
                }));
            }
        } catch (err) {
            console.error(err);
            alert('Error uploading files');
        } finally {
            setUploadingImage(false);
            e.target.value = '';
        }
    };

    const removeImage = (idx, target = 'concept') => {
        if (target === 'concept') {
            setCurrentConcept({
                ...currentConcept,
                images: currentConcept.images.filter((_, i) => i !== idx)
            });
        } else {
            setCurrentTopic({
                ...currentTopic,
                images: currentTopic.images.filter((_, i) => i !== idx)
            });
        }
    };

    const updateImageCaption = (idx, newCaption, target = 'concept') => {
        if (target === 'concept') {
            const updatedImages = [...currentConcept.images];
            updatedImages[idx] = { ...updatedImages[idx], caption: newCaption };
            setCurrentConcept({ ...currentConcept, images: updatedImages });
        } else {
            const updatedImages = [...currentTopic.images];
            updatedImages[idx] = { ...updatedImages[idx], caption: newCaption };
            setCurrentTopic({ ...currentTopic, images: updatedImages });
        }
    };

    // Thumbnail Upload
    const handleThumbnailFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file');
                return;
            }
            try {
                setThumbnailFileName('Uploading...');
                const url = await uploadFile(file);
                setChapterForm({ ...chapterForm, thumbnailUrl: url });
                setThumbnailFileName(file.name);
            } catch (error) {
                setThumbnailFileName('Upload failed');
                alert('Error uploading thumbnail');
            }
        }
    };

    // PDF Upload for Questions
    const handlePdfUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Please upload a valid PDF file');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert('PDF file size should be less than 10MB');
                return;
            }
            try {
                setUploadingPdf(true);
                const url = await uploadFile(file);
                setCurrentQuestion({ ...currentQuestion, questionPdfUrl: url });
            } catch (error) {
                alert('Error uploading PDF');
            } finally {
                setUploadingPdf(false);
            }
        }
    };


    // Docx Import
    const handleDocxImport = async (e, target = 'concept') => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.docx')) {
            alert('Please select a .docx file');
            return;
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });

            if (target === 'concept') {
                setCurrentConcept(prev => ({
                    ...prev,
                    content: (prev.content && prev.content !== '<p><br></p>')
                        ? prev.content + result.value
                        : result.value
                }));
            } else {
                setCurrentTopic(prev => ({
                    ...prev,
                    content: (prev.content && prev.content !== '<p><br></p>')
                        ? prev.content + result.value
                        : result.value
                }));
            }
        } catch (error) {
            console.error('Error importing .docx:', error);
            alert('Failed to import document');
        }

        e.target.value = '';
    };

    return (
        <div className="space-y-8">
            {/* Main Form */}
            <div className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <i className="fas fa-book-reader text-purple-400"></i>
                    {isEditingChapter ? 'Edit Concept Chapter' : 'Add New Concept Chapter'}
                </h2>

                <form onSubmit={handleSubmitChapter} className="space-y-6">
                    {/* Chapter Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                            <i className="fas fa-info-circle"></i>
                            Chapter Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-gray-400 mb-2">Subject</label>
                                <select
                                    value={chapterForm.subject}
                                    onChange={(e) => setChapterForm({ ...chapterForm, subject: e.target.value })}
                                    className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                                >
                                    <option value="Physical Chemistry">Physical Chemistry</option>
                                    <option value="Organic Chemistry">Organic Chemistry</option>
                                    <option value="Inorganic Chemistry">Inorganic Chemistry</option>
                                    <option value="General Chemistry">General Chemistry</option>
                                    <option value="Analytical Chemistry">Analytical Chemistry</option>
                                    <option value="Biochemistry">Biochemistry</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Chapter Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Thermodynamics"
                                    value={chapterForm.chapterName}
                                    onChange={(e) => setChapterForm({ ...chapterForm, chapterName: e.target.value })}
                                    className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Exam Category</label>
                                <select
                                    value={chapterForm.examType}
                                    onChange={(e) => setChapterForm({ ...chapterForm, examType: e.target.value })}
                                    className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                                >
                                    <option value="All">All Exams</option>
                                    <optgroup label="UG Entrance Exams">
                                        <option value="NEET">NEET</option>
                                        <option value="JEE">JEE</option>
                                        <option value="IAT">IAT</option>
                                        <option value="NEST">NEST</option>
                                        <option value="CUET UG">CUET UG</option>
                                        <option value="BITSAT">BITSAT</option>
                                    </optgroup>
                                    <optgroup label="PG Entrance Exams">
                                        <option value="IIT JAM">IIT JAM</option>
                                        <option value="CUET PG">CUET PG</option>
                                    </optgroup>
                                    <optgroup label="Research Level Exams">
                                        <option value="CSIR NET">CSIR NET</option>
                                        <option value="GATE">GATE</option>
                                        <option value="TIFR">TIFR</option>
                                    </optgroup>
                                    <optgroup label="Competitive Exams (Govt. Job)">
                                        <option value="PSTET">PSTET</option>
                                        <option value="Master Cadre">Master Cadre</option>
                                        <option value="UPSC - Mains (Chemistry)">UPSC - Mains (Chemistry)</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Badge Text</label>
                                <input
                                    type="text"
                                    placeholder="e.g. New"
                                    value={chapterForm.badges || ''}
                                    onChange={(e) => setChapterForm({ ...chapterForm, badges: e.target.value })}
                                    className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2">Description (Optional)</label>
                            <textarea
                                placeholder="Brief description of this chapter"
                                value={chapterForm.description}
                                onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full h-20"
                            />
                        </div>

                        {/* Thumbnail Upload */}
                        <div>
                            <label className="block text-gray-400 mb-2 font-semibold">
                                <i className="fas fa-image mr-2 text-pink-400"></i>
                                Chapter Thumbnail (Optional)
                            </label>
                            <div className="border-2 border-dashed border-gray-700 hover:border-pink-500 rounded-lg p-6 text-center transition-all">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailFileChange}
                                    className="hidden"
                                    id="thumbnailInput"
                                />
                                <label htmlFor="thumbnailInput" className="cursor-pointer">
                                    <i className="fas fa-image text-4xl text-pink-400 mb-3 block"></i>
                                    <p className="text-white mb-2">
                                        {thumbnailFileName || 'Click to upload'}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        PNG, JPG, WEBP (Max 5MB)
                                    </p>
                                </label>
                            </div>
                            {chapterForm.thumbnailUrl && (
                                <div className="mt-3 p-3 bg-pink-900/30 border border-pink-500/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={chapterForm.thumbnailUrl}
                                            alt="Thumbnail preview"
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="flex items-center gap-2">
                                            <i className="fas fa-check-circle text-green-400"></i>
                                            <span className="text-sm text-gray-300">Thumbnail uploaded</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                placeholder="Order"
                                value={chapterForm.order}
                                onChange={(e) => setChapterForm({ ...chapterForm, order: parseInt(e.target.value) })}
                                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-24"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={chapterForm.isActive}
                                    onChange={(e) => setChapterForm({ ...chapterForm, isActive: e.target.checked })}
                                    className="w-5 h-5 rounded"
                                />
                                <label htmlFor="active" className="text-white">Active</label>
                            </div>
                        </div>
                    </div>

                    {/* Topics Management */}
                    <div className="border-t border-gray-700 pt-6 space-y-6">
                        <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                            <i className="fas fa-list"></i>
                            Topics Management
                        </h3>

                        {/* Topic Editor */}
                        <div className="bg-gray-800/50 p-4 rounded-lg space-y-4">
                            <h4 className="text-md font-semibold text-white flex items-center gap-2">
                                <i className="fas fa-file-alt"></i>
                                {editingTopicIndex !== null ? 'Edit Topic' : 'Add New Topic'}
                            </h4>

                            <input
                                type="text"
                                placeholder="Topic Title (e.g. First Law of Thermodynamics)"
                                value={currentTopic.title}
                                onChange={(e) => setCurrentTopic({ ...currentTopic, title: e.target.value })}
                                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            />

                            {/* Concepts Management within Topic */}
                            <div className="border-t border-gray-600 pt-4 mt-8">
                                <h4 className="text-md font-semibold text-yellow-400 flex items-center gap-2 mb-4">
                                    <i className="fas fa-lightbulb"></i>
                                    Concepts in this Topic
                                </h4>

                                {/* Concept Editor */}
                                <div className="bg-gray-900/50 p-4 rounded-lg space-y-4 mb-4">
                                    <h5 className="text-sm font-semibold text-white flex items-center gap-2">
                                        <i className="fas fa-atom"></i>
                                        {editingConceptIndex !== null ? 'Edit Concept' : 'Add New Concept'}
                                    </h5>

                                    <input
                                        type="text"
                                        placeholder="Concept Name (e.g. Internal Energy)"
                                        value={currentConcept.conceptName}
                                        onChange={(e) => setCurrentConcept({ ...currentConcept, conceptName: e.target.value })}
                                        className="bg-gray-800 border border-gray-600 rounded p-3 text-white w-full"
                                    />

                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-white font-semibold flex items-center gap-2">
                                            <i className="fas fa-paragraph text-green-400"></i>
                                            Concept Content (Notes)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept=".docx"
                                                onChange={(e) => handleDocxImport(e, 'concept')}
                                                className="hidden"
                                                id="docx-upload-concept"
                                            />
                                            <label
                                                htmlFor="docx-upload-concept"
                                                className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded flex items-center gap-2 transition"
                                            >
                                                <i className="fas fa-file-word"></i>
                                                Import from Word
                                            </label>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg text-black">
                                        <ReactQuill
                                            theme="snow"
                                            value={currentConcept.content}
                                            onChange={(content) => setCurrentConcept({ ...currentConcept, content })}
                                            modules={modules}
                                            style={{ height: '300px', marginBottom: '42px' }}
                                            placeholder="Write detailed concept notes here..."
                                        />
                                    </div>

                                    {/* Concept Images */}
                                    <div className="border-t border-gray-600 pt-4 mt-8">
                                        <label className="text-sm text-gray-400 block mb-2 font-semibold">
                                            <i className="fas fa-images mr-2 text-purple-400"></i>
                                            Add Images to Concept (Optional)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => handleImageUpload(e, 'concept')}
                                                className="hidden"
                                                id="concept-image-upload"
                                            />
                                            <label
                                                htmlFor="concept-image-upload"
                                                className={`cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2 border border-gray-600 w-fit ${uploadingImage ? 'opacity-50' : ''}`}
                                            >
                                                <i className={`fas ${uploadingImage ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i>
                                                Upload Images
                                            </label>
                                        </div>

                                        {currentConcept.images.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                                {currentConcept.images.map((img, idx) => (
                                                    <div key={idx} className="relative bg-gray-800 rounded-lg p-2 border border-gray-600">
                                                        <div className="relative group">
                                                            <img
                                                                src={img.url}
                                                                alt={img.caption || 'Concept image'}
                                                                className="w-full h-32 object-cover rounded border border-gray-500"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(idx, 'concept')}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Caption (optional)"
                                                            value={img.caption}
                                                            onChange={(e) => updateImageCaption(idx, e.target.value, 'concept')}
                                                            className="bg-gray-700 border border-gray-600 rounded p-2 text-white text-xs w-full mt-2"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Practice Questions */}
                                    <div className="border-t border-gray-600 pt-4 mt-8">
                                        <h5 className="text-sm font-semibold text-orange-400 flex items-center gap-2 mb-4">
                                            <i className="fas fa-question-circle"></i>
                                            Practice Questions for this Concept
                                        </h5>

                                        {/* Question Editor */}
                                        <div className="bg-gray-800/50 p-4 rounded-lg space-y-3 mb-4">
                                            <h6 className="text-xs font-semibold text-white flex items-center gap-2">
                                                <i className="fas fa-edit"></i>
                                                {editingQuestionIndex !== null ? 'Edit Question' : 'Add New Question'}
                                            </h6>

                                            <div className="concept-question-editor">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={currentQuestion.question}
                                                    onChange={(content) => setCurrentQuestion({ ...currentQuestion, question: content })}
                                                    modules={quillModulesQuestion}
                                                    placeholder="Question"
                                                    className="bg-gray-900 text-white rounded-lg"
                                                />
                                            </div>

                                            {/* PDF Upload for Question */}
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-400 font-semibold flex items-center gap-2">
                                                    <i className="fas fa-file-pdf text-red-400"></i>
                                                    Question PDF (Optional)
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={handlePdfUpload}
                                                        className="hidden"
                                                        id="question-pdf-upload"
                                                    />
                                                    <label
                                                        htmlFor="question-pdf-upload"
                                                        className={`cursor-pointer bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 border border-red-500 text-sm ${uploadingPdf ? 'opacity-50' : ''}`}
                                                    >
                                                        <i className={`fas ${uploadingPdf ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i>
                                                        {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
                                                    </label>
                                                    {currentQuestion.questionPdfUrl && (
                                                        <a
                                                            href={currentQuestion.questionPdfUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                            View PDF
                                                        </a>
                                                    )}
                                                    {currentQuestion.questionPdfUrl && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setCurrentQuestion({ ...currentQuestion, questionPdfUrl: '' })}
                                                            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
                                                        >
                                                            <i className="fas fa-times"></i>
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {currentQuestion.options.map((option, idx) => (
                                                    <div key={idx} className="flex items-start gap-2">
                                                        <input
                                                            type="radio"
                                                            name="correctAnswer"
                                                            checked={currentQuestion.correctAnswer === idx}
                                                            onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: idx })}
                                                            className="w-4 h-4 mt-3 flex-shrink-0"
                                                        />
                                                        <div className="flex-1 concept-option-editor">
                                                            <ReactQuill
                                                                theme="snow"
                                                                value={option}
                                                                onChange={(content) => {
                                                                    const newOptions = [...currentQuestion.options];
                                                                    newOptions[idx] = content;
                                                                    setCurrentQuestion({ ...currentQuestion, options: newOptions });
                                                                }}
                                                                modules={quillModulesOption}
                                                                placeholder={`Option ${idx + 1}`}
                                                                className="bg-gray-900 text-white rounded-lg"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="concept-explanation-editor">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={currentQuestion.explanation}
                                                    onChange={(content) => setCurrentQuestion({ ...currentQuestion, explanation: content })}
                                                    modules={quillModulesQuestion}
                                                    placeholder="Explanation (optional)"
                                                    className="bg-gray-900 text-white rounded-lg"
                                                />
                                            </div>

                                            <select
                                                value={currentQuestion.difficulty}
                                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, difficulty: e.target.value })}
                                                className="bg-gray-700 border border-gray-600 rounded p-2 text-white text-sm"
                                            >
                                                <option value="Easy">Easy</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Hard">Hard</option>
                                            </select>

                                            <button
                                                type="button"
                                                onClick={handleAddQuestion}
                                                className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded text-sm transition"
                                            >
                                                <i className="fas fa-plus mr-2"></i>
                                                {editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}
                                            </button>
                                        </div>

                                        {/* Questions List */}
                                        {currentConcept.practiceQuestions.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-xs text-gray-400">Added Questions ({currentConcept.practiceQuestions.length})</p>
                                                {currentConcept.practiceQuestions.map((q, idx) => (
                                                    <div key={idx} className="bg-gray-700/50 p-3 rounded border border-gray-600">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="text-white text-sm font-semibold mb-1">Q{idx + 1}: {q.question}</p>
                                                                <p className="text-xs text-gray-400">Correct: {q.options[q.correctAnswer]}</p>
                                                                <span className={`text-xs px-2 py-0.5 rounded ${q.difficulty === 'Easy' ? 'bg-green-600' : q.difficulty === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'} text-white`}>
                                                                    {q.difficulty}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEditQuestion(idx)}
                                                                    className="text-blue-400 hover:text-blue-300 text-xs"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteQuestion(idx)}
                                                                    className="text-red-400 hover:text-red-300 text-xs"
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

                                    <button
                                        type="button"
                                        onClick={handleAddConcept}
                                        className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded transition"
                                    >
                                        <i className="fas fa-plus mr-2"></i>
                                        {editingConceptIndex !== null ? 'Update Concept' : 'Add Concept to Topic'}
                                    </button>
                                </div>

                                {/* Concepts List */}
                                {currentTopic.concepts.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-400">Added Concepts ({currentTopic.concepts.length})</p>
                                        {currentTopic.concepts.map((concept, idx) => (
                                            <div key={idx} className="bg-gray-800/50 p-3 rounded border border-gray-600">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="text-white font-semibold">{concept.conceptName}</p>
                                                        <p className="text-xs text-gray-400">
                                                            {concept.images.length} images, {concept.practiceQuestions.length} questions
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditConcept(idx)}
                                                            className="text-blue-400 hover:text-blue-300"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteConcept(idx)}
                                                            className="text-red-400 hover:text-red-300"
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

                            <button
                                type="button"
                                onClick={handleAddTopic}
                                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded transition"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                {editingTopicIndex !== null ? 'Update Topic' : 'Add Topic to Chapter'}
                            </button>
                        </div>

                        {/* Topics List */}
                        {chapterForm.topics.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-gray-400">Added Topics ({chapterForm.topics.length})</p>
                                {chapterForm.topics.map((topic, idx) => (
                                    <div key={idx} className="bg-gray-700/50 p-4 rounded border border-gray-600">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="text-white font-semibold text-lg">{topic.title}</p>
                                                <p className="text-sm text-gray-400">
                                                    {topic.concepts?.length || 0} concepts, {topic.images?.length || 0} images
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditTopic(idx)}
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteTopic(idx)}
                                                    className="text-red-400 hover:text-red-300"
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

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : (isEditingChapter ? 'Update Chapter' : 'Create Chapter')}
                        </button>
                        {isEditingChapter && (
                            <button
                                type="button"
                                onClick={resetChapterForm}
                                className="bg-gray-600 hover:bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Chapters List */}
            <div className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <i className="fas fa-list text-cyan-400"></i>
                    All Chapters ({chapters.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chapters.map((chapter) => (
                        <div key={chapter._id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg">{chapter.chapterName}</h3>
                                    <p className="text-sm text-gray-400">{chapter.subject}</p>
                                    <p className="text-xs text-gray-500">{chapter.examType}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {chapter.topics?.length || 0} topics
                                    </p>
                                </div>
                                {chapter.thumbnailUrl && (
                                    <img src={chapter.thumbnailUrl} alt={chapter.chapterName} className="w-16 h-16 object-cover rounded" />
                                )}
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => handleEditChapter(chapter)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm transition"
                                >
                                    <i className="fas fa-edit mr-2"></i>
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteChapter(chapter._id)}
                                    className="flex-1 bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded text-sm transition"
                                >
                                    <i className="fas fa-trash mr-2"></i>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Add custom font styles
const style = document.createElement('style');
style.innerHTML = `
    /* Quill Font Families */
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="sans-serif"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="sans-serif"]::before {
        content: 'Sans Serif';
        font-family: sans-serif;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
        content: 'Serif';
        font-family: serif;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
        content: 'Monospace';
        font-family: monospace;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
        content: 'Arial';
        font-family: Arial, sans-serif;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before {
        content: 'Times New Roman';
        font-family: 'Times New Roman', serif;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before {
        content: 'Georgia';
        font-family: Georgia, serif;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier"]::before {
        content: 'Courier';
        font-family: 'Courier New', monospace;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before {
        content: 'Verdana';
        font-family: Verdana, sans-serif;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="comic-sans"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="comic-sans"]::before {
        content: 'Comic Sans';
        font-family: 'Comic Sans MS', cursive;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="impact"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="impact"]::before {
        content: 'Impact';
        font-family: Impact, sans-serif;
    }

    /* Apply fonts to editor content */
    .ql-font-sans-serif { font-family: sans-serif; }
    .ql-font-serif { font-family: serif; }
    .ql-font-monospace { font-family: monospace; }
    .ql-font-arial { font-family: Arial, sans-serif; }
    .ql-font-times-new-roman { font-family: 'Times New Roman', serif; }
    .ql-font-georgia { font-family: Georgia, serif; }
    .ql-font-courier { font-family: 'Courier New', monospace; }
    .ql-font-verdana { font-family: Verdana, sans-serif; }
    .ql-font-comic-sans { font-family: 'Comic Sans MS', cursive; }
    .ql-font-impact { font-family: Impact, sans-serif; }
`;
if (!document.head.querySelector('#quill-custom-fonts')) {
    style.id = 'quill-custom-fonts';
    document.head.appendChild(style);
}

// Styles for Practice Question rich text editors
const practiceQuestionStyle = document.createElement('style');
practiceQuestionStyle.innerHTML = `
    .concept-question-editor .ql-toolbar {
        display: block !important;
        background-color: rgb(31, 41, 55);
        border: 1px solid rgb(75, 85, 99);
        border-radius: 0.5rem 0.5rem 0 0;
    }
    .concept-question-editor .ql-container {
        background-color: rgb(55, 65, 81);
        border: 1px solid rgb(75, 85, 99);
        border-radius: 0 0 0.5rem 0.5rem;
        min-height: 80px;
    }
    .concept-question-editor .ql-editor {
        color: white;
        min-height: 80px;
    }
    .concept-question-editor .ql-editor.ql-blank::before {
        color: rgb(156, 163, 175);
    }
    .concept-option-editor .ql-toolbar {
        display: block !important;
        background-color: rgb(31, 41, 55);
        border: 1px solid rgb(75, 85, 99);
        border-radius: 0.5rem 0.5rem 0 0;
    }
    .concept-option-editor .ql-container {
        background-color: rgb(55, 65, 81);
        border: 1px solid rgb(75, 85, 99);
        border-radius: 0 0 0.5rem 0.5rem;
        min-height: 50px;
    }
    .concept-option-editor .ql-editor {
        color: white;
        min-height: 50px;
    }
    .concept-option-editor .ql-editor.ql-blank::before {
        color: rgb(156, 163, 175);
    }
    .concept-explanation-editor .ql-toolbar {
        display: block !important;
        background-color: rgb(31, 41, 55);
        border: 1px solid rgb(75, 85, 99);
        border-radius: 0.5rem 0.5rem 0 0;
    }
    .concept-explanation-editor .ql-container {
        background-color: rgb(55, 65, 81);
        border: 1px solid rgb(75, 85, 99);
        border-radius: 0 0 0.5rem 0.5rem;
        min-height: 60px;
    }
    .concept-explanation-editor .ql-editor {
        color: white;
        min-height: 60px;
    }
    .concept-explanation-editor .ql-editor.ql-blank::before {
        color: rgb(156, 163, 175);
    }
    .concept-question-editor .ql-toolbar .ql-stroke,
    .concept-option-editor .ql-toolbar .ql-stroke,
    .concept-explanation-editor .ql-toolbar .ql-stroke {
        stroke: rgb(156, 163, 175);
    }
    .concept-question-editor .ql-toolbar .ql-fill,
    .concept-option-editor .ql-toolbar .ql-fill,
    .concept-explanation-editor .ql-toolbar .ql-fill {
        fill: rgb(156, 163, 175);
    }
    .concept-question-editor .ql-toolbar .ql-picker,
    .concept-option-editor .ql-toolbar .ql-picker,
    .concept-explanation-editor .ql-toolbar .ql-picker {
        color: rgb(156, 163, 175);
    }
    .concept-question-editor .ql-toolbar button:hover .ql-stroke,
    .concept-option-editor .ql-toolbar button:hover .ql-stroke,
    .concept-explanation-editor .ql-toolbar button:hover .ql-stroke {
        stroke: white;
    }
    .concept-question-editor .ql-toolbar button:hover .ql-fill,
    .concept-option-editor .ql-toolbar button:hover .ql-fill,
    .concept-explanation-editor .ql-toolbar button:hover .ql-fill {
        fill: white;
    }
`;
if (!document.head.querySelector('#concept-practice-question-editors')) {
    practiceQuestionStyle.id = 'concept-practice-question-editors';
    document.head.appendChild(practiceQuestionStyle);
}

export default ManageConceptNotes;
