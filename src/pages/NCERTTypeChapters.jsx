import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchNCERTChapters, fetchNCERTBadges } from '../services/ncertApi';

const NCERTTypeChapters = () => {
    const { typeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [chapters, setChapters] = useState([]);
    const [chaptersLoading, setChaptersLoading] = useState(true);
    const [typeData, setTypeData] = useState(null);
    const [typeLoading, setTypeLoading] = useState(true);

    const isExemplar = location.pathname.includes('exemplars');
    const isDiagrams = location.pathname.includes('diagrams');

    let category = 'questions';
    if (isExemplar) category = 'exemplars';
    if (isDiagrams) category = 'diagrams';

    useEffect(() => {
        loadData();
    }, [typeId, isExemplar, isDiagrams]);

    const loadData = async () => {
        try {
            setChaptersLoading(true);
            setTypeLoading(true);

            // Fetch Type Details (Badge)
            const badges = await fetchNCERTBadges(category);
            const currentBadge = badges.find(b => b.badgeType === typeId);
            setTypeData(currentBadge);

            // Fetch Chapters (Assuming standard list for now)
            // Ideally we could fetch chapters specific to this type if backend supports it
            const chaptersData = await fetchNCERTChapters('line-by-line');
            setChapters(chaptersData);
        } catch (error) {
            console.error(error);
        } finally {
            setChaptersLoading(false);
            setTypeLoading(false);
        }
    };

    if (typeLoading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
            </div>
        );
    }

    if (!typeData) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4 flex justify-center text-center">
                <div>
                    <h2 className="text-2xl text-gray-400 mb-4">Type not found or deactivated</h2>
                    <button onClick={() => navigate(-1)} className="text-cyan-400">Back</button>
                </div>
            </div>
        );
    }

    // Mock progress calculation
    const overallProgress = 0;

    const getBackPath = () => {
        if (isExemplar) return '/ncert-toolbox/exemplars';
        if (isDiagrams) return '/ncert-toolbox/diagrams';
        return '/ncert-toolbox/questions';
    };

    const getBackLabel = () => {
        if (isExemplar) return 'Exemplar Categories';
        if (isDiagrams) return 'Diagram Categories';
        return 'Question Types';
    };

    return (
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(getBackPath())}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-6"
                >
                    <i className="fas fa-chevron-left"></i>
                    <span>Back to {getBackLabel()}</span>
                </button>

                {/* Header */}
                <div className="glass-panel rounded-xl p-8 mb-8 border border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                                <i className={`fas ${typeData.icon} text-${typeData.color}-400`}></i>
                                {typeData.name}
                            </h1>
                            <p className="text-gray-400 mb-4">
                                {typeData.description}
                            </p>
                        </div>
                        {/* Overall Progress */}
                        <div className="ml-6 bg-gray-800/50 rounded-lg p-4 min-w-[200px] hidden md:block">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Completion</span>
                                <span className="text-lg font-bold text-cyan-400">{overallProgress}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-0"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chapter List */}
                <div className="glass-panel rounded-xl p-6 mb-6">
                    {chaptersLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
                        </div>
                    ) : chapters.length === 0 ? (
                        <div className="text-center py-12">
                            <i className="fas fa-book text-6xl text-gray-600 mb-4"></i>
                            <p className="text-gray-400 text-lg">No chapters available.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {chapters.map((chapter, index) => {
                                let linkPath = `/ncert-toolbox/questions/${typeId}/chapter/${chapter._id}`;
                                if (isExemplar) linkPath = `/ncert-toolbox/exemplars/${typeId}/chapter/${chapter._id}`;
                                if (isDiagrams) linkPath = `/ncert-toolbox/diagrams/${typeId}/chapter/${chapter._id}`;

                                return (
                                    <Link
                                        key={chapter._id}
                                        to={linkPath}
                                        /* Direct link to Question Viewer, skipping Topic selection */
                                        className="p-5 rounded-lg transition-all border-2 bg-gray-800/30 border-gray-700/50 hover:border-cyan-500/50 group"
                                    >
                                        <div className="flex items-start justify-between mb-3">

                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-lg bg-${typeData.color}-500/20 flex items-center justify-center flex-shrink-0 text-${typeData.color}-400 font-bold text-lg`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors">
                                                        {chapter.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-sm text-gray-400">
                                                            {chapter.chapterNumber}
                                                        </span>
                                                        {chapter.classLevel && (
                                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${chapter.classLevel === '11'
                                                                ? 'bg-purple-500/20 text-purple-400'
                                                                : 'bg-blue-500/20 text-blue-400'
                                                                }`}>
                                                                Class {chapter.classLevel}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <i className="fas fa-arrow-right text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity self-center"></i>
                                        </div>

                                        {/* Simple Stats for Card */}
                                        <div className="mt-4 flex items-center gap-4 text-xs text-gray-400 border-t border-gray-700 pt-3">
                                            <span className="flex items-center gap-1">
                                                <i className="fas fa-book-open"></i> Practice
                                            </span>
                                            <span className="ml-auto flex items-center gap-1 text-green-400">
                                                <i className="fas fa-play-circle"></i> Start
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NCERTTypeChapters;
