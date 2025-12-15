import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const StudyMaterials = () => {
  const { studyMaterials } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');

  const filteredMaterials = studyMaterials.filter(material => {
    const categoryMatch = selectedCategory === 'all' || material.category === selectedCategory;
    const examMatch = selectedExam === 'all' || material.examType === selectedExam;
    return categoryMatch && examMatch;
  });

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
        <div className="mb-8 space-y-4">
          <div>
            <h3 className="text-white font-semibold mb-3">Filter by Exam:</h3>
            <div className="flex gap-3 flex-wrap">
              {['all', 'JEE', 'NEET','IAT','NEST','CSIR NEET','IIT JAM','TIFR','BITSAT', 'GATE','CUET UG'].map(exam => (
                <button 
                  key={exam}
                  onClick={() => setSelectedExam(exam)}
                  className={`px-6 py-2 rounded-full transition ${
                    selectedExam === exam 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {exam === 'all' ? 'All Exams' : exam}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Filter by Type:</h3>
            <div className="flex gap-3 flex-wrap">
              {['all','NCERT Books','NCERT Solutions','Syllabus','Sample Papers', 'Notes', 'Important Question', 'Previous Year Questions','Formulas','Practice papers','Concept Wise Notes','Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry','Spectroscopy'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full transition ${
                    selectedCategory === cat 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {cat === 'all' ? 'All Types' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Study Materials Grid */}
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl">
            <i className="fas fa-file-pdf text-6xl text-gray-600 mb-4"></i>
            <h3 className="text-2xl font-bold text-white mb-2">No Study Materials Found</h3>
            <p className="text-gray-400">Study materials will be available soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <div key={material._id} className="glass-panel rounded-xl p-6 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-300">
                {material.thumbnailUrl && (
                  <img 
                    src={material.thumbnailUrl} 
                    alt={material.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
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
                <a 
                  href={material.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  download
                  className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition font-semibold"
                >
                  <i className="fas fa-download"></i>
                  Download Free
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterials;
