import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchChapters } from '../services/ntaAbhyasApi';

const NTAAbhyasChapters = () => {
    const { examCategory } = useParams();
    const navigate = useNavigate();
    const [chapters, setChapters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadChapters();
    }, [examCategory]);

    const loadChapters = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchChapters(examCategory);
            setChapters(data);
        } catch (err) {
            console.error('Error loading chapters:', err);
            setError('Failed to load chapters. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getExamInfo = () => {
        if (examCategory === 'JEE') {
            return {
                name: 'JEE',
                fullName: 'Joint Entrance Examination',
                icon: 'fa-atom',
                color: 'from-blue-500 to-cyan-500',
                textColor: 'text-blue-400',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/30'
            };
        } else {
            return {
                name: 'NEET',
                fullName: 'National Eligibility cum Entrance Test',
                icon: 'fa-microscope',
                color: 'from-green-500 to-emerald-500',
                textColor: 'text-green-400',
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/30'
            };
        }
    };

    const examInfo = getExamInfo();

    // Filter chapters based on search query
    const filteredChapters = chapters.filter(chapter =>
        chapter.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.chapterNumber?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        <div className="min-h-screen pt-32 pb-20 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/ncert-toolbox/nta-abhyas')}
                        className="text-gray-400 hover:text-cyan-400 transition mb-4 flex items-center gap-2"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Back to Exam Selection</span>
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${examInfo.color} flex items-center justify-center`}>
                            <i className={`fas ${examInfo.icon} text-white text-2xl`}></i>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">{examInfo.name} Chapters</h1>
                            <p className="text-gray-400">{examInfo.fullName}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-lg ${examInfo.bgColor} border ${examInfo.borderColor}`}>
                            <span className={`font-medium ${examInfo.textColor}`}>
                                <i className="fas fa-book mr-2"></i>
                                {filteredChapters.length} Chapter{filteredChapters.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className={`px-4 py-2 rounded-lg ${examInfo.bgColor} border ${examInfo.borderColor}`}>
                            <span className={`font-medium ${examInfo.textColor}`}>
                                <i className="fas fa-question-circle mr-2"></i>
                                {chapters.reduce((sum, ch) => sum + ch.questionCount, 0)} Questions
                            </span>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search chapters..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition"
                        />
                        <i className="fas fa-search absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>

                {/* Chapters Grid */}
                {filteredChapters.length === 0 ? (
                    <div className="glass-panel rounded-xl p-12 border border-gray-700 text-center">
                        <i className="fas fa-search text-gray-600 text-6xl mb-4"></i>
                        <p className="text-gray-400 text-lg">
                            {searchQuery
                                ? `No chapters found matching "${searchQuery}"`
                                : `No chapters available yet for ${examInfo.name}.`
                            }
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 px-6 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition border border-cyan-500/50"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredChapters.map((chapter, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(`/ncert-toolbox/nta-abhyas/${examCategory}/${encodeURIComponent(chapter.name)}`)}
                                className="glass-panel rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                            >
                                {/* Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Class Level Badge */}
                                {chapter.classLevel && (
                                    <div className="absolute top-4 right-4 z-20">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${chapter.classLevel === '11'
                                            ? 'from-purple-500 to-pink-500'
                                            : 'from-blue-500 to-cyan-500'
                                            } text-white shadow-lg`}>
                                            Class {chapter.classLevel}
                                        </span>
                                    </div>
                                )}

                                <div className="relative z-10">
                                    {/* Chapter Number */}
                                    {chapter.chapterNumber && (
                                        <div className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">
                                            Chapter {chapter.chapterNumber}
                                        </div>
                                    )}

                                    {/* Chapter Name */}
                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition">
                                        {chapter.name}
                                    </h3>

                                    {/* Question Count */}
                                    <div className="flex items-center justify-between">
                                        <div className={`px-3 py-1 rounded-lg ${examInfo.bgColor} border ${examInfo.borderColor}`}>
                                            <span className={`text-sm font-medium ${examInfo.textColor}`}>
                                                <i className="fas fa-question-circle mr-2"></i>
                                                {chapter.questionCount} Questions
                                            </span>
                                        </div>
                                        <i className="fas fa-arrow-right text-cyan-400 group-hover:translate-x-2 transition-transform"></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NTAAbhyasChapters;
