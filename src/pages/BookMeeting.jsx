import React from 'react';
import { Link } from 'react-router-dom';

const BookMeeting = () => {
    return (
        <div className="animate-fadeIn min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-20">
                {/* Back Button */}
                <div className="flex items-center mb-8">
                    <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        <i className="fas fa-calendar-check mr-3"></i>
                        Book Your Meeting
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Schedule a one-on-one session with our expert faculty
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-panel p-6 rounded-xl text-center">
                        <i className="fas fa-user-tie text-4xl text-cyan-400 mb-3"></i>
                        <h3 className="text-white font-bold mb-2">Expert Faculty</h3>
                        <p className="text-gray-400 text-sm">Get guidance from experienced teachers</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl text-center">
                        <i className="fas fa-clock text-4xl text-purple-400 mb-3"></i>
                        <h3 className="text-white font-bold mb-2">Flexible Timing</h3>
                        <p className="text-gray-400 text-sm">Choose a time slot that works for you</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl text-center">
                        <i className="fas fa-video text-4xl text-pink-400 mb-3"></i>
                        <h3 className="text-white font-bold mb-2">Online Meeting</h3>
                        <p className="text-gray-400 text-sm">Join from anywhere via video call</p>
                    </div>
                </div>

                {/* Booking Interface */}
                <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
                        <h2 className="text-white font-bold text-xl text-center">
                            <i className="fas fa-calendar-alt mr-2"></i>
                            Select Your Preferred Time Slot
                        </h2>
                    </div>

                    {/* Zoho Bookings Iframe */}
                    <div className="bg-white">
                        <iframe
                            width='100%'
                            height='750px'
                            src='https://ace2examzlive.zohobookings.in/portal-embed#/ace2examz'
                            frameBorder='0'
                            allowFullScreen
                            title="Book Your Meeting"
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 glass-panel p-6 rounded-xl">
                    <h3 className="text-white font-bold text-lg mb-4">
                        <i className="fas fa-info-circle mr-2 text-cyan-400"></i>
                        How to Book Your Meeting
                    </h3>
                    <ol className="space-y-3 text-gray-400">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                            <span>Select your preferred date and time from the calendar above</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                            <span>Fill in your details (Name, Email, Phone Number)</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                            <span>Click "Register" to confirm your booking</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                            <span>You'll receive a confirmation email with meeting details and link</span>
                        </li>
                    </ol>
                </div>

                {/* Contact Support */}
                <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 text-center">
                    <p className="text-gray-400 mb-3">
                        <i className="fas fa-headset text-cyan-400 mr-2"></i>
                        Need help with booking? Contact our support team
                    </p>
                    <div className="flex justify-center gap-6 flex-wrap">
                        <a href="tel:+919115179935" className="text-cyan-400 hover:text-cyan-300 transition">
                            <i className="fas fa-phone mr-2"></i>
                            +91 9115179935
                        </a>
                        <a href="mailto:crack@ace2examz.in" className="text-cyan-400 hover:text-cyan-300 transition">
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
