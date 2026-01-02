import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Magazines = () => {
  const { magazines } = useData();
  const [selectedYear, setSelectedYear] = useState('all');

  const safeMagazines = Array.isArray(magazines) ? magazines : [];

  // Extract unique years from magazines and sort them
  const availableYears = useMemo(() => {
    const years = [...new Set(safeMagazines.map(mag => mag.year).filter(year => year))];
    return years.sort((a, b) => b - a); // Sort descending (newest first)
  }, [safeMagazines]);

  // Filter magazines by selected year
  const filteredMagazines = selectedYear === 'all'
    ? safeMagazines
    : safeMagazines.filter(mag => mag.year === parseInt(selectedYear));

  const getYearClass = (year) => {
    const isActive = selectedYear === year;
    return `group px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${isActive
      ? 'bg-gradient-to-r from-pink-500 via-orange-500 to-red-600 text-white shadow-[0_8px_30px_rgba(236,72,153,0.5)] scale-105 border-2 border-pink-400/50'
      : 'bg-gray-800/50 text-gray-400 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white hover:shadow-lg hover:scale-[1.02] border-2 border-gray-700 hover:border-pink-400/30'
      }`;
  };

  return (
    <div className="animate-fadeIn min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center mb-8">
          <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
            <i className="fas fa-book-open mr-3"></i>
            Chemistry Magazine
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Monthly chemistry magazine with latest topics, problems, and insights
          </p>
        </div>

        {/* Year Filter Tabs */}
        {availableYears.length > 0 && (
          <div className="mb-10">
            <div className="glass-panel rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <i className="fas fa-calendar-alt text-pink-400"></i>
                  Filter by Year
                </h3>
                <span className="text-sm text-gray-400 hidden sm:block">
                  {selectedYear === 'all' ? 'All Years' : selectedYear}
                </span>
              </div>
              <div className="overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex gap-3 min-w-max lg:min-w-0 lg:flex-wrap lg:justify-start">
                  <button
                    onClick={() => setSelectedYear('all')}
                    className={getYearClass('all')}
                  >
                    <i className="fas fa-th-large mr-2"></i>
                    All Years
                  </button>
                  {availableYears.map(year => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year.toString())}
                      className={getYearClass(year.toString())}
                    >
                      <i className="fas fa-calendar mr-2"></i>
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Magazines Grid */}
        {filteredMagazines.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl">
            <i className="fas fa-book-open text-6xl text-gray-600 mb-4"></i>
            <h3 className="text-2xl font-bold text-white mb-2">
              {selectedYear === 'all' ? 'No Magazines Available' : `No Magazines for ${selectedYear}`}
            </h3>
            <p className="text-gray-400">
              {selectedYear === 'all' ? 'New magazines will be published soon!' : 'Try selecting a different year'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredMagazines.map((magazine) => (
              <div key={magazine._id} className="glass-panel rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300">
                {magazine.coverImageUrl && magazine.coverImageUrl.trim() !== '' ? (
                  <div className="w-full aspect-[1/1.414] overflow-hidden bg-gray-900 relative">
                    <img
                      src={magazine.coverImageUrl}
                      alt={magazine.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Image failed to load for:', magazine.title);
                        e.target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full flex flex-col items-center justify-center text-center p-4 bg-gray-800';
                        fallback.innerHTML = '<i class="fas fa-book-open text-6xl text-gray-600 mb-3"></i><p class="text-gray-500 text-sm">Cover image not available</p>';
                        e.target.parentElement.appendChild(fallback);
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[1/1.414] bg-gray-900 flex flex-col items-center justify-center">
                    <i className="fas fa-book-open text-6xl text-gray-700 mb-3"></i>
                    <p className="text-gray-600 text-sm">No cover image</p>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    {magazine.edition && (
                      <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs font-semibold">
                        {magazine.edition}
                      </span>
                    )}
                    {magazine.month && magazine.year && (
                      <span className="text-gray-400 text-sm">
                        {magazine.month} {magazine.year}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{magazine.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{magazine.description}</p>

                  {magazine.topics && Array.isArray(magazine.topics) && magazine.topics.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-white font-semibold text-sm mb-2">Topics Covered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {magazine.topics.map((topic, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      // Handle both base64 and URL formats
                      if (magazine.pdfUrl.startsWith('data:')) {
                        // Base64 PDF - create a blob and download
                        const link = document.createElement('a');
                        link.href = magazine.pdfUrl;
                        link.download = `${magazine.title.replace(/[^a-z0-9]/gi, '_')}_${magazine.month}_${magazine.year}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      } else {
                        // Regular URL - open in new tab
                        window.open(magazine.pdfUrl, '_blank');
                      }
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition font-semibold"
                  >
                    <i className="fas fa-download"></i>
                    Download Magazine
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Magazines;
