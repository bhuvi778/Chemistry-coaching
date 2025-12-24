import { useState } from 'react';
import { useData } from '../../context/DataContext';
import Pagination from '../../components/UI/Pagination';

const ManageMagazines = () => {
  const { magazines, addMagazine, updateMagazine, deleteMagazine } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentMagazine, setCurrentMagazine] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [pdfFileName, setPdfFileName] = useState('');
  const [coverFileName, setCoverFileName] = useState('');
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);

  const initialFormState = {
    title: '',
    description: '',
    edition: '',
    month: '',
    year: new Date().getFullYear(),
    coverImageUrl: '',
    pdfUrl: '',
    topics: '',
    fileSize: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (magazine) => {
    setIsEditing(true);
    setCurrentMagazine(magazine);
    setFormData({
      ...magazine,
      topics: magazine.topics ? magazine.topics.join(', ') : ''
    });
    setPdfFileName(magazine.pdfUrl ? 'Current PDF file' : '');
    setCoverFileName(magazine.coverImageUrl ? 'Current cover image' : '');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this magazine?')) {
      deleteMagazine(id);
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

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle PDF file upload
  const handlePdfFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a valid PDF file');
        return;
      }

      // Check file size (limit to 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('PDF file size should be less than 50MB');
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        const fileSize = formatFileSize(file.size);
        setFormData({ ...formData, pdfUrl: base64, fileSize: fileSize });
        setPdfFileName(file.name);
      } catch (error) {
        console.error('Error converting PDF:', error);
        alert('Error uploading PDF file');
      }
    }
  };

  // Handle cover image upload
  const handleCoverImageChange = async (e) => {
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
        setFormData({ ...formData, coverImageUrl: base64 });
        setCoverFileName(file.name);
      } catch (error) {
        console.error('Error converting cover image:', error);
        alert('Error uploading cover image');
      }
    }
  };

  // Drag and drop handlers for PDF
  const handlePdfDragOver = (e) => {
    e.preventDefault();
    setIsDraggingPdf(true);
  };

  const handlePdfDragLeave = () => {
    setIsDraggingPdf(false);
  };

  const handlePdfDrop = async (e) => {
    e.preventDefault();
    setIsDraggingPdf(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 50 * 1024 * 1024) {
        alert('PDF file size should be less than 50MB');
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        const fileSize = formatFileSize(file.size);
        setFormData({ ...formData, pdfUrl: base64, fileSize: fileSize });
        setPdfFileName(file.name);
      } catch (error) {
        console.error('Error converting PDF:', error);
        alert('Error uploading PDF file');
      }
    } else {
      alert('Please drop a valid PDF file');
    }
  };

  // Drag and drop handlers for cover image
  const handleCoverDragOver = (e) => {
    e.preventDefault();
    setIsDraggingCover(true);
  };

  const handleCoverDragLeave = () => {
    setIsDraggingCover(false);
  };

  const handleCoverDrop = async (e) => {
    e.preventDefault();
    setIsDraggingCover(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5MB');
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        setFormData({ ...formData, coverImageUrl: base64 });
        setCoverFileName(file.name);
      } catch (error) {
        console.error('Error converting cover image:', error);
        alert('Error uploading cover image');
      }
    } else {
      alert('Please drop a valid image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.pdfUrl) {
      alert('Please upload a PDF file');
      return;
    }

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
      setPdfFileName('');
      setCoverFileName('');
    } catch (error) {
      console.error('Error submitting magazine:', error);
      alert('Error submitting magazine. Please try again.');
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(magazines.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMagazines = magazines.slice(indexOfFirstItem, indexOfLastItem);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Edition (e.g., Vol 1 Issue 2)"
              value={formData.edition}
              onChange={e => setFormData({ ...formData, edition: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
            <input
              type="text"
              placeholder="Month (e.g., January)"
              value={formData.month}
              onChange={e => setFormData({ ...formData, month: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
            <input
              type="number"
              placeholder="Year"
              value={formData.year}
              onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-gray-400 mb-2 font-semibold">
              <i className="fas fa-image mr-2 text-pink-400"></i>
              Magazine Cover Image *
            </label>
            <div
              onDragOver={handleCoverDragOver}
              onDragLeave={handleCoverDragLeave}
              onDrop={handleCoverDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDraggingCover
                ? 'border-pink-400 bg-pink-500/10'
                : 'border-gray-700 hover:border-pink-500'
                }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
                id="coverImageInput"
              />
              <label htmlFor="coverImageInput" className="cursor-pointer">
                <i className="fas fa-image text-4xl text-pink-400 mb-3 block"></i>
                <p className="text-white mb-2">
                  {coverFileName || 'Click to upload or drag and drop'}
                </p>
                <p className="text-gray-500 text-sm">
                  PNG, JPG, WEBP (Max 5MB)
                </p>
              </label>
            </div>
            {formData.coverImageUrl && (
              <div className="mt-3 p-3 bg-pink-900/30 border border-pink-500/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={formData.coverImageUrl}
                    alt="Cover preview"
                    className="w-24 h-32 object-cover rounded"
                  />
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-400"></i>
                    <span className="text-sm text-gray-300">Cover image uploaded</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-gray-400 mb-2 font-semibold">
              <i className="fas fa-file-pdf mr-2 text-red-400"></i>
              Magazine PDF File *
            </label>
            <div
              onDragOver={handlePdfDragOver}
              onDragLeave={handlePdfDragLeave}
              onDrop={handlePdfDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDraggingPdf
                ? 'border-red-400 bg-red-500/10'
                : 'border-gray-700 hover:border-red-500'
                }`}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfFileChange}
                className="hidden"
                id="pdfFileInput"
              />
              <label htmlFor="pdfFileInput" className="cursor-pointer">
                <i className="fas fa-cloud-upload-alt text-4xl text-red-400 mb-3 block"></i>
                <p className="text-white mb-2">
                  {pdfFileName || 'Click to upload or drag and drop'}
                </p>
                <p className="text-gray-500 text-sm">
                  PDF only (Max 50MB)
                </p>
              </label>
            </div>
            {formData.pdfUrl && (
              <div className="mt-3 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-400"></i>
                    <span className="text-sm text-gray-300">PDF uploaded</span>
                  </div>
                  {formData.fileSize && (
                    <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                      {formData.fileSize}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Topics (comma separated)"
            value={formData.topics}
            onChange={e => setFormData({ ...formData, topics: e.target.value })}
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

      {magazines.length > 0 && (
        <div className="mb-4 text-gray-400">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, magazines.length)} of {magazines.length} magazines
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {currentMagazines.map(magazine => (
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

      {totalPages > 1 && (
        <div className="mt-6">
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

export default ManageMagazines;
