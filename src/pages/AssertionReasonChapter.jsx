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
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/assertion-reason')}
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition"
                >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to chapters</span>
                </button>

                {/* Chapter Header */}
                <div className="glass-panel rounded-xl p-8 mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">{chapter.name}</h1>
                    <p className="text-cyan-400 mb-6">Choose your practice mode to begin</p>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600">
                            <div className="text-2xl font-bold text-white">{chapter.newCount}</div>
                            <div className="text-xs text-gray-400">New</div>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            <div className="text-2xl font-bold text-amber-400">{chapter.learningCount}</div>
                            <div className="text-xs text-gray-400">Learning</div>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                            <div className="text-2xl font-bold text-blue-400">{chapter.reviewingCount}</div>
                            <div className="text-xs text-gray-400">Reviewing</div>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
                            <div className="text-2xl font-bold text-green-400">{chapter.masteredCount}</div>
                            <div className="text-xs text-gray-400">Mastered</div>
                        </div>
                    </div>

                    {/* Question Breakdown */}
                    {questions.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <i className="fas fa-lightbulb text-purple-400"></i>
                                <h3 className="text-white font-semibold">How Circuit Breaker Works</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                        1
                                    </div>
                                    <span className="text-sm text-gray-300">Is Assertion True?</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                        2
                                    </div>
                                    <span className="text-sm text-gray-300">Is Reason True?</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                                        3
                                    </div>
                                    <span className="text-sm text-gray-300">Does R explain A?</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => startPractice('due')}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition"
                        >
                            <i className="fas fa-clock"></i>
                            <span>Review Due ({chapter.dueCount})</span>
                        </button>
                        <button
                            onClick={() => startPractice('all')}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
                        >
                            <i className="fas fa-play"></i>
                            <span>Practice All ({chapter.totalCount})</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssertionReasonChapter;
