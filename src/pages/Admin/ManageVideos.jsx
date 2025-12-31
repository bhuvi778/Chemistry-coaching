import { useState } from 'react';
import { useData } from '../../context/DataContext';
import Pagination from '../../components/UI/Pagination';

const ManageVideos = () => {
  const { videos, addVideo, updateVideo, deleteVideo } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 9;

  // Filter valid videos with youtubeId
  const validVideos = Array.isArray(videos) ? videos.filter(v => v?.youtubeId) : [];

  // Pagination calculations
  const totalPages = Math.ceil(validVideos.length / videosPerPage);
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = validVideos.slice(indexOfFirstVideo, indexOfLastVideo);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeId: '',
    instructor: '',
    category: 'general',
    examType: 'all',
    chapterName: '',
    duration: '',
    isActive: true,
    classNotes: null,  // Will store {data: base64, filename: string}
    quizLink: ''
  });

  const [youtubeInput, setYoutubeInput] = useState('');

  const categories = [
    { value: 'organic', label: 'Organic Chemistry' },
    { value: 'inorganic', label: 'Inorganic Chemistry' },
    { value: 'physical', label: 'Physical Chemistry' },
    { value: 'general', label: 'General Chemistry' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the data being submitted
    console.log('=== VIDEO SUBMIT DATA ===');
    console.log('Form Data:', formData);
    console.log('YouTube ID:', formData.youtubeId);
    console.log('========================');

    // Validate YouTube ID
    if (!formData.youtubeId || formData.youtubeId.length !== 11) {
      alert('Please enter a valid YouTube URL or ID (11 characters)');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingVideo) {
        await updateVideo(editingVideo._id, formData);
        setEditingVideo(null);
      } else {
        await addVideo(formData);
      }

      // Reset form after successful submission
      setYoutubeInput('');
      setFormData({
        title: '',
        description: '',
        youtubeId: '',
        instructor: '',
        category: 'general',
        examType: 'all',
        chapterName: '',
        duration: '',
        isActive: true,
        classNotes: null,
        quizLink: ''
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Error submitting video:', error);
      alert('Failed to save video. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setYoutubeInput(video.youtubeId);
    setFormData({
      title: video.title,
      description: video.description,
      youtubeId: video.youtubeId,
      instructor: video.instructor,
      category: video.category || 'general',
      examType: video.examType || 'all',
      chapterName: video.chapterName || '',
      duration: video.duration || '',
      isActive: video.isActive !== false,
      classNotes: video.classNotes || null,
      quizLink: video.quizLink || ''
    });
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      await deleteVideo(id);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingVideo(null);
    setYoutubeInput('');
    setFormData({
      title: '',
      description: '',
      youtubeId: '',
      instructor: '',
      category: 'general',
      examType: 'all',
      chapterName: '',
      duration: '',
      isActive: true,
      classNotes: null,
      quizLink: ''
    });
  };

  const extractYoutubeId = (url) => {
    if (!url || typeof url !== 'string') return '';

    // If already just an ID (11 characters, alphanumeric, -, _)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
      return url.trim();
    }

    // Extract YouTube ID from various URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2]) {
      // Extract exactly 11 characters
      const id = match[2].substring(0, 11);
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return id;
      }
    }

    return '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Manage Videos</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
        >
          <i className="fab fa-youtube mr-2"></i>
          {isAdding ? 'Cancel' : 'Add New Video'}
        </button>
      </div>

      {isAdding && (
        <div className="glass-panel p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingVideo ? 'Edit Video' : 'Add New Video'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Video Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="e.g., Organic Chemistry Basics"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Instructor Name *</label>
                <input
                  type="text"
                  required
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="e.g., Dr. Rajesh Kumar"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">YouTube Video URL or ID *</label>
              <input
                type="text"
                required
                value={youtubeInput}
                onChange={(e) => {
                  const input = e.target.value;
                  setYoutubeInput(input);
                  const extractedId = extractYoutubeId(input);
                  setFormData({ ...formData, youtubeId: extractedId });
                }}
                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-cyan-400 focus:outline-none"
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID or just VIDEO_ID"
              />
              {formData.youtubeId && formData.youtubeId !== youtubeInput && (
                <p className="text-xs text-green-400 mt-1">
                  ✓ Video ID extracted: {formData.youtubeId}
                </p>
              )}
              {youtubeInput && !formData.youtubeId && (
                <p className="text-xs text-red-400 mt-1">
                  ✗ Invalid YouTube URL or ID
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Enter full YouTube URL or just the video ID (11 characters)
              </p>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-cyan-400 focus:outline-none h-24 resize-none"
                placeholder="Brief description of the video content"
              />
            </div>

            {/* Exam Type Dropdown */}
            <div>
              <label className="block text-gray-400 mb-2">
                <i className="fas fa-graduation-cap mr-2 text-red-400"></i>
                Target Exam *
              </label>
              <select
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-red-400 focus:outline-none"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-cyan-400 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Duration (optional)</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="e.g., 45:30 or 1h 30m"
                />
              </div>
            </div>

            {/* Chapter/Playlist Name */}
            <div>
              <label className="block text-gray-400 mb-2">
                <i className="fas fa-list mr-2 text-purple-400"></i>
                Chapter/Playlist Name (optional)
              </label>
              <input
                type="text"
                value={formData.chapterName}
                onChange={(e) => setFormData({ ...formData, chapterName: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-purple-400 focus:outline-none"
                placeholder="e.g., Thermodynamics, Organic Reactions, Periodic Table"
              />
              <p className="text-xs text-gray-500 mt-1">
                Group videos into chapters or playlists for better organization
              </p>
            </div>

            {/* Class Notes PDF Upload */}
            <div>
              <label className="block text-gray-400 mb-2">
                <i className="fas fa-file-pdf mr-2 text-blue-400"></i>
                Class Notes PDF (optional)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size > 50 * 1024 * 1024) {  // 50MB limit
                      alert('File size must be less than 50MB');
                      e.target.value = '';
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({
                        ...formData,
                        classNotes: {
                          data: reader.result,
                          filename: file.name,
                          uploadedAt: new Date()
                        }
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-cyan-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {formData.classNotes && (
                <div className="mt-2 flex items-center justify-between bg-gray-900 border border-gray-700 rounded p-3">
                  <div className="flex items-center gap-2 text-green-400">
                    <i className="fas fa-check-circle"></i>
                    <span className="text-sm">{formData.classNotes.filename}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, classNotes: null })}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    <i className="fas fa-times"></i> Remove
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Upload PDF class notes for this lecture (Max 50MB)
              </p>
            </div>

            {/* Quiz Link */}
            <div>
              <label className="block text-gray-400 mb-2">
                <i className="fas fa-question-circle mr-2 text-yellow-400"></i>
                Quiz Link (optional)
              </label>
              <input
                type="url"
                value={formData.quizLink}
                onChange={(e) => setFormData({ ...formData, quizLink: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-yellow-400 focus:outline-none"
                placeholder="https://example.com/quiz or https://forms.google.com/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Add a link to an external quiz or Google Form for this video
              </p>
            </div>

            <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded p-4">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-6 h-6 rounded border-2 border-gray-600 bg-gray-900 text-cyan-500 focus:ring-2 focus:ring-cyan-400 cursor-pointer accent-cyan-500"
              />
              <label htmlFor="isActive" className="text-white font-medium cursor-pointer flex items-center gap-2">
                <span className={formData.isActive ? 'text-green-400' : 'text-red-400'}>
                  {formData.isActive ? (
                    <><i className="fas fa-eye"></i> Active - Video will be shown on website</>
                  ) : (
                    <><i className="fas fa-eye-slash"></i> Inactive - Video will be hidden</>
                  )}
                </span>
              </label>
            </div>

            {formData.youtubeId && formData.youtubeId.length === 11 && (
              <div className="mt-4">
                <label className="block text-gray-400 mb-2">
                  <i className="fab fa-youtube text-red-500 mr-2"></i>
                  Thumbnail Preview:
                </label>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-700 relative group">
                  <img
                    key={formData.youtubeId}
                    src={`https://img.youtube.com/vi/${formData.youtubeId}/hqdefault.jpg`}
                    alt="Video preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://img.youtube.com/vi/${formData.youtubeId}/default.jpg`;
                    }}
                  />
                  {/* Test Video Button Overlay */}
                  <a
                    href={`https://www.youtube.com/watch?v=${formData.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-play text-white text-xl ml-1"></i>
                      </div>
                      <span className="text-white font-bold">Test Video on YouTube</span>
                    </div>
                  </a>
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`https://www.youtube.com/watch?v=${formData.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    <i className="fab fa-youtube mr-2"></i>
                    Test Video on YouTube
                  </a>
                  <a
                    href={`https://www.youtube.com/embed/${formData.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    Test Embed
                  </a>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <i className="fas fa-info-circle mr-1"></i>
                  Click "Test Video" to verify it plays correctly before saving
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 font-bold rounded-lg transition flex items-center gap-2 ${isSubmitting
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-cyan-500 text-black hover:bg-cyan-400'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    {editingVideo ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <i className={editingVideo ? "fas fa-save" : "fas fa-plus"}></i>
                    {editingVideo ? 'Update Video' : 'Add Video'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className={`px-6 py-3 font-bold rounded-lg transition ${isSubmitting
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Videos List */}
      {validVideos.length > 0 && (
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-400">
            <i className="fas fa-video mr-2"></i>
            Showing {indexOfFirstVideo + 1}-{Math.min(indexOfLastVideo, validVideos.length)} of {validVideos.length} {validVideos.length === 1 ? 'video' : 'videos'}
          </div>
          {totalPages > 1 && (
            <div className="text-gray-400 text-sm">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {validVideos.length === 0 ? (
          <div className="col-span-full text-center py-12 glass-panel rounded-xl">
            <i className="fab fa-youtube text-6xl text-gray-600 mb-4"></i>
            <p className="text-gray-400 text-lg">No videos added yet. Click "Add New Video" to get started!</p>
          </div>
        ) : (
          currentVideos.map((video) => (
            <div key={video._id} className="glass-panel rounded-xl overflow-hidden border border-gray-700">
              {/* Video Thumbnail */}
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
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-all group"
                >
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fas fa-play text-white ml-1"></i>
                  </div>
                </a>
                {/* Category Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-cyan-400 font-bold uppercase">
                  {video.category}
                </div>
                {/* Active Status */}
                {!video.isActive && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-600/90 backdrop-blur-sm rounded text-xs text-white font-bold">
                    INACTIVE
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="text-white font-bold mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{video.description}</p>
                <div className="flex items-center gap-2 text-cyan-400 text-xs mb-3">
                  <i className="fas fa-chalkboard-teacher"></i>
                  <span>{video.instructor}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(video)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-bold"
                  >
                    <i className="fas fa-edit mr-1"></i> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-bold"
                  >
                    <i className="fas fa-trash mr-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ManageVideos;
