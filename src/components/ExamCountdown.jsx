import { useState, useEffect } from 'react';

const ExamCountdown = () => {
    const [countdown, setCountdown] = useState(null);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isExpanded, setIsExpanded] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Fetch active countdown
    useEffect(() => {
        const fetchCountdown = async () => {
            try {
                const response = await fetch(`${API_URL}/exam-countdown/active`);
                const data = await response.json();

                if (data && data.examDate) {
                    setCountdown(data);
                }
            } catch (error) {
                console.error('Error fetching countdown:', error);
            }
        };

        fetchCountdown();
        // Refresh every 5 minutes
        const interval = setInterval(fetchCountdown, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Calculate time left
    useEffect(() => {
        if (!countdown || !countdown.examDate) return;

        const calculateTimeLeft = () => {
            const examDate = new Date(countdown.examDate);
            const now = new Date();
            const difference = examDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                // Exam has passed
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    if (!countdown) return null;

    const colorClasses = {
        cyan: 'from-cyan-500 to-blue-500 border-cyan-400',
        blue: 'from-blue-500 to-indigo-500 border-blue-400',
        red: 'from-red-500 to-pink-500 border-red-400',
        green: 'from-green-500 to-emerald-500 border-green-400',
        purple: 'from-purple-500 to-pink-500 border-purple-400',
        orange: 'from-orange-500 to-red-500 border-orange-400',
        pink: 'from-pink-500 to-rose-500 border-pink-400'
    };

    const gradientClass = colorClasses[countdown.color] || colorClasses.cyan;

    return (
        <div className="fixed top-36 right-0 z-40 animate-fadeIn">
            {/* Collapsed Tab */}
            {!isExpanded && (
                <div
                    onClick={() => setIsExpanded(true)}
                    className={`cursor-pointer bg-gradient-to-r ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} rounded-l-xl shadow-2xl p-3 flex items-center gap-2 hover:scale-105 transition-transform`}
                >
                    <div className="text-white text-center">
                        <i className={`fas ${countdown.icon} text-xl mb-1 block`}></i>
                        <div className="text-xs font-bold">{timeLeft.days}d</div>
                    </div>
                    <i className="fas fa-chevron-left text-white text-sm"></i>
                </div>
            )}

            {/* Expanded Widget */}
            {isExpanded && (
                <div className="mr-4">
                    <div className={`glass-panel rounded-xl border-2 ${gradientClass.split(' ')[1]} shadow-2xl max-w-xs relative`}>
                        {/* Collapse Button */}
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="absolute -left-8 top-1/2 -translate-y-1/2 w-8 h-16 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-l-lg hover:from-gray-700 hover:to-gray-600 transition flex items-center justify-center shadow-lg"
                            title="Hide countdown"
                        >
                            <i className="fas fa-chevron-right text-sm"></i>
                        </button>

                        {/* Header */}
                        <div className={`bg-gradient-to-r ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} p-4 rounded-t-xl`}>
                            <div className="flex items-center gap-2 text-white">
                                <i className={`fas ${countdown.icon} text-xl`}></i>
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm">{countdown.examName}</h3>
                                    {countdown.description && (
                                        <p className="text-xs opacity-90">{countdown.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Countdown */}
                        <div className="p-4">
                            <div className="grid grid-cols-4 gap-2">
                                <div className="text-center">
                                    <div className={`bg-gradient-to-br ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} text-white rounded-lg p-2 font-bold text-lg`}>
                                        {timeLeft.days}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Days</p>
                                </div>
                                <div className="text-center">
                                    <div className={`bg-gradient-to-br ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} text-white rounded-lg p-2 font-bold text-lg`}>
                                        {timeLeft.hours}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Hours</p>
                                </div>
                                <div className="text-center">
                                    <div className={`bg-gradient-to-br ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} text-white rounded-lg p-2 font-bold text-lg`}>
                                        {timeLeft.minutes}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Mins</p>
                                </div>
                                <div className="text-center">
                                    <div className={`bg-gradient-to-br ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} text-white rounded-lg p-2 font-bold text-lg`}>
                                        {timeLeft.seconds}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Secs</p>
                                </div>
                            </div>

                            {/* Exam Date */}
                            <div className="mt-3 text-center">
                                <p className="text-xs text-gray-500">
                                    <i className="far fa-calendar mr-1"></i>
                                    {new Date(countdown.examDate).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamCountdown;
