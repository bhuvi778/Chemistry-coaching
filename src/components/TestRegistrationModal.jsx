import { useState } from 'react';
import axios from 'axios';

const TestRegistrationModal = ({ test, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateMobile = (mobile) => {
        return /^[0-9]{10}$/.test(mobile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return;
        }
        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (!validateMobile(formData.mobile)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await axios.post(
                `${API_URL}/practice-tests/tests/${test._id}/register`,
                formData
            );

            // Store email in localStorage for future use
            localStorage.setItem('userEmail', formData.email);
            localStorage.setItem('userName', formData.name);
            localStorage.setItem('userMobile', formData.mobile);

            onSuccess(formData.email);
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="glass-panel rounded-2xl max-w-md w-full p-6 md:p-8 relative my-8 max-h-[95vh] overflow-y-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-user-edit text-white text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Register for Test</h2>
                    <p className="text-gray-400 text-sm">
                        Please fill in your details to attempt this test
                    </p>
                </div>

                {/* Test Info */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                    <h3 className="text-white font-semibold mb-1">{test.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span><i className="fas fa-question-circle mr-1"></i>{test.questionCount || 0} Questions</span>
                        <span><i className="fas fa-clock mr-1"></i>{test.duration} min</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-white font-semibold mb-2">
                            <i className="fas fa-user mr-2 text-cyan-400"></i>
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-white font-semibold mb-2">
                            <i className="fas fa-envelope mr-2 text-cyan-400"></i>
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-white font-semibold mb-2">
                            <i className="fas fa-phone mr-2 text-cyan-400"></i>
                            Mobile Number *
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                            maxLength="10"
                            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                <span>Registering...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-check-circle"></i>
                                <span>Register & Continue</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Privacy Note */}
                <p className="text-xs text-gray-500 text-center mt-4">
                    <i className="fas fa-lock mr-1"></i>
                    Your information is secure and will only be used for test tracking
                </p>
            </div>
        </div>
    );
};

export default TestRegistrationModal;
