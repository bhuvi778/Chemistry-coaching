import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BookMeeting = () => {
    // Countdown timer state
    const [timeLeft, setTimeLeft] = useState({
        days: 5,
        hours: 3,
        minutes: 3,
        seconds: 22
    });

    // Countdown timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else if (days > 0) {
                    days--;
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }

                return { days, hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Registration successful! You will receive a confirmation email shortly.');
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
                    {/* Left Column - Webinar Details */}
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

                        {/* Webinar Title */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Demo Webinar
                            </h1>
                            <p className="text-gray-600">
                                Webinar - Description
                            </p>
                        </div>

                        {/* Date/Time Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Date/Time</h3>
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-500 text-white rounded-lg p-3 text-center min-w-[80px]">
                                    <div className="text-xs font-semibold uppercase">DEC</div>
                                    <div className="text-2xl font-bold">23</div>
                                </div>
                                <div>
                                    <div className="text-gray-900 font-semibold">Tuesday</div>
                                    <div className="text-blue-600 text-sm flex items-center gap-1">
                                        02:30 PM - IST
                                        <i className="fas fa-external-link-alt text-xs"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Countdown Timer */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Starts in</h3>
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="bg-gray-100 rounded-lg p-4 min-w-[70px]">
                                        <div className="text-3xl font-bold text-gray-900">
                                            {timeLeft.days}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-2">Days</div>
                                </div>
                                <div className="flex items-center text-2xl text-gray-400">:</div>
                                <div className="text-center">
                                    <div className="bg-gray-100 rounded-lg p-4 min-w-[70px]">
                                        <div className="text-3xl font-bold text-gray-900">
                                            {timeLeft.hours}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-2">Hrs</div>
                                </div>
                                <div className="flex items-center text-2xl text-gray-400">:</div>
                                <div className="text-center">
                                    <div className="bg-gray-100 rounded-lg p-4 min-w-[70px]">
                                        <div className="text-3xl font-bold text-gray-900">
                                            {timeLeft.minutes}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-2">Mins</div>
                                </div>
                                <div className="flex items-center text-2xl text-gray-400">:</div>
                                <div className="text-center">
                                    <div className="bg-gray-100 rounded-lg p-4 min-w-[70px]">
                                        <div className="text-3xl font-bold text-gray-900">
                                            {timeLeft.seconds}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-2">Secs</div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Apps */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900">Mobile apps</h3>
                            <div className="flex gap-3">
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900 transition"
                                    aria-label="Download on App Store"
                                >
                                    <i className="fab fa-apple text-3xl"></i>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900 transition"
                                    aria-label="Get it on Google Play"
                                >
                                    <i className="fab fa-google-play text-3xl"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Registration Form */}
                    <div className="bg-white rounded-lg shadow-sm p-8 lg:sticky lg:top-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            Webinar Registration
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
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            {/* Disclaimer */}
                            <div className="text-xs text-gray-600 leading-relaxed">
                                By clicking 'Register', you acknowledge that the webinar organizer may use this
                                information to share updates regarding this webinar as well as for future communications.
                            </div>

                            {/* Register Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200"
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Additional Information Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <i className="fas fa-user-tie text-4xl text-blue-500 mb-3"></i>
                        <h3 className="text-gray-900 font-bold mb-2">Expert Faculty</h3>
                        <p className="text-gray-600 text-sm">Get guidance from experienced teachers</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <i className="fas fa-clock text-4xl text-purple-500 mb-3"></i>
                        <h3 className="text-gray-900 font-bold mb-2">Flexible Timing</h3>
                        <p className="text-gray-600 text-sm">Choose a time slot that works for you</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <i className="fas fa-video text-4xl text-pink-500 mb-3"></i>
                        <h3 className="text-gray-900 font-bold mb-2">Online Meeting</h3>
                        <p className="text-gray-600 text-sm">Join from anywhere via video call</p>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <p className="text-gray-700 mb-3">
                        <i className="fas fa-headset text-blue-600 mr-2"></i>
                        Need help with booking? Contact our support team
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
