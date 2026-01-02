import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Pagination from '../components/UI/Pagination';

const ScoreMatchBatches = () => {
    const { scoreMatchBatches } = useData();
    const [selectedExam, setSelectedExam] = useState('all');
    const [selectedBatchType, setSelectedBatchType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const batchesPerPage = 9; // 3 rows × 3 columns

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedExam, selectedBatchType]);

    // Filter batches
    const filteredBatches = (Array.isArray(scoreMatchBatches) ? scoreMatchBatches : []).filter(batch => {
        const examMatch = selectedExam === 'all' || batch.exam === selectedExam;
        const batchTypeMatch = selectedBatchType === 'all' || batch.batchType === selectedBatchType;
        return examMatch && batchTypeMatch;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredBatches.length / batchesPerPage);
    const indexOfLastBatch = currentPage * batchesPerPage;
    const indexOfFirstBatch = indexOfLastBatch - batchesPerPage;
    const currentBatches = filteredBatches.slice(indexOfFirstBatch, indexOfLastBatch);

    const getFilterClass = (isActive) => {
        return `px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${isActive
            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-[0_8px_30px_rgba(251,146,60,0.5)] scale-105 border-2 border-amber-400/50'
            : 'bg-gray-800/50 text-gray-400 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white hover:shadow-lg hover:scale-[1.02] border-2 border-gray-700 hover:border-amber-400/30'
            }`;
    };

    return (
        <div className="animate-fadeIn">
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="flex items-center mb-8">
                    <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-6">
                        <i className="fas fa-trophy text-5xl text-white"></i>
                    </div>
                    <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                        Score Max Batch
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Join our specialized batches designed to match your target score with expert guidance and personalized learning paths.
                    </p>
                </div>

                <div className="glass-panel rounded-2xl p-8 border border-amber-500/30">
                    {/* Exam Filter */}
                    <div className="mb-6">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <i className="fas fa-graduation-cap text-amber-400"></i>
                            Filter by Exam
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={() => setSelectedExam('all')} className={getFilterClass(selectedExam === 'all')}>
                                <i className="fas fa-th-large mr-2"></i>All Exams
                            </button>
                            <button onClick={() => setSelectedExam('JEE')} className={getFilterClass(selectedExam === 'JEE')}>
                                <i className="fas fa-atom mr-2"></i>JEE
                            </button>
                            <button onClick={() => setSelectedExam('NEET')} className={getFilterClass(selectedExam === 'NEET')}>
                                <i className="fas fa-heartbeat mr-2"></i>NEET
                            </button>
                            <button onClick={() => setSelectedExam('IAT')} className={getFilterClass(selectedExam === 'IAT')}>
                                <i className="fas fa-flask mr-2"></i>IAT
                            </button>
                            <button onClick={() => setSelectedExam('NEST')} className={getFilterClass(selectedExam === 'NEST')}>
                                <i className="fas fa-microscope mr-2"></i>NEST
                            </button>
                            <button onClick={() => setSelectedExam('CSIR NET')} className={getFilterClass(selectedExam === 'CSIR NET')}>
                                <i className="fas fa-graduation-cap mr-2"></i>CSIR NET
                            </button>
                            <button onClick={() => setSelectedExam('GATE')} className={getFilterClass(selectedExam === 'GATE')}>
                                <i className="fas fa-door-open mr-2"></i>GATE
                            </button>
                            <button onClick={() => setSelectedExam('IIT JAM')} className={getFilterClass(selectedExam === 'IIT JAM')}>
                                <i className="fas fa-university mr-2"></i>IIT JAM
                            </button>
                            <button onClick={() => setSelectedExam('TIFR')} className={getFilterClass(selectedExam === 'TIFR')}>
                                <i className="fas fa-atom mr-2"></i>TIFR
                            </button>
                        </div>
                    </div>

                    {/* Batch Type Filter */}
                    <div className="mb-8">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <i className="fas fa-layer-group text-amber-400"></i>
                            Filter by Batch Type
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={() => setSelectedBatchType('all')} className={getFilterClass(selectedBatchType === 'all')}>
                                <i className="fas fa-th-large mr-2"></i>All Types
                            </button>
                            <button onClick={() => setSelectedBatchType('Crash Course')} className={getFilterClass(selectedBatchType === 'Crash Course')}>
                                <i className="fas fa-bolt mr-2"></i>Crash Course
                            </button>
                            <button onClick={() => setSelectedBatchType('Revision Batch')} className={getFilterClass(selectedBatchType === 'Revision Batch')}>
                                <i className="fas fa-redo mr-2"></i>Revision Batch
                            </button>
                            <button onClick={() => setSelectedBatchType('Practice Batch')} className={getFilterClass(selectedBatchType === 'Practice Batch')}>
                                <i className="fas fa-dumbbell mr-2"></i>Practice Batch
                            </button>
                            <button onClick={() => setSelectedBatchType('One Shot Course')} className={getFilterClass(selectedBatchType === 'One Shot Course')}>
                                <i className="fas fa-bullseye mr-2"></i>One Shot Course
                            </button>
                            <button onClick={() => setSelectedBatchType('Fast Track Batch')} className={getFilterClass(selectedBatchType === 'Fast Track Batch')}>
                                <i className="fas fa-rocket mr-2"></i>Fast Track Batch
                            </button>
                        </div>
                    </div>

                    {/* Batches Display */}
                    {filteredBatches.length === 0 ? (
                        <div className="text-center py-12">
                            <i className="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">No Batches Found</h3>
                            <p className="text-gray-400">Try selecting different filters</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 flex justify-between items-center">
                                <div className="text-gray-400">
                                    <i className="fas fa-trophy mr-2"></i>
                                    Showing {indexOfFirstBatch + 1}-{Math.min(indexOfLastBatch, filteredBatches.length)} of {filteredBatches.length} {filteredBatches.length === 1 ? 'batch' : 'batches'}
                                </div>
                                {totalPages > 1 && (
                                    <div className="text-gray-400 text-sm">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentBatches.map(batch => (
                                    <div key={batch._id} className="glass-panel rounded-xl p-6 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,146,60,0.3)] group">
                                        {batch.badge && (
                                            <div className="inline-block px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full mb-3">
                                                {batch.badge}
                                            </div>
                                        )}
                                        <div className={`w-14 h-14 bg-gradient-to-r from-${batch.color}-500 to-${batch.color}-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <i className={`fas ${batch.icon} text-2xl text-white`}></i>
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">{batch.title}</h4>
                                        {batch.subtitle && (
                                            <p className="text-sm text-gray-400 mb-3">{batch.subtitle}</p>
                                        )}
                                        <p className="text-gray-300 mb-4 text-sm line-clamp-3">{batch.desc}</p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <i className="fas fa-graduation-cap text-amber-400"></i>
                                                <span>{batch.exam}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <i className="fas fa-layer-group text-amber-400"></i>
                                                <span>{batch.batchType}</span>
                                            </div>
                                            {batch.duration && (
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <i className="fas fa-clock text-amber-400"></i>
                                                    <span>{batch.duration}</span>
                                                </div>
                                            )}
                                            {batch.startDate && (
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <i className="fas fa-calendar text-amber-400"></i>
                                                    <span>Starts: {batch.startDate}</span>
                                                </div>
                                            )}
                                            {batch.price && (
                                                <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                                                    <i className="fas fa-rupee-sign"></i>
                                                    <span>{batch.price}</span>
                                                </div>
                                            )}
                                        </div>

                                        {batch.features && batch.features.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-xs font-semibold text-gray-500 mb-2">KEY FEATURES:</p>
                                                <ul className="space-y-1">
                                                    {batch.features.slice(0, 3).map((feature, idx) => (
                                                        <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                                                            <i className="fas fa-check-circle text-amber-400 mt-0.5"></i>
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {batch.enrollmentLink && (
                                            <a
                                                href={batch.enrollmentLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.5)] transition transform hover:scale-105"
                                            >
                                                <i className="fas fa-user-plus mr-2"></i>
                                                Enroll Now
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScoreMatchBatches;
