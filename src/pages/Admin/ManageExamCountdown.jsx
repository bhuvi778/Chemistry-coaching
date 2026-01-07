import { useState, useEffect } from 'react';

const ManageExamCountdown = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const [countdowns, setCountdowns] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCountdown, setCurrentCountdown] = useState(null);

    const initialFormState = {
        examName: '',
        examDate: '',
        description: '',
        color: 'cyan',
        icon: 'fa-graduation-cap',
        isActive: true
    };

    const [formData, setFormData] = useState(initialFormState);

    const colorOptions = [
        { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
        { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
        { value: 'red', label: 'Red', class: 'bg-red-500' },
        { value: 'green', label: 'Green', class: 'bg-green-500' },
        { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
        { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
        { value: 'pink', label: 'Pink', class: 'bg-pink-500' }
    ];

    const iconOptions = [
        { value: 'fa-graduation-cap', label: 'Graduation Cap' },
        { value: 'fa-book', label: 'Book' },
        { value: 'fa-pencil-alt', label: 'Pencil' },
        { value: 'fa-flask', label: 'Flask' },
        { value: 'fa-atom', label: 'Atom' },
        { value: 'fa-trophy', label: 'Trophy' },
        { value: 'fa-certificate', label: 'Certificate' },
        { value: 'fa-calendar-check', label: 'Calendar' }
    ];

    // Fetch countdowns
    const fetchCountdowns = async () => {
        try {
            const response = await fetch(`${API_URL}/exam-countdown`);
            const data = await response.json();
            setCountdowns(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching countdowns:', error);
        }
    };

    useEffect(() => {
        fetchCountdowns();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isEditing
                ? `${API_URL}/exam-countdown/${currentCountdown._id}`
                : `${API_URL}/exam-countdown`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to save countdown');
            }

            alert(isEditing ? 'Countdown updated successfully!' : 'Countdown added successfully!');
            setFormData(initialFormState);
            setIsEditing(false);
            setCurrentCountdown(null);
            fetchCountdowns();
        } catch (error) {
            console.error('Error saving countdown:', error);
            alert('Error saving countdown: ' + error.message);
        }
    };

    const handleEdit = (countdown) => {
        setIsEditing(true);
        setCurrentCountdown(countdown);
        setFormData({
            examName: countdown.examName,
            examDate: new Date(countdown.examDate).toISOString().split('T')[0],
            description: countdown.description || '',
            color: countdown.color,
            icon: countdown.icon,
            isActive: countdown.isActive
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this countdown?')) return;

        try {
            const response = await fetch(`${API_URL}/exam-countdown/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete countdown');
            }

            alert('Countdown deleted successfully!');
            fetchCountdowns();
        } catch (error) {
            console.error('Error deleting countdown:', error);
            alert('Error deleting countdown: ' + error.message);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-8">
            {/* Form */}
            <div className="glass-panel p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4">
                    {isEditing ? 'Edit Exam Countdown' : 'Add New Exam Countdown'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Exam Name (e.g., JEE Main 2026)"
                            value={formData.examName}
                            onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            required
                        />
                        <input
                            type="date"
                            value={formData.examDate}
                            onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            required
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Description (optional)"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Color Selection */}
                        <div>
                            <label className="block text-gray-400 mb-2 font-semibold">Color Theme</label>
                            <div className="grid grid-cols-4 gap-2">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color: color.value })}
                                        className={`${color.class} h-10 rounded ${formData.color === color.value
                                                ? 'ring-4 ring-white'
                                                : 'opacity-50 hover:opacity-100'
                                            } transition`}
                                        title={color.label}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Icon Selection */}
                        <div>
                            <label className="block text-gray-400 mb-2 font-semibold">Icon</label>
                            <select
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
                            >
                                {iconOptions.map((icon) => (
                                    <option key={icon.value} value={icon.value}>
                                        {icon.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-5 h-5"
                        />
                        <label htmlFor="isActive" className="text-white font-semibold">
                            Active (Show on website)
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-cyan-500 text-white font-bold py-2 px-6 rounded hover:bg-cyan-400 transition"
                        >
                            {isEditing ? 'Update Countdown' : 'Add Countdown'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentCountdown(null);
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

            {/* List */}
            <div className="glass-panel p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4">Exam Countdowns</h2>
                {countdowns.length === 0 ? (
                    <p className="text-gray-400">No countdowns yet. Add one above!</p>
                ) : (
                    <div className="space-y-4">
                        {countdowns.map((countdown) => (
                            <div
                                key={countdown._id}
                                className="glass-panel p-4 rounded-xl flex justify-between items-center"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <i className={`fas ${countdown.icon} text-xl text-${countdown.color}-400`}></i>
                                        <h3 className="text-lg font-bold text-white">{countdown.examName}</h3>
                                        {countdown.isActive && (
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        <i className="far fa-calendar mr-2"></i>
                                        {formatDate(countdown.examDate)}
                                    </p>
                                    {countdown.description && (
                                        <p className="text-sm text-gray-500 mt-1">{countdown.description}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(countdown)}
                                        className="p-2 text-cyan-400 hover:bg-gray-800 rounded"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(countdown._id)}
                                        className="p-2 text-red-400 hover:bg-gray-800 rounded"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageExamCountdown;
