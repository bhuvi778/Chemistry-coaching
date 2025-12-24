import { useState, useEffect } from 'react';

const ManageFeedback = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'like', 'dislike'

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/feedback`);
            const data = await res.json();
            // Ensure data is always an array
            setFeedbackList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setFeedbackList([]);
        } finally {
            setLoading(false);
        }
    };

    const safeFeedbackList = Array.isArray(feedbackList) ? feedbackList : [];

    const filteredFeedback = safeFeedbackList.filter(item => {
        if (filter === 'all') return true;
        return item.reactionType === filter;
    });

    const stats = {
        total: safeFeedbackList.length,
        likes: safeFeedbackList.filter(f => f.reactionType === 'like').length,
        dislikes: safeFeedbackList.filter(f => f.reactionType === 'dislike').length
    };

    if (loading) {
        return (
            <div className="glass-panel rounded-xl p-8 text-center">
                <i className="fas fa-spinner fa-spin text-4xl text-cyan-400 mb-4"></i>
                <p className="text-gray-400">Loading feedback...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass-panel rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                    <i className="fas fa-comments mr-3 text-cyan-400"></i>
                    User Feedback
                </h2>
                <p className="text-gray-400">
                    View all feedback submitted by users on doubts and answers
                </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Feedback</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <i className="fas fa-comment text-blue-400 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Positive (Likes)</p>
                            <p className="text-3xl font-bold text-green-400 mt-1">{stats.likes}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                            <i className="fas fa-thumbs-up text-green-400 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Negative (Dislikes)</p>
                            <p className="text-3xl font-bold text-red-400 mt-1">{stats.dislikes}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                            <i className="fas fa-thumbs-down text-red-400 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="glass-panel rounded-xl p-4">
                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'all'
                                ? 'bg-cyan-500 text-black'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        <i className="fas fa-list mr-2"></i>
                        All ({stats.total})
                    </button>
                    <button
                        onClick={() => setFilter('like')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'like'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        <i className="fas fa-thumbs-up mr-2"></i>
                        Likes ({stats.likes})
                    </button>
                    <button
                        onClick={() => setFilter('dislike')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'dislike'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        <i className="fas fa-thumbs-down mr-2"></i>
                        Dislikes ({stats.dislikes})
                    </button>
                </div>
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
                {filteredFeedback.length > 0 ? (
                    filteredFeedback.map((item) => (
                        <div key={item._id} className="glass-panel rounded-xl p-6 hover:shadow-xl transition">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.reactionType === 'like'
                                            ? 'bg-green-500/20'
                                            : 'bg-red-500/20'
                                        }`}>
                                        <i className={`fas fa-thumbs-${item.reactionType === 'like' ? 'up' : 'down'} ${item.reactionType === 'like' ? 'text-green-400' : 'text-red-400'
                                            }`}></i>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">{item.name}</h3>
                                        <p className="text-gray-400 text-sm">{item.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.reactionType === 'like'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {item.reactionType === 'like' ? 'Helpful' : 'Not Helpful'}
                                    </span>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {new Date(item.submittedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Related Doubt */}
                            {item.doubtId && (
                                <div className="bg-gray-800/50 rounded-lg p-4 mb-3">
                                    <p className="text-gray-400 text-xs mb-2">
                                        <i className="fas fa-question-circle mr-1"></i>
                                        Related Question:
                                    </p>
                                    <p className="text-white font-medium">{item.doubtId.question}</p>
                                </div>
                            )}

                            {/* Feedback Message */}
                            {item.feedback && (
                                <div className="bg-gray-800/30 rounded-lg p-4 border-l-4 border-cyan-500">
                                    <p className="text-gray-400 text-xs mb-2">
                                        <i className="fas fa-comment mr-1"></i>
                                        Feedback:
                                    </p>
                                    <p className="text-gray-300">{item.feedback}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="glass-panel rounded-xl p-12 text-center">
                        <i className="fas fa-inbox text-6xl text-gray-700 mb-4"></i>
                        <p className="text-gray-400">
                            {filter === 'all'
                                ? 'No feedback received yet'
                                : `No ${filter === 'like' ? 'positive' : 'negative'} feedback found`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageFeedback;
