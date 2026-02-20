import { useState } from 'react';
import { Link } from 'react-router-dom';

const DPP = () => {
    const [activeTab, setActiveTab] = useState('class11');

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <h1 className="text-5xl font-bold text-white mb-4 text-center">
                    Daily Practice <span className="text-cyan-400">Problems</span>
                </h1>
                <p className="text-gray-400 text-center text-lg mb-12 max-w-2xl mx-auto">
                    Sharpen your skills with daily practice problems curated for JEE & NEET aspirants.
                </p>

                {/* Custom Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="bg-gray-800/50 p-1 rounded-xl flex gap-1 border border-gray-700">
                        <button
                            onClick={() => setActiveTab('class11')}
                            className={`px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${activeTab === 'class11'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Class 11
                        </button>
                        <button
                            onClick={() => setActiveTab('class12')}
                            className={`px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${activeTab === 'class12'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Class 12
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Coming Soon Cards */}
                    <div className="glass-panel p-6 rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 group">
                        <div className="h-40 bg-gray-800/50 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                            <i className="fas fa-flask text-4xl text-gray-600 group-hover:text-cyan-400 transition-colors"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Atomic Structure</h3>
                        <p className="text-gray-400 text-sm mb-4">DPP Set #01 • 20 Questions</p>
                        <button className="w-full py-2 bg-gray-800 text-gray-400 rounded-lg cursor-not-allowed border border-gray-700">
                            Coming Soon
                        </button>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 group">
                        <div className="h-40 bg-gray-800/50 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                            <i className="fas fa-atom text-4xl text-gray-600 group-hover:text-purple-400 transition-colors"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Chemical Bonding</h3>
                        <p className="text-gray-400 text-sm mb-4">DPP Set #01 • 15 Questions</p>
                        <button className="w-full py-2 bg-gray-800 text-gray-400 rounded-lg cursor-not-allowed border border-gray-700">
                            Coming Soon
                        </button>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 group">
                        <div className="h-40 bg-gray-800/50 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                            <i className="fas fa-burn text-4xl text-gray-600 group-hover:text-orange-400 transition-colors"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Thermodynamics</h3>
                        <p className="text-gray-400 text-sm mb-4">DPP Set #01 • 25 Questions</p>
                        <button className="w-full py-2 bg-gray-800 text-gray-400 rounded-lg cursor-not-allowed border border-gray-700">
                            Coming Soon
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DPP;
