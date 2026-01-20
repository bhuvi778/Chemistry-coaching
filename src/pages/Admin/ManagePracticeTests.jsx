import { useState, useEffect } from 'react';
import axios from 'axios';

const ManagePracticeTests = () => {
    const [tests, setTests] = useState([]);
    const [expandedTests, setExpandedTests] = useState({});
    const [loading, setLoading] = useState(false);

    // Modals
    const [showTestModal, setShowTestModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);

    // Forms
    const [testForm, setTestForm] = useState({
        title: '',
        description: '',
        examType: 'JEE',
        startDate: '',
        duration: 60,
        totalMarks: 100,
        passingMarks: 40,
        isActive: true,
        order: 0
    });

    const [questionForm, setQuestionForm] = useState({
        testId: '',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        marks: 1,
        negativeMarks: 0,
        explanation: '',
        order: 0
    });

    const [editingId, setEditingId] = useState(null);
    const [editingType, setEditingType] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            setLoading(true);
            // Add timestamp to bypass cache and get fresh data
            const timestamp = Date.now();
            const response = await axios.get(`${API_URL}/practice-tests/admin/tests?_t=${timestamp}`);
            setTests(response.data || []);
        } catch (error) {
            console.error('Error fetching tests:', error);
            alert('Failed to fetch tests');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestions = async (testId) => {
        try {
            // Add timestamp to bypass cache and get fresh data
            const timestamp = Date.now();
            const response = await axios.get(`${API_URL}/practice-tests/admin/tests/${testId}/questions?_t=${timestamp}`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    };

    const toggleTest = async (testId) => {
        if (expandedTests[testId]) {
            setExpandedTests({ ...expandedTests, [testId]: null });
        } else {
            const questions = await fetchQuestions(testId);
            setExpandedTests({ ...expandedTests, [testId]: questions });
        }
    };

    // ============ TEST OPERATIONS ============


    const openTestModal = (test = null) => {
        if (test) {
            // Helper to format date for datetime-local input (YYYY-MM-DDTHH:mm) in LOCAL time
            const formatForDateTimeInput = (dateStr) => {
                if (!dateStr) return '';
                const date = new Date(dateStr);
                const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
                const localDate = new Date(date.getTime() - offset);
                return localDate.toISOString().slice(0, 16);
            };

            // Helper for date input (YYYY-MM-DD) in LOCAL time
            const formatForDateInput = (dateStr) => {
                if (!dateStr) return '';
                const date = new Date(dateStr);
                const offset = date.getTimezoneOffset() * 60000;
                const localDate = new Date(date.getTime() - offset);
                return localDate.toISOString().split('T')[0];
            };

            setTestForm({
                title: test.title,
                description: test.description || '',
                examType: test.examType || 'JEE',
                startDate: formatForDateTimeInput(test.startDate),
                duration: test.duration || 60,
                totalMarks: test.totalMarks || 100,
                passingMarks: test.passingMarks || 40,
                isActive: test.isActive !== false,
                order: test.order || 0
            });
            setEditingId(test._id);
            setEditingType('test');
        } else {
            resetTestForm();
        }
        setShowTestModal(true);
    };

    const handleTestSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert start date to UTC ISO string before converting
            const payload = { ...testForm };
            if (payload.startDate) {
                payload.startDate = new Date(payload.startDate).toISOString();
            }

            if (editingId && editingType === 'test') {
                await axios.put(`${API_URL}/practice-tests/admin/tests/${editingId}`, payload);
                alert('Test updated successfully!');
            } else {
                await axios.post(`${API_URL}/practice-tests/admin/tests`, payload);
                alert('Test created successfully!');
            }
            setShowTestModal(false);
            resetTestForm();
            fetchTests();
        } catch (error) {
            console.error('Error saving test:', error);
            alert('Failed to save test');
        }
    };

    const deleteTest = async (id) => {
        if (!confirm('Are you sure? This will delete all questions in this test.')) return;
        try {
            await axios.delete(`${API_URL}/practice-tests/admin/tests/${id}`);
            alert('Test deleted successfully!');
            fetchTests();
            setExpandedTests({});
        } catch (error) {
            console.error('Error deleting test:', error);
            alert('Failed to delete test');
        }
    };

    const resetTestForm = () => {
        setTestForm({
            title: '',
            description: '',
            examType: 'JEE',
            startDate: '',
            duration: 60,
            totalMarks: 100,
            passingMarks: 40,
            isActive: true,
            order: 0
        });
        setEditingId(null);
        setEditingType(null);
    };

    // ============ QUESTION OPERATIONS ============

    const openQuestionModal = (testId, question = null) => {
        if (question) {
            setQuestionForm({
                testId: question.testId,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                marks: question.marks || 1,
                negativeMarks: question.negativeMarks || 0,
                explanation: question.explanation || '',
                order: question.order || 0
            });
            setEditingId(question._id);
            setEditingType('question');
        } else {
            setQuestionForm({
                testId: testId,
                question: '',
                options: ['', '', '', ''],
                correctAnswer: 0,
                marks: 1,
                negativeMarks: 0,
                explanation: '',
                order: 0
            });
            setEditingId(null);
            setEditingType(null);
        }
        setSelectedTest(tests.find(t => t._id === testId));
        setShowQuestionModal(true);
    };

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId && editingType === 'question') {
                await axios.put(`${API_URL}/practice-tests/admin/questions/${editingId}`, questionForm);
                alert('Question updated successfully!');
            } else {
                await axios.post(`${API_URL}/practice-tests/admin/questions`, questionForm);
                alert('Question created successfully!');
            }

            // Refresh questions for this test
            const questions = await fetchQuestions(questionForm.testId);
            setExpandedTests({ ...expandedTests, [questionForm.testId]: questions });

            // Refresh test list to update question count
            await fetchTests();

            // Reset form but keep testId for adding more questions
            const savedTestId = questionForm.testId;
            resetQuestionForm();
            setQuestionForm(prev => ({ ...prev, testId: savedTestId }));
        } catch (error) {
            console.error('Error saving question:', error);
            alert('Failed to save question');
        }
    };

    const deleteQuestion = async (questionId, testId) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            await axios.delete(`${API_URL}/practice-tests/admin/questions/${questionId}`);
            alert('Question deleted successfully!');
            const questions = await fetchQuestions(testId);
            setExpandedTests({ ...expandedTests, [testId]: questions });

            // Refresh test list to update question count
            await fetchTests();
        } catch (error) {
            console.error('Error deleting question:', error);
            alert('Failed to delete question');
        }
    };

    const resetQuestionForm = () => {
        setQuestionForm({
            testId: '',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            marks: 1,
            negativeMarks: 0,
            explanation: '',
            order: 0
        });
        setEditingId(null);
        setEditingType(null);
    };

    const updateOption = (index, value) => {
        const newOptions = [...questionForm.options];
        newOptions[index] = value;
        setQuestionForm({ ...questionForm, options: newOptions });
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Manage Practice Tests</h1>
                    <p className="text-gray-400">Create and organize practice tests for daily targets</p>
                </div>
                <button
                    onClick={() => openTestModal()}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition"
                >
                    <i className="fas fa-plus mr-2"></i>
                    New Test
                </button>
            </div>

            {/* Tests List */}
            <div className="glass-panel rounded-xl p-6">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                ) : tests.length === 0 ? (
                    <div className="text-center py-12">
                        <i className="fas fa-clipboard-list text-6xl text-gray-600 mb-4"></i>
                        <p className="text-gray-400 mb-4">No tests created yet</p>
                        <button
                            onClick={() => openTestModal()}
                            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
                        >
                            Create Your First Test
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tests.map((test) => (
                            <div key={test._id} className="bg-gray-800/50 rounded-lg overflow-hidden">
                                {/* Test Header */}
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <button
                                            onClick={() => toggleTest(test._id)}
                                            className="text-gray-400 hover:text-cyan-400 transition"
                                        >
                                            <i className={`fas fa-chevron-${expandedTests[test._id] ? 'down' : 'right'} text-lg`}></i>
                                        </button>
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold text-lg">{test.title}</h3>
                                            <p className="text-gray-400 text-sm">{test.description}</p>
                                            <div className="flex gap-4 mt-1 text-xs text-gray-500">
                                                <span><i className="fas fa-question-circle mr-1"></i>{test.questionCount || 0} questions</span>
                                                <span><i className="fas fa-clock mr-1"></i>{test.duration} min</span>
                                                <span><i className="fas fa-play-circle mr-1"></i>Starts: {new Date(test.startDate).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openQuestionModal(test._id)}
                                            className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                                        >
                                            <i className="fas fa-plus mr-2"></i>
                                            Add Question
                                        </button>
                                        <button
                                            onClick={() => openTestModal(test)}
                                            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => deleteTest(test._id)}
                                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Questions List (Expanded) */}
                                {expandedTests[test._id] && (
                                    <div className="border-t border-gray-700 bg-gray-900/30 p-4">
                                        {expandedTests[test._id].length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-400 mb-3">No questions in this test yet</p>
                                                <button
                                                    onClick={() => openQuestionModal(test._id)}
                                                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition text-sm"
                                                >
                                                    <i className="fas fa-plus mr-2"></i>
                                                    Add First Question
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {expandedTests[test._id].map((question, index) => (
                                                    <div key={question._id} className="bg-gray-800/50 rounded-lg p-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-cyan-400 font-semibold">Q{index + 1}</span>
                                                                    <span className="text-xs text-gray-500">
                                                                        Marks: {question.marks} | Negative: {question.negativeMarks}
                                                                    </span>
                                                                </div>
                                                                <p className="text-white text-sm mb-2">{question.question}</p>
                                                                <div className="space-y-1">
                                                                    {question.options.map((opt, i) => (
                                                                        <div key={i} className={`text-xs p-2 rounded ${i === question.correctAnswer
                                                                            ? 'bg-green-500/20 text-green-400'
                                                                            : 'bg-gray-700/50 text-gray-400'
                                                                            }`}>
                                                                            {String.fromCharCode(65 + i)}. {opt}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => openQuestionModal(test._id, question)}
                                                                    className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition text-sm"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteQuestion(question._id, test._id)}
                                                                    className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition text-sm"
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Test Modal */}
            {showTestModal && (
                <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full my-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {editingId && editingType === 'test' ? 'Edit Test' : 'New Test'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowTestModal(false);
                                    resetTestForm();
                                }}
                                className="text-gray-400 hover:text-white transition"
                            >
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleTestSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Title *</label>
                                <input
                                    type="text"
                                    value={testForm.title}
                                    onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    placeholder="e.g., JEE Main Mock Test 1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Description</label>
                                <textarea
                                    value={testForm.description}
                                    onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    rows="3"
                                    placeholder="Brief description of this test"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Exam Type *</label>
                                <select
                                    value={testForm.examType}
                                    onChange={(e) => setTestForm({ ...testForm, examType: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    required
                                >
                                    <optgroup label="UG Entrance Exams">
                                        <option value="NEET">NEET</option>
                                        <option value="JEE">JEE</option>
                                        <option value="IAT">IAT</option>
                                        <option value="NEST">NEST</option>
                                        <option value="CUET UG">CUET UG</option>
                                        <option value="BITSAT">BITSAT</option>
                                    </optgroup>
                                    <optgroup label="PG Entrance Exams">
                                        <option value="IIT JAM">IIT JAM</option>
                                        <option value="CUET PG">CUET PG</option>
                                    </optgroup>
                                    <optgroup label="Research Level Exams">
                                        <option value="CSIR NET">CSIR NET</option>
                                        <option value="GATE">GATE</option>
                                        <option value="TIFR">TIFR</option>
                                    </optgroup>
                                    <optgroup label="Competitive Exams (Govt. Job)">
                                        <option value="PSTET">PSTET</option>
                                        <option value="Master Cadre">Master Cadre</option>
                                        <option value="UPSC - Mains (Chemistry)">UPSC - Mains (Chemistry)</option>
                                    </optgroup>
                                    <optgroup label="Other">
                                        <option value="Foundation">Foundation</option>
                                        <option value="All">All Exams</option>
                                    </optgroup>
                                </select>
                            </div>


                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">
                                    Start Date & Time *
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={testForm.startDate ? testForm.startDate.split('T')[0] : ''}
                                        onChange={(e) => {
                                            const date = e.target.value;
                                            const time = testForm.startDate && testForm.startDate.includes('T')
                                                ? testForm.startDate.split('T')[1]
                                                : '00:00';
                                            setTestForm({ ...testForm, startDate: `${date}T${time}` });
                                        }}
                                        className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        required
                                    />
                                    <input
                                        type="time"
                                        value={testForm.startDate && testForm.startDate.includes('T') ? testForm.startDate.split('T')[1] : ''}
                                        onChange={(e) => {
                                            const time = e.target.value;
                                            // Default to today if date not set
                                            const date = testForm.startDate && testForm.startDate.includes('T')
                                                ? testForm.startDate.split('T')[0]
                                                : new Date().toISOString().split('T')[0];
                                            setTestForm({ ...testForm, startDate: `${date}T${time}` });
                                        }}
                                        className="w-40 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    ⏰ Test will be LOCKED and shown explicitly as "Upcoming" until this specific time.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Duration (minutes) *</label>
                                    <input
                                        type="number"
                                        value={testForm.duration}
                                        onChange={(e) => setTestForm({ ...testForm, duration: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Total Marks *</label>
                                    <input
                                        type="number"
                                        value={testForm.totalMarks}
                                        onChange={(e) => setTestForm({ ...testForm, totalMarks: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Passing Marks *</label>
                                    <input
                                        type="number"
                                        value={testForm.passingMarks}
                                        onChange={(e) => setTestForm({ ...testForm, passingMarks: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    {editingId && editingType === 'test' ? 'Update Test' : 'Create Test'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowTestModal(false);
                                        resetTestForm();
                                    }}
                                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Question Modal */}
            {showQuestionModal && (
                <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full my-8 min-h-min">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {editingId && editingType === 'question' ? 'Edit Question' : 'New Question'}
                                </h2>
                                <p className="text-gray-400 text-sm">{selectedTest?.title}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowQuestionModal(false);
                                    resetQuestionForm();
                                }}
                                className="text-gray-400 hover:text-white transition"
                            >
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleQuestionSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Question *</label>
                                <textarea
                                    value={questionForm.question}
                                    onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    rows="3"
                                    placeholder="Enter the question..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Options *</label>
                                {questionForm.options.map((option, index) => (
                                    <div key={index} className="mb-2">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOption(index, e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Correct Answer *</label>
                                    <select
                                        value={questionForm.correctAnswer}
                                        onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    >
                                        {questionForm.options.map((_, index) => (
                                            <option key={index} value={index}>
                                                Option {String.fromCharCode(65 + index)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Marks *</label>
                                    <input
                                        type="number"
                                        value={questionForm.marks}
                                        onChange={(e) => setQuestionForm({ ...questionForm, marks: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Negative Marks</label>
                                    <input
                                        type="number"
                                        step="0.25"
                                        value={questionForm.negativeMarks}
                                        onChange={(e) => setQuestionForm({ ...questionForm, negativeMarks: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Explanation</label>
                                <textarea
                                    value={questionForm.explanation}
                                    onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    rows="3"
                                    placeholder="Explain the correct answer..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    {editingId && editingType === 'question' ? 'Update Question' : 'Create Question'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowQuestionModal(false);
                                        resetQuestionForm();
                                    }}
                                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
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

export default ManagePracticeTests;
