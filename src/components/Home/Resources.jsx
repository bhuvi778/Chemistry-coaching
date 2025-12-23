import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Resources = () => {
  const [showAllResources, setShowAllResources] = useState(false);
  const { isDark } = useTheme();

  const allResources = [
    {
      title: "Study Notes",
      icon: "fa-file-alt",
      items: ["Chapter-wise Notes", "Formula Sheets", "Reaction Mechanisms", "Shortcut Tricks"],
      color: "cyan",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500"
    },
    {
      title: "Practice Materials",
      icon: "fa-pen",
      items: ["Daily Practice Papers", "Previous Year Questions", "Mock Tests", "Topic-wise Tests"],
      color: "pink",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500",
      appLink: "https://play.google.com/store/apps/details?id=com.ace2examzapp.android" // Add your actual app link here
    },
    {
      title: "Video Lectures",
      icon: "fa-play-circle",
      items: ["Concept Videos", "Problem Solving", "Revision Sessions", "Doubt Clearing"],
      color: "purple",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500",
      lecturesLink: "/lectures", // Internal link to lectures page
      notesLink: "/study-materials" // Link to class notes
    },
    {
      title: "Test Series",
      icon: "fa-clipboard-check",
      items: ["Chapter-wise Tests", "Full Syllabus Tests", "All India Test Series", "Previous Year Papers"],
      color: "yellow",
      image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500",
      appLink: "https://play.google.com/store/apps/details?id=com.ace2examzapp.android" // App link for test series
    },
    {
      title: "Solved Examples",
      icon: "fa-book-open",
      items: ["JEE Main Solutions", "JEE Advanced Solutions", "NEET Solutions", "Olympiad Problems"],
      color: "green",
      image: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=500"
    },
    {
      title: "Quick Revision",
      icon: "fa-bolt",
      items: ["Mind Maps", "One-liners", "Important Reactions", "Error Log Templates"],
      color: "orange",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500",
      magazinesLink: "/magazines" // Link to magazines page
    }
  ];

  const resources = showAllResources ? allResources : allResources.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-purple-900/10 to-transparent -z-10 blur-3xl"></div>

      <div className="text-center mb-16">
        <h2 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Resources & Notes</span>
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Comprehensive study materials designed by expert faculty to help you ace JEE & NEET
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {resources.map((resource, index) => (
          <div
            key={index}
            className={`group relative rounded-2xl transition-all duration-300 overflow-hidden ${isDark
              ? 'glass-panel hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]'
              : 'bg-white shadow-lg hover:shadow-2xl border border-gray-200'
              }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
              <img
                src={resource.image}
                alt={resource.title}
                className={`w-full h-full object-cover transition-opacity ${isDark ? 'opacity-20 group-hover:opacity-30' : 'opacity-10 group-hover:opacity-15'
                  }`}
              />
              <div className={`absolute inset-0 ${isDark
                ? 'bg-gradient-to-b from-black/60 via-black/80 to-black/95'
                : 'bg-gradient-to-b from-white/80 via-white/90 to-white/95'
                }`}></div>
            </div>

            {/* Content */}
            <div className="relative p-8 min-h-[420px] flex flex-col">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                resource.color === 'cyan' ? 'bg-cyan-500/20' :
                resource.color === 'pink' ? 'bg-pink-500/20' :
                resource.color === 'purple' ? 'bg-purple-500/20' :
                resource.color === 'yellow' ? 'bg-yellow-500/20' :
                resource.color === 'green' ? 'bg-green-500/20' :
                'bg-orange-500/20'
              }`}>
                <i className={`fas ${resource.icon} text-2xl ${
                  resource.color === 'cyan' ? 'text-cyan-400' :
                  resource.color === 'pink' ? 'text-pink-400' :
                  resource.color === 'purple' ? 'text-purple-400' :
                  resource.color === 'yellow' ? 'text-yellow-400' :
                  resource.color === 'green' ? 'text-green-400' :
                  'text-orange-400'
                }`}></i>
              </div>

              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{resource.title}</h3>

              <ul className="space-y-3 flex-grow">
                {resource.items.map((item, idx) => (
                  <li key={idx} className={`flex items-start ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    <i className={`fas fa-check-circle mr-3 mt-1 flex-shrink-0 ${
                      resource.color === 'cyan' ? 'text-cyan-400' :
                      resource.color === 'pink' ? 'text-pink-400' :
                      resource.color === 'purple' ? 'text-purple-400' :
                      resource.color === 'yellow' ? 'text-yellow-400' :
                      resource.color === 'green' ? 'text-green-400' :
                      'text-orange-400'
                    }`}></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {resource.appLink ? (
                <a
                  href={resource.appLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 px-6 py-3 rounded-lg transition font-bold w-full block text-center ${
                    resource.color === 'pink' 
                      ? 'bg-pink-500/20 border border-pink-400 text-pink-400 hover:bg-pink-500 hover:text-black'
                      : 'bg-yellow-500/20 border border-yellow-400 text-yellow-400 hover:bg-yellow-500 hover:text-black'
                  }`}
                >
                  <i className="fas fa-mobile-alt mr-2"></i>
                  {resource.title === 'Test Series' ? 'Test Now' : 'Practice Now'}
                </a>
              ) : resource.lecturesLink ? (
                <div className="space-y-3 mt-6">
                  <Link
                    to={resource.lecturesLink}
                    className="px-6 py-3 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-black transition font-bold w-full block text-center"
                  >
                    <i className="fab fa-youtube mr-2"></i>
                    Watch Videos Now
                  </Link>
                  {resource.notesLink && (
                    <Link
                      to={resource.notesLink}
                      className="px-6 py-3 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-black transition font-bold w-full block text-center"
                    >
                      <i className="fas fa-sticky-note mr-2"></i>
                      Class Notes
                    </Link>
                  )}
                </div>
              ) : resource.magazinesLink ? (
                <Link
                  to={resource.magazinesLink}
                  className="mt-6 px-6 py-3 bg-orange-500/20 border border-orange-400 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-black transition font-bold w-full block text-center"
                >
                  <i className="fas fa-book-reader mr-2"></i>
                  View Magazines
                </Link>
              ) : (
                <Link
                  to="/study-materials"
                  className={`mt-6 px-6 py-3 rounded-lg transition font-bold w-full block text-center ${
                    resource.color === 'cyan'
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-black'
                      : 'bg-green-500/20 border border-green-400 text-green-400 hover:bg-green-500 hover:text-black'
                  }`}
                >
                  <i className="fas fa-download mr-2"></i>
                  Download Free Sample
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {!showAllResources && (
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Access all premium study materials with course enrollment</p>
          <button
            onClick={() => setShowAllResources(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition transform hover:scale-105"
          >
            <i className="fas fa-chevron-down mr-2"></i>
            View All {allResources.length} Resources
          </button>
        </div>
      )}

      {showAllResources && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowAllResources(false)}
            className="px-8 py-4 border-2 border-purple-400 text-purple-400 font-bold rounded-lg hover:bg-purple-400 hover:text-black transition"
          >
            <i className="fas fa-chevron-up mr-2"></i>
            Show Less
          </button>
        </div>
      )}
    </section>
  );
};

export default Resources;
