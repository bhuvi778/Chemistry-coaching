import { useState } from 'react';

const AIAssistant = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="glass-panel rounded-3xl p-8 md:p-12 border border-cyan-400/20 relative overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-purple-600/20 via-cyan-500/10 to-transparent blur-3xl -z-10"></div>
        
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 backdrop-blur-sm">
            <i className="fas fa-star text-yellow-400"></i>
            <span className="text-yellow-400 text-sm font-medium">AI-Powered Learning Assistant</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500">
              Ask Ace2examz AI
            </span>
          </h2>
          <p className="text-gray-400 text-sm">Your Personal Chemistry Learning Assistant</p>
        </div>

        {/* Description */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <p className="text-gray-300 text-lg mb-2">
            Get instant chemistry doubt clearing and concept explanations
          </p>
          <p className="text-gray-400">
            Perfect for{' '}
            <span className="text-blue-400 font-semibold">CBSE Board</span>,{' '}
            <span className="text-pink-400 font-semibold">NEET Medical</span>,{' '}
            <span className="text-cyan-400 font-semibold">JEE Mains & Advanced</span>
            {' '}preparation.
          </p>
        </div>

        {/* Frillbot Chatbot Iframe */}
        <div className="flex justify-center max-w-4xl mx-auto">
          <div className="relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative w-full">
              <iframe
                allow="microphone"
                src="https://bot.frillbot.com/chatbot-iframe/09ab53ae7eec4078b03364a594c688af"
                id="chatbot-iframe"
                className="rounded-2xl shadow-2xl w-full min-w-[320px]"
                style={{ border: '1px solid #374151', minHeight: '600px' }}
                height="600px"
                frameBorder="0"
                title="Ace2examz AI Assistant"
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto">
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-cyan-900/30 to-transparent border border-cyan-400/20 backdrop-blur-sm hover:border-cyan-400/40 transition group">
            <i className="fas fa-bolt text-cyan-400 text-2xl mb-2 group-hover:scale-110 transition"></i>
            <p className="text-gray-300 text-sm font-medium">Course Info</p>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-pink-900/30 to-transparent border border-pink-400/20 backdrop-blur-sm hover:border-pink-400/40 transition group">
            <i className="fas fa-chalkboard-teacher text-pink-400 text-2xl mb-2 group-hover:scale-110 transition"></i>
            <p className="text-gray-300 text-sm font-medium">Doubt Solving</p>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-900/30 to-transparent border border-purple-400/20 backdrop-blur-sm hover:border-purple-400/40 transition group">
            <i className="fas fa-clock text-purple-400 text-2xl mb-2 group-hover:scale-110 transition"></i>
            <p className="text-gray-300 text-sm font-medium">24/7 Support</p>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-900/30 to-transparent border border-yellow-400/20 backdrop-blur-sm hover:border-yellow-400/40 transition group">
            <i className="fas fa-info-circle text-yellow-400 text-2xl mb-2 group-hover:scale-110 transition"></i>
            <p className="text-gray-300 text-sm font-medium">Admission Help</p>
          </div>
        </div>
      </div>

      {/* Popular Questions Section */}
      <PopularQuestions />
    </section>
  );
};

const PopularQuestions = () => {
  const [openCategory, setOpenCategory] = useState(null);

  const categories = [
    {
      id: 1,
      icon: '📚',
      title: 'Board Exam Strategy & Study Planning',
      count: 11,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-400/30',
      questions: [
        'How to prepare for CBSE Board exams alongside JEE/NEET?',
        'Best study schedule for Class 11 and 12 chemistry',
        'How to balance board and competitive exam preparation?',
        'Time management tips for chemistry revision'
      ]
    },
    {
      id: 2,
      icon: '🧪',
      title: 'Chemistry (Board + JEE/NEET Focus)',
      count: 18,
      color: 'from-cyan-500 to-teal-500',
      borderColor: 'border-cyan-400/30',
      questions: [
        'What topics are most important for JEE Chemistry?',
        'How to master Organic Chemistry reactions?',
        'Physical Chemistry numerical problem-solving tips',
        'Inorganic Chemistry memorization techniques'
      ]
    },
    {
      id: 3,
      icon: '💪',
      title: 'Motivation, Focus & Productivity',
      count: 7,
      color: 'from-yellow-500 to-orange-500',
      borderColor: 'border-yellow-400/30',
      questions: [
        'How to stay motivated during long-term preparation?',
        'Dealing with exam stress and anxiety',
        'How to avoid distractions while studying?',
        'Building consistent study habits'
      ]
    },
    {
      id: 4,
      icon: '🎯',
      title: 'Career Guidance & Future Planning',
      count: 11,
      color: 'from-pink-500 to-rose-500',
      borderColor: 'border-pink-400/30',
      questions: [
        'Career options after clearing JEE/NEET',
        'Which engineering branch is best for me?',
        'Medical vs Engineering - how to decide?',
        'What are the job prospects after MBBS/B.Tech?'
      ]
    }
  ];

  const toggleCategory = (id) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/30">
          <i className="fas fa-book text-purple-400 text-xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-white">Popular Questions</h3>
      </div>

      {/* Helpful Tips */}
      <div className="glass-panel rounded-xl p-6 mb-6 border-l-4 border-blue-500">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <i className="fas fa-info-circle text-blue-400 text-xl"></i>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Helpful Tips</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Provide a <span className="text-cyan-400 font-semibold">specific question</span> related to any topic in Chemistry or courses, ask one question at a time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Add <span className="text-cyan-400 font-semibold">context</span> - mention the chapter name, topic, or question source if possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>You may also ask specific questions related to <span className="text-cyan-400 font-semibold">career pathways</span> and suitable course options after Class 12</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="glass-panel rounded-xl border border-gray-800 overflow-hidden transition-all duration-300 hover:border-gray-700"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full p-5 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`text-3xl bg-gradient-to-r ${category.color} bg-clip-text`}>
                  {category.icon}
                </div>
                <div className="text-left">
                  <h4 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition">
                    {category.title}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${category.color} bg-opacity-20 text-white text-sm font-semibold border ${category.borderColor}`}>
                  {category.count}
                </span>
                <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${openCategory === category.id ? 'rotate-180' : ''}`}></i>
              </div>
            </button>

            {/* Expanded Content */}
            {openCategory === category.id && (
              <div className="px-5 pb-5 border-t border-gray-800 pt-4 animate-fadeIn">
                <div className="space-y-3">
                  {category.questions.map((question, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-cyan-400/30 transition group cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <i className="fas fa-question-circle text-cyan-400 mt-1 group-hover:scale-110 transition"></i>
                        <p className="text-gray-300 group-hover:text-white transition flex-1">
                          {question}
                        </p>
                        <i className="fas fa-arrow-right text-gray-600 group-hover:text-cyan-400 transition opacity-0 group-hover:opacity-100"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIAssistant;
