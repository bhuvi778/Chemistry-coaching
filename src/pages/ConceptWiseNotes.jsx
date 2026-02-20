import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ConceptWiseNotes = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const [view, setView] = useState('chapters'); // chapters, topics, concepts, concept-detail, practice
    const [allChapters, setAllChapters] = useState([]);
    const [currentChapterData, setCurrentChapterData] = useState(null);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [currentConcept, setCurrentConcept] = useState(null);
    const [practiceMode, setPracticeMode] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedConcept, setSelectedConcept] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [filterSubject, setFilterSubject] = useState('all');
    const [loading, setLoading] = useState(false);

    const [subjectPages, setSubjectPages] = useState({});
    const ITEMS_PER_PAGE = 6;

    const safeString = (value) => {
        if (typeof value === 'string') return value;
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') {
            return value.toString === Object.prototype.toString ? '' : String(value);
        }
        return String(value);
    };

    useEffect(() => {
        fetchAllChapters();
    }, []);

    const fetchAllChapters = async () => {
        try {
            setLoading(true);
            const timestamp = Date.now();
            const subjectsResponse = await fetch(`${API_URL}/concept-notes/subjects?t=${timestamp}`);
            const subjects = await subjectsResponse.json();

            const chaptersPromises = subjects.map(async (subject) => {
                const response = await fetch(`${API_URL}/concept-notes/subjects/${encodeURIComponent(subject)}/chapters?t=${timestamp}`);
                const chapters = await response.json();
                return { subject, chapters };
            });

            const chaptersData = await Promise.all(chaptersPromises);
            setAllChapters(chaptersData);
        } catch (error) {
            console.error('Error fetching chapters:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTopics = async (subject, chapterName) => {
        try {
            setLoading(true);
            setSearchQuery('');

            const response = await fetch(`${API_URL}/concept-notes/subjects/${encodeURIComponent(subject)}/chapters/${encodeURIComponent(chapterName)}?t=${Date.now()}`);
            const data = await response.json();

            setCurrentChapterData(data);
            setSelectedSubject(subject);
            setSelectedChapter(chapterName);
            setView('topics');
        } catch (error) {
            console.error('Error fetching topics:', error);
        } finally {
            setLoading(false);
        }
    };

    const openTopic = (topic) => {
        setCurrentTopic(topic);
        setSelectedTopic(topic.title);
        setView('concepts');
    };

    const openConcept = (concept) => {
        setCurrentConcept(concept);
        setSelectedConcept(concept.conceptName);
        setView('concept-detail');
    };

    const startPractice = () => {
        if (!currentConcept || !currentConcept.practiceQuestions || currentConcept.practiceQuestions.length === 0) {
            alert('No practice questions available for this concept');
            return;
        }
        setPracticeMode(true);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setShowResults(false);
        setView('practice');
    };

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionIndex]: answerIndex
        }));
    };

    const submitPractice = () => {
        setShowResults(true);
    };

    const goBack = () => {
        setSearchQuery('');
        if (view === 'practice') {
            setView('concept-detail');
            setPracticeMode(false);
        } else if (view === 'concept-detail') {
            setView('concepts');
            setCurrentConcept(null);
            setSelectedConcept('');
        } else if (view === 'concepts') {
            setView('topics');
            setCurrentTopic(null);
            setSelectedTopic('');
        } else if (view === 'topics') {
            setView('chapters');
            setCurrentChapterData(null);
            setSelectedChapter('');
            setSelectedSubject('');
            setFilterSubject('all');
        }
    };

    const getCurrentPage = (subject) => subjectPages[subject] || 1;
    const setCurrentPage = (subject, page) => {
        setSubjectPages(prev => ({ ...prev, [subject]: page }));
    };

    const getPaginatedChapters = (chapters, subject) => {
        const currentPage = getCurrentPage(subject);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return chapters.slice(startIndex, endIndex);
    };

    const getTotalPages = (chapters) => Math.ceil(chapters.length / ITEMS_PER_PAGE);

    const subjectColors = {
        'Physical Chemistry': 'from-blue-500 to-indigo-500',
        'Organic Chemistry': 'from-green-500 to-emerald-500',
        'Inorganic Chemistry': 'from-purple-500 to-pink-500',
        'General Chemistry': 'from-orange-500 to-red-500',
        'Analytical Chemistry': 'from-yellow-500 to-amber-500',
        'Biochemistry': 'from-lime-500 to-green-400'
    };

    const subjectIcons = {
        'Physical Chemistry': 'fa-atom',
        'Organic Chemistry': 'fa-leaf',
        'Inorganic Chemistry': 'fa-flask',
        'General Chemistry': 'fa-book',
        'Analytical Chemistry': 'fa-microscope',
        'Biochemistry': 'fa-dna'
    };

    const getFilteredChapters = () => {
        return allChapters.map(group => {
            if (filterSubject !== 'all' && group.subject !== filterSubject) return null;

            const matchingChapters = group.chapters.filter(ch =>
                safeString(ch.chapterName).toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (matchingChapters.length === 0 && searchQuery !== '') return null;

            return { ...group, chapters: matchingChapters };
        }).filter(Boolean);
    };

    const getFilteredTopics = () => {
        if (!currentChapterData || !currentChapterData.topics) return [];
        return currentChapterData.topics.filter(t =>
            safeString(t.title).toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const getFilteredConcepts = () => {
        if (!currentTopic || !currentTopic.concepts) return [];
        return currentTopic.concepts.filter(c =>
            safeString(c.conceptName).toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const calculateScore = () => {
        if (!currentConcept || !currentConcept.practiceQuestions) return { correct: 0, total: 0 };

        let correct = 0;
        currentConcept.practiceQuestions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correctAnswer) {
                correct++;
            }
        });

        return { correct, total: currentConcept.practiceQuestions.length };
    };

    return (
        <div className="animate-fadeIn min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-20">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                        <i className="fas fa-book-open mr-3"></i>
                        Concept Wise Notes
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Comprehensive chemistry notes organized by subjects, chapters, topics, and concepts with practice questions
                    </p>
                </div>

                {/* Breadcrumb */}
                {view !== 'chapters' && (
                    <div className="mb-6">
                        <button
                            onClick={goBack}
                            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
                        >
                            <i className="fas fa-arrow-left"></i>
                            <span>Back</span>
                        </button>
                        <div className="mt-2 text-gray-400 text-sm flex items-center gap-2 flex-wrap">
                            <i className="fas fa-map-marker-alt"></i>
                            {selectedSubject && <span>{safeString(selectedSubject)}</span>}
                            {selectedChapter && <><i className="fas fa-chevron-right text-xs"></i><span>{safeString(selectedChapter)}</span></>}
                            {selectedTopic && <><i className="fas fa-chevron-right text-xs"></i><span>{safeString(selectedTopic)}</span></>}
                            {selectedConcept && <><i className="fas fa-chevron-right text-xs"></i><span>{safeString(selectedConcept)}</span></>}
                        </div>
                    </div>
                )}

                {/* Search & Filter Bar */}
                {view !== 'concept-detail' && view !== 'practice' && (
                    <div className="glass-panel rounded-2xl p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-400 mb-2">
                                    <i className="fas fa-search mr-2 text-green-400"></i>
                                    {view === 'chapters' ? 'Search Chapter' : view === 'topics' ? 'Search Topic' : 'Search Concept'}
                                </label>
                                <input
                                    type="text"
                                    placeholder={`Search for a ${view === 'chapters' ? 'chapter' : view === 'topics' ? 'topic' : 'concept'}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-green-400 transition"
                                />
                            </div>

                            {view === 'chapters' && (
                                <div className="md:w-1/3">
                                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                                        <i className="fas fa-filter mr-2 text-blue-400"></i>
                                        Filter by Subject
                                    </label>
                                    <select
                                        value={filterSubject}
                                        onChange={(e) => setFilterSubject(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-400 transition"
                                    >
                                        <option value="all">All Subjects</option>
                                        <option value="Physical Chemistry">Physical Chemistry</option>
                                        <option value="Organic Chemistry">Organic Chemistry</option>
                                        <option value="Inorganic Chemistry">Inorganic Chemistry</option>
                                        <option value="General Chemistry">General Chemistry</option>
                                        <option value="Analytical Chemistry">Analytical Chemistry</option>
                                        <option value="Biochemistry">Biochemistry</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="text-center py-20">
                        <i className="fas fa-spinner fa-spin text-4xl text-cyan-400"></i>
                        <p className="text-gray-400 mt-4">Loading...</p>
                    </div>
                )}

                {/* Chapters View */}
                {!loading && view === 'chapters' && (
                    <div className="space-y-12">
                        {getFilteredChapters().length === 0 ? (
                            <div className="text-center py-20 glass-panel rounded-2xl">
                                <i className="fas fa-book-open text-6xl text-gray-600 mb-4"></i>
                                <h3 className="text-2xl font-bold text-white mb-2">No Notes Found</h3>
                                <p className="text-gray-400">Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            getFilteredChapters().map(({ subject, chapters }) => {
                                if (chapters.length === 0) return null;

                                const currentPage = getCurrentPage(subject);
                                const totalPages = getTotalPages(chapters);
                                const paginatedChapters = getPaginatedChapters(chapters, subject);

                                return (
                                    <div key={subject} className="space-y-4">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${subjectColors[subject] || 'from-gray-600 to-gray-700'} flex items-center justify-center`}>
                                                    <i className={`fas ${subjectIcons[subject] || 'fa-book'} text-xl text-white`}></i>
                                                </div>
                                                <h2 className="text-3xl font-bold text-white">{subject}</h2>
                                            </div>
                                            {totalPages > 1 && (
                                                <div className="text-sm text-gray-400">
                                                    Page {currentPage} of {totalPages}
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {paginatedChapters.map((chapter, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => fetchTopics(subject, chapter.chapterName)}
                                                    className="glass-panel rounded-xl overflow-hidden cursor-pointer hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition group flex flex-col h-full bg-gray-900/40 border border-gray-700/50"
                                                >
                                                    <div className="h-48 bg-gray-800/50 relative overflow-hidden">
                                                        {chapter.thumbnailUrl ? (
                                                            <img
                                                                src={chapter.thumbnailUrl}
                                                                alt={chapter.chapterName}
                                                                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                                                <i className="fas fa-book-open text-5xl text-gray-700 group-hover:text-cyan-500/50 transition"></i>
                                                            </div>
                                                        )}
                                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white border border-gray-700">
                                                            {chapter.topicCount || 0} Topics
                                                        </div>
                                                    </div>

                                                    <div className="p-5 flex-1 flex flex-col">
                                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition">{safeString(chapter.chapterName || 'Untitled Chapter')}</h3>

                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            {chapter.examType && chapter.examType !== 'All' && (
                                                                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                                                                    {chapter.examType}
                                                                </span>
                                                            )}
                                                            {chapter.badges && chapter.badges.trim() !== '' && (
                                                                <span className="px-2 py-1 bg-pink-500/20 text-pink-400 text-xs rounded-full border border-pink-500/30 font-bold animate-pulse">
                                                                    {chapter.badges}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {chapter.description && (
                                                            <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{safeString(chapter.description)}</p>
                                                        )}

                                                        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mt-auto">
                                                            <span>EXPLORE NOTES</span>
                                                            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {totalPages > 1 && (
                                            <div className="flex justify-center items-center gap-4 mt-6">
                                                <button
                                                    onClick={() => setCurrentPage(subject, Math.max(1, currentPage - 1))}
                                                    disabled={currentPage === 1}
                                                    className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === 1
                                                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                                        : 'bg-cyan-600 text-white hover:bg-cyan-500'
                                                        }`}
                                                >
                                                    <i className="fas fa-chevron-left mr-2"></i>
                                                    Previous
                                                </button>

                                                <div className="flex items-center gap-2">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                        <button
                                                            key={page}
                                                            onClick={() => setCurrentPage(subject, page)}
                                                            className={`w-10 h-10 rounded-lg font-semibold transition ${currentPage === page
                                                                ? 'bg-cyan-600 text-white'
                                                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => setCurrentPage(subject, Math.min(totalPages, currentPage + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === totalPages
                                                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                                        : 'bg-cyan-600 text-white hover:bg-cyan-500'
                                                        }`}
                                                >
                                                    Next
                                                    <i className="fas fa-chevron-right ml-2"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* Topics View */}
                {!loading && view === 'topics' && currentChapterData && (
                    <div className="glass-panel rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <i className="fas fa-list text-cyan-400"></i>
                            Topics in {safeString(currentChapterData.chapterName || 'Chapter')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getFilteredTopics().length === 0 ? (
                                <p className="text-gray-400 text-center py-10 col-span-full">
                                    {searchQuery ? `No topics match "${searchQuery}"` : 'No topics available in this chapter.'}
                                </p>
                            ) : (
                                getFilteredTopics().map((topic, index) => (
                                    <div
                                        key={index}
                                        onClick={() => openTopic(topic)}
                                        className="glass-panel rounded-lg p-4 cursor-pointer hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/30 transition">
                                                <i className="fas fa-file-alt text-teal-400 text-sm"></i>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold group-hover:text-cyan-400 transition">{safeString(topic.title || 'Untitled Topic')}</h3>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {topic.concepts?.length || 0} concepts
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Concepts View */}
                {!loading && view === 'concepts' && currentTopic && (
                    <div className="glass-panel rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <i className="fas fa-lightbulb text-yellow-400"></i>
                            Concepts in {safeString(currentTopic.title || 'Topic')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getFilteredConcepts().length === 0 ? (
                                <p className="text-gray-400 text-center py-10 col-span-full">
                                    {searchQuery ? `No concepts match "${searchQuery}"` : 'No concepts available in this topic.'}
                                </p>
                            ) : (
                                getFilteredConcepts().map((concept, index) => (
                                    <div
                                        key={index}
                                        onClick={() => openConcept(concept)}
                                        className="glass-panel rounded-lg p-5 cursor-pointer hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition group"
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/30 transition">
                                                <i className="fas fa-atom text-yellow-400"></i>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold group-hover:text-cyan-400 transition">{safeString(concept.conceptName || 'Untitled Concept')}</h3>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            {concept.images && concept.images.length > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <i className="fas fa-image text-purple-400"></i>
                                                    {concept.images.length}
                                                </span>
                                            )}
                                            {concept.practiceQuestions && concept.practiceQuestions.length > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <i className="fas fa-question-circle text-orange-400"></i>
                                                    {concept.practiceQuestions.length} Q's
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Concept Detail View */}
                {!loading && view === 'concept-detail' && currentConcept && (
                    <div className="glass-panel rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <i className="fas fa-atom text-yellow-400"></i>
                                {safeString(currentConcept.conceptName || 'Concept')}
                            </h2>
                            {currentConcept.practiceQuestions && currentConcept.practiceQuestions.length > 0 && (
                                <button
                                    onClick={startPractice}
                                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                                >
                                    <i className="fas fa-play"></i>
                                    Practice ({currentConcept.practiceQuestions.length} Questions)
                                </button>
                            )}
                        </div>

                        {/* Concept Content */}
                        <div
                            className="prose prose-invert max-w-none mb-8"
                            dangerouslySetInnerHTML={{ __html: currentConcept.content }}
                        />

                        {/* Images */}
                        {currentConcept.images && currentConcept.images.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <i className="fas fa-images text-purple-400"></i>
                                    Diagrams & Images
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {currentConcept.images.map((image, index) => (
                                        <div key={index} className="glass-panel rounded-lg overflow-hidden">
                                            <img
                                                src={image.url}
                                                alt={image.caption || `Image ${index + 1}`}
                                                className="w-full h-auto"
                                            />
                                            {image.caption && (
                                                <div className="p-3 bg-gray-800/50">
                                                    <p className="text-sm text-gray-400">{image.caption}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Practice Mode */}
                {!loading && view === 'practice' && currentConcept && currentConcept.practiceQuestions && (
                    <div className="glass-panel rounded-2xl p-8">
                        {!showResults ? (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <i className="fas fa-question-circle text-orange-400"></i>
                                        Practice Questions
                                    </h2>
                                    <span className="text-gray-400">
                                        {Object.keys(userAnswers).length} / {currentConcept.practiceQuestions.length} answered
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    {currentConcept.practiceQuestions.map((question, qIdx) => (
                                        <div key={qIdx} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
                                            <div className="flex items-start gap-3 mb-4">
                                                <span className="text-cyan-400 font-bold text-lg">Q{qIdx + 1}.</span>
                                                <div className="flex-1">
                                                    <p className="text-white text-lg">{question.question}</p>
                                                    {question.questionPdfUrl && (
                                                        <a
                                                            href={question.questionPdfUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 mt-2 text-sm text-red-400 hover:text-red-300 transition"
                                                        >
                                                            <i className="fas fa-file-pdf"></i>
                                                            View Question PDF
                                                        </a>
                                                    )}
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${question.difficulty === 'Easy' ? 'bg-green-600 text-white' :
                                                    question.difficulty === 'Medium' ? 'bg-yellow-600 text-white' :
                                                        'bg-red-600 text-white'
                                                    }`}>
                                                    {question.difficulty}
                                                </span>
                                            </div>

                                            <div className="space-y-3 ml-8">
                                                {question.options.map((option, optIdx) => (
                                                    <label
                                                        key={optIdx}
                                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${userAnswers[qIdx] === optIdx
                                                            ? 'bg-cyan-600/30 border-2 border-cyan-400'
                                                            : 'bg-gray-700/30 border-2 border-gray-600 hover:border-gray-500'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${qIdx}`}
                                                            checked={userAnswers[qIdx] === optIdx}
                                                            onChange={() => handleAnswerSelect(qIdx, optIdx)}
                                                            className="w-5 h-5"
                                                        />
                                                        <span className="text-white">{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={submitPractice}
                                        disabled={Object.keys(userAnswers).length !== currentConcept.practiceQuestions.length}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <i className="fas fa-check mr-2"></i>
                                        Submit Answers
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-4">Practice Results</h2>
                                    <div className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8">
                                        <div className="text-6xl font-bold text-white mb-2">
                                            {calculateScore().correct} / {calculateScore().total}
                                        </div>
                                        <div className="text-xl text-cyan-100">
                                            {Math.round((calculateScore().correct / calculateScore().total) * 100)}% Correct
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {currentConcept.practiceQuestions.map((question, qIdx) => {
                                        const isCorrect = userAnswers[qIdx] === question.correctAnswer;
                                        return (
                                            <div key={qIdx} className={`rounded-lg p-6 border-2 ${isCorrect ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'
                                                }`}>
                                                <div className="flex items-start gap-3 mb-4">
                                                    <span className="text-white font-bold text-lg">Q{qIdx + 1}.</span>
                                                    <div className="flex-1">
                                                        <p className="text-white text-lg">{question.question}</p>
                                                        {question.questionPdfUrl && (
                                                            <a
                                                                href={question.questionPdfUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 mt-2 text-sm text-red-400 hover:text-red-300 transition"
                                                            >
                                                                <i className="fas fa-file-pdf"></i>
                                                                View Question PDF
                                                            </a>
                                                        )}
                                                    </div>
                                                    {isCorrect ? (
                                                        <i className="fas fa-check-circle text-green-400 text-2xl"></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle text-red-400 text-2xl"></i>
                                                    )}
                                                </div>

                                                <div className="space-y-2 ml-8">
                                                    {question.options.map((option, optIdx) => (
                                                        <div
                                                            key={optIdx}
                                                            className={`p-3 rounded-lg ${optIdx === question.correctAnswer
                                                                ? 'bg-green-600/30 border-2 border-green-400'
                                                                : optIdx === userAnswers[qIdx] && !isCorrect
                                                                    ? 'bg-red-600/30 border-2 border-red-400'
                                                                    : 'bg-gray-700/30'
                                                                }`}
                                                        >
                                                            <span className="text-white">{option}</span>
                                                            {optIdx === question.correctAnswer && (
                                                                <span className="ml-2 text-green-400 font-semibold">✓ Correct</span>
                                                            )}
                                                            {optIdx === userAnswers[qIdx] && !isCorrect && (
                                                                <span className="ml-2 text-red-400 font-semibold">✗ Your Answer</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                {question.explanation && (
                                                    <div className="mt-4 ml-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                                        <p className="text-sm font-semibold text-blue-400 mb-2">Explanation:</p>
                                                        <p className="text-gray-300">{question.explanation}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 flex justify-center gap-4">
                                    <button
                                        onClick={() => {
                                            setUserAnswers({});
                                            setShowResults(false);
                                            setCurrentQuestionIndex(0);
                                        }}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-lg font-semibold transition"
                                    >
                                        <i className="fas fa-redo mr-2"></i>
                                        Try Again
                                    </button>
                                    <button
                                        onClick={() => {
                                            setView('concept-detail');
                                            setPracticeMode(false);
                                            setUserAnswers({});
                                            setShowResults(false);
                                        }}
                                        className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                                    >
                                        <i className="fas fa-book mr-2"></i>
                                        Back to Notes
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConceptWiseNotes;
