import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ConceptWiseNotes = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const [view, setView] = useState('chapters'); // chapters, topics, note
    const [allChapters, setAllChapters] = useState([]); // All chapters grouped by subject
    const [currentChapterData, setCurrentChapterData] = useState(null); // Contains topics
    const [currentNote, setCurrentNote] = useState(null);

    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedTopicTitle, setSelectedTopicTitle] = useState('');

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSubject, setFilterSubject] = useState('all');

    const [loading, setLoading] = useState(false);

    // Pagination state for each subject (2 rows = 6 items per page in 3-column grid)
    const [subjectPages, setSubjectPages] = useState({});
    const ITEMS_PER_PAGE = 6; // 2 rows × 3 columns

    // Helper function to safely convert to string
    const safeString = (value) => {
        if (typeof value === 'string') return value;
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') {
            return value.toString === Object.prototype.toString ? '' : String(value);
        }
        return String(value);
    };

    // Fetch all chapters on mount
    useEffect(() => {
        fetchAllChapters();
    }, []);

    const fetchAllChapters = async () => {
        try {
            setLoading(true);
            const timestamp = Date.now();
            // First get all subjects
            const subjectsResponse = await fetch(`${API_URL}/concept-notes/subjects?t=${timestamp}`);
            const subjects = await subjectsResponse.json();

            // Then fetch chapters for each subject
            const chaptersPromises = subjects.map(async (subject) => {
                const response = await fetch(`${API_URL}/concept-notes/subjects/${encodeURIComponent(subject)}/chapters?t=${timestamp}`);
                const chapters = await response.json();
                return { subject, chapters };
            });

            const chaptersData = await Promise.all(chaptersPromises);
            setAllChapters(chaptersData);

            // Debug: Log badge information with more details
            console.log('🔍 ===== BADGE DEBUG START =====');
            console.log('Total subject groups:', chaptersData.length);
            chaptersData.forEach(group => {
                console.log(`\n📚 Subject: ${group.subject}`);
                console.log(`   Chapters in this subject: ${group.chapters.length}`);
                group.chapters.forEach((ch, idx) => {
                    console.log(`\n   Chapter ${idx + 1}: "${ch.chapterName}"`);
                    console.log(`   - _id: ${ch._id}`);
                    console.log(`   - badges field exists: ${ch.hasOwnProperty('badges')}`);
                    console.log(`   - badges value: "${ch.badges}"`);
                    console.log(`   - badges type: ${typeof ch.badges}`);
                    console.log(`   - badges is truthy: ${!!ch.badges}`);
                    console.log(`   - badges.trim() !== '': ${ch.badges && ch.badges.trim() !== ''}`);
                    console.log(`   - WILL DISPLAY: ${ch.badges && ch.badges.trim() !== '' ? 'YES ✅' : 'NO ❌'}`);

                    // Log the entire chapter object for inspection
                    console.log(`   - Full chapter object:`, ch);
                });
            });
            console.log('\n🔍 ===== BADGE DEBUG END =====\n');
        } catch (error) {
            console.error('Error fetching chapters:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTopics = async (subject, chapterName) => {
        try {
            setLoading(true);
            // Reset filters when entering a chapter
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

    const openNote = (topic) => {
        setCurrentNote(topic);
        setSelectedTopicTitle(topic.title);
        setView('note');
    };

    const goBack = () => {
        setSearchQuery(''); // Reset search when going back
        if (view === 'note') {
            setView('topics');
            setCurrentNote(null);
            setSelectedTopicTitle('');
        } else if (view === 'topics') {
            setView('chapters');
            setCurrentChapterData(null);
            setSelectedChapter('');
            setSelectedSubject('');
            setFilterSubject('all');
        }
    };

    // Pagination helpers
    const getCurrentPage = (subject) => {
        return subjectPages[subject] || 1;
    };

    const setCurrentPage = (subject, page) => {
        setSubjectPages(prev => ({
            ...prev,
            [subject]: page
        }));
    };

    const getPaginatedChapters = (chapters, subject) => {
        const currentPage = getCurrentPage(subject);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return chapters.slice(startIndex, endIndex);
    };

    const getTotalPages = (chapters) => {
        return Math.ceil(chapters.length / ITEMS_PER_PAGE);
    };

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
            // Subject Filter
            if (filterSubject !== 'all' && group.subject !== filterSubject) return null;

            // Search Filter
            const matchingChapters = group.chapters.filter(ch =>
                safeString(ch.chapterName).toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (matchingChapters.length === 0 && searchQuery !== '') return null;

            // If search is empty, return all (or filtered by subject). 
            // If search is not empty, return only matching.
            return { ...group, chapters: matchingChapters };
        }).filter(Boolean);
    };

    const getFilteredTopics = () => {
        if (!currentChapterData || !currentChapterData.topics) return [];
        return currentChapterData.topics.filter(t =>
            safeString(t.title).toLowerCase().includes(searchQuery.toLowerCase())
        );
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
                        Comprehensive chemistry notes organized by subjects, chapters, and topics
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
                        <div className="mt-2 text-gray-400 text-sm flex items-center gap-2">
                            <i className="fas fa-map-marker-alt"></i>
                            {selectedSubject && <span>{safeString(selectedSubject)}</span>}
                            {selectedChapter && <><i className="fas fa-chevron-right text-xs"></i><span>{safeString(selectedChapter)}</span></>}
                            {selectedTopicTitle && <><i className="fas fa-chevron-right text-xs"></i><span>{safeString(selectedTopicTitle)}</span></>}
                        </div>
                    </div>
                )}

                {/* Search & Filter Bar */}
                {view !== 'note' && (
                    <div className="glass-panel rounded-2xl p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search Input */}
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-400 mb-2">
                                    <i className="fas fa-search mr-2 text-green-400"></i>
                                    {view === 'chapters' ? 'Search Chapter' : 'Search Topic'}
                                </label>
                                <input
                                    type="text"
                                    placeholder={view === 'chapters' ? "Search for a chapter..." : "Search for a topic..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-green-400 transition"
                                />
                            </div>

                            {/* Subject Filter (Only visible in Chapters view) */}
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

                {/* Chapters View - Grouped by Subject */}
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
                                        {/* Subject Header */}
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

                                        {/* Chapters Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {paginatedChapters.map((chapter, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => fetchTopics(subject, chapter.chapterName)}
                                                    className="glass-panel rounded-xl overflow-hidden cursor-pointer hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition group flex flex-col h-full bg-gray-900/40 border border-gray-700/50"
                                                >
                                                    {/* Thumbnail */}
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

                                                        {/* Tags & Badges */}
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

                                        {/* Pagination Controls Results */}
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
                                        onClick={() => openNote(topic)}
                                        className="glass-panel rounded-lg p-4 cursor-pointer hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/30 transition">
                                                <i className="fas fa-file-alt text-teal-400 text-sm"></i>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold group-hover:text-cyan-400 transition">{safeString(topic.title || 'Untitled Topic')}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Note View */}
                {!loading && view === 'note' && currentNote && (
                    <div className="glass-panel rounded-2xl p-8">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <i className="fas fa-sticky-note text-cyan-400"></i>
                            {safeString(currentNote.title || 'Note')}
                        </h2>

                        {/* Note Content */}
                        <div
                            className="prose prose-invert max-w-none mb-8"
                            dangerouslySetInnerHTML={{ __html: currentNote.content }}
                        />

                        {/* Images */}
                        {currentNote.images && currentNote.images.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-white mb-4">Diagrams & Images</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {currentNote.images.map((image, index) => (
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
            </div>
        </div>
    );
};

export default ConceptWiseNotes;
