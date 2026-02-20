import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InfinitePracticeHome = () => {
    const navigate = useNavigate();
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [availableChapters, setAvailableChapters] = useState([]);
    const [preferences, setPreferences] = useState({
        difficulty: 'Mixed',
        questionCount: 20,
        mode: 'Practice'
    });
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const exams = ['NEET', 'JEE Main', 'JEE Advanced'];
    
    // Chemistry subjects only
    const subjects = [
        {
            name: 'Physical Chemistry',
            icon: 'fa-atom',
            color: 'from-blue-500 to-cyan-500',
            description: 'Thermodynamics, Kinetics, Equilibrium'
        },
        {
            name: 'Inorganic Chemistry',
            icon: 'fa-flask',
            color: 'from-purple-500 to-pink-500',
            description: 'Periodic Table, Coordination, Metallurgy'
        },
        {
            name: 'Organic Chemistry',
            icon: 'fa-leaf',
            color: 'from-green-500 to-emerald-500',
            description: 'Reactions, Mechanisms, Nomenclature'
        },
        {
            name: 'Practical',
            icon: 'fa-vial',
            color: 'from-orange-500 to-red-500',
            description: 'Laboratory Techniques and Experiments'
        }
    ];

    const handleExamSelect = (exam) => {
        setSelectedExam(exam);
        setSelectedSubjects([]);
        setSelectedChapter(null);
        setCurrentStep(2);
    };

    const handleSubjectToggle = (subjectName) => {
        if (selectedSubjects.includes(subjectName)) {
            setSelectedSubjects(selectedSubjects.filter(s => s !== subjectName));
        } else if (selectedSubjects.length < 3) {
            setSelectedSubjects([...selectedSubjects, subjectName]);
        }
    };

    const handleSubjectsContinue = async () => {
        if (selectedSubjects.length === 0) return;
        
        setLoading(true);
        setSelectedChapter(null);
        
        try {
            // Fetch chapters for all selected subjects
            const chaptersPromises = selectedSubjects.map(subject =>
                fetch(`${API_URL}/infinite-practice/chapters?examName=${selectedExam}&subject=${subject}`)
                    .then(res => res.json())
            );
            
            const chaptersArrays = await Promise.all(chaptersPromises);
            
            // Combine and add subject info to each chapter
            const allChapters = [];
            selectedSubjects.forEach((subject, index) => {
                chaptersArrays[index].forEach(chapter => {
                    allChapters.push({
                        ...chapter,
                        subject: subject
                    });
                });
            });
            
            setAvailableChapters(allChapters);
            setCurrentStep(3);
        } catch (error) {
            console.error('Error fetching chapters:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChapterSelect = (chapter) => {
        setSelectedChapter(chapter);
        setCurrentStep(4);
    };

    const handleStartPractice = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId') || 'guest';
            
            const response = await fetch(`${API_URL}/infinite-practice/session/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    examName: selectedExam,
                    subject: selectedChapter.subject,
                    chapters: [selectedChapter.chapterName],
                    difficulty: preferences.difficulty,
                    totalQuestions: preferences.questionCount,
                    mode: preferences.mode
                })
            });

            const session = await response.json();
            
            if (response.ok) {
                navigate(`/infinite-practice/session/${session._id}`);
            } else {
                alert(session.message || 'Error starting practice');
            }
        } catch (error) {
            console.error('Error starting practice:', error);
            alert('Error starting practice session');
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        currentStep >= step 
                            ? 'bg-cyan-500 text-white' 
                            : 'bg-gray-700 text-gray-400'
                    }`}>
                        {step}
                    </div>
                    {step < 4 && (
                        <div className={`w-16 h-1 ${
                            currentStep > step ? 'bg-cyan-500' : 'bg-gray-700'
                        }`} />
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        <i className="fas fa-infinity mr-3 text-cyan-400"></i>
                        Infinite Practice
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Unlimited questions, endless possibilities. Practice smarter, score better.
                    </p>
                </div>

                {/* Step Indicator */}
                {renderStepIndicator()}

                {/* Step 1: Choose Exam */}
                {currentStep === 1 && (
                    <div className="glass-panel rounded-xl p-8 border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">
                            <i className="fas fa-graduation-cap mr-2 text-cyan-400"></i>
                            Step 1: Choose Your Exam
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {exams.map((exam) => (
                                <button
                                    key={exam}
                                    onClick={() => handleExamSelect(exam)}
                                    className="p-8 rounded-xl border-2 border-gray-700 bg-gray-800/50 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all group"
                                >
                                    <div className="text-5xl mb-4">
                                        {exam === 'NEET' ? '🩺' : exam === 'JEE Main' ? '⚙️' : '🚀'}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition">
                                        {exam}
                                    </h3>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Choose Subjects (Max 3) - PYQ Style */}
                {currentStep === 2 && (
                    <div>
                        <button
                            onClick={() => setCurrentStep(1)}
                            className="text-gray-400 hover:text-cyan-400 transition mb-6 flex items-center gap-2"
                        >
                            <i className="fas fa-arrow-left"></i>
                            <span>Back to Exam Selection</span>
                        </button>

                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-bold text-white mb-4">
                                {selectedExam} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Chemistry Subjects</span>
                            </h1>
                            <p className="text-gray-400 text-lg mb-4">
                                Select up to 3 chemistry subjects to practice
                            </p>
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                <span className="text-yellow-400 font-semibold">Selected: {selectedSubjects.length}/3</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                                <p className="text-gray-400">Loading...</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
                                    {subjects.map((subject, index) => {
                                        const isSelected = selectedSubjects.includes(subject.name);
                                        const isDisabled = !isSelected && selectedSubjects.length >= 3;
                                        
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => !isDisabled && handleSubjectToggle(subject.name)}
                                                className={`glass-panel rounded-xl p-8 border-2 transition-all duration-300 cursor-pointer relative ${
                                                    isSelected 
                                                        ? 'border-cyan-500 bg-cyan-500/10' 
                                                        : isDisabled
                                                        ? 'border-gray-700 opacity-50 cursor-not-allowed'
                                                        : 'border-gray-700 hover:border-cyan-500/50'
                                                }`}
                                            >
                                                {/* Selection indicator */}
                                                <div className="absolute top-3 right-3">
                                                    {isSelected ? (
                                                        <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                                                            <i className="fas fa-check text-white text-xs"></i>
                                                        </div>
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>
                                                    )}
                                                </div>

                                                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center mb-4 mx-auto transition-transform ${
                                                    isSelected ? 'scale-110' : isDisabled ? '' : 'group-hover:scale-110'
                                                }`}>
                                                    <i className={`fas ${subject.icon} text-white text-3xl`}></i>
                                                </div>

                                                <h3 className={`text-xl font-bold mb-3 text-center transition ${
                                                    isSelected ? 'text-cyan-400' : 'text-white'
                                                }`}>
                                                    {subject.name}
                                                </h3>

                                                <p className="text-gray-400 text-sm text-center">
                                                    {subject.description}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Continue Button */}
                                <div className="text-center">
                                    <button
                                        onClick={handleSubjectsContinue}
                                        disabled={selectedSubjects.length === 0 || loading}
                                        className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        {loading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin mr-3"></i>
                                                Loading Chapters...
                                            </>
                                        ) : (
                                            <>
                                                Continue
                                                <i className="fas fa-arrow-right ml-3"></i>
                                            </>
                                        )}
                                    </button>
                                    {selectedSubjects.length === 0 && (
                                        <p className="text-gray-500 text-sm mt-3">Please select at least one subject</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Step 3: Choose Chapter */}
                {currentStep === 3 && (
                    <div>
                        <button
                            onClick={() => setCurrentStep(2)}
                            className="text-gray-400 hover:text-cyan-400 transition mb-6 flex items-center gap-2"
                        >
                            <i className="fas fa-arrow-left"></i>
                            <span>Back to Subject Selection</span>
                        </button>

                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-bold text-white mb-4">
                                Select <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Chapter</span>
                            </h1>
                            <p className="text-gray-400 text-lg mb-4">
                                Choose a chapter to practice unlimited questions
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <span className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 font-semibold">
                                    {selectedExam}
                                </span>
                                {selectedSubjects.map((subject, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 font-semibold">
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                                <p className="text-gray-400">Loading chapters...</p>
                            </div>
                        ) : availableChapters.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center">
                                    <i className="fas fa-inbox text-gray-600 text-4xl"></i>
                                </div>
                                <p className="text-gray-400 text-lg">No chapters available for this subject</p>
                                <p className="text-gray-500 text-sm mt-2">Please add questions from the admin panel</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                                {availableChapters.map((chapter, index) => {
                                    // Get subject color
                                    const subjectObj = subjects.find(s => s.name === chapter.subject);
                                    const subjectColor = subjectObj ? subjectObj.color : 'from-gray-500 to-gray-600';
                                    
                                    return (
                                        <div
                                            key={`${chapter.subject}-${chapter.chapterName}-${index}`}
                                            onClick={() => handleChapterSelect(chapter)}
                                            className="glass-panel rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group"
                                        >
                                            {/* Subject Badge */}
                                            <div className="mb-3">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${subjectColor}`}>
                                                    {chapter.subject}
                                                </span>
                                            </div>

                                            {/* Chapter Number Badge and Question Count */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white text-lg group-hover:scale-110 transition-transform">
                                                    {String(index + 1).padStart(2, '0')}
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full">
                                                    <i className="fas fa-check-circle text-green-400 text-xs"></i>
                                                    <span className="text-green-400 text-xs font-semibold">{chapter.questionCount} Qs</span>
                                                </div>
                                            </div>

                                            {/* Chapter Name */}
                                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-cyan-400 transition">
                                                {chapter.chapterName}
                                            </h3>

                                            {/* Stats */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <i className="fas fa-brain text-purple-400"></i>
                                                        <span>Practice</span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <i className="fas fa-file-alt text-orange-400"></i>
                                                        <span>Exam</span>
                                                    </span>
                                                </div>
                                                <i className="fas fa-arrow-right text-cyan-400 group-hover:translate-x-2 transition-transform"></i>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Mode & Preferences */}
                {currentStep === 4 && (
                    <div>
                        <button
                            onClick={() => setCurrentStep(3)}
                            className="text-gray-400 hover:text-cyan-400 transition mb-6 flex items-center gap-2"
                        >
                            <i className="fas fa-arrow-left"></i>
                            <span>Back to Chapter Selection</span>
                        </button>

                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-bold text-white mb-4">
                                Configure <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Your Practice</span>
                            </h1>
                            <p className="text-gray-400 text-lg mb-4">
                                Choose your mode and preferences
                            </p>
                            <div className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                                <span className="text-cyan-400 font-semibold">{selectedExam}</span>
                                <span className="text-gray-500">•</span>
                                <span className="text-cyan-400 font-semibold">{selectedChapter?.subject}</span>
                                <span className="text-gray-500">•</span>
                                <span className="text-cyan-400 font-semibold">{selectedChapter?.chapterName}</span>
                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* Mode Selection - Primary */}
                            <div className="glass-panel rounded-2xl p-8 border border-gray-700">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <i className="fas fa-gamepad text-white text-xl"></i>
                                    </div>
                                    <span>Select Mode</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <button
                                        onClick={() => setPreferences({ ...preferences, mode: 'Practice' })}
                                        className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                                            preferences.mode === 'Practice'
                                                ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                                                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                        }`}
                                    >
                                        <div className="text-5xl mb-4">📚</div>
                                        <h4 className={`text-2xl font-bold mb-3 ${preferences.mode === 'Practice' ? 'text-cyan-400' : 'text-white'}`}>
                                            Practice Mode
                                        </h4>
                                        <p className="text-gray-400 text-sm mb-4">
                                            See answers and explanations immediately after each question. Perfect for learning!
                                        </p>
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                            <i className="fas fa-check-circle text-green-400"></i>
                                            <span>Instant feedback</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setPreferences({ ...preferences, mode: 'Exam' })}
                                        className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                                            preferences.mode === 'Exam'
                                                ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20'
                                                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                        }`}
                                    >
                                        <div className="text-5xl mb-4">🎯</div>
                                        <h4 className={`text-2xl font-bold mb-3 ${preferences.mode === 'Exam' ? 'text-orange-400' : 'text-white'}`}>
                                            Exam Mode
                                        </h4>
                                        <p className="text-gray-400 text-sm mb-4">
                                            Get results after completing all questions. Simulates real exam experience!
                                        </p>
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                            <i className="fas fa-clock text-orange-400"></i>
                                            <span>Results at end</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Difficulty Level */}
                            <div className="glass-panel rounded-2xl p-8 border border-gray-700">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <i className="fas fa-signal text-orange-400 text-xl"></i>
                                    <span>Difficulty Level</span>
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['Easy', 'Medium', 'Hard', 'Mixed'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setPreferences({ ...preferences, difficulty: level })}
                                            className={`p-4 rounded-xl border-2 font-semibold transition-all duration-300 ${
                                                preferences.difficulty === level
                                                    ? 'border-orange-500 bg-orange-500/20 text-orange-400 scale-105'
                                                    : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                                            }`}
                                        >
                                            <div className="text-2xl mb-2">
                                                {level === 'Easy' && '😊'} {level === 'Medium' && '🤔'} 
                                                {level === 'Hard' && '😤'} {level === 'Mixed' && '🎲'}
                                            </div>
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Number of Questions */}
                            <div className="glass-panel rounded-2xl p-8 border border-gray-700">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <i className="fas fa-list-ol text-green-400 text-xl"></i>
                                    <span>Number of Questions</span>
                                </h3>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                                    {[10, 20, 30, 45, 60, 90].map((count) => (
                                        <button
                                            key={count}
                                            onClick={() => setPreferences({ ...preferences, questionCount: count })}
                                            className={`p-3 rounded-xl border-2 font-bold transition-all duration-300 ${
                                                preferences.questionCount === count
                                                    ? 'border-green-500 bg-green-500/20 text-green-400 scale-105'
                                                    : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                                            }`}
                                        >
                                            {count}
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Or enter custom count (5-200)</label>
                                    <input
                                        type="number"
                                        min="5"
                                        max="200"
                                        value={preferences.questionCount}
                                        onChange={(e) => setPreferences({ ...preferences, questionCount: parseInt(e.target.value) || 10 })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-semibold focus:border-green-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Start Button */}
                            <div className="text-center pt-4">
                                <button
                                    onClick={handleStartPractice}
                                    disabled={loading}
                                    className="px-16 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold rounded-2xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
                                >
                                    {loading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-3"></i>
                                            Starting Session...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-play mr-3"></i>
                                            Start {preferences.mode}
                                            <i className="fas fa-arrow-right ml-3"></i>
                                        </>
                                    )}
                                </button>
                                <p className="text-gray-500 text-sm mt-4">
                                    {preferences.mode === 'Practice' 
                                        ? 'You will see answers immediately after each question' 
                                        : 'Results will be shown after completing all questions'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfinitePracticeHome;
