import { useState } from 'react';
import { useData } from '../../context/DataContext';

const ManageAudioBooks = () => {
  const { audioBooks, addAudioBook, updateAudioBook, deleteAudioBook } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentAudioBook, setCurrentAudioBook] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');
  const [thumbnailFileName, setThumbnailFileName] = useState('');
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);

  const initialFormState = {
    title: '',
    description: '',
    author: '',
    duration: '',
    audioUrl: '',
    thumbnailUrl: '',
    category: 'General'
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (audioBook) => {
    setIsEditing(true);
    setCurrentAudioBook(audioBook);
    setFormData(audioBook);
    setAudioFileName(audioBook.audioUrl ? 'Current audio file' : '');
    setThumbnailFileName(audioBook.thumbnailUrl ? 'Current thumbnail' : '');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this audio book?')) {
      deleteAudioBook(id);
    }
  };

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle audio file upload
  const handleAudioFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        alert('Please upload a valid audio file (MP3, WAV, etc.)');
        return;
      }

      // Check file size (limit to 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('Audio file size should be less than 50MB');
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        setFormData({ ...formData, audioUrl: base64 });
        setAudioFileName(file.name);
      } catch (error) {
        console.error('Error converting audio file:', error);
        alert('Error uploading audio file');
      }
    }
  };

  // Handle thumbnail file upload
  const handleThumbnailFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5MB');
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        setFormData({ ...formData, thumbnailUrl: base64 });
        setThumbnailFileName(file.name);
      } catch (error) {
        console.error('Error converting thumbnail:', error);
        alert('Error uploading thumbnail');
      }
    }
  };

  // Drag and drop handlers for audio
  const handleAudioDragOver = (e) => {
    e.preventDefault();
    setIsDraggingAudio(true);
  };

  const handleAudioDragLeave = () => {
    setIsDraggingAudio(false);
  };

  const handleAudioDrop = async (e) => {
    e.preventDefault();
    setIsDraggingAudio(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      if (file.size > 50 * 1024 * 1024) {
        alert('Audio file size should be less than 50MB');
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        setFormData({ ...formData, audioUrl: base64 });
        setAudioFileName(file.name);
      } catch (error) {
        console.error('Error converting audio file:', error);
        alert('Error uploading audio file');
      }
    } else {
      alert('Please drop a valid audio file');
    }
  };

  // Drag and drop handlers for thumbnail
  const handleThumbnailDragOver = (e) => {
    e.preventDefault();
    setIsDraggingThumbnail(true);
  };

  const handleThumbnailDragLeave = () => {
    setIsDraggingThumbnail(false);
  };

  const handleThumbnailDrop = async (e) => {
    e.preventDefault();
    setIsDraggingThumbnail(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5MB');
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        setFormData({ ...formData, thumbnailUrl: base64 });
        setThumbnailFileName(file.name);
      } catch (error) {
        console.error('Error converting thumbnail:', error);
        alert('Error uploading thumbnail');
      }
    } else {
      alert('Please drop a valid image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.audioUrl) {
      alert('Please upload an audio file');
      return;
    }

    try {
      if (isEditing) {
        await updateAudioBook(currentAudioBook._id, formData);
        alert('Audio book updated successfully!');
      } else {
        await addAudioBook(formData);
        alert('Audio book added successfully!');
      }
      setIsEditing(false);
      setCurrentAudioBook(null);
      setFormData(initialFormState);
      setAudioFileName('');
      setThumbnailFileName('');
    } catch (error) {
      console.error('Error submitting audio book:', error);
      alert('Error submitting audio book. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-4">
          {isEditing ? 'Edit Audio Book' : 'Add New Audio Book'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full h-24"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Author"
              value={formData.author}
              onChange={e => setFormData({ ...formData, author: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2h 30m)"
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
          </div>

          {/* Audio File Upload */}
          <div>
            <label className="block text-gray-400 mb-2 font-semibold">
              <i className="fas fa-music mr-2 text-purple-400"></i>
              Audio File (MP3, WAV, etc.) *
            </label>
            <div
              onDragOver={handleAudioDragOver}
              onDragLeave={handleAudioDragLeave}
              onDrop={handleAudioDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDraggingAudio
                  ? 'border-purple-400 bg-purple-500/10'
                  : 'border-gray-700 hover:border-purple-500'
                }`}
            >
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioFileChange}
                className="hidden"
                id="audioFileInput"
              />
              <label htmlFor="audioFileInput" className="cursor-pointer">
                <i className="fas fa-cloud-upload-alt text-4xl text-purple-400 mb-3 block"></i>
                <p className="text-white mb-2">
                  {audioFileName || 'Click to upload or drag and drop'}
                </p>
                <p className="text-gray-500 text-sm">
                  MP3, WAV, OGG (Max 50MB)
                </p>
              </label>
            </div>
            {formData.audioUrl && (
              <div className="mt-3 p-3 bg-purple-900/30 border border-purple-500/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-400"></i>
                    <span className="text-sm text-gray-300">Audio file uploaded</span>
                  </div>
                  <audio controls className="h-8">
                    <source src={formData.audioUrl} type="audio/mpeg" />
                  </audio>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-gray-400 mb-2 font-semibold">
              <i className="fas fa-image mr-2 text-pink-400"></i>
              Thumbnail Image (Optional)
            </label>
            <div
              onDragOver={handleThumbnailDragOver}
              onDragLeave={handleThumbnailDragLeave}
              onDrop={handleThumbnailDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDraggingThumbnail
                  ? 'border-pink-400 bg-pink-500/10'
                  : 'border-gray-700 hover:border-pink-500'
                }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                className="hidden"
                id="thumbnailFileInput"
              />
              <label htmlFor="thumbnailFileInput" className="cursor-pointer">
                <i className="fas fa-image text-4xl text-pink-400 mb-3 block"></i>
                <p className="text-white mb-2">
                  {thumbnailFileName || 'Click to upload or drag and drop'}
                </p>
                <p className="text-gray-500 text-sm">
                  PNG, JPG, WEBP (Max 5MB)
                </p>
              </label>
            </div>
            {formData.thumbnailUrl && (
              <div className="mt-3 p-3 bg-pink-900/30 border border-pink-500/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-400"></i>
                    <span className="text-sm text-gray-300">Thumbnail uploaded</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <select
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
          >
            <option value="General">General</option>
            <option value="Physical Chemistry">Physical Chemistry</option>
            <option value="Organic Chemistry">Organic Chemistry</option>
            <option value="Inorganic Chemistry">Inorganic Chemistry</option>
          </select>

          <div className="flex gap-4">
            <button type="submit" className="bg-purple-500 text-white font-bold py-2 px-6 rounded hover:bg-purple-400 transition">
              {isEditing ? 'Update Audio Book' : 'Add Audio Book'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentAudioBook(null);
                  setFormData(initialFormState);
                }}
                className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {audioBooks.map(audioBook => (
          <div key={audioBook._id} className="glass-panel p-4 rounded-xl flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{audioBook.title}</h3>
              <p className="text-sm text-gray-400">{audioBook.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-purple-900/50 border border-purple-500 text-purple-400 rounded-full text-xs">
                  {audioBook.category}
                </span>
                {audioBook.duration && (
                  <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs">
                    {audioBook.duration}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(audioBook)} className="p-2 text-cyan-400 hover:bg-gray-800 rounded">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => handleDelete(audioBook._id)} className="p-2 text-red-400 hover:bg-gray-800 rounded">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAudioBooks;
