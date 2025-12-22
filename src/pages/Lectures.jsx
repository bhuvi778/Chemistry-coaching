import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import Pagination from '../components/UI/Pagination';

const Lectures = () => {
  const { videos } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 12;

  const categories = [
    { id: 'all', name: 'All Videos', icon: 'fa-video' },
    { id: 'organic', name: 'Organic Chemistry', icon: 'fa-leaf' },
    { id: 'inorganic', name: 'Inorganic Chemistry', icon: 'fa-atom' },
    { id: 'physical', name: 'Physical Chemistry', icon: 'fa-flask' },
    { id: 'general', name: 'General Chemistry', icon: 'fa-book' },
    { id: 'other', name: 'Other Topics', icon: 'fa-star' }
  ];

  // Reset to page 1 when category or exam changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedExam]);

  const filteredVideos = videos.filter(video => {
    const categoryMatch = selectedCategory === 'all' || video.category === selectedCategory;
    const examMatch = selectedExam === 'all' || video.examType === selectedExam;
    return categoryMatch && examMatch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);

  return (
    <div className="min-h-screen py-20 animate-fadeIn">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Lectures</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Learn chemistry concepts from India's most experienced teachers. Watch, understand, and master every topic!
          </p>
        </div>

        {/* YouTube Channel Button */}
        <div className="text-center mb-8">
          <a
            href="https://www.youtube.com/@YourChannelName"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-all transform hover:scale-105"
          >
            <i className="fab fa-youtube text-3xl"></i>
            <div className="text-left">
              <div className="text-sm opacity-80">Subscribe to our</div>
              <div className="text-lg">YouTube Channel</div>
            </div>
          </a>
        </div>

        {/* Filter Panel */}
        <div className="glass-panel rounded-2xl p-6 mb-8">
          {/* Chemistry Category Tiles */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-flask text-blue-400"></i>
              Filter by Chemistry Type
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-400 text-white shadow-lg shadow-blue-500/50'
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-blue-400 hover:bg-gray-700'
                  }`}
                >
                  <i className={`fas ${category.icon} text-2xl mb-2 block`}></i>
                  <span className="text-sm font-semibold">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Exam Type Tiles */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-graduation-cap text-red-400"></i>
              Filter by Exam
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { id: 'all', name: 'All Exams', icon: 'fa-globe' },
                { id: 'JEE', name: 'JEE', icon: 'fa-cog' },
                { id: 'NEET', name: 'NEET', icon: 'fa-heartbeat' },
                { id: 'GATE', name: 'GATE', icon: 'fa-graduation-cap' },
                { id: 'AIIMS', name: 'AIIMS', icon: 'fa-hospital' },
                { id: 'IAT', name: 'IAT', icon: 'fa-atom' },
                { id: 'NEST', name: 'NEST', icon: 'fa-microscope' },
                { id: 'KVPY', name: 'KVPY', icon: 'fa-award' },
                { id: 'TIFR', name: 'TIFR', icon: 'fa-flask' },
                { id: 'CSIR NET', name: 'CSIR NET', icon: 'fa-certificate' },
                { id: 'IIT JAM', name: 'IIT JAM', icon: 'fa-university' },
                { id: 'OLYMPIAD', name: 'Olympiad', icon: 'fa-medal' },
                { id: 'CUET', name: 'CUET', icon: 'fa-book-reader' },
                { id: 'BOARDS', name: 'Boards', icon: 'fa-chalkboard-teacher' }
              ].map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => setSelectedExam(exam.id)}
                  className={`p-3 rounded-lg border-2 transition-all transform hover:scale-105 ${
                    selectedExam === exam.id
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 border-red-400 text-white shadow-lg shadow-red-500/50'
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-red-400 hover:bg-gray-700'
                  }`}
                >
                  <i className={`fas ${exam.icon} text-xl mb-1 block`}></i>
                  <span className="text-sm font-semibold">{exam.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="max-w-7xl mx-auto px-4">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-20">
            <i className="fas fa-video text-6xl text-gray-600 mb-4"></i>
            <h3 className="text-2xl font-bold text-white mb-2">No Videos Found</h3>
            <p className="text-gray-400">
              {selectedCategory === 'all'
                ? 'No videos available yet. Check back soon!'
                : 'No videos in this category yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div className="text-gray-400">
                <i className="fas fa-play-circle mr-2"></i>
                Showing {indexOfFirstVideo + 1}-{Math.min(indexOfLastVideo, filteredVideos.length)} of {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
              </div>
              {totalPages > 1 && (
                <div className="text-gray-400 text-sm">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentVideos.map((video, index) => (
                <div
                  key={video._id || index}
                  className="group glass-panel rounded-2xl overflow-hidden hover:shadow-[0_0_30px_rgba(255,0,0,0.3)] transition-all duration-300"
                >
                  {/* YouTube Thumbnail */}
                  <div className="relative aspect-video bg-gray-900">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                      }}
                    />

                    {/* Play Button Overlay */}
                    <a
                      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all"
                    >
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <i className="fas fa-play text-white text-xl ml-1"></i>
                      </div>
                    </a>

                    {/* Category Badge */}
                    {video.category && (
                      <div className="absolute top-2 left-2 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs text-cyan-400 font-bold uppercase">
                        {video.category}
                      </div>
                    )}

                    {/* Duration Badge */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs text-white font-semibold">
                        <i className="far fa-clock mr-1"></i>
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition">
                      {video.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {video.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-cyan-400 text-xs">
                        <i className="fas fa-chalkboard-teacher"></i>
                        <span>{video.instructor}</span>
                      </div>
                      {video.views && (
                        <div className="text-gray-500 text-xs">
                          <i className="fas fa-eye mr-1"></i>
                          {video.views}
                        </div>
                      )}
                    </div>

                    {/* Watch Now Button */}
                    <a
                      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <i className="fab fa-youtube mr-2"></i>
                      Watch Now
                    </a>

                    {/* Class Notes Button */}
                    {video.classNotes && video.classNotes.data && (
                      <button
                        onClick={() => {
                          // Create a download link for the PDF
                          const linkSource = video.classNotes.data;
                          const downloadLink = document.createElement('a');
                          downloadLink.href = linkSource;
                          downloadLink.download = video.classNotes.filename || `${video.title}-notes.pdf`;
                          downloadLink.click();
                        }}
                        className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg mt-2"
                      >
                        <i className="fas fa-file-pdf mr-2"></i>
                        Download Class Notes
                      </button>
                    )}

                    {/* TEMPORARY: Test button - remove after testing */}
                    {!video.classNotes && (
                      <button
                        disabled
                        className="block w-full text-center bg-gray-600 text-gray-400 font-semibold py-2.5 px-4 rounded-lg mt-2 cursor-not-allowed opacity-50"
                      >
                        <i className="fas fa-file-pdf mr-2"></i>
                        No Class Notes Available
                      </button>
                    )}
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
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 py-16 mt-12">
        <div className="glass-panel rounded-2xl p-12 text-center border border-red-500/20">
          <i className="fab fa-youtube text-6xl text-red-500 mb-4"></i>
          <h3 className="text-3xl font-bold text-white mb-3">
            Don't Miss Any Lecture!
          </h3>
          <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
            Subscribe to our YouTube channel and hit the bell icon to get notified about new video lectures, live sessions, and important updates.
          </p>
          <a
            href="https://www.youtube.com/@YourChannelName"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] transition-all transform hover:scale-105"
          >
            <i className="fab fa-youtube text-2xl"></i>
            Subscribe Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default Lectures;
