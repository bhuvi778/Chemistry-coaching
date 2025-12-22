import { useState } from 'react';
import { useData } from '../../context/DataContext';

const ManageAudioBooks = () => {
  const { audioBooks, addAudioBook, updateAudioBook, deleteAudioBook } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentAudioBook, setCurrentAudioBook] = useState(null);
  
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
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this audio book?')) {
      deleteAudioBook(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      console.error('Error submitting audio book:', error);
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
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full h-24"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Author"
              value={formData.author}
              onChange={e => setFormData({...formData, author: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2h 30m)"
              value={formData.duration}
              onChange={e => setFormData({...formData, duration: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
          </div>
          <input
            type="url"
            placeholder="Audio URL"
            value={formData.audioUrl}
            onChange={e => setFormData({...formData, audioUrl: e.target.value})}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            required
          />
          <input
            type="url"
            placeholder="Thumbnail URL (optional)"
            value={formData.thumbnailUrl}
            onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
          />
          <select
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
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
