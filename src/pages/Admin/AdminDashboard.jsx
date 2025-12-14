import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import ManageCourses from './ManageCourses';
import ManageVideos from './ManageVideos';
import ManageAudioBooks from './ManageAudioBooks';
import ManageStudyMaterials from './ManageStudyMaterials';
import ManageMagazines from './ManageMagazines';
import Enquiries from './Enquiries';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const { logout } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition">
          Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="glass-panel rounded-xl p-4 space-y-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full text-left px-4 py-3 rounded transition ${activeTab === 'courses' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <i className="fas fa-book mr-2"></i> Manage Courses
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`w-full text-left px-4 py-3 rounded transition ${activeTab === 'videos' ? 'bg-red-600 text-white font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <i className="fab fa-youtube mr-2"></i> Manage Videos
            </button>
            <button
              onClick={() => setActiveTab('audiobooks')}
              className={`w-full text-left px-4 py-3 rounded transition ${activeTab === 'audiobooks' ? 'bg-purple-500 text-white font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <i className="fas fa-headphones mr-2"></i> Manage Audio Books
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`w-full text-left px-4 py-3 rounded transition ${activeTab === 'materials' ? 'bg-green-500 text-white font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <i className="fas fa-file-pdf mr-2"></i> Manage Study Materials
            </button>
            <button
              onClick={() => setActiveTab('magazines')}
              className={`w-full text-left px-4 py-3 rounded transition ${activeTab === 'magazines' ? 'bg-pink-500 text-white font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <i className="fas fa-book-open mr-2"></i> Manage Magazines
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full text-left px-4 py-3 rounded transition ${activeTab === 'enquiries' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <i className="fas fa-envelope mr-2"></i> Enquiries & Contacts
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          {activeTab === 'courses' && <ManageCourses />}
          {activeTab === 'videos' && <ManageVideos />}
          {activeTab === 'audiobooks' && <ManageAudioBooks />}
          {activeTab === 'materials' && <ManageStudyMaterials />}
          {activeTab === 'magazines' && <ManageMagazines />}
          {activeTab === 'enquiries' && <Enquiries />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;