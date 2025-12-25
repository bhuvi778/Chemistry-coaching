import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Pagination from '../components/UI/Pagination';

const AudioBooks = () => {
  const { audioBooks } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedBooks, setExpandedBooks] = useState({});
  const [expandedChapters, setExpandedChapters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const safeAudioBooks = Array.isArray(audioBooks) ? audioBooks : [];
  const filteredAudioBooks = selectedCategory === 'all'
    ? safeAudioBooks
    : safeAudioBooks.filter(book => book.category === selectedCategory);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAudioBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredAudioBooks.slice(indexOfFirstBook, indexOfLastBook);

  const toggleBook = (bookId) => {
    setExpandedBooks(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
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
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            <i className="fas fa-headphones mr-3"></i>
            Chemistry Audio Books
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Learn chemistry on the go with our comprehensive audio book collection
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-8 flex-wrap justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full transition ${selectedCategory === 'all'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
          >
            All
          </button>
          {['General', 'JEE', 'NEET', 'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full transition ${selectedCategory === cat
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Audio Books List */}
        {filteredAudioBooks.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl">
            <i className="fas fa-headphones text-6xl text-gray-600 mb-4"></i>
            <h3 className="text-2xl font-bold text-white mb-2">No Audio Books Found</h3>
            <p className="text-gray-400">Audio books will be available soon!</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div className="text-gray-400">
                <i className="fas fa-headphones mr-2"></i>
                Showing {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, filteredAudioBooks.length)} of {filteredAudioBooks.length} {filteredAudioBooks.length === 1 ? 'book' : 'books'}
              </div>
              {totalPages > 1 && (
                <div className="text-gray-400 text-sm">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {currentBooks.map((book) => (
                <div key={book._id} className="glass-panel rounded-xl overflow-hidden">
                  {/* Book Header - Clickable */}
                  <button
                    onClick={() => toggleBook(book._id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-800/50 transition"
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      {book.thumbnailUrl && (
                        <img
                          src={book.thumbnailUrl}
                          alt={book.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{book.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{book.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                            {book.category}
                          </span>
                          {book.author && (
                            <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs">
                              <i className="fas fa-user mr-1"></i>
                              {book.author}
                            </span>
                          )}
                          {book.chapters && (
                            <span className="px-3 py-1 bg-cyan-900/50 border border-cyan-500 text-cyan-400 rounded-full text-xs">
                              {book.chapters.length} Chapters
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <i className={`fas fa-chevron-${expandedBooks[book._id] ? 'up' : 'down'} text-purple-400 text-xl`}></i>
                  </button>

                  {/* Chapters List - Expandable */}
                  {expandedBooks[book._id] && (
                    <div className="border-t border-gray-700 bg-gray-900/30 p-4">
                      {book.chapters && Array.isArray(book.chapters) && book.chapters.length > 0 ? (
                        <div className="space-y-3">
                          {book.chapters.map((chapter, chapterIndex) => {
                            const chapterId = `${book._id}-${chapterIndex}`;
                            return (
                              <div key={chapterIndex} className="bg-gray-800/50 rounded-lg overflow-hidden">
                                {/* Chapter Header - Clickable */}
                                <button
                                  onClick={() => toggleChapter(chapterId)}
                                  className="w-full p-4 flex items-center justify-between hover:bg-gray-700/50 transition"
                                >
                                  <div className="flex items-center gap-3">
                                    <i className={`fas fa-chevron-${expandedChapters[chapterId] ? 'down' : 'right'} text-cyan-400`}></i>
                                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-bold mr-2">
                                      Ch {chapterIndex + 1}
                                    </span>
                                    <span className="text-white font-semibold">{chapter.title}</span>
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {chapter.topics?.length || 0} topics
                                  </span>
                                </button>

                                {/* Topics List with Audio Players */}
                                {expandedChapters[chapterId] && (
                                  <div className="bg-gray-900/50 p-4">
                                    {chapter.topics && Array.isArray(chapter.topics) && chapter.topics.length > 0 ? (
                                      <div className="space-y-3">
                                        {chapter.topics.map((topic, topicIndex) => (
                                          <div key={topicIndex} className="bg-gray-800 rounded-lg p-4">
                                            <div className="flex items-start gap-3 mb-3">
                                              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-bold mt-1">
                                                {topicIndex + 1}
                                              </span>
                                              <i className="fas fa-headphones text-purple-400 mt-1"></i>
                                              <div className="flex-1">
                                                <h5 className="text-white font-semibold mb-1">{topic.title}</h5>
                                                {topic.description && (
                                                  <p className="text-gray-400 text-sm mb-2">{topic.description}</p>
                                                )}
                                                {topic.duration && (
                                                  <span className="text-xs text-gray-500">
                                                    <i className="fas fa-clock mr-1"></i>
                                                    {topic.duration}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            {/* Audio Player */}
                                            {topic.audioUrl && (
                                              <audio
                                                controls
                                                controlsList="nodownload"
                                                className="w-full mt-2"
                                                style={{
                                                  height: '40px',
                                                  borderRadius: '8px'
                                                }}
                                              >
                                                <source src={topic.audioUrl} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                              </audio>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-center py-6 text-gray-400">
                                        <i className="fas fa-music text-3xl mb-2 opacity-50"></i>
                                        <p>No topics available in this chapter</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <i className="fas fa-book-open text-4xl mb-3 opacity-50"></i>
                          <p className="text-lg">No chapters available yet</p>
                          <p className="text-sm mt-1">Please add chapters with topics from the admin panel</p>
                        </div>
                      )}
                    </div>
                  )}
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
  );
};

export default AudioBooks;
