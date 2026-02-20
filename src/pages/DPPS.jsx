import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDPPSSettings, fetchDPPSChapters } from '../services/dppsApi';
import { toast } from 'react-hot-toast';
import SubjectTabs from '../components/SubjectTabs';
import SubjectTag from '../components/SubjectTag';

const DPPS = () => {
    const navigate = useNavigate();

    const [settings, setSettings] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('11');
    const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const CHAPTERS_PER_PAGE = 9;

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        if (selectedClass && selectedDifficulty) {
            loadChapters();
        }
    }, [selectedClass, selectedDifficulty, selectedSubject]);

    const loadSettings = async () => {
        try {
            const data = await fetchDPPSSettings();
            setSettings(data);
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const loadChapters = async () => {
        try {
            setLoading(true);
            const data = await fetchDPPSChapters({
                classLevel: selectedClass,
                difficultyLevel: selectedDifficulty,
                subject: selectedSubject || undefined,
                isActive: true
            });
            setChapters(data);
        } catch (error) {
            console.error('Failed to load chapters:', error);
            toast.error('Failed to load chapters');
        } finally {
            setLoading(false);
        }
    };

    const handleClassChange = (classLevel) => {
        setSelectedClass(classLevel);
        setCurrentPage(1);
    };

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty);
        setCurrentPage(1);
    };

    const handleChapterClick = (chapterId) => {
        navigate(`/dpps/test/${chapterId}`);
    };

    // Filter chapters by search
    const filteredChapters = chapters.filter(chapter =>
        chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredChapters.length / CHAPTERS_PER_PAGE);
    const paginatedChapters = filteredChapters.slice(
        (currentPage - 1) * CHAPTERS_PER_PAGE,
        currentPage * CHAPTERS_PER_PAGE
    );

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'green';
            case 'Medium': return 'yellow';
            case 'Tough': return 'red';
            default: return 'cyan';
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Daily Practice Problem Sets
                    </h1>
                    <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                        {settings?.description || 'Master chemistry concepts through timed practice tests designed for JEE and NEET preparation'}
                    </p>
                </div>

                {/* Class Selection Pills */}
                <div className="mb-6">
                    <label className="block text-gray-400 text-sm font-semibold mb-3">Select Class:</label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleClassChange('11')}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedClass === '11'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                                }`}
                        >
                            <i className="fas fa-graduation-cap mr-2"></i>
                            Class 11th
                        </button>
                        <button
                            onClick={() => handleClassChange('12')}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedClass === '12'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                                }`}
                        >
                            <i className="fas fa-graduation-cap mr-2"></i>
                            Class 12th
                        </button>
                    </div>
                </div>

                {/* Difficulty Selection Pills */}
                <div className="mb-8">
                    <label className="block text-gray-400 text-sm font-semibold mb-3">Select Difficulty Level:</label>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => handleDifficultyChange('Easy')}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedDifficulty === 'Easy'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                                }`}
                        >
                            <i className="fas fa-signal mr-2"></i>
                            Easy
                        </button>
                        <button
                            onClick={() => handleDifficultyChange('Medium')}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedDifficulty === 'Medium'
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                                }`}
                        >
                            <i className="fas fa-signal mr-2"></i>
                            Medium
                        </button>
                        <button
                            onClick={() => handleDifficultyChange('Tough')}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedDifficulty === 'Tough'
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                                }`}
                        >
                            <i className="fas fa-signal mr-2"></i>
                            Tough
                        </button>
                    </div>
                </div>

                {/* Subject Filter Tabs */}
                <SubjectTabs
                    selectedSubject={selectedSubject}
                    onSubjectChange={setSelectedSubject}
                    showAll={true}
                />

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search chapters..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800 text-white px-4 py-3 pl-12 rounded-lg border border-gray-700 focus:border-cyan-500 outline-none"
                        />
                        <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                        <p className="text-gray-400">Loading chapters...</p>
                    </div>
                )}

                {/* Chapters Grid */}
                {!loading && (
                    <>
                        {paginatedChapters.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {paginatedChapters.map((chapter) => {
                                    const color = getDifficultyColor(chapter.difficultyLevel);

                                    return (
                                        <div
                                            key={chapter._id}
                                            onClick={() => handleChapterClick(chapter._id)}
                                            className="glass-panel rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer group"
                                        >
                                            {/* Chapter Icon & Title */}
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className={`w-16 h-16 rounded-xl bg-${color}-500/20 flex items-center justify-center text-${color}-400 text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                                    <i className={`fas ${chapter.icon || 'fa-book'}`}></i>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition">
                                                        {chapter.name}
                                                    </h3>
                                                    {chapter.description && (
                                                        <p className="text-sm text-gray-400 line-clamp-2">
                                                            {chapter.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Chapter Info */}
                                            <div className="space-y-2 mb-4">
                                                {chapter.subject && (
                                                    <div className="mb-2">
                                                        <SubjectTag subject={chapter.subject} size="md" />
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-400">
                                                        <i className="fas fa-graduation-cap mr-2"></i>
                                                        Class {chapter.classLevel}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${color}-500/20 text-${color}-400`}>
                                                        {chapter.difficultyLevel}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-400">
                                                        <i className="fas fa-clock mr-2"></i>
                                                        {chapter.timeLimit || 60} minutes
                                                    </span>
                                                    <span className="text-gray-400">
                                                        <i className="fas fa-question-circle mr-2"></i>
                                                        {chapter.questionCount || 0} questions
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Progress Bar (if available) */}
                                            {chapter.progress !== undefined && (
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                                        <span>Progress</span>
                                                        <span>{chapter.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className={`bg-gradient-to-r from-${color}-500 to-${color}-400 h-2 rounded-full transition-all`}
                                                            style={{ width: `${chapter.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Start Test Button */}
                                            <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all transform group-hover:scale-105">
                                                <i className="fas fa-play mr-2"></i>
                                                Start DPPs
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <i className="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
                                <p className="text-gray-400 text-lg">
                                    No chapters found for Class {selectedClass} - {selectedDifficulty}
                                </p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Try selecting a different class or difficulty level
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>

                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === index + 1
                                            ? 'bg-cyan-500 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DPPS;
