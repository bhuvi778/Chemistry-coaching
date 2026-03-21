import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const InfinitePracticeHome = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [availableChapters, setAvailableChapters] = useState([]);
    const [preferences, setPreferences] = useState({
        difficulty: 'Mixed',
        questionCount: 20,
        mode: 'Practice',
        timedMode: false,
        timeLimit: 30,        // minutes
        customTime: '',
        negativeMarking: false,
        negativeMarkValue: 0.25  // per wrong answer
    });
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [examStats, setExamStats] = useState({});
    const [examChapterCount, setExamChapterCount] = useState({});
    const [statsLoaded, setStatsLoaded] = useState(false);

    // Student Info Form
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [studentInfo, setStudentInfo] = useState({
        name: '',
        email: '',
        mobile: '',
        class: ''
    });

    // Daily usage tracking
    const [dailyUsage, setDailyUsage] = useState({ practice: 0, exam: 0 });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Map display names ↔ API/DB names
    const EXAM_DISPLAY_TO_API = {
        'NEET': 'NEET',
        'JEE (Main & Advanced)': 'JEE Main',
        'IAT/NEST': 'JEE Advanced'
    };
    const EXAM_API_TO_DISPLAY = {
        'NEET': 'NEET',
        'JEE Main': 'JEE (Main & Advanced)',
        'JEE Advanced': 'IAT/NEST'
    };
    const getApiExamName = (displayName) => EXAM_DISPLAY_TO_API[displayName] || displayName;

    const TIME_OPTIONS = [
        { label: '5 min', value: 5 },
        { label: '10 min', value: 10 },
        { label: '30 min', value: 30 },
        { label: '45 min', value: 45 },
        { label: '60 min', value: 60 },
        { label: '180 min', value: 180 },
    ];

    const DAILY_LIMIT = 3;

    // Handle quick-start from results page
    useEffect(() => {
        const qs = location.state?.quickStart;
        if (qs) {
            const { selectedExam: e, selectedSubjects: s, availableChapters: ch, selectedChapters: sc, preferences: p } = location.state;
            if (e) setSelectedExam(e);
            if (s) setSelectedSubjects(s);
            if (ch) setAvailableChapters(ch);
            if (sc) setSelectedChapters(sc);
            if (p) setPreferences(p);
            setCurrentStep(4);
            window.history.replaceState({}, '');
        }
        loadDailyUsage();
        loadExamStats();
        // Load saved student info
        const saved = localStorage.getItem('infinitePracticeStudentInfo');
        if (saved) {
            try { setStudentInfo(JSON.parse(saved)); } catch { }
        }
    }, []);

    const loadExamStats = async () => {
        try {
            // Use relative path — always works regardless of VITE_API_URL
            const { data } = await axios.get('/api/infinite-practice/admin/stats');
            const statsMap = {};
            (data.byExam || []).forEach(item => {
                const displayName = EXAM_API_TO_DISPLAY[item._id] || item._id;
                statsMap[displayName] = item.count;
            });
            setExamStats(statsMap);
            const chapterMap = {};
            (data.chaptersByExam || []).forEach(item => {
                const displayName = EXAM_API_TO_DISPLAY[item._id] || item._id;
                chapterMap[displayName] = item.chapterCount;
            });
            setExamChapterCount(chapterMap);
            setStatsLoaded(true);
        } catch (e) {
            console.error('Failed to load exam stats:', e);
            setStatsLoaded(true);
        }
    };

    // Helpers for persisting chapter selections per exam
    const getSavedSelections = () => {
        try {
            const raw = localStorage.getItem('infinitePracticeSavedSelections');
            return raw ? JSON.parse(raw) : {};
        } catch { return {}; }
    };

    const saveSelections = (exam, subjects, chapters, available) => {
        const all = getSavedSelections();
        all[exam] = { subjects, chapters, availableChapters: available };
        localStorage.setItem('infinitePracticeSavedSelections', JSON.stringify(all));
    };

    const loadDailyUsage = () => {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('infinitePracticeDailyUsage');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (data.date === today) {
                    setDailyUsage({ practice: data.practice || 0, exam: data.exam || 0 });
                    return;
                }
            } catch { }
        }
        // Reset for new day
        const reset = { date: today, practice: 0, exam: 0 };
        localStorage.setItem('infinitePracticeDailyUsage', JSON.stringify(reset));
        setDailyUsage({ practice: 0, exam: 0 });
    };

    const incrementDailyUsage = (mode) => {
        const today = new Date().toDateString();
        const newUsage = { ...dailyUsage };
        if (mode === 'Practice') newUsage.practice += 1;
        else if (mode === 'Exam') newUsage.exam += 1;
        const data = { date: today, ...newUsage };
        localStorage.setItem('infinitePracticeDailyUsage', JSON.stringify(data));
        setDailyUsage(newUsage);
    };

    const getRemainingAttempts = (mode) => {
        const used = mode === 'Practice' ? dailyUsage.practice : dailyUsage.exam;
        return Math.max(0, DAILY_LIMIT - used);
    };

    const exams = ['NEET', 'JEE (Main & Advanced)', 'IAT/NEST'];
    const subjects = [
        { name: 'Physical Chemistry', icon: 'fa-atom', color: 'from-blue-500 to-cyan-500', description: 'Thermodynamics, Kinetics, Equilibrium' },
        { name: 'Inorganic Chemistry', icon: 'fa-flask', color: 'from-purple-500 to-pink-500', description: 'Periodic Table, Coordination, Metallurgy' },
        { name: 'Organic Chemistry', icon: 'fa-leaf', color: 'from-green-500 to-emerald-500', description: 'Reactions, Mechanisms, Nomenclature' },
        { name: 'Practical', icon: 'fa-vial', color: 'from-orange-500 to-red-500', description: 'Laboratory Techniques and Experiments' }
    ];

    const handleExamSelect = (exam) => {
        setSelectedExam(exam);
        // Restore previous selections for this exam if available
        const saved = getSavedSelections();
        if (saved[exam]) {
            setSelectedSubjects(saved[exam].subjects || []);
            setSelectedChapters(saved[exam].chapters || []);
            setAvailableChapters(saved[exam].availableChapters || []);
        } else {
            setSelectedSubjects([]);
            setSelectedChapters([]);
            setAvailableChapters([]);
        }
        setCurrentStep(2);
    };

    const handleSubjectToggle = (subjectName) => {
        if (selectedSubjects.includes(subjectName)) {
            setSelectedSubjects(selectedSubjects.filter(s => s !== subjectName));
        } else {
            setSelectedSubjects([...selectedSubjects, subjectName]);
        }
    };

    const handleSelectAllSubjects = () => {
        if (selectedSubjects.length === subjects.length) {
            setSelectedSubjects([]);
        } else {
            setSelectedSubjects(subjects.map(s => s.name));
        }
    };

    const handleChapterToggle = (chapter) => {
        const isSelected = selectedChapters.some(c => c.chapterName === chapter.chapterName && c.subject === chapter.subject);
        if (isSelected) {
            setSelectedChapters(selectedChapters.filter(c => !(c.chapterName === chapter.chapterName && c.subject === chapter.subject)));
        } else if (selectedChapters.length < 3) {
            setSelectedChapters([...selectedChapters, chapter]);
        }
    };

    const handleSubjectsContinue = async () => {
        if (selectedSubjects.length === 0) return;
        setLoading(true);
        try {
            const chaptersPromises = selectedSubjects.map(subject =>
                axios.get(`/api/infinite-practice/chapters?examName=${getApiExamName(selectedExam)}&subject=${subject}`)
                    .then(res => res.data)
            );
            const chaptersArrays = await Promise.all(chaptersPromises);
            const allChapters = [];
            selectedSubjects.forEach((subject, index) => {
                chaptersArrays[index].forEach(chapter => {
                    allChapters.push({ ...chapter, subject });
                });
            });
            setAvailableChapters(allChapters);
            // Keep previously saved chapters that still exist in the new list
            setSelectedChapters(prev => {
                if (prev.length === 0) return prev;
                return prev.filter(sc =>
                    allChapters.some(c => c.chapterName === sc.chapterName && c.subject === sc.subject)
                );
            });
            setCurrentStep(3);
        } catch (error) {
            console.error('Error fetching chapters:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChaptersContinue = () => {
        if (selectedChapters.length >= 1) {
            // Persist selections for this exam
            saveSelections(selectedExam, selectedSubjects, selectedChapters, availableChapters);
            setCurrentStep(4);
        }
    };

    // Check daily limit before starting practice
    const handleProceedToStart = () => {
        const remaining = getRemainingAttempts(preferences.mode);
        if (remaining === 0) {
            alert(`You've reached your daily limit of ${DAILY_LIMIT} ${preferences.mode} sessions. Come back tomorrow!`);
            return;
        }
        setShowStudentForm(true);
    };

    const handleStudentFormSubmit = (e) => {
        e.preventDefault();
        // Save student info for next time
        localStorage.setItem('infinitePracticeStudentInfo', JSON.stringify(studentInfo));
        setShowStudentForm(false);
        handleStartPractice();
    };

    const handleStartPractice = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId') || studentInfo.email || 'guest';
            const uniqueSubjects = [...new Set(selectedChapters.map(c => c.subject))];
            const chapterNames = selectedChapters.map(c => c.chapterName);

            // Calculate actual time limit in seconds
            let timeLimitSeconds = null;
            if (preferences.timedMode) {
                const mins = preferences.timeLimit === 'custom'
                    ? (parseInt(preferences.customTime) || 30)
                    : preferences.timeLimit;
                timeLimitSeconds = mins * 60;
            }

            const response = await axios.post('/api/infinite-practice/session/start', {
                    userId,
                    examName: getApiExamName(selectedExam),
                    subject: uniqueSubjects.join(', '),
                    subjects: uniqueSubjects,
                    chapters: chapterNames,
                    difficulty: preferences.difficulty,
                    totalQuestions: preferences.questionCount,
                    mode: preferences.mode,
                    timedMode: preferences.timedMode,
                    timeLimitSeconds,
                    negativeMarking: preferences.negativeMarking,
                    negativeMarkValue: preferences.negativeMarkValue,
                    studentInfo
                });

            const session = response.data;
            incrementDailyUsage(preferences.mode);
            navigate(`/infinite-practice/session/${session._id}`, {
                state: {
                    selectedExam,
                    selectedSubjects,
                    availableChapters,
                    selectedChapters,
                    preferences
                }
            });
        } catch (error) {
            console.error('Error starting practice:', error);
            alert(error?.response?.data?.message || 'Error starting practice session');
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= step ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400'
                        }`}>
                        {step}
                    </div>
                    {step < 4 && (
                        <div className={`w-16 h-1 ${currentStep > step ? 'bg-cyan-500' : 'bg-gray-700'}`} />
                    )}
                </div>
            ))}
        </div>
    );

    // Daily usage banner
    const renderDailyUsageBanner = () => (
        <div className="flex flex-wrap gap-3 justify-center mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <i className="fas fa-book text-cyan-400"></i>
                <span className="text-cyan-400 font-semibold text-sm">
                    Practice: {getRemainingAttempts('Practice')}/{DAILY_LIMIT} remaining today
                </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                <i className="fas fa-trophy text-orange-400"></i>
                <span className="text-orange-400 font-semibold text-sm">
                    Exam: {getRemainingAttempts('Exam')}/{DAILY_LIMIT} remaining today
                </span>
            </div>
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

                {/* Daily usage */}
                {renderDailyUsageBanner()}

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
                            {exams.map((exam) => {
                                const savedSel = getSavedSelections();
                                const hasSaved = !!(savedSel[exam] && savedSel[exam].chapters?.length > 0);
                                return (
                                    <button
                                        key={exam}
                                        onClick={() => handleExamSelect(exam)}
                                        className="p-8 rounded-xl border-2 border-gray-700 bg-gray-800/50 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all group relative"
                                    >
                                        {hasSaved && (
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-full">
                                                <span className="text-cyan-400 text-xs font-semibold">↩ Resume</span>
                                            </div>
                                        )}
                                        <div className="text-5xl mb-4">
                                            {exam === 'NEET' ? '🩺' : exam === 'JEE (Main & Advanced)' ? '⚙️' : '🚀'}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition mb-4">
                                            {exam}
                                        </h3>
                                        {/* Stats boxes */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-2 text-center">
                                                <div className="text-xl font-bold text-cyan-400">
                                                    {statsLoaded ? (examStats[exam] ?? 0) : <span className="text-gray-500 text-sm">...</span>}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-0.5">Questions</div>
                                            </div>
                                            <div className="rounded-lg bg-purple-500/10 border border-purple-500/30 px-3 py-2 text-center">
                                                <div className="text-xl font-bold text-purple-400">
                                                    {statsLoaded ? (examChapterCount[exam] ?? 0) : <span className="text-gray-500 text-sm">...</span>}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-0.5">Chapters</div>
                                            </div>
                                        </div>
                                        {hasSaved && (
                                            <p className="text-cyan-400/70 text-xs mt-3">
                                                <i className="fas fa-bookmark mr-1"></i>
                                                {savedSel[exam].chapters.length} chapter{savedSel[exam].chapters.length > 1 ? 's' : ''} saved
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Step 2: Choose Subjects */}
                {currentStep === 2 && (
                    <div>
                        <button onClick={() => setCurrentStep(1)} className="text-gray-400 hover:text-cyan-400 transition mb-6 flex items-center gap-2">
                            <i className="fas fa-arrow-left"></i>
                            <span>Back to Exam Selection</span>
                        </button>
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-bold text-white mb-4">
                                {selectedExam} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Chemistry Subjects</span>
                            </h1>
                            <p className="text-gray-400 text-lg mb-4">Select one or more subjects to practice</p>
                            <div className="flex items-center justify-center gap-4">
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                    <span className="text-yellow-400 font-semibold">Selected: {selectedSubjects.length}/{subjects.length}</span>
                                </div>
                                <button onClick={handleSelectAllSubjects} className="px-5 py-3 rounded-xl border-2 border-cyan-500/50 bg-cyan-500/10 text-cyan-400 font-semibold hover:bg-cyan-500/20 transition-all">
                                    {selectedSubjects.length === subjects.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
                            {subjects.map((subject, index) => {
                                const isSelected = selectedSubjects.includes(subject.name);
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleSubjectToggle(subject.name)}
                                        className={`glass-panel rounded-xl p-8 border-2 transition-all duration-300 cursor-pointer relative ${isSelected ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700 hover:border-cyan-500/50'
                                            }`}
                                    >
                                        <div className="absolute top-3 right-3">
                                            {isSelected
                                                ? <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center"><i className="fas fa-check text-white text-xs"></i></div>
                                                : <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>
                                            }
                                        </div>
                                        <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center mb-4 mx-auto ${isSelected ? 'scale-110' : ''}`}>
                                            <i className={`fas ${subject.icon} text-white text-3xl`}></i>
                                        </div>
                                        <h3 className={`text-xl font-bold mb-3 text-center ${isSelected ? 'text-cyan-400' : 'text-white'}`}>{subject.name}</h3>
                                        <p className="text-gray-400 text-sm text-center">{subject.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-center">
                            <button
                                onClick={handleSubjectsContinue}
                                disabled={selectedSubjects.length === 0 || loading}
                                className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {loading ? <><i className="fas fa-spinner fa-spin mr-3"></i>Loading Chapters...</> : <>Continue <i className="fas fa-arrow-right ml-3"></i></>}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Choose Chapters */}
                {currentStep === 3 && (
                    <div>
                        <button onClick={() => setCurrentStep(2)} className="text-gray-400 hover:text-cyan-400 transition mb-6 flex items-center gap-2">
                            <i className="fas fa-arrow-left"></i>
                            <span>Back to Subject Selection</span>
                        </button>
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-bold text-white mb-4">
                                Select <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Chapters</span>
                            </h1>
                            <p className="text-gray-400 text-lg mb-4">Choose 1 to 3 chapters to practice</p>
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                <span className="text-yellow-400 font-semibold">Selected: {selectedChapters.length}/3</span>
                                <span className="text-yellow-500 text-sm">(min 1, max 3)</span>
                            </div>
                        </div>
                        {/* Saved-selection resume banner */}
                        {selectedChapters.length > 0 && (
                            <div className="max-w-6xl mx-auto mb-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-cyan-400">
                                    <i className="fas fa-bookmark"></i>
                                    <span className="font-semibold text-sm">Previous selection restored:</span>
                                    <span className="text-white text-sm">{selectedChapters.map(c => c.chapterName).join(', ')}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setCurrentStep(4); saveSelections(selectedExam, selectedSubjects, selectedChapters, availableChapters); }}
                                        className="px-4 py-1.5 bg-cyan-500 text-white text-xs font-bold rounded-lg hover:bg-cyan-600 transition"
                                    >
                                        <i className="fas fa-play mr-1"></i>Continue with these
                                    </button>
                                    <button
                                        onClick={() => setSelectedChapters([])}
                                        className="px-4 py-1.5 bg-gray-700 text-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-600 transition"
                                    >
                                        <i className="fas fa-redo mr-1"></i>Pick new chapters
                                    </button>
                                </div>
                            </div>
                        )}
                        {availableChapters.length === 0 ? (
                            <div className="text-center py-16">
                                <i className="fas fa-inbox text-gray-600 text-4xl mb-4"></i>
                                <p className="text-gray-400 text-lg">No chapters available. Please add questions from the admin panel.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
                                    {availableChapters.map((chapter, index) => {
                                        const subjectObj = subjects.find(s => s.name === chapter.subject);
                                        const subjectColor = subjectObj ? subjectObj.color : 'from-gray-500 to-gray-600';
                                        const isSelected = selectedChapters.some(c => c.chapterName === chapter.chapterName && c.subject === chapter.subject);
                                        const isDisabled = !isSelected && selectedChapters.length >= 3;
                                        return (
                                            <div
                                                key={`${chapter.subject}-${chapter.chapterName}-${index}`}
                                                onClick={() => !isDisabled && handleChapterToggle(chapter)}
                                                className={`glass-panel rounded-xl p-6 border-2 transition-all duration-300 relative group ${isSelected ? 'border-cyan-500 bg-cyan-500/10 cursor-pointer' :
                                                        isDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' :
                                                            'border-gray-700 hover:border-cyan-500/50 cursor-pointer'
                                                    }`}
                                            >
                                                <div className="absolute top-3 right-3">
                                                    {isSelected
                                                        ? <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/40"><i className="fas fa-check text-white text-xs"></i></div>
                                                        : <div className="w-7 h-7 rounded-full border-2 border-gray-600"></div>
                                                    }
                                                </div>
                                                <div className="mb-3">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${subjectColor}`}>{chapter.subject}</span>
                                                </div>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white text-lg flex-shrink-0 ${isSelected ? 'scale-110' : ''}`}>
                                                        {String(index + 1).padStart(2, '0')}
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-full">
                                                        <i className="fas fa-question-circle text-cyan-400 text-xs"></i>
                                                        <span className="text-cyan-400 text-xs font-bold">{chapter.questionCount} Qs</span>
                                                    </div>
                                                </div>
                                                <h3 className={`text-xl font-bold mb-3 line-clamp-2 min-h-[3.5rem] ${isSelected ? 'text-cyan-400' : 'text-white group-hover:text-cyan-400'}`}>
                                                    {chapter.chapterName}
                                                </h3>
                                                {/* Difficulty breakdown */}
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {chapter.easy > 0 && (
                                                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                                                            E:{chapter.easy}
                                                        </span>
                                                    )}
                                                    {chapter.medium > 0 && (
                                                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                                            M:{chapter.medium}
                                                        </span>
                                                    )}
                                                    {chapter.hard > 0 && (
                                                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                                                            H:{chapter.hard}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="text-center">
                                    {selectedChapters.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                                            {selectedChapters.map((ch, i) => (
                                                <span key={i} className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold flex items-center gap-2">
                                                    {ch.chapterName}
                                                    <button onClick={(e) => { e.stopPropagation(); handleChapterToggle(ch); }} className="hover:text-red-400 transition">
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <button
                                        onClick={handleChaptersContinue}
                                        disabled={selectedChapters.length === 0}
                                        className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        Continue <i className="fas fa-arrow-right ml-3"></i>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Step 4: Mode & Preferences */}
                {currentStep === 4 && (
                    <div>
                        <button onClick={() => setCurrentStep(3)} className="text-gray-400 hover:text-cyan-400 transition mb-6 flex items-center gap-2">
                            <i className="fas fa-arrow-left"></i>
                            <span>Back to Chapter Selection</span>
                        </button>
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-bold text-white mb-4">
                                Configure <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Your Practice</span>
                            </h1>
                        </div>

                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* Mode Selection */}
                            <div className="glass-panel rounded-2xl p-8 border border-gray-700">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <i className="fas fa-gamepad text-white text-xl"></i>
                                    </div>
                                    <span>Select Mode</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Practice Mode */}
                                    <button
                                        onClick={() => setPreferences({ ...preferences, mode: 'Practice' })}
                                        className={`p-8 rounded-2xl border-2 transition-all duration-300 relative ${preferences.mode === 'Practice'
                                                ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                                                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                            }`}
                                    >
                                        {getRemainingAttempts('Practice') === 0 && (
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs font-semibold">
                                                Limit Reached
                                            </div>
                                        )}
                                        <div className="text-5xl mb-4">📚</div>
                                        <h4 className={`text-2xl font-bold mb-3 ${preferences.mode === 'Practice' ? 'text-cyan-400' : 'text-white'}`}>
                                            Practice Mode
                                        </h4>
                                        <p className="text-gray-400 text-sm mb-4">See answers and explanations immediately after each question. Perfect for learning!</p>
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                            <i className="fas fa-check-circle text-green-400"></i>
                                            <span>Instant feedback</span>
                                        </div>
                                        <div className={`mt-3 text-sm font-semibold ${getRemainingAttempts('Practice') > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                                            {getRemainingAttempts('Practice')}/{DAILY_LIMIT} attempts remaining today
                                        </div>
                                    </button>

                                    {/* Exam Mode */}
                                    <button
                                        onClick={() => setPreferences({ ...preferences, mode: 'Exam' })}
                                        className={`p-8 rounded-2xl border-2 transition-all duration-300 relative ${preferences.mode === 'Exam'
                                                ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20'
                                                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                            }`}
                                    >
                                        {getRemainingAttempts('Exam') === 0 && (
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs font-semibold">
                                                Limit Reached
                                            </div>
                                        )}
                                        <div className="text-5xl mb-4">🎯</div>
                                        <h4 className={`text-2xl font-bold mb-3 ${preferences.mode === 'Exam' ? 'text-orange-400' : 'text-white'}`}>
                                            Exam Mode
                                        </h4>
                                        <p className="text-gray-400 text-sm mb-4">Get results after completing all questions. Simulates real exam experience!</p>
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                            <i className="fas fa-clock text-orange-400"></i>
                                            <span>Results at end</span>
                                        </div>
                                        <div className={`mt-3 text-sm font-semibold ${getRemainingAttempts('Exam') > 0 ? 'text-orange-400' : 'text-red-400'}`}>
                                            {getRemainingAttempts('Exam')}/{DAILY_LIMIT} attempts remaining today
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Exam Mode Options: Negative Marking */}
                            {preferences.mode === 'Exam' && (
                                <div className="glass-panel rounded-2xl p-8 border border-orange-500/30 bg-orange-500/5">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <i className="fas fa-minus-circle text-orange-400 text-xl"></i>
                                        <span>Exam Mode Settings</span>
                                    </h3>
                                    <div className="space-y-4">
                                        {/* Negative Marking Toggle */}
                                        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                            <div>
                                                <div className="text-white font-semibold">Negative Marking</div>
                                                <div className="text-gray-400 text-sm mt-1">Deduct marks for wrong answers</div>
                                            </div>
                                            <button
                                                onClick={() => setPreferences({ ...preferences, negativeMarking: !preferences.negativeMarking })}
                                                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${preferences.negativeMarking ? 'bg-red-500' : 'bg-gray-600'}`}
                                            >
                                                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${preferences.negativeMarking ? 'left-7' : 'left-0.5'}`}></div>
                                            </button>
                                        </div>
                                        {/* Negative Mark Value */}
                                        {preferences.negativeMarking && (
                                            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                                <label className="block text-gray-400 mb-3 font-medium">Marks Deducted per Wrong Answer</label>
                                                <div className="grid grid-cols-4 gap-3">
                                                    {[0.25, 0.33, 0.5, 1].map(val => (
                                                        <button
                                                            key={val}
                                                            onClick={() => setPreferences({ ...preferences, negativeMarkValue: val })}
                                                            className={`p-3 rounded-xl border-2 font-bold transition-all ${preferences.negativeMarkValue === val
                                                                    ? 'border-red-500 bg-red-500/20 text-red-400 scale-105'
                                                                    : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                                                                }`}
                                                        >
                                                            -{val}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-gray-500 text-xs mt-2">
                                                    <i className="fas fa-info-circle mr-1"></i>
                                                    e.g., JEE Main uses -1/4 (−0.25) per wrong answer
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Timed Mode */}
                            <div className="glass-panel rounded-2xl p-8 border border-gray-700">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <i className="fas fa-clock text-cyan-400 text-xl"></i>
                                    <span>Timed Mode</span>
                                </h3>
                                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 mb-4">
                                    <div>
                                        <div className="text-white font-semibold">Enable Timer</div>
                                        <div className="text-gray-400 text-sm mt-1">Set a time limit for your session</div>
                                    </div>
                                    <button
                                        onClick={() => setPreferences({ ...preferences, timedMode: !preferences.timedMode })}
                                        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${preferences.timedMode ? 'bg-cyan-500' : 'bg-gray-600'}`}
                                    >
                                        <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${preferences.timedMode ? 'left-7' : 'left-0.5'}`}></div>
                                    </button>
                                </div>

                                {/* Time Options */}
                                {preferences.timedMode && (
                                    <div>
                                        <label className="block text-gray-400 mb-3 font-medium">Select Time Limit</label>
                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                                            {TIME_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setPreferences({ ...preferences, timeLimit: opt.value, customTime: '' })}
                                                    className={`p-3 rounded-xl border-2 font-bold transition-all text-sm ${preferences.timeLimit === opt.value && preferences.customTime === ''
                                                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 scale-105'
                                                            : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setPreferences({ ...preferences, timeLimit: 'custom' })}
                                                className={`p-3 rounded-xl border-2 font-bold transition-all text-sm ${preferences.timeLimit === 'custom'
                                                        ? 'border-purple-500 bg-purple-500/20 text-purple-400 scale-105'
                                                        : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                                                    }`}
                                            >
                                                Custom
                                            </button>
                                        </div>
                                        {preferences.timeLimit === 'custom' && (
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Enter custom time (minutes)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="360"
                                                    value={preferences.customTime}
                                                    onChange={(e) => setPreferences({ ...preferences, customTime: e.target.value })}
                                                    placeholder="e.g., 25"
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-semibold focus:border-cyan-500 outline-none transition"
                                                />
                                            </div>
                                        )}
                                        <p className="text-gray-500 text-xs mt-2">
                                            <i className="fas fa-info-circle mr-1"></i>
                                            Session will auto-submit when time runs out
                                        </p>
                                    </div>
                                )}
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
                                            className={`p-4 rounded-xl border-2 font-semibold transition-all duration-300 ${preferences.difficulty === level
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
                                            className={`p-3 rounded-xl border-2 font-bold transition-all duration-300 ${preferences.questionCount === count
                                                    ? 'border-green-500 bg-green-500/20 text-green-400 scale-105'
                                                    : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                                                }`}
                                        >
                                            {count}
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Or enter custom count (5–200)</label>
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

                            {/* Summary Card */}
                            <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 bg-cyan-500/5">
                                <h3 className="text-lg font-bold text-cyan-400 mb-4">
                                    <i className="fas fa-clipboard-list mr-2"></i>Session Summary
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                    <div className="flex items-center gap-2"><i className="fas fa-graduation-cap text-gray-400 w-4"></i><span className="text-gray-300">{selectedExam}</span></div>
                                    <div className="flex items-center gap-2"><i className="fas fa-gamepad text-gray-400 w-4"></i><span className="text-gray-300">{preferences.mode} Mode</span></div>
                                    <div className="flex items-center gap-2"><i className="fas fa-question-circle text-gray-400 w-4"></i><span className="text-gray-300">{preferences.questionCount} Questions</span></div>
                                    <div className="flex items-center gap-2"><i className="fas fa-signal text-gray-400 w-4"></i><span className="text-gray-300">{preferences.difficulty}</span></div>
                                    <div className="flex items-center gap-2"><i className="fas fa-clock text-gray-400 w-4"></i><span className="text-gray-300">
                                        {preferences.timedMode
                                            ? `${preferences.timeLimit === 'custom' ? (preferences.customTime || '?') : preferences.timeLimit} min`
                                            : 'Untimed'}
                                    </span></div>
                                    {preferences.mode === 'Exam' && (
                                        <div className="flex items-center gap-2"><i className="fas fa-minus-circle text-gray-400 w-4"></i><span className="text-gray-300">
                                            {preferences.negativeMarking ? `−${preferences.negativeMarkValue} per wrong` : 'No negative marks'}
                                        </span></div>
                                    )}
                                </div>
                            </div>

                            {/* Start Button */}
                            <div className="text-center pt-4">
                                <button
                                    onClick={handleProceedToStart}
                                    disabled={loading || getRemainingAttempts(preferences.mode) === 0}
                                    className="px-16 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold rounded-2xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
                                >
                                    {loading ? (
                                        <><i className="fas fa-spinner fa-spin mr-3"></i>Starting Session...</>
                                    ) : getRemainingAttempts(preferences.mode) === 0 ? (
                                        <><i className="fas fa-lock mr-3"></i>Daily Limit Reached</>
                                    ) : (
                                        <><i className="fas fa-play mr-3"></i>Start {preferences.mode} <i className="fas fa-arrow-right ml-3"></i></>
                                    )}
                                </button>
                                {getRemainingAttempts(preferences.mode) === 0 ? (
                                    <p className="text-red-400 text-sm mt-4">
                                        <i className="fas fa-info-circle mr-1"></i>
                                        You've used all {DAILY_LIMIT} {preferences.mode} sessions for today. Come back tomorrow!
                                    </p>
                                ) : (
                                    <p className="text-gray-500 text-sm mt-4">
                                        {preferences.mode === 'Practice'
                                            ? 'You will see answers immediately after each question'
                                            : 'Results will be shown after completing all questions'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Student Info Modal */}
            {showStudentForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-cyan-500/40 shadow-2xl shadow-cyan-500/20">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-user-graduate text-cyan-400 text-2xl"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Your Details</h2>
                            <p className="text-gray-400 text-sm mt-2">Please fill in your details to start the session</p>
                        </div>
                        <form onSubmit={handleStudentFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-medium">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={studentInfo.name}
                                    onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-500 outline-none transition placeholder-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-medium">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={studentInfo.email}
                                    onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-500 outline-none transition placeholder-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-medium">Mobile Number *</label>
                                <input
                                    type="tel"
                                    required
                                    value={studentInfo.mobile}
                                    onChange={(e) => setStudentInfo({ ...studentInfo, mobile: e.target.value })}
                                    placeholder="+91 XXXXX XXXXX"
                                    pattern="[0-9\+\s\-]+"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-500 outline-none transition placeholder-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-medium">Class</label>
                                <select
                                    value={studentInfo.class}
                                    onChange={(e) => setStudentInfo({ ...studentInfo, class: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-500 outline-none transition"
                                >
                                    <option value="">Select Class</option>
                                    <option value="11">Class 11</option>
                                    <option value="12">Class 12</option>
                                    <option value="Dropper">Dropper</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50"
                                >
                                    {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Starting...</> : <><i className="fas fa-play mr-2"></i>Start Session</>}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowStudentForm(false)}
                                    className="px-6 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfinitePracticeHome;
