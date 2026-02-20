import { useNavigate } from 'react-router-dom';

const SelfLearnLanding = () => {
    const navigate = useNavigate();

    const exams = [
        {
            id: 'NEET',
            name: 'NEET',
            color: 'from-green-500 to-emerald-600',
            icon: 'fas fa-stethoscope',
            description: 'Comprehensive preparation for National Eligibility cum Entrance Test'
        },
        {
            id: 'JEE',
            name: 'JEE',
            color: 'from-blue-500 to-cyan-600',
            icon: 'fas fa-atom',
            description: 'Master Physics, Chemistry & Maths for Joint Entrance Examination'
        },
        {
            id: 'IAT_NEST',
            name: 'IAT/NEST',
            color: 'from-purple-500 to-pink-600',
            icon: 'fas fa-flask',
            description: 'Specialized coaching for IISER Aptitude Test & NEST'
        }
    ];

    const handleExamSelect = (examId) => {
        // Navigate directly to chapters page
        navigate(`/self-learn/${encodeURIComponent(examId)}`);
    };

    return (
        <div className="min-h-screen pt-32 pb-16 px-4 bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Self Learn Program
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Your personalized path to success. Choose your target exam and start learning at your own pace with curated video lectures, notes, and practice materials.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {exams.map((exam) => (
                        <div
                            key={exam.id}
                            onClick={() => handleExamSelect(exam.id)}
                            className="group relative bg-gray-800/50 hover:bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${exam.color} opacity-10 rounded-bl-full group-hover:scale-110 transition-transform duration-500`}></div>

                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${exam.color} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-${exam.color.split('-')[1]}-500/50 transition-all duration-300`}>
                                <i className={`${exam.icon} text-3xl text-white`}></i>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                                {exam.name}
                            </h3>

                            <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors">
                                {exam.description}
                            </p>

                            <div className="flex items-center text-cyan-400 font-semibold group-hover:translate-x-2 transition-transform">
                                <span>Start Learning</span>
                                <i className="fas fa-arrow-right ml-2 text-sm"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SelfLearnLanding;
