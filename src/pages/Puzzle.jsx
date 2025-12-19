import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Puzzle = () => {
    const { studyMaterials } = useData();
    const [selectedExam, setSelectedExam] = useState('all');
    const [crosswords, setCrosswords] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    // Filter only puzzle materials
    const puzzleMaterials = studyMaterials.filter(material => {
        const categoryMatch = material.category === 'Puzzle';
        const examMatch = selectedExam === 'all' || material.examType === selectedExam;
        return categoryMatch && examMatch;
    });

    // Fetch crosswords
    useEffect(() => {
        fetchCrosswords();
    }, []);

    const fetchCrosswords = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/crosswords`);
            const data = await response.json();
            setCrosswords(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching crosswords:', error);
            setLoading(false);
        }
    };

    // Search crossword answers
    const searchAnswers = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/crossword-answers/search?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching answers:', error);
        } finally {
            setSearching(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            searchAnswers(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Filter crosswords
    const filteredCrosswords = crosswords.filter(crossword => {
        const examMatch = selectedExam === 'all' || crossword.examType === selectedExam;
        const chapterMatch = selectedChapter === 'all' || crossword.chapter === selectedChapter;
        return examMatch && chapterMatch;
    });

    // Get unique chapters
    const chapters = ['all', ...new Set(crosswords.map(c => c.chapter))];

    return (
        <div className="animate-fadeIn min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="flex items-center mb-8">
                    <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        <i className="fas fa-puzzle-piece mr-3"></i>
                        Chemistry Puzzles
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Challenge your mind with interactive crosswords and downloadable puzzles
                    </p>
                </div>

                {/* Filter Section */}
                <div className="glass-panel rounded-2xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <i className="fas fa-filter text-purple-400"></i>
                        Filter Puzzles
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Exam Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-3">
                                <i className="fas fa-graduation-cap mr-2 text-purple-400"></i>
                                Filter by Exam
                            </label>
                            <select
                                value={selectedExam}
                                onChange={(e) => setSelectedExam(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-purple-400 transition"
                            >
                                <option value="all">All Exams</option>
                                <optgroup label="Engineering Entrance">
                                    <option value="JEE">JEE (Main & Advanced)</option>
                                    <option value="GATE">GATE</option>
                                </optgroup>
                                <optgroup label="Medical Entrance">
                                    <option value="NEET">NEET</option>
                                    <option value="AIIMS">AIIMS</option>
                                </optgroup>
                                <optgroup label="Science Entrance">
                                    <option value="IAT">IAT (IISER Aptitude Test)</option>
                                    <option value="NEST">NEST (National Entrance Screening Test)</option>
                                    <option value="KVPY">KVPY (Kishore Vaigyanik Protsahan Yojana)</option>
                                    <option value="TIFR">TIFR (Tata Institute)</option>
                                </optgroup>
                                <optgroup label="Post Graduate">
                                    <option value="CSIR NET">CSIR NET</option>
                                    <option value="IIT JAM">IIT JAM</option>
                                </optgroup>
                                <optgroup label="Other Competitive">
                                    <option value="OLYMPIAD">Olympiad (Chemistry/Physics/Math)</option>
                                    <option value="CUET">CUET (Common University Entrance Test)</option>
                                </optgroup>
                                <optgroup label="School Level">
                                    <option value="BOARDS">Board Exams (CBSE/State - 11th/12th)</option>
                                </optgroup>
                            </select>
                        </div>

                        {/* Chapter Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-3">
                                <i className="fas fa-book mr-2 text-cyan-400"></i>
                                Filter by Chapter
                            </label>
                            <select
                                value={selectedChapter}
                                onChange={(e) => setSelectedChapter(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-cyan-400 transition"
                            >
                                {chapters.map(chapter => (
                                    <option key={chapter} value={chapter}>
                                        {chapter === 'all' ? 'All Chapters' : chapter}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(selectedExam !== 'all' || selectedChapter !== 'all') && (
                        <div className="mt-4 flex items-center gap-3 flex-wrap">
                            <span className="text-sm text-gray-400">Active filters:</span>
                            {selectedExam !== 'all' && (
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-2">
                                    {selectedExam}
                                    <button onClick={() => setSelectedExam('all')} className="hover:text-white">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </span>
                            )}
                            {selectedChapter !== 'all' && (
                                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm flex items-center gap-2">
                                    {selectedChapter}
                                    <button onClick={() => setSelectedChapter('all')} className="hover:text-white">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* ==================== CROSSWORDS SECTION ==================== */}
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
                            <p className="text-gray-400">Loading crosswords...</p>
                        </div>
                    ) : filteredCrosswords.length === 0 ? (
                        <div className="text-center py-20 glass-panel rounded-2xl">
                            <i className="fas fa-th text-6xl text-gray-600 mb-4"></i>
                            <h3 className="text-2xl font-bold text-white mb-2">No Crosswords Found</h3>
                            <p className="text-gray-400">
                                {selectedExam !== 'all' || selectedChapter !== 'all'
                                    ? 'Try changing your filters'
                                    : 'Interactive crosswords will be available soon!'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCrosswords.map((crossword) => (
                                <div key={crossword._id} className="glass-panel rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 group">
                                    {crossword.thumbnailUrl && (
                                        <div className="w-full h-48 overflow-hidden relative bg-gradient-to-br from-cyan-900/40 to-blue-900/40">
                                            <img
                                                src={crossword.thumbnailUrl}
                                                alt={crossword.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute top-4 right-4">
                                                <span className="px-3 py-1 bg-cyan-500/90 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                                                    <i className="fas fa-th mr-1"></i>
                                                    Crossword
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-bold text-white flex-1">{crossword.title}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${crossword.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                crossword.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {crossword.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-4">{crossword.description}</p>
                                        <div className="flex gap-2 mb-4 flex-wrap">
                                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                                                <i className="fas fa-book mr-1"></i>
                                                {crossword.chapter}
                                            </span>
                                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                                <i className="fas fa-graduation-cap mr-1"></i>
                                                {crossword.examType}
                                            </span>
                                            {crossword.topic && (
                                                <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs">
                                                    <i className="fas fa-tag mr-1"></i>
                                                    {crossword.topic}
                                                </span>
                                            )}
                                        </div>
                                        <a
                                            href={crossword.crosswordUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition font-semibold"
                                        >
                                            <i className="fas fa-play"></i>
                                            Play Crossword
                                            <i className="fas fa-external-link-alt text-xs"></i>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                {/* ==================== CROSSWORD ANSWERS SEARCH SECTION ==================== */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-6">
                        <i className="fas fa-search text-green-400"></i>
                        Search Crossword Answers
                    </h2>

                    {/* Statistics - Compact Design */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="glass-panel rounded-lg p-4 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-question text-white text-xl"></i>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Total Questions</p>
                                <p className="text-white text-2xl font-bold">{searchResults.length > 0 ? searchResults.length : '0'}</p>
                            </div>
                        </div>

                        <div className="glass-panel rounded-lg p-4 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-check-circle text-white text-xl"></i>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Answered Questions</p>
                                <p className="text-white text-2xl font-bold">{searchResults.length > 0 ? searchResults.length : '0'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="glass-panel rounded-lg p-4 mb-6 flex items-center gap-3">
                        <i className="fas fa-search text-gray-400 text-xl"></i>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your question here..."
                            className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:outline-none"
                        />
                        {searching && (
                            <i className="fas fa-spinner fa-spin text-green-400"></i>
                        )}
                    </div>

                    {/* Questions List - Simple Design */}
                    {searchQuery && searchResults.length > 0 && (
                        <div className="space-y-4">
                            {searchResults.map((result, index) => (
                                <div key={result._id} className="glass-panel rounded-lg p-5 hover:border-green-400 border border-transparent transition">
                                    <div className="flex items-start gap-4">
                                        {/* Question Number Icon */}
                                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                            <i className="fas fa-question text-cyan-400"></i>
                                        </div>

                                        {/* Question and Answer */}
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold mb-2">{result.word}</h3>
                                            <p className="text-gray-400 text-sm mb-3">{result.answer}</p>

                                            {/* Meta Info */}
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span>Asked by {result.crosswordSetName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {searchQuery && !searching && searchResults.length === 0 && (
                        <div className="text-center py-10 glass-panel rounded-lg">
                            <i className="fas fa-search text-4xl text-gray-600 mb-3"></i>
                            <p className="text-gray-400">No answers found for "{searchQuery}"</p>
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
        </div>
    );
};

export default Puzzle;
