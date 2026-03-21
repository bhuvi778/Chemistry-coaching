import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SelfLearnChapterDetail = () => {
    const { chapterId } = useParams();
    const navigate = useNavigate();
    const [chapter, setChapter] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('learn');

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    useEffect(() => {
        fetchChapterAndTopics();
    }, [chapterId]);

    const fetchChapterAndTopics = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch chapter details
            const chapterResponse = await axios.get(`${API_URL}/self-learn/chapters/${chapterId}?_t=${Date.now()}`);
            setChapter(chapterResponse.data);
            
            // Fetch topics for this chapter
            const topicsResponse = await axios.get(`${API_URL}/self-learn/chapters/${chapterId}/topics?_t=${Date.now()}`);
            setTopics(topicsResponse.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load chapter details.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center relative z-10">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400">Loading chapter details...</p>
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
                            onClick={fetchChapterAndTopics}
                            className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition border border-red-500/50"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!chapter) return null;

    // Dynamic naming for content labels only (not tab names)
    const getCategoryLabel = (category) => {
        const labels = {
            learn: 'Exercise',
            practice: 'DPP',
            revise: 'Mock Test'
        };
        return labels[category] || category;
    };

    const tabs = [
        { id: 'learn', label: 'Learn', icon: 'fas fa-book-reader', color: 'blue' },
        { id: 'practice', label: 'Practice', icon: 'fas fa-dumbbell', color: 'green' },
        { id: 'revise', label: 'Revise', icon: 'fas fa-sync-alt', color: 'purple' }
    ];

    const renderContent = () => {
        // Filter topics by category field
        const filteredTopics = topics.filter(topic => topic.category === activeTab || (!topic.category && activeTab === 'learn'));

        if (topics.length === 0) {
            return (
                <div className="glass-panel rounded-xl p-8 text-center">
                    <i className="fas fa-folder-open text-gray-600 text-6xl mb-4"></i>
                    <p className="text-gray-400 text-lg">No topics available for this chapter yet.</p>
                </div>
            );
        }

        if (filteredTopics.length === 0) {
            const tabInfo = {
                learn: { icon: 'fas fa-book-reader', text: 'Learn', desc: 'No topics assigned to Learn category yet. Add topics from admin panel.' },
                practice: { icon: 'fas fa-dumbbell', text: 'Practice', desc: 'No topics assigned to Practice category yet. Add topics from admin panel.' },
                revise: { icon: 'fas fa-sync-alt', text: 'Revise', desc: 'No topics assigned to Revise category yet. Add topics from admin panel.' }
            };
            const info = tabInfo[activeTab];
            
            return (
                <div className="glass-panel rounded-xl p-8 text-center">
                    <i className={`${info.icon} text-gray-600 text-6xl mb-4`}></i>
                    <h3 className="text-xl font-bold text-white mb-2">No {info.text} Content</h3>
                    <p className="text-gray-400">{info.desc}</p>
                </div>
            );
        }

        return (
            <div className="glass-panel rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTopics.map((topic,index) => (
                        <Link
                            key={topic._id}
                            to={`/self-learn/topics/${topic._id}`}
                            className="p-4 rounded-lg transition-all border-2 bg-gray-800/30 border-gray-700/50 hover:border-cyan-500/50 group relative overflow-hidden flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold ${
                                        activeTab === 'learn' ? 'bg-blue-500/20' :
                                        activeTab === 'practice' ? 'bg-green-500/20' : 
                                        'bg-purple-500/20'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <h3 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors line-clamp-2">
                                        {topic.topicName}
                                    </h3>
                                </div>
                            </div>

                            {topic.description && (
                                <p className="text-gray-400 text-sm mb-4 pl-11 line-clamp-2">{topic.description}</p>
                            )}

                            {/* Content Stats — show all available counts on every tab */}
                            <div className="pl-11 mb-3 flex flex-wrap gap-2">
                                {topic.videoCount > 0 && (
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                        activeTab === 'revise'
                                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                    }`}>
                                        🎥 {topic.videoCount} Videos
                                    </span>
                                )}
                                {topic.sheetCount > 0 && (
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                        activeTab === 'revise'
                                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                    }`}>
                                        📄 {topic.sheetCount} Sheets
                                    </span>
                                )}
                                {/* Exercise / DPPs / Mock Test tag */}
                                {(() => {
                                    const count = topic.exerciseCount > 0
                                        ? topic.exerciseCount
                                        : (topic.questionCount || 0);
                                    if (activeTab === 'practice') return (
                                        <span className="px-2 py-1 rounded text-xs font-bold border bg-green-500/20 text-green-400 border-green-500/30">
                                            ✅ {count > 0 ? `${count} DPPs` : 'DPPs'}
                                        </span>
                                    );
                                    if (activeTab === 'revise') return (
                                        <span className="px-2 py-1 rounded text-xs font-bold border bg-purple-500/20 text-purple-400 border-purple-500/30">
                                            📝 {count > 0 ? `${count} Mock Test` : 'Mock Test'}
                                        </span>
                                    );
                                    if (count > 0) return (
                                        <span className="px-2 py-1 rounded text-xs font-bold border bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                            ✏️ {count} Exercises
                                        </span>
                                    );
                                    return null;
                                })()}
                            </div>

                            <div className="pl-11 flex items-center gap-3 border-t border-gray-700 pt-3 mt-auto">
                                <span className="text-cyan-400 text-sm flex items-center gap-1">
                                    <i className="fas fa-arrow-right"></i> 
                                    {activeTab === 'learn' ? 'Start Learning' : 
                                     activeTab === 'practice' ? 'Start DPPs' : 'Start Mock Test'}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/self-learn/${encodeURIComponent(chapter.examType)}`)}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-6"
                >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Chapters</span>
                </button>

                {/* Chapter Header */}
                <div className="glass-panel rounded-xl p-8 mb-8 border border-gray-700">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                                    {chapter.subject} • {chapter.examType}
                                </span>
                                <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
                                    Class {chapter.class || '11'}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {chapter.chapterName}
                            </h1>
                            <p className="text-gray-400 mb-4">
                                {chapter.description || 'Explore this chapter to master key concepts'}
                            </p>
                        </div>
                        {/* Overall Progress */}
                        <div className="ml-6 bg-gray-800/50 rounded-lg p-4 min-w-[200px]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Overall Progress</span>
                                <span className="text-lg font-bold text-green-400">
                                    {chapter.progress || 0}%
                                </span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                                    style={{ width: `${chapter.progress || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-cyan-500/10 rounded-lg p-4 text-center border border-cyan-500/30">
                            <div className="text-3xl font-bold text-cyan-400 mb-1">
                                {topics.length}
                            </div>
                            <div className="text-sm text-cyan-400">Topics</div>
                        </div>
                        <div className="bg-blue-500/10 rounded-lg p-4 text-center border border-blue-500/30">
                            <div className="text-3xl font-bold text-blue-400 mb-1">
                                {topics.reduce((sum, t) => sum + (t.videoCount || 0), 0)}
                            </div>
                            <div className="text-sm text-blue-400">Videos</div>
                        </div>
                        <div className="bg-amber-500/10 rounded-lg p-4 text-center border border-amber-500/30">
                            <div className="text-3xl font-bold text-amber-400 mb-1">
                                {topics.reduce((sum, t) => sum + (t.sheetCount || 0), 0)}
                            </div>
                            <div className="text-sm text-amber-400">PDF Sheets</div>
                        </div>
                        <div className="bg-green-500/10 rounded-lg p-4 text-center border border-green-500/30">
                            <div className="text-3xl font-bold text-green-400 mb-1">
                                {topics.reduce((sum, t) => sum + (t.exerciseCount || 0), 0)}
                            </div>
                            <div className="text-sm text-green-400">Exercises</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg`
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                                    }`}
                            >
                                <i className={tab.icon}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="min-h-[400px]">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SelfLearnChapterDetail;
