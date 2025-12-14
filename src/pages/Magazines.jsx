import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Magazines = () => {
  const { magazines } = useData();

  return (
    <div className="animate-fadeIn min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center mb-8">
          <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent">
            <i className="fas fa-book-open mr-3"></i>
            Chemistry Magazine
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Monthly chemistry magazine with latest topics, problems, and insights
          </p>
        </div>

        {/* Magazines Grid */}
        {magazines.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl">
            <i className="fas fa-book-open text-6xl text-gray-600 mb-4"></i>
            <h3 className="text-2xl font-bold text-white mb-2">No Magazines Available</h3>
            <p className="text-gray-400">New magazines will be published soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {magazines.map((magazine) => (
              <div key={magazine._id} className="glass-panel rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300">
                {magazine.coverImageUrl && (
                  <img 
                    src={magazine.coverImageUrl} 
                    alt={magazine.title}
                    className="w-full h-80 object-cover"
                  />
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
                  
                  {magazine.topics && magazine.topics.length > 0 && (
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
                  
                  <a 
                    href={magazine.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    download
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition font-semibold"
                  >
                    <i className="fas fa-download"></i>
                    Download Magazine
                  </a>
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
