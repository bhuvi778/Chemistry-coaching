import { useParams, useNavigate } from 'react-router-dom';

const SelfLearnSubjects = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const subjects = [
        {
            id: 'Physical Chemistry',
            name: 'Physical Chemistry',
            icon: 'fas fa-atom',
            color: 'from-blue-500 to-indigo-600',
            description: 'Master the principles of thermodynamics, kinetics, electrochemistry, and more.'
        },
        {
            id: 'Inorganic Chemistry',
            name: 'Inorganic Chemistry',
            icon: 'fas fa-flask',
            color: 'from-green-500 to-teal-600',
            description: 'Explore periodicity, coordination chemistry, and element properties.'
        },
        {
            id: 'Organic Chemistry',
            name: 'Organic Chemistry',
            icon: 'fas fa-vector-square',
            color: 'from-purple-500 to-pink-600',
            description: 'Understand reaction mechanisms, synthesis, and organic compounds.'
        },
        {
            id: 'Practical',
            name: 'Practical',
            icon: 'fas fa-vial',
            color: 'from-yellow-500 to-orange-600',
            description: 'Learn qualitative and quantitative analysis techniques.'
        }
    ];

    const handleSubjectSelect = (subject) => {
        // Encode the subject name for safe URL usage
        navigate(`/self-learn/${encodeURIComponent(examId)}/${encodeURIComponent(subject)}`);
    };

    return (
        <div className="min-h-screen pt-32 pb-16 px-4 bg-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb / Back Button */}
                <button
                    onClick={() => navigate('/self-learn')}
                    className="mb-8 flex items-center text-gray-400 hover:text-white transition group"
                >
                    <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
                    Back to Exam Selection
                </button>

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Choose Your Subject
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Select a Chemistry branch to view chapter-wise content for <span className="text-cyan-400 font-bold">{decodeURIComponent(examId)}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {subjects.map((subject) => (
                        <div
                            key={subject.id}
                            onClick={() => handleSubjectSelect(subject.id)}
                            className="bg-gray-800/50 hover:bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden group"
                        >
                            <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full bg-gradient-to-br ${subject.color} opacity-10 blur-xl group-hover:scale-150 transition-transform duration-500`}></div>

                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center mb-6 shadow-lg relative z-10`}>
                                <i className={`${subject.icon} text-2xl text-white`}></i>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors relative z-10">
                                {subject.name}
                            </h3>

                            <p className="text-sm text-gray-400 mb-6 group-hover:text-gray-300 transition-colors relative z-10 min-h-[40px]">
                                {subject.description}
                            </p>

                            <div className="flex items-center text-cyan-400 font-semibold text-sm group-hover:translate-x-1 transition-transform relative z-10">
                                <span>Explore Chapters</span>
                                <i className="fas fa-chevron-right ml-2 text-xs"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SelfLearnSubjects;
