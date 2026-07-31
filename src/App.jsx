import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { useEffect, Suspense } from 'react';
import { lazyWithRetry as lazy } from './utils/lazyLoad';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/UI/ScrollToTopButton';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ParticleCanvas from './components/UI/ParticleCanvas';
import LoadingFallback from './components/UI/LoadingFallback';
import SeoHead from './components/SeoHead';

// Lazy load pages (with retry logic for deployment updates)
const Homepage = lazy(() => import('./pages/Homepage'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Lectures = lazy(() => import('./pages/Lectures'));
const AudioBooks = lazy(() => import('./pages/AudioBooks'));
const StudyMaterials = lazy(() => import('./pages/StudyMaterials'));
const Magazines = lazy(() => import('./pages/Magazines'));
const Puzzle = lazy(() => import('./pages/Puzzle'));
const Community = lazy(() => import('./pages/Community'));
const ChemSnaps = lazy(() => import('./pages/ChemSnaps'));
const ConceptWiseNotes = lazy(() => import('./pages/ConceptWiseNotes'));
const FreeQuiz = lazy(() => import('./pages/FreeQuiz'));
const FreeQuizSession = lazy(() => import('./pages/FreeQuizSession'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const FlashCards = lazy(() => import('./pages/FlashCards'));
const FlashCardTopics = lazy(() => import('./pages/FlashCardTopics'));
const FlashCardPractice = lazy(() => import('./pages/FlashCardPractice'));
const AssertionReason = lazy(() => import('./pages/AssertionReason'));
const AssertionReasonChapter = lazy(() => import('./pages/AssertionReasonChapter'));
const AssertionReasonPractice = lazy(() => import('./pages/AssertionReasonPractice'));
const MyDailyTarget = lazy(() => import('./pages/MyDailyTarget'));
const PracticeTest = lazy(() => import('./pages/PracticeTest'));
const PracticeTestResults = lazy(() => import('./pages/PracticeTestResults'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ConceptCardDemo = lazy(() => import('./pages/ConceptCardDemo'));
const AllCourses = lazy(() => import('./pages/AllCourses'));
const NCERTToolbox = lazy(() => import('./pages/NCERTToolbox'));
const NCERTLineByLine = lazy(() => import('./pages/NCERTLineByLine'));
const NCERTLineByLineTopics = lazy(() => import('./pages/NCERTLineByLineTopics'));
const NCERTLineByLineTopic = lazy(() => import('./pages/NCERTLineByLineTopic'));
const NCERTQuestionViewer = lazy(() => import('./pages/NCERTQuestionViewer'));
const NCERTTypeChapters = lazy(() => import('./pages/NCERTTypeChapters'));
const NCERTQuestions = lazy(() => import('./pages/NCERTQuestions'));
const NCERTExemplars = lazy(() => import('./pages/NCERTExemplars'));
const NCERTDiagrams = lazy(() => import('./pages/NCERTDiagrams'));
const NTAAbhyas = lazy(() => import('./pages/NTAAbhyas'));
const NTAAbhyasChapters = lazy(() => import('./pages/NTAAbhyasChapters'));
const NTAAbhyasQuestions = lazy(() => import('./pages/NTAAbhyasQuestions'));
const DPPS = lazy(() => import('./pages/DPPS'));
const DPPSQuestions = lazy(() => import('./pages/DPPSQuestions'));
const DPPSTest = lazy(() => import('./pages/DPPSTest'));
const DPPSTestResults = lazy(() => import('./pages/DPPSTestResults'));
const PYQExamSelection = lazy(() => import('./pages/PYQExamSelection'));
const PYQChapterList = lazy(() => import('./pages/PYQChapterList'));
const PYQTopicList = lazy(() => import('./pages/PYQTopicList'));
const PYQPractice = lazy(() => import('./pages/PYQPractice'));
const InfinitePracticeHome = lazy(() => import('./pages/InfinitePractice/InfinitePracticeHome'));
const InfinitePracticeSession = lazy(() => import('./pages/InfinitePractice/InfinitePracticeSession'));
const InfinitePracticeResults = lazy(() => import('./pages/InfinitePractice/InfinitePracticeResults'));
const SelfLearnLanding = lazy(() => import('./pages/SelfLearn/SelfLearnLanding'));
const SelfLearnSubjects = lazy(() => import('./pages/SelfLearn/SelfLearnSubjects'));
const SelfLearnChapters = lazy(() => import('./pages/SelfLearn/SelfLearnChapters'));
const SelfLearnChapterDetail = lazy(() => import('./pages/SelfLearn/SelfLearnChapterDetail'));
const TopicDetail = lazy(() => import('./pages/SelfLearn/TopicDetail'));
const NeetExam = lazy(() => import('./pages/Exams/NeetExam'));
const JeeExam = lazy(() => import('./pages/Exams/JeeExam'));
import ExamCountdown from './components/ExamCountdown';
import LeadCapturePopup from './components/LeadCapturePopup';

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useData();
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Initialize userId for flashcard progress tracking
    if (!localStorage.getItem('userId')) {
      // Generate a unique ID for this browser/user
      const userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('userId', userId);
    }

    // Disable right-click, copy, cut, paste for non-admin pages
    const handleContextMenu = (e) => {
      if (!isAdminRoute) {
        e.preventDefault();
        return false;
      }
    };

    const handleCopy = (e) => {
      if (!isAdminRoute) {
        e.preventDefault();
        return false;
      }
    };

    const handleCut = (e) => {
      if (!isAdminRoute) {
        e.preventDefault();
        return false;
      }
    };

    const handlePaste = (e) => {
      if (!isAdminRoute) {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection via CSS for non-admin pages
    if (!isAdminRoute) {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.msUserSelect = 'none';
    } else {
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
      document.body.style.msUserSelect = 'auto';
    }

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
      document.body.style.msUserSelect = 'auto';
    };
  }, [isAdminRoute]);

  return (
    <div className="min-h-screen flex flex-col">
      <SeoHead />
      <Toaster position="top-right" />
      <ScrollToTop />
      <ParticleCanvas />
      <Navbar />
      {!isAdminRoute && <ExamCountdown />}
      {!isAdminRoute && <LeadCapturePopup />}

      <div className="pt-20 flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/courses" element={<AllCourses />} />
            <Route path="/about" element={<About />} />
            <Route path="/lectures" element={<Lectures />} />
            <Route path="/audiobooks" element={<AudioBooks />} />
            <Route path="/study-materials" element={<StudyMaterials />} />
            <Route path="/magazines" element={<Magazines />} />
            <Route path="/puzzles" element={<Puzzle />} />
            <Route path="/chemsnaps" element={<ChemSnaps />} />
            <Route path="/concept-wise-notes" element={<ConceptWiseNotes />} />
            <Route path="/concept-card-demo" element={<ConceptCardDemo />} />
            <Route path="/flash-cards" element={<FlashCards />} />
            <Route path="/flash-cards/:chapterId" element={<FlashCardTopics />} />
            <Route path="/flash-cards/:chapterId/practice" element={<FlashCardPractice />} />
            <Route path="/assertion-reason" element={<AssertionReason />} />
            <Route path="/assertion-reason/:chapterId" element={<AssertionReasonChapter />} />
            <Route path="/assertion-reason/:chapterId/practice" element={<AssertionReasonPractice />} />
            <Route path="/my-daily-target" element={<MyDailyTarget />} />
            <Route path="/ncert-toolbox" element={<NCERTToolbox />} />
            <Route path="/ncert-toolbox/line-by-line" element={<NCERTLineByLine />} />
            <Route path="/ncert-toolbox/line-by-line/:chapterId" element={<NCERTLineByLineTopics />} />
            <Route path="/ncert-toolbox/line-by-line/:badgeId" element={<NCERTLineByLine />} />
            <Route path="/ncert-toolbox/line-by-line/:chapterId/topic/:topicId" element={<NCERTLineByLineTopic />} />
            <Route path="/ncert-toolbox/questions" element={<NCERTQuestions />} />
            <Route path="/ncert-toolbox/questions/:typeId/questions" element={<NCERTQuestionViewer />} />
            <Route path="/ncert-toolbox/questions/:typeId/practice" element={<NCERTQuestionViewer />} />
            <Route path="/ncert-toolbox/questions/:typeId" element={<NCERTTypeChapters />} />
            <Route path="/ncert-toolbox/questions/:typeId/chapter/:chapterId" element={<NCERTQuestionViewer />} />
            <Route path="/ncert-toolbox/exemplars" element={<NCERTExemplars />} />
            <Route path="/ncert-toolbox/exemplars/:typeId/questions" element={<NCERTQuestionViewer />} />
            <Route path="/ncert-toolbox/exemplars/:typeId/practice" element={<NCERTQuestionViewer />} />
            <Route path="/ncert-toolbox/exemplars/:typeId" element={<NCERTTypeChapters />} />
            <Route path="/ncert-toolbox/exemplars/:typeId/chapter/:chapterId" element={<NCERTQuestionViewer />} />
            <Route path="/ncert-toolbox/diagrams" element={<NCERTDiagrams />} />
            <Route path="/ncert-toolbox/diagrams/:typeId/questions" element={<NCERTQuestionViewer />} />
            <Route path="/ncert-toolbox/diagrams/:typeId/practice" element={<NCERTQuestionViewer />} />
            <Route path="/ncert-toolbox/diagrams/:typeId" element={<NCERTTypeChapters />} />
            <Route path="/ncert-toolbox/diagrams/:typeId/chapter/:chapterId" element={<NCERTQuestionViewer />} />
            <Route path="/ncert-toolbox/nta-abhyas" element={<NTAAbhyas />} />
            <Route path="/ncert-toolbox/nta-abhyas/:examCategory" element={<NTAAbhyasChapters />} />
            <Route path="/ncert-toolbox/nta-abhyas/:examCategory/:chapter" element={<NTAAbhyasQuestions />} />
            <Route path="/dpps" element={<DPPS />} />
            <Route path="/dpps/test/:chapterId" element={<DPPSTest />} />
            <Route path="/dpps/results/:sessionId" element={<DPPSTestResults />} />
            <Route path="/dpps/:chapterId" element={<DPPSQuestions />} />
            <Route path="/pyq" element={<PYQExamSelection />} />
            <Route path="/pyq/:examName/chapters" element={<PYQChapterList />} />
            <Route path="/pyq/:examName/chapters/:chapterId" element={<PYQTopicList />} />
            <Route path="/pyq/:examName/chapters/:chapterId/:topicId" element={<PYQPractice />} />
            <Route path="/infinite-practice" element={<InfinitePracticeHome />} />
            <Route path="/infinite-practice/session/:sessionId" element={<InfinitePracticeSession />} />
            <Route path="/infinite-practice/results/:sessionId" element={<InfinitePracticeResults />} />
            <Route path="/self-learn" element={<SelfLearnLanding />} />
            <Route path="/self-learn/:examId" element={<SelfLearnChapters />} />
            <Route path="/self-learn/:examId/:chapterId" element={<SelfLearnChapterDetail />} />
            <Route path="/self-learn/topics/:topicId" element={<TopicDetail />} />
            <Route path="/practice-test/:testId" element={<PracticeTest />} />
            <Route path="/practice-test/:testId/results" element={<PracticeTestResults />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/community" element={<Community />} />
            <Route path="/free-quiz" element={<FreeQuiz />} />
            <Route path="/free-quiz/:quizId" element={<FreeQuizSession />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/exams/neet" element={<NeetExam />} />
            <Route path="/exams/neet/:sectionId" element={<NeetExam />} />
            <Route path="/exams/jee" element={<JeeExam />} />
            <Route path="/exams/jee/:sectionId" element={<JeeExam />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* Catch all undefined routes and redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
