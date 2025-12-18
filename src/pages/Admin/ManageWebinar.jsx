import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';

const ManageWebinar = () => {
    const { webinarSettings, updateWebinarSettings } = useData();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Webinar',
        date: '',
        time: '',
        timezone: 'IST',
        isActive: true
    });

    useEffect(() => {
        if (webinarSettings) {
            setFormData(webinarSettings);
        }
    }, [webinarSettings]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateWebinarSettings(formData);
            alert('Webinar settings updated successfully!');
        } catch (error) {
            console.error('Error updating webinar settings:', error);
            alert('Failed to update webinar settings. Please try again.');
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Manage Webinar Settings</h2>
                <p className="text-gray-400">Configure the webinar details that will be displayed on the booking page</p>
            </div>

            <div className="glass-panel rounded-xl p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Active Status */}
                    <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="text-white font-semibold">
                            Enable Webinar Booking Page
                        </label>
                    </div>

                    {/* Webinar Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Webinar Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Demo Webinar, JEE Strategy Session"
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-400 transition"
                        />
                    </div>

                    {/* Webinar Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Webinar Type *
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-400 transition"
                        >
                            <option value="Webinar">Webinar</option>
                            <option value="Demo">Demo</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Training">Training</option>
                            <option value="Consultation">Consultation</option>
                            <option value="Q&A Session">Q&A Session</option>
                            <option value="Live Class">Live Class</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="3"
                            placeholder="Brief description of the webinar"
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-400 transition"
                        />
                    </div>

                    {/* Date and Time Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Date *
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-400 transition"
                            />
                        </div>

                        {/* Time */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Time *
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-400 transition"
                            />
                        </div>
                    </div>

                    {/* Timezone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Timezone *
                        </label>
                        <select
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-400 transition"
                        >
                            <option value="IST">IST (Indian Standard Time)</option>
                            <option value="EST">EST (Eastern Standard Time)</option>
                            <option value="PST">PST (Pacific Standard Time)</option>
                            <option value="GMT">GMT (Greenwich Mean Time)</option>
                            <option value="UTC">UTC (Coordinated Universal Time)</option>
                        </select>
                    </div>

                    {/* Preview Section */}
                    {formData.date && formData.time && (
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <i className="fas fa-eye"></i>
                                Preview
                            </h4>
                            <div className="text-gray-300 text-sm space-y-1">
                                <p><strong>Title:</strong> {formData.title || 'Not set'}</p>
                                <p><strong>Type:</strong> {formData.type}</p>
                                <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</p>
                                <p><strong>Time:</strong> {formData.time} {formData.timezone}</p>
                                <p><strong>Status:</strong> {formData.isActive ? '✅ Active' : '❌ Inactive'}</p>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition font-semibold"
                        >
                            <i className="fas fa-save mr-2"></i>
                            Save Webinar Settings
                        </button>
                    </div>
                </form>
            </div>

            {/* Instructions */}
            <div className="mt-6 glass-panel rounded-xl p-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <i className="fas fa-info-circle text-blue-400"></i>
                    Instructions
                </h3>
                <ul className="text-gray-400 text-sm space-y-2">
                    <li>• Set the webinar title, type, and description</li>
                    <li>• Choose the date and time for the webinar</li>
                    <li>• Toggle "Enable Webinar Booking Page" to show/hide the booking page</li>
                    <li>• The countdown timer will automatically calculate based on the date/time you set</li>
                    <li>• Users will see these details when they visit the "Book Your Meet" page</li>
                </ul>
            </div>
        </div>
    );
};

export default ManageWebinar;
