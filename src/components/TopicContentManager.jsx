import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TopicContentManager = ({ topic, onUpdate, onClose }) => {
    const [activeTab, setActiveTab] = useState('videos'); // 'videos', 'sheets', 'exercises'
    const [loading, setLoading] = useState(false);

    const BASE_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';
    const API_URL = `${BASE_URL}/self-learn`;
    const BUNNY_LIBRARY_ID = import.meta.env.VITE_BUNNY_LIBRARY_ID || '';

    // Keep selectedExerciseSet in sync when topic updates
    useEffect(() => {
        if (selectedExerciseSet && topic.learn?.exercises) {
            const updatedSet = topic.learn.exercises.find(set => set._id === selectedExerciseSet._id);
            if (updatedSet) {
                setSelectedExerciseSet(updatedSet);
            }
        }
    }, [topic]);

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

    // Helper function to construct Bunny.net video URL
    const getBunnyVideoUrl = (video) => {
        if (video.bunnyUrl) {
            return video.bunnyUrl;
        }
        if (video.videoId && BUNNY_LIBRARY_ID) {
            return `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${video.videoId}`;
        }
        return null;
    };

    // Video form state
    const [videoForm, setVideoForm] = useState({
        title: '',
        bunnyUrl: '',
        videoId: '',
        youtubeUrl: '',
        youtubeId: '',
        videoType: 'bunny', // 'bunny' or 'youtube'
        duration: '',
        thumbnail: '',
        order: 1
    });

    // Sheet form state
    const [sheetForm, setSheetForm] = useState({
        title: '',
        pdfUrl: '',
        pdfFile: null,
        description: '',
        order: 1
    });

    // Exercise form state
    const [selectedExerciseSet, setSelectedExerciseSet] = useState(null);
    const [expandedSets, setExpandedSets] = useState({});
    const [showAddQuestionForm, setShowAddQuestionForm] = useState({});
    const [exerciseSetForm, setExerciseSetForm] = useState({
        exerciseName: '',
        description: '',
        order: 1
    });
    const [exerciseForm, setExerciseForm] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        difficulty: 'Medium',
        marks: 4,
        negativeMarks: 1,
        order: 1
    });

    const [editingVideo, setEditingVideo] = useState(null);
    const [editingSheet, setEditingSheet] = useState(null);
    const [editingExerciseSet, setEditingExerciseSet] = useState(null);
    const [editingExercise, setEditingExercise] = useState(null);

    // Video Operations
    const handleVideoSubmit = async (e) => {
        e.preventDefault();
        
        // Validation for Bunny.net videos
        if (videoForm.videoType === 'bunny') {
            if (!videoForm.bunnyUrl && !videoForm.videoId) {
                toast.error('Please provide either Bunny.net URL or Video ID');
                return;
            }
            // If only videoId is provided, construct the full URL
            if (videoForm.videoId && !videoForm.bunnyUrl && BUNNY_LIBRARY_ID) {
                videoForm.bunnyUrl = `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoForm.videoId}`;
            }
        }
        
        // Validation for YouTube videos
        if (videoForm.videoType === 'youtube') {
            if (!videoForm.youtubeUrl || !videoForm.youtubeId) {
                toast.error('Please provide a valid YouTube URL');
                return;
            }
        }
        
        setLoading(true);
        try {
            if (editingVideo) {
                await axios.put(`${API_URL}/admin/topics/${topic._id}/videos/${editingVideo._id}`, videoForm);
                toast.success('Video updated successfully');
            } else {
                await axios.post(`${API_URL}/admin/topics/${topic._id}/videos`, videoForm);
                toast.success('Video added successfully');
            }
            resetVideoForm();
            onUpdate();
        } catch (error) {
            console.error('Error saving video:', error);
            toast.error('Failed to save video');
        } finally {
            setLoading(false);
        }
    };

    const deleteVideo = async (videoId) => {
        if (!window.confirm('Delete this video?')) return;
        setLoading(true);
        try {
            await axios.delete(`${API_URL}/admin/topics/${topic._id}/videos/${videoId}`);
            toast.success('Video deleted');
            onUpdate();
        } catch (error) {
            console.error('Error deleting video:', error);
            toast.error('Failed to delete video');
        } finally {
            setLoading(false);
        }
    };

    const editVideo = (video) => {
        setEditingVideo(video);
        setVideoForm({
            title: video.title,
            bunnyUrl: video.bunnyUrl || '',
            videoId: video.videoId || '',
            youtubeUrl: video.youtubeUrl || '',
            youtubeId: video.youtubeId || '',
            videoType: video.videoType || 'bunny',
            duration: video.duration || '',
            thumbnail: video.thumbnail || '',
            order: video.order || 1
        });
    };

    const resetVideoForm = () => {
        setEditingVideo(null);
        setVideoForm({
            title: '',
            bunnyUrl: '',
            videoId: '',
            youtubeUrl: '',
            youtubeId: '',
            videoType: 'bunny',
            duration: '',
            thumbnail: '',
            order: 1
        });
    };

    // Sheet Operations
    const handleSheetSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let pdfUrl = sheetForm.pdfUrl;
            
            // Handle file upload if a file is selected
            if (sheetForm.pdfFile) {
                const formData = new FormData();
                formData.append('pdf', sheetForm.pdfFile);
                
                // Upload the PDF file
                const uploadResponse = await axios.post(`${BASE_URL}/upload/pdf`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                pdfUrl = uploadResponse.data.url;
                toast.success('PDF uploaded successfully');
            }
            
            if (!pdfUrl) {
                toast.error('Please provide a PDF URL or upload a file');
                return;
            }
            
            const sheetData = {
                title: sheetForm.title,
                pdfUrl: pdfUrl,
                description: sheetForm.description,
                order: sheetForm.order
            };
            
            if (editingSheet) {
                await axios.put(`${API_URL}/admin/topics/${topic._id}/sheets/${editingSheet._id}`, sheetData);
                toast.success('Sheet updated successfully');
            } else {
                await axios.post(`${API_URL}/admin/topics/${topic._id}/sheets`, sheetData);
                toast.success('Sheet added successfully');
            }
            resetSheetForm();
            onUpdate();
        } catch (error) {
            console.error('Error saving sheet:', error);
            toast.error(error.response?.data?.message || 'Failed to save sheet');
        } finally {
            setLoading(false);
        }
    };

    const deleteSheet = async (sheetId) => {
        if (!window.confirm('Delete this sheet?')) return;
        setLoading(true);
        try {
            await axios.delete(`${API_URL}/admin/topics/${topic._id}/sheets/${sheetId}`);
            toast.success('Sheet deleted');
            onUpdate();
        } catch (error) {
            console.error('Error deleting sheet:', error);
            toast.error('Failed to delete sheet');
        } finally {
            setLoading(false);
        }
    };

    const editSheet = (sheet) => {
        setEditingSheet(sheet);
        setSheetForm({
            title: sheet.title,
            pdfUrl: sheet.pdfUrl,
            pdfFile: null,
            description: sheet.description || '',
            order: sheet.order || 1
        });
    };

    const resetSheetForm = () => {
        setEditingSheet(null);
        setSheetForm({
            title: '',
            pdfUrl: '',
            pdfFile: null,
            description: '',
            order: 1
        });
    };

    // Exercise Set Operations
    const handleExerciseSetSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!exerciseSetForm.exerciseName || exerciseSetForm.exerciseName.trim() === '') {
            toast.error('Please enter an exercise set name');
            return;
        }
        
        console.log('📤 Submitting exercise set:', exerciseSetForm);
        setLoading(true);
        try {
            if (editingExerciseSet) {
                await axios.put(`${API_URL}/admin/topics/${topic._id}/exercise-sets/${editingExerciseSet._id}`, exerciseSetForm);
                toast.success('Exercise set updated successfully');
                resetExerciseSetForm();
                await onUpdate();
            } else {
                const response = await axios.post(`${API_URL}/admin/topics/${topic._id}/exercise-sets`, exerciseSetForm);
                console.log('✅ Exercise set created:', response.data);
                toast.success('Exercise set added successfully');
                resetExerciseSetForm();
                
                // Update the topic data first
                await onUpdate();
                
                // Then try to auto-expand the newly created set
                setTimeout(() => {
                    const newSetData = response.data?.learn?.exercises;
                    if (newSetData?.length > 0) {
                        const newSet = newSetData[newSetData.length - 1];
                        setExpandedSets(prev => ({ ...prev, [newSet._id]: true }));
                        setShowAddQuestionForm(prev => ({ ...prev, [newSet._id]: true }));
                        setSelectedExerciseSet(newSet);
                    }
                }, 200);
            }
        } catch (error) {
            console.error('❌ Error saving exercise set:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.error || 'Failed to save exercise set';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const deleteExerciseSet = async (setId) => {
        if (!window.confirm('Delete this exercise set and all its questions?')) return;
        setLoading(true);
        try {
            await axios.delete(`${API_URL}/admin/topics/${topic._id}/exercise-sets/${setId}`);
            toast.success('Exercise set deleted');
            if (selectedExerciseSet?._id === setId) {
                setSelectedExerciseSet(null);
            }
            setExpandedSets(prev => { const n = { ...prev }; delete n[setId]; return n; });
            setShowAddQuestionForm(prev => { const n = { ...prev }; delete n[setId]; return n; });
            onUpdate();
        } catch (error) {
            console.error('Error deleting exercise set:', error);
            toast.error('Failed to delete exercise set');
        } finally {
            setLoading(false);
        }
    };

    const editExerciseSet = (exerciseSet) => {
        setEditingExerciseSet(exerciseSet);
        setExerciseSetForm({
            exerciseName: exerciseSet.exerciseName,
            description: exerciseSet.description || '',
            order: exerciseSet.order || 1
        });
    };

    const resetExerciseSetForm = () => {
        setEditingExerciseSet(null);
        setExerciseSetForm({
            exerciseName: '',
            description: '',
            order: 1
        });
    };

    // Exercise Operations (within a set)
    const handleExerciseSubmit = async (e) => {
        e.preventDefault();
        if (!selectedExerciseSet) {
            toast.error('Please select an exercise set first');
            return;
        }
        setLoading(true);
        try {
            if (editingExercise) {
                await axios.put(`${API_URL}/admin/topics/${topic._id}/exercise-sets/${selectedExerciseSet._id}/questions/${editingExercise._id}`, exerciseForm);
                toast.success('Question updated successfully');
            } else {
                await axios.post(`${API_URL}/admin/topics/${topic._id}/exercise-sets/${selectedExerciseSet._id}/questions`, exerciseForm);
                toast.success('Question added successfully');
            }
            resetExerciseForm();
            onUpdate();
        } catch (error) {
            console.error('Error saving question:', error);
            toast.error('Failed to save question');
        } finally {
            setLoading(false);
        }
    };

    const deleteExercise = async (exerciseId) => {
        if (!window.confirm('Delete this question?')) return;
        if (!selectedExerciseSet) return;
        setLoading(true);
        try {
            await axios.delete(`${API_URL}/admin/topics/${topic._id}/exercise-sets/${selectedExerciseSet._id}/questions/${exerciseId}`);
            toast.success('Question deleted');
            onUpdate();
        } catch (error) {
            console.error('Error deleting question:', error);
            toast.error('Failed to delete question');
        } finally {
            setLoading(false);
        }
    };

    const editExercise = (exercise) => {
        setEditingExercise(exercise);
        setExerciseForm({
            question: exercise.question,
            options: exercise.options,
            correctAnswer: exercise.correctAnswer,
            explanation: exercise.explanation || '',
            difficulty: exercise.difficulty || 'Medium',
            marks: exercise.marks || 4,
            negativeMarks: exercise.negativeMarks || 1,
            order: exercise.order || 1
        });
    };

    const resetExerciseForm = () => {
        setEditingExercise(null);
        setExerciseForm({
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

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel rounded-xl border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="border-b border-gray-700 p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-white">{topic.topicName}</h3>
                            <p className="text-gray-400 text-sm mt-1">Manage content: Videos, Sheets & Exercises</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-700 px-6">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`px-4 py-3 font-medium transition border-b-2 ${
                                activeTab === 'videos'
                                    ? 'text-cyan-400 border-cyan-400'
                                    : 'text-gray-400 border-transparent hover:text-white'
                            }`}
                        >
                            <i className="fas fa-video mr-2"></i>
                            Videos ({topic.learn?.videos?.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab('sheets')}
                            className={`px-4 py-3 font-medium transition border-b-2 ${
                                activeTab === 'sheets'
                                    ? 'text-cyan-400 border-cyan-400'
                                    : 'text-gray-400 border-transparent hover:text-white'
                            }`}
                        >
                            <i className="fas fa-file-pdf mr-2"></i>
                            Sheets ({topic.learn?.sheets?.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab('exercises')}
                            className={`px-4 py-3 font-medium transition border-b-2 ${
                                activeTab === 'exercises'
                                    ? 'text-cyan-400 border-cyan-400'
                                    : 'text-gray-400 border-transparent hover:text-white'
                            }`}
                        >
                            <i className="fas fa-tasks mr-2"></i>
                            Exercises ({topic.learn?.exercises?.length || 0})
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Videos Tab */}
                    {activeTab === 'videos' && (
                        <div className="space-y-6">
                            {/* Library ID Warning */}
                            {!BUNNY_LIBRARY_ID && (
                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <i className="fas fa-exclamation-triangle text-yellow-400 text-xl mt-0.5"></i>
                                        <div className="flex-1">
                                            <h5 className="text-yellow-400 font-semibold mb-2">Bunny.net Library ID Not Configured</h5>
                                            <p className="text-gray-400 text-sm mb-3">
                                                Videos with only Video ID will not play on the frontend. Configure Library ID to enable automatic URL construction.
                                            </p>
                                            <div className="bg-gray-800/50 rounded p-3 border border-gray-700/50">
                                                <p className="text-gray-300 text-xs font-mono mb-2">
                                                    <i className="fas fa-terminal mr-2 text-cyan-400"></i>
                                                    <strong>Quick Setup:</strong>
                                                </p>
                                                <ol className="text-gray-400 text-xs space-y-1 list-decimal list-inside ml-2">
                                                    <li>Get Library ID from <span className="text-cyan-400">Bunny.net Dashboard → Stream → Video Library</span></li>
                                                    <li>Add to <span className="text-cyan-400">.env</span> file: <code className="bg-gray-900 px-2 py-0.5 rounded">VITE_BUNNY_LIBRARY_ID=your_id</code></li>
                                                    <li>Restart server: <code className="bg-gray-900 px-2 py-0.5 rounded">npm run dev</code></li>
                                                </ol>
                                                <p className="text-gray-500 text-xs mt-2">
                                                    📖 See: <span className="text-cyan-400">BUNNY_LIBRARY_ID_SETUP.md</span> for detailed guide
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Video Form */}
                            <form onSubmit={handleVideoSubmit} className="glass-panel p-6 rounded-xl border border-gray-700">
                                <h4 className="text-lg font-bold text-white mb-4">
                                    {editingVideo ? 'Edit Video' : 'Add Video'}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Title <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={videoForm.title}
                                            onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                            placeholder="e.g., Introduction to Topic"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Video Type <span className="text-red-400">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setVideoForm({ ...videoForm, videoType: 'bunny' })}
                                                className={`px-4 py-2 rounded border transition ${
                                                    videoForm.videoType === 'bunny' 
                                                    ? 'bg-cyan-500 border-cyan-500 text-white' 
                                                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                                                }`}
                                            >
                                                🐰 Bunny.net
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setVideoForm({ ...videoForm, videoType: 'youtube' })}
                                                className={`px-4 py-2 rounded border transition ${
                                                    videoForm.videoType === 'youtube' 
                                                    ? 'bg-red-500 border-red-500 text-white' 
                                                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                                                }`}
                                            >
                                                📺 YouTube
                                            </button>
                                        </div>
                                    </div>

                                    {videoForm.videoType === 'bunny' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Bunny.net URL <span className="text-gray-400 text-xs">(Optional - provide either URL or Video ID)</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    value={videoForm.bunnyUrl}
                                                    onChange={(e) => setVideoForm({ ...videoForm, bunnyUrl: e.target.value })}
                                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                                    placeholder="https://video.bunnycdn.com/... (or leave empty if using Video ID)"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Video ID <span className="text-gray-400 text-xs">(Optional - provide either URL or Video ID)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={videoForm.videoId}
                                                    onChange={(e) => setVideoForm({ ...videoForm, videoId: e.target.value })}
                                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                                    placeholder="Bunny Video ID (or leave empty if using URL)"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {videoForm.videoType === 'youtube' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    YouTube URL <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    required
                                                    value={videoForm.youtubeUrl}
                                                    onChange={(e) => {
                                                        const url = e.target.value;
                                                        const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1] || '';
                                                        setVideoForm({ 
                                                            ...videoForm, 
                                                            youtubeUrl: url, 
                                                            youtubeId: videoId 
                                                        });
                                                    }}
                                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    YouTube Video ID (Auto-extracted)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={videoForm.youtubeId}
                                                    readOnly
                                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-gray-300"
                                                    placeholder="Video ID will appear here"
                                                />
                                            </div>
                                        </>
                                    )}
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Duration (e.g., 10:30)
                                        </label>
                                        <input
                                            type="text"
                                            value={videoForm.duration}
                                            onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                            placeholder="10:30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Thumbnail URL
                                        </label>
                                        <input
                                            type="url"
                                            value={videoForm.thumbnail}
                                            onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded hover:opacity-90 transition disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : editingVideo ? 'Update Video' : 'Add Video'}
                                    </button>
                                    {editingVideo && (
                                        <button
                                            type="button"
                                            onClick={resetVideoForm}
                                            className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Video List */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-bold text-white">Videos ({topic.learn?.videos?.length || 0})</h4>
                                {topic.learn?.videos?.length > 0 ? (
                                    topic.learn.videos.map((video) => {
                                        const videoUrl = getBunnyVideoUrl(video);
                                        return (
                                        <div key={video._id} className="glass-panel p-4 rounded-xl border border-gray-700 flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h5 className="text-white font-medium">{video.title}</h5>
                                                    {videoUrl && (
                                                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                                                            <i className="fas fa-check-circle mr-1"></i>Ready
                                                        </span>
                                                    )}
                                                    {!videoUrl && (
                                                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                                                            <i className="fas fa-exclamation-circle mr-1"></i>Invalid URL
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-400 mt-1 space-y-1">
                                                    {video.videoId && <div><i className="fas fa-id-badge mr-2"></i>ID: {video.videoId}</div>}
                                                    {videoUrl && <div className="text-xs text-gray-500 truncate"><i className="fas fa-link mr-2"></i>{videoUrl}</div>}
                                                    {video.duration && <div><i className="fas fa-clock mr-2"></i>{video.duration}</div>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => editVideo(video)}
                                                    className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() => deleteVideo(video._id)}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    );})
                                ) : (
                                    <div className="text-center py-8 bg-gray-800/30 rounded-xl border border-gray-700/50 text-gray-400">
                                        <i className="fas fa-video text-3xl mb-2 opacity-50"></i>
                                        <p>No videos added yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Sheets Tab */}
                    {activeTab === 'sheets' && (
                        <div className="space-y-6">
                            {/* Sheet Form */}
                            <form onSubmit={handleSheetSubmit} className="glass-panel p-6 rounded-xl border border-gray-700">
                                <h4 className="text-lg font-bold text-white mb-4">
                                    {editingSheet ? 'Edit Sheet' : 'Add Sheet'}
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Title <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={sheetForm.title}
                                            onChange={(e) => setSheetForm({ ...sheetForm, title: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                            placeholder="e.g., Class Notes - Chapter 1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            PDF URL or Upload File <span className="text-red-400">*</span>
                                        </label>
                                        <div className="space-y-3">
                                            {/* File Upload */}
                                            <div>
                                                <label className="block w-full">
                                                    <div className="border-2 border-dashed border-gray-600 hover:border-cyan-500 rounded-lg p-4 text-center cursor-pointer transition bg-gray-800/50">
                                                        {sheetForm.pdfFile ? (
                                                            <div className="text-green-400">
                                                                <i className="fas fa-file-pdf text-2xl mb-2"></i>
                                                                <p className="text-sm font-medium">{sheetForm.pdfFile.name}</p>
                                                                <p className="text-xs text-gray-500">{(sheetForm.pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                            </div>
                                                        ) : (
                                                            <div className="text-gray-400">
                                                                <i className="fas fa-cloud-upload-alt text-3xl mb-2"></i>
                                                                <p className="text-sm font-medium">Click to upload PDF</p>
                                                                <p className="text-xs">or drag and drop</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                if (file.size > 10 * 1024 * 1024) {
                                                                    toast.error('File size must be less than 10MB');
                                                                    e.target.value = null;
                                                                    return;
                                                                }
                                                                setSheetForm({ ...sheetForm, pdfFile: file, pdfUrl: '' });
                                                            }
                                                        }}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {sheetForm.pdfFile && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSheetForm({ ...sheetForm, pdfFile: null })}
                                                        className="text-xs text-red-400 hover:text-red-300 mt-1"
                                                    >
                                                        <i className="fas fa-times mr-1"></i>Remove file
                                                    </button>
                                                )}
                                            </div>
                                            
                                            {/* OR Divider */}
                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-gray-700"></div>
                                                </div>
                                                <div className="relative flex justify-center text-xs">
                                                    <span className="px-2 bg-gray-900 text-gray-500">OR</span>
                                                </div>
                                            </div>
                                            
                                            {/* URL Input */}
                                            <div>
                                                <input
                                                    type="url"
                                                    value={sheetForm.pdfUrl}
                                                    onChange={(e) => setSheetForm({ ...sheetForm, pdfUrl: e.target.value, pdfFile: null })}
                                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                                    placeholder="https://example.com/file.pdf"
                                                    disabled={!!sheetForm.pdfFile}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Or paste PDF URL directly</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={sheetForm.description}
                                            onChange={(e) => setSheetForm({ ...sheetForm, description: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                            rows="3"
                                            placeholder="Brief description of the sheet content"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded hover:opacity-90 transition disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : editingSheet ? 'Update Sheet' : 'Add Sheet'}
                                    </button>
                                    {editingSheet && (
                                        <button
                                            type="button"
                                            onClick={resetSheetForm}
                                            className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Sheet List */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-bold text-white">Sheets ({topic.learn?.sheets?.length || 0})</h4>
                                {topic.learn?.sheets?.length > 0 ? (
                                    topic.learn.sheets.map((sheet) => (
                                        <div key={sheet._id} className="glass-panel p-4 rounded-xl border border-gray-700 flex justify-between items-start">
                                            <div className="flex-1">
                                                <h5 className="text-white font-medium">{sheet.title}</h5>
                                                {sheet.description && <p className="text-gray-400 text-sm mt-1">{sheet.description}</p>}
                                                <div className="text-sm text-gray-500 mt-2">
                                                    <i className="fas fa-link mr-2"></i>
                                                    <a href={sheet.pdfUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">
                                                        View PDF
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => editSheet(sheet)}
                                                    className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() => deleteSheet(sheet._id)}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-gray-800/30 rounded-xl border border-gray-700/50 text-gray-400">
                                        <i className="fas fa-file-pdf text-3xl mb-2 opacity-50"></i>
                                        <p>No sheets added yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Exercises Tab */}
                    {activeTab === 'exercises' && (
                        <div className="space-y-6">
                            {/* Exercise Set Form */}
                            <form onSubmit={handleExerciseSetSubmit} className="glass-panel p-6 rounded-xl border border-gray-700">
                                <h4 className="text-lg font-bold text-white mb-4">
                                    {editingExerciseSet ? 'Edit Exercise Set' : 'Add Exercise Set'}
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Exercise Set Name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={exerciseSetForm.exerciseName}
                                            onChange={(e) => setExerciseSetForm({ ...exerciseSetForm, exerciseName: e.target.value })}
                                            placeholder="e.g., Exercise Set 1, Practice Test A"
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={exerciseSetForm.description}
                                            onChange={(e) => setExerciseSetForm({ ...exerciseSetForm, description: e.target.value })}
                                            placeholder="Brief description of this exercise set"
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                            rows="2"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:opacity-90 transition disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : editingExerciseSet ? 'Update Set' : 'Add Set'}
                                    </button>
                                    {editingExerciseSet && (
                                        <button
                                            type="button"
                                            onClick={resetExerciseSetForm}
                                            className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Exercise Sets List */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-bold text-white">Exercise Sets ({topic.learn?.exercises?.length || 0})</h4>
                                {topic.learn?.exercises?.length > 0 ? (
                                    topic.learn.exercises.map((exerciseSet, index) => (
                                        <div 
                                            key={exerciseSet._id} 
                                            className={`rounded-xl border transition-all overflow-hidden ${
                                                expandedSets[exerciseSet._id]
                                                    ? 'border-cyan-500/50 bg-gray-800/40' 
                                                    : 'border-gray-700 bg-gray-800/20'
                                            }`}
                                        >
                                            {/* Set Header - clickable to expand */}
                                            <div
                                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/30 transition-colors"
                                                onClick={() => setExpandedSets(prev => ({ ...prev, [exerciseSet._id]: !prev[exerciseSet._id] }))}
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <i className={`fas fa-chevron-right text-gray-400 transition-transform duration-200 ${ expandedSets[exerciseSet._id] ? 'rotate-90' : ''}`}></i>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h5 className="text-base font-semibold text-white">{exerciseSet.exerciseName}</h5>
                                                        <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">
                                                            {exerciseSet.questions?.length || 0} Questions
                                                        </span>
                                                        {exerciseSet.description && (
                                                            <span className="text-xs text-gray-400 truncate max-w-xs hidden sm:inline">{exerciseSet.description}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-3" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => editExerciseSet(exerciseSet)}
                                                        className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition text-xs"
                                                        title="Edit set name"
                                                    >
                                                        <i className="fas fa-pen"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteExerciseSet(exerciseSet._id)}
                                                        className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition text-xs"
                                                        title="Delete set"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded Content */}
                                            {expandedSets[exerciseSet._id] && (
                                                <div className="border-t border-gray-700 p-4 space-y-4">

                                                    {/* Add Question toggle button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const isOpen = showAddQuestionForm[exerciseSet._id];
                                                            setShowAddQuestionForm(prev => ({ ...prev, [exerciseSet._id]: !isOpen }));
                                                            if (!isOpen) {
                                                                setSelectedExerciseSet(exerciseSet);
                                                                resetExerciseForm();
                                                            } else {
                                                                setSelectedExerciseSet(null);
                                                            }
                                                        }}
                                                        className={`w-full py-2 rounded-lg border-dashed border-2 text-sm font-medium transition ${
                                                            showAddQuestionForm[exerciseSet._id]
                                                                ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                                                                : 'border-cyan-500/50 text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/10'
                                                        }`}
                                                    >
                                                        <i className={`fas ${showAddQuestionForm[exerciseSet._id] ? 'fa-minus' : 'fa-plus'} mr-2`}></i>
                                                        {showAddQuestionForm[exerciseSet._id] ? 'Cancel Adding' : 'Add New Question'}
                                                    </button>

                                                    {/* Question Form - shown when add is clicked */}
                                                    {showAddQuestionForm[exerciseSet._id] && selectedExerciseSet?._id === exerciseSet._id && (
                                                    <form onSubmit={handleExerciseSubmit} className="p-4 bg-gray-900/60 rounded-lg border border-cyan-500/30">
                                                        <h6 className="text-md font-bold text-white mb-3">
                                                            {editingExercise ? 'Edit Question' : 'Add Question'}
                                                        </h6>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                    Question <span className="text-red-400">*</span>
                                                                </label>
                                                                <div className="quill-editor">
                                                                    <ReactQuill
                                                                        theme="snow"
                                                                        value={exerciseForm.question}
                                                                        onChange={(value) => setExerciseForm({ ...exerciseForm, question: value })}
                                                                        modules={quillModules}
                                                                        formats={quillFormats}
                                                                        placeholder="Enter question text with formatting..."
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {[0, 1, 2, 3].map((i) => (
                                                                    <div key={i}>
                                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                            Option {i + 1} <span className="text-red-400">*</span>
                                                                        </label>
                                                                        <div className="quill-option">
                                                                            <ReactQuill
                                                                                theme="snow"
                                                                                value={exerciseForm.options[i]}
                                                                                onChange={(value) => {
                                                                                    const newOptions = [...exerciseForm.options];
                                                                                    newOptions[i] = value;
                                                                                    setExerciseForm({ ...exerciseForm, options: newOptions });
                                                                                }}
                                                                                modules={quillModulesSimple}
                                                                                formats={quillFormats}
                                                                                placeholder={`Option ${i + 1}`}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                        Correct Answer <span className="text-red-400">*</span>
                                                                    </label>
                                                                    <select
                                                                        value={exerciseForm.correctAnswer}
                                                                        onChange={(e) => setExerciseForm({ ...exerciseForm, correctAnswer: parseInt(e.target.value) })}
                                                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                                                    >
                                                                        <option value={0}>Option 1</option>
                                                                        <option value={1}>Option 2</option>
                                                                        <option value={2}>Option 3</option>
                                                                        <option value={3}>Option 4</option>
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                        Difficulty
                                                                    </label>
                                                                    <select
                                                                        value={exerciseForm.difficulty}
                                                                        onChange={(e) => setExerciseForm({ ...exerciseForm, difficulty: e.target.value })}
                                                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                                                    >
                                                                        <option value="Easy">Easy</option>
                                                                        <option value="Medium">Medium</option>
                                                                        <option value="Hard">Hard</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                        Marks
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        value={exerciseForm.marks}
                                                                        onChange={(e) => setExerciseForm({ ...exerciseForm, marks: parseInt(e.target.value) || 0 })}
                                                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                                                        min="0"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                        Negative Marks
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        value={exerciseForm.negativeMarks}
                                                                        onChange={(e) => setExerciseForm({ ...exerciseForm, negativeMarks: parseFloat(e.target.value) || 0 })}
                                                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
                                                                        min="0"
                                                                        step="0.25"
                                                                    />
                                                                    <p className="text-xs text-gray-500 mt-1">Marks deducted for wrong answer</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                    Explanation
                                                                </label>
                                                                <div className="quill-editor">
                                                                    <ReactQuill
                                                                        theme="snow"
                                                                        value={exerciseForm.explanation}
                                                                        onChange={(value) => setExerciseForm({ ...exerciseForm, explanation: value })}
                                                                        modules={quillModules}
                                                                        formats={quillFormats}
                                                                        placeholder="Explain the correct answer with formatting..."
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3 mt-4">
                                                            <button
                                                                type="submit"
                                                                disabled={loading}
                                                                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded hover:opacity-90 transition disabled:opacity-50"
                                                            >
                                                                {loading ? 'Saving...' : editingExercise ? 'Update Question' : 'Add Question'}
                                                            </button>
                                                            {editingExercise && (
                                                                <button
                                                                    type="button"
                                                                    onClick={resetExerciseForm}
                                                                    className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedExerciseSet(null);
                                                                    setShowAddQuestionForm(prev => ({ ...prev, [exerciseSet._id]: false }));
                                                                    resetExerciseForm();
                                                                }}
                                                                className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                                                            >
                                                                Close
                                                            </button>
                                                        </div>
                                                    </form>
                                                    )}

                                                    {/* Questions List - always visible when set is expanded */}
                                                    <div className="space-y-3">
                                                        {exerciseSet.questions?.length > 0 ? (
                                                            exerciseSet.questions.map((question, qIndex) => (
                                                                <div key={question._id} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">Q{qIndex + 1}</span>
                                                                                <span className={`text-xs px-2 py-1 rounded ${
                                                                                    question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                                                    question.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                                                                                    'bg-yellow-500/20 text-yellow-400'
                                                                                }`}>{question.difficulty}</span>
                                                                                <span className="text-xs text-green-600 bg-green-500/20 px-2 py-1 rounded">+{question.marks} marks</span>
                                                                                {question.negativeMarks > 0 && (
                                                                                    <span className="text-xs text-red-600 bg-red-500/20 px-2 py-1 rounded">-{question.negativeMarks} marks</span>
                                                                                )}
                                                                            </div>
                                                                            <div 
                                                                                className="text-white text-sm font-medium"
                                                                                dangerouslySetInnerHTML={{ __html: question.question }}
                                                                            />
                                                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                                                {question.options.map((option, i) => (
                                                                                    <div key={i} className={`text-xs p-2 rounded ${
                                                                                        i === question.correctAnswer 
                                                                                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                                                                            : 'bg-gray-800/50 text-gray-400'
                                                                                    }`}>
                                                                                        <span className="mr-1">{i + 1}.</span>
                                                                                        <span dangerouslySetInnerHTML={{ __html: option }} />
                                                                                        {i === question.correctAnswer && <i className="fas fa-check ml-2"></i>}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                            {question.explanation && (
                                                                                <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded">
                                                                                    <div className="text-xs text-blue-300">
                                                                                        <i className="fas fa-lightbulb mr-2"></i>
                                                                                        <span dangerouslySetInnerHTML={{ __html: question.explanation }} />
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex gap-2 ml-4">
                                                                            <button
                                                                                onClick={() => {
                                                                                    editExercise(question);
                                                                                    setSelectedExerciseSet(exerciseSet);
                                                                                    setShowAddQuestionForm(prev => ({ ...prev, [exerciseSet._id]: true }));
                                                                                }}
                                                                                className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition"
                                                                                title="Edit question"
                                                                            >
                                                                                <i className="fas fa-edit"></i>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => deleteExercise(question._id)}
                                                                                className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition"
                                                                                title="Delete question"
                                                                            >
                                                                                <i className="fas fa-trash"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-center py-4 bg-gray-800/30 rounded-lg border border-gray-700/50 text-gray-400">
                                                                <p className="text-sm">No questions added yet</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-gray-800/30 rounded-xl border border-gray-700/50 text-gray-400">
                                        <i className="fas fa-tasks text-3xl mb-2 opacity-50"></i>
                                        <p>No exercise sets added yet. Create one to get started!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

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
                    color: white;
                }
                
                .quill-editor .ql-editor.ql-blank::before,
                .quill-option .ql-editor.ql-blank::before {
                    color: #9ca3af;
                    font-style: normal;
                }
                
                .quill-editor .ql-stroke,
                .quill-option .ql-stroke {
                    stroke: #9ca3af !important;
                }
                
                .quill-editor .ql-fill,
                .quill-option .ql-fill {
                    fill: #9ca3af !important;
                }
                
                .quill-editor .ql-picker-label,
                .quill-option .ql-picker-label {
                    color: #9ca3af !important;
                }
                
                .quill-editor .ql-picker-options,
                .quill-option .ql-picker-options {
                    background: #1f2937;
                    border-color: #374151;
                }
                
                .quill-editor .ql-picker-item,
                .quill-option .ql-picker-item {
                    color: #9ca3af;
                }
                
                .quill-editor .ql-picker-item:hover,
                .quill-option .ql-picker-item:hover {
                    color: #06b6d4;
                }
                
                .quill-editor .ql-toolbar button:hover,
                .quill-editor .ql-toolbar button.ql-active,
                .quill-option .ql-toolbar button:hover,
                .quill-option .ql-toolbar button.ql-active {
                    color: #06b6d4 !important;
                }
                
                .quill-editor .ql-toolbar button:hover .ql-stroke,
                .quill-editor .ql-toolbar button.ql-active .ql-stroke,
                .quill-option .ql-toolbar button:hover .ql-stroke,
                .quill-option .ql-toolbar button.ql-active .ql-stroke {
                    stroke: #06b6d4 !important;
                }
                
                .quill-editor .ql-toolbar button:hover .ql-fill,
                .quill-editor .ql-toolbar button.ql-active .ql-fill,
                .quill-option .ql-toolbar button:hover .ql-fill,
                .quill-option .ql-toolbar button.ql-active .ql-fill {
                    fill: #06b6d4 !important;
                }
                
                .quill-editor .ql-snow .ql-tooltip,
                .quill-option .ql-snow .ql-tooltip {
                    background: #1f2937;
                    border-color: #374151;
                    color: white;
                }
                
                .quill-editor .ql-snow .ql-tooltip input[type=text],
                .quill-option .ql-snow .ql-tooltip input[type=text] {
                    background: #374151;
                    color: white;
                    border-color: #4b5563;
                }
                
                .quill-editor sup,
                .quill-option sup {
                    vertical-align: super;
                    font-size: smaller;
                }
                
                .quill-editor sub,
                .quill-option sub {
                    vertical-align: sub;
                    font-size: smaller;
                }
            `}</style>
        </div>
    );
};

export default TopicContentManager;
