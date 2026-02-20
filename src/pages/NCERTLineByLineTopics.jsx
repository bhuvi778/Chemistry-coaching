import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import NCERTTabs from '../components/NCERT/NCERTTabs';
import { fetchNCERTChapters, fetchNCERTChapter, fetchNCERTTopics, fetchNCERTQuestions, fetchNCERTProgress } from '../services/ncertApi';

const NCERTLineByLineTopics = () => {
    const { chapterId } = useParams();
    const navigate = useNavigate();

    const [chapter, setChapter] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        remaining: 0,
        learning: 0,
        mastery: 0,
        accuracy: 0
    });

    useEffect(() => {
        loadData();
    }, [chapterId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId');

            const [chapterData, topicsData, questionsData, userProgress] = await Promise.all([
                fetchNCERTChapter(chapterId),
                fetchNCERTTopics(chapterId),
                fetchNCERTQuestions({ chapterId, category: 'line-by-line' }),
                userId ? fetchNCERTProgress(userId) : Promise.resolve([])
            ]);

            // Create maps for O(1) lookup
            const progressMap = new Map();
            if (userProgress && Array.isArray(userProgress)) {
                userProgress.forEach(p => {
                    // Start of Selection
                    const qId = typeof p.questionId === 'object' ? p.questionId._id?.toString() : p.questionId?.toString();
                    if (qId) {
                        progressMap.set(qId, p);
                    }
                    // End of Selection
                });
            }

            // Calculate progress per topic
            let totalQuestionsCount = 0;
            let totalCompletedCount = 0;
            let totalCorrectCount = 0;
            let totalAttemptsCount = 0;
            let learningTopicsCount = 0;
            let masteredTopicsCount = 0;

            const enrichedTopics = topicsData.map(topic => {
                const topicQuestions = questionsData.filter(q => {
                    const qTopicId = q.topicId && (q.topicId._id || q.topicId);
                    return qTopicId && qTopicId.toString() === topic._id.toString();
                });

                const totalQ = topicQuestions.length;
                totalQuestionsCount += totalQ;

                let completedCount = 0; // Means correctly answered now
                let correctCount = 0;
                let attemptsCount = 0;

                topicQuestions.forEach(q => {
                    const prog = progressMap.get(q._id.toString());
                    if (prog) {
                        attemptsCount++;
                        if (prog.isCorrect) {
                            completedCount++;
                            correctCount++;
                        }
                    }
                });

                totalCompletedCount += completedCount;
                totalCorrectCount += correctCount;
                totalAttemptsCount += attemptsCount;

                const progress = totalQ > 0 ? Math.round((attemptsCount / totalQ) * 100) : 0;
                const unattemptedQuestions = totalQ - attemptsCount;

                let status = 'New';
                if (progress === 100) {
                    status = 'Completed'; // Changed from Mastered to Completed as it's attempt based
                    masteredTopicsCount++; // Keeping this var name for now but it tracks 100% attempted
                } else if (progress > 0) {
                    status = 'In Progress'; // Changed from Learning
                    learningTopicsCount++;
                }

                return {
                    ...topic,
                    questions: totalQ,
                    progress: progress,
                    completedCount: completedCount, // Correctly answered
                    attemptsCount: attemptsCount, // Total attempted
                    unattemptedQuestions: unattemptedQuestions,
                    status: status
                };
            });

            // Calculate Aggregated Stats
            const accuracy = totalAttemptsCount > 0 ? Math.round((totalCorrectCount / totalAttemptsCount) * 100) : 0;
            const mastery = totalQuestionsCount > 0 ? Math.round((totalAttemptsCount / totalQuestionsCount) * 100) : 0;
            const totalUnattempted = totalQuestionsCount - totalAttemptsCount;

            setStats({
                remaining: totalUnattempted,
                learning: learningTopicsCount,
                mastery: mastery,
                accuracy: accuracy
            });

            setChapter(chapterData);
            setTopics(enrichedTopics);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-5xl mx-auto flex justify-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            </div>
        );
    }

    if (!chapter) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-5xl mx-auto text-center py-20">
                    <h2 className="text-2xl text-gray-400 mb-4">Chapter not found</h2>
                    <button onClick={() => navigate('/ncert-toolbox/line-by-line')} className="text-cyan-400 hover:text-cyan-300">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/ncert-toolbox/line-by-line')}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-6"
                >
                    <i className="fas fa-chevron-left"></i>
                    <span>Back to chapters</span>
                </button>

                {/* Chapter Header */}
                <div className="glass-panel rounded-xl p-8 mb-8 border border-gray-700">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {chapter.name}
                            </h1>
                            <p className="text-gray-400 mb-4">
                                {chapter.description}
                            </p>
                        </div>
                        {/* Overall Chapter Progress */}
                        <div className="ml-6 bg-gray-800/50 rounded-lg p-4 min-w-[200px]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Overall Progress</span>
                                <span className="text-lg font-bold text-green-400">
                                    {stats.mastery}%
                                </span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                                    style={{ width: `${stats.mastery}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-white mb-1">{stats.remaining}</div>
                            <div className="text-sm text-gray-400">Unattempted</div>
                        </div>
                        <div className="bg-amber-500/10 rounded-lg p-4 text-center border border-amber-500/30">
                            <div className="text-3xl font-bold text-amber-400 mb-1">{stats.learning}</div>
                            <div className="text-sm text-amber-400">Learning Topics</div>
                        </div>
                        <div className="bg-blue-500/10 rounded-lg p-4 text-center border border-blue-500/30">
                            <div className="text-3xl font-bold text-blue-400 mb-1">{stats.accuracy}%</div>
                            <div className="text-sm text-blue-400">Accuracy</div>
                        </div>
                        <div className="bg-green-500/10 rounded-lg p-4 text-center border border-green-500/30">
                            <div className="text-3xl font-bold text-green-400 mb-1">{stats.mastery}%</div>
                            <div className="text-sm text-green-400">Chapter Completion</div>
                        </div>
                    </div>
                </div>

                {/* Topics List */}
                <div className="glass-panel rounded-xl p-6 mb-6">
                    {topics.length === 0 ? (
                        <div className="text-center py-12">
                            <i className="fas fa-book text-6xl text-gray-600 mb-4"></i>
                            <p className="text-gray-400 text-lg">No topics available in this chapter yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {topics.map((topic, index) => (
                                <Link
                                    key={topic._id}
                                    to={`/ncert-toolbox/line-by-line/${chapter._id}/topic/${topic._id}`}
                                    className="p-4 rounded-lg transition-all border-2 bg-gray-800/30 border-gray-700/50 hover:border-cyan-500/50 group relative overflow-hidden flex flex-col"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 text-cyan-400 font-bold">
                                                {index + 1}
                                            </div>
                                            <h3 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors line-clamp-2">
                                                {topic.name}
                                            </h3>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex flex-col gap-1 items-end flex-shrink-0">
                                            {topic.unattemptedQuestions > 0 && (
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30 whitespace-nowrap">
                                                    {topic.unattemptedQuestions} Unattempted
                                                </span>
                                            )}
                                            {topic.attemptsCount > 0 && (
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 whitespace-nowrap">
                                                    {topic.attemptsCount} Attempted
                                                </span>
                                            )}
                                            {topic.unattemptedQuestions === 0 && (
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 whitespace-nowrap">
                                                    Attempted All
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {topic.description && (
                                        <p className="text-gray-400 text-sm mb-4 pl-11 line-clamp-2">{topic.description}</p>
                                    )}

                                    {/* Topic Progress Bar */}
                                    <div className="pl-11 mb-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-400">
                                                {topic.status === 'In Progress' ? 'In Progress' : topic.status === 'Completed' ? 'Completed' : 'Not Started'}
                                            </span>
                                            <span className="text-xs font-semibold text-cyan-400">{topic.progress || 0}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${topic.status === 'Completed' ? 'bg-green-500' :
                                                    topic.status === 'In Progress' ? 'bg-blue-500' : 'bg-cyan-500'
                                                    }`}
                                                style={{ width: `${topic.progress || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="pl-11 flex items-center gap-3 border-t border-gray-700 pt-3 mt-auto">
                                        <span className="text-gray-400 text-xs flex items-center gap-1">
                                            <i className="fas fa-question-circle"></i> {topic.questions} Questions
                                        </span>
                                        {topic.status === 'Completed' && (
                                            <span className="text-green-400 text-xs flex items-center gap-1">
                                                <i className="fas fa-check-circle"></i> Done
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NCERTLineByLineTopics;
