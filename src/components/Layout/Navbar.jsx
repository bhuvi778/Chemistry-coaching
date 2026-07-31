import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [regionChoice, setRegionChoice] = useState('');
  const [isStudyMaterialOpen, setIsStudyMaterialOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // Mobile dropdown states
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);
  const [isMobileExamsOpen, setIsMobileExamsOpen] = useState(false);
  const [isMobileStudyMaterialOpen, setIsMobileStudyMaterialOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isPrepArenaOpen, setIsPrepArenaOpen] = useState(false);
  const [isExamsOpen, setIsExamsOpen] = useState(false);
  const [isMobilePrepArenaOpen, setIsMobilePrepArenaOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  // Read saved region from cookie on mount
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )regionChoice=([^;]*)/);
    if (match) setRegionChoice(decodeURIComponent(match[1]));
  }, []);

  const handleRegionClick = (region, url) => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `regionChoice=${encodeURIComponent(region)}; expires=${expires.toUTCString()}; path=/`;
    setRegionChoice(region);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `nav-link px-3 py-2 transition relative ${isActive ? 'text-cyan-400 active' : 'text-gray-300 hover:text-cyan-400'
      }`;
  };

  return (
    <>
      <nav className="glass-panel fixed w-full z-50 top-0 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center cursor-pointer">
              <img
                src={isDark ? "/logo-light.png" : "/logo-dark.png"}
                alt="Ace2Examz - Your Path To Success"
                className="h-10 md:h-12 w-auto object-contain transition-opacity duration-300"
              />
            </Link>

            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-baseline space-x-3 text-lg">

                {/* Exams Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => setIsExamsOpen(true)}
                  onMouseLeave={() => setIsExamsOpen(false)}
                >
                  <button className={`px-2 py-2 transition relative ${location.pathname.includes('/exams')
                    ? 'text-cyan-400 active' : 'text-gray-300 hover:text-cyan-400'
                    }`}>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-file-alt"></i>
                      Exams
                      <i className={`fas fa-chevron-down text-xs transition-transform ${isExamsOpen ? 'rotate-180' : ''}`}></i>
                    </span>
                  </button>

                  <div className={`absolute top-full left-0 mt-2 w-56 glass-panel rounded-lg border border-gray-700 shadow-lg transition-all duration-300 z-[100] ${isExamsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}>
                    <Link
                      to="/exams/neet"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsExamsOpen(false)}
                    >
                      <i className="fas fa-stethoscope text-cyan-400"></i>
                      <span>NEET</span>
                    </Link>
                    <Link
                      to="/exams/jee"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-orange-500/20 hover:text-orange-400 transition"
                      onClick={() => setIsExamsOpen(false)}
                    >
                      <i className="fas fa-calculator text-orange-400"></i>
                      <span>JEE</span>
                    </Link>
                  </div>
                </div>

                {/* Courses Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => setIsCoursesOpen(true)}
                  onMouseLeave={() => setIsCoursesOpen(false)}
                >
                  <button className={`px-2 py-2 transition relative ${location.pathname.includes('/courses') || location.pathname.includes('/my-daily-target')
                    ? 'text-cyan-400 active' : 'text-gray-300 hover:text-cyan-400'
                    }`}>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-graduation-cap"></i>
                      Ace Batches
                      <i className={`fas fa-chevron-down text-xs transition-transform ${isCoursesOpen ? 'rotate-180' : ''}`}></i>
                    </span>
                  </button>

                  <div className={`absolute top-full left-0 mt-2 w-56 glass-panel rounded-lg border border-gray-700 shadow-lg transition-all duration-300 z-[100] ${isCoursesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}>
                    <Link
                      to="/courses"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsCoursesOpen(false)}
                    >
                      <i className="fas fa-graduation-cap text-cyan-400"></i>
                      <span>Courses</span>
                    </Link>
                    <Link
                      to="/my-daily-target"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsCoursesOpen(false)}
                    >
                      <i className="fas fa-bullseye text-green-500"></i>
                      <span>My Daily Target</span>
                    </Link>
                    <a
                      href="https://learn.ace2examz.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsCoursesOpen(false)}
                    >
                      <i className="fas fa-laptop-code text-yellow-400"></i>
                      <span>Class 9-10</span>
                    </a>


                  </div>
                </div>

                {/* Study Material Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => setIsStudyMaterialOpen(true)}
                  onMouseLeave={() => setIsStudyMaterialOpen(false)}
                >
                  <button className={`px-2 py-2 transition relative ${location.pathname.includes('/lectures') || location.pathname.includes('/audiobooks') ||
                    location.pathname.includes('/study-materials') || location.pathname.includes('/magazines') ||
                    location.pathname.includes('/puzzles') || location.pathname.includes('/flash-cards') ||
                    location.pathname.includes('/chemsnaps') || location.pathname.includes('/concept-wise-notes')
                    ? 'text-cyan-400 active' : 'text-gray-300 hover:text-cyan-400'
                    }`}>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-book"></i>
                      Study Material
                      <i className={`fas fa-chevron-down text-xs transition-transform ${isStudyMaterialOpen ? 'rotate-180' : ''}`}></i>
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className={`absolute top-full left-0 mt-2 w-56 glass-panel rounded-lg border border-gray-700 shadow-lg overflow-hidden transition-all duration-300 z-[100] ${isStudyMaterialOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}>
                    <Link
                      to="/lectures"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsStudyMaterialOpen(false)}
                    >
                      <i className="fab fa-youtube text-red-500"></i>
                      <span>Video Lectures</span>
                    </Link>
                    <Link
                      to="/audiobooks"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsStudyMaterialOpen(false)}
                    >
                      <i className="fas fa-headphones text-purple-500"></i>
                      <span>Audio Books</span>
                    </Link>
                    <Link
                      to="/study-materials"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsStudyMaterialOpen(false)}
                    >
                      <i className="fas fa-file-pdf text-green-500"></i>
                      <span>Free Study Materials</span>
                    </Link>
                    <Link
                      to="/free-quiz"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsStudyMaterialOpen(false)}
                    >
                      <i className="fas fa-clipboard-list text-cyan-400"></i>
                      <span>Free Quiz</span>
                    </Link>
                    <Link
                      to="/magazines"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsStudyMaterialOpen(false)}
                    >
                      <i className="fas fa-book-open text-pink-500"></i>
                      <span>Chemistry Magazine</span>
                    </Link>
                    <Link
                      to="/puzzles"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsStudyMaterialOpen(false)}
                    >
                      <i className="fas fa-puzzle-piece text-yellow-500"></i>
                      <span>Chemistry Puzzles</span>
                    </Link>
                    <Link
                      to="/chemsnaps"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsStudyMaterialOpen(false)}
                    >
                      <i className="fas fa-bolt text-cyan-500"></i>
                      <span>ChemSnaps</span>
                    </Link>
                    <Link
                      to="/concept-wise-notes"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsStudyMaterialOpen(false)}
                    >
                      <i className="fas fa-book-open text-teal-500"></i>
                      <span>Concept Wise Notes</span>
                    </Link>
                    <Link
                      to="/flash-cards"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsStudyMaterialOpen(false)}
                    >
                      <i className="fas fa-layer-group text-indigo-500"></i>
                      <span>Flash Card</span>
                    </Link>
                    <Link
                      to="/assertion-reason"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsStudyMaterialOpen(false)}
                    >
                      <i className="fas fa-question-circle text-orange-500"></i>
                      <span>Assertion & Reason</span>
                    </Link>

                  </div>
                </div>

                {/* Prep Arena Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => setIsPrepArenaOpen(true)}
                  onMouseLeave={() => setIsPrepArenaOpen(false)}
                >
                  <button className={`px-2 py-2 transition relative ${location.pathname.includes('/ncert-toolbox') ||
                    location.pathname.includes('/dpps') ||
                    location.pathname.includes('/book-meeting') ||
                    location.pathname.includes('/book-your-session') ||
                    location.pathname.includes('/self-learn')
                    ? 'text-cyan-400 active' : 'text-gray-300 hover:text-cyan-400'
                    }`}>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-dumbbell text-red-500"></i>
                      Prep Arena
                      <i className={`fas fa-chevron-down text-xs transition-transform ${isPrepArenaOpen ? 'rotate-180' : ''}`}></i>
                    </span>
                  </button>

                  <div className={`absolute top-full left-0 mt-2 w-56 glass-panel rounded-lg border border-gray-700 shadow-lg overflow-hidden transition-all duration-300 z-[100] ${isPrepArenaOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}>
                    <Link
                      to="/ncert-toolbox"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsPrepArenaOpen(false)}
                    >
                      <i className="fas fa-tools text-yellow-500"></i>
                      <span>NCERT Toolbox</span>
                    </Link>
                    <Link
                      to="/dpps"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsPrepArenaOpen(false)}
                    >
                      <i className="fas fa-clipboard-list text-blue-500"></i>
                      <span>DPPs</span>
                    </Link>
                    <Link
                      to="/pyq"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsPrepArenaOpen(false)}
                    >
                      <i className="fas fa-layer-group text-indigo-500"></i>
                      <span>Chapter wise PYQs</span>
                    </Link>
                    <Link
                      to="/infinite-practice"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsPrepArenaOpen(false)}
                    >
                      <i className="fas fa-infinity text-pink-500"></i>
                      <span>Infinite Practice</span>
                    </Link>
                    <Link
                      to="/self-learn"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsPrepArenaOpen(false)}
                    >
                      <i className="fas fa-graduation-cap text-orange-500"></i>
                      <span>Self Learn</span>
                    </Link>
                  </div>
                </div>

                {/* More Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => setIsMoreOpen(true)}
                  onMouseLeave={() => setIsMoreOpen(false)}
                >
                  <button className={`px-2 py-2 transition relative ${location.pathname.includes('/about') || location.pathname.includes('/contact') || location.pathname.includes('/community')
                    ? 'text-cyan-400 active' : 'text-gray-300 hover:text-cyan-400'
                    }`}>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-ellipsis-h"></i>
                      More
                      <i className={`fas fa-chevron-down text-xs transition-transform ${isMoreOpen ? 'rotate-180' : ''}`}></i>
                    </span>
                  </button>

                  <div className={`absolute top-full left-0 mt-2 w-56 glass-panel rounded-lg border border-gray-700 shadow-lg overflow-hidden transition-all duration-300 z-[100] ${isMoreOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}>
                    <Link
                      to="/about"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsMoreOpen(false)}
                    >
                      <i className="fas fa-info-circle text-blue-400"></i>
                      <span>About Us</span>
                    </Link>
                    <Link
                      to="/blogs"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsMoreOpen(false)}
                    >
                      <i className="fas fa-blog text-blue-500"></i>
                      <span>Blogs</span>
                    </Link>
                    <Link
                      to="/community"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsMoreOpen(false)}
                    >
                      <i className="fas fa-users text-orange-500"></i>
                      <span>Community</span>
                    </Link>
                    <Link
                      to="/contact"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                      onClick={() => setIsMoreOpen(false)}
                    >
                      <i className="fas fa-envelope text-green-500"></i>
                      <span>Contact Us</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Notification Bell Icon */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative text-gray-300 hover:text-cyan-400 transition p-2"
                  aria-label="Notifications"
                >
                  <i className="fas fa-bell fa-lg"></i>
                  {/* Notification Badge */}
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notification Panel - Only opens when bell is clicked */}
                {isNotificationOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 glass-panel rounded-lg border border-gray-700 shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="text-white font-semibold text-lg">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {/* Sample Notifications */}
                      <div className="p-4 border-b border-gray-700 hover:bg-cyan-500/10 cursor-pointer transition">
                        <div className="flex items-start gap-3">
                          <i className="fas fa-book text-cyan-400 mt-1"></i>
                          <div>
                            <p className="text-white text-sm">New course available: Advanced Chemistry</p>
                            <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-gray-700 hover:bg-cyan-500/10 cursor-pointer transition">
                        <div className="flex items-start gap-3">
                          <i className="fas fa-video text-purple-400 mt-1"></i>
                          <div>
                            <p className="text-white text-sm">New lecture uploaded in Organic Chemistry</p>
                            <p className="text-gray-400 text-xs mt-1">5 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-gray-700 hover:bg-cyan-500/10 cursor-pointer transition">
                        <div className="flex items-start gap-3">
                          <i className="fas fa-file-pdf text-green-400 mt-1"></i>
                          <div>
                            <p className="text-white text-sm">New study material added</p>
                            <p className="text-gray-400 text-xs mt-1">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-800/50 text-center">
                      <button
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                        onClick={() => setIsNotificationOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Login/Signup Button */}
              <a
                href="https://app.ace2examz.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-lg text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <i className="fas fa-sign-in-alt"></i>
                Login/Signup
              </a>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="relative w-16 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 border-2 border-gray-600 transition-all duration-300 hover:shadow-lg group"
                aria-label="Toggle theme"
              >
                <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-lg transform transition-all duration-300 flex items-center justify-center ${isDark ? 'translate-x-8' : 'translate-x-0'}`}>
                  {isDark ? (
                    <i className="fas fa-moon text-gray-800 text-xs"></i>
                  ) : (
                    <i className="fas fa-sun text-yellow-500 text-xs"></i>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  <i className={`fas fa-sun text-xs ${!isDark ? 'text-yellow-400' : 'text-gray-500'}`}></i>
                  <i className={`fas fa-moon text-xs ${isDark ? 'text-cyan-400' : 'text-gray-500'}`}></i>
                </div>
              </button>
            </div>

            <div className="-mr-2 flex md:hidden gap-3 items-center">
              {/* Mobile Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="text-gray-300 hover:text-white p-2 relative"
                  aria-label="Notifications"
                >
                  <i className="fas fa-bell fa-lg"></i>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>

              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="text-gray-300 hover:text-white p-2"
                aria-label="Toggle theme"
              >
                <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'} fa-lg`}></i>
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white p-2">
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-flask'} fa-lg`}></i>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden glass-panel border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Login/Signup Button */}
              <div className="px-3 py-2 border-b border-gray-800/50 mb-2">
                <a
                  href="https://app.ace2examz.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl text-sm shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  <i className="fas fa-sign-in-alt"></i>
                  Login / Signup
                </a>
              </div>

              {/* Exams Dropdown */}
              <div className="border-b border-gray-700 pb-2">
                <button
                  onClick={() => setIsMobileExamsOpen(!isMobileExamsOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-gray-700 rounded-md transition"
                >
                  <span>
                    <i className="fas fa-file-alt mr-2"></i>Exams
                  </span>
                  <i className={`fas fa-chevron-down text-xs transition-transform ${isMobileExamsOpen ? 'rotate-180' : ''}`}></i>
                </button>
                {isMobileExamsOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    <Link to="/exams/neet" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-stethoscope text-cyan-400 mr-2"></i>NEET
                    </Link>
                    <Link to="/exams/jee" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-calculator text-orange-400 mr-2"></i>JEE
                    </Link>
                  </div>
                )}
              </div>

              {/* Ace Program Dropdown */}
              <div className="border-b border-gray-700 pb-2">
                <button
                  onClick={() => setIsMobileCoursesOpen(!isMobileCoursesOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-gray-700 rounded-md transition"
                >
                  <span>
                    <i className="fas fa-graduation-cap mr-2"></i>Ace Program
                  </span>
                  <i className={`fas fa-chevron-down text-xs transition-transform ${isMobileCoursesOpen ? 'rotate-180' : ''}`}></i>
                </button>
                {isMobileCoursesOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    <Link to="/courses" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-graduation-cap text-cyan-400 mr-2"></i>Courses
                    </Link>
                    <Link to="/my-daily-target" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-bullseye text-green-500 mr-2"></i>My Daily Target
                    </Link>
                    <a
                      href="https://learn.ace2examz.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition"
                    >
                      <i className="fas fa-laptop-code text-yellow-400 mr-2"></i>Class 9-10
                    </a>
                  </div>
                )}
              </div>

              {/* Study Material Dropdown */}
              <div className="border-b border-gray-700 pb-2">
                <button
                  onClick={() => setIsMobileStudyMaterialOpen(!isMobileStudyMaterialOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-gray-700 rounded-md transition"
                >
                  <span>
                    <i className="fas fa-book mr-2"></i>Study Material
                  </span>
                  <i className={`fas fa-chevron-down text-xs transition-transform ${isMobileStudyMaterialOpen ? 'rotate-180' : ''}`}></i>
                </button>
                {isMobileStudyMaterialOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    <Link to="/lectures" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fab fa-youtube text-red-500 mr-2"></i>Video Lectures
                    </Link>
                    <Link to="/audiobooks" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-headphones text-purple-500 mr-2"></i>Audio Books
                    </Link>
                    <Link to="/study-materials" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-file-pdf text-green-500 mr-2"></i>Free Study Materials
                    </Link>
                    <Link to="/free-quiz" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-clipboard-list text-cyan-400 mr-2"></i>Free Quiz
                    </Link>
                    <Link to="/magazines" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-book-open text-pink-500 mr-2"></i>Chemistry Magazine
                    </Link>
                    <Link to="/puzzles" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-puzzle-piece text-yellow-500 mr-2"></i>Chemistry Puzzles
                    </Link>
                    <Link to="/chemsnaps" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-bolt text-cyan-500 mr-2"></i>ChemSnaps
                    </Link>
                    <Link to="/concept-wise-notes" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-book-open text-teal-500 mr-2"></i>Concept Wise Notes
                    </Link>
                    <Link to="/flash-cards" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-layer-group text-indigo-500 mr-2"></i>Flash Card
                    </Link>
                    <Link to="/assertion-reason" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-question-circle text-orange-500 mr-2"></i>Assertion & Reason
                    </Link>

                  </div>
                )}
              </div>

              {/* Standalone Links */}
              {/* Prep Arena Mobile Dropdown */}
              <div className="border-b border-gray-700 pb-2">
                <button
                  onClick={() => setIsMobilePrepArenaOpen(!isMobilePrepArenaOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-gray-700 rounded-md transition"
                >
                  <span>
                    <i className="fas fa-dumbbell mr-2"></i>Prep Arena
                  </span>
                  <i className={`fas fa-chevron-down text-xs transition-transform ${isMobilePrepArenaOpen ? 'rotate-180' : ''}`}></i>
                </button>
                {isMobilePrepArenaOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    <Link to="/ncert-toolbox" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-tools text-yellow-500 mr-2"></i>NCERT Toolbox
                    </Link>
                    <Link to="/dpps" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-clipboard-list text-blue-500 mr-2"></i>DPPs
                    </Link>
                    <Link to="/pyq" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-layer-group text-indigo-500 mr-2"></i>Chapter wise PYQs
                    </Link>
                    <Link to="/infinite-practice" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-infinity text-pink-500 mr-2"></i>Infinite Practice
                    </Link>
                    <Link to="/self-learn" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-graduation-cap text-orange-500 mr-2"></i>Self Learn
                    </Link>
                  </div>
                )}
              </div>

              {/* More Dropdown */}
              <div className="border-t border-gray-700 pt-2">
                <button
                  onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-gray-700 rounded-md transition"
                >
                  <span>
                    <i className="fas fa-ellipsis-h mr-2"></i>More
                  </span>
                  <i className={`fas fa-chevron-down text-xs transition-transform ${isMobileMoreOpen ? 'rotate-180' : ''}`}></i>
                </button>
                {isMobileMoreOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-info-circle text-blue-400 mr-2"></i>About Us
                    </Link>
                    <Link to="/blogs" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-blog text-blue-500 mr-2"></i>Blog
                    </Link>
                    <Link to="/community" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-users text-orange-500 mr-2"></i>Community
                    </Link>
                    <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition">
                      <i className="fas fa-envelope text-green-500 mr-2"></i>Contact Us
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Notification Panel */}
        {isNotificationOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsNotificationOpen(false)}>
            <div className="absolute top-20 right-4 left-4 glass-panel rounded-lg border border-gray-700 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg">Notifications</h3>
                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-700 hover:bg-cyan-500/10 cursor-pointer transition">
                  <div className="flex items-start gap-3">
                    <i className="fas fa-book text-cyan-400 mt-1"></i>
                    <div>
                      <p className="text-white text-sm">New course available: Advanced Chemistry</p>
                      <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b border-gray-700 hover:bg-cyan-500/10 cursor-pointer transition">
                  <div className="flex items-start gap-3">
                    <i className="fas fa-video text-purple-400 mt-1"></i>
                    <div>
                      <p className="text-white text-sm">New lecture uploaded in Organic Chemistry</p>
                      <p className="text-gray-400 text-xs mt-1">5 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b border-gray-700 hover:bg-cyan-500/10 cursor-pointer transition">
                  <div className="flex items-start gap-3">
                    <i className="fas fa-file-pdf text-green-400 mt-1"></i>
                    <div>
                      <p className="text-white text-sm">New study material added</p>
                      <p className="text-gray-400 text-xs mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav >
    </>
  );
};

export default Navbar;