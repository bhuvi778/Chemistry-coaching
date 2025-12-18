import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const BookMeeting = () => {
    const { isDark } = useTheme();
    const [webinarCards, setWebinarCards] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchWebinarCards();
    }, []);

    const fetchWebinarCards = async () => {
        try {
            const res = await fetch(`${API_URL}/webinar-cards`);
            const data = await res.json();
            setWebinarCards(data);
        } catch (error) {
            console.error('Error fetching webinar cards:', error);
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} relative`}>
            <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
                {/* Back Button */}
                <div className="mb-6">
                    <Link to="/" className={`${isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-gray-900'} flex items-center gap-2 transition`}>
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                        <i className="fas fa-calendar-check text-blue-600 mr-3"></i>
                        Book Your Session
                    </h1>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Schedule a personalized session with our expert faculty
                    </p>
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column - Zoho Bookings Iframe */}
                    <div className={`${isDark ? 'glass-panel' : 'bg-white shadow-lg border border-gray-200'} rounded-lg overflow-hidden`} style={{ minHeight: '750px' }}>
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

                    {/* Right Column - Webinar Cards */}
                    <div className="space-y-6">
                        {webinarCards.length > 0 ? (
                            webinarCards.map((card) => (
                                <div key={card._id} className={`${isDark ? 'glass-panel' : 'bg-white shadow-md border border-gray-200'} rounded-lg overflow-hidden hover:shadow-xl transition-shadow`}>
                                    <div className="flex flex-col sm:flex-row">
                                        {/* Card Image */}
                                        <div className="sm:w-1/3 h-48 sm:h-auto">
                                            <img
                                                src={card.image}
                                                alt={card.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Card Content */}
                                        <div className="sm:w-2/3 p-6">
                                            {card.subtitle && (
                                                <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                                                    {card.subtitle}
                                                </div>
                                            )}
                                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                                                {card.title}
                                            </h3>
                                            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {card.description}
                                            </p>

                                            {/* Date and Time */}
                                            {(card.date || card.time) && (
                                                <div className="mb-4 space-y-1">
                                                    {card.date && (
                                                        <p className={`text-sm flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            <i className="fas fa-calendar text-blue-600"></i>
                                                            {card.date}
                                                        </p>
                                                    )}
                                                    {card.time && (
                                                        <p className={`text-sm flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            <i className="fas fa-clock text-blue-600"></i>
                                                            {card.time}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Register Button */}
                                            <a
                                                href={card.buttonLink}
                                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition-colors duration-200"
                                            >
                                                {card.buttonText}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={`${isDark ? 'glass-panel' : 'bg-white shadow-md border border-gray-200'} rounded-lg p-12 text-center`}>
                                <i className={`fas fa-inbox text-6xl ${isDark ? 'text-gray-700' : 'text-gray-300'} mb-4`}></i>
                                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No programs available at the moment</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Cards */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`${isDark ? 'glass-panel' : 'bg-white shadow-sm border border-gray-200'} rounded-lg p-6 text-center`}>
                        <i className="fas fa-user-tie text-4xl text-blue-500 mb-3"></i>
                        <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Expert Faculty</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Get guidance from experienced teachers</p>
                    </div>
                    <div className={`${isDark ? 'glass-panel' : 'bg-white shadow-sm border border-gray-200'} rounded-lg p-6 text-center`}>
                        <i className="fas fa-clock text-4xl text-purple-500 mb-3"></i>
                        <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Flexible Timing</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Choose a time slot that works for you</p>
                    </div>
                    <div className={`${isDark ? 'glass-panel' : 'bg-white shadow-sm border border-gray-200'} rounded-lg p-6 text-center`}>
                        <i className="fas fa-video text-4xl text-pink-500 mb-3"></i>
                        <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Online Meeting</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Join from anywhere via video call</p>
                    </div>
                </div>

                {/* Contact Support */}
                <div className={`mt-8 ${isDark ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border rounded-lg p-6 text-center`}>
                    <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <i className="fas fa-headset text-blue-600 mr-2"></i>
                        Need help with booking? Contact our support team
                    </p>
                    <div className="flex justify-center gap-6 flex-wrap">
                        <a href="tel:+919115179935" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition`}>
                            <i className="fas fa-phone mr-2"></i>
                            +91 9115179935
                        </a>
                        <a href="mailto:crack@ace2examz.in" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition`}>
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
