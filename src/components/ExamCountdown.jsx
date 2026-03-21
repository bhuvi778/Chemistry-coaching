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
                // Add cache-busting timestamp to ensure fresh data
                const timestamp = new Date().getTime();
                const response = await fetch(`${API_URL}/exam-countdown/active?t=${timestamp}`, {
                    cache: 'no-cache',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });
                const data = await response.json();

                if (data && data.examDate) {
                    setCountdown(data);
                }
            } catch (error) {
                console.error('Error fetching countdown:', error);
            }
        };

        fetchCountdown();
        // Refresh every 1 minute for more responsive updates
        const interval = setInterval(fetchCountdown, 60 * 1000);
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
        <div className="fixed bottom-20 left-0 z-40 animate-fadeIn">
            {/* Collapsed Tab - slides out from left */}
            {!isExpanded && (
                <div
                    onClick={() => setIsExpanded(true)}
                    className={`cursor-pointer bg-gradient-to-r ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} rounded-r-xl shadow-2xl pl-3 pr-4 py-3 flex items-center gap-3 hover:pl-5 transition-all duration-300`}
                >
                    <i className={`fas ${countdown.icon} text-white text-base`}></i>
                    <div className="text-white">
                        <div className="text-[10px] font-semibold opacity-90 leading-none">{countdown.examName}</div>
                        <div className="text-sm font-bold leading-tight">{timeLeft.days}d {timeLeft.hours}h left</div>
                    </div>
                    <i className="fas fa-chevron-right text-white text-xs opacity-70"></i>
                </div>
            )}

            {/* Expanded Widget */}
            {isExpanded && (
                <div className="ml-0">
                    <div className={`glass-panel rounded-r-xl border-2 border-l-0 ${gradientClass.split(' ')[1]} shadow-2xl w-60 relative`}>
                        {/* Collapse Button */}
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-14 bg-gradient-to-l from-gray-800 to-gray-700 text-white rounded-r-lg hover:from-gray-700 hover:to-gray-600 transition flex items-center justify-center shadow-lg"
                            title="Hide countdown"
                        >
                            <i className="fas fa-chevron-left text-sm"></i>
                        </button>

                        {/* Header */}
                        <div className={`bg-gradient-to-r ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} p-3 rounded-tr-xl`}>
                            <div className="flex items-center gap-2 text-white">
                                <i className={`fas ${countdown.icon} text-lg`}></i>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm truncate">{countdown.examName}</h3>
                                    {countdown.description && (
                                        <p className="text-xs opacity-90 truncate">{countdown.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Countdown */}
                        <div className="p-3">
                            <div className="grid grid-cols-4 gap-1.5">
                                <div className="text-center">
                                    <div className={`bg-gradient-to-br ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} text-white rounded-lg p-2 font-bold text-base`}>
                                        {timeLeft.days}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Days</p>
                                </div>
                                <div className="text-center">
                                    <div className={`bg-gradient-to-br ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} text-white rounded-lg p-2 font-bold text-base`}>
                                        {timeLeft.hours}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Hrs</p>
                                </div>
                                <div className="text-center">
                                    <div className={`bg-gradient-to-br ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} text-white rounded-lg p-2 font-bold text-base`}>
                                        {timeLeft.minutes}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Mins</p>
                                </div>
                                <div className="text-center">
                                    <div className={`bg-gradient-to-br ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} text-white rounded-lg p-2 font-bold text-base`}>
                                        {timeLeft.seconds}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Secs</p>
                                </div>
                            </div>

                            {/* Exam Date */}
                            <div className="mt-2 text-center">
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
