import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

const Puzzle = () => {
    const [selectedExam, setSelectedExam] = useState('all');
    const [crosswords, setCrosswords] = useState([]);
    const [puzzleSets, setPuzzleSets] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showCrosswordModal, setShowCrosswordModal] = useState(false);
    const [selectedCrossword, setSelectedCrossword] = useState(null);
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const handleDownloadPDF = (base64Data, filename) => {
        try {
            if (!base64Data) {
                alert('PDF not available');
                return;
            }

            const link = document.createElement('a');
            link.href = base64Data;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Error downloading PDF');
        }
    };

    // Fetch crosswords and puzzle sets
    useEffect(() => {
        fetchCrosswords();
        fetchPuzzleSets();
    }, []);

    const fetchCrosswords = async () => {
        try {
            const response = await fetch('/api/crosswords');
            const data = await response.json();
            // Ensure data is always an array
            setCrosswords(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching crosswords:', error);
            setCrosswords([]);
            setLoading(false);
        }
    };

    const fetchPuzzleSets = async () => {
        try {
            const response = await fetch('/api/puzzle-sets');
            const data = await response.json();
            // Ensure data is always an array
            setPuzzleSets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching puzzle sets:', error);
            setPuzzleSets([]);
        }
    };

    // Ensure arrays before filtering
    const safeCrosswords = Array.isArray(crosswords) ? crosswords : [];
    const safePuzzleSets = Array.isArray(puzzleSets) ? puzzleSets : [];

    // Filter crosswords
    const filteredCrosswords = safeCrosswords.filter(crossword => {
        if (!crossword) return false;
        const examMatch = selectedExam === 'all' || crossword.examType === selectedExam;
        const chapterMatch = selectedChapter === 'all' || crossword.chapter === selectedChapter;
        return examMatch && chapterMatch;
    });

    // Filter puzzle sets
    const filteredPuzzleSets = safePuzzleSets.filter(puzzleSet => {
        if (!puzzleSet) return false;
        const examMatch = selectedExam === 'all' || puzzleSet.examType === selectedExam;
        const chapterMatch = selectedChapter === 'all' || puzzleSet.chapter === selectedChapter;
        return examMatch && chapterMatch;
    });

    // Get unique chapters from both
    const allChapters = [...new Set([
        ...safeCrosswords.filter(c => c && c.chapter).map(c => c.chapter), 
        ...safePuzzleSets.filter(p => p && p.chapter).map(p => p.chapter)
    ])];
    const chapters = ['all', ...allChapters];

    return (
        <div className="animate-fadeIn min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="flex items-center mb-8">
                    <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        <i className="fas fa-th mr-3"></i>
                        Chemistry Puzzles
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Interactive crosswords and downloadable puzzle sets to test your chemistry knowledge
                    </p>
                </div>

                {/* Filters */}
                <div className="glass-panel rounded-2xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <i className="fas fa-filter text-cyan-400"></i>
                        Filter Puzzles
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Exam Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-3">
                                <i className="fas fa-graduation-cap mr-2 text-cyan-400"></i>
                                Filter by Exam
                            </label>
                            <select
                                value={selectedExam}
                                onChange={(e) => setSelectedExam(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-cyan-400 transition"
                            >
                                <option value="all">All Exams</option>
                                <option value="JEE">JEE</option>
                                <option value="NEET">NEET</option>
                                <option value="BOARDS">BOARDS</option>
                            </select>
                        </div>

                        {/* Chapter Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-3">
                                <i className="fas fa-book mr-2 text-blue-400"></i>
                                Filter by Chapter
                            </label>
                            <select
                                value={selectedChapter}
                                onChange={(e) => setSelectedChapter(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-400 transition"
                            >
                                <option value="all">All Chapters</option>
                                {chapters.filter(c => c !== 'all').map(chapter => (
                                    <option key={chapter} value={chapter}>{chapter}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ==================== INTERACTIVE CROSSWORDS SECTION ==================== */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <i className="fas fa-th text-cyan-400"></i>
                            Interactive Crosswords
                        </h2>
                        <span className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold">
                            {filteredCrosswords.length} Available
                        </span>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <i className="fas fa-spinner fa-spin text-6xl text-cyan-400 mb-4"></i>
                            <p className="text-gray-400 text-xl">Loading crosswords...</p>
                        </div>
                    ) : filteredCrosswords.length === 0 ? (
                        <div className="text-center py-20 glass-panel rounded-2xl">
                            <i className="fas fa-th text-6xl text-gray-600 mb-4"></i>
                            <h3 className="text-2xl font-bold text-white mb-2">No Interactive Crosswords Found</h3>
                            <p className="text-gray-400">
                                {selectedExam !== 'all' || selectedChapter !== 'all'
                                    ? 'Try changing your filters'
                                    : 'Interactive crosswords will be available soon!'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCrosswords.map((crossword) => (
                                <div key={crossword._id} className="glass-panel rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 group">
                                    {crossword.thumbnailUrl && (
                                        <div className="w-full aspect-[16/9] overflow-hidden relative">
                                            <img
                                                src={crossword.thumbnailUrl}
                                                alt={crossword.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2">{crossword.title}</h3>
                                        {crossword.description && (
                                            <p className="text-gray-400 text-sm mb-4">{crossword.description}</p>
                                        )}
                                        <div className="flex gap-2 mb-4 flex-wrap">
                                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                                                {crossword.chapter}
                                            </span>
                                            {crossword.topic && (
                                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                                    {crossword.topic}
                                                </span>
                                            )}
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                                {crossword.examType}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedCrossword(crossword);
                                                setShowCrosswordModal(true);
                                            }}
                                            className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition font-semibold"
                                        >
                                            <i className="fas fa-play"></i>
                                            Play Crossword
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ==================== PUZZLE PDF SETS SECTION ==================== */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <i className="fas fa-puzzle-piece text-orange-400"></i>
                            Search word
                        </h2>
                        <span className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold">
                            {filteredPuzzleSets.length} Available
                        </span>
                    </div>

                    {filteredPuzzleSets.length === 0 ? (
                        <div className="text-center py-20 glass-panel rounded-2xl">
                            <i className="fas fa-puzzle-piece text-6xl text-gray-600 mb-4"></i>
                            <h3 className="text-2xl font-bold text-white mb-2">No Puzzle Sets Found</h3>
                            <p className="text-gray-400">
                                {selectedExam !== 'all' || selectedChapter !== 'all'
                                    ? 'Try changing your filters'
                                    : 'Puzzle sets will be available soon!'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredPuzzleSets.map((puzzleSet) => {
                                console.log('Puzzle Set:', puzzleSet.title, 'Has thumbnail:', !!puzzleSet.thumbnailUrl);
                                return (
                                <div key={puzzleSet._id} className="glass-panel rounded-xl p-6 hover:shadow-[0_0_30px_rgba(251,146,60,0.3)] transition-all duration-300">
                                    {/* Circle Image */}
                                    <div className="flex justify-center mb-6">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-400 shadow-lg bg-gray-800">
                                            {puzzleSet.thumbnailUrl && puzzleSet.thumbnailUrl !== '' && puzzleSet.thumbnailUrl !== 'null' ? (
                                                <>
                                                    <img
                                                        src={puzzleSet.thumbnailUrl}
                                                        alt={puzzleSet.title || 'Puzzle'}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            console.error('Image load error for:', puzzleSet.title);
                                                            e.target.style.display = 'none';
                                                            if (e.target.nextElementSibling) {
                                                                e.target.nextElementSibling.style.display = 'flex';
                                                            }
                                                        }}
                                                        onLoad={() => console.log('Image loaded successfully for:', puzzleSet.title)}
                                                    />
                                                    <div 
                                                        className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center"
                                                        style={{ display: 'none' }}
                                                    >
                                                        <i className="fas fa-puzzle-piece text-white text-4xl"></i>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                                    <i className="fas fa-puzzle-piece text-white text-4xl"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-white font-bold text-center mb-2 text-lg">
                                        {puzzleSet.title}
                                    </h3>

                                    {/* Description */}
                                    {puzzleSet.description && (
                                        <p className="text-gray-400 text-sm text-center mb-4 line-clamp-2">
                                            {puzzleSet.description}
                                        </p>
                                    )}

                                    {/* Buttons Row */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {/* Set PDF Button */}
                                        <button
                                            onClick={() => handleDownloadPDF(puzzleSet.setPdfUrl, `${puzzleSet.setNumber}.pdf`)}
                                            className="py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-center font-bold hover:from-cyan-600 hover:to-blue-600 transition transform hover:scale-105 flex items-center justify-center gap-2"
                                        >
                                            <i className="fas fa-download"></i>
                                            {puzzleSet.setNumber}
                                        </button>

                                        {/* Answer PDF Button */}
                                        <button
                                            onClick={() => {
                                                setSelectedAnswer({
                                                    url: puzzleSet.answerPdfUrl,
                                                    title: `${puzzleSet.title} - Answers`,
                                                    filename: `${puzzleSet.setNumber}-Answers.pdf`
                                                });
                                                setShowAnswerModal(true);
                                            }}
                                            className="py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-center font-bold hover:from-green-600 hover:to-emerald-600 transition transform hover:scale-105 flex items-center justify-center gap-2"
                                        >
                                            <i className="fas fa-eye"></i>
                                            Ans
                                        </button>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex gap-2 justify-center flex-wrap">
                                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                                            {puzzleSet.chapter}
                                        </span>
                                        {puzzleSet.topic && (
                                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                                {puzzleSet.topic}
                                            </span>
                                        )}
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                            {puzzleSet.examType}
                                        </span>
                                    </div>

                                    {/* Difficulty Badge */}
                                    <div className="mt-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${puzzleSet.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                            puzzleSet.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                            {puzzleSet.difficulty}
                                        </span>
                                    </div>
                                </div>
                            )})}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="mt-12 glass-panel rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <i className="fas fa-lightbulb text-yellow-400"></i>
                        Why Solve Chemistry Puzzles?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400">
                        <div>
                            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <i className="fas fa-brain text-purple-400"></i>
                                Enhance Problem-Solving Skills
                            </h3>
                            <p className="text-sm">
                                Puzzles help develop critical thinking and analytical skills essential for competitive exams.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <i className="fas fa-rocket text-pink-400"></i>
                                Boost Memory & Retention
                            </h3>
                            <p className="text-sm">
                                Engaging with puzzles improves memory and helps retain complex chemistry concepts better.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <i className="fas fa-trophy text-yellow-400"></i>
                                Exam Pattern Familiarity
                            </h3>
                            <p className="text-sm">
                                Many competitive exams include puzzle-based questions to test your logical reasoning.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <i className="fas fa-smile text-green-400"></i>
                                Make Learning Fun
                            </h3>
                            <p className="text-sm">
                                Puzzles make chemistry learning enjoyable and help break the monotony of traditional study methods.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Crossword Modal */}
            {showCrosswordModal && selectedCrossword && ReactDOM.createPortal(
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
                    style={{ top: 0, left: 0, right: 0, bottom: 0, position: 'fixed' }}
                >
                    <div className="relative w-full max-w-6xl bg-gray-900 rounded-xl overflow-y-auto shadow-2xl max-h-[95vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500 to-blue-500">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <i className="fas fa-th"></i>
                                {selectedCrossword.title}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowCrosswordModal(false);
                                    setSelectedCrossword(null);
                                }}
                                className="text-white hover:bg-white/20 rounded-full p-2 transition"
                                aria-label="Close"
                            >
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>

                        {/* Iframe Container */}
                        <div className="bg-white p-4">
                            <iframe
                                src={selectedCrossword.crosswordUrl}
                                className="w-full h-[70vh] md:h-[80vh] border-4 border-gray-800 rounded-lg"
                                frameBorder="0"
                                title={selectedCrossword.title}
                                allowFullScreen
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-gray-800 flex items-center justify-between flex-wrap gap-3">
                            <div className="flex gap-2 flex-wrap">
                                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                                    {selectedCrossword.chapter}
                                </span>
                                {selectedCrossword.topic && (
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                        {selectedCrossword.topic}
                                    </span>
                                )}
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                    {selectedCrossword.examType}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    setShowCrosswordModal(false);
                                    setSelectedCrossword(null);
                                }}
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Answer PDF Modal */}
            {showAnswerModal && selectedAnswer && ReactDOM.createPortal(
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4"
                    style={{ top: 0, left: 0, right: 0, bottom: 0, position: 'fixed' }}
                    onContextMenu={(e) => e.preventDefault()}
                    onKeyDown={(e) => {
                        // Block PrintScreen, Ctrl+P, Ctrl+S, Ctrl+Shift+S
                        if (e.key === 'PrintScreen' || 
                            (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'P' || e.key === 'S'))) {
                            e.preventDefault();
                            alert('Screenshots and printing are disabled for answer sheets.');
                        }
                    }}
                    tabIndex={0}
                >
                    <div className="relative w-full max-w-6xl bg-gray-900 rounded-xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col select-none"
                        style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-emerald-500">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <i className="fas fa-file-pdf"></i>
                                {selectedAnswer.title}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowAnswerModal(false);
                                    setSelectedAnswer(null);
                                }}
                                className="text-white hover:bg-white/20 rounded-full p-2 transition"
                                aria-label="Close"
                            >
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>

                        {/* PDF Viewer Container */}
                        <div className="flex-1 bg-gray-800 p-4 overflow-auto relative select-none"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                        >
                            {/* Watermark Overlay */}
                            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-10">
                                <div className="text-white text-6xl font-bold transform -rotate-45">
                                    VIEW ONLY
                                </div>
                            </div>
                            <iframe
                                src={selectedAnswer.url}
                                className="w-full h-full min-h-[70vh] rounded-lg relative z-0"
                                frameBorder="0"
                                title={selectedAnswer.title}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-gray-800 flex items-center justify-between flex-wrap gap-3">
                            <p className="text-gray-400 text-sm">
                                <i className="fas fa-lock mr-2"></i>
                                View only - Screenshots and downloads are disabled.
                            </p>
                            <button
                                onClick={() => {
                                    setShowAnswerModal(false);
                                    setSelectedAnswer(null);
                                }}
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Puzzle;
