import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import mammoth from 'mammoth';

const ManageConceptNotes = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const [chapters, setChapters] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentChapterId, setCurrentChapterId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 2 rows × 3 columns

    // Form State
    const initialFormState = {
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

    const [formData, setFormData] = useState(initialFormState);
    const [thumbnailFileName, setThumbnailFileName] = useState('');
    const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);

    // Topic management
    const [currentTopic, setCurrentTopic] = useState({
        title: '',
        content: '',
        images: []
    });
    const [editingTopicIndex, setEditingTopicIndex] = useState(null);

    // Image Helper State
    const [imageUrl, setImageUrl] = useState('');
    const [imageCaption, setImageCaption] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    // For expandable chapters in list view
    const [expandedChapters, setExpandedChapters] = useState({});

    // Track editor focus state for expansion
    const [isEditorFocused, setIsEditorFocused] = useState(false);

    // Quill modules
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'formula'],
            ['clean']
        ],
    };

    useEffect(() => {
        fetchChapters();
    }, []);

    // Handle clicking outside editor to collapse it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isEditorFocused) {
                const editorContainer = document.querySelector('.ql-container');
                const toolbar = document.querySelector('.ql-toolbar');
                const editorWrapper = editorContainer?.parentElement;

                if (editorWrapper && !editorWrapper.contains(event.target) &&
                    toolbar && !toolbar.contains(event.target)) {
                    setIsEditorFocused(false);
                }
            }
        };

        if (isEditorFocused) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditorFocused]);

    const fetchChapters = async () => {
        try {
            // Add timestamp to prevent caching issues
            const timestamp = new Date().getTime();
            const url = `${API_URL}/concept-notes/admin/all?v=${timestamp}`;
            console.log('🔍 Fetching chapters from:', url);

            const response = await fetch(url, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            const data = await response.json();
            console.log('📚 Received chapters data:', data);
            console.log('📊 First chapter:', data[0]);
            console.log('📊 First chapter has _id?', data[0]?._id ? 'YES ✅' : 'NO ❌');
            console.log('📊 First chapter has chapterName?', data[0]?.chapterName ? 'YES ✅' : 'NO ❌');
            setChapters(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching chapters:', error);
        }
    };

    const toggleChapter = (chapterIndex) => {
        setExpandedChapters(prev => ({
            ...prev,
            [chapterIndex]: !prev[chapterIndex]
        }));
    };

    // Upload file to server
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

    // Handle thumbnail upload
    const handleThumbnailFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Image file size should be less than 5MB');
                return;
            }
            try {
                setThumbnailFileName('Uploading...');
                const url = await uploadFile(file);
                setFormData({ ...formData, thumbnailUrl: url });
                setThumbnailFileName(file.name);
            } catch (error) {
                setThumbnailFileName('Upload failed');
                alert('Error uploading thumbnail');
            }
        }
    };

    const handleThumbnailDragOver = (e) => {
        e.preventDefault();
        setIsDraggingThumbnail(true);
    };

    const handleThumbnailDragLeave = () => {
        setIsDraggingThumbnail(false);
    };

    const handleThumbnailDrop = async (e) => {
        e.preventDefault();
        setIsDraggingThumbnail(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image file size should be less than 5MB');
                return;
            }
            try {
                setThumbnailFileName('Uploading...');
                const url = await uploadFile(file);
                setFormData({ ...formData, thumbnailUrl: url });
                setThumbnailFileName(file.name);
            } catch (error) {
                setThumbnailFileName('Upload failed');
                alert('Error uploading thumbnail');
            }
        } else {
            alert('Please drop a valid image file');
        }
    };

    // Docx Import Handler
    const handleDocxImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.docx')) {
            alert('Please select a .docx file');
            return;
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });

            setCurrentTopic(prev => ({
                ...prev,
                content: (prev.content && prev.content !== '<p><br></p>')
                    ? prev.content + result.value
                    : result.value
            }));

            if (result.messages && result.messages.length > 0) {
                console.log('Mammoth warnings:', result.messages);
            }
        } catch (error) {
            console.error('Error importing .docx:', error);
            alert('Failed to import document');
        }

        e.target.value = '';
    };

    // --- Topic Management Functions ---

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingImage(true);
        try {
            const newImages = [];
            for (const file of files) {
                const url = await uploadFile(file);
                if (url) newImages.push({ url, caption: '' });
            }

            setCurrentTopic(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
        } catch (err) {
            console.error(err);
            alert('Error uploading files');
        } finally {
            setUploadingImage(false);
            e.target.value = '';
        }
    };

    const addImageToTopic = () => {
        if (!imageUrl) {
            alert('Please enter an image URL');
            return;
        }
        setCurrentTopic({
            ...currentTopic,
            images: [...currentTopic.images, { url: imageUrl, caption: imageCaption }]
        });
        setImageUrl('');
        setImageCaption('');
    };

    const removeImageFromTopic = (idx) => {
        setCurrentTopic({
            ...currentTopic,
            images: currentTopic.images.filter((_, i) => i !== idx)
        });
    };

    const handleAddTopic = () => {
        if (!currentTopic.title || !currentTopic.title.trim()) {
            alert('Please provide topic title');
            return;
        }

        if (!currentTopic.content || !currentTopic.content.trim()) {
            alert('Please provide topic content');
            return;
        }

        const updatedTopics = [...formData.topics];
        if (editingTopicIndex !== null) {
            updatedTopics[editingTopicIndex] = { ...currentTopic };
            setEditingTopicIndex(null);
        } else {
            updatedTopics.push({ ...currentTopic });
        }

        setFormData({ ...formData, topics: updatedTopics });
        setCurrentTopic({ title: '', content: '', images: [] });
    };

    const handleEditTopic = (index) => {
        const topic = formData.topics[index];
        setCurrentTopic({ ...topic });
        setEditingTopicIndex(index);
        // Scroll to editor
        const element = document.getElementById('topic-editor');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteTopic = (index) => {
        if (window.confirm('Delete this topic?')) {
            const updatedTopics = formData.topics.filter((_, i) => i !== index);
            setFormData({ ...formData, topics: updatedTopics });
        }
    };

    // --- Chapter Management Functions ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.topics.length === 0) {
            alert('Please add at least one topic to the chapter.');
            return;
        }

        setIsSubmitting(true);
        try {
            const url = isEditing
                ? `${API_URL}/concept-notes/admin/${currentChapterId}`
                : `${API_URL}/concept-notes/admin`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to save chapter');
            }

            alert(isEditing ? 'Chapter updated successfully!' : 'Chapter created successfully!');

            // Reset everything
            setFormData(initialFormState);
            setCurrentTopic({ title: '', content: '', images: [] });
            setThumbnailFileName('');
            setIsEditing(false);
            setCurrentChapterId(null);
            fetchChapters();
        } catch (error) {
            console.error('Error saving chapter:', error);
            alert('Error saving chapter: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditChapter = async (chapter) => {
        setIsEditing(true);
        setCurrentChapterId(chapter._id);

        try {
            const res = await fetch(`${API_URL}/concept-notes/admin/${chapter._id}`);
            if (!res.ok) throw new Error('Failed to fetch chapter details');

            const fullData = await res.json();

            setFormData({
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
            setIsEditing(false);
        }
    };

    const handleDeleteChapter = async (id) => {
        // Validate ID before proceeding
        if (!id || id === 'undefined') {
            alert('Error: Invalid chapter ID. Please refresh the page and try again.');
            console.error('Attempted to delete chapter with invalid ID:', id);
            return;
        }

        if (!window.confirm('Are you sure you want to delete this WHOLE chapter and all its topics?')) return;

        try {
            const response = await fetch(`${API_URL}/concept-notes/admin/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete chapter');
            }

            alert('Chapter deleted successfully');
            fetchChapters();
        } catch (error) {
            console.error('Error deleting chapter:', error);
            alert('Error deleting chapter: ' + error.message);
        }
    };

    // Pagination
    const safeChapters = Array.isArray(chapters) ? chapters : [];
    const totalPages = Math.ceil(safeChapters.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentChapters = safeChapters.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="space-y-8">
            {/* Main Form */}
            <div className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <i className="fas fa-book-reader text-purple-400"></i>
                    {isEditing ? 'Edit Concept Chapter' : 'Add New Concept Chapter'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
                                    value={formData.chapterName}
                                    onChange={(e) => setFormData({ ...formData, chapterName: e.target.value })}
                                    className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Exam Category</label>
                                <select
                                    value={formData.examType}
                                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                                    className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                                >
                                    <option value="All">All Exams</option>
                                    <option value="JEE">JEE</option>
                                    <option value="NEET">NEET</option>
                                    <option value="BOARDS">Boards</option>
                                    <option value="OLYMPIAD">Olympiad</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">Badge Text</label>
                                <input
                                    type="text"
                                    placeholder="e.g. New"
                                    value={formData.badges || ''}
                                    onChange={(e) => setFormData({ ...formData, badges: e.target.value })}
                                    className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2">Description (Optional)</label>
                            <textarea
                                placeholder="Brief description of this chapter"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full h-20"
                            />
                        </div>

                        {/* Thumbnail Upload */}
                        <div>
                            <label className="block text-gray-400 mb-2 font-semibold">
                                <i className="fas fa-image mr-2 text-pink-400"></i>
                                Chapter Thumbnail (Optional)
                            </label>
                            <div
                                onDragOver={handleThumbnailDragOver}
                                onDragLeave={handleThumbnailDragLeave}
                                onDrop={handleThumbnailDrop}
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDraggingThumbnail
                                    ? 'border-pink-400 bg-pink-500/10'
                                    : 'border-gray-700 hover:border-pink-500'
                                    }`}
                            >
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
                                        {thumbnailFileName || 'Click to upload or drag and drop'}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        PNG, JPG, WEBP (Max 5MB)
                                    </p>
                                </label>
                            </div>
                            {formData.thumbnailUrl && (
                                <div className="mt-3 p-3 bg-pink-900/30 border border-pink-500/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={formData.thumbnailUrl}
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
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-24"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
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
                            Topics & Content
                        </h3>

                        {/* Topic Editor Form */}
                        <div className="bg-gray-800/50 p-4 rounded-lg space-y-4" id="topic-editor">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <h4 className="text-md font-semibold text-white flex items-center gap-2">
                                    <i className="fas fa-file-alt"></i>
                                    {editingTopicIndex !== null ? 'Edit Topic' : 'Add New Topic'}
                                </h4>
                                {editingTopicIndex !== null && (
                                    <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg px-3 py-1.5">
                                        <p className="text-blue-300 text-xs flex items-center gap-2">
                                            <i className="fas fa-info-circle"></i>
                                            <span>Editing topic, click "Update Topic" to save changes</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            <input
                                type="text"
                                placeholder="Topic Title (e.g. First Law of Thermodynamics)"
                                value={currentTopic.title}
                                onChange={(e) => setCurrentTopic({ ...currentTopic, title: e.target.value })}
                                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            />

                            <div className="flex justify-between items-center mb-2">
                                <label className="text-white font-semibold flex items-center gap-2">
                                    <i className="fas fa-paragraph text-cyan-400"></i>
                                    Topic Content
                                    {isEditorFocused && (
                                        <span className="text-xs text-cyan-400 animate-pulse ml-2">
                                            (Expanded Mode - Click outside to minimize)
                                        </span>
                                    )}
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".docx"
                                        onChange={handleDocxImport}
                                        className="hidden"
                                        id="docx-upload"
                                    />
                                    <label
                                        htmlFor="docx-upload"
                                        className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded flex items-center gap-2 transition"
                                    >
                                        <i className="fas fa-file-word"></i>
                                        Import from Word (.docx)
                                    </label>
                                </div>
                            </div>

                            <div
                                className={`bg-white rounded-lg text-black relative transition-all duration-300 ${isEditorFocused ? 'shadow-2xl ring-2 ring-cyan-400' : ''
                                    }`}
                                onClick={() => setIsEditorFocused(true)}
                            >
                                <ReactQuill
                                    theme="snow"
                                    value={currentTopic.content}
                                    onChange={(content) => setCurrentTopic({ ...currentTopic, content })}
                                    modules={modules}
                                    style={{
                                        height: isEditorFocused ? '800px' : '300px',
                                        marginBottom: '42px',
                                        transition: 'height 0.3s ease'
                                    }}
                                    placeholder="Write your detailed notes here..."
                                    onFocus={() => setIsEditorFocused(true)}
                                    onBlur={() => {
                                        // Delay to allow clicking toolbar buttons
                                        setTimeout(() => {
                                            const activeElement = document.activeElement;
                                            const isQuillElement = activeElement?.closest('.ql-toolbar') ||
                                                activeElement?.closest('.ql-editor');
                                            if (!isQuillElement) {
                                                setIsEditorFocused(false);
                                            }
                                        }, 200);
                                    }}
                                />
                                {isEditorFocused && (
                                    <div
                                        className="absolute -bottom-8 left-0 right-0 text-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditorFocused(false);
                                        }}
                                    >
                                        <button
                                            type="button"
                                            className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                                        >
                                            Click here or outside to minimize editor
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Topic Images */}
                            <div className="border-t border-gray-700 pt-4 mt-8">
                                <label className="text-sm text-gray-400 block mb-2 font-semibold">
                                    <i className="fas fa-images mr-2 text-purple-400"></i>
                                    Add Images / Diagrams to Topic (Optional)
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Image URL (or upload)"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="bg-gray-800 border border-gray-600 rounded p-2 text-white flex-1 text-sm"
                                        />
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="topic-image-upload"
                                            />
                                            <label
                                                htmlFor="topic-image-upload"
                                                className={`cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-3 rounded flex items-center justify-center h-full border border-gray-600 ${uploadingImage ? 'opacity-50' : ''}`}
                                                title="Upload Multiple Images"
                                            >
                                                <i className={`fas ${uploadingImage ? 'fa-spinner fa-spin' : 'fa-images'}`}></i>
                                            </label>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Caption"
                                        value={imageCaption}
                                        onChange={(e) => setImageCaption(e.target.value)}
                                        className="bg-gray-800 border border-gray-600 rounded p-2 text-white flex-1 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={addImageToTopic}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 text-sm"
                                    >
                                        Add
                                    </button>
                                </div>

                                {currentTopic.images.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {currentTopic.images.map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                <img src={img.url} alt="mini" className="w-16 h-16 object-cover rounded border border-gray-600" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageFromTopic(idx)}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleAddTopic}
                                    className="bg-cyan-500 text-white font-semibold py-2 px-6 rounded hover:bg-cyan-400 transition"
                                >
                                    <i className="fas fa-plus mr-2"></i>
                                    {editingTopicIndex !== null ? 'Update Topic' : 'Add Topic to Chapter'}
                                </button>
                                {editingTopicIndex !== null && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingTopicIndex(null);
                                            setCurrentTopic({ title: '', content: '', images: [] });
                                        }}
                                        className="bg-gray-700 text-white font-semibold py-2 px-6 rounded hover:bg-gray-600 transition"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Topics List */}
                        {formData.topics.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-md font-semibold text-white">Topics in this Chapter ({formData.topics.length}):</h4>
                                    <div className="bg-green-900/30 border border-green-500/50 rounded-lg px-3 py-1.5">
                                        <p className="text-green-300 text-xs flex items-center gap-2">
                                            <i className="fas fa-check-circle"></i>
                                            <span>These notes will be visible on the frontend</span>
                                        </p>
                                    </div>
                                </div>
                                {formData.topics.map((topic, index) => (
                                    <div key={index} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                                        <div className="flex items-start justify-between p-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-0.5 rounded">
                                                        Topic {index + 1}
                                                    </span>
                                                    {topic.images?.length > 0 && (
                                                        <span className="text-gray-400 text-xs flex items-center gap-1">
                                                            <i className="fas fa-images"></i>
                                                            {topic.images.length}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-white font-semibold text-sm mb-1">{topic.title}</p>
                                                <p className="text-gray-400 text-xs line-clamp-2">
                                                    {(topic.content || '').replace(/<[^>]*>/g, '').substring(0, 100)}...
                                                </p>
                                            </div>
                                            <div className="flex gap-2 ml-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditTopic(index)}
                                                    className="p-2 text-cyan-400 hover:bg-gray-800 rounded text-sm transition"
                                                    title="Edit Topic"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteTopic(index)}
                                                    className="p-2 text-red-400 hover:bg-gray-800 rounded text-sm transition"
                                                    title="Delete Topic"
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

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-4 border-t border-gray-700">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`font-bold py-3 px-8 rounded transition ${isSubmitting
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-400'
                                } text-white`}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    {isEditing ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                isEditing ? 'Update Chapter' : 'Create Chapter'
                            )}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentChapterId(null);
                                    setFormData(initialFormState);
                                    setCurrentTopic({ title: '', content: '', images: [] });
                                    setThumbnailFileName('');
                                }}
                                className="bg-gray-700 text-white font-bold py-3 px-8 rounded hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Chapters List */}
            {safeChapters.length > 0 && (
                <div className="mb-4 text-gray-400">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, safeChapters.length)} of {safeChapters.length} chapters
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {currentChapters.map((chapter, chapterIndex) => (
                    <div key={chapter._id} className="glass-panel p-4 rounded-xl">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded ${(chapter.subject || '').includes('Physical') ? 'bg-blue-900 text-blue-300' :
                                        (chapter.subject || '').includes('Organic') ? 'bg-green-900 text-green-300' :
                                            (chapter.subject || '').includes('Inorganic') ? 'bg-purple-900 text-purple-300' :
                                                'bg-orange-900 text-orange-300'
                                        }`}>
                                        {chapter.subject || 'Unknown'}
                                    </span>
                                    <span className="text-gray-500 text-xs">• {chapter.examType || 'All'}</span>
                                    {chapter.badges && (
                                        <span className="text-pink-400 text-xs px-2 py-0.5 border border-pink-500/30 bg-pink-500/10 rounded-full font-bold ml-2">
                                            {chapter.badges}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-start gap-3">
                                    {chapter.thumbnailUrl && (
                                        <img
                                            src={chapter.thumbnailUrl}
                                            alt={chapter.chapterName}
                                            className="w-16 h-16 object-cover rounded border border-gray-600"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white">{chapter.chapterName || 'Untitled Chapter'}</h3>
                                        {chapter.description && (
                                            <p className="text-gray-400 text-sm mt-1">{chapter.description}</p>
                                        )}
                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            {chapter.topics?.length > 0 && (
                                                <span className="px-3 py-1 bg-cyan-900/50 border border-cyan-500 text-cyan-400 rounded-full text-xs">
                                                    {chapter.topics.length} Topics
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditChapter(chapter)}
                                    className="p-2 text-cyan-400 hover:bg-gray-700 rounded"
                                    title="Edit Chapter"
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button
                                    onClick={() => handleDeleteChapter(chapter._id)}
                                    className="p-2 text-red-400 hover:bg-gray-700 rounded"
                                    title="Delete Chapter"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>

                        {/* Topics List - Expandable */}
                        {chapter.topics && chapter.topics.length > 0 && (
                            <div className="mt-4 space-y-2 border-t border-gray-700 pt-3">
                                <button
                                    onClick={() => toggleChapter(chapterIndex)}
                                    className="w-full flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <i className={`fas fa-chevron-${expandedChapters[chapterIndex] ? 'down' : 'right'} text-cyan-400 text-xs`}></i>
                                        <span className="text-white font-semibold text-sm">Topics</span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {chapter.topics.length} topics
                                    </span>
                                </button>

                                {/* Topics List */}
                                {expandedChapters[chapterIndex] && Array.isArray(chapter.topics) && (
                                    <div className="bg-gray-900/50 p-3 space-y-2 rounded-lg">
                                        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg px-3 py-2 mb-3">
                                            <p className="text-blue-300 text-xs flex items-center gap-2">
                                                <i className="fas fa-info-circle"></i>
                                                <span>Preview of notes that students will see on the frontend</span>
                                            </p>
                                        </div>
                                        {chapter.topics.map((topic, topicIndex) => (
                                            <div key={topic._id || topicIndex} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                                                <div className="flex items-start justify-between p-3">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <i className="fas fa-book-open text-purple-400 text-xs mt-1"></i>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-0.5 rounded">
                                                                    Topic {topicIndex + 1}
                                                                </span>
                                                                {topic.images && Array.isArray(topic.images) && topic.images.length > 0 && (
                                                                    <span className="text-gray-400 text-xs flex items-center gap-1">
                                                                        <i className="fas fa-images"></i>
                                                                        {topic.images.length}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-white text-sm font-medium mb-1">{String(topic.title || 'Untitled')}</p>
                                                            {topic.content && (
                                                                <p className="text-gray-400 text-xs line-clamp-2">
                                                                    {String(topic.content || '').replace(/<[^>]*>/g, '').substring(0, 120)}...
                                                                </p>
                                                            )}
                                                        </div>
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 text-white">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManageConceptNotes;
