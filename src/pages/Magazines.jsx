import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

const Magazines = () => {
  const { magazines } = useData();
  const { isDark } = useTheme();
  const [selectedYear, setSelectedYear] = useState('all');

  // Extract unique years from magazines and sort them in descending order
  const availableYears = useMemo(() => {
    const years = [...new Set(magazines.map(mag => mag.year))].sort((a, b) => b - a);
    return years;
  }, [magazines]);

  // Set default year to the latest year when magazines are loaded
  React.useEffect(() => {
    if (availableYears.length > 0 && selectedYear === 'all') {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears]);

  // Filter magazines by selected year
  const filteredMagazines = selectedYear === 'all'
    ? magazines
    : magazines.filter(mag => mag.year === selectedYear);

  // Sort magazines by month (newest first)
  const sortedMagazines = [...filteredMagazines].sort((a, b) => {
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const aIndex = monthOrder.indexOf(a.month);
    const bIndex = monthOrder.indexOf(b.month);
    return bIndex - aIndex; // Descending order
  });

  return (
    <div className={`animate-fadeIn min-h-screen py-20 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="flex items-center mb-8">
          <Link
            to="/"
            className={`flex items-center gap-2 transition ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
            }`}>
            <i className="fas fa-book-open mr-3 bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent"></i>
            <span className="bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent">
              Chemistry Magazine
            </span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
            Monthly chemistry magazine with latest topics, problems, and insights
          </p>
        </div>

        {/* Year Filter */}
        {availableYears.length > 0 && (
          <div className="mb-10">
            <div className={`rounded-xl p-6 ${isDark ? 'glass-panel' : 'bg-white shadow-lg border border-gray-200'
              }`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                <i className="fas fa-calendar-alt mr-2 text-pink-500"></i>
                Select Year
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedYear('all')}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${selectedYear === 'all'
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                    : isDark
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  All Years
                </button>
                {availableYears.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${selectedYear === year
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                      : isDark
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Magazines Grid */}
        {sortedMagazines.length === 0 ? (
          <div className={`text-center py-20 rounded-2xl ${isDark ? 'glass-panel' : 'bg-white shadow-lg border border-gray-200'
            }`}>
            <i className={`fas fa-book-open text-6xl mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'
              }`}></i>
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              No Magazines Available
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {selectedYear === 'all'
                ? 'New magazines will be published soon!'
                : `No magazines available for ${selectedYear}`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedMagazines.map((magazine) => (
              <div
                key={magazine._id}
                className={`rounded-xl overflow-hidden transition-all duration-300 flex flex-col ${isDark
                  ? 'glass-panel hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]'
                  : 'bg-white shadow-lg hover:shadow-2xl border border-gray-200'
                  }`}
              >
                {/* Title at Top */}
                <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                  <h3 className={`text-xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    {magazine.title}
                  </h3>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    {magazine.edition && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDark
                        ? 'bg-pink-500/20 text-pink-400'
                        : 'bg-pink-100 text-pink-700'
                        }`}>
                        {magazine.edition}
                      </span>
                    )}
                    {magazine.month && magazine.year && (
                      <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        {magazine.month} {magazine.year}
                      </span>
                    )}
                  </div>
                </div>

                {/* Cover Image */}
                {magazine.coverImageUrl && (
                  <div className="relative overflow-hidden bg-gray-900">
                    <img
                      src={magazine.coverImageUrl}
                      alt={magazine.title}
                      className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <p className={`text-sm mb-4 flex-grow ${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {magazine.description}
                  </p>

                  {magazine.topics && magazine.topics.length > 0 && (
                    <div className="mb-4">
                      <h4 className={`font-semibold text-sm mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                        Topics Covered:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {magazine.topics.slice(0, 5).map((topic, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs ${isDark
                              ? 'bg-gray-800 text-gray-400'
                              : 'bg-gray-100 text-gray-700'
                              }`}
                          >
                            {topic}
                          </span>
                        ))}
                        {magazine.topics.length > 5 && (
                          <span className={`px-2 py-1 rounded text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                            +{magazine.topics.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Download Button */}
                  <a
                    href={magazine.pdfUrl}
                    download={`${magazine.title.replace(/[^a-z0-9]/gi, '_')}.pdf`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition font-semibold shadow-lg hover:shadow-xl"
                  >
                    <i className="fas fa-download"></i>
                    Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        {sortedMagazines.length > 0 && (
          <div className={`mt-12 p-6 rounded-xl text-center ${isDark ? 'glass-panel' : 'bg-white shadow-lg border border-gray-200'
            }`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <i className="fas fa-info-circle mr-2 text-pink-500"></i>
              Showing {sortedMagazines.length} magazine{sortedMagazines.length !== 1 ? 's' : ''}
              {selectedYear !== 'all' && ` for ${selectedYear}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Magazines;
