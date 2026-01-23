import { Link } from 'react-router-dom';

const AIComparison = () => {
  const comparisonData = [
    {
      feature: "UPSC Syllabus coverage",
      icon: "fas fa-book-open",
      coachingInstitutes: true,
      chatGPT: false,
      prepiify: true
    },
    {
      feature: "24x7 Doubt Resolution",
      icon: "fas fa-question-circle",
      coachingInstitutes: false,
      chatGPT: false,
      chatGPTNote: "Not UPSC standard",
      prepiify: true
    },
    {
      feature: "Current Affairs coverage",
      icon: "fas fa-newspaper",
      coachingInstitutes: true,
      chatGPT: false,
      chatGPTNote: "Not UPSC standard",
      prepiify: true
    },
    {
      feature: "Practice - MCQs & PYQs",
      icon: "fas fa-clipboard-list",
      coachingInstitutes: "LIMITED",
      chatGPT: false,
      chatGPTNote: "Not UPSC standard",
      prepiify: "UNLIMITED"
    },
    {
      feature: "Progress Reports",
      icon: "fas fa-chart-line",
      coachingInstitutes: false,
      chatGPT: false,
      prepiify: true
    },
    {
      feature: "Pricing",
      icon: "fas fa-rupee-sign",
      coachingInstitutes: "₹11k per year",
      chatGPT: "ChatGPT Pro - ₹20K+ per year",
      prepiify: "₹5,699 IB Mains"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-white mb-4">
          Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Prepiify</span>?
        </h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Compare and see why Prepiify is the best AI assistant for your exam preparation
        </p>
      </div>

      {/* Comparison Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-gray-700">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 p-6 bg-gray-900/50 border-b border-gray-700">
          <div className="text-gray-400 font-semibold text-sm"></div>
          <div className="text-center">
            <div className="text-white font-bold text-lg mb-1">Coaching Institutes</div>
            <i className="fas fa-school text-gray-400 text-2xl"></i>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-lg mb-1 flex items-center justify-center gap-2">
              <i className="fas fa-robot text-purple-400"></i>
              ChatGPT
            </div>
          </div>
          <div className="text-center relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400 rounded-xl p-3">
              <div className="text-cyan-400 font-bold text-lg mb-1 flex items-center justify-center gap-2">
                <i className="fas fa-robot"></i>
                Prepiify
              </div>
              <div className="text-xs text-cyan-300 font-semibold">UNLIMITED</div>
            </div>
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-700">
          {comparisonData.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 p-6 hover:bg-gray-800/30 transition">
              {/* Feature Name */}
              <div className="flex items-center gap-3 text-white">
                <i className={`${item.icon} text-cyan-400`}></i>
                <span className="font-medium">{item.feature}</span>
              </div>

              {/* Coaching Institutes */}
              <div className="flex items-center justify-center">
                {typeof item.coachingInstitutes === 'boolean' ? (
                  item.coachingInstitutes ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <i className="fas fa-check text-green-400"></i>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <i className="fas fa-times text-red-400"></i>
                    </div>
                  )
                ) : (
                  <span className="text-gray-300 text-sm text-center">{item.coachingInstitutes}</span>
                )}
              </div>

              {/* ChatGPT */}
              <div className="flex items-center justify-center">
                {typeof item.chatGPT === 'boolean' ? (
                  item.chatGPT ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <i className="fas fa-check text-green-400"></i>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <i className="fas fa-times text-red-400"></i>
                      </div>
                      {item.chatGPTNote && (
                        <span className="text-xs text-gray-500 mt-1 text-center">{item.chatGPTNote}</span>
                      )}
                    </div>
                  )
                ) : (
                  <span className="text-gray-300 text-sm text-center">{item.chatGPT}</span>
                )}
              </div>

              {/* Prepiify */}
              <div className="flex items-center justify-center">
                {typeof item.prepiify === 'boolean' ? (
                  item.prepiify ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <i className="fas fa-check text-green-400"></i>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <i className="fas fa-times text-red-400"></i>
                    </div>
                  )
                ) : (
                  <span className="text-cyan-400 font-semibold text-sm text-center">{item.prepiify}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-12 text-center">
        <p className="text-gray-300 mb-6 text-lg">Experience the power of AI-driven learning!</p>
        <Link to="/ai-assistant">
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition transform hover:scale-105">
            <i className="fas fa-robot mr-2"></i>
            Try Prepiify Now
          </button>
        </Link>
      </div>
    </section>
  );
};

export default AIComparison;
