import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchExamCategories, fetchStats } from '../services/ntaAbhyasApi';
import NCERTTabs from '../components/NCERT/NCERTTabs';

const NTAAbhyas = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await fetchStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const examCategories = [
        {
            id: 'JEE',
            name: 'JEE (Joint Entrance Examination)',
            icon: 'fa-atom',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30',
            textColor: 'text-blue-400',
            description: 'Practice questions for JEE Main & Advanced'
        },
        {
            id: 'NEET',
            name: 'NEET (National Eligibility cum Entrance Test)',
            icon: 'fa-microscope',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30',
            textColor: 'text-green-400',
            description: 'Practice questions for NEET (UG)'
        }
    ];

    const getStatsForExam = (examId) => {
        const examStats = stats.find(s => s.examCategory === examId);
        return examStats || { totalQuestions: 0, totalChapters: 0 };
    };

    // Calculate total stats
    const totalChapters = stats.reduce((sum, s) => sum + (s.totalChapters || 0), 0);
    const totalQuestions = stats.reduce((sum, s) => sum + (s.totalQuestions || 0), 0);

    // Calculate stats for tabs
    const tabStats = {
        'nta-abhyas': {
            chapters: totalChapters,
            questions: totalQuestions
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center relative z-10">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                    <Link to="/ncert-toolbox" className="hover:text-cyan-400 transition">
                        <i className="fas fa-tools mr-2"></i>NCERT Toolbox
                    </Link>
                    <i className="fas fa-chevron-right text-xs"></i>
                    <span className="text-white">NTA Abhyas</span>
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                        NCERT Toolbox
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                        Practice with NTA Abhyas questions for JEE and NEET. Master every chapter with comprehensive question banks.
                    </p>

                    {/* Statistics Badges */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <div className="px-5 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
                            <i className="fas fa-book text-green-400"></i>
                            <span className="text-white font-semibold">
                                {totalChapters} Chapters
                            </span>
                        </div>
                        <div className="px-5 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center gap-2">
                            <i className="fas fa-question-circle text-blue-400"></i>
                            <span className="text-white font-semibold">
                                {totalQuestions} Questions
                            </span>
                        </div>
                        <div className="px-5 py-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center gap-2">
                            <i className="fas fa-graduation-cap text-purple-400"></i>
                            <span className="text-white font-semibold">
                                JEE & NEET
                            </span>
                        </div>
                    </div>

                    <NCERTTabs stats={tabStats} />
                </div>

                {/* Exam Category Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {examCategories.map((exam) => {
                        const examStats = getStatsForExam(exam.id);

                        return (
                            <div
                                key={exam.id}
                                onClick={() => navigate(`/ncert-toolbox/nta-abhyas/${exam.id}`)}
                                className="glass-panel rounded-2xl p-8 border border-gray-700 hover:border-green-500/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${exam.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${exam.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <i className={`fas ${exam.icon} text-white text-2xl`}></i>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-2xl font-bold text-white mb-3">
                                        {exam.name}
                                    </h2>

                                    {/* Description */}
                                    <p className="text-gray-400 mb-6">
                                        {exam.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`px-3 py-1 rounded-lg ${exam.bgColor} border ${exam.borderColor}`}>
                                            <span className={`text-sm font-medium ${exam.textColor}`}>
                                                <i className="fas fa-book mr-2"></i>
                                                {examStats.totalChapters} Chapters
                                            </span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg ${exam.bgColor} border ${exam.borderColor}`}>
                                            <span className={`text-sm font-medium ${exam.textColor}`}>
                                                <i className="fas fa-question-circle mr-2"></i>
                                                {examStats.totalQuestions} Questions
                                            </span>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-green-400 font-medium group-hover:text-green-300 transition">
                                            Start Practicing
                                        </span>
                                        <i className="fas fa-arrow-right text-green-400 group-hover:translate-x-2 transition-transform"></i>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info Section */}
                <div className="mt-16 glass-panel rounded-2xl p-8 border border-gray-700 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">
                        <i className="fas fa-info-circle text-green-400 mr-3"></i>
                        About NTA Abhyas
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                                <i className="fas fa-clipboard-list text-cyan-400 text-xl"></i>
                            </div>
                            <h4 className="text-white font-semibold mb-2">Chapter-wise Practice</h4>
                            <p className="text-gray-400 text-sm">Organized by chapters for systematic preparation</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                                <i className="fas fa-chart-line text-purple-400 text-xl"></i>
                            </div>
                            <h4 className="text-white font-semibold mb-2">Track Progress</h4>
                            <p className="text-gray-400 text-sm">Monitor your performance with real-time tracking</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                                <i className="fas fa-lightbulb text-green-400 text-xl"></i>
                            </div>
                            <h4 className="text-white font-semibold mb-2">Detailed Solutions</h4>
                            <p className="text-gray-400 text-sm">Learn with comprehensive hints and solutions</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NTAAbhyas;
