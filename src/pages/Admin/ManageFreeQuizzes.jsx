import { useState } from 'react';
import { useData } from '../../context/DataContext';
import Pagination from '../../components/UI/Pagination';

const ManageFreeQuizzes = () => {
    const { freeQuizzes, addFreeQuiz, updateFreeQuiz, deleteFreeQuiz } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [loading, setLoading] = useState(false);

    const initialFormState = {
        title: '',
        description: '',
        examType: 'JEE',
        subject: 'Chemistry',
        chapter: '',
        topic: '',
        difficulty: 'Medium',
        quizCategory: 'Quiz',
        quizType: 'LINK',
        quizLink: '',
        quizPdf: null
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleEdit = (quiz) => {
        setIsEditing(true);
        setCurrentQuiz(quiz);
        setFormData({
            title: quiz.title,
            description: quiz.description || '',
            examType: quiz.examType,
            subject: quiz.subject || 'Chemistry',
            chapter: quiz.chapter,
            topic: quiz.topic || '',
            difficulty: quiz.difficulty,
            quizCategory: quiz.quizCategory || 'Quiz',
            quizType: quiz.quizType,
            quizLink: quiz.quizLink || '',
            quizPdf: quiz.quizPdf || null
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            deleteFreeQuiz(id);
        }
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file');
                return;
            }
            if (file.size > 15 * 1024 * 1024) {
                alert('File is too large (max 15MB)');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    quizPdf: {
                        data: reader.result,
                        filename: file.name,
                        contentType: file.type
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validation
            if (formData.quizType === 'LINK' && !formData.quizLink) {
                alert('Please provide a Quiz Link');
                setLoading(false);
                return;
            }
            if (formData.quizType === 'PDF' && !formData.quizPdf && !isEditing) {
                alert('Please upload a PDF');
                setLoading(false);
                return;
            }

            if (isEditing) {
                const updatedData = { ...formData };
                // If PDF wasn't changed (it's the old object without data), don't send it if not needed, 
                // but usually we send what we have. If it's the old one, it might be {filename, ...} without data
                // The backend controller doesn't strip data on updates unless new data is provided.
                await updateFreeQuiz(currentQuiz._id, updatedData);
                alert('Quiz updated successfully!');
            } else {
                await addFreeQuiz(formData);
                alert('Quiz added successfully!');
            }

            setIsEditing(false);
            setCurrentQuiz(null);
            setFormData(initialFormState);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Failed to save Quiz. ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const safeQuizzes = Array.isArray(freeQuizzes) ? freeQuizzes : [];
    const totalPages = Math.ceil(safeQuizzes.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentQuizzes = safeQuizzes.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="space-y-8">
            {/* Form Section */}
            <div className="glass-panel p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-clipboard-list text-cyan-400"></i>
                    {isEditing ? 'Edit Free Quiz' : 'Add New Free Quiz'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Quiz Title"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            required
                        />
                        <select
                            value={formData.difficulty}
                            onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        <select
                            value={formData.quizCategory}
                            onChange={e => setFormData({ ...formData, quizCategory: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        >
                            <option value="Quiz">Quiz</option>
                            <option value="Mock Test">Mock Test</option>
                            <option value="PYPs">PYPs (Previous Year Papers)</option>
                        </select>
                    </div>

                    <textarea
                        placeholder="Description (Optional)"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full h-20"
                    />

                    {/* Classification */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            value={formData.examType}
                            onChange={e => setFormData({ ...formData, examType: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        >
                            <optgroup label="UG Entrance Exams">
                                <option value="NEET">NEET</option>
                                <option value="JEE">JEE (Main & Advanced)</option>
                                <option value="IAT">IAT</option>
                                <option value="NEST">NEST</option>
                                <option value="CUET UG">CUET UG</option>
                                <option value="BITSAT">BITSAT</option>
                            </optgroup>
                            <optgroup label="PG Entrance Exams">
                                <option value="IIT JAM">IIT JAM</option>
                                <option value="CUET PG">CUET PG</option>
                            </optgroup>
                            <optgroup label="Research Level Exams">
                                <option value="CSIR NET">CSIR NET</option>
                                <option value="GATE">GATE</option>
                                <option value="TIFR">TIFR</option>
                            </optgroup>
                            <optgroup label="Competitive Exams (Govt. Job)">
                                <option value="PSTET">PSTET</option>
                                <option value="Master Cadre">Master Cadre</option>
                                <option value="UPSC - Mains (Chemistry)">UPSC - Mains (Chemistry)</option>
                            </optgroup>
                            <optgroup label="Other">
                                <option value="BOARDS">BOARDS</option>
                                <option value="KVPY">KVPY</option>
                                <option value="OLYMPIAD">OLYMPIAD</option>
                                <option value="FOUNDATION">FOUNDATION</option>
                                <option value="OTHER">OTHER</option>
                            </optgroup>
                        </select>
                        <input
                            type="text"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        />
                        <input
                            type="text"
                            placeholder="Chapter"
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

                    {/* Content Type Selector */}
                    <div className="flex gap-4 p-4 bg-gray-800/50 rounded-lg">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="quizType"
                                checked={formData.quizType === 'LINK'}
                                onChange={() => setFormData({ ...formData, quizType: 'LINK' })}
                                className="text-cyan-500 focus:ring-cyan-500"
                            />
                            <span className="text-white">External Link</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="quizType"
                                checked={formData.quizType === 'PDF'}
                                onChange={() => setFormData({ ...formData, quizType: 'PDF' })}
                                className="text-cyan-500 focus:ring-cyan-500"
                            />
                            <span className="text-white">Upload PDF</span>
                        </label>
                    </div>

                    {/* Content Input */}
                    <div>
                        {formData.quizType === 'LINK' ? (
                            <input
                                type="url"
                                placeholder="Paste Quiz Link Here (e.g., Google Forms)"
                                value={formData.quizLink}
                                onChange={e => setFormData({ ...formData, quizLink: e.target.value })}
                                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                                required={formData.quizType === 'LINK'}
                            />
                        ) : (
                            <div className="bg-gray-900 border border-gray-700 rounded p-4">
                                <label className="block text-gray-400 mb-2">Upload Quiz PDF</label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handlePdfChange}
                                    className="text-gray-300 w-full"
                                    required={formData.quizType === 'PDF' && !isEditing}
                                />
                                {formData.quizPdf && formData.quizPdf.filename && (
                                    <p className="text-sm text-green-400 mt-2">
                                        Selected: {formData.quizPdf.filename}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t border-gray-700">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-cyan-500 text-black font-bold py-2 px-8 rounded hover:bg-cyan-400 transition flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                            {isEditing ? 'Update Quiz' : 'Add Quiz'}
                        </button>

                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentQuiz(null);
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

            {/* List Section */}
            <div className="grid grid-cols-1 gap-4">
                {safeQuizzes.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No quizzes added yet.</div>
                ) : (
                    currentQuizzes.map(quiz => (
                        <div key={quiz._id} className="glass-panel p-4 rounded-xl flex justify-between items-center group hover:bg-gray-800/50 transition">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    {quiz.title}
                                    <span className={`text-xs px-2 py-0.5 rounded border ${quiz.quizType === 'PDF' ? 'border-red-500 text-red-500' : 'border-blue-500 text-blue-500'
                                        }`}>
                                        {quiz.quizType}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 rounded border border-purple-500 text-purple-400">
                                        {quiz.quizCategory || 'Quiz'}
                                    </span>
                                </h3>
                                <div className="flex gap-3 text-sm text-gray-400 mt-1">
                                    <span className="flex items-center gap-1">
                                        <i className="fas fa-graduation-cap text-gray-500"></i> {quiz.examType}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <i className="fas fa-book text-gray-500"></i> {quiz.chapter}
                                    </span>
                                    {quiz.topic && (
                                        <span className="flex items-center gap-1">
                                            <i className="fas fa-bullseye text-gray-500"></i> {quiz.topic}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(quiz)} className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded transition">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button onClick={() => handleDelete(quiz._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded transition">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
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

export default ManageFreeQuizzes;
