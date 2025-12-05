const TeacherVideos = () => {
  const videos = [
    {
      title: "Organic Chemistry - Complete Basics",
      description: "Master the fundamentals of organic chemistry with our expert faculty",
      youtubeId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
      instructor: "Dr. Rajesh Kumar"
    },
    {
      title: "Physical Chemistry - Thermodynamics",
      description: "In-depth explanation of thermodynamics concepts for JEE/NEET",
      youtubeId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
      instructor: "Prof. Priya Sharma"
    },
    {
      title: "Inorganic Chemistry - Periodic Table",
      description: "Complete periodic table trends and properties explained",
      youtubeId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
      instructor: "Dr. Amit Singh"
    },
    {
      title: "Chemical Bonding - Advanced Concepts",
      description: "Understanding chemical bonding for competitive exams",
      youtubeId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
      instructor: "Prof. Neha Verma"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-white mb-4">
          Learn From <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">The Best</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore the concepts with India's most experienced Teachers!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((video, index) => (
          <div 
            key={index}
            className="group glass-panel rounded-2xl overflow-hidden hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] transition-all duration-300 cursor-pointer"
          >
            {/* YouTube Thumbnail with Play Button */}
            <div className="relative aspect-video bg-gray-900">
              <img 
                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                }}
              />
              {/* Play Button Overlay */}
              <a 
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all"
              >
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <i className="fas fa-play text-white text-xl ml-1"></i>
                </div>
              </a>
            </div>

            {/* Video Info */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{video.title}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{video.description}</p>
              <div className="flex items-center gap-2 text-cyan-400 text-xs">
                <i className="fas fa-chalkboard-teacher"></i>
                <span>{video.instructor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <a 
          href="https://www.youtube.com/@YourChannelName" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-all transform hover:scale-105"
        >
          <i className="fab fa-youtube text-2xl"></i>
          View All Videos on YouTube
        </a>
      </div>
    </section>
  );
};

export default TeacherVideos;
