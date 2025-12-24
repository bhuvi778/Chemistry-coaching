import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import Pagination from '../components/UI/Pagination';

const Lectures = () => {
  const { videos } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 12; // 3 rows × 4 columns

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

  const safeVideos = Array.isArray(videos) ? videos : [];
  
  // Filter videos: must have valid youtubeId AND be active
  const validVideos = safeVideos.filter(video => video?.youtubeId && video?.isActive !== false);
  
  const filteredVideos = validVideos.filter(video => {
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
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <i className="fas fa-filter text-red-400"></i>
            Filter Video Lectures
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exam Type Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">
                <i className="fas fa-graduation-cap mr-2 text-red-400"></i>
                Filter by Exam
              </label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-red-400 transition"
              >
                <option value="all">All Exams</option>
                <optgroup label="Engineering Entrance">
                  <option value="JEE">JEE (Main & Advanced)</option>
                  <option value="GATE">GATE</option>
                </optgroup>
                <optgroup label="Medical Entrance">
                  <option value="NEET">NEET</option>
                  <option value="AIIMS">AIIMS</option>
                </optgroup>
                <optgroup label="Science Entrance">
                  <option value="IAT">IAT (IISER Aptitude Test)</option>
                  <option value="NEST">NEST (National Entrance Screening Test)</option>
                  <option value="KVPY">KVPY (Kishore Vaigyanik Protsahan Yojana)</option>
                  <option value="TIFR">TIFR (Tata Institute)</option>
                </optgroup>
                <optgroup label="Post Graduate">
                  <option value="CSIR NET">CSIR NET</option>
                  <option value="IIT JAM">IIT JAM</option>
                </optgroup>
                <optgroup label="Other Competitive">
                  <option value="OLYMPIAD">Olympiad (Chemistry/Physics/Math)</option>
                  <option value="CUET">CUET (Common University Entrance Test)</option>
                </optgroup>
                <optgroup label="School Level">
                  <option value="BOARDS">Board Exams (CBSE/State - 11th/12th)</option>
                </optgroup>
              </select>
            </div>

            {/* Chemistry Category Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">
                <i className="fas fa-flask mr-2 text-blue-400"></i>
                Filter by Chemistry Type
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-400 transition"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
                    {video.youtubeId ? (
                      <>
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/default.jpg`;
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
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="text-center">
                          <i className="fab fa-youtube text-gray-600 text-6xl mb-2"></i>
                          <p className="text-red-400 text-sm">Invalid Video ID</p>
                        </div>
                      </div>
                    )}

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
