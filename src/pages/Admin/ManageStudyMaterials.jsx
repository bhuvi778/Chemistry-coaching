import { useState } from 'react';
import { useData } from '../../context/DataContext';

const ManageStudyMaterials = () => {
  const { studyMaterials, addStudyMaterial, updateStudyMaterial, deleteStudyMaterial } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);

  // Updated exam types to match frontend
  const examTypes = [
    'All',
    'JEE',
    'NEET',
    'IAT',
    'NEST',
    'CSIR NEET',
    'IIT JAM',
    'TIFR',
    'BITSAT',
    'GATE',
    'CUET UG'
  ];

  // Updated categories to match frontend
  const categories = [
    'NCERT Books',
    'NCERT Solutions',
    'Syllabus',
    'Sample Papers',
    'Notes',
    'Important Question',
    'Previous Year Questions',
    'Formulas',
    'Practice papers',
    'Concept Wise Notes',
    'Physical Chemistry',
    'Organic Chemistry',
    'Inorganic Chemistry',
    'Spectroscopy'
  ];

  const fileTypes = ['PDF', 'DOC', 'PPT', 'ZIP', 'DOCX', 'PPTX'];

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

  // Handle file upload
  const handleFileUpload = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid file type (PDF, DOC, DOCX, PPT, PPTX, ZIP)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('File size should be less than 50MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData({ ...formData, fileUrl: base64String });
    };
    reader.readAsDataURL(file);
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
      alert('Error saving study material. Please try again.');
    }
  };

  // Group materials by category
  const materialsByCategory = studyMaterials.reduce((acc, material) => {
    const category = material.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(material);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Add/Edit Form */}
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-4">
          {isEditing ? 'Edit Study Material' : 'Add New Study Material'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-cyan-400 mb-2">
              Material Title *
            </label>
            <input
              type="text"
              placeholder="e.g., NCERT Chemistry Class 12 - Chapter 1"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-cyan-400 mb-2">
              Description *
            </label>
            <textarea
              placeholder="Brief description of the study material"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full h-24 focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-cyan-400 mb-2">
              Study Material File *
            </label>

            {!formData.fileUrl ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-green-400', 'bg-green-900/20');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-green-400', 'bg-green-900/20');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-green-400', 'bg-green-900/20');
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
                className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center transition hover:border-gray-600"
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="hidden"
                  id="studyFile"
                />
                <label htmlFor="studyFile" className="cursor-pointer">
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-500 mb-3 block"></i>
                  <p className="text-white mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, PPT, PPTX, ZIP up to 50MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className={`fas fa-file-${formData.fileType.toLowerCase()} text-3xl text-green-500`}></i>
                  <div>
                    <p className="text-white font-semibold">File uploaded successfully</p>
                    <p className="text-xs text-gray-400">Ready to save</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <label htmlFor="studyFile" className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                    <i className="fas fa-sync-alt mr-1"></i>
                    Change
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                    id="studyFile"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, fileUrl: '' })}
                    className="text-red-400 hover:text-red-300 ml-3"
                  >
                    <i className="fas fa-times mr-1"></i>
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>



          {/* File Type, Category, Exam Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-cyan-400 mb-2">
                File Type *
              </label>
              <select
                value={formData.fileType}
                onChange={e => setFormData({ ...formData, fileType: e.target.value })}
                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-400 focus:outline-none"
              >
                {fileTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cyan-400 mb-2">
                Category/Type *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-400 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cyan-400 mb-2">
                Exam Type *
              </label>
              <select
                value={formData.examType}
                onChange={e => setFormData({ ...formData, examType: e.target.value })}
                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-400 focus:outline-none"
              >
                {examTypes.map(exam => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Thumbnail and File Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-cyan-400 mb-2">
                Thumbnail URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/thumbnail.jpg"
                value={formData.thumbnailUrl}
                onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-cyan-400 mb-2">
                File Size (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., 2.5 MB"
                value={formData.fileSize}
                onChange={e => setFormData({ ...formData, fileSize: e.target.value })}
                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-lg hover:from-green-600 hover:to-emerald-600 transition shadow-lg"
            >
              <i className={`fas fa-${isEditing ? 'save' : 'plus'} mr-2`}></i>
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
                className="bg-gray-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-600 transition"
              >
                <i className="fas fa-times mr-2"></i>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Materials - Grouped by Category */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">
          <i className="fas fa-file-alt mr-2 text-green-500"></i>
          Existing Study Materials
        </h2>

        {Object.keys(materialsByCategory).length === 0 ? (
          <div className="glass-panel p-8 rounded-xl text-center">
            <i className="fas fa-inbox text-4xl text-gray-600 mb-3"></i>
            <p className="text-gray-400">No study materials added yet</p>
          </div>
        ) : (
          Object.keys(materialsByCategory).sort().map(category => (
            <div key={category} className="glass-panel p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-folder text-green-500"></i>
                {category}
                <span className="text-sm font-normal text-gray-400">
                  ({materialsByCategory[category].length} item{materialsByCategory[category].length !== 1 ? 's' : ''})
                </span>
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {materialsByCategory[category].map(material => (
                  <div
                    key={material._id}
                    className="bg-gray-800/50 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-start hover:bg-gray-800 transition"
                  >
                    {/* Thumbnail */}
                    {material.thumbnailUrl && (
                      <img
                        src={material.thumbnailUrl}
                        alt={material.title}
                        className="w-full md:w-20 h-20 object-cover rounded"
                      />
                    )}

                    {/* Info */}
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-1">{material.title}</h4>
                      <p className="text-sm text-gray-400 mb-2">{material.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-green-900/50 border border-green-500 text-green-400 rounded-full text-xs">
                          {material.fileType}
                        </span>
                        <span className="px-3 py-1 bg-purple-900/50 border border-purple-500 text-purple-400 rounded-full text-xs">
                          {material.examType}
                        </span>
                        {material.fileSize && (
                          <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded-full text-xs">
                            {material.fileSize}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(material)}
                        className="p-2 text-cyan-400 hover:bg-gray-700 rounded transition"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <a
                        href={material.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-400 hover:bg-gray-700 rounded transition"
                        title="View File"
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                      <button
                        onClick={() => handleDelete(material._id)}
                        className="p-2 text-red-400 hover:bg-gray-700 rounded transition"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      {studyMaterials.length > 0 && (
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">
            <i className="fas fa-chart-bar mr-2 text-green-500"></i>
            Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{studyMaterials.length}</p>
              <p className="text-sm text-gray-400">Total Materials</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-400">{Object.keys(materialsByCategory).length}</p>
              <p className="text-sm text-gray-400">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">
                {studyMaterials.filter(m => m.fileType === 'PDF').length}
              </p>
              <p className="text-sm text-gray-400">PDF Files</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-400">
                {new Set(studyMaterials.map(m => m.examType)).size}
              </p>
              <p className="text-sm text-gray-400">Exam Types</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudyMaterials;
