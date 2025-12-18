import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ParticleCanvas from '../components/UI/ParticleCanvas';

const Doubts = () => {
    const { isDark } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [publishedDoubts, setPublishedDoubts] = useState([]);
    const [filteredDoubts, setFilteredDoubts] = useState([]);
    const [showAskForm, setShowAskForm] = useState(false);
    const [formData, setFormData] = useState({
        studentName: '',
        studentEmail: '',
        studentPhone: '',
        question: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchPublishedDoubts();
    }, []);

    useEffect(() => {
        // Filter doubts based on search query
        if (searchQuery.trim()) {
            const filtered = publishedDoubts.filter(doubt =>
                doubt.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doubt.answer.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredDoubts(filtered);
        } else {
            setFilteredDoubts(publishedDoubts);
        }
    }, [searchQuery, publishedDoubts]);

    const fetchPublishedDoubts = async () => {
        try {
            const res = await fetch(`${API_URL}/doubts/published`);
            const data = await res.json();
            setPublishedDoubts(data);
            setFilteredDoubts(data);
        } catch (error) {
            console.error('Error fetching doubts:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAskClick = () => {
        // Check if question already exists
        const questionExists = publishedDoubts.some(doubt =>
            doubt.question.toLowerCase().includes(searchQuery.toLowerCase().trim())
        );

        if (questionExists && searchQuery.trim()) {
            alert('This question has already been answered! Please check the results below.');
            return;
        }

        setShowAskForm(true);
        setFormData(prev => ({ ...prev, question: searchQuery }));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_URL}/doubts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Your question has been submitted successfully! Our team will answer it soon.');
                setFormData({
                    studentName: '',
                    studentEmail: '',
                    studentPhone: '',
                    question: ''
                });
                setSearchQuery('');
                setShowAskForm(false);
            }
        } catch (error) {
            console.error('Error submitting question:', error);
            alert('Failed to submit question. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} relative overflow-hidden`}>
            {/* Particle Background */}
            <ParticleCanvas />

            <div className="max-w-6xl mx-auto px-4 py-8 relative z-20">
                {/* Back Button */}
                <div className="mb-6">
                    <Link to="/" className={`${isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-gray-900'} flex items-center gap-2 transition`}>
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                        <i className="fas fa-question-circle text-cyan-500 mr-3"></i>
                        Doubts & Questions
                    </h1>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Search for answers or ask your question
                    </p>
                </div>

                {/* Search Bar with Ask Button */}
                <div className={`${isDark ? 'glass-panel' : 'bg-white shadow-lg border border-gray-200'} rounded-xl p-6 mb-8`}>
                    <div className="flex gap-3 flex-col sm:flex-row">
                        <div className="flex-1 relative">
                            <i className={`fas fa-search absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}></i>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search your question here..."
                                className={`w-full pl-12 pr-4 py-4 ${isDark
                                    ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                                    } border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition`}
                            />
                        </div>
                        <button
                            onClick={handleAskClick}
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition transform hover:scale-105"
                        >
                            <i className="fas fa-paper-plane mr-2"></i>
                            Ask
                        </button>
                    </div>
                </div>

                {/* Ask Question Form Modal */}
                {showAskForm && (
                    <div className={`${isDark ? 'glass-panel' : 'bg-white shadow-lg border border-gray-200'} rounded-xl p-8 mb-8`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Submit Your Question
                            </h2>
                            <button
                                onClick={() => setShowAskForm(false)}
                                className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Your Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="studentName"
                                    value={formData.studentName}
                                    onChange={handleFormChange}
                                    required
                                    className={`w-full px-4 py-3 ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="studentEmail"
                                    value={formData.studentEmail}
                                    onChange={handleFormChange}
                                    required
                                    className={`w-full px-4 py-3 ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="studentPhone"
                                    value={formData.studentPhone}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="+91 XXXXX XXXXX"
                                    className={`w-full px-4 py-3 ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                                />
                            </div>

                            {/* Question */}
                            <div>
                                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Your Question <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="question"
                                    value={formData.question}
                                    onChange={handleFormChange}
                                    required
                                    rows="4"
                                    className={`w-full px-4 py-3 ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-check mr-2"></i>
                                            Submit Question
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAskForm(false)}
                                    className={`px-6 py-3 ${isDark
                                        ? 'bg-gray-700 hover:bg-gray-600'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                        } ${isDark ? 'text-white' : 'text-gray-900'} font-semibold rounded-lg transition`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Q&A List */}
                <div className="space-y-4">
                    {filteredDoubts.length > 0 ? (
                        filteredDoubts.map((doubt) => (
                            <div key={doubt._id} className={`${isDark ? 'glass-panel' : 'bg-white shadow-md'} rounded-xl p-6 hover:shadow-xl transition-shadow`}>
                                {/* Question */}
                                <div className="mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                                            <i className="fas fa-question text-cyan-400"></i>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                                                {doubt.question}
                                            </h3>
                                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                Asked by {doubt.studentName}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Answer */}
                                <div className={`${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                            <i className="fas fa-check text-green-400 text-sm"></i>
                                        </div>
                                        <div className="flex-1">
                                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                                                {doubt.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={`${isDark ? 'glass-panel' : 'bg-white shadow-md'} rounded-xl p-12 text-center`}>
                            <i className={`fas fa-search text-6xl ${isDark ? 'text-gray-700' : 'text-gray-300'} mb-4`}></i>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {searchQuery ? 'No matching questions found. Click "Ask" to submit your question!' : 'No questions yet. Be the first to ask!'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Doubts;
