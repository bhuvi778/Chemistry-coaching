import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TestRegistrationModal from '../components/TestRegistrationModal';

const MyDailyTarget = () => {
    const [activeTests, setActiveTests] = useState([]);
    const [upcomingTests, setUpcomingTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeExam, setActiveExam] = useState('all');
    const [activeTab, setActiveTab] = useState('active');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    useEffect(() => {
        fetchTests();
        // Check if user email is stored
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setUserEmail(storedEmail);
        }
        // Update current time every second for accurate countdown
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchTests = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/practice-tests/tests?_t=${Date.now()}`);
            setActiveTests(response.data.active || []);
            setUpcomingTests(response.data.upcoming || []);
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTimeUntilStart = (startDate) => {
        const start = new Date(startDate);
        const diffTime = start - currentTime;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

        if (diffTime <= 0) {
            return 'Available Now';
        } else if (diffDays > 0) {
            return `${diffDays}d ${diffHours}h ${diffMinutes}m`;
        } else if (diffHours > 0) {
            return `${diffHours}h ${diffMinutes}m ${diffSeconds}s`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes}m ${diffSeconds}s`;
        } else {
            return `${diffSeconds}s`;
        }
    };

    const isWithinOneHour = (startDate) => {
        const start = new Date(startDate);
        const diffTime = start - currentTime;
        const diffMinutes = diffTime / (1000 * 60);
        return diffMinutes <= 60 && diffMinutes > -60;
    };

    const canStartTest = (startDate) => {
        const start = new Date(startDate);
        return currentTime >= start;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getExamBadgeColor = (examType) => {
        const colors = {
            'NEET': 'from-green-500 to-emerald-500',
            'JEE': 'from-blue-500 to-cyan-500',
            'IAT': 'from-purple-500 to-pink-500',
            'NEST': 'from-orange-500 to-red-500',
            'CUET UG': 'from-indigo-500 to-blue-500',
            'BITSAT': 'from-amber-500 to-yellow-500',
            'IIT JAM': 'from-teal-500 to-cyan-500',
            'CUET PG': 'from-violet-500 to-purple-500',
            'CSIR NET': 'from-indigo-500 to-purple-500',
            'GATE': 'from-yellow-500 to-orange-500',
            'TIFR': 'from-rose-500 to-pink-500',
            'PSTET': 'from-lime-500 to-green-500',
            'Master Cadre': 'from-sky-500 to-blue-500',
            'UPSC - Mains (Chemistry)': 'from-red-500 to-rose-500',
            'Foundation': 'from-gray-500 to-slate-500',
            'All': 'from-cyan-400 to-blue-500'
        };
        return colors[examType] || 'from-gray-500 to-gray-600';
    };

    const handleTestClick = async (test) => {
        if (!canStartTest(test.startDate)) {
            return;
        }

        // Check if user has registered
        const email = localStorage.getItem('userEmail');
        if (!email) {
            // Show registration modal
            setSelectedTest(test);
            setShowRegistrationModal(true);
            return;
        }

        // Check registration status
        try {
            const response = await axios.get(
                `${API_URL}/practice-tests/tests/${test._id}/registration?email=${email}`
            );

            if (response.data.isRegistered) {
                // Store if user has attempted (for button text)
                if (response.data.registration?.hasAttempted) {
                    localStorage.setItem(`test_attempted_${test._id}`, 'true');
                }
                // User is registered, proceed to test
                navigate(`/practice-test/${test._id}`);
            } else {
                // Show registration modal
                setSelectedTest(test);
                setShowRegistrationModal(true);
            }
        } catch (error) {
            console.error('Error checking registration:', error);
            // Show registration modal on error
            setSelectedTest(test);
            setShowRegistrationModal(true);
        }
    };

    const handleRegistrationSuccess = (email) => {
        setUserEmail(email);
        setShowRegistrationModal(false);
        // Navigate to test
        if (selectedTest) {
            navigate(`/practice-test/${selectedTest._id}`);
        }
    };


    // For Active tab: show all active tests (backend handles 24h logic)
    const activeTestsWithinOneHour = activeTests;

    // Get current tests based on active tab
    const currentTests = activeTab === 'active' ? activeTestsWithinOneHour : upcomingTests;

    // Apply exam filter
    const filteredTests = activeExam === 'all'
        ? currentTests
        : currentTests.filter(test => test.examType === activeExam || test.examType === 'All');

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
                        My Daily Target
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {activeTab === 'active'
                            ? 'Tests starting within the next hour - Get ready to practice!'
                            : 'View all upcoming tests and plan your preparation schedule'
                        }
                    </p>
                </div>

                {/* Exam Type Filter */}
                <div className="mb-8">
                    <div className="glass-panel rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <label className="text-white font-semibold flex items-center gap-2">
                                <i className="fas fa-filter text-pink-400"></i>
                                Filter by Exam:
                            </label>
                            <select
                                value={activeExam}
                                onChange={(e) => setActiveExam(e.target.value)}
                                className="flex-1 max-w-md px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white font-semibold focus:border-pink-500 focus:outline-none transition-all cursor-pointer hover:border-pink-400"
                            >
                                <option value="all">All Exams</option>
                                <optgroup label="UG Entrance Exams" className="bg-gray-900">
                                    <option value="NEET">NEET</option>
                                    <option value="JEE">JEE</option>
                                    <option value="IAT">IAT</option>
                                    <option value="NEST">NEST</option>
                                    <option value="CUET UG">CUET UG</option>
                                    <option value="BITSAT">BITSAT</option>
                                </optgroup>
                                <optgroup label="PG Entrance Exams" className="bg-gray-900">
                                    <option value="IIT JAM">IIT JAM</option>
                                    <option value="CUET PG">CUET PG</option>
                                </optgroup>
                                <optgroup label="Research Level Exams" className="bg-gray-900">
                                    <option value="CSIR NET">CSIR NET</option>
                                    <option value="GATE">GATE</option>
                                    <option value="TIFR">TIFR</option>
                                </optgroup>
                                <optgroup label="Competitive Exams (Govt. Job)" className="bg-gray-900">
                                    <option value="PSTET">PSTET</option>
                                    <option value="Master Cadre">Master Cadre</option>
                                    <option value="UPSC - Mains (Chemistry)">UPSC - Mains (Chemistry)</option>
                                </optgroup>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Active/Upcoming Tabs */}
                <div className="mb-8">
                    <div className="glass-panel rounded-2xl p-2 inline-flex gap-2">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'active'
                                ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-lg shadow-green-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                }`}
                        >
                            <i className="fas fa-play-circle mr-2"></i>
                            Active Targets
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'active' ? 'bg-white/20' : 'bg-gray-700'
                                }`}>
                                {activeTestsWithinOneHour.filter(t => activeExam === 'all' || t.examType === activeExam || t.examType === 'All').length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'upcoming'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                }`}
                        >
                            <i className="fas fa-clock mr-2"></i>
                            Upcoming Targets
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'upcoming' ? 'bg-white/20' : 'bg-gray-700'
                                }`}>
                                {upcomingTests.filter(t => activeExam === 'all' || t.examType === activeExam || t.examType === 'All').length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Tests Grid */}
                {filteredTests.length === 0 ? (
                    <div className="glass-panel rounded-xl p-12 text-center">
                        <i className="fas fa-clock text-6xl text-gray-600 mb-4"></i>
                        <p className="text-gray-400 text-lg mb-2">
                            {activeTab === 'active'
                                ? 'No tests starting within the next hour'
                                : `No upcoming tests for ${activeExam === 'all' ? 'any exam' : activeExam}`
                            }
                        </p>
                        <p className="text-gray-500 text-sm">
                            {activeTab === 'active'
                                ? 'Check the Upcoming tab to see future tests'
                                : 'New tests will appear here when scheduled'
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-gray-400">
                            <i className="fas fa-clipboard-list mr-2"></i>
                            Showing {filteredTests.length} {filteredTests.length === 1 ? 'test' : 'tests'}
                            {activeTab === 'active' && ' starting within 1 hour'}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTests.map((test) => {
                                const timeUntilStart = getTimeUntilStart(test.startDate);
                                const isUpcomingTab = activeTab === 'upcoming';
                                const testCanStart = canStartTest(test.startDate);

                                // Calculate if test is missed based on day boundaries
                                const startDate = new Date(test.startDate);
                                const endOfStartDay = new Date(startDate);
                                endOfStartDay.setHours(23, 59, 59, 999);

                                const isAttempted = localStorage.getItem(`test_attempted_${test._id}`);
                                // Test is missed if: current time is after end of start day AND not attempted
                                const isMissed = !isUpcomingTab && currentTime > endOfStartDay && !isAttempted;

                                return (
                                    <div
                                        key={test._id}
                                        className={`glass-panel rounded-xl overflow-hidden group border-2 border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 flex flex-col h-full bg-gray-900/40 relative ${(!testCanStart && !isUpcomingTab) || isMissed ? 'opacity-75' : 'cursor-pointer'
                                            }`}
                                        onClick={() => {
                                            // Only allow click if not missed, not locked, and not upcoming (unless active)
                                            if (testCanStart && !isUpcomingTab && !isMissed) handleTestClick(test);
                                        }}
                                    >
                                        {/* Background Gradient */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${testCanStart && !isUpcomingTab
                                            ? 'from-green-500/10 to-cyan-500/10'
                                            : 'from-amber-500/10 to-orange-500/10'
                                            } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                                        <div className="relative z-10 p-5 flex flex-col h-full">
                                            {/* Header Section */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex gap-2 flex-wrap">
                                                    {/* Exam Type Badge */}
                                                    <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                                                        {test.examType}
                                                    </div>
                                                    {/* Attempted Badge */}
                                                    {isAttempted && (
                                                        <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wider">
                                                            Attempted
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Countdown Badge */}
                                                <div className={`px-3 py-1 rounded-full flex-shrink-0 ${testCanStart && !isUpcomingTab
                                                    ? 'bg-green-500/20 border border-green-500/30'
                                                    : 'bg-amber-500/20 border border-amber-500/30'
                                                    }`}>
                                                    <span className={`${testCanStart && !isUpcomingTab ? 'text-green-400' : 'text-amber-400'
                                                        } font-bold text-sm whitespace-nowrap`}>
                                                        {timeUntilStart}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className={`text-xl font-bold mb-2 transition-colors ${testCanStart && !isUpcomingTab && !isMissed ? 'text-white group-hover:text-cyan-400' : 'text-gray-300'
                                                }`}>
                                                {test.title}
                                            </h3>

                                            {/* Description */}
                                            {test.description && (
                                                <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-shrink-0">
                                                    {test.description}
                                                </p>
                                            )}

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
                                                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                                                    <div className="text-xs text-gray-400 mb-1">Questions</div>
                                                    <div className="text-lg font-bold text-white">{test.questionCount || 0}</div>
                                                </div>
                                                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                                                    <div className="text-xs text-gray-400 mb-1">Duration</div>
                                                    <div className="text-lg font-bold text-white">{test.duration} min</div>
                                                </div>
                                                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                                                    <div className="text-xs text-gray-400 mb-1">Total Marks</div>
                                                    <div className="text-lg font-bold text-white">{test.totalMarks}</div>
                                                </div>
                                                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                                                    <div className="text-xs text-gray-400 mb-1">
                                                        {isUpcomingTab ? 'Starts On' : 'Start Time'}
                                                    </div>
                                                    <div className="text-sm font-bold text-cyan-400">
                                                        {isUpcomingTab
                                                            ? formatDate(test.startDate)
                                                            : new Date(test.startDate).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="mt-auto">
                                                {isUpcomingTab ? (
                                                    <div className="w-full py-3 rounded-lg bg-gray-700/50 text-gray-400 font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                                                        <i className="fas fa-calendar"></i>
                                                        <span>Scheduled for {formatDateTime(test.startDate)}</span>
                                                    </div>
                                                ) : isMissed ? (
                                                    <div className="w-full py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                                                        <i className="fas fa-times-circle"></i>
                                                        <span>Missed - Time Over</span>
                                                    </div>
                                                ) : testCanStart ? (
                                                    <button className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2">
                                                        <i className="fas fa-play"></i>
                                                        <span>{isAttempted ? 'Retake Test' : 'Today Target'}</span>
                                                        <i className="fas fa-chevron-right text-sm"></i>
                                                    </button>
                                                ) : (
                                                    <div className="w-full py-3 rounded-lg bg-gray-700/50 text-gray-400 font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                                                        <i className="fas fa-lock"></i>
                                                        <span>Starts at {formatDateTime(test.startDate)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Registration Modal */}
                {showRegistrationModal && selectedTest && (
                    <TestRegistrationModal
                        test={selectedTest}
                        onClose={() => setShowRegistrationModal(false)}
                        onSuccess={handleRegistrationSuccess}
                    />
                )}
            </div>
        </div>
    );
};

export default MyDailyTarget;
