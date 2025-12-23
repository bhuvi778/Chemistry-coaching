import { useState, useEffect } from 'react';

const ManageCrosswords = () => {
    const [crosswords, setCrosswords] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCrossword, setCurrentCrossword] = useState(null);
    const [thumbnailFileName, setThumbnailFileName] = useState('');
    const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);
    const [loading, setLoading] = useState(true);

    const initialFormState = {
        title: '',
        description: '',
        chapter: '',
        topic: '',
        examType: 'All',
        crosswordUrl: '',
        difficulty: 'Medium',
        thumbnailUrl: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // Fetch crosswords on mount
    useEffect(() => {
        fetchCrosswords();
    }, []);

    const fetchCrosswords = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/crosswords`);
            const data = await response.json();
            setCrosswords(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching crosswords:', error);
            setLoading(false);
        }
    };

    const handleEdit = (crossword) => {
        setIsEditing(true);
        setCurrentCrossword(crossword);
        setFormData(crossword);
        setThumbnailFileName(crossword.thumbnailUrl ? 'Current thumbnail' : '');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this crossword?')) {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                await fetch(`${API_URL}/crosswords/${id}`, {
                    method: 'DELETE'
                });
                fetchCrosswords();
                alert('Crossword deleted successfully!');
            } catch (error) {
                console.error('Error deleting crossword:', error);
                alert('Error deleting crossword');
            }
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

    // Handle thumbnail upload
    const handleThumbnailFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file');
                return;
            }

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

        if (!formData.crosswordUrl) {
            alert('Please enter crossword URL');
            return;
        }

        // Validate URL
        try {
            new URL(formData.crosswordUrl);
        } catch {
            alert('Please enter a valid URL');
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing
                ? `${API_URL}/crosswords/${currentCrossword._id}`
                : `${API_URL}/crosswords`;

            console.log('Submitting to:', url);
            console.log('Form data:', formData);

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const savedCrossword = await response.json();
                console.log('Saved crossword:', savedCrossword);
                alert(isEditing ? 'Crossword updated successfully!' : 'Crossword added successfully!');
                setIsEditing(false);
                setCurrentCrossword(null);
                setFormData(initialFormState);
                setThumbnailFileName('');
                fetchCrosswords();
            } else {
                const error = await response.json();
                console.error('Server error:', error);
                let errorMsg = error.message || 'Failed to save crossword';
                if (error.details && error.details.length > 0) {
                    errorMsg += '\n' + error.details.map(d => `${d.field}: ${d.message}`).join('\n');
                }
                alert(`Error: ${errorMsg}`);
            }
        } catch (error) {
            console.error('Error submitting crossword:', error);

            // Check if it's a network error
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                alert('Network Error: Cannot connect to server.\n\nPlease check:\n1. Is the server running? (npm run dev in server folder)\n2. Is the server URL correct?\n3. Check browser console for details');
            } else {
                alert('Error submitting crossword: ' + error.message + '\n\nCheck browser console for details');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="glass-panel p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4">
                    {isEditing ? 'Edit Interactive Crossword' : 'Add New Interactive Crossword'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title (e.g., JEE - Organic Chemistry Crossword)"
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
                            placeholder="Chapter (e.g., Organic Chemistry)"
                            value={formData.chapter}
                            onChange={e => setFormData({ ...formData, chapter: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Topic (Optional)"
                            value={formData.topic}
                            onChange={e => setFormData({ ...formData, topic: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2 font-semibold">
                            <i className="fas fa-link mr-2 text-cyan-400"></i>
                            Crossword URL (e.g., https://crosswordlabs.com/embed/chemistry-9935) *
                        </label>
                        <input
                            type="url"
                            placeholder="https://crosswordlabs.com/embed/your-crossword-name-1234"
                            value={formData.crosswordUrl}
                            onChange={e => setFormData({ ...formData, crosswordUrl: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            required
                        />
                        <p className="text-gray-500 text-sm mt-2">
                            <i className="fas fa-info-circle mr-1"></i>
                            Create crossword at crosswordlabs.com and paste the embed URL here
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            value={formData.examType}
                            onChange={e => setFormData({ ...formData, examType: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        >
                            <option value="All">All Exams</option>
                            <option value="JEE">JEE</option>
                            <option value="NEET">NEET</option>
                            <option value="BOARDS">BOARDS</option>
                        </select>

                        <select
                            value={formData.difficulty}
                            onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                        <label className="block text-gray-400 mb-2 font-semibold">
                            <i className="fas fa-image mr-2 text-blue-400"></i>
                            Thumbnail Image (Optional)
                        </label>
                        <div
                            onDragOver={handleThumbnailDragOver}
                            onDragLeave={handleThumbnailDragLeave}
                            onDrop={handleThumbnailDrop}
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDraggingThumbnail
                                ? 'border-blue-400 bg-blue-500/10'
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
                                <i className="fas fa-image text-4xl text-blue-400 mb-3 block"></i>
                                <p className="text-white mb-2">
                                    {thumbnailFileName || 'Click to upload or drag and drop'}
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

                    <div className="flex gap-4">
                        <button type="submit" className="bg-cyan-500 text-white font-bold py-2 px-6 rounded hover:bg-cyan-400 transition">
                            {isEditing ? 'Update Crossword' : 'Add Crossword'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentCrossword(null);
                                    setFormData(initialFormState);
                                    setThumbnailFileName('');
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
                <h3 className="text-xl font-bold text-white">All Interactive Crosswords ({crosswords.length})</h3>
                {loading ? (
                    <div className="text-center py-10">
                        <i className="fas fa-spinner fa-spin text-4xl text-cyan-400"></i>
                        <p className="text-gray-400 mt-4">Loading crosswords...</p>
                    </div>
                ) : crosswords.length === 0 ? (
                    <div className="text-center py-10 glass-panel rounded-xl">
                        <i className="fas fa-th text-6xl text-gray-600 mb-4"></i>
                        <p className="text-gray-400">No crosswords added yet</p>
                    </div>
                ) : (
                    crosswords.map(crossword => (
                        <div key={crossword._id} className="glass-panel p-4 rounded-xl flex justify-between items-center">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white">{crossword.title}</h3>
                                <p className="text-sm text-gray-400">{crossword.description}</p>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    <span className="px-3 py-1 bg-cyan-900/50 border border-cyan-500 text-cyan-400 rounded-full text-xs">
                                        {crossword.chapter}
                                    </span>
                                    <span className="px-3 py-1 bg-purple-900/50 border border-purple-500 text-purple-400 rounded-full text-xs">
                                        {crossword.topic}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-900/50 border border-blue-500 text-blue-400 rounded-full text-xs">
                                        {crossword.examType}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs ${crossword.difficulty === 'Easy' ? 'bg-green-900/50 border border-green-500 text-green-400' :
                                        crossword.difficulty === 'Medium' ? 'bg-yellow-900/50 border border-yellow-500 text-yellow-400' :
                                            'bg-red-900/50 border border-red-500 text-red-400'
                                        }`}>
                                        {crossword.difficulty}
                                    </span>
                                </div>
                                <a
                                    href={crossword.crosswordUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 text-sm mt-2 inline-flex items-center gap-1"
                                >
                                    <i className="fas fa-external-link-alt"></i>
                                    {crossword.crosswordUrl}
                                </a>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(crossword)} className="p-2 text-cyan-400 hover:bg-gray-800 rounded">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button onClick={() => handleDelete(crossword._id)} className="p-2 text-red-400 hover:bg-gray-800 rounded">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageCrosswords;
