import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CourseCard from '../components/UI/CourseCard';
import { useData } from '../context/DataContext';


const AllCourses = () => {
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [activeCategory, setActiveCategory] = useState(categoryParam || 'all'); // New category filter (Live Batch, Recorded, etc.)
    const [activeExam, setActiveExam] = useState('all'); // Old exam filter (JEE, NEET, Foundation)
    const { courses } = useData();

    // Update active category when URL parameter changes
    useEffect(() => {
        if (categoryParam) {
            setActiveCategory(categoryParam);
        }
    }, [categoryParam]);

    // Filter by both category and exam
    const filteredCourses = courses.filter(course => {
        const categoryMatch = activeCategory === 'all' ||
            (course.categories && course.categories.includes(activeCategory));

        // Handle exam match with normalization for hyphenated values (e.g., 'csir-net' matches 'CSIR NET')
        const normalizeExam = (exam) => exam.toLowerCase().replace(/\s+/g, '-');
        const examMatch = activeExam === 'all' ||
            (course.category && normalizeExam(course.category) === normalizeExam(activeExam));

        return categoryMatch && examMatch;
    });

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
                                <div className="mb-4 text-gray-400">
                                    <i className="fas fa-graduation-cap mr-2"></i>
                                    Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredCourses.map(course => (
                                        <CourseCard key={course._id} course={course} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllCourses;