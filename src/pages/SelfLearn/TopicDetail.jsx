import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import MobilePdfViewer from '../../components/MobilePdfViewer';

const TopicDetail = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [signedVideoUrl, setSignedVideoUrl] = useState(null);
    const [videoUrlLoading, setVideoUrlLoading] = useState(false);
    const [showExercise, setShowExercise] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(null);
    const [expandedSheets, setExpandedSheets] = useState({});

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';
    const BUNNY_LIBRARY_ID = import.meta.env.VITE_BUNNY_LIBRARY_ID || '';

    // Toggle PDF sheet expansion
    const toggleSheet = (index) => {
        setExpandedSheets(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Dynamic naming based on category
    const getCategoryLabel = (category) => {
        const labels = {
            learn: 'Exercise',
            practice: 'DPP',
            revise: 'Mock Test'
        };
        return labels[category] || 'Exercise';
    };

    // Generate signed URL for Bunny.net video with token authentication
    const fetchSignedVideoUrl = async (videoId) => {
        try {
            setVideoUrlLoading(true);
            const response = await axios.post(`${API_URL}/self-learn/generate-signed-url`, {
                videoId
            });
            return response.data.signedUrl;
        } catch (error) {
            console.error('Error fetching signed URL:', error);
            // Fallback to regular URL without token if backend fails
            if (videoId && BUNNY_LIBRARY_ID) {
                console.warn('Using fallback URL without token authentication');
                return `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}?autoplay=false&preload=true&responsive=true`;
            }
            return null;
        } finally {
            setVideoUrlLoading(false);
        }
    };

    // Helper function to get the proper video URL
    const getBunnyVideoUrl = async (video) => {
        if (video.bunnyUrl) {
            return video.bunnyUrl;
        }
        if (video.videoId && BUNNY_LIBRARY_ID) {
            // Fetch signed URL with token authentication
            return await fetchSignedVideoUrl(video.videoId);
        }
        return null;
    };

    // Load signed URL when video is selected
    useEffect(() => {
        if (selectedVideo) {
            const loadVideoUrl = async () => {
                const url = await getBunnyVideoUrl(selectedVideo);
                setSignedVideoUrl(url);
            };
            loadVideoUrl();
        }
    }, [selectedVideo]);

    useEffect(() => {
        fetchTopic();
    }, [topicId]);

    const fetchTopic = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_URL}/self-learn/topics/${topicId}?_t=${Date.now()}`);
            setTopic(response.data);
        } catch (err) {
            console.error('Error fetching topic:', err);
            setError('Failed to load topic details.');
        } finally {
            setLoading(false);
        }
    };

    // Flatten all questions from all exercise sets
    const getAllQuestions = () => {
        if (!topic?.learn?.exercises) return [];
        return topic.learn.exercises.flatMap(exerciseSet => exerciseSet.questions || []);
    };

    const handleStartExercise = () => {
        setShowExercise(true);
        setCurrentQuestion(0);
        setAnswers({});
        setShowResults(false);
        setScore(null);
    };

    const handleAnswerSelect = (questionIndex, optionIndex) => {
        setAnswers({
            ...answers,
            [questionIndex]: optionIndex
        });
    };

    const calculateScore = () => {
        const allQuestions = getAllQuestions();
        let correctCount = 0;
        let totalMarks = 0;
        let negativeMarks = 0;

        allQuestions.forEach((question, index) => {
            const userAnswer = answers[index];
            if (userAnswer !== undefined) {
                if (userAnswer === question.correctAnswer) {
                    correctCount++;
                    totalMarks += question.marks || 1;
                } else {
                    // Apply negative marking
                    negativeMarks += question.negativeMarks || 0;
                }
            }
        });

        const finalScore = totalMarks - negativeMarks;
        const maxScore = allQuestions.reduce((sum, q) => sum + (q.marks || 1), 0);

        setScore({
            correct: correctCount,
            total: allQuestions.length,
            marks: finalScore,
            maxMarks: maxScore,
            negativeMarks: negativeMarks
        });
        setShowResults(true);
    };

    const handleSubmitExercise = () => {
        calculateScore();
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center relative z-10">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400">Loading topic...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-32 pb-20 relative z-10">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/10 text-center">
                        <i className="fas fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
                        <p className="text-red-400 text-lg mb-4">{error}</p>
                        <button
                            onClick={fetchTopic}
                            className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition border border-red-500/50"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!topic) return null;

    // Exercise Test View
    if (showExercise && !showResults) {
        const allQuestions = getAllQuestions();
        const exercise = allQuestions[currentQuestion];

        if (!exercise) {
            return (
                <div className="min-h-screen pt-32 pb-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="glass-panel rounded-xl p-12 border border-gray-700">
                            <i className="fas fa-inbox text-5xl text-gray-600 mb-4"></i>
                            <h2 className="text-2xl font-bold text-white mb-2">No Questions Available</h2>
                            <p className="text-gray-400 mb-6">This topic has no exercise questions yet.</p>
                            <button
                                onClick={() => setShowExercise(false)}
                                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
                            >
                                <i className="fas fa-arrow-left mr-2"></i> Back to Topic
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="glass-panel rounded-xl p-6 mb-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-white">{topic.topicName} - {getCategoryLabel(topic.category)}</h2>
                            <button
                                onClick={() => setShowExercise(false)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                            >
                                <i className="fas fa-times mr-2"></i> Exit
                            </button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                                Question {currentQuestion + 1} of {allQuestions.length}
                            </span>
                            <span className="text-cyan-400">
                                Answered: {Object.keys(answers).length}/{allQuestions.length}
                            </span>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="glass-panel rounded-xl p-8 mb-6 border border-gray-700">
                        <div className="mb-6">
                            <div className="flex items-start gap-3 mb-6">
                                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg font-bold text-sm flex-shrink-0">
                                    Q{currentQuestion + 1}
                                </span>
                                <div 
                                    className="text-white text-lg flex-1 ql-editor-content" 
                                    dangerouslySetInnerHTML={{ __html: exercise.question }}
                                />
                            </div>
                            <div className="flex gap-3 text-xs mb-6">
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/30">
                                    +{exercise.marks || 1} marks
                                </span>
                                {exercise.negativeMarks > 0 && (
                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/30">
                                        -{exercise.negativeMarks} for wrong answer
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {exercise.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSelect(currentQuestion, idx)}
                                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                                        answers[currentQuestion] === idx
                                            ? 'border-cyan-500 bg-cyan-500/20 text-white'
                                            : 'border-gray-700 bg-gray-800/30 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                            answers[currentQuestion] === idx
                                                ? 'border-cyan-500 bg-cyan-500'
                                                : 'border-gray-600'
                                        }`}>
                                            {answers[currentQuestion] === idx && (
                                                <i className="fas fa-check text-white text-xs"></i>
                                            )}
                                        </div>
                                        <div 
                                            className="font-medium flex-1 ql-editor-content" 
                                            dangerouslySetInnerHTML={{ __html: option }}
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                            disabled={currentQuestion === 0}
                            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i className="fas fa-arrow-left mr-2"></i> Previous
                        </button>

                        <div className="flex gap-2">
                            {allQuestions.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQuestion(idx)}
                                    className={`w-10 h-10 rounded-lg font-semibold transition ${
                                        idx === currentQuestion
                                            ? 'bg-cyan-500 text-white'
                                            : answers[idx] !== undefined
                                            ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                                            : 'bg-gray-700 text-gray-400'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>

                        {currentQuestion < allQuestions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
                            >
                                Next <i className="fas fa-arrow-right ml-2"></i>
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmitExercise}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                                <i className="fas fa-check mr-2"></i> Submit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Results View
    if (showResults) {
        const allQuestions = getAllQuestions();
        const percentage = ((score.correct / score.total) * 100).toFixed(1);

        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Results Summary */}
                    <div className="glass-panel rounded-xl p-8 mb-6 border border-gray-700 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">{getCategoryLabel(topic.category)} Results</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                                <div className="text-3xl font-bold text-green-400 mb-1">{score.correct}</div>
                                <div className="text-sm text-green-400">Correct</div>
                            </div>
                            <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                                <div className="text-3xl font-bold text-red-400 mb-1">{score.total - score.correct}</div>
                                <div className="text-sm text-red-400">Wrong</div>
                            </div>
                            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                                <div className="text-3xl font-bold text-blue-400 mb-1">{score.marks}/{score.maxMarks}</div>
                                <div className="text-sm text-blue-400">Score</div>
                            </div>
                            <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                                <div className="text-3xl font-bold text-purple-400 mb-1">{percentage}%</div>
                                <div className="text-sm text-purple-400">Percentage</div>
                            </div>
                        </div>

                        {score.negativeMarks > 0 && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                                <p className="text-red-400">
                                    <i className="fas fa-exclamation-triangle mr-2"></i>
                                    Negative Marking: -{score.negativeMarks} marks deducted for wrong answers
                                </p>
                            </div>
                        )}

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setShowResults(false);
                                    setShowExercise(false);
                                }}
                                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
                            >
                                <i className="fas fa-arrow-left mr-2"></i> Back to Topic
                            </button>
                            <button
                                onClick={handleStartExercise}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                                <i className="fas fa-redo mr-2"></i> Retry
                            </button>
                        </div>
                    </div>

                    {/* Detailed Solutions */}
                    <div className="glass-panel rounded-xl p-6 border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-6">Detailed Solutions</h3>
                        <div className="space-y-6">
                            {allQuestions.map((exercise, idx) => {
                                const userAnswer = answers[idx];
                                const isCorrect = userAnswer === exercise.correctAnswer;

                                return (
                                    <div key={idx} className={`p-6 rounded-lg border-2 ${
                                        isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
                                    }`}>
                                        <div className="flex items-start gap-3 mb-4">
                                            <span className={`px-3 py-1 rounded-lg font-bold text-sm ${
                                                isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                            }`}>
                                                Q{idx + 1}
                                            </span>
                                            <div 
                                                className="text-white flex-1" 
                                                dangerouslySetInnerHTML={{ __html: exercise.question }}
                                            />
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            {exercise.options.map((option, optIdx) => (
                                                <div
                                                    key={optIdx}
                                                    className={`p-3 rounded-lg border ${
                                                        optIdx === exercise.correctAnswer
                                                            ? 'border-green-500/50 bg-green-500/10'
                                                            : optIdx === userAnswer && !isCorrect
                                                            ? 'border-red-500/50 bg-red-500/10'
                                                            : 'border-gray-700 bg-gray-800/30'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {optIdx === exercise.correctAnswer && (
                                                            <i className="fas fa-check-circle text-green-400"></i>
                                                        )}
                                                        {optIdx === userAnswer && !isCorrect && (
                                                            <i className="fas fa-times-circle text-red-400"></i>
                                                        )}
                                                        <div 
                                                            className={
                                                                optIdx === exercise.correctAnswer ? 'text-green-400' :
                                                                optIdx === userAnswer && !isCorrect ? 'text-red-400' :
                                                                'text-gray-400'
                                                            }
                                                            dangerouslySetInnerHTML={{ __html: option }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {exercise.explanation && (
                                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                                <p className="text-sm font-semibold text-blue-400 mb-2">
                                                    <i className="fas fa-lightbulb mr-2"></i>Explanation:
                                                </p>
                                                <div 
                                                    className="text-gray-300 text-sm" 
                                                    dangerouslySetInnerHTML={{ __html: exercise.explanation }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main Topic View
    return (
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-6"
                >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Chapter</span>
                </button>

                {/* Topic Header */}
                <div className="glass-panel rounded-xl p-8 mb-8 border border-gray-700">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {topic.topicName}
                    </h1>
                    {topic.description && (
                        <p className="text-gray-400 mb-4">{topic.description}</p>
                    )}

                    {/* Content Stats */}
                    <div className="flex flex-wrap gap-3">
                        {topic.videoCount > 0 && (
                            <span className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                                🎥 {topic.videoCount} Videos
                            </span>
                        )}
                        {topic.sheetCount > 0 && (
                            <span className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
                                📄 {topic.sheetCount} Sheets
                            </span>
                        )}
                        {topic.exerciseCount > 0 && (
                            <span className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 font-semibold">
                                ✅ {topic.exerciseCount} Exercises
                            </span>
                        )}
                    </div>
                </div>

                {/* Videos Section */}
                {topic.learn?.videos?.length > 0 && (
                    <div className="glass-panel rounded-xl p-6 mb-8 border border-gray-700">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <i className="fas fa-video text-blue-500 mr-3"></i>
                            Video Lectures
                        </h3>
                        
                        {selectedVideo && (
                            <div className="mb-6 bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                                <div className="aspect-video">
                                    {videoUrlLoading ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                                        </div>
                                    ) : selectedVideo.videoType === 'youtube' && selectedVideo.youtubeId ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : signedVideoUrl ? (
                                        <iframe
                                            key={signedVideoUrl}
                                            src={signedVideoUrl}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                            allowFullScreen
                                            referrerPolicy="no-referrer-when-downgrade"
                                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                            onError={() => console.error('Video failed to load')}
                                        ></iframe>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                            <div className="text-center px-4">
                                                <i className="fas fa-video-slash text-gray-500 text-4xl mb-3"></i>
                                                <p className="text-gray-400 font-semibold mb-2">Video Configuration Required</p>
                                                <p className="text-gray-500 text-sm">No video available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xl font-semibold text-white">{selectedVideo.title}</h4>
                                    </div>
                                    {selectedVideo.duration && (
                                        <span className="text-gray-400 text-sm">
                                            <i className="fas fa-clock mr-2"></i>{selectedVideo.duration}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {topic.learn.videos.map((video, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedVideo(video)}
                                    className={`bg-gray-800/50 hover:bg-gray-800 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                        selectedVideo?.videoId === video.videoId || 
                                        (selectedVideo?.youtubeId && selectedVideo.youtubeId === video.youtubeId)
                                            ? 'border-blue-500'
                                            : 'border-gray-700 hover:border-blue-500/50'
                                    }`}
                                >
                                    <div className="relative aspect-video bg-gray-900">
                                        {video.videoType === 'youtube' && video.youtubeId ? (
                                            <img 
                                                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                                alt={video.title} 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                                                }}
                                            />
                                        ) : video.thumbnail ? (
                                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <i className="fas fa-play-circle text-5xl text-white/80"></i>
                                            </div>
                                        )}
                                        
                                        {/* Play Icon Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                                            <i className="fas fa-play-circle text-4xl text-white drop-shadow-lg"></i>
                                        </div>
                                        
                                        {video.duration && (
                                            <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                                {video.duration}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-white font-semibold line-clamp-2">{video.title}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PDF Sheets Section */}
                {topic.learn?.sheets?.length > 0 && (
                    <div className="glass-panel rounded-xl p-6 mb-8 border border-gray-700">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <i className="fas fa-file-pdf text-amber-500 mr-3"></i>
                            PDF Sheets
                        </h3>
                        <div className="space-y-4">
                            {topic.learn.sheets.map((sheet, idx) => (
                                <div key={idx} className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800/30">
                                    {/* Sheet Header - Clickable */}
                                    <div 
                                        onClick={() => toggleSheet(idx)}
                                        className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-gray-700 cursor-pointer hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                                <i className="fas fa-file-pdf text-amber-500"></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-semibold">{sheet.title}</h4>
                                                {sheet.description && (
                                                    <p className="text-gray-400 text-sm mt-1">{sheet.description}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400">
                                                    {expandedSheets[idx] ? 'Click to close' : 'Click to view'}
                                                </span>
                                                <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-200 ${expandedSheets[idx] ? 'rotate-180' : ''}`}></i>
                                            </div>
                                        </div>
                                    </div>
                                    {/* PDF Viewer - Collapsible on all screen sizes */}
                                    {expandedSheets[idx] && (
                                        <div className="relative bg-gray-800 overflow-y-auto" style={{ maxHeight: 'clamp(400px, 70vh, 800px)' }}>
                                            <MobilePdfViewer url={sheet.pdfUrl} title={sheet.title} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Exercises Section */}
                {topic.learn?.exercises?.length > 0 && (
                    <div className="glass-panel rounded-xl p-6 border border-gray-700">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <i className="fas fa-tasks text-green-500 mr-3"></i>
                            {getCategoryLabel(topic.category)}
                        </h3>
                        <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-xl p-8 border border-green-500/30 text-center">
                            <i className="fas fa-clipboard-check text-6xl text-green-400 mb-4"></i>
                            <h4 className="text-2xl font-bold text-white mb-3">
                                {topic.exerciseCount} {getCategoryLabel(topic.category)} Questions
                            </h4>
                            <p className="text-gray-400 mb-6">
                                Test your understanding with MCQ questions
                                {getAllQuestions().some(q => q.negativeMarks > 0) && (
                                    <span className="block text-red-400 text-sm mt-2">
                                        <i className="fas fa-exclamation-triangle mr-2"></i>
                                        Note: Negative marking applicable for wrong answers
                                    </span>
                                )}
                            </p>
                            <button
                                onClick={handleStartExercise}
                                className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
                            >
                                <i className="fas fa-play mr-2"></i> Start {getCategoryLabel(topic.category)}
                            </button>
                        </div>
                    </div>
                )}

                {/* No Content Message */}
                {!topic.learn?.videos?.length && !topic.learn?.sheets?.length && !topic.learn?.exercises?.length && (
                    <div className="glass-panel rounded-xl p-12 text-center border border-gray-700">
                        <i className="fas fa-inbox text-gray-600 text-6xl mb-4"></i>
                        <p className="text-gray-400 text-lg">No content available for this topic yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopicDetail;
