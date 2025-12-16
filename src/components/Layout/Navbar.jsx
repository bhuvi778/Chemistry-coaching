import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStudyMaterialOpen, setIsStudyMaterialOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `nav-link px-3 py-2 transition relative ${isActive ? 'text-cyan-400 active' : 'text-gray-300 hover:text-cyan-400'
      }`;
  };

  return (
    <nav className="glass-panel fixed w-full z-50 top-0 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center cursor-pointer">
            <img
              src={isDark ? "/logo-light.png" : "/logo-dark.png"}
              alt="Ace2Examz - Your Path To Success"
              className="h-12 md:h-16 w-auto object-contain transition-opacity duration-300"
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-baseline space-x-6 text-lg">
              <Link to="/" className={getNavLinkClass('/')}>Home</Link>
              <Link to="/about" className={getNavLinkClass('/about')}>About Us</Link>
              <Link to="/courses" className={getNavLinkClass('/courses')}>Courses</Link>

              {/* Study Material Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsStudyMaterialOpen(true)}
                onMouseLeave={() => setIsStudyMaterialOpen(false)}
              >
                <button className={`px-3 py-2 transition relative ${location.pathname.includes('/lectures') || location.pathname.includes('/audiobooks') ||
                  location.pathname.includes('/study-materials') || location.pathname.includes('/magazines')
                  ? 'text-cyan-400 active' : 'text-gray-300 hover:text-cyan-400'
                  }`}>
                  <span className="flex items-center gap-2">
                    <i className="fas fa-book"></i>
                    Study Material
                    <i className={`fas fa-chevron-down text-xs transition-transform ${isStudyMaterialOpen ? 'rotate-180' : ''}`}></i>
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 mt-2 w-56 glass-panel rounded-lg border border-gray-700 shadow-lg overflow-hidden transition-all duration-300 ${isStudyMaterialOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
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
                    to="/magazines"
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                    onClick={() => setIsStudyMaterialOpen(false)}
                  >
                    <i className="fas fa-book-open text-pink-500"></i>
                    <span>Chemistry Magazine</span>
                  </Link>
                </div>
              </div>

              <Link to="/ai-assistant" className={getNavLinkClass('/ai-assistant')}>
                <span className="flex items-center gap-2">
                  <i className="fas fa-robot text-cyan-400"></i>
                  Ask AI
                </span>
              </Link>
              <Link to="/contact" className={getNavLinkClass('/contact')}>Contact Us</Link>
            </div>

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
          <div className="px-2 pt-2 pb-3 space-y-1 text-center">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-white hover:bg-gray-700">Home</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-white hover:bg-gray-700">About Us</Link>
            <Link to="/courses" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-white hover:bg-gray-700">Courses</Link>
            <Link to="/lectures" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-white hover:bg-gray-700">
              <i className="fab fa-youtube text-red-500 mr-2"></i>Video Lectures
            </Link>
            <Link to="/audiobooks" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-white hover:bg-gray-700">
              <i className="fas fa-headphones text-purple-500 mr-2"></i>Audio Books
            </Link>
            <Link to="/study-materials" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-white hover:bg-gray-700">
              <i className="fas fa-file-pdf text-green-500 mr-2"></i>Free Study Materials
            </Link>
            <Link to="/magazines" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-white hover:bg-gray-700">
              <i className="fas fa-book-open text-pink-500 mr-2"></i>Chemistry Magazine
            </Link>
            <Link to="/ai-assistant" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-white hover:bg-gray-700">
              <i className="fas fa-robot text-cyan-400 mr-2"></i>Ask AI
            </Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-white hover:bg-gray-700">Contact Us</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;