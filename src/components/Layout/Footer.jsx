import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative mt-auto border-t border-gray-800 bg-black/40 backdrop-blur-xl">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Brand Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 border border-cyan-400 flex items-center justify-center rounded text-cyan-400">
                            <i className="fas fa-flask"></i>
                        </div>
                        <span className="brand-font text-2xl text-white">Reaction<span className="text-cyan-400">Lab</span></span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Catalyzing potential into success. The premier institute for chemistry coaching, dedicated to crafting the next generation of scientists and engineers.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-black transition-all duration-300">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-500 hover:text-white transition-all duration-300">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300">
                            <i className="fab fa-youtube"></i>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-black transition-all duration-300">
                            <i className="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
                        Quick Links
                        <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-pink-500 rounded-full"></span>
                    </h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li><Link to="/" className="hover:text-cyan-400 transition flex items-center gap-2"><i className="fas fa-chevron-right text-xs text-gray-600"></i> Home</Link></li>
                        <li><Link to="/about" className="hover:text-cyan-400 transition flex items-center gap-2"><i className="fas fa-chevron-right text-xs text-gray-600"></i> About Us</Link></li>
                        <li><Link to="/courses" className="hover:text-cyan-400 transition flex items-center gap-2"><i className="fas fa-chevron-right text-xs text-gray-600"></i> All Courses</Link></li>
                        <li><Link to="/contact" className="hover:text-cyan-400 transition flex items-center gap-2"><i className="fas fa-chevron-right text-xs text-gray-600"></i> Contact</Link></li>
                    </ul>
                </div>

                {/* Programs */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
                        Programs
                        <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-cyan-500 rounded-full"></span>
                    </h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-pink-400 transition">JEE Main & Advanced</a></li>
                        <li><a href="#" className="hover:text-pink-400 transition">NEET Medical</a></li>
                        <li><a href="#" className="hover:text-pink-400 transition">Foundation (Class 8-10)</a></li>
                        <li><a href="#" className="hover:text-pink-400 transition">Olympiad Prep</a></li>
                        <li><a href="#" className="hover:text-pink-400 transition">Crash Courses</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
                        Stay Updated
                        <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-purple-500 rounded-full"></span>
                    </h4>
                    <p className="text-gray-400 text-sm mb-4">Get the latest exam tips and chemistry facts delivered to your inbox.</p>
                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                        <div className="relative">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                            />
                            <button className="absolute right-1 top-1 bottom-1 px-3 bg-cyan-500 text-black rounded text-xs font-bold hover:bg-cyan-400 transition">
                                JOIN
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 flex items-start gap-3 text-gray-400 text-sm">
                        <i className="fas fa-map-marker-alt mt-1 text-cyan-400"></i>
                        <span>2nd Floor, Kota House, Edu-City, New Delhi - 110001</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 bg-black/60">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                <p>&copy; 2024 Reaction Institute. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition">Terms of Service</a>
                    <a href="#" className="hover:text-white transition">Sitemap</a>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;