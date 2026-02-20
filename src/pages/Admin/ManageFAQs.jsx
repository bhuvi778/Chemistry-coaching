import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ManageFAQs = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [stats, setStats] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('All');

    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: 'General',
        tags: '',
        isActive: true
    });

    const categories = ['All', 'JEE', 'NEET', 'Boards', 'Study Tips', 'Career Guidance', 'Chemistry', 'General'];

    useEffect(() => {
        fetchFaqs();
        fetchStats();
    }, [categoryFilter]);

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/faqs/admin/all`, {
                params: { category: categoryFilter }
            });
            setFaqs(response.data);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/faqs/admin/stats`);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSubmit = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
            };

            if (editingFaq) {
                await axios.put(`${API_URL}/faqs/admin/${editingFaq._id}`, dataToSubmit);
                alert('FAQ updated successfully!');
            } else {
                await axios.post(`${API_URL}/faqs/admin`, dataToSubmit);
                alert('FAQ created successfully!');
            }

            setShowModal(false);
            resetForm();
            fetchFaqs();
            fetchStats();
        } catch (error) {
            console.error('Error saving FAQ:', error);
            alert('Error saving FAQ');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            await axios.delete(`${API_URL}/faqs/admin/${id}`);
            fetchFaqs();
            fetchStats();
            alert('FAQ deleted successfully!');
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            alert('Error deleting FAQ');
        }
    };

    const handleEdit = (faq) => {
        setEditingFaq(faq);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            tags: faq.tags.join(', '),
            isActive: faq.isActive
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingFaq(null);
        setFormData({
            question: '',
            answer: '',
            category: 'General',
            tags: '',
            isActive: true
        });
    };

    return (
        <div>
            {/* Statistics */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Total FAQs</p>
                                <p className="text-3xl font-bold text-white">{stats.totalFAQs}</p>
                            </div>
                            <i className="fas fa-question-circle text-cyan-400 text-3xl"></i>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                {/* Category Filter */}
                <div className="flex overflow-x-auto gap-2 w-full md:w-auto pb-2 md:pb-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${categoryFilter === cat
                                ? 'bg-cyan-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition w-full md:w-auto justify-center"
                >
                    <i className="fas fa-plus"></i>
                    Create New FAQ
                </button>
            </div>

            {/* FAQs List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            ) : faqs.length === 0 ? (
                <div className="text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700">
                    <i className="fas fa-question text-6xl text-gray-600 mb-4"></i>
                    <p className="text-gray-400 text-xl">No FAQs found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {faqs.map((faq) => (
                        <div
                            key={faq._id}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500 transition"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2">{faq.question}</h3>
                                    <p className="text-gray-300 mb-3">{faq.answer}</p>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                                            {faq.category}
                                        </span>
                                        {faq.isActive ? (
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                                                Inactive
                                            </span>
                                        )}
                                        <span className="text-gray-500 text-sm">
                                            <i className="far fa-eye mr-1"></i>
                                            {faq.views} views
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(faq)}
                                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition"
                                        title="Edit"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq._id)}
                                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition"
                                        title="Delete"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900 sticky top-0">
                            <h2 className="text-2xl font-bold text-white">
                                {editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Question</label>
                                    <input
                                        type="text"
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Answer</label>
                                    <textarea
                                        value={formData.answer}
                                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 h-32"
                                        required
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                        >
                                            {categories.filter(c => c !== 'All').map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-2">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="e.g., jee, physics, formula"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        id="isActive"
                                        className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                                    />
                                    <label htmlFor="isActive" className="text-white">Active (Visible on website)</label>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition"
                                >
                                    {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFAQs;
