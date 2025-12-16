import React, { useState } from 'react';
import EnquiryModal from './EnquiryModal';

const CourseCard = ({ course }) => {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const colorMap = {
    pink: 'text-pink-500 border-pink-500',
    cyan: 'text-cyan-400 border-cyan-400',
    purple: 'text-purple-500 border-purple-500',
    green: 'text-green-500 border-green-500',
    yellow: 'text-yellow-500 border-yellow-500',
    blue: 'text-blue-500 border-blue-500',
    red: 'text-red-500 border-red-500',
    indigo: 'text-indigo-500 border-indigo-500',
  };

  const theme = colorMap[course.color] || colorMap.cyan;
  const [textColor, borderColor] = theme.split(' ');
  const bgColor = borderColor.replace('border-', 'bg-');

  return (
    <>
      <div className={`glass-panel rounded-2xl p-6 relative overflow-hidden group border-t-4 ${borderColor} flex flex-col h-full transition transform hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]`}>
        {course.badge && (
          <span className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold badge-pulse">
            {course.badge}
          </span>
        )}

        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition`}>
          <i className={`fas ${course.icon} text-9xl ${textColor}`}></i>
        </div>

        <h3 className="text-2xl font-bold mb-1 text-white">{course.title}</h3>
        <p className={`${textColor} font-bold text-sm mb-4`}>{course.subtitle}</p>
        <p className="text-gray-400 mb-6 text-sm flex-grow">{course.desc}</p>

        <ul className="text-sm text-gray-400 mb-6 space-y-2">
          {course.features.map((f, idx) => (
            <li key={idx}><i className="fas fa-check text-green-500 mr-2"></i> {f}</li>
          ))}
        </ul>

        <div className="mt-auto flex gap-3">
          <button
            onClick={() => setIsEnquiryOpen(true)}
            className={`flex-1 py-2 rounded border ${borderColor} ${textColor} hover:bg-white hover:text-black transition font-bold text-sm`}
          >
            Enquire
          </button>
          <a
            href="https://www.ace2examz.in/courses"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 py-2 rounded border ${borderColor} ${textColor} hover:bg-white hover:text-black transition font-bold text-sm text-center flex items-center justify-center`}
          >
            Buy Now
          </a>
        </div>
      </div>

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        course={course}
      />
    </>
  );
};

export default CourseCard;