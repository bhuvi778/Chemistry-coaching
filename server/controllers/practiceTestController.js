const PracticeTest = require('../models/PracticeTest');
const PracticeQuestion = require('../models/PracticeQuestion');
const TestResult = require('../models/TestResult');
const TestRegistration = require('../models/TestRegistration');

// Helper to recalculate marks for all questions in a test
const recalculateMarks = async (testId) => {
    try {
        const test = await PracticeTest.findById(testId);
        if (!test) return;

        const questions = await PracticeQuestion.find({ testId });
        if (questions.length === 0) return;

        // Calculate marks per question (distribute total marks evenly)
        const marksPerQuestion = Number((test.totalMarks / questions.length).toFixed(2));

        await PracticeQuestion.updateMany(
            { testId },
            { $set: { marks: marksPerQuestion } }
        );

        console.log(`Recalculated marks for test ${testId}: ${questions.length} questions, ${marksPerQuestion} marks each.`);
    } catch (error) {
        console.error('Error recalculating marks:', error);
    }
};

// Cache clearing function (injected from app.js)
let clearCache = null;
exports.setClearCacheFunction = (fn) => {
    clearCache = fn;
};

// ============ REGISTRATION ROUTES ============

// Register for a test
exports.registerForTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const { name, email, mobile } = req.body;

        // Validate input
        if (!name || !email || !mobile) {
            return res.status(400).json({ message: 'Name, email, and mobile are required' });
        }

        // Check if test exists
        const test = await PracticeTest.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if already registered
        const existingRegistration = await TestRegistration.findOne({ testId, email });
        if (existingRegistration) {
            return res.json({
                message: 'Already registered',
                registration: existingRegistration
            });
        }

        // Create registration
        const registration = new TestRegistration({
            testId,
            name,
            email,
            mobile
        });

        await registration.save();

        res.status(201).json({
            message: 'Registration successful',
            registration
        });
    } catch (error) {
        console.error('Error registering for test:', error);
        res.status(500).json({ message: 'Error registering for test', error: error.message });
    }
};

// Check if user is registered for a test
exports.checkRegistration = async (req, res) => {
    try {
        const { testId } = req.params;
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const registration = await TestRegistration.findOne({ testId, email });

        res.json({
            isRegistered: !!registration,
            registration: registration || null
        });
    } catch (error) {
        console.error('Error checking registration:', error);
        res.status(500).json({ message: 'Error checking registration', error: error.message });
    }
};

// Get all registrations for a test (admin)
exports.getTestRegistrations = async (req, res) => {
    try {
        const { testId } = req.params;

        const registrations = await TestRegistration.find({ testId })
            .populate('testId', 'title examType')
            .sort({ registeredAt: -1 });

        const stats = {
            total: registrations.length,
            attempted: registrations.filter(r => r.hasAttempted).length,
            notAttempted: registrations.filter(r => !r.hasAttempted).length
        };

        res.json({
            registrations,
            stats
        });
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ message: 'Error fetching registrations', error: error.message });
    }
};

// Get all registrations (admin)
exports.getAllRegistrations = async (req, res) => {
    try {
        const registrations = await TestRegistration.find()
            .populate('testId', 'title examType totalMarks')
            .sort({ registeredAt: -1 })
            .limit(100)
            .lean();

        // Fetch test results for each registration
        const registrationsWithResults = await Promise.all(
            registrations.map(async (reg) => {
                if (reg.hasAttempted && reg.testId && reg.email) {
                    // Find the test result by email AND testId
                    const result = await TestResult.findOne({
                        testId: reg.testId._id,
                        email: reg.email
                    }).sort({ completedAt: -1 }).limit(1);

                    return {
                        ...reg,
                        result: result ? {
                            marksObtained: result.marksObtained,
                            totalMarks: result.totalMarks,
                            percentage: result.percentage,
                            timeTaken: result.timeTaken
                        } : null
                    };
                }
                return reg;
            })
        );

        res.json(registrationsWithResults);
    } catch (error) {
        console.error('Error fetching all registrations:', error);
        res.status(500).json({ message: 'Error fetching registrations', error: error.message });
    }
};


// ============ FRONTEND ROUTES ============

