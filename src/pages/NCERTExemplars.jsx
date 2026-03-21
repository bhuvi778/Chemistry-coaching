import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NCERTTabs from '../components/NCERT/NCERTTabs';
import { fetchNCERTBadges, fetchNCERTStats } from '../services/ncertApi';
import Pagination from '../components/UI/Pagination';

const NCERTExemplars = () => {
  const navigate = useNavigate();
  const [badges, setBadges] = useState([]);
  const [ncertStats, setNcertStats] = useState({ chapters: 0, topics: 0, questions: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [badgesData, statsData] = await Promise.all([
        fetchNCERTBadges('exemplars'),
        fetchNCERTStats('exemplars').catch(() => ({ chapters: 0, topics: 0, questions: 0 }))
      ]);
      setBadges(badgesData);
      setNcertStats(statsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter based on search
  const filteredBadges = badges.filter(badge =>
    badge.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    badge.badgeType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredBadges.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBadges = filteredBadges.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate stats for tabs
  const tabStats = {
    'exemplars': {
      chapters: ncertStats.chapters,
      questions: ncertStats.questions
    }
  };

  // Navigate directly to questions viewer
  const handleBadgeClick = (badgeType) => {
    navigate(`/ncert-toolbox/exemplars/${badgeType}/questions`);
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/ncert-toolbox" className="hover:text-cyan-400 transition">
            <i className="fas fa-tools mr-2"></i>NCERT Toolbox
          </Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-white">NCERT Exemplar Problems</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            NCERT Toolbox
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Master advanced concepts with NCERT Exemplar problems - Premium JEE & NEET level questions
          </p>

          {/* Statistics Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="px-5 py-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center gap-2">
              <i className="fas fa-book text-purple-400"></i>
              <span className="text-white font-semibold">{ncertStats.chapters} Chapters</span>
            </div>
            <div className="px-5 py-2.5 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center gap-2">
              <i className="fas fa-question-circle text-pink-400"></i>
              <span className="text-white font-semibold">{ncertStats.questions} Questions</span>
            </div>
          </div>

          <NCERTTabs stats={tabStats} />
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search question types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
            />
            <i className="fas fa-search absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading exemplar types...</p>
          </div>
        )}

        {paginatedBadges.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedBadges.map((badge) => (
                <div
                  key={badge._id}
                  className="group glass-panel rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden"
                  onClick={() => handleBadgeClick(badge.badgeType)}
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Class Level Badge */}
                  {badge.classLevel && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${badge.classLevel === '11'
                        ? 'from-purple-500 to-pink-500'
                        : 'from-blue-500 to-cyan-500'
                        } text-white shadow-lg`}>
                        Class {badge.classLevel}
                      </span>
                    </div>
                  )}

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl bg-${badge.color || 'purple'}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <i className={`fas ${badge.icon || 'fa-graduation-cap'} text-${badge.color || 'purple'}-400 text-2xl`}></i>
                    </div>

                    <div className="mb-3">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {badge.badgeType || 'Exemplar Type'}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {badge.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {badge.description}
                    </p>

                    {/* Action Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <span className="text-sm text-gray-400">Start Practice</span>
                      <i className="fas fa-arrow-right text-purple-400 group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredBadges.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        {/* No Results */}
        {!loading && filteredBadges.length === 0 && (
          <div className="text-center py-20 glass-panel rounded-xl border border-gray-700">
            <i className="fas fa-search text-gray-600 text-6xl mb-4"></i>
            <h3 className="text-xl font-bold text-white mb-2">
              {searchQuery ? 'No Question Types Found' : 'No Question Types Available'}
            </h3>
            <p className="text-gray-400">
              {searchQuery ? `No question types found matching "${searchQuery}"` : 'Admin has not added any exemplar types yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NCERTExemplars;
