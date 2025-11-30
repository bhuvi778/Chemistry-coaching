import React from 'react';

const About = () => {
  return (
    <div className="animate-fadeIn">
       <div className="max-w-5xl mx-auto px-4 py-20">
            {/* Our Story Section */}
            <div className="mb-24 flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                    <h1 className="text-5xl font-bold mb-6 text-white">Forging <span className="text-cyan-400">Futures</span> Since 2015</h1>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Reaction Lab started as a small doubt-clearing cell in a garage. Today, it stands as a beacon of excellence in chemistry education. Our journey began with a simple observation: students were memorizing reactions without understanding the underlying mechanisms.
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        We set out to change that. By combining traditional teaching with modern visualization tools, we've helped over 5,000 students crack JEE and NEET with top ranks. We don't just prepare you for exams; we prepare you to think like a scientist.
                    </p>
                </div>
                <div className="md:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl blur-xl opacity-30"></div>
                    <div className="relative glass-panel p-8 rounded-2xl border border-gray-700">
                        <div className="grid grid-cols-2 gap-6 text-center">
                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <div className="text-3xl font-bold text-pink-500 mb-1">5k+</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Alumni</div>
                            </div>
                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <div className="text-3xl font-bold text-cyan-400 mb-1">150+</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">IITians</div>
                            </div>
                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <div className="text-3xl font-bold text-yellow-400 mb-1">50+</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Doctors</div>
                            </div>
                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <div className="text-3xl font-bold text-green-400 mb-1">98%</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Success Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-6">The Teaching Methodology</h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">We believe chemistry isn't just memorization. It's understanding the building blocks of the universe through logic and visualization.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30">
                    <h3 className="text-2xl font-bold mb-4 text-cyan-400">Why We Produce Toppers</h3>
                    <ul className="space-y-4 text-gray-300">
                        <li className="flex items-start">
                            <i className="fas fa-check-circle text-pink-500 mt-1 mr-3"></i>
                            <span><strong>Hybrid Learning:</strong> Missed a class? Watch the recording on our app.</span>
                        </li>
                        <li className="flex items-start">
                            <i className="fas fa-check-circle text-pink-500 mt-1 mr-3"></i>
                            <span><strong>Rigorous Testing:</strong> Weekly Mains and Advanced pattern tests.</span>
                        </li>
                        <li className="flex items-start">
                            <i className="fas fa-check-circle text-pink-500 mt-1 mr-3"></i>
                            <span><strong>Small Batch Size:</strong> Max 30 students per batch for personal attention.</span>
                        </li>
                    </ul>
                </div>
                <div className="relative h-80 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                     <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                         <i className="fas fa-chalkboard-teacher text-9xl text-gray-700 opacity-50"></i>
                     </div>
                </div>
            </div>

            {/* Infrastructure Section */}
            <div className="mb-24">
                <h3 className="text-3xl font-bold text-center mb-12">State-of-the-Art Infrastructure</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-panel p-6 rounded-xl text-center hover:bg-gray-800/50 transition duration-300">
                        <div className="w-16 h-16 mx-auto bg-cyan-900/30 rounded-full flex items-center justify-center text-cyan-400 mb-4 text-2xl">
                            <i className="fas fa-book-reader"></i>
                        </div>
                        <h4 className="text-xl font-bold mb-2">Smart Library</h4>
                        <p className="text-gray-400 text-sm">24/7 access to thousands of reference books and quiet study zones.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl text-center hover:bg-gray-800/50 transition duration-300">
                        <div className="w-16 h-16 mx-auto bg-pink-900/30 rounded-full flex items-center justify-center text-pink-400 mb-4 text-2xl">
                            <i className="fas fa-flask"></i>
                        </div>
                        <h4 className="text-xl font-bold mb-2">Practical Labs</h4>
                        <p className="text-gray-400 text-sm">Real chemical labs for practical demonstration of theoretical concepts.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl text-center hover:bg-gray-800/50 transition duration-300">
                        <div className="w-16 h-16 mx-auto bg-purple-900/30 rounded-full flex items-center justify-center text-purple-400 mb-4 text-2xl">
                            <i className="fas fa-laptop-code"></i>
                        </div>
                        <h4 className="text-xl font-bold mb-2">CBT Center</h4>
                        <p className="text-gray-400 text-sm">Computer Based Test center to simulate the actual JEE/NEET exam environment.</p>
                    </div>
                </div>
            </div>

            <h3 className="text-3xl font-bold text-center mb-10">Meet Your Mentors (HODs)</h3>
            <div className="flex flex-wrap justify-center gap-8">
                <div className="text-center group">
                    <div className="hex-container w-32 h-32 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                        <span className="text-4xl font-bold text-black">SB</span>
                    </div>
                    <h4 className="text-xl font-bold">Dr. Sarah Bond</h4>
                    <p className="text-cyan-400 text-sm">HOD Organic Chemistry</p>
                    <p className="text-gray-500 text-xs mt-1">Ex-IIT Faculty, 15 Yrs Exp</p>
                </div>
                <div className="text-center group">
                     <div className="hex-container w-32 h-32 mx-auto flex items-center justify-center mb-4 bg-gradient-to-bl group-hover:scale-110 transition duration-300">
                        <span className="text-4xl font-bold text-black">JI</span>
                    </div>
                    <h4 className="text-xl font-bold">Mr. James Ion</h4>
                    <p className="text-cyan-400 text-sm">HOD Physical Chemistry</p>
                     <p className="text-gray-500 text-xs mt-1">B.Tech IIT Delhi, 12 Yrs Exp</p>
                </div>
                 <div className="text-center group">
                     <div className="hex-container w-32 h-32 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                        <span className="text-4xl font-bold text-black">ER</span>
                    </div>
                    <h4 className="text-xl font-bold">Ms. Elena Ray</h4>
                    <p className="text-cyan-400 text-sm">HOD Inorganic Chemistry</p>
                     <p className="text-gray-500 text-xs mt-1">M.Sc Chemistry, Gold Medalist</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default About;