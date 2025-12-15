import { useState } from 'react';
import { useData } from '../../context/DataContext';

const ManageAudioBooks = () => {
  const { audioBooks, addAudioBook, updateAudioBook, deleteAudioBook } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentAudioBook, setCurrentAudioBook] = useState(null);
  const [showChapterForm, setShowChapterForm] = useState(false);

  const initialFormState = {
    title: '',
    description: '',
    author: '',
    duration: '',
    audioUrl: '',
    thumbnailUrl: '',
    category: 'General',
    chapters: []
  };

  const initialChapterState = {
    title: '',
    topics: []
  };

  const initialTopicState = {
    title: '',
    description: '',
    audioUrl: '',
    duration: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [currentChapter, setCurrentChapter] = useState(initialChapterState);
  const [currentTopic, setCurrentTopic] = useState(initialTopicState);
  const [editingChapterIndex, setEditingChapterIndex] = useState(null);
  const [editingTopicIndex, setEditingTopicIndex] = useState(null);

  const handleEdit = (audioBook) => {
    setIsEditing(true);
    setCurrentAudioBook(audioBook);
    setFormData({
      ...audioBook,
      chapters: audioBook.chapters || []
    });
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
      setShowChapterForm(false);
    } catch (error) {
      console.error('Error submitting audio book:', error);
    }
  };

  const addChapter = () => {
    if (!currentChapter.title.trim()) {
      alert('Please enter a chapter title');
      return;
    }

    const newChapter = {
      ...currentChapter,
      _id: Date.now().toString(),
      topics: currentChapter.topics || []
    };

    if (editingChapterIndex !== null) {
      const updatedChapters = [...formData.chapters];
      updatedChapters[editingChapterIndex] = newChapter;
      setFormData({ ...formData, chapters: updatedChapters });
      setEditingChapterIndex(null);
    } else {
      setFormData({
        ...formData,
        chapters: [...formData.chapters, newChapter]
      });
    }

    setCurrentChapter(initialChapterState);
    setShowChapterForm(false);
  };

  const editChapter = (index) => {
    setCurrentChapter(formData.chapters[index]);
    setEditingChapterIndex(index);
    setShowChapterForm(true);
  };

  const deleteChapter = (index) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      const updatedChapters = formData.chapters.filter((_, i) => i !== index);
      setFormData({ ...formData, chapters: updatedChapters });
    }
  };

  const addTopicToChapter = () => {
    if (!currentTopic.title.trim() || !currentTopic.audioUrl.trim()) {
      alert('Please enter topic title and audio URL');
      return;
    }

    const newTopic = {
      ...currentTopic,
      _id: Date.now().toString()
    };

    const updatedTopics = editingTopicIndex !== null
      ? currentChapter.topics.map((topic, i) => i === editingTopicIndex ? newTopic : topic)
      : [...(currentChapter.topics || []), newTopic];

    setCurrentChapter({
      ...currentChapter,
      topics: updatedTopics
    });

    setCurrentTopic(initialTopicState);
    setEditingTopicIndex(null);
  };

  const editTopic = (index) => {
    setCurrentTopic(currentChapter.topics[index]);
    setEditingTopicIndex(index);
  };

  const deleteTopic = (index) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      const updatedTopics = currentChapter.topics.filter((_, i) => i !== index);
      setCurrentChapter({ ...currentChapter, topics: updatedTopics });
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
          <input
            type="url"
            placeholder="Thumbnail URL (optional)"
            value={formData.thumbnailUrl}
            onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
          />
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

          {/* Chapters Section */}
          <div className="border-t border-gray-700 pt-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Chapters & Topics</h3>
              <button
                type="button"
                onClick={() => {
                  setShowChapterForm(!showChapterForm);
                  setCurrentChapter(initialChapterState);
                  setEditingChapterIndex(null);
                }}
                className="px-4 py-2 bg-cyan-500 text-black rounded hover:bg-cyan-400 transition font-semibold"
              >
                <i className="fas fa-plus mr-2"></i>
                {showChapterForm ? 'Cancel' : 'Add Chapter'}
              </button>
            </div>

            {/* Chapter Form */}
            {showChapterForm && (
              <div className="bg-gray-800 p-4 rounded-lg mb-4 space-y-4">
                <h4 className="font-bold text-cyan-400">
                  {editingChapterIndex !== null ? 'Edit Chapter' : 'New Chapter'}
                </h4>
                <input
                  type="text"
                  placeholder="Chapter Title"
                  value={currentChapter.title}
                  onChange={e => setCurrentChapter({ ...currentChapter, title: e.target.value })}
                  className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                />

                {/* Topics in Current Chapter */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-white">Topics</h5>

                  {/* Topic Form */}
                  <div className="bg-gray-900 p-3 rounded space-y-2">
                    <input
                      type="text"
                      placeholder="Topic Title"
                      value={currentTopic.title}
                      onChange={e => setCurrentTopic({ ...currentTopic, title: e.target.value })}
                      className="bg-gray-800 border border-gray-700 rounded p-2 text-white w-full text-sm"
                    />
                    <textarea
                      placeholder="Topic Description (optional)"
                      value={currentTopic.description}
                      onChange={e => setCurrentTopic({ ...currentTopic, description: e.target.value })}
                      className="bg-gray-800 border border-gray-700 rounded p-2 text-white w-full text-sm h-16"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="url"
                        placeholder="Audio URL (.mp3)"
                        value={currentTopic.audioUrl}
                        onChange={e => setCurrentTopic({ ...currentTopic, audioUrl: e.target.value })}
                        className="bg-gray-800 border border-gray-700 rounded p-2 text-white w-full text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., 15:30)"
                        value={currentTopic.duration}
                        onChange={e => setCurrentTopic({ ...currentTopic, duration: e.target.value })}
                        className="bg-gray-800 border border-gray-700 rounded p-2 text-white w-full text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addTopicToChapter}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400 transition text-sm"
                    >
                      <i className="fas fa-plus mr-1"></i>
                      {editingTopicIndex !== null ? 'Update Topic' : 'Add Topic'}
                    </button>
                  </div>

                  {/* Topics List */}
                  {currentChapter.topics && currentChapter.topics.length > 0 && (
                    <div className="space-y-2">
                      {currentChapter.topics.map((topic, index) => (
                        <div key={index} className="bg-gray-900 p-2 rounded flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-white text-sm font-semibold">{topic.title}</p>
                            <p className="text-gray-400 text-xs">{topic.duration || 'No duration'}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => editTopic(index)}
                              className="text-cyan-400 hover:text-cyan-300 text-sm"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteTopic(index)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={addChapter}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-400 transition font-semibold"
                >
                  {editingChapterIndex !== null ? 'Update Chapter' : 'Save Chapter'}
                </button>
              </div>
            )}

            {/* Chapters List */}
            {formData.chapters && formData.chapters.length > 0 && (
              <div className="space-y-3">
                {formData.chapters.map((chapter, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="text-white font-bold">{chapter.title}</h4>
                        <p className="text-gray-400 text-sm">
                          {chapter.topics?.length || 0} topics
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => editChapter(index)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteChapter(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    {chapter.topics && chapter.topics.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {chapter.topics.map((topic, tIndex) => (
                          <div key={tIndex} className="text-sm text-gray-400 ml-4">
                            <i className="fas fa-play-circle mr-2"></i>
                            {topic.title} {topic.duration && `(${topic.duration})`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
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
                  setShowChapterForm(false);
                }}
                className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Audio Books List */}
      <div className="grid grid-cols-1 gap-4">
        <h2 className="text-xl font-bold text-white">Existing Audio Books</h2>
        {audioBooks.map(audioBook => (
          <div key={audioBook._id} className="glass-panel p-4 rounded-xl">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{audioBook.title}</h3>
                <p className="text-sm text-gray-400">{audioBook.description}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="px-3 py-1 bg-purple-900/50 border border-purple-500 text-purple-400 rounded-full text-xs">
                    {audioBook.category}
                  </span>
                  {audioBook.chapters && (
                    <span className="px-3 py-1 bg-cyan-900/50 border border-cyan-500 text-cyan-400 rounded-full text-xs">
                      {audioBook.chapters.length} chapters
                    </span>
                  )}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAudioBooks;
