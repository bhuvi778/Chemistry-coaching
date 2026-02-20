import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ConceptNoteCard - A premium card component for displaying concept-wise notes
 * Features: Flip animation, practice questions preview, difficulty badges, and interactive hover effects
 */
const ConceptNoteCard = ({
    conceptName,
    content,
    images = [],
    practiceQuestions = [],
    subject = 'Chemistry',
    difficulty = 'Medium',
    onClick,
    className = ''
}) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Subject color mappings
    const subjectColors = {
        'Physical Chemistry': {
            gradient: 'from-blue-500 to-indigo-600',
            icon: 'fa-atom',
            glow: 'rgba(59, 130, 246, 0.3)'
        },
        'Organic Chemistry': {
            gradient: 'from-green-500 to-emerald-600',
            icon: 'fa-leaf',
            glow: 'rgba(16, 185, 129, 0.3)'
        },
        'Inorganic Chemistry': {
            gradient: 'from-purple-500 to-pink-600',
            icon: 'fa-flask',
            glow: 'rgba(168, 85, 247, 0.3)'
        },
        'General Chemistry': {
            gradient: 'from-orange-500 to-red-600',
            icon: 'fa-book',
            glow: 'rgba(249, 115, 22, 0.3)'
        },
        'Chemistry': {
            gradient: 'from-cyan-500 to-teal-600',
            icon: 'fa-vial',
            glow: 'rgba(6, 182, 212, 0.3)'
        }
    };

    // Difficulty color mappings
    const difficultyColors = {
        'Easy': 'bg-green-500/20 text-green-400 border-green-500/40',
        'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
        'Hard': 'bg-red-500/20 text-red-400 border-red-500/40'
    };

    const currentSubject = subjectColors[subject] || subjectColors['Chemistry'];

    // Truncate content for preview
    const getPreviewContent = (htmlContent, maxLength = 150) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        return textContent.length > maxLength
            ? textContent.substring(0, maxLength) + '...'
            : textContent;
    };

    const handleCardClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const handleFlip = (e) => {
        e.stopPropagation();
        setIsFlipped(!isFlipped);
    };

    return (
        <div
            className={`concept-card-container perspective-1000 ${className}`}
            style={{ perspective: '1000px' }}
        >
            <div
                className={`concept-card relative w-full h-[400px] transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''
                    }`}
                onClick={handleCardClick}
            >
                {/* Front of Card */}
                <div
                    className="concept-card-front absolute w-full h-full backface-hidden"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                >
                    <div
                        className="glass-panel h-full rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600 transition-all duration-300 group"
                        style={{
                            boxShadow: `0 0 0 rgba(0,0,0,0)`,
                            transition: 'box-shadow 0.3s ease-in-out'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 30px ${currentSubject.glow}`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                        }}
                    >
                        {/* Header with gradient */}
                        <div className={`h-32 bg-gradient-to-br ${currentSubject.gradient} relative overflow-hidden`}>
                            {/* Animated background pattern */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl transform translate-x-1/2 translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                            </div>

                            {/* Icon */}
                            <div className="absolute top-4 left-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                                <i className={`fas ${currentSubject.icon} text-3xl text-white drop-shadow-lg`}></i>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${difficultyColors[difficulty]} backdrop-blur-sm`}>
                                    {difficulty}
                                </span>
                                {practiceQuestions.length > 0 && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                                        {practiceQuestions.length} Q's
                                    </span>
                                )}
                            </div>

                            {/* Subject label */}
                            <div className="absolute bottom-4 left-4">
                                <span className="text-white/90 text-sm font-semibold tracking-wide uppercase drop-shadow-md">
                                    {subject}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col h-[calc(100%-8rem)]">
                            {/* Concept Name */}
                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
                                {conceptName}
                            </h3>

                            {/* Preview Content */}
                            <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-4">
                                {getPreviewContent(content)}
                            </p>

                            {/* Footer Stats */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    {images.length > 0 && (
                                        <span className="flex items-center gap-1.5">
                                            <i className="fas fa-image text-purple-400"></i>
                                            <span>{images.length} {images.length === 1 ? 'Image' : 'Images'}</span>
                                        </span>
                                    )}
                                    {practiceQuestions.length > 0 && (
                                        <span className="flex items-center gap-1.5">
                                            <i className="fas fa-question-circle text-orange-400"></i>
                                            <span>{practiceQuestions.length} Questions</span>
                                        </span>
                                    )}
                                </div>

                                {/* Flip button */}
                                <button
                                    onClick={handleFlip}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    <i className="fas fa-sync-alt"></i>
                                    <span>Flip</span>
                                </button>
                            </div>

                            {/* Action Button */}
                            <button className="mt-4 w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2">
                                <i className="fas fa-book-open"></i>
                                <span>View Details</span>
                                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Back of Card */}
                <div
                    className="concept-card-back absolute w-full h-full backface-hidden"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <div className="glass-panel h-full rounded-2xl overflow-hidden border border-gray-700/50 p-6">
                        {/* Back Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                <i className="fas fa-info-circle text-cyan-400"></i>
                                Quick Info
                            </h4>
                            <button
                                onClick={handleFlip}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Practice Questions Preview */}
                        {practiceQuestions.length > 0 && (
                            <div className="mb-4">
                                <h5 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                    <i className="fas fa-clipboard-list text-orange-400"></i>
                                    Practice Questions Preview
                                </h5>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {practiceQuestions.slice(0, 3).map((q, idx) => (
                                        <div key={idx} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                                            <p className="text-xs text-gray-300 line-clamp-2">
                                                <span className="font-bold text-cyan-400">Q{idx + 1}:</span> {q.question}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${difficultyColors[q.difficulty || 'Medium']}`}>
                                                    {q.difficulty || 'Medium'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {q.options?.length || 4} options
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {practiceQuestions.length > 3 && (
                                        <p className="text-xs text-gray-500 text-center pt-2">
                                            +{practiceQuestions.length - 3} more questions
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Images Preview */}
                        {images.length > 0 && (
                            <div className="mb-4">
                                <h5 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                    <i className="fas fa-images text-purple-400"></i>
                                    Visual Resources
                                </h5>
                                <div className="grid grid-cols-2 gap-2">
                                    {images.slice(0, 4).map((img, idx) => (
                                        <div key={idx} className="aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700/50">
                                            <img
                                                src={img.url}
                                                alt={img.caption || `Image ${idx + 1}`}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {images.length > 4 && (
                                    <p className="text-xs text-gray-500 text-center mt-2">
                                        +{images.length - 4} more images
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Start Practice Button */}
                        {practiceQuestions.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardClick();
                                }}
                                className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-auto"
                            >
                                <i className="fas fa-play"></i>
                                <span>Start Practice</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
                
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(31, 41, 55, 0.5);
                    border-radius: 2px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(6, 182, 212, 0.5);
                    border-radius: 2px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(6, 182, 212, 0.7);
                }
            `}</style>
        </div>
    );
};

ConceptNoteCard.propTypes = {
    conceptName: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string,
        caption: PropTypes.string
    })),
    practiceQuestions: PropTypes.arrayOf(PropTypes.shape({
        question: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.string),
        correctAnswer: PropTypes.number,
        difficulty: PropTypes.string,
        explanation: PropTypes.string
    })),
    subject: PropTypes.string,
    difficulty: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string
};

export default ConceptNoteCard;
