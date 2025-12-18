import React, { useState, useEffect } from 'react';

const ManageDoubts = () => {
    const [doubts, setDoubts] = useState([]);
    const [filter, setFilter] = useState('all');
    const [answeringDoubt, setAnsweringDoubt] = useState(null);
    const [answerText, setAnswerText] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchDoubts();
    }, []);

    const fetchDoubts = async () => {
        try {
            const res = await fetch(`${API_URL}/doubts`);
            const data = await res.json();
            setDoubts(data);
        } catch (error) {
            console.error('Error fetching doubts:', error);
        }
    };

    const filteredDoubts = filter === 'all'
        ? doubts
        : doubts.filter(d => d.status === filter);

    const handleAnswerClick = (doubt) => {
        setAnsweringDoubt(doubt);
        setAnswerText(doubt.answer || '');
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/doubts/${answeringDoubt._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answer: answerText,
                    status: 'answered',
                    isPublished: true
                })
            });

            if (res.ok) {
                fetchDoubts();
                setAnsweringDoubt(null);
                setAnswerText('');
                alert('Answer submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Failed to submit answer');
        }
    };

    const handleTogglePublish = async (doubt) => {
        try {
            await fetch(`${API_URL}/doubts/${doubt._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isPublished: !doubt.isPublished
                })
            });
            fetchDoubts();
        } catch (error) {
            console.error('Error toggling publish:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await fetch(`${API_URL}/doubts/${id}`, {
                    method: 'DELETE'
                });
                fetchDoubts();
                alert('Question deleted successfully!');
            } catch (error) {
                console.error('Error deleting doubt:', error);
                alert('Failed to delete question');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Manage Doubts & Questions</h2>
                    <p className="text-gray-400">Answer student questions and publish them</p>
                </div>
                <div className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg font-bold">
                    {doubts.length} Total Questions
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
                    All ({doubts.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg transition ${filter === 'pending'
                            ? 'bg-yellow-500 text-black font-bold'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    Pending ({doubts.filter(d => d.status === 'pending').length})
                </button>
                <button
                    onClick={() => setFilter('answered')}
                    className={`px-4 py-2 rounded-lg transition ${filter === 'answered'
                            ? 'bg-green-500 text-black font-bold'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    Answered ({doubts.filter(d => d.status === 'answered').length})
                </button>
            </div>

            {/* Answer Form Modal */}
            {answeringDoubt && (
                <div className="glass-panel rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">Answer Question</h3>
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                        <p className="text-white font-semibold mb-2">Question:</p>
                        <p className="text-gray-300">{answeringDoubt.question}</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Asked by: {answeringDoubt.studentName} ({answeringDoubt.studentEmail})
                        </p>
                    </div>
                    <form onSubmit={handleSubmitAnswer}>
                        <textarea
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            required
                            rows="6"
                            placeholder="Type your answer here..."
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 mb-4"
                        />
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
                                    setAnsweringDoubt(null);
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

            {/* Doubts List */}
            <div className="space-y-4">
                {filteredDoubts.length === 0 ? (
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
                    filteredDoubts.map((doubt) => (
                        <div key={doubt._id} className="glass-panel rounded-xl p-6">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${doubt.status === 'answered'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {doubt.status === 'answered' ? 'Answered' : 'Pending'}
                                        </span>
                                        {doubt.isPublished && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                                                <i className="fas fa-eye mr-1"></i>
                                                Published
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-2">
                                        {doubt.question}
                                    </h3>
                                    <div className="text-gray-400 text-sm space-y-1">
                                        <p><i className="fas fa-user mr-2"></i>{doubt.studentName}</p>
                                        <p><i className="fas fa-envelope mr-2"></i>{doubt.studentEmail}</p>
                                        <p><i className="fas fa-phone mr-2"></i>{doubt.studentPhone}</p>
                                        <p><i className="fas fa-clock mr-2"></i>{new Date(doubt.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Answer Display */}
                            {doubt.answer && (
                                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                                    <p className="text-green-400 font-semibold mb-2">Answer:</p>
                                    <p className="text-gray-300">{doubt.answer}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => handleAnswerClick(doubt)}
                                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition text-sm"
                                >
                                    <i className="fas fa-reply mr-2"></i>
                                    {doubt.answer ? 'Edit Answer' : 'Answer'}
                                </button>
                                {doubt.status === 'answered' && (
                                    <button
                                        onClick={() => handleTogglePublish(doubt)}
                                        className={`px-4 py-2 rounded-lg transition text-sm ${doubt.isPublished
                                                ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white'
                                                : 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white'
                                            }`}
                                    >
                                        <i className={`fas ${doubt.isPublished ? 'fa-eye-slash' : 'fa-eye'} mr-2`}></i>
                                        {doubt.isPublished ? 'Unpublish' : 'Publish'}
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(doubt._id)}
                                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition text-sm"
                                >
                                    <i className="fas fa-trash mr-2"></i>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageDoubts;
