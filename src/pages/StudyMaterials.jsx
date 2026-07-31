import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Pagination from '../components/UI/Pagination';

const StudyMaterials = () => {
  const { studyMaterials, ensureStudyMaterialsLoaded } = useData();
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const materialsPerPage = 20; // 4 rows × 5 columns

  useEffect(() => { ensureStudyMaterialsLoaded(); }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedSubject, selectedType, searchQuery]);

  const safeMaterials = Array.isArray(studyMaterials) ? studyMaterials : [];
  const filteredMaterials = safeMaterials.filter(material => {
    // 1. Class filter matching logic
    let classMatch = true;
    if (selectedClass !== 'all') {
      const digit = selectedClass.match(/\d+/)?.[0];
      if (digit) {
        const romanMap = { '6': 'vi', '7': 'vii', '8': 'viii', '9': 'ix', '10': 'x', '11': 'xi', '12': 'xii' };
        const roman = romanMap[digit];
        const searchTerms = [
          `class ${digit}`, `class-${digit}`, `grade ${digit}`, `grade-${digit}`,
          `class ${roman}`, `class-${roman}`, `grade ${roman}`, `grade-${roman}`
        ];
        const textToSearch = `${material.title} ${material.description || ''} ${material.category || ''}`.toLowerCase();
        classMatch = searchTerms.some(term => {
          const regex = new RegExp(`\\b${term}\\b`, 'i');
          return regex.test(textToSearch);
        });
      }
    }

    // 2. Subject filter matching logic
    let subjectMatch = true;
    if (selectedSubject !== 'all') {
      const subjLower = selectedSubject.toLowerCase();
      const textToSearch = `${material.title} ${material.description || ''} ${material.category || ''}`.toLowerCase();
      let searchTerms = [subjLower];
      if (subjLower === 'mathematics') searchTerms.push('math', 'maths');
      if (subjLower === 'biology') searchTerms.push('bio');
      subjectMatch = searchTerms.some(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'i');
        return regex.test(textToSearch);
      });
    }

    // 3. Type filter matching logic
    let typeMatch = true;
    if (selectedType !== 'all') {
      const textToSearch = `${material.title} ${material.description || ''} ${material.category || ''}`.toLowerCase();
      if (selectedType === 'Notes') {
        typeMatch = textToSearch.includes('notes');
      } else if (selectedType === 'NCERT Books') {
        typeMatch = textToSearch.includes('ncert') || textToSearch.includes('textbook') || textToSearch.includes('exemplar');
      } else if (selectedType === 'PYPs') {
        typeMatch = textToSearch.includes('pyp') || textToSearch.includes('previous year') || textToSearch.includes('pyq') || textToSearch.includes('paper') || textToSearch.includes('pstet');
      }
    }

    // 4. Typing (Search) filter matching logic
    let searchMatch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const textToSearch = `${material.title} ${material.description || ''}`.toLowerCase();
      searchMatch = textToSearch.includes(q);
    }

    return classMatch && subjectMatch && typeMatch && searchMatch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredMaterials.length / materialsPerPage);
  const indexOfLastMaterial = currentPage * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterials = filteredMaterials.slice(indexOfFirstMaterial, indexOfLastMaterial);

  return (
    <div className="animate-fadeIn min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center mb-8">
          <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            <i className="fas fa-file-pdf mr-3"></i>
            Free Study Materials
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Download free notes, question banks, and previous year papers
          </p>
        </div>

        {/* Filters */}
        <div className="glass-panel rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <i className="fas fa-filter text-green-400"></i>
            Filter Study Materials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* By Class Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">
                <i className="fas fa-graduation-cap mr-2 text-green-400"></i>
                By Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-green-400 transition"
              >
                <option value="all">All Classes</option>
                {Array.from({ length: 7 }, (_, i) => 6 + i).map(num => (
                  <option key={num} value={`Class ${num}`}>{`Class ${num}`}</option>
                ))}
              </select>
            </div>

            {/* By Subject Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">
                <i className="fas fa-atom mr-2 text-blue-400"></i>
                By Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-400 transition"
              >
                <option value="all">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
              </select>
            </div>

            {/* By Type Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">
                <i className="fas fa-book mr-2 text-purple-400"></i>
                By Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-purple-400 transition"
              >
                <option value="all">All Types</option>
                <option value="Notes">Notes</option>
                <option value="NCERT Books">NCERT Books</option>
                <option value="PYPs">PYPs</option>
              </select>
            </div>

            {/* By Typing Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">
                <i className="fas fa-search mr-2 text-amber-400"></i>
                By Typing
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes, books..."
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedClass !== 'all' || selectedSubject !== 'all' || selectedType !== 'all' || searchQuery !== '') && (
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-400">Active filters:</span>
              {selectedClass !== 'all' && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-2">
                  {selectedClass}
                  <button onClick={() => setSelectedClass('all')} className="hover:text-white">
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
              {selectedType !== 'all' && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-2">
                  {selectedType}
                  <button onClick={() => setSelectedType('all')} className="hover:text-white">
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm flex items-center gap-2">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-white">
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedClass('all');
                  setSelectedSubject('all');
                  setSelectedType('all');
                  setSearchQuery('');
                }}
                className="text-sm text-gray-400 hover:text-white underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Study Materials Grid */}
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl">
            <i className="fas fa-file-pdf text-6xl text-gray-600 mb-4"></i>
            <h3 className="text-2xl font-bold text-white mb-2">No Study Materials Found</h3>
            <p className="text-gray-400">Study materials will be available soon!</p>
          </div>
        ) : (
          <>
            {/* Pagination Info */}
            <div className="mb-6 flex justify-between items-center">
              <div className="text-gray-400">
                <i className="fas fa-file-pdf mr-2"></i>
                Showing {indexOfFirstMaterial + 1}-{Math.min(indexOfLastMaterial, filteredMaterials.length)} of {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materials'}
              </div>
              {totalPages > 1 && (
                <div className="text-gray-400 text-sm">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {currentMaterials.map((material) => (
                <div key={material._id} className="glass-panel rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-300">
                  {material.thumbnailUrl && (
                    <div className="w-full aspect-[1/1.414] overflow-hidden">
                      <img
                        src={material.thumbnailUrl}
                        alt={material.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white flex-1">{material.title}</h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        {material.fileType}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{material.description}</p>
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        {material.category}
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                        {material.examType}
                      </span>
                    </div>
                    {material.fileSize && (
                      <p className="text-gray-500 text-sm mb-4">
                        <i className="fas fa-file mr-2"></i>
                        Size: {material.fileSize}
                      </p>
                    )}
                    <button
                      onClick={() => {
                        if (material.fileUrl) {
                          try {
                            // Handle base64 data URLs
                            const link = document.createElement('a');
                            link.href = material.fileUrl;

                            // Generate filename with proper extension
                            const extension = material.fileType === 'PDF' ? 'pdf' :
                              material.fileType === 'DOC' || material.fileType === 'DOCX' ? 'docx' :
                                material.fileType === 'PPT' || material.fileType === 'PPTX' ? 'pptx' :
                                  material.fileType === 'ZIP' ? 'zip' : 'pdf';

                            link.download = `${material.title.replace(/[^a-z0-9]/gi, '_')}.${extension}`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } catch (error) {
                            console.error('Download error:', error);
                            // Fallback: open in new tab
                            window.open(material.fileUrl, '_blank');
                          }
                        }
                      }}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition font-semibold"
                    >
                      <i className="fas fa-download"></i>
                      Download Free
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
    </div>
  );
};

export default StudyMaterials;
