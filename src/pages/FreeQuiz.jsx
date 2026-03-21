import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/UI/Pagination';

const FreeQuiz = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExam, setSelectedExam] = useState('all');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedChapter, setSelectedChapter] = useState('all');
    const [selectedQuizType, setSelectedQuizType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await fetch(`${API_URL}/free-quizzes`);
            const data = await res.json();
            setQuizzes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching quizzes:', err);
        } finally {
            setLoading(false);
        }
    };

    const subjects = ['all', ...new Set(quizzes.map(q => q.subject).filter(Boolean))];
    const chapters = ['all', ...new Set(
        quizzes
            .filter(q => selectedSubject === 'all' || q.subject === selectedSubject)
            .map(q => q.chapter)
            .filter(Boolean)
    )];

    const filteredQuizzes = quizzes.filter(q => {
        const examMatch = selectedExam === 'all' || q.examType === selectedExam;
        const subjectMatch = selectedSubject === 'all' || q.subject === selectedSubject;
        const chapterMatch = selectedChapter === 'all' || q.chapter === selectedChapter;
        const typeMatch = selectedQuizType === 'all' || q.quizCategory === selectedQuizType;
        return examMatch && subjectMatch && chapterMatch && typeMatch;
    });

    const itemsPerPage = 9;
    const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
    const currentQuizzes = filteredQuizzes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [selectedExam, selectedSubject, selectedChapter, selectedQuizType]);
    useEffect(() => { if (selectedSubject !== 'all') setSelectedChapter('all'); }, [selectedSubject]);

    const difficultyColor = (d) => {
        if (d === 'Easy') return 'text-green-400 bg-green-500/10 border-green-500/30';
        if (d === 'Hard') return 'text-red-400 bg-red-500/10 border-red-500/30';
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    };

    const categoryColor = (c) => {
        if (c === 'Mock Test') return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
        if (c === 'PYPs') return 'text-pink-400 bg-pink-500/20 border-pink-500/30';
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
    };

    return (
        <div className="min-h-screen py-20 animate-fadeIn">
            {/* Hero */}
            <section className="max-w-7xl mx-auto px-4 mb-12 text-center">
                <div className="inline-block p-4 rounded-full bg-cyan-500/10 mb-6 animate-float">
                    <i className="fas fa-clipboard-list text-6xl text-cyan-400"></i>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Practice Quizzes</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Master every concept with our chapter-wise and topic-wise quizzes.
                    Attempt directly in your browser — no login required.
                </p>
            </section>

            {/* Filters */}
            <section className="max-w-7xl mx-auto px-4 mb-10">
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <i className="fas fa-filter text-cyan-400"></i> Filter Quizzes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">Exam</label>
                            <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 focus:border-cyan-400 outline-none transition">
                                <option value="all">All Exams</option>
                                <optgroup label="UG Entrance"><option value="NEET">NEET</option><option value="JEE">JEE</option><option value="IAT">IAT</option><option value="NEST">NEST</option><option value="CUET UG">CUET UG</option><option value="BITSAT">BITSAT</option></optgroup>
                                <optgroup label="PG Entrance"><option value="IIT JAM">IIT JAM</option><option value="CUET PG">CUET PG</option></optgroup>
                                <optgroup label="Research"><option value="CSIR NET">CSIR NET</option><option value="GATE">GATE</option><option value="TIFR">TIFR</option></optgroup>
                                <optgroup label="Govt. Job"><option value="PSTET">PSTET</option><option value="Master Cadre">Master Cadre</option><option value="UPSC - Mains (Chemistry)">UPSC Mains</option></optgroup>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">Subject</label>
                            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 focus:border-cyan-400 outline-none transition">
                                {subjects.map(s => <option key={s} value={s}>{s === 'all' ? 'All Subjects' : s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">Chapter</label>
                            <select value={selectedChapter} onChange={e => setSelectedChapter(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 focus:border-cyan-400 outline-none transition">
                                {chapters.map(c => <option key={c} value={c}>{c === 'all' ? 'All Chapters' : c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">Quiz Type</label>
                            <select value={selectedQuizType} onChange={e => setSelectedQuizType(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 focus:border-cyan-400 outline-none transition">
                                <option value="all">All Types</option>
                                <option value="Quiz">Quiz</option>
                                <option value="Mock Test">Mock Test</option>
                                <option value="PYPs">PYPs</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto px-4">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                        <p className="text-gray-400">Loading quizzes...</p>
                    </div>
                ) : filteredQuizzes.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700">
                        <i className="fas fa-clipboard-list text-6xl text-gray-600 mb-4"></i>
                        <h3 className="text-2xl font-bold text-white mb-2">No Quizzes Found</h3>
                        <p className="text-gray-400">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-400 mb-4 text-sm">
                            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredQuizzes.length)} of {filteredQuizzes.length} quizzes
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentQuizzes.map(quiz => (
                                <div key={quiz._id} className="glass-panel group hover:border-cyan-500/50 transition-all duration-300 rounded-xl overflow-hidden flex flex-col">
                                    <div className="p-6 flex flex-col flex-1">
                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">{quiz.examType}</span>
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${categoryColor(quiz.quizCategory)}`}>{quiz.quizCategory || 'Quiz'}</span>
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${difficultyColor(quiz.difficulty)}`}>{quiz.difficulty}</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2 flex-1">
                                            {quiz.title}
                                        </h3>

                                        {quiz.description && (
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{quiz.description}</p>
                                        )}

                                        {/* Info */}
                                        <div className="space-y-1.5 mb-4">
                                            <div className="flex items-center text-sm text-gray-400 gap-2">
                                                <i className="fas fa-book w-4 text-blue-400 text-center"></i>
                                                <span className="truncate">{quiz.chapter}</span>
                                            </div>
                                            {quiz.topic && (
                                                <div className="flex items-center text-sm text-gray-400 gap-2">
                                                    <i className="fas fa-bullseye w-4 text-purple-400 text-center"></i>
                                                    <span className="truncate">{quiz.topic}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center text-sm text-gray-400 gap-2">
                                                <i className="fas fa-question-circle w-4 text-cyan-400 text-center"></i>
                                                <span>{quiz.questionCount ?? 0} questions</span>
                                                <span className="text-gray-600">•</span>
                                                <i className="fas fa-clock w-4 text-orange-400 text-center"></i>
                                                <span>{quiz.timeLimit ?? 30} mins</span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <button
                                            onClick={() => navigate(`/free-quiz/${quiz._id}`)}
                                            disabled={(quiz.questionCount ?? 0) === 0}
                                            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {(quiz.questionCount ?? 0) === 0 ? (
                                                <><i className="fas fa-clock"></i> Coming Soon</>
                                            ) : (
                                                <><i className="fas fa-play"></i> Attempt Now</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8">
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default FreeQuiz;
