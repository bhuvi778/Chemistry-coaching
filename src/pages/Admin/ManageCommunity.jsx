import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Pagination from '../../components/UI/Pagination';

// Quill editor configuration
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
    ]
};

const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
];

const ManageCommunity = () => {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState('all');
    const [answeringPost, setAnsweringPost] = useState(null);
    const [answerText, setAnswerText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${API_URL}/community`);
            const data = await res.json();
            // Ensure data is always an array
            setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching community posts:', error);
            setPosts([]);
        }
    };


    const filteredPosts = filter === 'all'
        ? posts
        : posts.filter(d => d.status === filter);

    const handleAnswerClick = (post) => {
        setAnsweringPost(post);
        setAnswerText(post.answer || '');
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/community/${answeringPost._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answer: answerText,
                    status: 'answered',
                    isPublished: true
                })
            });

            if (res.ok) {
                fetchPosts();
                setAnsweringPost(null);
                setAnswerText('');
                alert('Answer submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Failed to submit answer');
        }
    };

    const handleTogglePublish = async (post) => {
        try {
            await fetch(`${API_URL}/community/${post._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isPublished: !post.isPublished
                })
            });
            fetchPosts();
        } catch (error) {
            console.error('Error toggling publish:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await fetch(`${API_URL}/community/${id}`, {
                    method: 'DELETE'
                });
                fetchPosts();
                alert('Question deleted successfully!');
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete question');
            }
        }
    };

    const handleReject = async (post) => {
        if (window.confirm('Are you sure you want to reject this question?')) {
            try {
                await fetch(`${API_URL}/community/${post._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        status: 'rejected',
                        isPublished: false
                    })
                });
                fetchPosts();
                alert('Question rejected successfully!');
            } catch (error) {
                console.error('Error rejecting post:', error);
                alert('Failed to reject question');
            }
        }
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Manage Community Q&A</h2>
                    <p className="text-gray-400">Answer student questions and publish them</p>
                </div>
                <div className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg font-bold">
                    {posts.length} Total Questions
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition ${filter === 'all'
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    All ({posts.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg transition ${filter === 'pending'
                        ? 'bg-yellow-500 text-black font-bold'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    Pending ({posts.filter(d => d.status === 'pending').length})
                </button>
                <button
                    onClick={() => setFilter('answered')}
                    className={`px-4 py-2 rounded-lg transition ${filter === 'answered'
                        ? 'bg-green-500 text-black font-bold'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    Answered ({posts.filter(d => d.status === 'answered').length})
                </button>
                <button
                    onClick={() => setFilter('rejected')}
                    className={`px-4 py-2 rounded-lg transition ${filter === 'rejected'
                        ? 'bg-red-500 text-white font-bold'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    Rejected ({posts.filter(d => d.status === 'rejected').length})
                </button>
            </div>

            {/* Answer Form Modal */}
            {answeringPost && (
                <div className="glass-panel rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">Answer Question</h3>
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                        <p className="text-white font-semibold mb-2">Question:</p>
                        <p className="text-gray-300">{answeringPost.question}</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Asked by: {answeringPost.studentName} ({answeringPost.studentEmail})
                        </p>
                    </div>
                    <form onSubmit={handleSubmitAnswer}>
                        <div className="mb-4">
                            <label className="block text-white font-semibold mb-2">
                                Your Answer
                            </label>
                            <div className="bg-white rounded-lg overflow-hidden">
                                <ReactQuill
                                    theme="snow"
                                    value={answerText}
                                    onChange={setAnswerText}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Type your answer here... Use the toolbar to format text, add lists, links, etc."
                                    className="quill-editor-black-text"
                                    style={{ height: '300px', marginBottom: '50px' }}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-bold"
                            >
                                <i className="fas fa-check mr-2"></i>
                                Submit Answer & Publish
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setAnsweringPost(null);
                                    setAnswerText('');
                                }}
                                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Community Posts List */}
            <div className="space-y-4">
                {filteredPosts.length > 0 && (
                    <div className="mb-4 text-gray-400">
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPosts.length)} of {filteredPosts.length} questions
                    </div>
                )}

                {filteredPosts.length === 0 ? (
                    <div className="glass-panel rounded-xl p-12 text-center">
                        <i className="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
                        <p className="text-gray-400">
                            {filter === 'all'
                                ? 'No questions yet.'
                                : `No ${filter} questions.`
                            }
                        </p>
                    </div>
                ) : (
                    currentPosts.map((post) => (
                        <div key={post._id} className="glass-panel rounded-xl p-6">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${post.status === 'answered'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {post.status === 'answered' ? 'Answered' : 'Pending'}
                                        </span>
                                        {post.isPublished && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                                                <i className="fas fa-eye mr-1"></i>
                                                Published
                                            </span>
                                        )}
                                        {/* Like/Dislike Stats */}
                                        {(post.likes > 0 || post.dislikes > 0) && (
                                            <div className="flex items-center gap-2 ml-2">
                                                {post.likes > 0 && (
                                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                                                        <i className="fas fa-thumbs-up mr-1"></i>
                                                        {post.likes}
                                                    </span>
                                                )}
                                                {post.dislikes > 0 && (
                                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
                                                        <i className="fas fa-thumbs-down mr-1"></i>
                                                        {post.dislikes}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-2">
                                        {post.question}
                                    </h3>
                                    <div className="text-gray-400 text-sm space-y-1">
                                        <p><i className="fas fa-user mr-2"></i>{post.studentName}</p>
                                        <p><i className="fas fa-envelope mr-2"></i>{post.studentEmail}</p>
                                        <p><i className="fas fa-phone mr-2"></i>{post.studentPhone}</p>
                                        <p><i className="fas fa-clock mr-2"></i>{new Date(post.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Answer Display */}
                            {post.answer && (
                                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                                    <p className="text-green-400 font-semibold mb-2">Answer:</p>
                                    <div
                                        className="text-gray-300 prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: post.answer }}
                                    />
                                </div>
                            )}

                            {/* User Feedback Display */}
                            {post.feedbacks && post.feedbacks.length > 0 && (
                                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 mb-4">
                                    <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                        <i className="fas fa-comments text-cyan-500"></i>
                                        User Feedback ({post.feedbacks.length})
                                    </h4>
                                    <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                                        {post.feedbacks.map((fb, index) => (
                                            <div key={index} className="text-sm border-b border-gray-700/50 pb-2 last:border-0 last:pb-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-400">{fb.name || 'Anonymous'}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${fb.reactionType === 'like'
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : 'bg-red-500/20 text-red-400'
                                                            }`}>
                                                            {fb.reactionType === 'like' ? 'Helpful' : 'Not Helpful'}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(fb.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {fb.feedback && (
                                                    <p className="text-gray-300 italic">"{fb.feedback}"</p>
                                                )}
                                                {fb.email && (
                                                    <p className="text-xs text-gray-500 mt-0.5">{fb.email}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => handleAnswerClick(post)}
                                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition text-sm"
                                >
                                    <i className="fas fa-reply mr-2"></i>
                                    {post.answer ? 'Edit Answer' : 'Answer'}
                                </button>
                                {post.status === 'answered' && (
                                    <button
                                        onClick={() => handleTogglePublish(post)}
                                        className={`px-4 py-2 rounded-lg transition text-sm ${post.isPublished
                                            ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white'
                                            : 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white'
                                            }`}
                                    >
                                        <i className={`fas ${post.isPublished ? 'fa-eye-slash' : 'fa-eye'} mr-2`}></i>
                                        {post.isPublished ? 'Unpublish' : 'Publish'}
                                    </button>
                                )}
                                {post.status !== 'rejected' && (
                                    <button
                                        onClick={() => handleReject(post)}
                                        className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-white transition text-sm"
                                    >
                                        <i className="fas fa-ban mr-2"></i>
                                        Reject
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition text-sm"
                                >
                                    <i className="fas fa-trash mr-2"></i>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCommunity;
