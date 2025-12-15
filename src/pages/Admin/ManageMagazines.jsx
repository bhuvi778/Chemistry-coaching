import { useState } from 'react';
import { useData } from '../../context/DataContext';

const ManageMagazines = () => {
  const { magazines, addMagazine, updateMagazine, deleteMagazine } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentMagazine, setCurrentMagazine] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);

  const currentYear = new Date().getFullYear();
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const initialFormState = {
    title: '',
    description: '',
    edition: '',
    month: '',
    year: currentYear,
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
    setImagePreview(magazine.coverImageUrl || null);
    setPdfPreview(magazine.pdfUrl ? 'PDF Uploaded' : null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this magazine?')) {
      deleteMagazine(id);
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Process image file and convert to base64
  const processImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      setFormData({ ...formData, coverImageUrl: base64String });
    };
    reader.readAsDataURL(file);
  };

  // Handle PDF file selection
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processPdfFile(file);
    }
  };

  // Process PDF file and convert to base64
  const processPdfFile = (file) => {
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('PDF size should be less than 50MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPdfPreview(file.name);
      setFormData({ ...formData, pdfUrl: base64String });
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop for images
  const handleImageDragOver = (e) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };

  const handleImageDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingImage(false);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsDraggingImage(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Handle drag and drop for PDFs
  const handlePdfDragOver = (e) => {
    e.preventDefault();
    setIsDraggingPdf(true);
  };

  const handlePdfDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingPdf(false);
  };

  const handlePdfDrop = (e) => {
    e.preventDefault();
    setIsDraggingPdf(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processPdfFile(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, coverImageUrl: '' });
  };

  const removePdf = () => {
    setPdfPreview(null);
    setFormData({ ...formData, pdfUrl: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.coverImageUrl) {
      alert('Please upload a cover image');
      return;
    }

    if (!formData.pdfUrl) {
      alert('Please upload a PDF file');
      return;
    }

    try {
      const magazineData = {
        ...formData,
        year: parseInt(formData.year),
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
      setImagePreview(null);
      setPdfPreview(null);
    } catch (error) {
      console.error('Error submitting magazine:', error);
      alert('Error saving magazine. Please try again.');
    }
  };

  // Group magazines by year
  const magazinesByYear = magazines.reduce((acc, mag) => {
    const year = mag.year || 'Unknown';
    if (!acc[year]) acc[year] = [];
    acc[year].push(mag);
    return acc;
  }, {});

  const sortedYears = Object.keys(magazinesByYear).sort((a, b) => b - a);

  return (
    <div className="space-y-8">
      {/* Add/Edit Form */}
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-4">
          {isEditing ? 'Edit Magazine' : 'Add New Magazine'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-cyan-400 mb-2">
              Magazine Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Chemistry Insights Monthly"
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
              placeholder="Brief description of the magazine content"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full h-24 focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          {/* Edition, Month, Year */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-cyan-400 mb-2">
                Edition
              </label>
              <input
                type="text"
                placeholder="e.g., Vol 1 Issue 2"
                value={formData.edition}
                onChange={e => setFormData({ ...formData, edition: e.target.value })}
                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-cyan-400 mb-2">
                Month *
              </label>
              <select
                value={formData.month}
                onChange={e => setFormData({ ...formData, month: e.target.value })}
                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-400 focus:outline-none"
                required
              >
                <option value="">Select Month</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-cyan-400 mb-2">
                Year *
              </label>
              <input
                type="number"
                placeholder="2025"
                min="2000"
                max="2100"
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-cyan-400 mb-2">
              Cover Image *
            </label>

            {!imagePreview ? (
              <div
                onDragOver={handleImageDragOver}
                onDragLeave={handleImageDragLeave}
                onDrop={handleImageDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${isDraggingImage
                    ? 'border-cyan-400 bg-cyan-900/20'
                    : 'border-gray-700 hover:border-gray-600'
                  }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="coverImage"
                />
                <label htmlFor="coverImage" className="cursor-pointer">
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-500 mb-3 block"></i>
                  <p className="text-white mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-full max-w-md h-96 object-cover rounded-lg mx-auto"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  title="Remove image"
                >
                  <i className="fas fa-times"></i>
                </button>
                <div className="mt-2 text-center">
                  <label htmlFor="coverImage" className="text-cyan-400 hover:text-cyan-300 cursor-pointer text-sm">
                    <i className="fas fa-sync-alt mr-1"></i>
                    Change Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="coverImage"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-semibold text-cyan-400 mb-2">
              Magazine PDF *
            </label>

            {!pdfPreview ? (
              <div
                onDragOver={handlePdfDragOver}
                onDragLeave={handlePdfDragLeave}
                onDrop={handlePdfDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${isDraggingPdf
                    ? 'border-pink-400 bg-pink-900/20'
                    : 'border-gray-700 hover:border-gray-600'
                  }`}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                  id="magazinePdf"
                />
                <label htmlFor="magazinePdf" className="cursor-pointer">
                  <i className="fas fa-file-pdf text-4xl text-gray-500 mb-3 block"></i>
                  <p className="text-white mb-2">
                    Click to upload or drag and drop PDF
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF up to 50MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className="fas fa-file-pdf text-3xl text-red-500"></i>
                  <div>
                    <p className="text-white font-semibold">{pdfPreview}</p>
                    <p className="text-xs text-gray-400">PDF uploaded successfully</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <label htmlFor="magazinePdf" className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                    <i className="fas fa-sync-alt mr-1"></i>
                    Change
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    className="hidden"
                    id="magazinePdf"
                  />
                  <button
                    type="button"
                    onClick={removePdf}
                    className="text-red-400 hover:text-red-300 ml-3"
                  >
                    <i className="fas fa-times mr-1"></i>
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Topics */}
          <div>
            <label className="block text-sm font-semibold text-cyan-400 mb-2">
              Topics Covered
            </label>
            <input
              type="text"
              placeholder="Organic Chemistry, Thermodynamics, Chemical Bonding"
              value={formData.topics}
              onChange={e => setFormData({ ...formData, topics: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full focus:border-cyan-400 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate topics with commas
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:from-pink-600 hover:to-orange-600 transition shadow-lg"
            >
              <i className={`fas fa-${isEditing ? 'save' : 'plus'} mr-2`}></i>
              {isEditing ? 'Update Magazine' : 'Add Magazine'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentMagazine(null);
                  setFormData(initialFormState);
                  setImagePreview(null);
                  setPdfPreview(null);
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

      {/* Existing Magazines - Grouped by Year */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">
          <i className="fas fa-book-open mr-2 text-pink-500"></i>
          Existing Magazines
        </h2>

        {sortedYears.length === 0 ? (
          <div className="glass-panel p-8 rounded-xl text-center">
            <i className="fas fa-inbox text-4xl text-gray-600 mb-3"></i>
            <p className="text-gray-400">No magazines added yet</p>
          </div>
        ) : (
          sortedYears.map(year => (
            <div key={year} className="glass-panel p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-calendar-alt text-pink-500"></i>
                Year {year}
                <span className="text-sm font-normal text-gray-400">
                  ({magazinesByYear[year].length} magazine{magazinesByYear[year].length !== 1 ? 's' : ''})
                </span>
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {magazinesByYear[year]
                  .sort((a, b) => {
                    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
                    return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
                  })
                  .map(magazine => (
                    <div
                      key={magazine._id}
                      className="bg-gray-800/50 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-start hover:bg-gray-800 transition"
                    >
                      {/* Cover Image Thumbnail */}
                      {magazine.coverImageUrl && (
                        <img
                          src={magazine.coverImageUrl}
                          alt={magazine.title}
                          className="w-full md:w-24 h-32 object-cover rounded"
                        />
                      )}

                      {/* Info */}
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">{magazine.title}</h4>
                        <p className="text-sm text-gray-400 mb-2">{magazine.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {magazine.edition && (
                            <span className="px-3 py-1 bg-pink-900/50 border border-pink-500 text-pink-400 rounded-full text-xs">
                              {magazine.edition}
                            </span>
                          )}
                          {magazine.month && (
                            <span className="px-3 py-1 bg-orange-900/50 border border-orange-500 text-orange-400 rounded-full text-xs">
                              {magazine.month}
                            </span>
                          )}
                          {magazine.topics && magazine.topics.length > 0 && (
                            <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded-full text-xs">
                              {magazine.topics.length} topics
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(magazine)}
                          className="p-2 text-cyan-400 hover:bg-gray-700 rounded transition"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(magazine._id)}
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
    </div>
  );
};

export default ManageMagazines;
