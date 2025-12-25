import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Pagination from '../../components/UI/Pagination';

const ManageAudioBooks = () => {
  const { audioBooks, addAudioBook, updateAudioBook, deleteAudioBook } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentAudioBook, setCurrentAudioBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const initialFormState = {
    title: '',
    description: '',
    author: '',
    thumbnailUrl: '',
    category: 'General',
    chapters: []
  };

  const [formData, setFormData] = useState(initialFormState);
  const [thumbnailFileName, setThumbnailFileName] = useState('');
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);

  // Chapter management
  const [currentChapter, setCurrentChapter] = useState({ title: '', topics: [] });
  const [editingChapterIndex, setEditingChapterIndex] = useState(null);

  // Topic management
  const [currentTopic, setCurrentTopic] = useState({ title: '', description: '', duration: '', audioUrl: '' });
  const [editingTopicIndex, setEditingTopicIndex] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);

  // For expandable chapters in list view
  const [expandedChapters, setExpandedChapters] = useState({});

  // Loading state for submit button
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleChapter = (chapterIndex) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex]
    }));
  };

  const handleEdit = async (audioBook) => {
    setIsEditing(true);
    setCurrentAudioBook(audioBook);
    const safeAudioBook = {
      ...audioBook,
      chapters: Array.isArray(audioBook.chapters) ? audioBook.chapters.map(ch => ({
        ...ch,
        topics: Array.isArray(ch.topics) ? ch.topics : []
      })) : []
    };
    setFormData(safeAudioBook);
    setThumbnailFileName(audioBook.thumbnailUrl ? 'Current thumbnail' : '');

    try {
      const res = await fetch(`/api/audiobooks/${audioBook._id}`);
      if (res.ok) {
        const fullData = await res.json();
        const safeFullData = {
          ...fullData,
          chapters: Array.isArray(fullData.chapters) ? fullData.chapters.map(ch => ({
            ...ch,
            topics: Array.isArray(ch.topics) ? ch.topics : []
          })) : []
        };
        setFormData(safeFullData);
        setCurrentAudioBook(safeFullData);
      }
    } catch (error) {
      console.error('Error fetching full audiobook details:', error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this audio book?')) {
      deleteAudioBook(id);
    }
  };

  // Convert file to base64
  // Upload file to server
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  // Handle thumbnail upload
  const handleThumbnailFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }
      try {
        setThumbnailFileName('Uploading...');
        const url = await uploadFile(file);
        setFormData({ ...formData, thumbnailUrl: url });
        setThumbnailFileName(file.name);
      } catch (error) {
        setThumbnailFileName('Upload failed');
        alert('Error uploading thumbnail');
      }
    }
  };

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

  // Handle audio file upload for topics
  const handleAudioFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        alert('Please upload a valid audio file (MP3, WAV, etc.)');
        return;
      }
      try {
        setAudioFileName('Uploading...');
        const url = await uploadFile(file);
        setCurrentTopic({ ...currentTopic, audioUrl: url });
        setAudioFileName(file.name);
      } catch (error) {
        setAudioFileName('Upload failed');
        alert('Error uploading audio file');
      }
    }
  };

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
        setCurrentTopic({ ...currentTopic, audioUrl: base64 });
        setAudioFileName(file.name);
      } catch (error) {
        console.error('Error converting audio file:', error);
        alert('Error uploading audio file');
      }
    } else {
      alert('Please drop a valid audio file');
    }
  };

  // Topic management functions
  const handleAddTopic = () => {
    if (!currentTopic.title || !currentTopic.audioUrl) {
      alert('Please provide topic title and audio file');
      return;
    }

    const updatedTopics = [...currentChapter.topics];
    if (editingTopicIndex !== null) {
      updatedTopics[editingTopicIndex] = { ...currentTopic };
      setEditingTopicIndex(null);
    } else {
      updatedTopics.push({ ...currentTopic });
    }

    setCurrentChapter({ ...currentChapter, topics: updatedTopics });
    setCurrentTopic({ title: '', description: '', duration: '', audioUrl: '' });
    setAudioFileName('');
  };

  const handleEditTopic = (index) => {
    if (Array.isArray(currentChapter.topics) && currentChapter.topics[index]) {
      setCurrentTopic(currentChapter.topics[index]);
      setEditingTopicIndex(index);
      setAudioFileName('Current audio file');
    }
  };

  const handleDeleteTopic = (index) => {
    const updatedTopics = Array.isArray(currentChapter.topics) ? currentChapter.topics.filter((_, i) => i !== index) : [];
    setCurrentChapter({ ...currentChapter, topics: updatedTopics });
  };

  // Chapter management functions
  const handleAddChapter = () => {
    if (!currentChapter.title || !Array.isArray(currentChapter.topics) || currentChapter.topics.length === 0) {
      alert('Please provide chapter title and at least one topic');
      return;
    }

    const updatedChapters = Array.isArray(formData.chapters) ? [...formData.chapters] : [];
    if (editingChapterIndex !== null) {
      updatedChapters[editingChapterIndex] = { ...currentChapter };
      setEditingChapterIndex(null);
    } else {
      updatedChapters.push({ ...currentChapter });
    }

    setFormData({ ...formData, chapters: updatedChapters });
    setCurrentChapter({ title: '', topics: [] });
    setCurrentTopic({ title: '', description: '', duration: '', audioUrl: '' });
    setAudioFileName('');
  };

  const handleEditChapter = (index) => {
    const chapter = formData.chapters && formData.chapters[index];
    if (chapter) {
      const safeChapter = {
        ...chapter,
        topics: Array.isArray(chapter.topics) ? chapter.topics : []
      };
      setCurrentChapter(safeChapter);
      setEditingChapterIndex(index);
    }
  };

  const handleDeleteChapter = (index) => {
    const updatedChapters = Array.isArray(formData.chapters) ? formData.chapters.filter((_, i) => i !== index) : [];
    setFormData({ ...formData, chapters: updatedChapters });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check payload size
    const payloadSize = JSON.stringify(formData).length;
    if (payloadSize > 16000000) {
      alert(`The audio book content is too large (${(payloadSize / (1024 * 1024)).toFixed(2)}MB) for a single entry. The database limit is 16MB. Please compress your audio/images or split the book into multiple parts.`);
      return;
    }

    if (!Array.isArray(formData.chapters) || formData.chapters.length === 0) {
      alert('Please add at least one chapter with topics');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateAudioBook(currentAudioBook._id, formData);
      } else {
        await addAudioBook(formData);
      }
      // Reset form immediately after successful save
      setIsEditing(false);
      setCurrentAudioBook(null);
      setFormData(initialFormState);
      setThumbnailFileName('');
      setCurrentChapter({ title: '', topics: [] });
      setCurrentTopic({ title: '', description: '', duration: '', audioUrl: '' });
    } catch (error) {
      console.error('Error submitting audio book:', error);
      alert('Error: ' + (error.message || 'Failed to save audio book. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination calculations
  const safeAudioBooks = Array.isArray(audioBooks) ? audioBooks : [];
  const totalPages = Math.ceil(safeAudioBooks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAudioBooks = safeAudioBooks.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-8">
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white mb-6">
          {isEditing ? 'Edit Audio Book' : 'Add New Audio Book'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <i className="fas fa-book"></i>
              Book Information
            </h3>

            <input
              type="text"
              placeholder="Book Title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
              required
            />

            <textarea
              placeholder="Book Description"
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

              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
              >
                <option value="General">General</option>
                <optgroup label="Exam-wise">
                  <option value="JEE">JEE (Main & Advanced)</option>
                  <option value="NEET">NEET</option>
                  <option value="IAT">IAT (IISER Aptitude Test)</option>
                  <option value="NEST">NEST (National Entrance Screening Test)</option>
                  <option value="TIFR">TIFR (Tata Institute)</option>
                  <option value="CSIR NET">CSIR NET</option>
                  <option value="GATE">GATE</option>
                  <option value="IIT JAM">IIT JAM</option>
                </optgroup>
                <optgroup label="Chemistry Topics">
                  <option value="Physical Chemistry">Physical Chemistry</option>
                  <option value="Organic Chemistry">Organic Chemistry</option>
                  <option value="Inorganic Chemistry">Inorganic Chemistry</option>
                </optgroup>
              </select>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-gray-400 mb-2 font-semibold">
                <i className="fas fa-image mr-2 text-pink-400"></i>
                Book Cover/Thumbnail (Optional)
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
                  id="thumbnailInput"
                />
                <label htmlFor="thumbnailInput" className="cursor-pointer">
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
          </div>

          {/* Chapter & Topic Management */}
          <div className="border-t border-gray-700 pt-6 space-y-6">
            <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
              <i className="fas fa-list"></i>
              Chapters & Topics
            </h3>

            {/* Current Chapter Form */}
            <div className="bg-gray-800/50 p-4 rounded-lg space-y-4">
              <h4 className="text-md font-semibold text-white flex items-center gap-2">
                <i className="fas fa-bookmark"></i>
                {editingChapterIndex !== null ? 'Edit Chapter' : 'Add New Chapter'}
              </h4>

              <input
                type="text"
                placeholder="Chapter Title"
                value={currentChapter.title}
                onChange={e => setCurrentChapter({ ...currentChapter, title: e.target.value })}
                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
              />

              {/* Topic Form */}
              <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                <h5 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                  <i className="fas fa-headphones"></i>
                  {editingTopicIndex !== null ? 'Edit Topic' : 'Add Topic to Chapter'}
                </h5>

                <input
                  type="text"
                  placeholder="Topic Title"
                  value={currentTopic.title}
                  onChange={e => setCurrentTopic({ ...currentTopic, title: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded p-2 text-white w-full text-sm"
                />

                <textarea
                  placeholder="Topic Description (Optional)"
                  value={currentTopic.description}
                  onChange={e => setCurrentTopic({ ...currentTopic, description: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded p-2 text-white w-full h-16 text-sm"
                />

                <input
                  type="text"
                  placeholder="Duration (e.g., 5:30)"
                  value={currentTopic.duration}
                  onChange={e => setCurrentTopic({ ...currentTopic, duration: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded p-2 text-white w-full text-sm"
                />

                {/* Audio Upload for Topic */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-semibold">
                    <i className="fas fa-music mr-2 text-purple-400"></i>
                    Topic Audio File *
                  </label>
                  <div
                    onDragOver={handleAudioDragOver}
                    onDragLeave={handleAudioDragLeave}
                    onDrop={handleAudioDrop}
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${isDraggingAudio
                      ? 'border-purple-400 bg-purple-500/10'
                      : 'border-gray-700 hover:border-purple-500'
                      }`}
                  >
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileChange}
                      className="hidden"
                      id="audioInput"
                    />
                    <label htmlFor="audioInput" className="cursor-pointer">
                      <i className="fas fa-cloud-upload-alt text-3xl text-purple-400 mb-2 block"></i>
                      <p className="text-white mb-1 text-sm">
                        {audioFileName || 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-gray-500 text-xs">
                        MP3, WAV, OGG (Max 50MB)
                      </p>
                    </label>
                  </div>
                  {currentTopic.audioUrl && (
                    <div className="mt-2 p-2 bg-purple-900/30 border border-purple-500/50 rounded">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-400 text-sm"></i>
                        <span className="text-xs text-gray-300">Audio uploaded</span>
                        <audio controls className="ml-auto h-8">
                          <source src={currentTopic.audioUrl} />
                        </audio>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="w-full bg-cyan-500 text-white font-semibold py-2 px-4 rounded hover:bg-cyan-400 transition text-sm"
                >
                  <i className="fas fa-plus mr-2"></i>
                  {editingTopicIndex !== null ? 'Update Topic' : 'Add Topic'}
                </button>
              </div>

              {/* Topics List */}
              {currentChapter.topics && Array.isArray(currentChapter.topics) && currentChapter.topics.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-white">Topics in this Chapter:</h5>
                  {currentChapter.topics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-900 p-3 rounded">
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{topic.title}</p>
                        {topic.duration && <p className="text-gray-400 text-xs">{topic.duration}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditTopic(index)}
                          className="p-2 text-cyan-400 hover:bg-gray-800 rounded text-sm"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTopic(index)}
                          className="p-2 text-red-400 hover:bg-gray-800 rounded text-sm"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleAddChapter}
                className="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-400 transition"
              >
                <i className="fas fa-plus mr-2"></i>
                {editingChapterIndex !== null ? 'Update Chapter' : 'Add Chapter to Book'}
              </button>
            </div>

            {/* Chapters List */}
            {formData.chapters.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-white">Book Chapters ({formData.chapters.length}):</h4>
                {formData.chapters && Array.isArray(formData.chapters) && formData.chapters.map((chapter, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-white font-bold">{chapter.title}</h5>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditChapter(index)}
                          className="p-2 text-cyan-400 hover:bg-gray-700 rounded"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteChapter(index)}
                          className="p-2 text-red-400 hover:bg-gray-700 rounded"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{chapter.topics.length} topics</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`font-bold py-3 px-8 rounded transition ${isSubmitting
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-400'
                } text-white`}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Audio Book' : 'Create Audio Book'
              )}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentAudioBook(null);
                  setFormData(initialFormState);
                  setThumbnailFileName('');
                  setCurrentChapter({ title: '', topics: [] });
                  setCurrentTopic({ title: '', description: '', duration: '', audioUrl: '' });
                }}
                className="bg-gray-700 text-white font-bold py-3 px-8 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Audio Books List */}
      {safeAudioBooks.length > 0 && (
        <div className="mb-4 text-gray-400">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, safeAudioBooks.length)} of {safeAudioBooks.length} audiobooks
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {currentAudioBooks.map(book => (
          <div key={book._id} className="glass-panel p-4 rounded-xl">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{book.title}</h3>
                <p className="text-sm text-gray-400">{book.description}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="px-3 py-1 bg-purple-900/50 border border-purple-500 text-purple-400 rounded-full text-xs">
                    {book.category}
                  </span>
                  {book.chapters && (
                    <span className="px-3 py-1 bg-cyan-900/50 border border-cyan-500 text-cyan-400 rounded-full text-xs">
                      {book.chapters.length} Chapters
                    </span>
                  )}
                  {book.author && (
                    <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs">
                      {book.author}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(book)}
                  className="p-2 text-cyan-400 hover:bg-gray-800 rounded"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="p-2 text-red-400 hover:bg-gray-800 rounded"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>

            {/* Chapters List */}
            {book.chapters && book.chapters.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-gray-700 pt-3">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Chapters:</h4>
                {book.chapters && Array.isArray(book.chapters) && book.chapters.map((chapter, chapterIndex) => (
                  <div key={chapterIndex} className="bg-gray-800/50 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleChapter(chapterIndex)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <i className={`fas fa-chevron-${expandedChapters[chapterIndex] ? 'down' : 'right'} text-cyan-400 text-xs`}></i>
                        <span className="text-white font-semibold text-sm">{chapter.title}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {chapter.topics?.length || 0} topics
                      </span>
                    </button>

                    {/* Topics List */}
                    {expandedChapters[chapterIndex] && chapter.topics && (
                      <div className="bg-gray-900/50 p-3 space-y-2">
                        {chapter.topics && Array.isArray(chapter.topics) && chapter.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                            <div className="flex items-center gap-3 flex-1">
                              <i className="fas fa-headphones text-purple-400 text-xs"></i>
                              <div>
                                <p className="text-white text-sm font-medium">{topic.title}</p>
                                {topic.description && (
                                  <p className="text-gray-500 text-xs">{topic.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {topic.duration && (
                                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                  <i className="fas fa-clock mr-1"></i>
                                  {topic.duration}
                                </span>
                              )}
                              {topic.audioUrl && (
                                <span className="text-xs text-green-400">
                                  <i className="fas fa-check-circle"></i>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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

export default ManageAudioBooks;
