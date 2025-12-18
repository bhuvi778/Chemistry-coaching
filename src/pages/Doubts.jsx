import React from 'react';
import { Link } from 'react-router-dom';

const Doubts = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        <i className="fas fa-question-circle text-blue-600 mr-3"></i>
                        Get Your Doubts Cleared
                    </h1>
                    <p className="text-lg text-gray-600">
                        Book a doubt clearing session with our expert faculty
                    </p>
                </div>

                {/* Zoho Bookings Iframe */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ minHeight: '750px' }}>
                    <iframe
                        width='100%'
                        height='750px'
                        src='https://ace2examzlive.zohobookings.in/portal-embed#/ace2examz'
                        frameBorder='0'
                        allowFullScreen
                        title="Book Doubt Clearing Session"
                        className="w-full"
                    />
                </div>

                {/* Info Cards */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <i className="fas fa-user-graduate text-4xl text-blue-500 mb-3"></i>
                        <h3 className="text-gray-900 font-bold mb-2">Expert Guidance</h3>
                        <p className="text-gray-600 text-sm">Get your doubts cleared by experienced faculty</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <i className="fas fa-clock text-4xl text-purple-500 mb-3"></i>
                        <h3 className="text-gray-900 font-bold mb-2">Quick Response</h3>
                        <p className="text-gray-600 text-sm">Fast and efficient doubt resolution</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <i className="fas fa-video text-4xl text-pink-500 mb-3"></i>
                        <h3 className="text-gray-900 font-bold mb-2">Online Sessions</h3>
                        <p className="text-gray-600 text-sm">Join from anywhere via video call</p>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <p className="text-gray-700 mb-3">
                        <i className="fas fa-headset text-blue-600 mr-2"></i>
                        Need immediate help? Contact our support team
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

export default Doubts;
