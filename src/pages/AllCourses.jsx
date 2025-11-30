import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/UI/CourseCard';
import { useData } from '../context/DataContext';

const AllCourses = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { courses } = useData();

  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(course => {
        // Check if categories array exists and includes the active tab
        if (course.categories && course.categories.length > 0) {
          return course.categories.includes(activeTab);
        }
        // Fallback to grade field for backward compatibility
        const grade = (course.grade || '').toLowerCase();
        if (activeTab === 'jee' && (grade.includes('jee') || grade.includes('11'))) return true;
        if (activeTab === 'neet' && (grade.includes('neet') || grade.includes('12'))) return true;
        if (activeTab === 'foundation' && (grade.includes('9') || grade.includes('10') || grade.includes('foundation'))) return true;
        return false;
      });

  const getTabClass = (tab) => `px-6 py-2 rounded-full border text-sm font-bold transition ${
    activeTab === tab 
      ? 'bg-cyan-900/50 border-cyan-500 text-white shadow-[0_0_15px_rgba(0,243,255,0.3)]' 
      : 'bg-glass-panel border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
  }`;

  return (
    <div className="animate-fadeIn">
       <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="flex items-center mb-8">
                <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
                    <i className="fas fa-arrow-left"></i> Back to Home
                </Link>
            </div>
            <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-4">All Classroom Programs</h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">Comprehensive chemistry solutions for every stage of your academic journey. From foundation to research level.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
                <button onClick={() => setActiveTab('all')} className={getTabClass('all')}>All Programs</button>
                <button onClick={() => setActiveTab('jee')} className={getTabClass('jee')}>JEE Mains/Adv</button>
                <button onClick={() => setActiveTab('neet')} className={getTabClass('neet')}>NEET Medical</button>
                <button onClick={() => setActiveTab('foundation')} className={getTabClass('foundation')}>Foundation (8-10)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCourses.map(course => (
                    <CourseCard key={course._id} course={course} />
                ))}
            </div>
        </div>
    </div>
  );
};

export default AllCourses;