import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../context/DataContext';
import Pagination from '../components/UI/Pagination';

const FreeQuiz = () => {
    const { freeQuizzes } = useData();
    const [selectedExam, setSelectedExam] = useState('all');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedChapter, setSelectedChapter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [quizUrl, setQuizUrl] = useState('');
    const [quizTitle, setQuizTitle] = useState('');
    const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

    // Derived Data for Filters
    const safeQuizzes = Array.isArray(freeQuizzes) ? freeQuizzes : [];

    const subjects = ['all', ...new Set(safeQuizzes.map(q => q.subject).filter(Boolean))];
    const chapters = ['all', ...new Set(safeQuizzes.map(q => q.chapter).filter(Boolean))];

    // Filter Logic
    const filteredQuizzes = safeQuizzes.filter(quiz => {
        const examMatch = selectedExam === 'all' || quiz.examType === selectedExam;
        const subjectMatch = selectedSubject === 'all' || quiz.subject === selectedSubject;
        const chapterMatch = selectedChapter === 'all' || quiz.chapter === selectedChapter;
        return examMatch && subjectMatch && chapterMatch;
    });

    // Pagination Logic - 6 items per page (2 rows × 3 columns)
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentQuizzes = filteredQuizzes.slice(indexOfFirstItem, indexOfLastItem);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedExam, selectedSubject, selectedChapter]);

    // Handle Quiz Opening
    const handleOpenQuiz = async (quiz) => {
        setIsLoadingQuiz(true);
        setQuizTitle(quiz.title);

        if (quiz.quizType === 'PDF') {
            try {
                // Fetch full quiz data including PDF
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                const apiUrl = cleanBaseUrl.endsWith('/api')
                    ? `${cleanBaseUrl}/free-quizzes/${quiz._id}`
                    : `${cleanBaseUrl}/api/free-quizzes/${quiz._id}`;

                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Failed to fetch quiz data');

                const fullQuiz = await response.json();

                if (fullQuiz.quizPdf && fullQuiz.quizPdf.data) {
                    setQuizUrl(fullQuiz.quizPdf.data);
                    setShowQuizModal(true);
                } else {
                    alert('Quiz PDF data is missing.');
                }
            } catch (error) {
                console.error('Error opening quiz:', error);
                alert('Failed to load quiz. Please try again.');
            }
        } else {
            // Link Type
            setQuizUrl(quiz.quizLink);
            setShowQuizModal(true);
        }

        setIsLoadingQuiz(false);
    };

    return (
        <div className="min-h-screen py-20 animate-fadeIn">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 mb-12 text-center">
                <div className="inline-block p-4 rounded-full bg-cyan-500/10 mb-6 animate-float">
                    <i className="fas fa-clipboard-list text-6xl text-cyan-400"></i>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Practice Quizzes</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Master every concept with our chapter-wise and topic-wise quizzes.
                    Designed to boost your confidence and satisfaction, these free resources help you evaluate your preparation level instantly.
                </p>
            </section>

            {/* Filter Section */}
            <section className="max-w-7xl mx-auto px-4 mb-12">
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <i className="fas fa-filter text-cyan-400"></i>
                        Filter Quizzes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Exam Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Filter by Exam</label>
                            <select
                                value={selectedExam}
                                onChange={(e) => setSelectedExam(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-cyan-400 transition"
                            >
                                <option value="all">All Exams</option>
                                <option value="JEE">JEE (Main & Advanced)</option>
                                <option value="NEET">NEET</option>
                                <option value="BOARDS">Boards</option>
                                <option value="KVPY">KVPY</option>
                                <option value="OLYMPIAD">Olympiad</option>
                                <option value="FOUNDATION">Foundation</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        {/* Subject Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Filter by Subject</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-cyan-400 transition"
                            >
                                {subjects.map(s => <option key={s} value={s}>{s === 'all' ? 'All Subjects' : s}</option>)}
                            </select>
                        </div>

                        {/* Chapter Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Filter by Chapter</label>
                            <select
                                value={selectedChapter}
                                onChange={(e) => setSelectedChapter(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-cyan-400 transition"
                            >
                                {chapters.map(c => <option key={c} value={c}>{c === 'all' ? 'All Chapters' : c}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="max-w-7xl mx-auto px-4">
                {isLoadingQuiz && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="text-center">
                            <i className="fas fa-spinner fa-spin text-5xl text-cyan-400 mb-4"></i>
                            <h3 className="text-white text-xl font-bold">Loading Quiz...</h3>
                        </div>
                    </div>
                )}

                {filteredQuizzes.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700">
                        <i className="fas fa-clipboard-list text-6xl text-gray-600 mb-4"></i>
                        <h3 className="text-2xl font-bold text-white mb-2">No Quizzes Found</h3>
                        <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
                    </div>
                ) : (
                    <>
                        {/* Quiz Count */}
                        <div className="mb-4 text-gray-400">
                            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredQuizzes.length)} of {filteredQuizzes.length} quizzes
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentQuizzes.map(quiz => (
                                <div key={quiz._id} className="glass-panel group hover:border-cyan-500/50 transition-all duration-300 rounded-xl overflow-hidden relative">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                                {quiz.examType}
                                            </span>
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${quiz.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                                quiz.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                                                    'bg-red-500/10 text-red-400 border-red-500/30'
                                                }`}>
                                                {quiz.difficulty}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-cyan-400 transition-colors">
                                            {quiz.title}
                                        </h3>

                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                            {quiz.description || 'Test your knowledge with this interactive quiz.'}
                                        </p>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center text-sm text-gray-400">
                                                <i className="fas fa-book w-6 text-center text-blue-400 mr-2"></i>
                                                <span className="truncate">{quiz.chapter}</span>
                                            </div>
                                            {quiz.topic && (
                                                <div className="flex items-center text-sm text-gray-400">
                                                    <i className="fas fa-bullseye w-6 text-center text-purple-400 mr-2"></i>
                                                    <span className="truncate">{quiz.topic}</span>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleOpenQuiz(quiz)}
                                            className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2"
                                        >
                                            <i className={`fas ${quiz.quizType === 'PDF' ? 'fa-file-pdf' : 'fa-link'}`}></i>
                                            Attempt Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8">
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
                    </>
                )}
            </section>

            {/* Quiz Modal */}
            {showQuizModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-gray-900 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-gray-700 shadow-2xl relative">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/80 rounded-t-2xl">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 truncate pr-4">
                                <i className="fas fa-clipboard-list text-cyan-400"></i>
                                {quizTitle}
                            </h3>
                            <button
                                onClick={() => setShowQuizModal(false)}
                                className="w-8 h-8 rounded-full bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white flex items-center justify-center transition flex-shrink-0"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Content (Iframe) */}
                        <div className="flex-1 bg-white relative rounded-b-2xl overflow-hidden">
                            <iframe
                                src={quizUrl}
                                title="Quiz Content"
                                className="w-full h-full border-none"
                                allow="autoplay; encrypted-media; fullscreen"
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default FreeQuiz;
