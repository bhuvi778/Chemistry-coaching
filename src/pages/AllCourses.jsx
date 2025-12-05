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
        return false;
      });

  const getTabClass = (tab) => `px-6 py-3 rounded-lg border text-sm font-bold transition ${
    activeTab === tab 
      ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_0_15px_rgba(0,243,255,0.3)]' 
      : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:text-white hover:border-cyan-400'
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
                <h2 className="text-5xl font-bold mb-4">All Programs & Services</h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">Choose from our comprehensive range of learning solutions tailored to your needs - from live classes to personalized mentorship.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-12">
                <button onClick={() => setActiveTab('all')} className={getTabClass('all')}>
                    <i className="fas fa-th-large block mb-1"></i>
                    All Programs
                </button>
                <button onClick={() => setActiveTab('live-batch')} className={getTabClass('live-batch')}>
                    <i className="fas fa-video block mb-1"></i>
                    Live Batch
                </button>
                <button onClick={() => setActiveTab('recorded')} className={getTabClass('recorded')}>
                    <i className="fas fa-play-circle block mb-1"></i>
                    Recorded Courses
                </button>
                <button onClick={() => setActiveTab('1-1-tutoring')} className={getTabClass('1-1-tutoring')}>
                    <i className="fas fa-user-friends block mb-1"></i>
                    1-1 Tutoring
                </button>
                <button onClick={() => setActiveTab('mentorship')} className={getTabClass('mentorship')}>
                    <i className="fas fa-chalkboard-teacher block mb-1"></i>
                    Mentorship
                </button>
                <button onClick={() => setActiveTab('doubt-solver')} className={getTabClass('doubt-solver')}>
                    <i className="fas fa-question-circle block mb-1"></i>
                    Doubt Solver
                </button>
                <button onClick={() => setActiveTab('test-series')} className={getTabClass('test-series')}>
                    <i className="fas fa-clipboard-check block mb-1"></i>
                    Test Series
                </button>
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