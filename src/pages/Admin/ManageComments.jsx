import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ManageComments = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved
    const [stats, setStats] = useState({
        totalComments: 0,
        pendingComments: 0,
        approvedComments: 0
    });

    useEffect(() => {
        fetchComments();
        fetchStats();
    }, [filter]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/comments/admin/all`, {
                params: { status: filter }
            });
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/comments/admin/stats`);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.patch(`${API_URL}/comments/admin/${id}/approve`);
            fetchComments();
            fetchStats();
            alert('Comment approved successfully!');
        } catch (error) {
            console.error('Error approving comment:', error);
            alert('Error approving comment');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await axios.delete(`${API_URL}/comments/admin/${id}`);
            fetchComments();
            fetchStats();
            alert('Comment deleted successfully!');
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Error deleting comment');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total Comments</p>
                            <p className="text-3xl font-bold text-white">{stats.totalComments}</p>
                        </div>
                        <i className="fas fa-comments text-purple-400 text-3xl"></i>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Pending Approval</p>
                            <p className="text-3xl font-bold text-white">{stats.pendingComments}</p>
                        </div>
                        <i className="fas fa-clock text-yellow-400 text-3xl"></i>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Approved</p>
                            <p className="text-3xl font-bold text-white">{stats.approvedComments}</p>
                        </div>
                        <i className="fas fa-check-circle text-green-400 text-3xl"></i>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {['all', 'pending', 'approved'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition capitalize ${filter === status
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Comments List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700">
                    <i className="fas fa-comment-slash text-6xl text-gray-600 mb-4"></i>
                    <p className="text-gray-400 text-xl">No comments found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* User Info */}
                                <div className="md:w-64 flex-shrink-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white">
                                            {comment.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{comment.userName}</h3>
                                            <p className="text-sm text-gray-400">{comment.userEmail}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2">
                                        <i className="far fa-calendar-alt mr-1"></i>
                                        {formatDate(comment.createdAt)}
                                    </div>
                                    <div className="mt-2 text-xs">
                                        {comment.isApproved ? (
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Comment Content */}
                                <div className="flex-1">
                                    <div className="mb-2">
                                        <span className="text-sm text-gray-400">Comment on: </span>
                                        <span className="text-cyan-400 font-medium">
                                            {comment.blogId?.title || 'Unknown Blog'}
                                        </span>
                                    </div>
                                    <div className="bg-gray-900/50 rounded-lg p-4 text-gray-300 border border-gray-700/50">
                                        {comment.comment}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col gap-2 justify-center">
                                    {!comment.isApproved && (
                                        <button
                                            onClick={() => handleApprove(comment._id)}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition flex items-center justify-center gap-2"
                                            title="Approve"
                                        >
                                            <i className="fas fa-check"></i>
                                            <span className="md:hidden">Approve</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(comment._id)}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center justify-center gap-2"
                                        title="Delete"
                                    >
                                        <i className="fas fa-trash"></i>
                                        <span className="md:hidden">Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageComments;
