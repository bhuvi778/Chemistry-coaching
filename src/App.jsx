import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { useEffect } from 'react';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/UI/ScrollToTopButton';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ParticleCanvas from './components/UI/ParticleCanvas';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import AllCourses from './pages/AllCourses';
import Lectures from './pages/Lectures';
import AudioBooks from './pages/AudioBooks';
import StudyMaterials from './pages/StudyMaterials';
import Magazines from './pages/Magazines';
import Puzzle from './pages/Puzzle';
import Community from './pages/Community';
import ScoreMatchBatches from './pages/ScoreMatchBatches';
import FreeQuiz from './pages/FreeQuiz';
import BookMeeting from './pages/BookMeeting';
import AIAssistantPage from './pages/AIAssistantPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';

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
      <ScrollToTop />
      <ParticleCanvas />
      <Navbar />

      <div className="pt-20 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/audiobooks" element={<AudioBooks />} />
          <Route path="/study-materials" element={<StudyMaterials />} />
          <Route path="/magazines" element={<Magazines />} />
          <Route path="/puzzles" element={<Puzzle />} />
          <Route path="/community" element={<Community />} />
          <Route path="/score-max-batches" element={<ScoreMatchBatches />} />
          <Route path="/free-quiz" element={<FreeQuiz />} />
          <Route path="/book-meeting" element={<BookMeeting />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/contact" element={<Contact />} />
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