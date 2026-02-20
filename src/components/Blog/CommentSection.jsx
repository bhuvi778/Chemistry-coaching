import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CommentSection = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        comment: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        console.log('💬 CommentSection mounted for blogId:', blogId);
        fetchComments();
        window.scrollTo(0, 0);
    }, [blogId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/comments/blog/${blogId}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.userName || !formData.userEmail || !formData.comment) {
            alert('Please fill in all fields');
            return;
        }

        try {
            setSubmitting(true);
            await axios.post(`${API_URL}/comments`, {
                blogId,
                ...formData
            });

            alert('Comment submitted successfully! It will appear after admin approval.');

            // Reset form
            setFormData({
                userName: '',
                userEmail: '',
                comment: ''
            });
        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('Error submitting comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    return (
        <div className="glass-panel rounded-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <i className="fas fa-comments text-purple-500"></i>
                Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            <div className="mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Leave a Comment</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Your Name *"
                            value={formData.userName}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Your Email *"
                            value={formData.userEmail}
                            onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                            className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition"
                            required
                        />
                    </div>
                    <textarea
                        placeholder="Write your comment... *"
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        rows="4"
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition resize-none"
                        required
                    ></textarea>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane mr-2"></i>
                                Post Comment
                            </>
                        )}
                    </button>
                    <p className="mt-2 text-sm text-gray-400">
                        <i className="fas fa-info-circle mr-1"></i>
                        Your comment will be visible after admin approval.
                    </p>
                </form>
            </div>

            {/* Comments List */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8">
                    <i className="fas fa-comment-slash text-6xl text-gray-600 mb-4"></i>
                    <p className="text-gray-400 text-lg">No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="p-5 bg-gray-800/30 border border-gray-700 rounded-lg hover:border-cyan-500/50 transition"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-user text-white text-lg"></i>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-lg font-semibold text-white">{comment.userName}</h4>
                                        <span className="text-sm text-gray-400">
                                            <i className="far fa-clock mr-1"></i>
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">{comment.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentSection;
