import { Link } from 'react-router-dom';

const AIComparison = () => {
  const reactionLabFeatures = [
    "Specialized in Chemistry for JEE & NEET",
    "Trained on NCERT + coaching materials",
    "Provides step-by-step reaction mechanisms",
    "Explains concepts with real exam examples",
    "24/7 doubt solving with instant responses",
    "Practice question generation with solutions"
  ];

  const otherAIFeatures = [
    "General purpose AI chatbots",
    "Not specialized in Chemistry",
    "Generic explanations without exam focus",
    "May provide incorrect reaction pathways",
    "Limited chemistry-specific knowledge",
    "No exam pattern understanding"
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-white mb-4">
          Ace2examz AI vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Other AI Chatbots</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          See why our AI assistant is the best choice for JEE & NEET Chemistry preparation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ace2examz AI */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
          
          <div className="relative glass-panel p-8 rounded-3xl border-2 border-cyan-400">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <i className="fas fa-robot text-3xl text-cyan-400"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Ace2examz AI</h3>
                <p className="text-cyan-400 text-sm">Chemistry-Specialized Assistant</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {reactionLabFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="fas fa-check text-green-400 text-sm"></i>
                  </div>
                  <p className="text-gray-300">{feature}</p>
                </div>
              ))}
            </div>

            <div className="glass-panel p-4 rounded-lg bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-400/30">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Accuracy Rate</span>
                <span className="text-2xl font-bold text-cyan-400">98%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" style={{width: '98%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Other AI Chatbots */}
        <div className="relative">
          <div className="glass-panel p-8 rounded-3xl border-2 border-gray-600 opacity-75">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center">
                <i className="fas fa-comments text-3xl text-gray-400"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Other AI Chatbots</h3>
                <p className="text-gray-400 text-sm">General Purpose Assistants</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {otherAIFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="fas fa-times text-red-400 text-sm"></i>
                  </div>
                  <p className="text-gray-400">{feature}</p>
                </div>
              ))}
            </div>

            <div className="glass-panel p-4 rounded-lg bg-gray-800/30 border border-gray-600/30">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Accuracy Rate</span>
                <span className="text-2xl font-bold text-gray-400">65%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-gray-500 rounded-full" style={{width: '65%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-300 mb-6 text-lg">Try our AI assistant and experience the difference!</p>
        <Link to="/ai-assistant">
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition transform hover:scale-105">
            <i className="fas fa-robot mr-2"></i>
            Ask Ace2examz AI Now
          </button>
        </Link>
      </div>
    </section>
  );
};

export default AIComparison;
