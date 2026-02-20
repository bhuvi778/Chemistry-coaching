import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const PYQTopicList = () => {
    const { examName, chapterId } = useParams();
    const navigate = useNavigate();
    const [chapter, setChapter] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stats state
    const [stats, setStats] = useState({
        remaining: 0,
        learning: 0,
        mastery: 0,
        accuracy: 0
    });

    useEffect(() => {
        loadChapterAndTopics();
    }, [chapterId]);

    const loadChapterAndTopics = async () => {
        try {
            setLoading(true);
            setError(null);

            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const userId = localStorage.getItem('userId');

            // Load chapter details
            const chapterResponse = await axios.get(`${API_BASE_URL}/pyq/chapters/${chapterId}`);
            setChapter(chapterResponse.data);

            // Load topics for this chapter with user progress
            const topicsResponse = await axios.get(`${API_BASE_URL}/pyq/topics/chapter/${chapterId}`, {
                params: { userId }
            });

            const topicsData = topicsResponse.data;
            setTopics(topicsData);

            // Calculate Aggregated Stats from topics
            let totalQuestions = 0;
            let totalAttempted = 0;
            let totalUnattempted = 0;
            let learningCount = 0;
            let completedCount = 0; // "Mastered" in terms of progress=100

            topicsData.forEach(topic => {
                const qCount = topic.questionCount || 0;
                const attempted = topic.attemptedCount || 0;
                const progress = topic.progress || 0;

                totalQuestions += qCount;
                totalAttempted += attempted;
                totalUnattempted += (topic.unattemptedCount !== undefined ? topic.unattemptedCount : (qCount - attempted));

                if (progress > 0 && progress < 100) {
                    learningCount++;
                }
                if (progress === 100) {
                    completedCount++;
                }
            });

            // Calculate Mastery/Completion %
            const mastery = totalQuestions > 0 ? Math.round((totalAttempted / totalQuestions) * 100) : 0;

            // For Accuracy, we might not have it in topic list, defaulting to 0 as placeholder
            const accuracy = 0;

            setStats({
                remaining: totalUnattempted,
                learning: learningCount,
                mastery: mastery,
                accuracy: accuracy
            });

        } catch (err) {
            console.error('Error loading data:', err);
            setError('Failed to load topics. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (topics.length === 0) {
            return (
                <div className="glass-panel rounded-xl p-8 text-center">
                    <i className="fas fa-folder-open text-gray-600 text-6xl mb-4"></i>
                    <p className="text-gray-400 text-lg">
                        No topics available for this chapter yet.
                    </p>
                </div>
            );
        }

        return (
            <div className="glass-panel rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {topics.map((topic, index) => (
                        <Link
                            key={topic._id}
                            to={`/pyq/${examName}/chapters/${chapterId}/${topic._id}`}
                            className="p-4 rounded-lg transition-all border-2 bg-gray-800/30 border-gray-700/50 hover:border-cyan-500/50 group relative overflow-hidden flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold bg-cyan-500/20 text-cyan-400">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors line-clamp-2">
                                        {topic.topicName}
                                    </h3>
                                </div>

                                {/* Status Badges */}
                                <div className="flex flex-col gap-1 items-end flex-shrink-0">
                                    {topic.unattemptedCount > 0 && (
                                        <span className="px-2 py-1 rounded text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30 whitespace-nowrap">
                                            {topic.unattemptedCount} Unattempted
                                        </span>
                                    )}
                                    {topic.attemptedCount > 0 && (
                                        <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 whitespace-nowrap">
                                            {topic.attemptedCount} Attempted
                                        </span>
                                    )}
                                    {topic.unattemptedCount === 0 && topic.questionCount > 0 && (
                                        <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 whitespace-nowrap">
                                            Attempted All
                                        </span>
                                    )}
                                </div>
                            </div>

                            {topic.description && (
                                <p className="text-gray-400 text-sm mb-4 pl-11 line-clamp-2">{topic.description}</p>
                            )}

                            {/* Topic Progress Bar */}
                            <div className="pl-11 mb-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-400">
                                        {topic.progress === 100 ? 'Completed' : topic.progress > 0 ? 'In Progress' : 'Not Started'}
                                    </span>
                                    <span className="text-xs font-semibold text-cyan-400">{topic.progress || 0}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${topic.progress === 100 ? 'bg-green-500' :
                                            topic.progress > 0 ? 'bg-blue-500' : 'bg-cyan-500'
                                            }`}
                                        style={{ width: `${topic.progress || 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="pl-11 flex items-center gap-3 border-t border-gray-700 pt-3 mt-auto">
                                <span className="text-gray-400 text-xs flex items-center gap-1">
                                    <i className="fas fa-question-circle"></i> {topic.questionCount || 0} Questions
                                </span>
                                {topic.progress === 100 && (
                                    <span className="text-green-400 text-xs flex items-center gap-1">
                                        <i className="fas fa-check-circle"></i> Done
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    };

    const examDisplayName = examName?.replace(/-/g, ' ').toUpperCase() || '';

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center relative z-10">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400">Loading topics...</p>
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
                            onClick={loadChapterAndTopics}
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
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/pyq/${examName}/chapters`)}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-6"
                >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Chapters</span>
                </button>

                {/* Chapter Header */}
                <div className="glass-panel rounded-xl p-8 mb-8 border border-gray-700">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {chapter?.chapterName}
                            </h1>
                            <p className="text-gray-400 mb-4">
                                {chapter?.description || examDisplayName}
                            </p>
                        </div>
                        {/* Overall Chapter Progress */}
                        <div className="ml-6 bg-gray-800/50 rounded-lg p-4 min-w-[200px]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Overall Progress</span>
                                <span className="text-lg font-bold text-green-400">
                                    {stats.mastery}%
                                </span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                                    style={{ width: `${stats.mastery}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-white mb-1">{stats.remaining}</div>
                            <div className="text-sm text-gray-400">Unattempted</div>
                        </div>
                        <div className="bg-amber-500/10 rounded-lg p-4 text-center border border-amber-500/30">
                            <div className="text-3xl font-bold text-amber-400 mb-1">{stats.learning}</div>
                            <div className="text-sm text-amber-400">Learning Topics</div>
                        </div>
                        <div className="bg-blue-500/10 rounded-lg p-4 text-center border border-blue-500/30">
                            <div className="text-3xl font-bold text-blue-400 mb-1">{stats.accuracy}%</div>
                            <div className="text-sm text-blue-400">Accuracy</div>
                        </div>
                        <div className="bg-green-500/10 rounded-lg p-4 text-center border border-green-500/30">
                            <div className="text-3xl font-bold text-green-400 mb-1">{stats.mastery}%</div>
                            <div className="text-sm text-green-400">Chapter Completion</div>
                        </div>
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

export default PYQTopicList;
