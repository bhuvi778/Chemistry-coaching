import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

const AudioBookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { audioBooks } = useData();
    const { isDark } = useTheme();
    const audioRef = useRef(null);

    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [expandedChapter, setExpandedChapter] = useState(null);

    const audioBook = audioBooks.find(book => book._id === id);

    useEffect(() => {
        if (!audioBook) {
            navigate('/audiobooks');
        } else if (audioBook.chapters && audioBook.chapters.length > 0) {
            // Auto-select first chapter and first topic
            setSelectedChapter(audioBook.chapters[0]);
            setExpandedChapter(0);
            if (audioBook.chapters[0].topics && audioBook.chapters[0].topics.length > 0) {
                setSelectedTopic(audioBook.chapters[0].topics[0]);
            }
        }
    }, [audioBook, navigate]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            playNextTopic();
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [selectedTopic]);

    const playNextTopic = () => {
        if (!audioBook || !audioBook.chapters) return;

        const currentChapterIndex = audioBook.chapters.findIndex(ch => ch._id === selectedChapter._id);
        const currentTopicIndex = selectedChapter.topics.findIndex(t => t._id === selectedTopic._id);

        // Try next topic in current chapter
        if (currentTopicIndex < selectedChapter.topics.length - 1) {
            const nextTopic = selectedChapter.topics[currentTopicIndex + 1];
            setSelectedTopic(nextTopic);
        }
        // Try first topic of next chapter
        else if (currentChapterIndex < audioBook.chapters.length - 1) {
            const nextChapter = audioBook.chapters[currentChapterIndex + 1];
            setSelectedChapter(nextChapter);
            setExpandedChapter(currentChapterIndex + 1);
            if (nextChapter.topics && nextChapter.topics.length > 0) {
                setSelectedTopic(nextChapter.topics[0]);
            }
        }
    };

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const seekTime = (e.target.value / 100) * duration;
        audio.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleTopicSelect = (chapter, topic) => {
        setSelectedChapter(chapter);
        setSelectedTopic(topic);
        setIsPlaying(false);
    };

    const toggleChapter = (index) => {
        setExpandedChapter(expandedChapter === index ? null : index);
    };

    if (!audioBook) {
        return null;
    }

    return (
        <div className={`min-h-screen py-20 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/audiobooks"
                    className={`inline-flex items-center gap-2 mb-6 transition ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <i className="fas fa-arrow-left"></i> Back to Audio Books
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar - Chapters & Topics */}
                    <div className="lg:col-span-1">
                        <div className={`rounded-xl p-6 sticky top-24 ${isDark ? 'glass-panel' : 'bg-white shadow-lg border border-gray-200'
                            }`}>
                            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Chapters
                            </h2>

                            {audioBook.chapters && audioBook.chapters.length > 0 ? (
                                <div className="space-y-3">
                                    {audioBook.chapters.map((chapter, chapterIndex) => (
                                        <div key={chapter._id || chapterIndex}>
                                            <button
                                                onClick={() => toggleChapter(chapterIndex)}
                                                className={`w-full text-left p-3 rounded-lg transition ${expandedChapter === chapterIndex
                                                        ? isDark
                                                            ? 'bg-purple-500/20 border border-purple-500'
                                                            : 'bg-purple-50 border border-purple-300'
                                                        : isDark
                                                            ? 'bg-gray-800 hover:bg-gray-700'
                                                            : 'bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        {chapter.title}
                                                    </span>
                                                    <i className={`fas fa-chevron-${expandedChapter === chapterIndex ? 'up' : 'down'} text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                                                        }`}></i>
                                                </div>
                                                {chapter.topics && (
                                                    <span className={`text-xs mt-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>
                                                        {chapter.topics.length} topics
                                                    </span>
                                                )}
                                            </button>

                                            {/* Topics List */}
                                            {expandedChapter === chapterIndex && chapter.topics && (
                                                <div className="mt-2 ml-4 space-y-2">
                                                    {chapter.topics.map((topic, topicIndex) => (
                                                        <button
                                                            key={topic._id || topicIndex}
                                                            onClick={() => handleTopicSelect(chapter, topic)}
                                                            className={`w-full text-left p-2 rounded-lg transition text-sm ${selectedTopic?._id === topic._id
                                                                    ? isDark
                                                                        ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400'
                                                                        : 'bg-cyan-50 border border-cyan-300 text-cyan-700'
                                                                    : isDark
                                                                        ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <i className={`fas fa-${selectedTopic?._id === topic._id ? 'volume-up' : 'play-circle'} text-xs`}></i>
                                                                <span>{topic.title}</span>
                                                            </div>
                                                            {topic.duration && (
                                                                <span className={`text-xs block mt-1 ml-5 ${isDark ? 'text-gray-500' : 'text-gray-500'
                                                                    }`}>
                                                                    {topic.duration}
                                                                </span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    No chapters available yet
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Main Content - Player & Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Book Info */}
                        <div className={`rounded-xl p-8 ${isDark ? 'glass-panel' : 'bg-white shadow-lg border border-gray-200'
                            }`}>
                            <div className="flex flex-col md:flex-row gap-6">
                                {audioBook.thumbnailUrl && (
                                    <img
                                        src={audioBook.thumbnailUrl}
                                        alt={audioBook.title}
                                        className="w-full md:w-48 h-48 object-cover rounded-lg"
                                    />
                                )}
                                <div className="flex-1">
                                    <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {audioBook.title}
                                    </h1>
                                    <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {audioBook.description}
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        {audioBook.author && (
                                            <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                <i className="fas fa-user"></i>
                                                <span>{audioBook.author}</span>
                                            </div>
                                        )}
                                        <div className={`px-3 py-1 rounded-full ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                                            }`}>
                                            {audioBook.category}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Audio Player */}
                        {selectedTopic && selectedTopic.audioUrl && (
                            <div className={`rounded-xl p-6 ${isDark ? 'glass-panel' : 'bg-white shadow-lg border border-gray-200'
                                }`}>
                                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Now Playing
                                </h3>

                                <div className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'
                                    }`}>
                                    <p className={`font-semibold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                                        {selectedChapter?.title}
                                    </p>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {selectedTopic.title}
                                    </p>
                                </div>

                                <audio ref={audioRef} src={selectedTopic.audioUrl} />

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={duration ? (currentTime / duration) * 100 : 0}
                                        onChange={handleSeek}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className={`flex justify-between text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={togglePlayPause}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center transition ${isDark
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                                                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                            } text-white`}
                                    >
                                        <i className={`fas fa-${isPlaying ? 'pause' : 'play'} text-2xl ${!isPlaying ? 'ml-1' : ''}`}></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Topic Description */}
                        {selectedTopic && selectedTopic.description && (
                            <div className={`rounded-xl p-6 ${isDark ? 'glass-panel' : 'bg-white shadow-lg border border-gray-200'
                                }`}>
                                <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    About This Topic
                                </h3>
                                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    {selectedTopic.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${isDark ? '#06b6d4' : '#0891b2'};
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${isDark ? '#06b6d4' : '#0891b2'};
          cursor: pointer;
          border: none;
        }
      `}</style>
        </div>
    );
};

export default AudioBookDetail;
