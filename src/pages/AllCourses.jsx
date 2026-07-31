import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import EnquiryModal from '../components/UI/EnquiryModal';

// Robust dynamic endpoint configuration for local development and production
const LMS_API_URL = import.meta.env.VITE_LMS_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : 'https://app.ace2examz.com/api');

const AllCourses = () => {
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
    const [activeExam, setActiveExam] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Enquiry modal state
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
    const [selectedCourseForEnquiry, setSelectedCourseForEnquiry] = useState(null);

    const coursesPerPage = 6;

    // Fetch LMS courses on mount
    useEffect(() => {
        const fetchLmsCourses = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${LMS_API_URL}/courses/public`);
                setCourses(response.data || []);
            } catch (error) {
                console.error('Error fetching LMS courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLmsCourses();
    }, []);

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

    // Normalize string for robust matching
    const normalizeString = (str) => (str || '').toLowerCase().replace(/[\s-._]+/g, '');

    // Filter by both category (Live/Recorded/Test Series) and exam (JEE/NEET/Class 9-10)
    const filteredCourses = courses.filter(course => {
        // 1. Program Type / Category Filter
        const courseTypeNormalized = normalizeString(course.courseType);
        const categoryMatch = activeCategory === 'all' ||
            (activeCategory === 'live-batch' && (courseTypeNormalized === 'live' || courseTypeNormalized === 'livebatch' || courseTypeNormalized === 'hybrid')) ||
            (activeCategory === 'recorded' && courseTypeNormalized === 'recorded') ||
            (activeCategory === 'test-series' && (courseTypeNormalized === 'testseries' || courseTypeNormalized === 'test-series' || courseTypeNormalized === 'focus-test-series' || courseTypeNormalized === 'focustestseries'));

        // 2. Exam Category Filter
        let examMatch = activeExam === 'all';
        if (!examMatch) {
            if (activeExam === 'class-9-10') {
                const titleNormalized = normalizeString(course.title);
                const categoryNormalized = course.category ? normalizeString(course.category) : '';
                const examNormalized = course.exam ? normalizeString(course.exam) : '';
                examMatch = titleNormalized.includes('class9') || titleNormalized.includes('class10') ||
                            titleNormalized.includes('grade9') || titleNormalized.includes('grade10') ||
                            categoryNormalized.includes('class9') || categoryNormalized.includes('class10') ||
                            examNormalized.includes('class9') || examNormalized.includes('class10');
            } else {
                const searchKey = normalizeString(activeExam);
                const titleNormalized = normalizeString(course.title);
                const categoryNormalized = course.category ? normalizeString(course.category) : '';
                const examNormalized = course.exam ? normalizeString(course.exam) : '';
                examMatch = titleNormalized.includes(searchKey) ||
                            categoryNormalized.includes(searchKey) ||
                            examNormalized.includes(searchKey);
            }
        }

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

    // Helper to dynamically assign modern styles & icons based on title hash for rich aesthetics
    const getCourseStyling = (title) => {
        const colors = [
            { text: 'text-cyan-400', border: 'border-cyan-400', bg: 'bg-cyan-500/10', shadow: 'hover:shadow-cyan-500/30' },
            { text: 'text-pink-500', border: 'border-pink-500', bg: 'bg-pink-500/10', shadow: 'hover:shadow-pink-500/30' },
            { text: 'text-purple-500', border: 'border-purple-500', bg: 'bg-purple-500/10', shadow: 'hover:shadow-purple-500/30' },
            { text: 'text-amber-500', border: 'border-amber-500', bg: 'bg-amber-500/10', shadow: 'hover:shadow-amber-500/30' },
            { text: 'text-green-500', border: 'border-green-500', bg: 'bg-green-500/10', shadow: 'hover:shadow-green-500/30' }
        ];
        
        const safeTitle = title || 'Course';
        let hash = 0;
        for (let i = 0; i < safeTitle.length; i++) {
            hash = safeTitle.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        const style = colors[index] || colors[0];

        // Dynamically choose relevant FontAwesome icon
        let icon = 'fa-graduation-cap';
        const titleLower = safeTitle.toLowerCase();
        if (titleLower.includes('physics')) icon = 'fa-atom';
        else if (titleLower.includes('chemistry') || titleLower.includes('hydrogen')) icon = 'fa-flask';
        else if (titleLower.includes('biology')) icon = 'fa-heartbeat';
        else if (titleLower.includes('math')) icon = 'fa-calculator';
        else if (titleLower.includes('test') || titleLower.includes('mock')) icon = 'fa-clipboard-check';
        else if (titleLower.includes('batch') || titleLower.includes('score')) icon = 'fa-trophy';

        return { ...style, icon };
    };

    const handleBuyNowRedirect = () => {
        window.location.href = 'https://app.ace2examz.com/login';
    };

    const triggerEnquiryModal = (course) => {
        setSelectedCourseForEnquiry({
            _id: course._id || course.slug,
            title: course.title,
            category: course.exam || course.category || 'Class 9-10'
        });
        setIsEnquiryOpen(true);
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
                    <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
                        Courses
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Access high-yield chemistry courses fetched dynamically from your learning portal. Start mastering concepts with customized programs.
                    </p>
                </div>

                {/* Horizontal Exam Tabs */}
                <div className="mb-10">
                    <div className="glass-panel rounded-2xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <i className="fas fa-graduation-cap text-pink-400"></i>
                                Select Your Exam / Category
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
                                <button onClick={() => setActiveExam('class-9-10')} className={getExamClass('class-9-10')}>
                                    <i className="fas fa-school mr-2"></i>
                                    Class 9-10
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
                            <option value="live-batch">🎥 Live/Hybrid Batch</option>
                            <option value="recorded">▶️ Recorded Courses</option>
                            <option value="test-series">📝 Test Series</option>
                        </select>
                    </div>
                </div>

                {/* Main Content: Sidebar + Courses Grid */}
                <div className="flex gap-6">
                    {/* Left Sidebar - Vertical Category Tabs */}
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
                                    <i className="fas fa-broadcast-tower text-xl w-6"></i>
                                    <span className="font-semibold">Live / Hybrid</span>
                                </button>
                                <button
                                    onClick={() => setActiveCategory('recorded')}
                                    className={getCategoryClass('recorded')}
                                >
                                    <i className="fas fa-film text-xl w-6"></i>
                                    <span className="font-semibold">Recorded Courses</span>
                                </button>
                                <button
                                    onClick={() => setActiveCategory('test-series')}
                                    className={getCategoryClass('test-series')}
                                >
                                    <i className="fas fa-tasks text-xl w-6"></i>
                                    <span className="font-semibold">Test Series</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Courses Grid */}
                    <div className="flex-1 w-full lg:w-auto">
                        {loading ? (
                            <div className="min-h-[400px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                            </div>
                        ) : filteredCourses.length === 0 ? (
                            <div className="text-center py-20 glass-panel rounded-2xl">
                                <i className="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
                                <h3 className="text-2xl font-bold text-white mb-2">No Courses Found</h3>
                                <p className="text-gray-400">Try selecting different filters</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 flex justify-between items-center">
                                    <div className="text-gray-400 font-medium">
                                        <i className="fas fa-graduation-cap text-cyan-400 mr-2"></i>
                                        Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
                                    </div>
                                    {totalPages > 1 && (
                                        <div className="text-gray-400 text-sm">
                                            Page {currentPage} of {totalPages}
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
                                    {currentCourses.map(course => {
                                        const { text, border, bg, shadow, icon } = getCourseStyling(course.title);
                                        const price = course.price || (course.plans && course.plans.batch && course.plans.batch.price) || 0;
                                        const mrp = course.mrp || (course.plans && course.plans.batch && course.plans.batch.mrp) || price;
                                        const discountPercent = mrp && price && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
                                        const description = course.shortDescription || course.description || course.desc || '';
                                        const totalLessons = course.totalLessons || course.lessonsCount || (course.lectures && course.lectures.length);
                                        const highlights = course.highlights || [];
                                        
                                        return (
                                            <div 
                                                key={course._id || course.slug} 
                                                className={`glass-panel rounded-2xl p-6 relative overflow-hidden group border-t-4 ${border} flex flex-col h-full transition transform hover:-translate-y-2 hover:shadow-2xl ${shadow}`}
                                            >
                                                {/* Course Type Tag - Top Left */}
                                                {course.courseType && (
                                                    <span className="absolute top-2 left-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md z-10 uppercase">
                                                        {course.courseType}
                                                    </span>
                                                )}

                                                {/* Discount Tag - Top Right */}
                                                {discountPercent > 0 && (
                                                    <span className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold badge-pulse">
                                                        {discountPercent}% OFF
                                                    </span>
                                                )}

                                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity">
                                                    <i className={`fas ${icon} text-9xl ${text}`}></i>
                                                </div>

                                                <h3 className="text-2xl font-bold mb-1 text-white leading-tight group-hover:text-cyan-400 transition-colors">
                                                    {course.title}
                                                </h3>
                                                
                                                {/* Instructor */}
                                                {course.instructor && (
                                                    <p className={`${text} font-semibold text-sm mb-3`}>Instructor: {course.instructor}</p>
                                                )}

                                                {/* Description */}
                                                {description && (
                                                    <p className="text-gray-400 mb-4 text-sm flex-grow line-clamp-3">
                                                        {description}
                                                    </p>
                                                )}

                                                {/* Course Details - Lessons, Price */}
                                                <div className="mb-4 space-y-2 border-t border-gray-800 pt-3">
                                                    {totalLessons && (
                                                        <div className="flex items-center text-sm text-gray-300">
                                                            <i className="fas fa-play-circle text-cyan-400 mr-2 w-4"></i>
                                                            <span className="font-semibold mr-1">Lessons:</span>
                                                            <span>{totalLessons}</span>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex items-center text-sm">
                                                        <i className="fas fa-tag text-green-400 mr-2 w-4"></i>
                                                        <span className="font-semibold text-gray-300 mr-1">Price:</span>
                                                        <span className="text-green-400 font-bold text-lg">₹{price}</span>
                                                        {mrp && mrp > price && (
                                                            <span className="text-gray-500 line-through ml-2 text-xs">₹{mrp}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Highlights */}
                                                {highlights && highlights.length > 0 && (
                                                    <div className="mb-6">
                                                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">HIGHLIGHTS:</p>
                                                        <ul className="text-xs text-gray-400 space-y-1">
                                                            {highlights.slice(0, 4).map((h, idx) => (
                                                                <li key={idx} className="flex items-center gap-1.5">
                                                                    <i className="fas fa-check text-green-500 text-[10px]"></i>
                                                                    <span className="line-clamp-1">{h}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <div className="mt-auto flex gap-3">
                                                    <button
                                                        onClick={() => triggerEnquiryModal(course)}
                                                        className={`flex-1 py-2 rounded border ${border} ${text} hover:bg-white hover:text-black transition-all font-bold text-sm`}
                                                    >
                                                        Enquire
                                                    </button>
                                                    <button
                                                        onClick={handleBuyNowRedirect}
                                                        className="flex-1 py-2 rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:shadow-lg transition-all transform hover:scale-105"
                                                    >
                                                        Buy Now
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
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


            </div>
            
            {/* Render Enquiry Modal if open */}
            {selectedCourseForEnquiry && (
                <EnquiryModal
                    isOpen={isEnquiryOpen}
                    onClose={() => setIsEnquiryOpen(false)}
                    course={selectedCourseForEnquiry}
                />
            )}
        </div>
    );
};

export default AllCourses;