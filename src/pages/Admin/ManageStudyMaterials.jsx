import { useState } from 'react';
import { useData } from '../../context/DataContext';
import Pagination from '../../components/UI/Pagination';

const ManageStudyMaterials = () => {
  const { studyMaterials, addStudyMaterial, updateStudyMaterial, deleteStudyMaterial } = useData();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [isEditing, setIsEditing] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [fileFileName, setFileFileName] = useState('');
  const [thumbnailFileName, setThumbnailFileName] = useState('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

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
    setFileFileName(material.fileUrl ? 'Current file' : '');
    setThumbnailFileName(material.thumbnailUrl ? 'Current thumbnail' : '');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this study material?')) {
      deleteStudyMaterial(id);
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

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip',
        'application/x-zip-compressed'
      ];

      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid file (PDF, DOC, PPT, ZIP)');
        return;
      }

      // Check file size (limit to 500MB to match server)
      if (file.size > 500 * 1024 * 1024) {
        alert('File size should be less than 500MB');
        return;
      }

      try {
        setIsUploading(true);
        setUploadProgress('Uploading file... Please wait');
        
        console.log('📤 Uploading file:', file.name, 'Size:', (file.size / (1024*1024)).toFixed(2), 'MB');
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout
        
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: uploadFormData,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('📥 Upload response status:', uploadRes.status);
        
        if (!uploadRes.ok) {
          const errorData = await uploadRes.json().catch(() => ({message: 'Upload failed'}));
          throw new Error(errorData.message || 'File upload failed');
        }
        
        const uploadData = await uploadRes.json();
        console.log('✅ Upload successful, fileUrl:', uploadData.fileUrl);
        const fileSize = formatFileSize(file.size);

        // Detect file type
        let fileType = 'PDF';
        if (file.type.includes('word')) fileType = 'DOC';
        else if (file.type.includes('powerpoint') || file.type.includes('presentation')) fileType = 'PPT';
        else if (file.type.includes('zip')) fileType = 'ZIP';

        setFormData({
          ...formData,
          fileUrl: uploadData.fileUrl,
          fileSize: fileSize,
          fileType: fileType
        });
        setFileFileName(file.name);
        setUploadProgress('Upload complete!');
        setTimeout(() => setUploadProgress(''), 2000);
      } catch (error) {
        console.error('❌ Error uploading file:', error);
        if (error.name === 'AbortError') {
          alert('Upload timed out. The file might be too large or connection is slow.');
        } else {
          alert('Error uploading file: ' + error.message);
        }
      } finally {
        setIsUploading(false);
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

  // Drag and drop handlers for file
  const handleFileDragOver = (e) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleFileDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleFileDrop = async (e) => {
    e.preventDefault();
    setIsDraggingFile(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip',
        'application/x-zip-compressed'
      ];

      if (!validTypes.includes(file.type)) {
        alert('Please drop a valid file (PDF, DOC, PPT, ZIP)');
        return;
      }

      if (file.size > 500 * 1024 * 1024) {
        alert('File size should be less than 500MB');
        return;
      }

      try {
        setIsUploading(true);
        setUploadProgress('Uploading file... Please wait');
        
        // Upload file to server with timeout
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout
        
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: uploadFormData,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!uploadRes.ok) {
          const errorData = await uploadRes.json().catch(() => ({message: 'Upload failed'}));
          throw new Error(errorData.message || 'File upload failed');
        }
        
        const uploadData = await uploadRes.json();
        console.log('✅ Upload successful:', uploadData);
        const fileSize = formatFileSize(file.size);

        let fileType = 'PDF';
        if (file.type.includes('word')) fileType = 'DOC';
        else if (file.type.includes('powerpoint') || file.type.includes('presentation')) fileType = 'PPT';
        else if (file.type.includes('zip')) fileType = 'ZIP';

        setFormData({
          ...formData,
          fileUrl: uploadData.fileUrl,
          fileSize: fileSize,
          fileType: fileType
        });
        setFileFileName(file.name);
      } catch (error) {
        console.error('Error converting file:', error);
        alert('Error uploading file');
      }
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

    if (!formData.fileUrl) {
      alert('Please upload a file');
      return;
    }

    console.log('📝 Submitting study material:', formData);
    
    // Show loading state for large files
    const isLargeFile = formData.fileSize && parseFloat(formData.fileSize) > 30;
    if (isLargeFile) {
      setUploadProgress('Saving large file... This may take a moment');
      setIsUploading(true);
    }

    try {
      if (isEditing) {
        await updateStudyMaterial(currentMaterial._id, formData);
        alert('Study material updated successfully!');
      } else {
        const result = await addStudyMaterial(formData);
        console.log('✅ Study material added:', result);
        alert('Study material added successfully!');
      }
      setIsEditing(false);
      setCurrentMaterial(null);
      setFormData(initialFormState);
      setFileFileName('');
      setThumbnailFileName('');
    } catch (error) {
      console.error('❌ Error submitting study material:', error);
      alert('Error submitting study material: ' + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(studyMaterials.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = studyMaterials.slice(indexOfFirstItem, indexOfLastItem);

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

          {/* File Upload */}
          <div>
            <label className="block text-gray-400 mb-2 font-semibold">
              <i className="fas fa-file-pdf mr-2 text-green-400"></i>
              Study Material File (PDF, DOC, PPT, ZIP) *
            </label>
            <div
              onDragOver={handleFileDragOver}
              onDragLeave={handleFileDragLeave}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDraggingFile
                ? 'border-green-400 bg-green-500/10'
                : 'border-gray-700 hover:border-green-500'
                }`}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <i className="fas fa-cloud-upload-alt text-4xl text-green-400 mb-3 block"></i>
                <p className="text-white mb-2">
                  {fileFileName || 'Click to upload or drag and drop'}
                </p>
                <p className="text-gray-500 text-sm">
                  PDF, DOC, PPT, ZIP (Max 50MB)
                </p>
              </label>
            </div>
            {formData.fileUrl && (
              <div className="mt-3 p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-400"></i>
                    <span className="text-sm text-gray-300">File uploaded</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                      {formData.fileType}
                    </span>
                    {formData.fileSize && (
                      <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                        {formData.fileSize}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-gray-400 mb-2 font-semibold">
              <i className="fas fa-image mr-2 text-blue-400"></i>
              Thumbnail Image
              <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                Recommended
              </span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              <i className="fas fa-info-circle mr-1"></i>
              Upload a thumbnail image to display in the materials list. This helps students identify the material quickly.
            </p>
            <div
              onDragOver={handleThumbnailDragOver}
              onDragLeave={handleThumbnailDragLeave}
              onDrop={handleThumbnailDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDraggingThumbnail
                ? 'border-blue-400 bg-blue-500/10'
                : formData.thumbnailUrl 
                ? 'border-green-500 bg-green-500/10'
                : 'border-gray-700 hover:border-blue-500'
                }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                className="hidden"
                id="thumbnailInput"
              />
              <label htmlFor="thumbnailInput" className="cursor-pointer">
                <i className={`fas fa-image text-4xl ${formData.thumbnailUrl ? 'text-green-400' : 'text-blue-400'} mb-3 block`}></i>
                <p className="text-white mb-2">
                  {thumbnailFileName || 'Click to upload or drag and drop thumbnail'}
                </p>
                <p className="text-gray-500 text-sm">
                  PNG, JPG, WEBP (Max 5MB)
                </p>
              </label>
            </div>
            {formData.thumbnailUrl && (
              <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            >
              <optgroup label="General Categories">
                <option value="Notes">Notes</option>
                <option value="Handwritten Notes">Handwritten Notes</option>
                <option value="Formula Sheets">Formula Sheets</option>
                <option value="Revision Notes">Revision Notes</option>
                <option value="Question Banks">Question Banks</option>
                <option value="Practice Problems">Practice Problems</option>
                <option value="Solutions">Solutions</option>
                <option value="Previous Year Papers">Previous Year Papers</option>
                <option value="Sample Papers">Sample Papers</option>
                <option value="Mock Tests">Mock Tests</option>
                <option value="Study Guides">Study Guides</option>
                <option value="Reference Materials">Reference Materials</option>
                <option value="Puzzle">Puzzle</option>
              </optgroup>
              <optgroup label="Chemistry Topics">
                <option value="Physical Chemistry">Physical Chemistry</option>
                <option value="Organic Chemistry">Organic Chemistry</option>
                <option value="Inorganic Chemistry">Inorganic Chemistry</option>
                <option value="Analytical Chemistry">Analytical Chemistry</option>
                <option value="Biochemistry">Biochemistry</option>
              </optgroup>
            </select>
            <select
              value={formData.examType}
              onChange={e => setFormData({ ...formData, examType: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            >
              <option value="All">All Exams</option>
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

          {/* File Type Display (Auto-detected) */}
          {formData.fileType && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <i className="fas fa-info-circle text-cyan-400"></i>
                <span className="text-gray-400 text-sm">
                  File Type: <span className="text-white font-semibold">{formData.fileType}</span>
                  {formData.fileSize && (
                    <span className="ml-3">
                      Size: <span className="text-white font-semibold">{formData.fileSize}</span>
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}

          {uploadProgress && (
            <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
              {uploadProgress}
            </div>
          )}

          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={isUploading || !formData.fileUrl}
              className={`font-bold py-2 px-6 rounded transition ${
                isUploading || !formData.fileUrl 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 text-white hover:bg-green-400'
              }`}
            >
              {isUploading ? 'Uploading...' : isEditing ? 'Update Material' : 'Add Material'}
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

      {studyMaterials.length > 0 && (
        <div className="mb-4 text-gray-400">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, studyMaterials.length)} of {studyMaterials.length} study materials
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {currentMaterials.map(material => (
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

export default ManageStudyMaterials;
