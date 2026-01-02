import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../context/DataContext';
import Pagination from '../components/UI/Pagination';

const Lectures = () => {
  const { videos } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedPlaylist, setSelectedPlaylist] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizUrl, setQuizUrl] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
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
  }, [selectedCategory, selectedExam, selectedPlaylist]);

  const safeVideos = Array.isArray(videos) ? videos : [];

  // Filter videos: must have valid youtubeId AND be active
  const validVideos = safeVideos.filter(video => video?.youtubeId && video?.isActive !== false);

  // Extract unique playlists/chapters from videos
  const uniquePlaylists = ['all', ...new Set(
    validVideos
      .map(video => video.chapterName)
      .filter(name => name && name.trim() !== '')
  )].sort((a, b) => {
    if (a === 'all') return -1;
    if (b === 'all') return 1;
    return a.localeCompare(b);
  });

  const filteredVideos = validVideos.filter(video => {
    const categoryMatch = selectedCategory === 'all' || video.category === selectedCategory;
    const examMatch = selectedExam === 'all' || video.examType === selectedExam;
    const playlistMatch = selectedPlaylist === 'all' || video.chapterName === selectedPlaylist;
    return categoryMatch && examMatch && playlistMatch;
  });

  // Debug: Log first video to check quizLink and quizPdf
  useEffect(() => {
    if (filteredVideos.length > 0) {
      console.log('Sample video data:', {
        title: filteredVideos[0].title,
        quizLink: filteredVideos[0].quizLink,
        hasQuizLink: !!filteredVideos[0].quizLink && filteredVideos[0].quizLink.trim() !== '',
        quizPdf: filteredVideos[0].quizPdf,
        hasQuizPdf: !!filteredVideos[0].quizPdf && (filteredVideos[0].quizPdf.filename || filteredVideos[0].quizPdf.data)
      });
    }
  }, [filteredVideos]);

  const handleOpenQuiz = async (video) => {
    // Identify if PDF or Link
    const isPdf = video.quizPdf && (video.quizPdf.filename || video.quizPdf.data);
    const isLink = video.quizLink && video.quizLink.trim() !== '';

    if (!isPdf && !isLink) return;

    if (isPdf) {
      // PDF Logic
      setDownloadingId(video._id + '_quiz'); // Show loading on button
      let dataUrl = video.quizPdf.data;

      if (!dataUrl) {
        try {
          const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
          const apiUrl = cleanBaseUrl.endsWith('/api')
            ? `${cleanBaseUrl}/videos/${video._id}`
            : `${cleanBaseUrl}/api/videos/${video._id}`;

          const response = await fetch(apiUrl);
          const fullVideo = await response.json();

          if (fullVideo && fullVideo.quizPdf && fullVideo.quizPdf.data) {
            dataUrl = fullVideo.quizPdf.data;
          } else {
            alert('Error: Quiz PDF data not found');
            setDownloadingId(null);
            return;
          }
        } catch (err) {
          console.error('Error fetching quiz PDF:', err);
          alert('Failed to load quiz PDF');
          setDownloadingId(null);
          return;
        }
      }

      setQuizUrl(dataUrl);
      setQuizTitle(video.title + ' - Quiz');
      setShowQuizModal(true);
      setDownloadingId(null);

    } else {
      // Link Logic
      setQuizUrl(video.quizLink);
      setQuizTitle(video.title + ' - Quiz');
      setShowQuizModal(true);
    }
  };

  const handleWatchVideo = (video) => {
    if (!video.youtubeId) return;

    // Set video URL for iframe (embed format)
    setVideoUrl(`https://www.youtube.com/embed/${video.youtubeId}`);
    setVideoTitle(video.title);
    setShowVideoModal(true);
  };

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* Playlist/Chapter Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">
                <i className="fas fa-list mr-2 text-purple-400"></i>
                Filter by Playlist
              </label>
              <select
                value={selectedPlaylist}
                onChange={(e) => setSelectedPlaylist(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-purple-400 transition"
              >
                {uniquePlaylists.map((playlist) => (
                  <option key={playlist} value={playlist}>
                    {playlist === 'all' ? 'All Playlists' : playlist}
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
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleWatchVideo(video);
                          }}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all cursor-pointer"
                        >
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <i className="fas fa-play text-white text-xl ml-1"></i>
                          </div>
                        </button>
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

                    <div className="flex items-center gap-2 text-cyan-400 text-xs mb-4">
                      <i className="fas fa-chalkboard-teacher"></i>
                      <span>{video.instructor}</span>
                    </div>

                    {/* Watch Now Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleWatchVideo(video);
                      }}
                      className="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <i className="fab fa-youtube mr-2"></i>
                      Watch Now
                    </button>

                    {/* Class Notes Button */}
                    {video.classNotes && (video.classNotes.filename || video.classNotes.data) ? (
                      <button
                        onClick={async () => {
                          const notes = video.classNotes;
                          let dataUrl = notes.data;

                          if (!dataUrl) {
                            try {
                              setDownloadingId(video._id);
                              // Fetch full video details to get the PDF data
                              const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                              // Remove trailing slash if present
                              const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                              // Check if /api is already included to prevent duplication
                              const apiUrl = cleanBaseUrl.endsWith('/api')
                                ? `${cleanBaseUrl}/videos/${video._id}`
                                : `${cleanBaseUrl}/api/videos/${video._id}`;

                              const response = await fetch(apiUrl);
                              const fullVideo = await response.json();

                              if (fullVideo && fullVideo.classNotes && fullVideo.classNotes.data) {
                                dataUrl = fullVideo.classNotes.data;
                              } else {
                                alert('Error: Note data not found');
                                setDownloadingId(null);
                                return;
                              }
                            } catch (err) {
                              console.error('Error fetching notes:', err);
                              alert('Failed to download notes');
                              setDownloadingId(null);
                              return;
                            }
                          }

                          // Create a download link for the PDF
                          const linkSource = dataUrl;

                          if (!linkSource || !linkSource.startsWith('data:application/pdf')) {
                            alert('Invalid PDF data received from server');
                            setDownloadingId(null);
                            return;
                          }

                          const downloadLink = document.createElement('a');
                          downloadLink.href = linkSource;
                          downloadLink.download = notes.filename || `${video.title}-notes.pdf`;
                          document.body.appendChild(downloadLink);
                          downloadLink.click();
                          document.body.removeChild(downloadLink);
                          setDownloadingId(null);
                        }}
                        disabled={downloadingId === video._id}
                        className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg mt-2"
                      >
                        {downloadingId === video._id ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-file-pdf mr-2"></i>
                            Download Class Notes
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="block w-full text-center bg-gray-800 text-gray-500 font-semibold py-2.5 px-4 rounded-lg mt-2 cursor-not-allowed border border-gray-700"
                      >
                        <i className="fas fa-file-pdf mr-2"></i>
                        No Notes Available
                      </button>
                    )}

                    {/* Take Quiz Button - supports both PDF and Link */}
                    {(video.quizPdf && (video.quizPdf.filename || video.quizPdf.data)) || (video.quizLink && video.quizLink.trim() !== '') ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenQuiz(video);
                        }}
                        disabled={downloadingId === video._id + '_quiz'}
                        className="block w-full text-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg mt-2"
                      >
                        {downloadingId === video._id + '_quiz' ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Loading Quiz...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-clipboard-check mr-2"></i>
                            Take Quiz
                          </>
                        )}
                      </button>
                    ) : null}
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

      {/* Quiz Modal */}
      {showQuizModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-gray-900 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-gray-700 shadow-2xl relative">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fas fa-clipboard-check text-yellow-400"></i>
                {quizTitle}
              </h3>
              <button
                onClick={() => setShowQuizModal(false)}
                className="w-8 h-8 rounded-full bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white flex items-center justify-center transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Content (Iframe) */}
            <div className="flex-1 bg-white relative">
              <iframe
                src={quizUrl}
                title="Quiz Content"
                className="w-full h-full border-none"
                allow="autoplay; encrypted-media"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Video Modal */}
      {showVideoModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-gray-900 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-gray-700 shadow-2xl relative">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fab fa-youtube text-red-500"></i>
                {videoTitle}
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="w-8 h-8 rounded-full bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white flex items-center justify-center transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Content (Iframe) */}
            <div className="flex-1 bg-black relative">
              <iframe
                src={videoUrl}
                title="Video Player"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Lectures;
