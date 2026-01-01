import { useState } from 'react';
import { useData } from '../../context/DataContext';
import Pagination from '../../components/UI/Pagination';

const ManageScoreMatchBatches = () => {
    const { scoreMatchBatches, addScoreMatchBatch, updateScoreMatchBatch, deleteScoreMatchBatch } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [currentBatch, setCurrentBatch] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const initialFormState = {
        title: '',
        subtitle: '',
        desc: '',
        exam: 'JEE',
        batchType: 'Crash Course',
        price: '',
        duration: '',
        schedule: '',
        startDate: '',
        features: '',
        color: 'cyan',
        icon: 'fa-trophy',
        badge: '',
        enrollmentLink: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleEdit = (batch) => {
        setIsEditing(true);
        setCurrentBatch(batch);
        setFormData({
            ...batch,
            features: batch.features.join(', '),
            price: batch.price || '',
            duration: batch.duration || '',
            schedule: batch.schedule || '',
            startDate: batch.startDate || '',
            enrollmentLink: batch.enrollmentLink || ''
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this Score Max Batch?')) {
            deleteScoreMatchBatch(id);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const batchData = {
            ...formData,
            features: formData.features.split(',').map(f => f.trim())
        };

        try {
            if (isEditing) {
                await updateScoreMatchBatch(currentBatch._id, batchData);
                alert('Score Max Batch updated successfully!');
            } else {
                await addScoreMatchBatch(batchData);
                alert('Score Max Batch added successfully!');
            }

            setIsEditing(false);
            setCurrentBatch(null);
            setFormData(initialFormState);
        } catch (error) {
            console.error('Error submitting Score Max Batch:', error);
            alert('Failed to save Score Max Batch. Please try again.');
        }
    };

    // Pagination calculations
    const totalPages = Math.ceil(scoreMatchBatches.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBatches = scoreMatchBatches.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="space-y-8">
            <div className="glass-panel p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4">
                    {isEditing ? 'Edit Score Max Batch' : 'Add New Score Max Batch'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Batch Title"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Subtitle"
                            value={formData.subtitle}
                            onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        />
                    </div>
                    <textarea
                        placeholder="Description"
                        value={formData.desc}
                        onChange={e => setFormData({ ...formData, desc: e.target.value })}
                        className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full h-24"
                        required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            value={formData.exam}
                            onChange={e => setFormData({ ...formData, exam: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            required
                        >
                            <option value="">Select Exam</option>
                            <option value="JEE">JEE</option>
                            <option value="NEET">NEET</option>
                            <option value="IAT">IAT</option>
                            <option value="NEST">NEST</option>
                            <option value="CSIR NET">CSIR NET</option>
                            <option value="GATE">GATE</option>
                            <option value="IIT JAM">IIT JAM</option>
                            <option value="TIFR">TIFR</option>
                        </select>
                        <select
                            value={formData.batchType}
                            onChange={e => setFormData({ ...formData, batchType: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            required
                        >
                            <option value="">Select Batch Type</option>
                            <option value="Crash Course">Crash Course</option>
                            <option value="Revision Batch">Revision Batch</option>
                            <option value="Practice Batch">Practice Batch</option>
                            <option value="One Shot Course">One Shot Course</option>
                            <option value="Fast Track Batch">Fast Track Batch</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Price (e.g., ₹25,000)"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        />
                        <input
                            type="text"
                            placeholder="Duration (e.g., 3 Months)"
                            value={formData.duration}
                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        />
                        <input
                            type="text"
                            placeholder="Schedule (e.g., Mon-Fri)"
                            value={formData.schedule}
                            onChange={e => setFormData({ ...formData, schedule: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Start Date (e.g., 15th Jan 2026)"
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                    />
                    <input
                        type="text"
                        placeholder="Features (comma separated)"
                        value={formData.features}
                        onChange={e => setFormData({ ...formData, features: e.target.value })}
                        className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        required
                    />
                    <input
                        type="url"
                        placeholder="Enrollment Link (optional)"
                        value={formData.enrollmentLink}
                        onChange={e => setFormData({ ...formData, enrollmentLink: e.target.value })}
                        className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            value={formData.color}
                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        >
                            <option value="cyan">Cyan</option>
                            <option value="pink">Pink</option>
                            <option value="purple">Purple</option>
                            <option value="green">Green</option>
                            <option value="yellow">Yellow</option>
                            <option value="blue">Blue</option>
                            <option value="red">Red</option>
                            <option value="indigo">Indigo</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Icon Class (e.g., fa-trophy)"
                            value={formData.icon}
                            onChange={e => setFormData({ ...formData, icon: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        />
                        <input
                            type="text"
                            placeholder="Badge Text (Optional)"
                            value={formData.badge}
                            onChange={e => setFormData({ ...formData, badge: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" className="bg-cyan-500 text-black font-bold py-2 px-6 rounded hover:bg-cyan-400 transition">
                            {isEditing ? 'Update Batch' : 'Add Batch'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentBatch(null);
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

            {scoreMatchBatches.length > 0 && (
                <div className="mb-4 text-gray-400">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, scoreMatchBatches.length)} of {scoreMatchBatches.length} batches
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {currentBatches.map(batch => (
                    <div key={batch._id} className="glass-panel p-4 rounded-xl flex justify-between items-center">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white">{batch.title}</h3>
                            <p className="text-sm text-gray-400">{batch.subtitle}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                <span className="px-3 py-1 bg-pink-900/50 border border-pink-500 text-pink-400 rounded-full text-xs font-semibold">
                                    <i className="fas fa-graduation-cap mr-1"></i>
                                    {batch.exam}
                                </span>
                                <span className="px-3 py-1 bg-cyan-900/50 border border-cyan-500 text-cyan-400 rounded-full text-xs font-semibold">
                                    <i className="fas fa-layer-group mr-1"></i>
                                    {batch.batchType}
                                </span>
                                {batch.price && (
                                    <span className="px-3 py-1 bg-green-900/50 border border-green-500 text-green-400 rounded-full text-xs font-semibold">
                                        <i className="fas fa-rupee-sign mr-1"></i>
                                        {batch.price}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(batch)} className="p-2 text-cyan-400 hover:bg-gray-800 rounded">
                                <i className="fas fa-edit"></i>
                            </button>
                            <button onClick={() => handleDelete(batch._id)} className="p-2 text-red-400 hover:bg-gray-800 rounded">
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

export default ManageScoreMatchBatches;
