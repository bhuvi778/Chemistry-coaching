import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ParticleCanvas from './components/UI/ParticleCanvas';
import ContentProtection from './components/UI/ContentProtection';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import AllCourses from './pages/AllCourses';
import Lectures from './pages/Lectures';
import AudioBooks from './pages/AudioBooks';
import StudyMaterials from './pages/StudyMaterials';
import Puzzle from './pages/Puzzle';
import Magazines from './pages/Magazines';
import AIAssistantPage from './pages/AIAssistantPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import BookMeeting from './pages/BookMeeting';
import Doubts from './pages/Doubts';

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useData();
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

// Component to handle auto-logout when navigating away from admin
const AdminAutoLogout = () => {
  const location = useLocation();
  const { isAdmin, logout } = useData();

  useEffect(() => {
    // Check if user is admin and navigating to a non-admin page
    if (isAdmin && !location.pathname.startsWith('/admin')) {
      // Show popup notification
      alert('You have been automatically logged out from the admin panel.');
      // Perform logout
      logout();
    }
  }, [location.pathname, isAdmin, logout]);

  return null;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <AdminAutoLogout />
      <ContentProtection />
      <ParticleCanvas />
      <Navbar />

      <div className="pt-20 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/audiobooks" element={<AudioBooks />} />
          <Route path="/study-materials" element={<StudyMaterials />} />
          <Route path="/puzzle" element={<Puzzle />} />
          <Route path="/magazines" element={<Magazines />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-meeting" element={<BookMeeting />} />
          <Route path="/doubts" element={<Doubts />} />
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
        </Routes>
      </div>

      <Footer />
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