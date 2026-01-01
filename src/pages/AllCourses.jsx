import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CourseCard from '../components/UI/CourseCard';
import { useData } from '../context/DataContext';


const AllCourses = () => {
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [activeCategory, setActiveCategory] = useState(categoryParam || 'all'); // New category filter (Live Batch, Recorded, etc.)
    const [activeExam, setActiveExam] = useState('all'); // Old exam filter (JEE, NEET, Foundation)
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 6;
    const { courses } = useData();

    // Update active category when URL parameter changes
    useEffect(() => {
        if (categoryParam) {
            setActiveCategory(categoryParam);
        }
    }, [categoryParam]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, activeExam]);

    // Filter by both category and exam
    const filteredCourses = (Array.isArray(courses) ? courses : []).filter(course => {
        const categoryMatch = activeCategory === 'all' ||
            (course.categories && course.categories.includes(activeCategory));

        // Handle exam match with normalization for hyphenated values (e.g., 'csir-net' matches 'CSIR NET')
        const normalizeExam = (exam) => exam.toLowerCase().replace(/\s+/g, '-');
        const examMatch = activeExam === 'all' ||
            (course.category && normalizeExam(course.category) === normalizeExam(activeExam));

        return categoryMatch && examMatch;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getCategoryClass = (category) => {
        const isActive = activeCategory === category;
        return `group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 cursor-pointer ${isActive
            ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-[0_8px_30px_rgba(6,182,212,0.4)] scale-[1.02] border border-cyan-400/50'
            : 'bg-gray-800/40 text-gray-400 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white hover:shadow-lg hover:scale-[1.01] border border-transparent hover:border-gray-600'
            }`;
    };

    const getExamClass = (exam) => {
        const isActive = activeExam === exam;
        return `group px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${isActive
            ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white shadow-[0_8px_30px_rgba(236,72,153,0.5)] scale-105 border-2 border-pink-400/50'
            : 'bg-gray-800/50 text-gray-400 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white hover:shadow-lg hover:scale-[1.02] border-2 border-gray-700 hover:border-pink-400/30'
            }`;
    };

    return (
        <div className="animate-fadeIn">
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="flex items-center mb-8">
                    <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                        All Programs & Services
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Choose from our comprehensive range of learning solutions tailored to your needs - from live classes to personalized mentorship.
                    </p>
                </div>

                {/* Horizontal Exam Tabs */}
                <div className="mb-10">
                    <div className="glass-panel rounded-2xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <i className="fas fa-graduation-cap text-pink-400"></i>
                                Select Your Exam
                            </h3>
                            <span className="text-sm text-gray-400 hidden sm:block">
                                {activeExam === 'all' ? 'All Exams' : activeExam.toUpperCase()}
                            </span>
                        </div>
                        <div className="overflow-x-auto pb-2 scrollbar-hide">
                            <div className="flex gap-3 min-w-max lg:min-w-0 lg:flex-wrap lg:justify-start">
                                <button onClick={() => setActiveExam('all')} className={getExamClass('all')}>
                                    <i className="fas fa-th-large mr-2"></i>
                                    All Exams
                                </button>
                                <button onClick={() => setActiveExam('jee')} className={getExamClass('jee')}>
                                    <i className="fas fa-atom mr-2"></i>
                                    JEE
                                </button>
                                <button onClick={() => setActiveExam('neet')} className={getExamClass('neet')}>
                                    <i className="fas fa-heartbeat mr-2"></i>
                                    NEET
                                </button>
                                <button onClick={() => setActiveExam('iat')} className={getExamClass('iat')}>
                                    <i className="fas fa-flask mr-2"></i>
                                    IAT
                                </button>
                                <button onClick={() => setActiveExam('nest')} className={getExamClass('nest')}>
                                    <i className="fas fa-microscope mr-2"></i>
                                    NEST
                                </button>
                                <button onClick={() => setActiveExam('csir-net')} className={getExamClass('csir-net')}>
                                    <i className="fas fa-graduation-cap mr-2"></i>
                                    CSIR NET
                                </button>
                                <button onClick={() => setActiveExam('gate')} className={getExamClass('gate')}>
                                    <i className="fas fa-door-open mr-2"></i>
                                    GATE
                                </button>
                                <button onClick={() => setActiveExam('iit-jam')} className={getExamClass('iit-jam')}>
                                    <i className="fas fa-university mr-2"></i>
                                    IIT JAM
                                </button>
                                <button onClick={() => setActiveExam('tifr')} className={getExamClass('tifr')}>
                                    <i className="fas fa-atom mr-2"></i>
                                    TIFR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Category Filter */}
                <div className="lg:hidden w-full mb-8">
                    <div className="glass-panel rounded-xl p-4 border border-gray-700/50">
                        <label className="block text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                            <i className="fas fa-filter text-cyan-400"></i>
                            Filter by Program Type
                        </label>
                        <select
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value)}
                            className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all font-medium"
                        >
                            <option value="all">📚 All Programs</option>
                            <option value="live-batch">🎥 Live Batch</option>
                            <option value="recorded">▶️ Recorded Courses</option>
                            <option value="1-1-tutoring">👥 1-1 Tutoring</option>
                            <option value="mentorship">👨‍🏫 Mentorship</option>
                            <option value="doubt-solver">❓ Doubt Solver</option>
                            <option value="test-series">📝 Test Series</option>
                            <option value="focus-test-series">🎯 Focus Test Series</option>
                        </select>
                    </div>
                </div>

                {/* Main Content: Sidebar + Courses Grid */}
                <div className="flex gap-6">\n                {/* Left Sidebar - Vertical Category Tabs */}
                    <div className="w-72 flex-shrink-0 hidden lg:block">
                        <div className="glass-panel rounded-2xl p-6 sticky top-24 border border-gray-700/50">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                                    <i className="fas fa-filter text-cyan-400"></i>
                                    Program Type
                                </h3>
                                <p className="text-xs text-gray-500">Filter courses by category</p>
                            </div>
                            <div className="space-y-2.5">
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className={getCategoryClass('all')}
                                >
                                    <i className="fas fa-th-large text-xl w-6"></i>
                                    <span className="font-semibold">All Programs</span>
                                </button>
                                <button
                                    onClick={() => setActiveCategory('live-batch')}
                                    className={getCategoryClass('live-batch')}
                                >
                                    <i className="fas fa-video text-xl w-6"></i>
                                    <span className="font-semibold">Live Batch</span>
                                </button>
                                <button
                                    onClick={() => setActiveCategory('recorded')}
                                    className={getCategoryClass('recorded')}
                                >
                                    <i className="fas fa-play-circle text-xl w-6"></i>
                                    <span className="font-semibold">Recorded Courses</span>
                                </button>
                                <button
                                    onClick={() => setActiveCategory('1-1-tutoring')}
                                    className={getCategoryClass('1-1-tutoring')}
                                >
                                    <i className="fas fa-user-friends text-xl w-6"></i>
                                    <span className="font-semibold">1-1 Tutoring</span>
                                </button>
                                <button
                                    onClick={() => setActiveCategory('mentorship')}
                                    className={getCategoryClass('mentorship')}
                                >
                                    <i className="fas fa-chalkboard-teacher text-xl w-6"></i>
                                    <span className="font-semibold">Mentorship</span>
                                </button>
                                <button
                                    onClick={() => setActiveCategory('doubt-solver')}
                                    className={getCategoryClass('doubt-solver')}
                                >
                                    <i className="fas fa-question-circle text-xl w-6"></i>
                                    <span className="font-semibold">Doubt Solver</span>
                                </button>
                                <button
                                    onClick={() => setActiveCategory('test-series')}
                                    className={getCategoryClass('test-series')}
                                >
                                    <i className="fas fa-clipboard-check text-xl w-6"></i>
                                    <span className="font-semibold">Test Series</span>
                                </button>
                                <button
                                    onClick={() => setActiveCategory('focus-test-series')}
                                    className={getCategoryClass('focus-test-series')}
                                >
                                    <i className="fas fa-bullseye text-xl w-6"></i>
                                    <span className="font-semibold">Focus Test Series</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Courses Grid */}
                    <div className="flex-1 w-full lg:w-auto">
                        {filteredCourses.length === 0 ? (
                            <div className="text-center py-20 glass-panel rounded-2xl">
                                <i className="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
                                <h3 className="text-2xl font-bold text-white mb-2">No Courses Found</h3>
                                <p className="text-gray-400">Try selecting different filters</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 flex justify-between items-center">
                                    <div className="text-gray-400">
                                        <i className="fas fa-graduation-cap mr-2"></i>
                                        Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
                                    </div>
                                    {totalPages > 1 && (
                                        <div className="text-gray-400 text-sm">
                                            Page {currentPage} of {totalPages}
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {currentCourses.map(course => (
                                        <CourseCard key={course._id} course={course} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="mt-10 flex justify-center items-center gap-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === 1
                                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                                                }`}
                                        >
                                            <i className="fas fa-chevron-left mr-2"></i>
                                            Previous
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex gap-2">
                                            {[...Array(totalPages)].map((_, index) => {
                                                const pageNumber = index + 1;
                                                // Show first page, last page, current page, and pages around current
                                                if (
                                                    pageNumber === 1 ||
                                                    pageNumber === totalPages ||
                                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => paginate(pageNumber)}
                                                            className={`w-10 h-10 rounded-lg font-bold transition ${currentPage === pageNumber
                                                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]'
                                                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                                                }`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                } else if (
                                                    pageNumber === currentPage - 2 ||
                                                    pageNumber === currentPage + 2
                                                ) {
                                                    return <span key={pageNumber} className="text-gray-600 px-2">...</span>;
                                                }
                                                return null;
                                            })}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === totalPages
                                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                                                }`}
                                        >
                                            Next
                                            <i className="fas fa-chevron-right ml-2"></i>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Focus Test Series Section */}
                <div className="mt-16 mb-8">
                    <div className="glass-panel rounded-2xl p-8 border border-cyan-500/30">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <i className="fas fa-clipboard-check text-3xl text-white"></i>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">Focus Test Series</h3>
                                    <p className="text-gray-400">Practice with our comprehensive test series platform</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <a
                                    href="https://candidatea.speedexam.net/register.aspx?site=ace2examz"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition transform hover:scale-105"
                                >
                                    <i className="fas fa-user-plus mr-2"></i>
                                    Register
                                </a>
                                <a
                                    href="https://candidate.speedexam.net/signin.aspx?site=ace2examz"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-3 border-2 border-cyan-400 text-cyan-400 font-bold rounded-lg hover:bg-cyan-400 hover:text-black transition"
                                >
                                    <i className="fas fa-sign-in-alt mr-2"></i>
                                    Login
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score Match Batch Section */}
                <div className="mt-16 mb-8">
                    <div className="glass-panel rounded-2xl p-8 border border-amber-500/30">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
                                <i className="fas fa-trophy text-4xl text-white"></i>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">Score Match Batch</h3>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Join our specialized batches designed to match your target score with expert guidance and personalized learning paths
                            </p>
                        </div>

                        {/* Filters */}
                        <ScoreMatchBatchFilters />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Score Match Batch Filters Component
const ScoreMatchBatchFilters = () => {
    const { scoreMatchBatches } = useData();
    const [selectedExam, setSelectedExam] = useState('all');
    const [selectedBatchType, setSelectedBatchType] = useState('all');

    // Filter batches
    const filteredBatches = (Array.isArray(scoreMatchBatches) ? scoreMatchBatches : []).filter(batch => {
        const examMatch = selectedExam === 'all' || batch.exam === selectedExam;
        const batchTypeMatch = selectedBatchType === 'all' || batch.batchType === selectedBatchType;
        return examMatch && batchTypeMatch;
    });

    const getFilterClass = (isActive) => {
        return `px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${isActive
            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-[0_8px_30px_rgba(251,146,60,0.5)] scale-105 border-2 border-amber-400/50'
            : 'bg-gray-800/50 text-gray-400 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white hover:shadow-lg hover:scale-[1.02] border-2 border-gray-700 hover:border-amber-400/30'
            }`;
    };

    return (
        <>
            {/* Exam Filter */}
            <div className="mb-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-graduation-cap text-amber-400"></i>
                    Filter by Exam
                </h4>
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => setSelectedExam('all')} className={getFilterClass(selectedExam === 'all')}>
                        <i className="fas fa-th-large mr-2"></i>All Exams
                    </button>
                    <button onClick={() => setSelectedExam('JEE')} className={getFilterClass(selectedExam === 'JEE')}>
                        <i className="fas fa-atom mr-2"></i>JEE
                    </button>
                    <button onClick={() => setSelectedExam('NEET')} className={getFilterClass(selectedExam === 'NEET')}>
                        <i className="fas fa-heartbeat mr-2"></i>NEET
                    </button>
                    <button onClick={() => setSelectedExam('IAT')} className={getFilterClass(selectedExam === 'IAT')}>
                        <i className="fas fa-flask mr-2"></i>IAT
                    </button>
                    <button onClick={() => setSelectedExam('NEST')} className={getFilterClass(selectedExam === 'NEST')}>
                        <i className="fas fa-microscope mr-2"></i>NEST
                    </button>
                    <button onClick={() => setSelectedExam('CSIR NET')} className={getFilterClass(selectedExam === 'CSIR NET')}>
                        <i className="fas fa-graduation-cap mr-2"></i>CSIR NET
                    </button>
                    <button onClick={() => setSelectedExam('GATE')} className={getFilterClass(selectedExam === 'GATE')}>
                        <i className="fas fa-door-open mr-2"></i>GATE
                    </button>
                    <button onClick={() => setSelectedExam('IIT JAM')} className={getFilterClass(selectedExam === 'IIT JAM')}>
                        <i className="fas fa-university mr-2"></i>IIT JAM
                    </button>
                    <button onClick={() => setSelectedExam('TIFR')} className={getFilterClass(selectedExam === 'TIFR')}>
                        <i className="fas fa-atom mr-2"></i>TIFR
                    </button>
                </div>
            </div>

            {/* Batch Type Filter */}
            <div className="mb-8">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-layer-group text-amber-400"></i>
                    Filter by Batch Type
                </h4>
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => setSelectedBatchType('all')} className={getFilterClass(selectedBatchType === 'all')}>
                        <i className="fas fa-th-large mr-2"></i>All Types
                    </button>
                    <button onClick={() => setSelectedBatchType('Regular')} className={getFilterClass(selectedBatchType === 'Regular')}>
                        <i className="fas fa-calendar-alt mr-2"></i>Regular
                    </button>
                    <button onClick={() => setSelectedBatchType('Crash Course')} className={getFilterClass(selectedBatchType === 'Crash Course')}>
                        <i className="fas fa-bolt mr-2"></i>Crash Course
                    </button>
                    <button onClick={() => setSelectedBatchType('Weekend')} className={getFilterClass(selectedBatchType === 'Weekend')}>
                        <i className="fas fa-calendar-week mr-2"></i>Weekend
                    </button>
                    <button onClick={() => setSelectedBatchType('Fast Track')} className={getFilterClass(selectedBatchType === 'Fast Track')}>
                        <i className="fas fa-rocket mr-2"></i>Fast Track
                    </button>
                    <button onClick={() => setSelectedBatchType('Intensive')} className={getFilterClass(selectedBatchType === 'Intensive')}>
                        <i className="fas fa-fire mr-2"></i>Intensive
                    </button>
                </div>
            </div>

            {/* Batches Display */}
            {filteredBatches.length === 0 ? (
                <div className="text-center py-12">
                    <i className="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
                    <h3 className="text-xl font-bold text-white mb-2">No Batches Found</h3>
                    <p className="text-gray-400">Try selecting different filters</p>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-gray-400 text-center">
                        <i className="fas fa-trophy mr-2"></i>
                        Showing {filteredBatches.length} {filteredBatches.length === 1 ? 'batch' : 'batches'}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBatches.map(batch => (
                            <div key={batch._id} className="glass-panel rounded-xl p-6 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,146,60,0.3)] group">
                                {batch.badge && (
                                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full mb-3">
                                        {batch.badge}
                                    </div>
                                )}
                                <div className={`w-14 h-14 bg-gradient-to-r from-${batch.color}-500 to-${batch.color}-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <i className={`fas ${batch.icon} text-2xl text-white`}></i>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">{batch.title}</h4>
                                {batch.subtitle && (
                                    <p className="text-sm text-gray-400 mb-3">{batch.subtitle}</p>
                                )}
                                <p className="text-gray-300 mb-4 text-sm line-clamp-3">{batch.desc}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <i className="fas fa-graduation-cap text-amber-400"></i>
                                        <span>{batch.exam}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <i className="fas fa-layer-group text-amber-400"></i>
                                        <span>{batch.batchType}</span>
                                    </div>
                                    {batch.duration && (
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <i className="fas fa-clock text-amber-400"></i>
                                            <span>{batch.duration}</span>
                                        </div>
                                    )}
                                    {batch.startDate && (
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <i className="fas fa-calendar text-amber-400"></i>
                                            <span>Starts: {batch.startDate}</span>
                                        </div>
                                    )}
                                    {batch.price && (
                                        <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                                            <i className="fas fa-rupee-sign"></i>
                                            <span>{batch.price}</span>
                                        </div>
                                    )}
                                </div>

                                {batch.features && batch.features.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">KEY FEATURES:</p>
                                        <ul className="space-y-1">
                                            {batch.features.slice(0, 3).map((feature, idx) => (
                                                <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                                                    <i className="fas fa-check-circle text-amber-400 mt-0.5"></i>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {batch.enrollmentLink && (
                                    <a
                                        href={batch.enrollmentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.5)] transition transform hover:scale-105"
                                    >
                                        <i className="fas fa-user-plus mr-2"></i>
                                        Enroll Now
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default AllCourses;