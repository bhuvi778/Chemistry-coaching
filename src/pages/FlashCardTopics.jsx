import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import FlashCardFAQ from '../components/FlashCardFAQ';

const FlashCardTopics = () => {
    const { chapterId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [chapter, setChapter] = useState(null);
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ new: 0, learning: 0, reviewing: 0, mastered: 0 });

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    // Fetch data on mount and when returning from practice
    useEffect(() => {
        fetchChapterAndTopics();
    }, [chapterId]);

    // Refresh when navigating back from practice or when page becomes visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                console.log('Page visible - refreshing flashcard data');
                fetchChapterAndTopics();
            }
        };

        const handleFocus = () => {
            console.log('Window focused - refreshing flashcard data');
            fetchChapterAndTopics();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [chapterId]);

    // Force refresh when location state indicates return from practice
    useEffect(() => {
        if (location.state?.fromPractice) {
            console.log('Returned from practice - refreshing data');
            fetchChapterAndTopics();
            // Clear the state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state]);

    const fetchChapterAndTopics = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId') || 'guest';
            const timestamp = Date.now(); // Cache buster

            console.log('Fetching flashcard data...', { chapterId, userId, timestamp });

            const [chapterRes, topicsRes, statsRes] = await Promise.all([
                axios.get(`${API_URL}/flashcards/chapters/${chapterId}?_t=${timestamp}`),
                axios.get(`${API_URL}/flashcards/chapters/${chapterId}/topics?userId=${userId}&_t=${timestamp}`),
                axios.get(`${API_URL}/flashcards/chapters/${chapterId}/stats?userId=${userId}&_t=${timestamp}`)
            ]);

            console.log('Flashcard data received:', {
                topics: topicsRes.data.length,
                stats: statsRes.data
            });

            setChapter(chapterRes.data);
            setTopics(topicsRes.data);

            // Use real stats from backend
            setStats({
                new: statsRes.data.new || 0,
                learning: statsRes.data.learning || 0,
                reviewing: statsRes.data.reviewing || 0,
                mastered: statsRes.data.mastered || 0
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleTopic = (topicId) => {
        setSelectedTopics(prev =>
            prev.includes(topicId)
                ? prev.filter(id => id !== topicId)
                : [...prev, topicId]
        );
    };

    const selectAllTopics = () => {
        if (selectedTopics.length === topics.length) {
            setSelectedTopics([]);
        } else {
            setSelectedTopics(topics.map(t => t._id));
        }
    };

    const startPractice = () => {
        if (selectedTopics.length === 0) {
            alert('Please select at least one topic to practice');
            return;
        }
        navigate(`/flash-cards/${chapterId}/practice`, {
            state: { topicIds: selectedTopics }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/flash-cards')}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-6"
                >
                    <i className="fas fa-chevron-left"></i>
                    <span>Back to chapters</span>
                </button>

                {/* Chapter Header */}
                <div className="glass-panel rounded-xl p-8 mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {chapter?.name}
                            </h1>
                            <p className="text-gray-400 mb-4">
                                Select topics to practice or start with all cards
                            </p>
                        </div>
                        {/* Overall Chapter Progress */}
                        <div className="ml-6 bg-gray-800/50 rounded-lg p-4 min-w-[200px]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Overall Progress</span>
                                <span className="text-lg font-bold text-cyan-400">
                                    {Math.round(topics.reduce((sum, t) => sum + (t.progress || 0), 0) / (topics.length || 1))}%
                                </span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                                    style={{
                                        width: `${Math.round(topics.reduce((sum, t) => sum + (t.progress || 0), 0) / (topics.length || 1))}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-white mb-1">{stats.new}</div>
                            <div className="text-sm text-gray-400">New</div>
                        </div>
                        <div className="bg-amber-500/10 rounded-lg p-4 text-center border border-amber-500/30">
                            <div className="text-3xl font-bold text-amber-400 mb-1">{stats.learning}</div>
                            <div className="text-sm text-amber-400">Learning</div>
                        </div>
                        <div className="bg-blue-500/10 rounded-lg p-4 text-center border border-blue-500/30">
                            <div className="text-3xl font-bold text-blue-400 mb-1">{stats.reviewing}</div>
                            <div className="text-sm text-blue-400">Reviewing</div>
                        </div>
                        <div className="bg-green-500/10 rounded-lg p-4 text-center border border-green-500/30">
                            <div className="text-3xl font-bold text-green-400 mb-1">{stats.mastered}</div>
                            <div className="text-sm text-green-400">Mastered</div>
                        </div>
                    </div>
                </div>

                {/* Topics List */}
                <div className="glass-panel rounded-xl p-6 mb-6">
                    {topics.length === 0 ? (
                        <div className="text-center py-12">
                            <i className="fas fa-book text-6xl text-gray-600 mb-4"></i>
                            <p className="text-gray-400 text-lg">No topics available in this chapter yet.</p>
                        </div>
                    ) : (
                        <>
                            {/* Topic Items */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {topics.map((topic) => {
                                    return (
                                        <div
                                            key={topic._id}
                                            onClick={() => toggleTopic(topic._id)}
                                            className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${selectedTopics.includes(topic._id)
                                                ? 'bg-cyan-500/10 border-cyan-500/50'
                                                : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-white font-semibold text-lg flex-1">{topic.name}</h3>
                                                <div className="flex items-center gap-3 text-sm ml-4">
                                                    {topic.dueCount > 0 && (
                                                        <div className="text-amber-400">
                                                            <span className="font-bold">{topic.dueCount}</span>
                                                            <span className="ml-1 text-xs">due</span>
                                                        </div>
                                                    )}
                                                    <div className="text-gray-400">
                                                        <span className="font-bold">{topic.cardCount}</span>
                                                        <span className="ml-1 text-xs">cards</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {topic.description && (
                                                <p className="text-gray-400 text-sm mb-3">{topic.description}</p>
                                            )}
                                            {/* Progress Bar - Only show if there's progress */}
                                            {(topic.progress || 0) > 0 && (
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-gray-400">Progress</span>
                                                        <span className="text-xs font-semibold text-cyan-400">{topic.progress || 0}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                                                            style={{ width: `${topic.progress || 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>


                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-700">
                                {selectedTopics.length > 0 && (
                                    <button
                                        onClick={startPractice}
                                        className="flex-1 min-w-[200px] px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2">
                                        <i className="fas fa-play"></i>
                                        <span>Practice Selected ({selectedTopics.length} {selectedTopics.length === 1 ? 'topic' : 'topics'})</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        // Select only topics with due cards
                                        const dueTopics = topics.filter(t => (t.dueCount || 0) > 0).map(t => t._id);
                                        if (dueTopics.length > 0) {
                                            navigate(`/flash-cards/${chapterId}/practice`, {
                                                state: { topicIds: dueTopics }
                                            });
                                        } else {
                                            alert('No due cards available. All cards are mastered!');
                                        }
                                    }}
                                    className="flex-1 min-w-[200px] px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all flex items-center justify-center gap-2">
                                    <i className="fas fa-clock"></i>
                                    <span>Review Due Cards ({topics.reduce((sum, t) => sum + (t.dueCount || 0), 0)})</span>
                                </button>
                                <button
                                    onClick={() => {
                                        const allTopicIds = topics.map(t => t._id);
                                        if (allTopicIds.length > 0) {
                                            navigate(`/flash-cards/${chapterId}/practice`, {
                                                state: { topicIds: allTopicIds }
                                            });
                                        }
                                    }}
                                    className="flex-1 min-w-[200px] px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2">
                                    <i className="fas fa-shuffle"></i>
                                    <span>Practice All ({topics.reduce((sum, t) => sum + (t.cardCount || 0), 0)} cards)</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* FAQ Section */}
                <FlashCardFAQ />
            </div>
        </div >
    );
};

export default FlashCardTopics;
