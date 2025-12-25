import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const TeacherVideos = () => {
  const { videos } = useData();
  const [downloadingId, setDownloadingId] = useState(null);

  // Filter videos with valid youtubeId and isActive status, limit to 4 for one row
  const validVideos = Array.isArray(videos)
    ? videos.filter(video => video?.youtubeId && video?.isActive !== false).slice(0, 4)
    : [];

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
                    <a
                      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <i className="fab fa-youtube mr-2"></i>
                      Learn & Crack
                    </a>
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
    </section>
  );
};

export default TeacherVideos;
