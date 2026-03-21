import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SubjectTabs from '../components/SubjectTabs';
import SubjectTag from '../components/SubjectTag';

const PYQChapterList = () => {
    const { examName } = useParams();
    const navigate = useNavigate();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');


    useEffect(() => {
        loadChapters();
    }, [examName, selectedSubject]);

    const loadChapters = async () => {
        try {
            setLoading(true);
            setError(null);

            // Convert URL params to API format
            // Handle acronyms: jee-main -> JEE Main, neet -> NEET, etc.
            const acronyms = ['jee', 'neet', 'bitsat', 'nest', 'iat'];
            const examNameFormatted = examName.split('-').map(word => {
                const lowerWord = word.toLowerCase();
                if (acronyms.includes(lowerWord)) {
                    return word.toUpperCase();
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(' ');

            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const apiUrl = `${API_BASE_URL}/pyq/chapters`;
            const userId = localStorage.getItem('userId');

            console.log('🔍 PYQ Loading chapters for:', examNameFormatted);
            console.log('📍 API URL:', apiUrl);
            console.log('👤 User ID:', userId);

            const response = await axios.get(apiUrl, {
                params: {
                    examName: examNameFormatted,
                    userId: userId, // Pass userId to get progress data
                    subject: selectedSubject || undefined // Pass subject filter if selected
                }
            });

            console.log('✅ Chapters received:', response.data.length);
            console.log('📋 Data:', response.data);

            setChapters(response.data);
        } catch (err) {
            console.error('Error loading chapters:', err);
            setError('Failed to load chapters. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filter chapters based on search query only
    const filteredChapters = chapters.filter(chapter => {
        return chapter.chapterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chapter.chapterNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chapter.description?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const examDisplayName = examName?.replace(/-/g, ' ').toUpperCase() || '';

    // Debug logging
    console.log('🎯 PYQ Chapter List State:');
    console.log('  - Total chapters:', chapters.length);
    console.log('  - Filtered chapters:', filteredChapters.length);
    console.log('  - Loading:', loading);
    console.log('  - Error:', error);
    console.log('  - Search query:', searchQuery);

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
                            onClick={loadChapters}
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
                        {examDisplayName} PYQs
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                        Master previous year questions chapter by chapter. Practice smart, score high.
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
                            <i className="fas fa-question-circle text-blue-400"></i>
                            <span className="text-white font-semibold">
                                {chapters.reduce((sum, ch) => sum + (ch.questionCount || 0), 0)} Questions
                            </span>
                        </div>
                        <div className="px-5 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                            <i className="fas fa-clock text-amber-400"></i>
                            <span className="text-white font-semibold">
                                {chapters.reduce((sum, ch) => sum + (ch.unattemptedCount || 0), 0)} Unattempted
                            </span>
                        </div>
                        <div className="px-5 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-400"></i>
                            <span className="text-white font-semibold">
                                {chapters.reduce((sum, ch) => sum + (ch.attemptedCount || 0), 0)} Attempted
                            </span>
                        </div>
                    </div>
                </div>

                {/* Chapters Grid Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Select a Chapter</h2>

                    {/* Subject Filter Tabs */}
                    <div className="mb-8">
                        <SubjectTabs
                            selectedSubject={selectedSubject}
                            onSubjectChange={setSelectedSubject}
                            showAll={true}
                        />
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
                            {filteredChapters.map((chapter) => {
                                // Determine color based on subject or random assignment if missing
                                const subjectLower = chapter.subject?.toLowerCase() || '';
                                let iconColor = '#06b6d4'; // default cyan
                                if (subjectLower.includes('physical')) iconColor = '#a855f7'; // purple
                                else if (subjectLower.includes('organic')) iconColor = '#f59e0b'; // amber
                                else if (subjectLower.includes('inorganic')) iconColor = '#10b981'; // green

                                return (
                                    <div
                                        key={chapter._id}
                                        onClick={() => navigate(`/pyq/${examName}/chapters/${chapter._id}`)}
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
                                                    <i className={`fas ${chapter.icon || 'fa-book'}`}></i>
                                                </div>
                                                {(chapter.unattemptedCount || 0) > 0 && (
                                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                                                        <span className="text-amber-400 font-bold text-sm">{chapter.unattemptedCount}</span>
                                                        <span className="text-amber-400 text-xs">left</span>
                                                        <i className="fas fa-chevron-right text-amber-400 text-xs"></i>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Subject Tag */}
                                            {chapter.subject && (
                                                <div className="mb-3">
                                                    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold"
                                                        style={{
                                                            backgroundColor: `${iconColor}15`,
                                                            color: iconColor
                                                        }}>
                                                        {chapter.subject}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Chapter Number */}
                                            {chapter.chapterNumber && (
                                                <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">
                                                    {chapter.chapterNumber}
                                                </div>
                                            )}

                                            {/* Chapter Name */}
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-1">
                                                {chapter.chapterName}
                                            </h3>

                                            {/* Stats Row */}
                                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                                <span>
                                                    <i className="fas fa-question-circle mr-1.5 opacity-70"></i>
                                                    {chapter.questionCount || 0} Qs
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                <span>
                                                    <i className="fas fa-layer-group mr-1.5 opacity-70"></i>
                                                    {chapter.topicCount || 0} Topics
                                                </span>
                                            </div>

                                            {/* Progress Bar - always visible */}
                                            <div className="mt-2">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-xs text-gray-400">Progress</span>
                                                    <span className={`text-xs font-bold ${(chapter.progress || 0) > 0 ? 'text-cyan-400' : 'text-gray-500'}`}>
                                                        {chapter.progress || 0}%
                                                    </span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                                                        style={{ width: `${chapter.progress || 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
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
                                Deep dive into chapter-wise questions to strengthen your core concepts
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <i className="fas fa-history text-3xl text-purple-400"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Exam Patterns</h3>
                            <p className="text-gray-400 text-sm">
                                Analyze trends and recurring question types from previous years
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                <i className="fas fa-chart-line text-3xl text-green-400"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Track Growth</h3>
                            <p className="text-gray-400 text-sm">
                                Monitor your accuracy and completion rates as you progress
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back Link */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/pyq')}
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

export default PYQChapterList;
