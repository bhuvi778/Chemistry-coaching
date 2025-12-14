import { useState } from 'react';
import { useData } from '../../context/DataContext';

const ManageStudyMaterials = () => {
  const { studyMaterials, addStudyMaterial, updateStudyMaterial, deleteStudyMaterial } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  
  const initialFormState = {
    title: '',
    description: '',
    fileUrl: '',
    fileType: 'PDF',
    category: 'Notes',
    examType: 'All',
    thumbnailUrl: '',
    fileSize: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (material) => {
    setIsEditing(true);
    setCurrentMaterial(material);
    setFormData(material);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this study material?')) {
      deleteStudyMaterial(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateStudyMaterial(currentMaterial._id, formData);
        alert('Study material updated successfully!');
      } else {
        await addStudyMaterial(formData);
        alert('Study material added successfully!');
      }
      setIsEditing(false);
      setCurrentMaterial(null);
      setFormData(initialFormState);
    } catch (error) {
      console.error('Error submitting study material:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-4">
          {isEditing ? 'Edit Study Material' : 'Add New Study Material'}
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
          <input
            type="url"
            placeholder="File URL (e.g., Google Drive link)"
            value={formData.fileUrl}
            onChange={e => setFormData({...formData, fileUrl: e.target.value})}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={formData.fileType}
              onChange={e => setFormData({...formData, fileType: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            >
              <option value="PDF">PDF</option>
              <option value="DOC">DOC</option>
              <option value="PPT">PPT</option>
              <option value="ZIP">ZIP</option>
            </select>
            <select
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            >
              <option value="Notes">Notes</option>
              <option value="Question Banks">Question Banks</option>
              <option value="Previous Year Papers">Previous Year Papers</option>
              <option value="Physical Chemistry">Physical Chemistry</option>
              <option value="Organic Chemistry">Organic Chemistry</option>
              <option value="Inorganic Chemistry">Inorganic Chemistry</option>
            </select>
            <select
              value={formData.examType}
              onChange={e => setFormData({...formData, examType: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            >
              <option value="All">All</option>
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
              <option value="GATE">GATE</option>
              <option value="CSIR NET">CSIR NET</option>
              <option value="IIT JAM">IIT JAM</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="url"
              placeholder="Thumbnail URL (optional)"
              value={formData.thumbnailUrl}
              onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
            <input
              type="text"
              placeholder="File Size (e.g., 2.5 MB)"
              value={formData.fileSize}
              onChange={e => setFormData({...formData, fileSize: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="bg-green-500 text-white font-bold py-2 px-6 rounded hover:bg-green-400 transition">
              {isEditing ? 'Update Material' : 'Add Material'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentMaterial(null);
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
        {studyMaterials.map(material => (
          <div key={material._id} className="glass-panel p-4 rounded-xl flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{material.title}</h3>
              <p className="text-sm text-gray-400">{material.description}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="px-3 py-1 bg-green-900/50 border border-green-500 text-green-400 rounded-full text-xs">
                  {material.fileType}
                </span>
                <span className="px-3 py-1 bg-blue-900/50 border border-blue-500 text-blue-400 rounded-full text-xs">
                  {material.category}
                </span>
                <span className="px-3 py-1 bg-purple-900/50 border border-purple-500 text-purple-400 rounded-full text-xs">
                  {material.examType}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(material)} className="p-2 text-cyan-400 hover:bg-gray-800 rounded">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => handleDelete(material._id)} className="p-2 text-red-400 hover:bg-gray-800 rounded">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageStudyMaterials;
