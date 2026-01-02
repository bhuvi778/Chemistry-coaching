import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { createPortal } from 'react-dom';

const TeacherVideos = () => {
  const { videos } = useData();
  const [downloadingId, setDownloadingId] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizUrl, setQuizUrl] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  // Filter videos with valid youtubeId and isActive status, limit to 4 for one row
  const validVideos = Array.isArray(videos)
    ? videos.filter(video => video?.youtubeId && video?.isActive !== false).slice(0, 4)
    : [];

  const handleOpenQuiz = async (video) => {
    // Identify if PDF or Link
    const isPdf = video.quizPdf && (video.quizPdf.filename || video.quizPdf.data);
    const isLink = video.quizLink && video.quizLink.trim() !== '';

    if (!isPdf && !isLink) return;

    if (isPdf) {
      // PDF Logic
      setDownloadingId(video._id + '_quiz');
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

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-white mb-4">
          Learn From <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">The Best</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore the concepts with India's most experienced Teachers!
        </p>
      </div>

      {validVideos.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <i className="fas fa-video text-6xl mb-4 opacity-50"></i>
          <p className="text-xl">No videos available yet. Check back soon!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {validVideos.map((video, index) => (
              <div
                key={video._id || index}
                className="group glass-panel rounded-2xl overflow-hidden hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] transition-all duration-300 cursor-pointer"
              >
                {/* YouTube Thumbnail with Play Button */}
                <div className="relative aspect-video bg-gray-900">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
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
                  {/* Category Badge */}
                  {video.category && (
                    <div className="absolute top-2 left-2 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs text-cyan-400 font-bold uppercase">
                      {video.category}
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{video.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs">
                      <i className="fas fa-chalkboard-teacher"></i>
                      <span>{video.instructor}</span>
                    </div>
                    {video.duration && (
                      <div className="text-gray-500 text-xs">
                        <i className="far fa-clock mr-1"></i>
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleWatchVideo(video);
                      }}
                      className="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <i className="fab fa-youtube mr-2"></i>
                      Learn & Crack
                    </button>
                    {video.classNotes && (video.classNotes.filename || video.classNotes.data || Object.keys(video.classNotes).length > 0) ? (
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
                        className="block w-full text-center bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        {downloadingId === video._id ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-file-pdf mr-2"></i>
                            Class Notes
                          </>
                        )}
                      </button>
                    ) : (
                      <Link
                        to="/lectures"
                        className="block w-full text-center bg-gray-700 text-gray-300 font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 hover:bg-gray-600"
                      >
                        <i className="fas fa-video mr-2"></i>
                        View Details
                      </Link>
                    )}

                    {/* Take Quiz Button - supports both PDF and Link */}
                    {(video.quizPdf && (video.quizPdf.filename || video.quizPdf.data)) || (video.quizLink && video.quizLink.trim() !== '') ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenQuiz(video);
                        }}
                        disabled={downloadingId === video._id + '_quiz'}
                        className="block w-full text-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
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
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/lectures"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-all transform hover:scale-105"
            >
              <i className="fab fa-youtube text-2xl"></i>
              View All Video Lectures
            </Link>
          </div>
        </>
      )}

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
    </section>
  );
};

export default TeacherVideos;
