import { useNavigate, useLocation } from 'react-router-dom';

const NCERTTabs = ({ stats = {} }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active tab based on current path
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/questions')) return 'questions';
        if (path.includes('/exemplars')) return 'exemplars';
        if (path.includes('/diagrams')) return 'diagrams';
        if (path.includes('/nta-abhyas')) return 'nta-abhyas';
        // Default to line-by-line if it's the toolbox root or explicitly line-by-line
        return 'line-by-line';
    };

    const activeTab = getActiveTab();

    const categories = [
        {
            id: 'line-by-line',
            title: 'NCERT Line by Line Qs',
            icon: 'fa-book-open',
            path: '/ncert-toolbox/line-by-line',
            activeGradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/20',
            borderColor: 'border-purple-500/50',
            textColor: 'text-purple-400'
        },
        {
            id: 'questions',
            title: 'NCERT Qs',
            icon: 'fa-question-circle',
            path: '/ncert-toolbox/questions',
            activeGradient: 'bg-gradient-to-r from-pink-500 to-red-500',
            bgColor: 'bg-pink-500/20',
            borderColor: 'border-pink-500/50',
            textColor: 'text-pink-400'
        },
        {
            id: 'exemplars',
            title: 'NCERT Exemplars',
            icon: 'fa-graduation-cap',
            path: '/ncert-toolbox/exemplars',
            activeGradient: 'bg-gradient-to-r from-purple-500 to-indigo-500',
            bgColor: 'bg-purple-500/20',
            borderColor: 'border-purple-500/50',
            textColor: 'text-purple-400'
        },
        {
            id: 'diagrams',
            title: 'Diagram Based Qs',
            icon: 'fa-image',
            path: '/ncert-toolbox/diagrams',
            activeGradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
            bgColor: 'bg-amber-500/20',
            borderColor: 'border-amber-500/50',
            textColor: 'text-amber-400'
        },
        {
            id: 'nta-abhyas',
            title: 'NTA Abhyas',
            icon: 'fa-atom',
            path: '/ncert-toolbox/nta-abhyas',
            activeGradient: 'bg-gradient-to-r from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/20',
            borderColor: 'border-green-500/50',
            textColor: 'text-green-400'
        }
    ];

    return (
        <div className="mb-10">
            {/* Pill-based Tabs */}
            <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => {
                    const isActive = activeTab === category.id;
                    const categoryStats = stats[category.id] || {};

                    return (
                        <button
                            key={category.id}
                            onClick={() => navigate(category.path)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${isActive
                                    ? `${category.activeGradient} text-white shadow-lg`
                                    : `${category.bgColor} ${category.textColor} border ${category.borderColor} hover:scale-105`
                                }`}
                        >
                            <i className={`fas ${category.icon}`}></i>
                            <span>{category.title}</span>
                            {categoryStats.chapters > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-white/20' : 'bg-gray-700'
                                    }`}>
                                    {categoryStats.chapters}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default NCERTTabs;
