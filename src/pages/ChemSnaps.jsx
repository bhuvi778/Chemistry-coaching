import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Pagination from '../components/UI/Pagination';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker to local file (hosted in public directory)
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const ChemSnaps = () => {
    const { chemSnaps } = useData();
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedExam, setSelectedExam] = useState('all');
    const [selectedChapter, setSelectedChapter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewingFile, setViewingFile] = useState(null);

    // PDF rendering states
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [pdfPages, setPdfPages] = useState([]);

    // Admin Chapters State
    const [adminChapters, setAdminChapters] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const materialsPerPage = 10; // 2 rows × 5 columns

    // Load and render PDF using PDF.js (works for all devices)
    const loadPdfPages = async (url) => {
        setLoadingPdf(true);
        setPdfPages([]);

        try {
            // Fetch PDF as blob to avoid CORS issues
            const response = await fetch(url);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();

            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const pages = [];

            // Use higher scale for better quality on desktop
            const scale = window.innerWidth > 768 ? 2.0 : 1.5;

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale });

                // Create canvas
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render page
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                // Convert canvas to image
                const imageData = canvas.toDataURL('image/png');
                pages.push({ pageNum, imageData, width: viewport.width, height: viewport.height });
            }

            setPdfPages(pages);
        } catch (error) {
            console.error('Error loading PDF:', error);
            console.error('Error details:', error.message);
        } finally {
            setLoadingPdf(false);
        }
    };

    // Trigger PDF load when viewing file changes
    useEffect(() => {
        if (viewingFile && viewingFile.fileType !== 'IMAGE') {
            loadPdfPages(viewingFile.fileUrl);
        } else if (!viewingFile) {
            setPdfPages([]);
        }
    }, [viewingFile]);

    // Fetch chapters from ChemSnaps API
    useEffect(() => {
        const fetchChemSnapChapters = async () => {
            try {
                const res = await fetch(`${API_URL}/chemsnaps/chapters/list?t=${Date.now()}`);
                if (res.ok) {
                    const chapters = await res.json();
                    setAdminChapters(chapters);
                } else {
                    console.error('Failed to fetch ChemSnap chapters');
                }
            } catch (err) {
                console.error("Error fetching ChemSnap chapters:", err);
            }
        };
        fetchChemSnapChapters();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedSubject, selectedExam, selectedChapter, searchQuery]);

    const safeChemSnaps = Array.isArray(chemSnaps) ? chemSnaps : [];

    // Get unique chapters for filter dropdown from ChemSnaps API
    const uniqueChapters = adminChapters;

    const filteredChemSnaps = safeChemSnaps.filter(snap => {
        const subjectMatch = selectedSubject === 'all' || snap.category === selectedSubject;
        const examMatch = selectedExam === 'all' || snap.examType === selectedExam;
        const chapterMatch = selectedChapter === 'all' || snap.chapter === selectedChapter;
        const searchMatch = searchQuery === '' ||
            snap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snap.description.toLowerCase().includes(searchQuery.toLowerCase());
        return subjectMatch && examMatch && chapterMatch && searchMatch;
    });

    const totalPages = Math.ceil(filteredChemSnaps.length / materialsPerPage);
    const indexOfLastMaterial = currentPage * materialsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
    const currentChemSnaps = filteredChemSnaps.slice(indexOfFirstMaterial, indexOfLastMaterial);

    const handleView = (chemSnap) => {
        setViewingFile(chemSnap);
    };

    const closeViewer = () => {
        setViewingFile(null);
        setPdfPages([]);
    };

    return (
        <div className="animate-fadeIn min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="flex items-center mb-8">
                    <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        <i className="fas fa-bolt mr-3"></i>
                        ChemSnaps
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Quick reference materials and visual snapshots for chemistry concepts
                    </p>
                </div>

                {/* Filters */}
                <div className="glass-panel rounded-2xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <i className="fas fa-filter text-cyan-400"></i>
                        Filter ChemSnaps
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Search by Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-3">
                                <i className="fas fa-search mr-2 text-green-400"></i>
                                Search by Name
                            </label>
                            <input
                                type="text"
                                placeholder="Search ChemSnaps..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-green-400 transition placeholder-gray-500"
                            />
                        </div>

                        {/* Exam Type Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-3">
                                <i className="fas fa-graduation-cap mr-2 text-cyan-400"></i>
                                Filter by Exam
                            </label>
                            <select
                                value={selectedExam}
                                onChange={(e) => setSelectedExam(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-cyan-400 transition"
                            >
                                <option value="all">All Exams</option>
                                <optgroup label="UG Entrance Exams">
                                    <option value="NEET">NEET</option>
                                    <option value="JEE">JEE (Main & Advanced)</option>
                                    <option value="IAT">IAT (IISER Aptitude Test)</option>
                                    <option value="NEST">NEST (National Entrance Screening Test)</option>
                                    <option value="CUET UG">CUET UG</option>
                                    <option value="BITSAT">BITSAT</option>
                                </optgroup>
                                <optgroup label="PG Entrance Exams">
                                    <option value="IIT JAM">IIT JAM</option>
                                    <option value="CUET PG">CUET PG</option>
                                </optgroup>
                                <optgroup label="Research Level Exams">
                                    <option value="CSIR NET">CSIR NET</option>
                                    <option value="GATE">GATE</option>
                                    <option value="TIFR">TIFR (Tata Institute)</option>
                                </optgroup>
                                <optgroup label="Competitive Exams (Govt. Job)">
                                    <option value="PSTET">PSTET</option>
                                    <option value="Master Cadre">Master Cadre</option>
                                    <option value="UPSC - Mains (Chemistry)">UPSC - Mains (Chemistry)</option>
                                </optgroup>
                            </select>
                        </div>

                        {/* Subject Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-3">
                                <i className="fas fa-flask mr-2 text-blue-400"></i>
                                Filter by Subject
                            </label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-400 transition"
                            >
                                <option value="all">All Subjects</option>
                                <option value="General">General</option>
                                <option value="Physical Chemistry">Physical Chemistry</option>
                                <option value="Organic Chemistry">Organic Chemistry</option>
                                <option value="Inorganic Chemistry">Inorganic Chemistry</option>
                                <option value="Analytical Chemistry">Analytical Chemistry</option>
                                <option value="Biochemistry">Biochemistry</option>
                            </select>
                        </div>

                        {/* Chapter Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-3">
                                <i className="fas fa-book mr-2 text-purple-400"></i>
                                Filter by Chapter
                            </label>
                            <select
                                value={selectedChapter}
                                onChange={(e) => setSelectedChapter(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-purple-400 transition"
                            >
                                <option value="all">All Chapters</option>
                                {uniqueChapters.length === 0 ? (
                                    <option disabled>Loading chapters...</option>
                                ) : (
                                    uniqueChapters.map(chapter => (
                                        <option key={chapter} value={chapter}>{chapter}</option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(selectedExam !== 'all' || selectedSubject !== 'all' || searchQuery !== '' || selectedChapter !== 'all') && (
                        <div className="mt-4 flex items-center gap-3 flex-wrap">
                            <span className="text-sm text-gray-400">Active filters:</span>
                            {searchQuery !== '' && (
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-2">
                                    Search: "{searchQuery}"
                                    <button onClick={() => setSearchQuery('')} className="hover:text-white">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </span>
                            )}
                            {selectedExam !== 'all' && (
                                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm flex items-center gap-2">
                                    {selectedExam}
                                    <button onClick={() => setSelectedExam('all')} className="hover:text-white">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </span>
                            )}
                            {selectedSubject !== 'all' && (
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-2">
                                    {selectedSubject}
                                    <button onClick={() => setSelectedSubject('all')} className="hover:text-white">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </span>
                            )}
                            {selectedChapter !== 'all' && (
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-2">
                                    Chapter: {selectedChapter}
                                    <button onClick={() => setSelectedChapter('all')} className="hover:text-white">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedExam('all');
                                    setSelectedSubject('all');
                                    setSelectedChapter('all');
                                }}
                                className="text-sm text-gray-400 hover:text-white underline"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* ChemSnaps Grid */}
                {filteredChemSnaps.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-2xl">
                        <i className="fas fa-bolt text-6xl text-gray-600 mb-4"></i>
                        <h3 className="text-2xl font-bold text-white mb-2">No ChemSnaps Found</h3>
                        <p className="text-gray-400">
                            {searchQuery ? `No results for "${searchQuery}". Try a different search term.` : 'ChemSnaps will be available soon!'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Pagination Info */}
                        <div className="mb-6 flex justify-between items-center">
                            <div className="text-gray-400">
                                <i className="fas fa-bolt mr-2"></i>
                                Showing {indexOfFirstMaterial + 1}-{Math.min(indexOfLastMaterial, filteredChemSnaps.length)} of {filteredChemSnaps.length} {filteredChemSnaps.length === 1 ? 'ChemSnap' : 'ChemSnaps'}
                            </div>
                            {totalPages > 1 && (
                                <div className="text-gray-400 text-sm">
                                    Page {currentPage} of {totalPages}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {currentChemSnaps.map((chemSnap) => (
                                <div key={chemSnap._id} className="glass-panel rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300">
                                    {chemSnap.thumbnailUrl && (
                                        <div className="w-full aspect-[1/1.414] overflow-hidden">
                                            <img
                                                src={chemSnap.thumbnailUrl}
                                                alt={chemSnap.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-3">{chemSnap.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{chemSnap.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                                {chemSnap.category}
                                            </span>
                                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                                {chemSnap.examType}
                                            </span>
                                            {chemSnap.chapter && (
                                                <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs">
                                                    {chemSnap.chapter}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleView(chemSnap)}
                                            className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition font-semibold"
                                        >
                                            <i className="fas fa-eye"></i>
                                            View
                                        </button>
                                    </div>
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

            {/* File Viewer Modal */}
            {viewingFile && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-gray-900 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-gray-700 shadow-2xl relative">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50 rounded-t-2xl">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <i className="fas fa-bolt text-cyan-400"></i>
                                {viewingFile.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                {/* Close Button */}
                                <button
                                    onClick={closeViewer}
                                    className="w-10 h-10 rounded-full bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white flex items-center justify-center transition"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-white relative overflow-hidden">
                            {viewingFile.fileType === 'IMAGE' ? (
                                <div className="w-full h-full flex items-center justify-center p-4 bg-gray-900">
                                    <img
                                        src={viewingFile.fileUrl}
                                        alt={viewingFile.title}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full bg-gray-800 p-4 overflow-y-auto">
                                    {loadingPdf ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <i className="fas fa-spinner fa-spin text-4xl text-cyan-400 mb-4"></i>
                                                <p className="text-white">Loading PDF...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {pdfPages.length > 0 ? (
                                                pdfPages.map((page) => (
                                                    <img
                                                        key={page.pageNum}
                                                        src={page.imageData}
                                                        alt={`Page ${page.pageNum}`}
                                                        className="w-full rounded shadow-lg"
                                                        onContextMenu={(e) => e.preventDefault()}
                                                    />
                                                ))
                                            ) : (
                                                <div className="text-center text-gray-400 py-10">
                                                    <i className="fas fa-file-pdf text-6xl mb-4"></i>
                                                    <p>Failed to load PDF</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ChemSnaps;
