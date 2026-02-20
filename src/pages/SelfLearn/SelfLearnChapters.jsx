import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SubjectTabs from '../../components/SubjectTabs';

const SelfLearnChapters = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedClass, setSelectedClass] = useState(''); // '' for all, '11' or '12'

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    useEffect(() => {
        fetchChapters();
    }, [examId, selectedSubject, selectedClass]);

    const fetchChapters = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Decode URL params
            const decodedExam = decodeURIComponent(examId);

            const response = await axios.get(`${API_URL}/self-learn/chapters`, {
                params: {
                    examType: decodedExam,
                    subject: selectedSubject || undefined,
                    _t: Date.now() // Cache-busting parameter
                }
            });

            setChapters(response.data);
        } catch (err) {
            console.error('Error fetching chapters:', err);
            setError('Failed to load chapters. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Filter chapters based on search query and class
    const filteredChapters = chapters.filter(chapter => {
        const matchesSearch = chapter.chapterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chapter.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = !selectedClass || chapter.class === selectedClass;
        return matchesSearch && matchesClass;
    });

    const examDisplayName = decodeURIComponent(examId).toUpperCase();

    const handleChapterClick = (chapterId) => {
        navigate(`/self-learn/${examId}/${chapterId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center relative z-10">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400">Loading chapters...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-32 pb-20 relative z-10">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/10 text-center">
                        <i className="fas fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
                        <p className="text-red-400 text-lg mb-4">{error}</p>
                        <button
                            onClick={fetchChapters}
                            className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition border border-red-500/50"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent uppercase">
                        {examDisplayName} Self Learn
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                        Master concepts chapter by chapter. Learn smart, ace your exams.
                    </p>

                    {/* Statistics Badges */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="px-5 py-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center gap-2">
                            <i className="fas fa-book text-purple-400"></i>
                            <span className="text-white font-semibold">
                                {chapters.length} Chapters
                            </span>
                        </div>
                        <div className="px-5 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center gap-2">
                            <i className="fas fa-video text-blue-400"></i>
                            <span className="text-white font-semibold">
                                {chapters.reduce((sum, ch) => sum + (ch.learn?.videoLectures?.length || 0), 0)} Videos
                            </span>
                        </div>
                        <div className="px-5 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                            <i className="fas fa-file-pdf text-amber-400"></i>
                            <span className="text-white font-semibold">
                                {chapters.reduce((sum, ch) => sum + (ch.learn?.classNotes?.length || 0), 0)} Notes
                            </span>
                        </div>
                        <div className="px-5 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
                            <i className="fas fa-dumbbell text-green-400"></i>
                            <span className="text-white font-semibold">
                                {chapters.reduce((sum, ch) => sum + (ch.practice?.dpps?.length || 0), 0)} Practice
                            </span>
                        </div>
                    </div>
                </div>

                {/* Chapters Grid Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Select a Chapter</h2>

                    {/* Subject Filter Tabs */}
                    <div className="mb-6">
                        <SubjectTabs
                            selectedSubject={selectedSubject}
                            onSubjectChange={setSelectedSubject}
                            showAll={true}
                        />
                    </div>

                    {/* Class Filter */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <span className="text-gray-400 text-sm font-medium">Filter by Class:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedClass('')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    selectedClass === ''
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                                }`}
                            >
                                All Classes
                            </button>
                            <button
                                onClick={() => setSelectedClass('11')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    selectedClass === '11'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                                }`}
                            >
                                Class 11
                            </button>
                            <button
                                onClick={() => setSelectedClass('12')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    selectedClass === '12'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                                }`}
                            >
                                Class 12
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mb-12">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <input
                                type="text"
                                placeholder="Search chapters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="relative w-full px-6 py-4 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition shadow-lg"
                            />
                            <i className="fas fa-search absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>

                    {filteredChapters.length === 0 ? (
                        <div className="glass-panel rounded-xl p-12 text-center border border-gray-700/50">
                            <i className="fas fa-layer-group text-6xl text-gray-700 mb-4 block"></i>
                            <p className="text-gray-400 text-lg">
                                {searchQuery
                                    ? `No chapters found matching "${searchQuery}"`
                                    : `No chapters available.`
                                }
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-4 px-6 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition border border-cyan-500/30"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredChapters.map((chapter, index) => {
                                // Determine color based on subject
                                const subjectLower = (chapter.subject || '').toLowerCase();
                                let iconColor = '#06b6d4'; // default cyan
                                if (subjectLower.includes('physical')) iconColor = '#a855f7'; // purple
                                else if (subjectLower.includes('organic')) iconColor = '#f59e0b'; // amber
                                else if (subjectLower.includes('inorganic')) iconColor = '#10b981'; // green

                                return (
                                    <div
                                        key={chapter._id}
                                        onClick={() => handleChapterClick(chapter._id)}
                                        className="glass-panel rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 group relative overflow-hidden border border-gray-700/50 hover:border-cyan-500/30"
                                    >
                                        {/* Background Gradient Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        <div className="relative z-10">
                                            {/* Icon and Badge */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div
                                                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-black/20"
                                                    style={{ backgroundColor: `${iconColor}20`, color: iconColor }}
                                                >
                                                    <i className={chapter.icon || 'fas fa-book'}></i>
                                                </div>
                                                <span className="text-xs font-mono text-gray-500 bg-gray-900/50 px-2 py-1 rounded">
                                                    CH-{String(index + 1).padStart(2, '0')}
                                                </span>
                                            </div>

                                            {/* Subject Tag */}
                                            <div className="mb-3 flex items-center gap-2 flex-wrap">
                                                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold"
                                                    style={{
                                                        backgroundColor: `${iconColor}15`,
                                                        color: iconColor
                                                    }}>
                                                    {chapter.subject || 'Chemistry'}
                                                </span>
                                                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                                    Class {chapter.class || '11'}
                                                </span>
                                            </div>

                                            {/* Chapter Name */}
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                                                {chapter.chapterName}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                                {chapter.description || 'Explore this chapter to master key concepts.'}
                                            </p>

                                            {/* Stats Row */}
                                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                                <span>
                                                    <i className="fas fa-play-circle mr-1.5 opacity-70"></i>
                                                    {chapter.learn?.videoLectures?.length || 0} Videos
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                <span>
                                                    <i className="fas fa-file-pdf mr-1.5 opacity-70"></i>
                                                    {chapter.learn?.classNotes?.length || 0} Notes
                                                </span>
                                            </div>

                                            {/* Progress Bar (if progress exists) */}
                                            {(chapter.progress || 0) > 0 && (
                                                <div className="mt-2">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className="text-xs text-gray-400">Progress</span>
                                                        <span className="text-xs font-bold text-cyan-400">{chapter.progress}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                                                            style={{ width: `${chapter.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="glass-panel rounded-xl p-8 mt-12 border border-gray-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                <i className="fas fa-brain text-3xl text-cyan-400"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Concept Mastery</h3>
                            <p className="text-gray-400 text-sm">
                                Deep dive into chapter-wise content to strengthen your core concepts
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <i className="fas fa-video text-3xl text-purple-400"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Video Lectures</h3>
                            <p className="text-gray-400 text-sm">
                                Watch engaging video content to learn concepts effectively
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                <i className="fas fa-chart-line text-3xl text-green-400"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Track Growth</h3>
                            <p className="text-gray-400 text-sm">
                                Monitor your progress and completion rates as you learn
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back Link */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/self-learn')}
                        className="text-gray-500 hover:text-cyan-400 transition flex items-center gap-2 mx-auto text-sm font-medium"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Back to Exam Selection</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelfLearnChapters;
