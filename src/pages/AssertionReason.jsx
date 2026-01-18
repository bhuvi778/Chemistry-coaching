import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AssertionReason = () => {
    const navigate = useNavigate();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [stats, setStats] = useState({
        totalQuestions: 0,
        totalChapters: 0,
        dueToday: 0,
        mastered: 0
    });

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    const categories = [
        { id: 'all', name: 'All Chapters', icon: 'fas fa-layer-group', color: '#a855f7' },
        { id: 'physical', name: 'Physical', icon: 'fas fa-atom', color: '#10b981' },
        { id: 'organic', name: 'Organic', icon: 'fas fa-flask', color: '#f59e0b' },
        { id: 'inorganic', name: 'Inorganic', icon: 'fas fa-vial', color: '#3b82f6' }
    ];

    useEffect(() => {
        fetchChapters();
    }, []);

    const fetchChapters = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId') || 'guest';
            const timestamp = Date.now();
            const response = await axios.get(`${API_URL}/assertion-reason/chapters?userId=${userId}&_t=${timestamp}`);

            setChapters(response.data.chapters || []);
            setStats(response.data.stats || stats);
        } catch (error) {
            console.error('Error fetching chapters:', error);
            // Mock data for development
            setChapters([
                { _id: '1', name: 'Chemical Kinetics', questionCount: 25, dueCount: 22, icon: 'fas fa-bolt', iconColor: '#8b5cf6' },
                { _id: '2', name: 'Amines', questionCount: 30, dueCount: 30, icon: 'fas fa-bolt', iconColor: '#8b5cf6' },
                { _id: '3', name: 'Alcohols', questionCount: 30, dueCount: 30, icon: 'fas fa-bolt', iconColor: '#8b5cf6' },
                { _id: '4', name: 'Aldehydes', questionCount: 30, dueCount: 30, icon: 'fas fa-bolt', iconColor: '#8b5cf6' },
                { _id: '5', name: 'Biomolecules', questionCount: 30, dueCount: 30, icon: 'fas fa-bolt', iconColor: '#8b5cf6' },
                { _id: '6', name: 'Coordination Complexes', questionCount: 30, dueCount: 30, icon: 'fas fa-bolt', iconColor: '#8b5cf6' },
            ]);
            setStats({
                totalQuestions: 680,
                totalChapters: 18,
                dueToday: 677,
                mastered: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredChapters = selectedCategory === 'all'
        ? chapters
        : chapters.filter(ch => ch.category?.toLowerCase() === selectedCategory);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        Assertion & Reason
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                        Master chemistry concepts through assertion-reason questions with spaced repetition.
                    </p>

                    {/* Statistics Badges */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <div className="px-5 py-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center gap-2">
                            <i className="fas fa-layer-group text-purple-400"></i>
                            <span className="text-white font-semibold">
                                {stats.totalQuestions} Questions
                            </span>
                        </div>
                        <div className="px-5 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center gap-2">
                            <i className="fas fa-book text-blue-400"></i>
                            <span className="text-white font-semibold">
                                {stats.totalChapters} Chapters
                            </span>
                        </div>
                        <div className="px-5 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                            <i className="fas fa-clock text-amber-400"></i>
                            <span className="text-white font-semibold">
                                {stats.dueToday} Due Today
                            </span>
                        </div>
                        <div className="px-5 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-400"></i>
                            <span className="text-white font-semibold">
                                {stats.mastered} Mastered
                            </span>
                        </div>
                    </div>
                </div>

                {/* Chapters Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Select a Chapter</h2>

                    {/* Category Filter Tabs */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        {categories.map((category) => {
                            const totalChapters = category.id === 'all'
                                ? chapters.length
                                : chapters.filter(ch => ch.category?.toLowerCase() === category.id).length;

                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-5 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 ${selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                        }`}
                                >
                                    <i className={category.icon}></i>
                                    <span>{category.name}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${selectedCategory === category.id
                                        ? 'bg-white/20'
                                        : 'bg-gray-700'
                                        }`}>
                                        {totalChapters}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredChapters.map((chapter) => (
                            <div
                                key={chapter._id}
                                onClick={() => navigate(`/assertion-reason/${chapter._id}`)}
                                className="glass-panel rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                            >
                                {/* Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10">
                                    {/* Icon and Due Count */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                                            style={{ backgroundColor: `${chapter.iconColor}20`, color: chapter.iconColor }}
                                        >
                                            <i className={chapter.icon || 'fas fa-bolt'}></i>
                                        </div>
                                        {chapter.dueCount > 0 && (
                                            <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                                                <span className="text-amber-400 font-bold text-sm">{chapter.dueCount} due</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Category Badge */}
                                    {chapter.category && (
                                        <div className="mb-3">
                                            <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold"
                                                style={{
                                                    backgroundColor: `${chapter.iconColor}15`,
                                                    color: chapter.iconColor
                                                }}>
                                                {chapter.category}
                                            </span>
                                        </div>
                                    )}

                                    {/* Chapter Name */}
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                        {chapter.name}
                                    </h3>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span>
                                            <i className="fas fa-question-circle mr-1"></i>
                                            {chapter.questionCount} questions
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    {chapter.progress > 0 && (
                                        <div className="mt-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-gray-400">Progress</span>
                                                <span className="text-xs font-semibold text-cyan-400">{chapter.progress}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                                                    style={{ width: `${chapter.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="glass-panel rounded-xl p-8 mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                <i className="fas fa-brain text-3xl text-cyan-400"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Active Recall</h3>
                            <p className="text-gray-400 text-sm">
                                Test your knowledge and strengthen memory retention
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <i className="fas fa-sync-alt text-3xl text-purple-400"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Spaced Repetition</h3>
                            <p className="text-gray-400 text-sm">
                                Review cards at optimal intervals for better learning
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                <i className="fas fa-chart-line text-3xl text-green-400"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Track Progress</h3>
                            <p className="text-gray-400 text-sm">
                                Monitor your learning journey and identify weak areas
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssertionReason;
