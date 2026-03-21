import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NCERTTabs from '../components/NCERT/NCERTTabs';
import { fetchNCERTChapters, fetchNCERTTopics, fetchNCERTQuestions, fetchNCERTProgress } from '../services/ncertApi';
import Pagination from '../components/UI/Pagination';

const NCERTLineByLine = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');

      // Fetch chapters and user progress
      const [chaptersData, userProgress] = await Promise.all([
        fetchNCERTChapters('line-by-line'),
        userId ? fetchNCERTProgress(userId) : Promise.resolve([])
      ]);

      // Enrich chapters with topic count, question count, and progress
      const enrichedChapters = await Promise.all(
        chaptersData.map(async (chapter) => {
          try {
            // Fetch topics and questions for this chapter
            const [topics, questions] = await Promise.all([
              fetchNCERTTopics(chapter._id),
              fetchNCERTQuestions({ chapterId: chapter._id, category: 'line-by-line' })
            ]);

            // Calculate progress and attempts
            let completedCount = 0;
            let attemptedCount = 0;

            if (questions.length > 0) {
              const completedSet = new Set();
              const attemptedSet = new Set();

              if (userProgress && Array.isArray(userProgress)) {
                userProgress.forEach(p => {
                  attemptedSet.add(p.questionId);
                  if (p.isCompleted) completedSet.add(p.questionId);
                });
              }

              questions.forEach(q => {
                if (completedSet.has(q._id)) completedCount++;
                if (attemptedSet.has(q._id)) attemptedCount++;
              });
            }

            const progress = questions.length > 0
              ? Math.round((completedCount / questions.length) * 100)
              : 0;

            // Calculate unattempted
            const unattemptedQuestionsCount = questions.length - attemptedCount;

            return {
              ...chapter,
              topicCount: topics.length,
              questionCount: questions.length,
              completedCount,
              attemptedCount,
              unattemptedQuestionsCount,
              progress
            };
          } catch (error) {
            console.error(`Error enriching chapter ${chapter._id}:`, error);
            return {
              ...chapter,
              topicCount: 0,
              questionCount: 0,
              completedCount: 0,
              attemptedCount: 0,
              unattemptedQuestionsCount: 0,
              progress: 0
            };
          }
        })
      );

      setChapters(enrichedChapters);
    } catch (error) {
      console.error('Failed to load chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter chapters based on search
  const filteredChapters = chapters.filter(chapter =>
    chapter.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.chapterNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredChapters.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedChapters = filteredChapters.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate total topics and questions across all chapters
  const totalTopics = chapters.reduce((sum, ch) => sum + (ch.topicCount || 0), 0);
  const totalQuestions = chapters.reduce((sum, ch) => sum + (ch.questionCount || 0), 0);

  // Calculate stats for tabs
  const tabStats = {
    'line-by-line': {
      chapters: chapters.length,
      questions: totalTopics
    }
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
          <span className="text-white">NCERT Line by Line Questions</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            NCERT Toolbox
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Master NCERT concepts with topic-wise practice questions organized chapter by chapter
          </p>

          {/* Statistics Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="px-5 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2">
              <i className="fas fa-book text-cyan-400"></i>
              <span className="text-white font-semibold">
                {chapters.length} Chapters
              </span>
            </div>
            <div className="px-5 py-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center gap-2">
              <i className="fas fa-question-circle text-purple-400"></i>
              <span className="text-white font-semibold">
                {totalQuestions} Questions
              </span>
            </div>
          </div>

          <NCERTTabs stats={tabStats} />
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition"
            />
            <i className="fas fa-search absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading chapters...</p>
          </div>
        )}

        {paginatedChapters.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedChapters.map((chapter) => (
                <div
                  key={chapter._id}
                  className="group glass-panel rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col h-full relative overflow-hidden"
                  onClick={() => navigate(`/ncert-toolbox/line-by-line/${chapter._id}`)}
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Class Level Badge */}
                  {chapter.classLevel && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${chapter.classLevel === '11'
                        ? 'from-purple-500 to-pink-500'
                        : 'from-blue-500 to-cyan-500'
                        } text-white shadow-lg`}>
                        Class {chapter.classLevel}
                      </span>
                    </div>
                  )}

                  <div className="relative z-10">
                    {/* Chapter Icon */}
                    <div className={`w-16 h-16 rounded-xl bg-${chapter.color || 'cyan'}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <i className={`fas ${chapter.icon || 'fa-flask'} text-${chapter.color || 'cyan'}-400 text-2xl`}></i>
                    </div>

                    {/* Chapter Info */}
                    <div className="mb-4 flex-grow">
                      <div className="text-sm text-gray-400 mb-1">{chapter.chapterNumber}</div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {chapter.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {chapter.description}
                      </p>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                        <span className="text-gray-400 flex items-center">
                          <i className="fas fa-list-ol mr-1"></i>
                          {chapter.topicCount || 0}
                        </span>

                        {/* Attempted */}
                        {chapter.attemptedCount > 0 && (
                          <span className="text-blue-400 font-medium flex items-center">
                            <i className="fas fa-check mr-1"></i>
                            {chapter.attemptedCount} Attempted
                          </span>
                        )}

                        {/* Unattempted */}
                        {chapter.unattemptedQuestionsCount > 0 && (
                          <span className="text-gray-400 font-medium flex items-center">
                            <i className="fas fa-circle-notch mr-1"></i>
                            {chapter.unattemptedQuestionsCount} Unattempted
                          </span>
                        )}

                        {chapter.progress === 100 && (
                          <span className="text-green-400 font-semibold flex items-center">
                            <i className="fas fa-check-circle mr-1"></i>
                            Complete
                          </span>
                        )}
                      </div>
                      {/* Progress Bar */}
                      {(chapter.progress || 0) > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-400">Progress</span>
                            <span className="text-xs font-semibold text-cyan-400">{chapter.progress || 0}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                              style={{ width: `${chapter.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                      <span className="text-sm text-gray-400">View Topics</span>
                      <i className="fas fa-arrow-right text-cyan-400 group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredChapters.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        {/* No Results */}
        {!loading && filteredChapters.length === 0 && (
          <div className="text-center py-20">
            <i className="fas fa-search text-gray-600 text-6xl mb-4"></i>
            <p className="text-gray-400 text-lg">
              {searchQuery ? `No chapters found matching "${searchQuery}"` : 'No chapters available yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NCERTLineByLine;
