import AIAssistant from '../components/UI/AIAssistant';

const AIAssistantPage = () => {
  return (
    <div className="min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Ask <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Ace2examz AI</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your 24/7 Chemistry Learning Assistant - Specialized in JEE & NEET Preparation
          </p>
        </div>

        <AIAssistant />

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-xl text-center">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-brain text-3xl text-cyan-400"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Learning</h3>
            <p className="text-gray-400">Trained on JEE & NEET chemistry patterns for accurate answers</p>
          </div>

          <div className="glass-panel p-6 rounded-xl text-center">
            <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-bolt text-3xl text-pink-400"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instant Response</h3>
            <p className="text-gray-400">Get immediate answers to your chemistry doubts anytime</p>
          </div>

          <div className="glass-panel p-6 rounded-xl text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-flask text-3xl text-purple-400"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Reaction Mechanisms</h3>
            <p className="text-gray-400">Step-by-step explanations of complex reactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
