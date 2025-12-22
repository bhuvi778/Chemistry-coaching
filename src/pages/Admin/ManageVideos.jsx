import { useState } from 'react';
import { useData } from '../../context/DataContext';

const ManageVideos = () => {
  const { videos, addVideo, updateVideo, deleteVideo } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeId: '',
    instructor: '',
    category: 'general',
    duration: '',
    isActive: true,
    classNotes: null  // Will store {data: base64, filename: string}
  });

  const categories = [
    { value: 'organic', label: 'Organic Chemistry' },
    { value: 'inorganic', label: 'Inorganic Chemistry' },
    { value: 'physical', label: 'Physical Chemistry' },
    { value: 'general', label: 'General Chemistry' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingVideo) {
      await updateVideo(editingVideo._id, formData);
      setEditingVideo(null);
    } else {
      await addVideo(formData);
    }
    setFormData({
      title: '',
      description: '',
      youtubeId: '',
      instructor: '',
      category: 'general',
      duration: '',
      isActive: true,
      classNotes: null
    });
    setIsAdding(false);
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      youtubeId: video.youtubeId,
      instructor: video.instructor,
      category: video.category || 'general',
      duration: video.duration || '',
      isActive: video.isActive !== false,
      classNotes: video.classNotes || null
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
    setFormData({
      title: '',
      description: '',
      youtubeId: '',
      instructor: '',
      category: 'general',
      duration: '',
      isActive: true,
      classNotes: null
    });
  };

  const extractYoutubeId = (url) => {
    // Extract YouTube ID from various URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
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
                value={formData.youtubeId}
                onChange={(e) => setFormData({ ...formData, youtubeId: extractYoutubeId(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-cyan-400 focus:outline-none"
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID or just VIDEO_ID"
              />
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
                    if (file.size > 10 * 1024 * 1024) {  // 10MB limit
                      alert('File size must be less than 10MB');
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
                Upload PDF class notes for this lecture (Max 10MB)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-cyan-500 focus:ring-cyan-400"
              />
              <label htmlFor="isActive" className="text-gray-400">
                Active (Show on website)
              </label>
            </div>

            {formData.youtubeId && formData.youtubeId.length === 11 && (
              <div className="mt-4">
                <label className="block text-gray-400 mb-2">Preview:</label>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${formData.youtubeId}/maxresdefault.jpg`}
                    alt="Video preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://img.youtube.com/vi/${formData.youtubeId}/hqdefault.jpg`;
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition"
              >
                {editingVideo ? 'Update Video' : 'Add Video'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length === 0 ? (
          <div className="col-span-full text-center py-12 glass-panel rounded-xl">
            <i className="fab fa-youtube text-6xl text-gray-600 mb-4"></i>
            <p className="text-gray-400 text-lg">No videos added yet. Click "Add New Video" to get started!</p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="glass-panel rounded-xl overflow-hidden border border-gray-700">
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-900">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
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
    </div>
  );
};

export default ManageVideos;
