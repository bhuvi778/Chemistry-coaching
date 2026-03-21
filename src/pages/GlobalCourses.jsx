import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../components/UI/Pagination';

const GlobalCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExam, setSelectedExam] = useState('all');
    const [selectedCourseType, setSelectedCourseType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 9;

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedExam, selectedCourseType]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/global-courses`);
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const examMatch = selectedExam === 'all' || course.exam === selectedExam || course.exam === 'All';
        const typeMatch = selectedCourseType === 'all' || course.courseType === selectedCourseType;
        return examMatch && typeMatch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    const getFilterClass = (isActive) => {
        return `px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${isActive
            ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-[0_8px_30px_rgba(6,182,212,0.5)] scale-105 border-2 border-cyan-400/50'
            : 'bg-gray-800/50 text-gray-400 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white hover:shadow-lg hover:scale-[1.02] border-2 border-gray-700 hover:border-cyan-400/30'
            }`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="flex items-center mb-8">
                    <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-6 relative group">
                        <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <i className="fas fa-globe-americas text-5xl text-white relative z-10"></i>
                    </div>
                    <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        UAE Courses
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Explore our world-class chemistry programs designed for UAE and international students.
                        From IB to A-Levels, achieve academic success with our expert guidance.
                    </p>
                </div>

                <div className="glass-panel rounded-2xl p-8 border border-cyan-500/30">
                    {/* Exam Filter */}
                    <div className="mb-8">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <i className="fas fa-graduation-cap text-cyan-400"></i>
                            Filter by Exam
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={() => setSelectedExam('all')} className={getFilterClass(selectedExam === 'all')}>
                                <i className="fas fa-th-large mr-2"></i>All Exams
                            </button>
                            {/* School Board Exams */}
                            <button onClick={() => setSelectedExam('CBSE')} className={getFilterClass(selectedExam === 'CBSE')}>
                                <i className="fas fa-school mr-2"></i>CBSE
                            </button>
                            <button onClick={() => setSelectedExam('IB')} className={getFilterClass(selectedExam === 'IB')}>
                                <i className="fas fa-globe-americas mr-2"></i>IB
                            </button>
                            <button onClick={() => setSelectedExam('IGCSE')} className={getFilterClass(selectedExam === 'IGCSE')}>
                                <i className="fas fa-certificate mr-2"></i>IGCSE
                            </button>
                            <button onClick={() => setSelectedExam('A-Level')} className={getFilterClass(selectedExam === 'A-Level')}>
                                <i className="fas fa-layer-group mr-2"></i>A-Level
                            </button>
                        </div>
                    </div>

                    {/* Course Type Filter */}
                    <div className="mb-8">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <i className="fas fa-video text-red-400"></i>
                            Filter by Type
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={() => setSelectedCourseType('all')} className={getFilterClass(selectedCourseType === 'all')}>
                                <i className="fas fa-th-large mr-2"></i>All Types
                            </button>
                            <button onClick={() => setSelectedCourseType('Live')} className={getFilterClass(selectedCourseType === 'Live')}>
                                <i className="fas fa-circle text-red-500 mr-2 text-xs"></i>Live
                            </button>
                            <button onClick={() => setSelectedCourseType('Recorded')} className={getFilterClass(selectedCourseType === 'Recorded')}>
                                <i className="fas fa-play-circle text-blue-400 mr-2"></i>Recorded
                            </button>
                            <button onClick={() => setSelectedCourseType('Hybrid')} className={getFilterClass(selectedCourseType === 'Hybrid')}>
                                <i className="fas fa-sync-alt text-purple-400 mr-2"></i>Hybrid
                            </button>
                        </div>
                    </div>

                    {/* Courses Display */}
                    {courses.length === 0 ? (
                        <div className="text-center py-12">
                            <i className="fas fa-globe-americas text-6xl text-gray-600 mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">No UAE Courses Yet</h3>
                            <p className="text-gray-400">Click "Add New Course" to create your first international course</p>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-12">
                            <i className="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">No Courses Found</h3>
                            <p className="text-gray-400">Try selecting different filters</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 flex justify-between items-center">
                                <div className="text-gray-400">
                                    <i className="fas fa-globe mr-2"></i>
                                    Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
                                </div>
                                {totalPages > 1 && (
                                    <div className="text-gray-400 text-sm">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentCourses.map(course => (
                                    <div key={course._id} className="glass-panel rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] group">
                                        {course.thumbnail && (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform"
                                            />
                                        )}
                                        <div className="flex gap-2 mb-3">
                                            {course.badge && (
                                                <div className="inline-block px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                                                    {course.badge}
                                                </div>
                                            )}
                                            {course.courseType && (
                                                <div className={`inline-block px-3 py-1 text-white text-xs font-bold rounded-full ${course.courseType === 'Live' ? 'bg-red-500 animate-pulse' :
                                                    course.courseType === 'Hybrid' ? 'bg-purple-500' : 'bg-blue-500'
                                                    }`}>
                                                    {course.courseType === 'Live' && <i className="fas fa-circle text-[8px] mr-1 align-middle"></i>}
                                                    {course.courseType}
                                                </div>
                                            )}
                                        </div>
                                        <div className={`w-14 h-14 bg-gradient-to-r from-${course.color}-500 to-${course.color}-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <i className={`fas ${course.icon} text-2xl text-white`}></i>
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">{course.title}</h4>
                                        <p className="text-gray-300 mb-4 text-sm line-clamp-3">{course.description}</p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <i className="fas fa-graduation-cap text-cyan-400"></i>
                                                <span>{course.exam}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <i className="fas fa-flask text-purple-400"></i>
                                                <span>{course.category}</span>
                                            </div>
                                            {course.instructor && (
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <i className="fas fa-user text-green-400"></i>
                                                    <span>{course.instructor}</span>
                                                </div>
                                            )}
                                            {course.duration && (
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <i className="fas fa-clock text-blue-400"></i>
                                                    <span>{course.duration}</span>
                                                </div>
                                            )}
                                            {course.level && (
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <i className="fas fa-signal text-amber-400"></i>
                                                    <span>{course.level}</span>
                                                </div>
                                            )}
                                            {course.price && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-bold text-cyan-400 text-lg">
                                                        {course.price}
                                                    </span>
                                                    {course.originalPrice && (
                                                        <span className="text-gray-500 line-through text-sm">
                                                            {course.originalPrice}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {course.features && course.features.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-xs font-semibold text-gray-500 mb-2">KEY FEATURES:</p>
                                                <ul className="space-y-1">
                                                    {course.features.slice(0, 3).map((feature, idx) => (
                                                        <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                                                            <i className="fas fa-check-circle text-cyan-400 mt-0.5"></i>
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="flex gap-3 mt-auto">
                                            {course.enrollmentLink && (
                                                <a
                                                    href={course.enrollmentLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition transform hover:scale-105"
                                                >
                                                    <i className="fas fa-user-plus mr-2"></i>
                                                    Enroll
                                                </a>
                                            )}
                                            <a
                                                href={`https://wa.me/919115179935?text=Hi%2C%20we%20want%20to%20know%20more%20about%20International%20Course%20-%20${encodeURIComponent(course.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 text-center px-4 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition transform hover:scale-105"
                                            >
                                                <i className="fab fa-whatsapp mr-2"></i>
                                                Enquiry
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalCourses;
