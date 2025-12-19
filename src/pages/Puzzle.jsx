import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Puzzle = () => {
    const { studyMaterials } = useData();
    const [selectedExam, setSelectedExam] = useState('all');

    // Filter only puzzle materials
    const puzzleMaterials = studyMaterials.filter(material => {
        const categoryMatch = material.category === 'Puzzle';
        const examMatch = selectedExam === 'all' || material.examType === selectedExam;
        return categoryMatch && examMatch;
    });


    // Load Notix script
    useEffect(() => {
        const script = document.createElement('script');
        script.id = 'notix-script';
        script.src = 'https://notixio.com/ent/current/enot.min.js';
        script.onload = function (sdk) {
            sdk.startInstall({
                appId: '1009dd9e969441892aa1e896dd18d0c',
                loadSettings: true
            });
        };
        document.head.appendChild(script);

        // Cleanup on unmount
        return () => {
            const existingScript = document.getElementById('notix-script');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);


    return (
        <div className="animate-fadeIn min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="flex items-center mb-8">
                    <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        <i className="fas fa-puzzle-piece mr-3"></i>
                        Chemistry Puzzles
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Challenge your mind with engaging chemistry puzzles and brain teasers
                    </p>
                </div>

                {/* Filter Section */}
                <div className="glass-panel rounded-2xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <i className="fas fa-filter text-purple-400"></i>
                        Filter Puzzles
                    </h3>

                    <div className="max-w-md">
                        <label className="block text-sm font-semibold text-gray-400 mb-3">
                            <i className="fas fa-graduation-cap mr-2 text-purple-400"></i>
                            Filter by Exam
                        </label>
                        <select
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-purple-400 transition"
                        >
                            <option value="all">All Exams</option>
                            <optgroup label="Engineering Entrance">
                                <option value="JEE">JEE (Main & Advanced)</option>
                                <option value="GATE">GATE</option>
                            </optgroup>
                            <optgroup label="Medical Entrance">
                                <option value="NEET">NEET</option>
                                <option value="AIIMS">AIIMS</option>
                            </optgroup>
                            <optgroup label="Science Entrance">
                                <option value="IAT">IAT (IISER Aptitude Test)</option>
                                <option value="NEST">NEST (National Entrance Screening Test)</option>
                                <option value="KVPY">KVPY (Kishore Vaigyanik Protsahan Yojana)</option>
                                <option value="TIFR">TIFR (Tata Institute)</option>
                            </optgroup>
                            <optgroup label="Post Graduate">
                                <option value="CSIR NET">CSIR NET</option>
                                <option value="IIT JAM">IIT JAM</option>
                            </optgroup>
                            <optgroup label="Other Competitive">
                                <option value="OLYMPIAD">Olympiad (Chemistry/Physics/Math)</option>
                                <option value="CUET">CUET (Common University Entrance Test)</option>
                            </optgroup>
                            <optgroup label="School Level">
                                <option value="BOARDS">Board Exams (CBSE/State - 11th/12th)</option>
                            </optgroup>
                        </select>

                        {/* Active Filter Display */}
                        {selectedExam !== 'all' && (
                            <div className="mt-4 flex items-center gap-3">
                                <span className="text-sm text-gray-400">Active filter:</span>
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-2">
                                    {selectedExam}
                                    <button onClick={() => setSelectedExam('all')} className="hover:text-white">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Puzzles Grid */}
                {puzzleMaterials.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-2xl">
                        <i className="fas fa-puzzle-piece text-6xl text-gray-600 mb-4"></i>
                        <h3 className="text-2xl font-bold text-white mb-2">No Puzzles Found</h3>
                        <p className="text-gray-400">
                            {selectedExam !== 'all'
                                ? `No puzzles available for ${selectedExam}. Try selecting a different exam.`
                                : 'Exciting chemistry puzzles will be available soon!'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {puzzleMaterials.map((puzzle) => (
                            <div key={puzzle._id} className="glass-panel rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300 group">
                                {puzzle.thumbnailUrl && (
                                    <div className="w-full aspect-[1/1.414] overflow-hidden relative">
                                        <img
                                            src={puzzle.thumbnailUrl}
                                            alt={puzzle.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1 bg-purple-500/90 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                                                <i className="fas fa-puzzle-piece mr-1"></i>
                                                Puzzle
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-bold text-white flex-1">{puzzle.title}</h3>
                                        <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs">
                                            {puzzle.fileType}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4">{puzzle.description}</p>
                                    <div className="flex gap-2 mb-4">
                                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                            <i className="fas fa-graduation-cap mr-1"></i>
                                            {puzzle.examType}
                                        </span>
                                    </div>
                                    {puzzle.fileSize && (
                                        <p className="text-gray-500 text-sm mb-4">
                                            <i className="fas fa-file mr-2"></i>
                                            Size: {puzzle.fileSize}
                                        </p>
                                    )}
                                    <a
                                        href={puzzle.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-semibold"
                                    >
                                        <i className="fas fa-download"></i>
                                        Download Puzzle
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-12 glass-panel rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <i className="fas fa-lightbulb text-yellow-400"></i>
                        Why Solve Chemistry Puzzles?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400">
                        <div>
                            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <i className="fas fa-brain text-purple-400"></i>
                                Enhance Problem-Solving Skills
                            </h3>
                            <p className="text-sm">
                                Puzzles help develop critical thinking and analytical skills essential for competitive exams.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <i className="fas fa-rocket text-pink-400"></i>
                                Boost Memory & Retention
                            </h3>
                            <p className="text-sm">
                                Engaging with puzzles improves memory and helps retain complex chemistry concepts better.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <i className="fas fa-trophy text-yellow-400"></i>
                                Exam Pattern Familiarity
                            </h3>
                            <p className="text-sm">
                                Many competitive exams include puzzle-based questions to test your logical reasoning.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <i className="fas fa-smile text-green-400"></i>
                                Make Learning Fun
                            </h3>
                            <p className="text-sm">
                                Puzzles make chemistry learning enjoyable and help break the monotony of traditional study methods.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Puzzle;
