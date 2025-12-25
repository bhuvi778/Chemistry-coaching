import { useState, useEffect } from 'react';
import Pagination from '../../components/UI/Pagination';

const ManagePuzzleSets = () => {
    const [puzzleSets, setPuzzleSets] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPuzzleSet, setCurrentPuzzleSet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const initialFormState = {
        setNumber: '',
        title: '',
        description: '',
        chapter: '',
        topic: '',
        examType: 'All',
        difficulty: 'Medium',
        thumbnailUrl: '',
        setPdfUrl: '',
        setPdfSize: '',
        answerPdfUrl: '',
        answerPdfSize: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [fileNames, setFileNames] = useState({
        thumbnail: '',
        setPdf: '',
        answerPdf: ''
    });

    useEffect(() => {
        fetchPuzzleSets();
    }, []);

    const fetchPuzzleSets = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/puzzle-sets?_t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            const data = await response.json();
            console.log('Fetched puzzle sets:', data.length);
            // Ensure data is always an array
            setPuzzleSets(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching puzzle sets:', error);
            setPuzzleSets([]);
            setLoading(false);
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Thumbnail file selected:', file.name, 'Size:', file.size, 'Type:', file.type);
            
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Image must be under 5MB');
                return;
            }

            try {
                const base64 = await convertToBase64(file);
                console.log('Thumbnail converted to base64, length:', base64.length);
                
                // Use functional update to ensure we have the latest state
                setFormData(prevData => ({
                    ...prevData,
                    thumbnailUrl: base64
                }));
                
                setFileNames(prev => ({
                    ...prev,
                    thumbnail: file.name
                }));
                
                console.log('Thumbnail saved to formData');
            } catch (error) {
                console.error('Error uploading thumbnail:', error);
                alert('Error uploading thumbnail: ' + error.message);
            }
        }
    };

    const handleSetPdfUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file');
                return;
            }
            if (file.size > 50 * 1024 * 1024) {
                alert('PDF must be under 50MB');
                return;
            }

            try {
                const base64 = await convertToBase64(file);
                const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                setFormData(prevData => ({
                    ...prevData,
                    setPdfUrl: base64,
                    setPdfSize: `${sizeInMB} MB`
                }));
                setFileNames(prev => ({ ...prev, setPdf: file.name }));
            } catch (error) {
                console.error('Error uploading PDF:', error);
                alert('Error uploading PDF');
            }
        }
    };

    const handleAnswerPdfUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file');
                return;
            }
            if (file.size > 50 * 1024 * 1024) {
                alert('PDF must be under 50MB');
                return;
            }

            try {
                const base64 = await convertToBase64(file);
                const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                setFormData(prevData => ({
                    ...prevData,
                    answerPdfUrl: base64,
                    answerPdfSize: `${sizeInMB} MB`
                }));
                setFileNames(prev => ({ ...prev, answerPdf: file.name }));
            } catch (error) {
                console.error('Error uploading PDF:', error);
                alert('Error uploading PDF');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('=== FORM SUBMIT STARTED ===');
        console.log('Current formData state:', {
            setNumber: formData.setNumber,
            title: formData.title,
            hasThumbnail: !!formData.thumbnailUrl,
            thumbnailLength: formData.thumbnailUrl?.length || 0,
            hasPdf: !!formData.setPdfUrl,
            pdfLength: formData.setPdfUrl?.length || 0,
            hasAnswer: !!formData.answerPdfUrl,
            answerLength: formData.answerPdfUrl?.length || 0
        });

        if (!formData.setPdfUrl || !formData.answerPdfUrl) {
            alert('Please upload both puzzle PDF and answer PDF');
            console.error('Missing PDFs - setPdf:', !!formData.setPdfUrl, 'answerPdf:', !!formData.answerPdfUrl);
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing
                ? `${API_URL}/puzzle-sets/${currentPuzzleSet._id}`
                : `${API_URL}/puzzle-sets`;

            console.log('Sending to:', url);
            console.log('Method:', method);

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Success! Saved puzzle:', result);
                alert(isEditing ? 'Puzzle set updated successfully!' : 'Puzzle set added successfully!');
                setIsEditing(false);
                setCurrentPuzzleSet(null);
                setFormData(initialFormState);
                setFileNames({ thumbnail: '', setPdf: '', answerPdf: '' });
                fetchPuzzleSets();
            } else {
                const error = await response.json();
                console.error('❌ Server error:', error);
                alert(`Error: ${error.message || 'Failed to save puzzle set'}`);
            }
        } catch (error) {
            console.error('❌ Error submitting puzzle set:', error);
            alert('Error submitting puzzle set: ' + error.message);
        }
    };

    const handleEdit = (puzzleSet) => {
        setIsEditing(true);
        setCurrentPuzzleSet(puzzleSet);
        setFormData(puzzleSet);
        setFileNames({
            thumbnail: puzzleSet.thumbnailUrl ? 'Current thumbnail' : '',
            setPdf: puzzleSet.setPdfUrl ? 'Current PDF' : '',
            answerPdf: puzzleSet.answerPdfUrl ? 'Current PDF' : ''
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this puzzle set?')) {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const response = await fetch(`${API_URL}/puzzle-sets/${id}`, { 
                    method: 'DELETE',
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to delete puzzle set');
                }
                
                const data = await response.json();
                console.log('Delete response:', data);
                
                // Immediately update state to remove the deleted item
                setPuzzleSets(prevSets => prevSets.filter(set => set._id !== id));
                
                // Also refetch to ensure sync with server
                await fetchPuzzleSets();
                
                alert('Puzzle set deleted successfully!');
            } catch (error) {
                console.error('Error deleting puzzle set:', error);
                alert('Error deleting puzzle set: ' + error.message);
                // Refetch on error to ensure UI is in sync
                await fetchPuzzleSets();
            }
        }
    };

    // Pagination calculations
    const totalPages = Math.ceil(puzzleSets.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPuzzleSets = puzzleSets.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="space-y-8">
            <div className="glass-panel p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4">
                    {isEditing ? 'Edit Puzzle Set' : 'Add New Puzzle Set'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Set Number (e.g., Set-1)"
                            value={formData.setNumber}
                            onChange={e => setFormData(prev => ({ ...prev, setNumber: e.target.value }))}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Title (e.g., JEE Organic Chemistry)"
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            required
                        />
                    </div>

                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full h-24"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Chapter (e.g., Organic Chemistry)"
                            value={formData.chapter}
                            onChange={e => setFormData(prev => ({ ...prev, chapter: e.target.value }))}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Topic (e.g., Reaction Mechanisms)"
                            value={formData.topic}
                            onChange={e => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            value={formData.examType}
                            onChange={e => setFormData(prev => ({ ...prev, examType: e.target.value }))}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        >
                            <option value="All">All Exams</option>
                            <option value="JEE">JEE</option>
                            <option value="NEET">NEET</option>
                            <option value="BOARDS">BOARDS</option>
                        </select>

                        <select
                            value={formData.difficulty}
                            onChange={e => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
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
                            Thumbnail Image (Circle)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            className="hidden"
                            id="thumbnailInput"
                        />
                        <label
                            htmlFor="thumbnailInput"
                            className="block w-full p-4 border-2 border-dashed border-gray-700 rounded-lg text-center cursor-pointer hover:border-blue-500 transition"
                        >
                            <i className="fas fa-cloud-upload-alt text-3xl text-blue-400 mb-2"></i>
                            <p className="text-white">{fileNames.thumbnail || 'Click to upload thumbnail'}</p>
                            <p className="text-gray-500 text-sm">PNG, JPG (Max 5MB)</p>
                        </label>
                    </div>

                    {/* Puzzle PDF Upload */}
                    <div>
                        <label className="block text-gray-400 mb-2 font-semibold">
                            <i className="fas fa-file-pdf mr-2 text-cyan-400"></i>
                            Puzzle Set PDF *
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleSetPdfUpload}
                            className="hidden"
                            id="setPdfInput"
                            required
                        />
                        <label
                            htmlFor="setPdfInput"
                            className="block w-full p-4 border-2 border-dashed border-gray-700 rounded-lg text-center cursor-pointer hover:border-cyan-500 transition"
                        >
                            <i className="fas fa-file-pdf text-3xl text-cyan-400 mb-2"></i>
                            <p className="text-white">{fileNames.setPdf || 'Click to upload puzzle PDF'}</p>
                            <p className="text-gray-500 text-sm">PDF (Max 50MB)</p>
                            {formData.setPdfSize && <p className="text-green-400 text-sm mt-1">Size: {formData.setPdfSize}</p>}
                        </label>
                    </div>

                    {/* Answer PDF Upload */}
                    <div>
                        <label className="block text-gray-400 mb-2 font-semibold">
                            <i className="fas fa-file-pdf mr-2 text-green-400"></i>
                            Answer PDF *
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleAnswerPdfUpload}
                            className="hidden"
                            id="answerPdfInput"
                            required
                        />
                        <label
                            htmlFor="answerPdfInput"
                            className="block w-full p-4 border-2 border-dashed border-gray-700 rounded-lg text-center cursor-pointer hover:border-green-500 transition"
                        >
                            <i className="fas fa-file-pdf text-3xl text-green-400 mb-2"></i>
                            <p className="text-white">{fileNames.answerPdf || 'Click to upload answer PDF'}</p>
                            <p className="text-gray-500 text-sm">PDF (Max 50MB)</p>
                            {formData.answerPdfSize && <p className="text-green-400 text-sm mt-1">Size: {formData.answerPdfSize}</p>}
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" className="bg-cyan-500 text-white font-bold py-2 px-6 rounded hover:bg-cyan-400 transition">
                            {isEditing ? 'Update Puzzle Set' : 'Add Puzzle Set'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentPuzzleSet(null);
                                    setFormData(initialFormState);
                                    setFileNames({ thumbnail: '', setPdf: '', answerPdf: '' });
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
                <h3 className="text-xl font-bold text-white">All Puzzle Sets ({puzzleSets.length})</h3>
                
                {puzzleSets.length > 0 && (
                    <div className="mb-4 text-gray-400">
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, puzzleSets.length)} of {puzzleSets.length} puzzle sets
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-10">
                        <i className="fas fa-spinner fa-spin text-4xl text-cyan-400"></i>
                        <p className="text-gray-400 mt-4">Loading puzzle sets...</p>
                    </div>
                ) : puzzleSets.length === 0 ? (
                    <div className="text-center py-10 glass-panel rounded-xl">
                        <i className="fas fa-th text-6xl text-gray-600 mb-4"></i>
                        <p className="text-gray-400">No puzzle sets added yet</p>
                    </div>
                ) : (
                    currentPuzzleSets.map(puzzleSet => (
                        <div key={puzzleSet._id} className="glass-panel p-4 rounded-xl flex justify-between items-center">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white">{puzzleSet.setNumber} - {puzzleSet.title}</h3>
                                <p className="text-sm text-gray-400">{puzzleSet.description}</p>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    <span className="px-3 py-1 bg-cyan-900/50 border border-cyan-500 text-cyan-400 rounded-full text-xs">
                                        {puzzleSet.chapter}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-900/50 border border-blue-500 text-blue-400 rounded-full text-xs">
                                        {puzzleSet.examType}
                                    </span>
                                    <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs">
                                        Set: {puzzleSet.setPdfSize}
                                    </span>
                                    <span className="px-2 py-1 bg-purple-900/50 text-purple-400 rounded text-xs">
                                        Ans: {puzzleSet.answerPdfSize}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(puzzleSet)} className="p-2 text-cyan-400 hover:bg-gray-800 rounded">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button onClick={() => handleDelete(puzzleSet._id)} className="p-2 text-red-400 hover:bg-gray-800 rounded">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}

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
        </div>
    );
};

export default ManagePuzzleSets;
