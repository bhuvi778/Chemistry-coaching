import { useNavigate } from 'react-router-dom';

const PYQExamSelection = () => {
    const navigate = useNavigate();

    const exams = [
        {
            name: 'JEE Main',
            fullName: 'Joint Entrance Examination - Main',
            icon: 'fa-atom',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30',
            description: 'Practice previous year questions from JEE Main',
            route: '/pyq/jee-main/chapters'
        },
        {
            name: 'JEE Advanced',
            fullName: 'Joint Entrance Examination - Advanced',
            icon: 'fa-rocket',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/30',
            description: 'Practice previous year questions from JEE Advanced',
            route: '/pyq/jee-advanced/chapters'
        },
        {
            name: 'NEET',
            fullName: 'National Eligibility cum Entrance Test',
            icon: 'fa-microscope',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30',
            description: 'Practice previous year questions from NEET',
            route: '/pyq/neet/chapters'
        },
        {
            name: 'BITSAT',
            fullName: 'Birla Institute of Technology and Science Admission Test',
            icon: 'fa-graduation-cap',
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/30',
            description: 'Practice previous year questions from BITSAT',
            route: '/pyq/bitsat/chapters'
        },
        {
            name: 'NEST',
            fullName: 'National Entrance Screening Test',
            icon: 'fa-flask',
            color: 'from-yellow-500 to-amber-500',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/30',
            description: 'Practice previous year questions from NEST',
            route: '/pyq/nest/chapters'
        },
        {
            name: 'IAT',
            fullName: 'Indian Aptitude Test',
            icon: 'fa-brain',
            color: 'from-teal-500 to-cyan-500',
            bgColor: 'bg-teal-500/10',
            borderColor: 'border-teal-500/30',
            description: 'Practice previous year questions from IAT',
            route: '/pyq/iat/chapters'
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Content */}
            <div className="relative z-10 pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block mb-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto">
                                <i className="fas fa-layer-group text-white text-3xl"></i>
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Chapter-wise <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PYQs</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Practice previous year questions organized by chapters and topics.
                            Master each concept with real exam questions.
                        </p>
                    </div>

                    {/* Exam Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(exam.route)}
                                className="glass-panel rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group"
                            >
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${exam.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <i className={`fas ${exam.icon} text-white text-2xl`}></i>
                                </div>

                                {/* Exam Name */}
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition">
                                    {exam.name}
                                </h3>

                                {/* Full Name */}
                                <p className="text-sm text-gray-400 mb-3">
                                    {exam.fullName}
                                </p>

                                {/* Description */}
                                <p className="text-gray-500 text-sm mb-4">
                                    {exam.description}
                                </p>

                                {/* Arrow */}
                                <div className="flex items-center justify-between">
                                    <div className={`px-3 py-1 rounded-lg ${exam.bgColor} border ${exam.borderColor}`}>
                                        <span className="text-sm font-medium text-gray-300">
                                            <i className="fas fa-book mr-2"></i>
                                            Start Practice
                                        </span>
                                    </div>
                                    <i className="fas fa-arrow-right text-cyan-400 group-hover:translate-x-2 transition-transform"></i>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info Section */}
                    <div className="mt-12 glass-panel rounded-xl p-8 border border-gray-700">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-3">
                                    <i className="fas fa-book-open text-white text-xl"></i>
                                </div>
                                <h4 className="text-white font-semibold mb-2">Chapter-wise Organization</h4>
                                <p className="text-gray-400 text-sm">Questions organized by chapters and topics for focused practice</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3">
                                    <i className="fas fa-calendar-alt text-white text-xl"></i>
                                </div>
                                <h4 className="text-white font-semibold mb-2">Year-wise Questions</h4>
                                <p className="text-gray-400 text-sm">Access questions from last 10+ years with exact exam dates</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-3">
                                    <i className="fas fa-chart-line text-white text-xl"></i>
                                </div>
                                <h4 className="text-white font-semibold mb-2">Track Progress</h4>
                                <p className="text-gray-400 text-sm">Monitor your performance with detailed analytics and insights</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PYQExamSelection;
