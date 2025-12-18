import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const BookMeeting = () => {
    const { addMeetingRequest } = useData();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        requestType: 'Webinar',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addMeetingRequest(formData);
            alert('Your request has been submitted successfully! Our team will contact you shortly to schedule your session.');

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                requestType: 'Webinar',
                message: ''
            });
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSessionDescription = (type) => {
        const descriptions = {
            'Webinar': 'Join our interactive webinar sessions with expert faculty and learn key concepts',
            'Demo': 'Experience our teaching methodology with a free demo class',
            'Workshop': 'Hands-on workshop sessions for practical learning and skill development',
            'Consultation': 'One-on-one personalized consultation with our expert mentors',
            'Trial Class': 'Try our regular classes for free before enrolling',
            'Doubt Session': 'Get your doubts cleared by our experienced faculty'
        };
        return descriptions[type] || 'Session - Description';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column - Session Details */}
                    <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
                        {/* Logo */}
                        <div className="mb-6">
                            <img
                                src="/logo.png"
                                alt="Ace2Examz"
                                className="h-12"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <div style={{ display: 'none' }} className="text-2xl font-bold text-blue-600">
                                ACE 2 EXAMZ
                            </div>
                        </div>

                        {/* Session Title */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Request Your Session
                            </h1>
                            <p className="text-gray-600">
                                {formData.requestType} - {getSessionDescription(formData.requestType)}
                            </p>
                        </div>

                        {/* Session Type Selection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Select Session Type</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['Webinar', 'Demo', 'Workshop', 'Consultation', 'Trial Class', 'Doubt Session'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, requestType: type }))}
                                        className={`p-3 rounded-lg border-2 transition-all ${formData.requestType === type
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                                                : 'border-gray-200 hover:border-blue-300 text-gray-700'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">What You'll Get</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <i className="fas fa-user-tie text-blue-600 text-sm"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Expert Faculty</h4>
                                        <p className="text-sm text-gray-600">Learn from experienced teachers</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <i className="fas fa-clock text-purple-600 text-sm"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Flexible Timing</h4>
                                        <p className="text-sm text-gray-600">We'll work with your schedule</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                                        <i className="fas fa-video text-pink-600 text-sm"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Online Meeting</h4>
                                        <p className="text-sm text-gray-600">Join from anywhere via video call</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                            <div className="space-y-2 text-sm">
                                <a href="tel:+919115179935" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                                    <i className="fas fa-phone"></i>
                                    +91 9115179935
                                </a>
                                <a href="mailto:crack@ace2examz.in" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                                    <i className="fas fa-envelope"></i>
                                    crack@ace2examz.in
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Registration Form */}
                    <div className="bg-white rounded-lg shadow-sm p-8 lg:sticky lg:top-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            Registration Form
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* First Name */}
                            <div>
                                <label htmlFor="firstName" className="block text-sm text-gray-700 mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="lastName" className="block text-sm text-gray-700 mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            {/* Email Address */}
                            <div>
                                <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label htmlFor="phone" className="block text-sm text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+91 XXXXX XXXXX"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            {/* Additional Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm text-gray-700 mb-2">
                                    Additional Requirements (Optional)
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Tell us about your specific needs or questions..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            {/* Disclaimer */}
                            <div className="text-xs text-gray-600 leading-relaxed">
                                By clicking 'Register', you acknowledge that our team will review your request and contact you within 24-48 hours to schedule your session.
                            </div>

                            {/* Register Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane"></i>
                                            Register
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookMeeting;
