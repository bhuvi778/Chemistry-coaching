import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Pagination from '../components/UI/Pagination';

const StudyMaterials = () => {
  const { studyMaterials } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const materialsPerPage = 15; // 3 rows × 5 columns

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedExam]);

  const safeMaterials = Array.isArray(studyMaterials) ? studyMaterials : [];
  const filteredMaterials = safeMaterials.filter(material => {
    const categoryMatch = selectedCategory === 'all' || material.category === selectedCategory;
    const examMatch = selectedExam === 'all' || material.examType === selectedExam;
    return categoryMatch && examMatch;
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exam Type Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">
                <i className="fas fa-graduation-cap mr-2 text-green-400"></i>
                Filter by Exam
              </label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-green-400 transition"
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
            </div>

            {/* Material Type Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">
                <i className="fas fa-book mr-2 text-blue-400"></i>
                Filter by Type
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-400 transition"
              >
                <option value="all">All Types</option>
                <optgroup label="General Categories">
                  <option value="Notes">Notes</option>
                  <option value="Handwritten Notes">Handwritten Notes</option>
                  <option value="Formula Sheets">Formula Sheets</option>
                  <option value="Revision Notes">Revision Notes</option>
                  <option value="Question Banks">Question Banks</option>
                  <option value="Practice Problems">Practice Problems</option>
                  <option value="Solutions">Solutions</option>
                  <option value="Previous Year Papers">Previous Year Papers</option>
                  <option value="Sample Papers">Sample Papers</option>
                  <option value="Mock Tests">Mock Tests</option>
                  <option value="Study Guides">Study Guides</option>
                  <option value="Reference Materials">Reference Materials</option>
                  <option value="Puzzle">Puzzle</option>
                </optgroup>
                <optgroup label="Chemistry Topics">
                  <option value="Physical Chemistry">Physical Chemistry</option>
                  <option value="Organic Chemistry">Organic Chemistry</option>
                  <option value="Inorganic Chemistry">Inorganic Chemistry</option>
                  <option value="Analytical Chemistry">Analytical Chemistry</option>
                  <option value="Biochemistry">Biochemistry</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedExam !== 'all' || selectedCategory !== 'all') && (
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-400">Active filters:</span>
              {selectedExam !== 'all' && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-2">
                  {selectedExam}
                  <button onClick={() => setSelectedExam('all')} className="hover:text-white">
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-2">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-white">
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedExam('all');
                  setSelectedCategory('all');
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
