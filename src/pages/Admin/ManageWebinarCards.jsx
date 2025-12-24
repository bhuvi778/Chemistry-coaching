import React, { useState, useEffect } from 'react';

const ManageWebinarCards = () => {
    const [cards, setCards] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        date: '',
        time: '',
        buttonText: 'Register Now',
        buttonLink: '#',
        order: 0,
        isActive: true
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const res = await fetch(`${API_URL}/webinar-cards`);
            const data = await res.json();
            // Ensure data is always an array
            setCards(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching cards:', error);
            setCards([]);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = editingCard
                ? `${API_URL}/webinar-cards/${editingCard._id}`
                : `${API_URL}/webinar-cards`;

            const method = editingCard ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchCards();
                resetForm();
                alert(editingCard ? 'Card updated successfully!' : 'Card added successfully!');
            }
        } catch (error) {
            console.error('Error saving card:', error);
            alert('Failed to save card');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (card) => {
        setEditingCard(card);
        setFormData({
            title: card.title,
            subtitle: card.subtitle || '',
            description: card.description,
            image: card.image,
            date: card.date || '',
            time: card.time || '',
            buttonText: card.buttonText || 'Register Now',
            buttonLink: card.buttonLink || '#',
            order: card.order || 0,
            isActive: card.isActive
        });
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            try {
                await fetch(`${API_URL}/webinar-cards/${id}`, {
                    method: 'DELETE'
                });
                fetchCards();
                alert('Card deleted successfully!');
            } catch (error) {
                console.error('Error deleting card:', error);
                alert('Failed to delete card');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            image: '',
            date: '',
            time: '',
            buttonText: 'Register Now',
            buttonLink: '#',
            order: 0,
            isActive: true
        });
        setEditingCard(null);
        setIsAdding(false);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Manage Webinar Cards</h2>
                    <p className="text-gray-400">Create and manage cards shown on Book Your Meet page</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition font-bold"
                >
                    <i className={`fas ${isAdding ? 'fa-times' : 'fa-plus'} mr-2`}></i>
                    {isAdding ? 'Cancel' : 'Add New Card'}
                </button>
            </div>

            {/* Add/Edit Form */}
            {isAdding && (
                <div className="glass-panel rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                        {editingCard ? 'Edit Card' : 'Add New Card'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Title */}
                            <div>
                                <label className="block text-gray-300 mb-2">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                    placeholder="e.g., Test Preparation for GMAT"
                                />
                            </div>

                            {/* Subtitle */}
                            <div>
                                <label className="block text-gray-300 mb-2">Subtitle</label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    value={formData.subtitle}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                    placeholder="e.g., Score 690+ in GMAT"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-gray-300 mb-2">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                placeholder="Brief description of the program"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-gray-300 mb-2">Card Image *</label>
                            <div className="space-y-3">
                                {formData.image && (
                                    <div className="relative">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg border border-gray-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                                        >
                                            <i className="fas fa-times mr-1"></i> Remove
                                        </button>
                                    </div>
                                )}
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        image: reader.result
                                                    }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="hidden"
                                        id="imageUpload"
                                    />
                                    <label
                                        htmlFor="imageUpload"
                                        className="block w-full px-4 py-8 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg text-center cursor-pointer hover:border-cyan-500 transition"
                                    >
                                        <i className="fas fa-cloud-upload-alt text-4xl text-gray-500 mb-2"></i>
                                        <p className="text-gray-400">Click to upload image</p>
                                        <p className="text-gray-600 text-sm mt-1">PNG, JPG, JPEG (Max 5MB)</p>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date */}
                            <div>
                                <label className="block text-gray-300 mb-2">Date</label>
                                <input
                                    type="text"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                    placeholder="e.g., Friday, 16th December, 2022"
                                />
                            </div>

                            {/* Time */}
                            <div>
                                <label className="block text-gray-300 mb-2">Time</label>
                                <input
                                    type="text"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                    placeholder="e.g., 6:00 pm - 8:00 pm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Button Text */}
                            <div>
                                <label className="block text-gray-300 mb-2">Button Text</label>
                                <input
                                    type="text"
                                    name="buttonText"
                                    value={formData.buttonText}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            {/* Button Link */}
                            <div>
                                <label className="block text-gray-300 mb-2">Button Link</label>
                                <input
                                    type="text"
                                    name="buttonLink"
                                    value={formData.buttonLink}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                    placeholder="#"
                                />
                            </div>

                            {/* Order */}
                            <div>
                                <label className="block text-gray-300 mb-2">Display Order</label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4"
                            />
                            <label className="text-gray-300">Active (Show on page)</label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-bold ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        {editingCard ? 'Updating...' : 'Adding...'}
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save mr-2"></i>
                                        {editingCard ? 'Update Card' : 'Add Card'}
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={isSubmitting}
                                className={`px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div key={card._id} className="glass-panel rounded-xl overflow-hidden">
                        <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-white font-bold text-lg mb-1">{card.title}</h3>
                            {card.subtitle && (
                                <p className="text-cyan-400 text-sm mb-2">{card.subtitle}</p>
                            )}
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{card.description}</p>
                            {card.date && (
                                <p className="text-gray-500 text-xs mb-1">
                                    <i className="fas fa-calendar mr-2"></i>{card.date}
                                </p>
                            )}
                            {card.time && (
                                <p className="text-gray-500 text-xs mb-3">
                                    <i className="fas fa-clock mr-2"></i>{card.time}
                                </p>
                            )}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(card)}
                                    className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition text-sm"
                                >
                                    <i className="fas fa-edit mr-1"></i> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(card._id)}
                                    className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition text-sm"
                                >
                                    <i className="fas fa-trash mr-1"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {cards.length === 0 && !isAdding && (
                <div className="text-center py-12 glass-panel rounded-xl">
                    <i className="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
                    <p className="text-gray-400">No webinar cards yet. Click "Add New Card" to create one.</p>
                </div>
            )}
        </div>
    );
};

export default ManageWebinarCards;
