import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AssertionReasonChapter = () => {
    const { chapterId } = useParams();
    const navigate = useNavigate();
    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    useEffect(() => {
        fetchChapterDetails();
    }, [chapterId]);

    const fetchChapterDetails = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId') || 'guest';
            const timestamp = Date.now();
            const response = await axios.get(`${API_URL}/assertion-reason/chapters/${chapterId}?userId=${userId}&_t=${timestamp}`);

            setChapter(response.data.chapter);
            setQuestions(response.data.questions || []);
        } catch (error) {
            console.error('Error fetching chapter:', error);
            // Mock data
            setChapter({
                _id: chapterId,
                name: 'Chemical Kinetics',
                newCount: 22,
                learningCount: 3,
                reviewingCount: 0,
                masteredCount: 0,
                totalCount: 25,
                dueCount: 22
            });
            setQuestions([
                { id: 1, title: 'How Circuit Breaker Works', step1: 'Is Assertion True?', step2: 'Is Reason True?', step3: 'Does R explain A?' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const startPractice = (mode) => {
        navigate(`/assertion-reason/${chapterId}/practice?mode=${mode}`);
    };

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
        <div className="min-h-screen pt-32 pb-16 px-4"  >
            <div className="max-w-4xl mx-auto">
                {/* Main Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
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
                                {chapter.totalCount || 0} Questions
                            </span>
                        </div>
                        <div className="px-5 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center gap-2">
                            <i className="fas fa-book text-blue-400"></i>
                            <span className="text-white font-semibold">
                                5 Chapters
                            </span>
                        </div>
                        <div className="px-5 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                            <i className="fas fa-clock text-amber-400"></i>
                            <span className="text-white font-semibold">
                                {chapter.dueCount || 0} Due Today
                            </span>
                        </div>
                        <div className="px-5 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-400"></i>
                            <span className="text-white font-semibold">
                                {chapter.masteredCount || 0} Mastered
                            </span>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate('/assertion-reason')}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-6 transition text-sm"
                >
                    <i className="fas fa-chevron-left text-xs"></i>
                    <span>Back to chapters</span>
                </button>

                {/* Chapter Header */}
                <div className="rounded-2xl p-8 mb-6" style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)' }}>
                    {/* Chapter Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">{chapter.name}</h1>
                        <p className="text-gray-400 text-sm">Choose your practice mode to begin</p>
                    </div>

                    {/* Status Badges - Horizontal Row */}
                    <div className="grid grid-cols-4 gap-3 mb-8">
                        <div className="px-4 py-4 rounded-xl text-center" style={{ background: 'rgba(75, 85, 99, 0.3)' }}>
                            <div className="text-3xl font-bold text-gray-400 mb-1">{chapter.newCount}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">New</div>
                        </div>
                        <div className="px-4 py-4 rounded-xl text-center" style={{ background: 'rgba(217, 119, 6, 0.15)' }}>
                            <div className="text-3xl font-bold text-amber-500 mb-1">{chapter.learningCount}</div>
                            <div className="text-xs text-amber-600/80 uppercase tracking-wider">Learning</div>
                        </div>
                        <div className="px-4 py-4 rounded-xl text-center" style={{ background: 'rgba(37, 99, 235, 0.15)' }}>
                            <div className="text-3xl font-bold text-blue-400 mb-1">{chapter.reviewingCount}</div>
                            <div className="text-xs text-blue-500/80 uppercase tracking-wider">Reviewing</div>
                        </div>
                        <div className="px-4 py-4 rounded-xl text-center" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
                            <div className="text-3xl font-bold text-green-400 mb-1">{chapter.masteredCount}</div>
                            <div className="text-xs text-green-500/80 uppercase tracking-wider">Mastered</div>
                        </div>
                    </div>

                    {/* How Circuit Breaker Works Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <i className="fas fa-lightbulb text-purple-400 text-sm"></i>
                            <h3 className="text-white font-semibold text-base">How Assertion & Reason Works</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    1
                                </div>
                                <span className="text-sm text-gray-300">Is Assertion True?</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    2
                                </div>
                                <span className="text-sm text-gray-300">Is Reason True?</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    3
                                </div>
                                <span className="text-sm text-gray-300">Does R explain A?</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => startPractice('due')}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition text-white"
                            style={{ background: 'linear-gradient(to right, #f97316, #fb923c)' }}
                        >
                            <i className="fas fa-clock"></i>
                            <span>Review Due ({chapter.dueCount})</span>
                        </button>
                        <button
                            onClick={() => startPractice('all')}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition text-white"
                            style={{ background: 'linear-gradient(to right, #8b5cf6, #a78bfa)' }}
                        >
                            <i className="fas fa-sparkles"></i>
                            <span>Practice All ({chapter.totalCount})</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssertionReasonChapter;