// Get all active practice tests
exports.getAllTests = async (req, res) => {
    try {
        const tests = await PracticeTest.find({ isActive: true })
            .sort({ startDate: 1, order: 1 });

        const now = new Date();

        const testsWithQuestionCount = await Promise.all(tests.map(async (test) => {
            const questionCount = await PracticeQuestion.countDocuments({ testId: test._id });
            const testObj = test.toObject();

            const startDate = new Date(testObj.startDate);

            // Get end of day for the start date (23:59:59)
            const endOfStartDay = new Date(startDate);
            endOfStartDay.setHours(23, 59, 59, 999);

            // Get start of next day (00:00:00)
            const startOfNextDay = new Date(endOfStartDay);
            startOfNextDay.setMilliseconds(startOfNextDay.getMilliseconds() + 1);

            // 24 hours after the next day starts (when missed tests should be hidden)
            const hideAfter = new Date(startOfNextDay.getTime() + (24 * 60 * 60 * 1000));

            // Determine test status
            let status;
            if (now < startDate) {
                // Test hasn't started yet
                status = 'upcoming';
            } else if (now >= startDate && now <= endOfStartDay) {
                // Test is active (same day as start date, before midnight)
                status = 'active';
            } else if (now > endOfStartDay && now < hideAfter) {
                // Test was missed (after midnight but within 24 hours of next day)
                status = 'missed';
            } else {
                // Test should be hidden (more than 24 hours after the day ended)
                status = 'completed';
            }

            return {
                ...testObj,
                questionCount,
                status
            };
        }));

        // Separate active, missed, and upcoming tests (exclude completed tests)
        const activeTests = testsWithQuestionCount.filter(t => t.status === 'active');
        const missedTests = testsWithQuestionCount.filter(t => t.status === 'missed');
        const upcomingTests = testsWithQuestionCount.filter(t => t.status === 'upcoming');

        res.json({
            active: [...activeTests, ...missedTests], // Include missed tests in active tab
            upcoming: upcomingTests,
            all: testsWithQuestionCount
        });
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({ message: 'Error fetching tests', error: error.message });
    }
};

// Get test details with questions
exports.getTestById = async (req, res) => {
    try {
        const { testId } = req.params;

        const test = await PracticeTest.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if test is available (after startDate)
        const now = new Date();
        const startDate = new Date(test.startDate);

        if (startDate > now) {
            return res.status(403).json({
                message: 'This test is not available yet',
                startDate: test.startDate,
                status: 'upcoming'
            });
        }

        const questions = await PracticeQuestion.find({ testId })
            .sort({ order: 1 })
            .select('-correctAnswer -explanation'); // Don't send answers to frontend initially

        res.json({
            test,
            questions: questions.map(q => ({
                _id: q._id,
                question: q.question,
                options: q.options,
                marks: q.marks,
                negativeMarks: q.negativeMarks
            }))
        });
    } catch (error) {
        console.error('Error fetching test:', error);
        res.status(500).json({ message: 'Error fetching test', error: error.message });
    }
};

// Submit test and get results
exports.submitTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const { userId = 'guest', answers, timeTaken, email } = req.body;

        const test = await PracticeTest.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        const questions = await PracticeQuestion.find({ testId }).sort({ order: 1 });

        // Calculate results
        let marksObtained = 0;
        const evaluatedAnswers = answers.map((answer) => {
            const question = questions.find(q => q._id.toString() === answer.questionId);
            if (!question) return null;

            const isCorrect = answer.selectedAnswer === question.correctAnswer;
            const marks = isCorrect ? question.marks : -question.negativeMarks;
            marksObtained += marks;

            return {
                questionId: question._id,
                selectedAnswer: answer.selectedAnswer,
                isCorrect,
                marksObtained: marks
            };
        }).filter(Boolean);

        const percentage = (marksObtained / test.totalMarks) * 100;

        // Save result
        const result = new TestResult({
            userId,
            email, // Store email for linking with registration
            testId,
            answers: evaluatedAnswers,
            totalMarks: test.totalMarks,
            marksObtained,
            percentage,
            timeTaken
        });

        await result.save();

        // Mark registration as attempted
        if (email) {
            await TestRegistration.findOneAndUpdate(
                { testId, email },
                {
                    hasAttempted: true,
                    attemptedAt: new Date()
                }
            );
        }

        // Return detailed results with correct answers
        const detailedResults = questions.map(question => {
            const userAnswer = answers.find(a => a.questionId === question._id.toString());
            const selectedAnswer = userAnswer ? userAnswer.selectedAnswer : null;
            const isCorrect = selectedAnswer === question.correctAnswer;

            return {
                _id: question._id,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                selectedAnswer,
                isCorrect,
                explanation: question.explanation,
                marks: question.marks
            };
        });

        res.json({
            resultId: result._id,
            marksObtained,
            totalMarks: test.totalMarks,
            percentage,
            passed: marksObtained >= test.passingMarks,
            questions: detailedResults
        });
    } catch (error) {
        console.error('Error submitting test:', error);
        res.status(500).json({ message: 'Error submitting test', error: error.message });
    }
};

