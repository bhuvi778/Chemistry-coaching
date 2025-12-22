import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import ScrollToTop from './components/ScrollToTop';
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
import Doubts from './pages/Doubts';
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
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
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
          <Route path="/magazines" element={<Magazines />} />
          <Route path="/puzzles" element={<Puzzle />} />
          <Route path="/doubts" element={<Doubts />} />
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