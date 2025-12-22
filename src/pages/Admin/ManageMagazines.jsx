import { useState } from 'react';
import { useData } from '../../context/DataContext';

const ManageMagazines = () => {
  const { magazines, addMagazine, updateMagazine, deleteMagazine } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentMagazine, setCurrentMagazine] = useState(null);
  
  const initialFormState = {
    title: '',
    description: '',
    edition: '',
    month: '',
    year: new Date().getFullYear(),
    coverImageUrl: '',
    pdfUrl: '',
    topics: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (magazine) => {
    setIsEditing(true);
    setCurrentMagazine(magazine);
    setFormData({
      ...magazine,
      topics: magazine.topics ? magazine.topics.join(', ') : ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this magazine?')) {
      deleteMagazine(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const magazineData = {
        ...formData,
        topics: formData.topics.split(',').map(t => t.trim()).filter(t => t)
      };
      
      if (isEditing) {
        await updateMagazine(currentMagazine._id, magazineData);
        alert('Magazine updated successfully!');
      } else {
        await addMagazine(magazineData);
        alert('Magazine added successfully!');
      }
      setIsEditing(false);
      setCurrentMagazine(null);
      setFormData(initialFormState);
    } catch (error) {
      console.error('Error submitting magazine:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-4">
          {isEditing ? 'Edit Magazine' : 'Add New Magazine'}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Edition (e.g., Vol 1 Issue 2)"
              value={formData.edition}
              onChange={e => setFormData({...formData, edition: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
            <input
              type="text"
              placeholder="Month (e.g., January)"
              value={formData.month}
              onChange={e => setFormData({...formData, month: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
            <input
              type="number"
              placeholder="Year"
              value={formData.year}
              onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
          </div>
          <input
            type="url"
            placeholder="Cover Image URL"
            value={formData.coverImageUrl}
            onChange={e => setFormData({...formData, coverImageUrl: e.target.value})}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
          />
          <input
            type="url"
            placeholder="PDF URL"
            value={formData.pdfUrl}
            onChange={e => setFormData({...formData, pdfUrl: e.target.value})}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            required
          />
          <input
            type="text"
            placeholder="Topics (comma separated)"
            value={formData.topics}
            onChange={e => setFormData({...formData, topics: e.target.value})}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
          />

          <div className="flex gap-4">
            <button type="submit" className="bg-pink-500 text-white font-bold py-2 px-6 rounded hover:bg-pink-400 transition">
              {isEditing ? 'Update Magazine' : 'Add Magazine'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentMagazine(null);
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
        {magazines.map(magazine => (
          <div key={magazine._id} className="glass-panel p-4 rounded-xl flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{magazine.title}</h3>
              <p className="text-sm text-gray-400">{magazine.description}</p>
              <div className="flex gap-2 mt-2">
                {magazine.edition && (
                  <span className="px-3 py-1 bg-pink-900/50 border border-pink-500 text-pink-400 rounded-full text-xs">
                    {magazine.edition}
                  </span>
                )}
                {magazine.month && magazine.year && (
                  <span className="px-3 py-1 bg-orange-900/50 border border-orange-500 text-orange-400 rounded-full text-xs">
                    {magazine.month} {magazine.year}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(magazine)} className="p-2 text-cyan-400 hover:bg-gray-800 rounded">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => handleDelete(magazine._id)} className="p-2 text-red-400 hover:bg-gray-800 rounded">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMagazines;
