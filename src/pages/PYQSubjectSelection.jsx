import { useParams, useNavigate } from 'react-router-dom';

const PYQSubjectSelection = () => {
    const { examName } = useParams();
    const navigate = useNavigate();

    // Define subjects based on exam
    const getSubjects = () => {
        if (examName === 'neet') {
            return [
                {
                    name: 'Physics',
                    icon: 'fa-atom',
                    color: 'from-blue-500 to-cyan-500',
                    bgColor: 'bg-blue-500/10',
                    borderColor: 'border-blue-500/30',
                    description: 'Mechanics, Thermodynamics, Optics, and more'
                },
                {
                    name: 'Chemistry',
                    icon: 'fa-flask',
                    color: 'from-green-500 to-emerald-500',
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/30',
                    description: 'Organic, Inorganic, and Physical Chemistry'
                },
                {
                    name: 'Biology',
                    icon: 'fa-microscope',
                    color: 'from-purple-500 to-pink-500',
                    bgColor: 'bg-purple-500/10',
                    borderColor: 'border-purple-500/30',
                    description: 'Botany and Zoology'
                }
            ];
        } else {
            // For JEE Main, JEE Advanced, BITSAT, NEST, IAT
            return [
                {
                    name: 'Physics',
                    icon: 'fa-atom',
                    color: 'from-blue-500 to-cyan-500',
                    bgColor: 'bg-blue-500/10',
                    borderColor: 'border-blue-500/30',
                    description: 'Mechanics, Thermodynamics, Optics, and more'
                },
                {
                    name: 'Chemistry',
                    icon: 'fa-flask',
                    color: 'from-green-500 to-emerald-500',
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/30',
                    description: 'Organic, Inorganic, and Physical Chemistry'
                },
                {
                    name: 'Mathematics',
                    icon: 'fa-calculator',
                    color: 'from-orange-500 to-red-500',
                    bgColor: 'bg-orange-500/10',
                    borderColor: 'border-orange-500/30',
                    description: 'Algebra, Calculus, Geometry, and more'
                }
            ];
        }
    };

    const subjects = getSubjects();
    const examDisplayName = examName?.replace(/-/g, ' ').toUpperCase() || '';

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="relative z-10 pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/pyq')}
                        className="text-gray-400 hover:text-cyan-400 transition mb-6 flex items-center gap-2"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Back to Exam Selection</span>
                    </button>

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-white mb-4">
                            {examDisplayName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Subjects</span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Select a subject to view chapter-wise previous year questions
                        </p>
                    </div>

                    {/* Subject Cards */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {subjects.map((subject, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(`/pyq/${examName}/${subject.name.toLowerCase()}`)}
                                className="glass-panel rounded-xl p-8 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group"
                            >
                                {/* Icon */}
                                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                                    <i className={`fas ${subject.icon} text-white text-3xl`}></i>
                                </div>

                                {/* Subject Name */}
                                <h3 className="text-2xl font-bold text-white mb-3 text-center group-hover:text-cyan-400 transition">
                                    {subject.name}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 text-sm text-center mb-4">
                                    {subject.description}
                                </p>

                                {/* Arrow */}
                                <div className="flex justify-center">
                                    <i className="fas fa-arrow-right text-cyan-400 group-hover:translate-x-2 transition-transform"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PYQSubjectSelection;
