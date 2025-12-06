const WhyChooseUs = () => {
  const features = [
    {
      icon: "fa-chalkboard-teacher",
      title: "Real NTA Interface",
      description: "Experience the authentic NEET & JEE exam environment",
      color: "cyan"
    },
    {
      icon: "fa-flask",
      title: "Unique Teaching Methods",
      description: "Revolutionary 'Reaction Visualization' technique for better understanding",
      color: "pink"
    },
    {
      icon: "fa-trophy",
      title: "Proven Results",
      description: "140+ IIT selections and 240+ NEET selections since 2010",
      color: "yellow"
    },
    {
      icon: "fa-users",
      title: "Live Mentorship",
      description: "One-on-one mentor session every month",
      color: "green"
    },
    {
      icon: "fa-clock",
      title: "Flexible Timings",
      description: "Weekend & weekday batches available for dropper students",
      color: "purple"
    },
    {
      icon: "fa-video",
      title: "Hybrid Learning",
      description: "Offline classes + Online video lectures access",
      color: "blue"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-white mb-4">
          Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Ace2examz</span>?
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Join India's most trusted Chemistry coaching institute for JEE & NEET preparation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="group relative glass-panel p-8 rounded-2xl hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] cursor-pointer"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
            
            <div className="relative">
              <div className={`w-16 h-16 rounded-full bg-${feature.color}-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <i className={`fas ${feature.icon} text-3xl text-${feature.color}-400`}></i>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-20 glass-panel p-12 rounded-3xl border-l-4 border-cyan-400">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-pink-500 mb-2">140+</div>
            <div className="text-gray-400 uppercase text-sm tracking-wider">IIT Selections</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-cyan-400 mb-2">240+</div>
            <div className="text-gray-400 uppercase text-sm tracking-wider">NEET Selections</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-yellow-400 mb-2">15+</div>
            <div className="text-gray-400 uppercase text-sm tracking-wider">Years Experience</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-green-400 mb-2">5000+</div>
            <div className="text-gray-400 uppercase text-sm tracking-wider">Happy Students</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
