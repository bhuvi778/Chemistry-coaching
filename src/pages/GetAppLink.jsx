import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const GetAppLink = () => {
    const { isDark } = useTheme();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/send-app-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: '✅ App download link sent successfully! Check your WhatsApp.'
                });
                setPhoneNumber('');
            } else {
                setMessage({
                    type: 'error',
                    text: data.message || '❌ Failed to send link. Please try again.'
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: '❌ Network error. Please check your connection and try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} relative overflow-hidden`}>
            <div className="max-w-2xl mx-auto px-4 py-20">
                {/* Back Button */}
                <div className="mb-6">
                    <Link to="/" className={`${isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-gray-900'} flex items-center gap-2 transition`}>
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mb-4">
                        <i className="fas fa-mobile-alt text-white text-4xl"></i>
                    </div>
                    <h1 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                        Get Our Mobile App
                    </h1>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Enter your WhatsApp number to receive the download link
                    </p>
                </div>

                {/* Form Card */}
                <div className={`${isDark ? 'glass-panel' : 'bg-white shadow-lg border border-gray-200'} rounded-xl p-8`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Phone Number Input */}
                        <div>
                            <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                WhatsApp Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className={`fab fa-whatsapp text-xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`}></i>
                                </div>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+91 XXXXX XXXXX"
                                    required
                                    className={`w-full pl-12 pr-4 py-4 ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                        } border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-lg`}
                                />
                            </div>
                            <p className={`mt-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Include country code (e.g., +91 for India)
                            </p>
                        </div>

                        {/* Message Display */}
                        {message.text && (
                            <div className={`p-4 rounded-lg ${message.type === 'success'
                                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                                    : 'bg-red-500/20 border border-red-500/50 text-red-400'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg transition transform hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-lg`}
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <i className="fab fa-whatsapp"></i>
                                    Send Download Link
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Features Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${isDark ? 'glass-panel' : 'bg-white shadow-md border border-gray-200'} rounded-xl p-6`}>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                                <i className="fas fa-video text-cyan-400 text-xl"></i>
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                                    Video Lectures
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Access high-quality chemistry lectures anytime, anywhere
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`${isDark ? 'glass-panel' : 'bg-white shadow-md border border-gray-200'} rounded-xl p-6`}>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                                <i className="fas fa-book text-purple-400 text-xl"></i>
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                                    Study Materials
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Download PDFs, notes, and practice questions
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`${isDark ? 'glass-panel' : 'bg-white shadow-md border border-gray-200'} rounded-xl p-6`}>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                                <i className="fas fa-question-circle text-orange-400 text-xl"></i>
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                                    Doubt Solving
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Get your chemistry doubts cleared by experts
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`${isDark ? 'glass-panel' : 'bg-white shadow-md border border-gray-200'} rounded-xl p-6`}>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                                <i className="fas fa-puzzle-piece text-pink-400 text-xl"></i>
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                                    Interactive Puzzles
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Learn chemistry through fun crosswords and quizzes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Note */}
                <div className={`mt-8 p-4 rounded-lg ${isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex items-start gap-3">
                        <i className={`fas fa-info-circle ${isDark ? 'text-blue-400' : 'text-blue-600'} mt-1`}></i>
                        <div>
                            <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'} font-semibold mb-1`}>
                                How it works:
                            </p>
                            <ul className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-700'} space-y-1`}>
                                <li>1. Enter your WhatsApp number with country code</li>
                                <li>2. Click "Send Download Link"</li>
                                <li>3. Receive the app download link on WhatsApp</li>
                                <li>4. Download and install the app</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetAppLink;