// Get user's test history
exports.getUserResults = async (req, res) => {
    try {
        const { userId = 'guest' } = req.query;

        const results = await TestResult.find({ userId })
            .populate('testId', 'title totalMarks')
            .sort({ completedAt: -1 })
            .limit(10);

        res.json(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ message: 'Error fetching results', error: error.message });
    }
};

// ============ ADMIN ROUTES ============

// Get all tests (admin)
exports.getAllTestsAdmin = async (req, res) => {
    try {
        const tests = await PracticeTest.find().sort({ createdAt: -1 });

        const testsWithCount = await Promise.all(tests.map(async (test) => {
            const questionCount = await PracticeQuestion.countDocuments({ testId: test._id });
            return {
                ...test.toObject(),
                questionCount
            };
        }));

        res.json(testsWithCount);
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({ message: 'Error fetching tests', error: error.message });
    }
};

// Create test (admin)
exports.createTest = async (req, res) => {
    try {
        const test = new PracticeTest(req.body);
        await test.save();

        // Clear cache so frontend updates immediately
        if (clearCache) clearCache('practice-tests');

        res.status(201).json(test);
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ message: 'Error creating test', error: error.message });
    }
};

// Update test (admin)
exports.updateTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const test = await PracticeTest.findByIdAndUpdate(testId, req.body, { new: true });
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Recalculate marks if totalMarks might have changed
        if (req.body.totalMarks) {
            await recalculateMarks(test._id);
        }

        // Clear cache so frontend updates immediately
        if (clearCache) clearCache('practice-tests');

        res.json(test);
    } catch (error) {
        console.error('Error updating test:', error);
        res.status(500).json({ message: 'Error updating test', error: error.message });
    }
};

// Delete test (admin)
exports.deleteTest = async (req, res) => {
    try {
        const { testId } = req.params;

        // Delete all questions
        await PracticeQuestion.deleteMany({ testId });

        // Delete all results
        await TestResult.deleteMany({ testId });

        // Delete test
        const test = await PracticeTest.findByIdAndDelete(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Clear cache so frontend updates immediately
        if (clearCache) clearCache('practice-tests');

        res.json({ message: 'Test deleted successfully' });
    } catch (error) {
        console.error('Error deleting test:', error);
        res.status(500).json({ message: 'Error deleting test', error: error.message });
    }
};

// Get questions for a test (admin)
exports.getQuestionsAdmin = async (req, res) => {
    try {
        const { testId } = req.params;
        const questions = await PracticeQuestion.find({ testId }).sort({ order: 1 });
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
};

// Create question (admin)
exports.createQuestion = async (req, res) => {
    try {
        const question = new PracticeQuestion(req.body);
        await question.save();

        // Recalculate marks for all questions in this test
        await recalculateMarks(question.testId);

        // Clear cache so frontend updates immediately
        if (clearCache) clearCache('practice-tests');

        res.status(201).json(question);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ message: 'Error creating question', error: error.message });
    }
};

// Update question (admin)
exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await PracticeQuestion.findByIdAndUpdate(questionId, req.body, { new: true });
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Clear cache so frontend updates immediately
        if (clearCache) clearCache('practice-tests');

        res.json(question);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: 'Error updating question', error: error.message });
    }
};

// Delete question (admin)
exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await PracticeQuestion.findByIdAndDelete(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Recalculate marks for remaining questions
        if (question.testId) {
            await recalculateMarks(question.testId);
        }

        // Clear cache so frontend updates immediately
        if (clearCache) clearCache('practice-tests');

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: 'Error deleting question', error: error.message });
    }
};

// Delete registration (admin)
exports.deleteRegistration = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const registration = await TestRegistration.findById(registrationId);

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        // Delete associated test result if it exists to allow fresh re-take
        if (registration.email && registration.testId) {
            await TestResult.findOneAndDelete({
                testId: registration.testId,
                email: registration.email
            });
        }

        await TestRegistration.findByIdAndDelete(registrationId);

        res.json({ message: 'Registration and associated result deleted successfully' });
    } catch (error) {
        console.error('Error deleting registration:', error);
        res.status(500).json({ message: 'Error deleting registration', error: error.message });
    }
};
