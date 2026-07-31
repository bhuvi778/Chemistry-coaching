import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PracticeTestResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { testId } = useParams();
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (location.state?.results) {
            setResults(location.state.results);
        } else {
            // If no results in state, redirect back
            navigate('/my-daily-target');
        }
    }, [location, navigate]);

    if (!results) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    const { marksObtained, totalMarks, percentage, passed, questions } = results;
    const correctCount = questions.filter(q => q.isCorrect).length;
    const incorrectCount = questions.filter(q => !q.isCorrect && q.selectedAnswer !== null).length;
    const unattemptedCount = questions.filter(q => q.selectedAnswer === null).length;

    return (
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Results Summary */}
                <div className="glass-panel rounded-xl p-8 mb-8">
                    <div className="text-center mb-8">
                        <div className={`inline-block px-6 py-3 rounded-full mb-4 ${passed ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'
                            }`}>
                            <span className={`text-2xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                                {passed ? '🎉 Passed!' : '📚 Keep Practicing!'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Test Completed</h1>
                        <p className="text-gray-400">Here's how you performed</p>
                    </div>

                    {/* Score Card */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl p-6 text-center border border-cyan-500/30">
                            <div className="text-4xl font-bold text-white mb-2">{percentage.toFixed(1)}%</div>
                            <div className="text-sm text-gray-400">Percentage</div>
                        </div>
                        <div className="bg-green-500/10 rounded-xl p-6 text-center border border-green-500/30">
                            <div className="text-4xl font-bold text-green-400 mb-2">{correctCount}</div>
                            <div className="text-sm text-gray-400">Correct</div>
                        </div>
                        <div className="bg-red-500/10 rounded-xl p-6 text-center border border-red-500/30">
                            <div className="text-4xl font-bold text-red-400 mb-2">{incorrectCount}</div>
                            <div className="text-sm text-gray-400">Incorrect</div>
                        </div>
                        <div className="bg-gray-700/50 rounded-xl p-6 text-center border border-gray-600">
                            <div className="text-4xl font-bold text-gray-400 mb-2">{unattemptedCount}</div>
                            <div className="text-sm text-gray-400">Unattempted</div>
                        </div>
                    </div>

                    {/* Marks */}
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                            Score: <span className="text-cyan-400">{marksObtained}</span> / {totalMarks}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex mb-8">
                    <button
                        onClick={() => navigate('/my-daily-target')}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-home"></i>
                        Back to Tests
                    </button>
                </div>

                {/* Detailed Solutions */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Detailed Solutions</h2>
                    {questions.map((question, index) => {
                        const isCorrect = question.isCorrect;
                        const wasAttempted = question.selectedAnswer !== null;

                        return (
                            <div key={question._id} className="glass-panel rounded-xl p-6">
                                {/* Question Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-semibold">
                                            Q{index + 1}
                                        </span>
                                        {wasAttempted ? (
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isCorrect
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                }`}>
                                                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-gray-700/50 text-gray-400 text-sm font-semibold border border-gray-600">
                                                Not Attempted
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Marks: {question.marks}
                                    </div>
                                </div>

                                {/* Question Text */}
                                <div
                                    className="text-white text-lg mb-4 ql-editor-content"
                                    dangerouslySetInnerHTML={{ __html: question.question }}
                                />

                                {/* Options */}
                                <div className="space-y-2 mb-4">
                                    {question.options.map((option, optIndex) => {
                                        const isCorrectOption = optIndex === question.correctAnswer;
                                        const isSelectedOption = optIndex === question.selectedAnswer;

                                        return (
                                            <div
                                                key={optIndex}
                                                className={`p-4 rounded-lg border-2 ${isCorrectOption
                                                    ? 'bg-green-500/10 border-green-500 text-green-400'
                                                    : isSelectedOption
                                                        ? 'bg-red-500/10 border-red-500 text-red-400'
                                                        : 'bg-gray-800/50 border-gray-700 text-gray-400'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${isCorrectOption
                                                        ? 'bg-green-500 text-white'
                                                        : isSelectedOption
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-gray-700 text-gray-400'
                                                        }`}>
                                                        {String.fromCharCode(65 + optIndex)}
                                                    </div>
                                                    <span
                                                        className="flex-1 ql-editor-content"
                                                        dangerouslySetInnerHTML={{ __html: option }}
                                                    />
                                                    {isCorrectOption && (
                                                        <i className="fas fa-check-circle text-green-400"></i>
                                                    )}
                                                    {isSelectedOption && !isCorrectOption && (
                                                        <i className="fas fa-times-circle text-red-400"></i>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Explanation */}
                                {question.explanation && (
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                        <div className="flex items-start gap-2">
                                            <i className="fas fa-lightbulb text-blue-400 mt-1"></i>
                                            <div>
                                                <div className="text-blue-400 font-semibold mb-1">Explanation:</div>
                                                <div
                                                    className="text-gray-300 text-sm ql-editor-content"
                                                    dangerouslySetInnerHTML={{ __html: question.explanation }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PracticeTestResults;
