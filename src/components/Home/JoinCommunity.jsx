import React from 'react';

const JoinCommunity = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 py-20">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-purple-900/40 border border-cyan-500/30">
                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 p-12 lg:p-16">
                    {/* Left Side - Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-block px-4 py-2 mb-4 bg-cyan-500/20 border border-cyan-400/50 rounded-full">
                            <span className="text-cyan-400 font-semibold text-sm flex items-center gap-2">
                                <i className="fas fa-users"></i>
                                Join 10,000+ Students
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Join Our Learning
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                                Community
                            </span>
                        </h2>

                        <p className="text-gray-300 text-lg mb-8 max-w-xl">
                            Connect with fellow chemistry enthusiasts, access exclusive study materials,
                            participate in live sessions, and get personalized guidance from expert mentors.
                        </p>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-video text-cyan-400"></i>
                                </div>
                                <span className="text-sm">Live Interactive Sessions</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-book-open text-purple-400"></i>
                                </div>
                                <span className="text-sm">Exclusive Study Materials</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-comments text-pink-400"></i>
                                </div>
                                <span className="text-sm">Doubt Clearing Forums</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-trophy text-blue-400"></i>
                                </div>
                                <span className="text-sm">Weekly Competitions</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <a
                            href="https://ace2examz-1003.freshlearn.com/member/#/login"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:scale-105"
                        >
                            <i className="fas fa-sign-in-alt"></i>
                            Join Community Now
                            <i className="fas fa-arrow-right"></i>
                        </a>

                        <p className="text-gray-500 text-sm mt-4">
                            <i className="fas fa-lock mr-1"></i>
                            Free to join • No credit card required
                        </p>
                    </div>

                    {/* Right Side - Visual Elements */}
                    <div className="flex-1 relative">
                        <div className="relative w-full max-w-md mx-auto">
                            {/* Main Circle */}
                            <div className="relative w-64 h-64 mx-auto">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 animate-spin-slow"></div>
                                <div className="absolute inset-4 rounded-full bg-gray-900/80 backdrop-blur-xl flex items-center justify-center border border-cyan-400/30">
                                    <div className="text-center">
                                        <i className="fas fa-users text-6xl text-cyan-400 mb-2"></i>
                                        <p className="text-white font-bold text-2xl">10,000+</p>
                                        <p className="text-gray-400 text-sm">Active Members</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <div className="absolute -top-4 -right-4 glass-panel p-4 rounded-xl border border-cyan-400/30 animate-float">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-white font-semibold text-sm">500+ Online</span>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -left-4 glass-panel p-4 rounded-xl border border-purple-400/30 animate-float" style={{ animationDelay: '1s' }}>
                                <div className="text-center">
                                    <p className="text-purple-400 font-bold text-xl">95%</p>
                                    <p className="text-gray-400 text-xs">Success Rate</p>
                                </div>
                            </div>

                            <div className="absolute top-1/2 -right-8 glass-panel p-3 rounded-lg border border-pink-400/30 animate-float" style={{ animationDelay: '0.5s' }}>
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-star text-yellow-400"></i>
                                    <span className="text-white font-semibold text-sm">4.9/5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Wave Decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
            </div>
        </section>
    );
};

export default JoinCommunity;
