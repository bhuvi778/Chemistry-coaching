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
        preferredDate: '',
        preferredTime: '',
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
                preferredDate: '',
                preferredTime: '',
                message: ''
            });
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        <i className="fas fa-calendar-check text-blue-600 mr-3"></i>
                        Book Your Session
                    </h1>
                    <p className="text-lg text-gray-600">
                        Request a personalized session with our expert faculty
                    </p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        Session Request Form
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Request Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Session Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="requestType"
                                value={formData.requestType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            >
                                <option value="Webinar">Webinar</option>
                                <option value="Demo">Demo Session</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Consultation">One-on-One Consultation</option>
                                <option value="Trial Class">Trial Class</option>
                                <option value="Doubt Session">Doubt Clearing Session</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Select the type of session you're interested in</p>
                        </div>

                        {/* Name Fields Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
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
                                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
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
                        </div>

                        {/* Contact Fields Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
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

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
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
                        </div>

                        {/* Preferred Date and Time Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Preferred Date */}
                            <div>
                                <label htmlFor="preferredDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Preferred Date
                                </label>
                                <input
                                    type="date"
                                    id="preferredDate"
                                    name="preferredDate"
                                    value={formData.preferredDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                                <p className="text-xs text-gray-500 mt-1">Optional - We'll try to accommodate your preference</p>
                            </div>

                            {/* Preferred Time */}
                            <div>
                                <label htmlFor="preferredTime" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Preferred Time
                                </label>
                                <select
                                    name="preferredTime"
                                    value={formData.preferredTime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                >
                                    <option value="">Any Time</option>
                                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                                    <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                                    <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                                </select>
                            </div>
                        </div>

                        {/* Message/Requirements */}
                        <div>
                            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                Additional Requirements / Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Tell us about your specific needs, topics you want to cover, or any questions..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-gray-700">
                                <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                                By submitting this request, you acknowledge that our team will review your request and contact you within 24-48 hours to schedule your session.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Submitting Request...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane"></i>
                                        Submit Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <i className="fas fa-user-tie text-4xl text-blue-500 mb-3"></i>
                        <h3 className="text-gray-900 font-bold mb-2">Expert Faculty</h3>
                        <p className="text-gray-600 text-sm">Get guidance from experienced teachers</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <i className="fas fa-clock text-4xl text-purple-500 mb-3"></i>
                        <h3 className="text-gray-900 font-bold mb-2">Flexible Timing</h3>
                        <p className="text-gray-600 text-sm">We'll work with your schedule</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <i className="fas fa-video text-4xl text-pink-500 mb-3"></i>
                        <h3 className="text-gray-900 font-bold mb-2">Online Meeting</h3>
                        <p className="text-gray-600 text-sm">Join from anywhere via video call</p>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <p className="text-gray-700 mb-3">
                        <i className="fas fa-headset text-blue-600 mr-2"></i>
                        Need help? Contact our support team
                    </p>
                    <div className="flex justify-center gap-6 flex-wrap">
                        <a href="tel:+919115179935" className="text-blue-600 hover:text-blue-700 transition">
                            <i className="fas fa-phone mr-2"></i>
                            +91 9115179935
                        </a>
                        <a href="mailto:crack@ace2examz.in" className="text-blue-600 hover:text-blue-700 transition">
                            <i className="fas fa-envelope mr-2"></i>
                            crack@ace2examz.in
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookMeeting;
