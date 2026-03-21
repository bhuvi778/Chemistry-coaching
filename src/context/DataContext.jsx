import { createContext, useState, useEffect, useContext, useRef } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // Courses State
  const [courses, setCourses] = useState([]);

  // Enquiries State (from Home page callback form)
  const [enquiries, setEnquiries] = useState([]);

  // Contacts State (from Contact Us page)
  const [contacts, setContacts] = useState([]);

  // Videos State
  const [videos, setVideos] = useState([]);

  // Audio Books State
  const [audioBooks, setAudioBooks] = useState([]);

  // Study Materials State
  const [studyMaterials, setStudyMaterials] = useState([]);

  // ChemSnaps State
  const [chemSnaps, setChemSnaps] = useState([]);

  // Magazines State
  const [magazines, setMagazines] = useState([]);

  // Score Max Batches State
  const [scoreMatchBatches, setScoreMatchBatches] = useState([]);

  // Free Quizzes State
  const [freeQuizzes, setFreeQuizzes] = useState([]);

  // Auth State
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('reaction_isAdmin') === 'true';
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // In-flight request deduplication — prevents double-fetching when two components
  // call the same ensure* before state is set from the first call
  const pendingFetches = useRef(new Map());

  const SESSION_TTL = 30 * 60 * 1000; // 30 min — data doesn't change that often

  const sessionGet = (key) => {
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return null;
      const { data, ts } = JSON.parse(item);
      if (Date.now() - ts > SESSION_TTL) { sessionStorage.removeItem(key); return null; }
      return data;
    } catch { return null; }
  };
  const sessionSet = (key, data) => {
    try { sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch { }
  };

  // Generic fetch — deduplicates simultaneous calls for the same resource
  const fetchResource = (url, cacheKey) => {
    // 1. Hit sessionStorage first (instant, no network)
    const cached = sessionGet(cacheKey);
    if (cached) return Promise.resolve(cached);

    // 2. If same resource is already being fetched, return same promise (no double fetch)
    if (pendingFetches.current.has(cacheKey)) {
      return pendingFetches.current.get(cacheKey);
    }

    // 3. New fetch
    const promise = fetch(url)
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : (data.audioBooks || data || []);
        sessionSet(cacheKey, arr);
        pendingFetches.current.delete(cacheKey);
        return arr;
      })
      .catch(err => {
        console.error(`Fetch failed for ${cacheKey}:`, err);
        pendingFetches.current.delete(cacheKey);
        return [];
      });

    pendingFetches.current.set(cacheKey, promise);
    return promise;
  };

  // Prefetch homepage-critical data as soon as browser is idle
  useEffect(() => {
    const prefetch = () => {
      fetchResource(`${API_URL}/courses`, 'courses').then(data => { if (data.length > 0) setCourses(data); });
      fetchResource(`${API_URL}/score-match-batches`, 'score-match-batches').then(data => { if (data.length > 0) setScoreMatchBatches(data); });
    };
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(prefetch, { timeout: 3000 });
    } else {
      setTimeout(prefetch, 800);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Lazy loaders — each page calls only what it needs
  const ensureCoursesLoaded = async () => {
    if (courses.length > 0) return;
    const data = await fetchResource(`${API_URL}/courses`, 'courses');
    if (data.length > 0) setCourses(data);
  };
  const ensureVideosLoaded = async () => {
    if (videos.length > 0) return;
    const data = await fetchResource(`${API_URL}/videos`, 'videos');
    if (data.length > 0) setVideos(data);
  };
  const ensureAudioBooksLoaded = async () => {
    if (audioBooks.length > 0) return;
    const data = await fetchResource(`${API_URL}/audiobooks?limit=20`, 'audiobooks');
    if (data.length > 0) setAudioBooks(data);
  };
  const ensureStudyMaterialsLoaded = async () => {
    if (studyMaterials.length > 0) return;
    const data = await fetchResource(`${API_URL}/study-materials`, 'study-materials');
    if (data.length > 0) setStudyMaterials(data);
  };
  const ensureChemSnapsLoaded = async () => {
    if (chemSnaps.length > 0) return;
    const data = await fetchResource(`${API_URL}/chemsnaps`, 'chemsnaps');
    if (data.length > 0) setChemSnaps(data);
  };
  const ensureMagazinesLoaded = async () => {
    if (magazines.length > 0) return;
    const data = await fetchResource(`${API_URL}/magazines`, 'magazines');
    if (data.length > 0) setMagazines(data);
  };
  const ensureScoreMatchBatchesLoaded = async () => {
    if (scoreMatchBatches.length > 0) return;
    const data = await fetchResource(`${API_URL}/score-match-batches`, 'score-match-batches');
    if (data.length > 0) setScoreMatchBatches(data);
  };
  const ensureFreeQuizzesLoaded = async () => {
    if (freeQuizzes.length > 0) return;
    const data = await fetchResource(`${API_URL}/free-quizzes`, 'free-quizzes');
    if (data.length > 0) setFreeQuizzes(data);
  };

  // Fetch admin data (enquiries + contacts) only after login
  useEffect(() => {
    if (!isAdmin) return;
    fetchEnquiriesAndContacts();
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('reaction_isAdmin', isAdmin);
  }, [isAdmin]);

  const addEnquiry = async (data) => {
    try {
      const res = await fetch(`${API_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const newEnquiry = await res.json();
      setEnquiries([newEnquiry, ...enquiries]);
      console.log('Enquiry saved successfully:', newEnquiry);
      return newEnquiry;
    } catch (error) {
      console.error("Error adding enquiry:", error);
      throw error;
    }
  };

  const deleteEnquiry = async (id) => {
    try {
      const res = await fetch(`${API_URL}/enquiries/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setEnquiries((Array.isArray(enquiries) ? enquiries : []).filter(enq => enq._id !== id));
      console.log('Enquiry deleted successfully');
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      throw error;
    }
  };

  const addContact = async (data) => {
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const newContact = await res.json();
      setContacts([newContact, ...(Array.isArray(contacts) ? contacts : [])]);
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const deleteContact = async (id) => {
    try {
      const res = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setContacts((Array.isArray(contacts) ? contacts : []).filter(contact => contact._id !== id));
      console.log('Contact deleted successfully');
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  };

  const addCourse = async (course) => {
    try {
      console.log('Sending course data:', course);
      const res = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const newCourse = await res.json();
      console.log('Course added successfully:', newCourse);
      setCourses([...(Array.isArray(courses) ? courses : []), newCourse]);
      return newCourse;
    } catch (error) {
      console.error("Error adding course:", error);
      alert(`Failed to add course: ${error.message}`);
      throw error;
    }
  };

  const updateCourse = async (id, updatedCourse) => {
    try {
      const res = await fetch(`${API_URL}/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCourse)
      });
      const data = await res.json();
      setCourses((Array.isArray(courses) ? courses : []).map(c => c._id === id ? data : c));
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE'
      });
      setCourses((Array.isArray(courses) ? courses : []).filter(c => c._id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const addVideo = async (video) => {
    try {
      const res = await fetch(`${API_URL}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));

        // Handle duplicate video error
        if (res.status === 400 && errorData.error === 'Duplicate video') {
          throw new Error('⚠️ This YouTube video has already been added to the database!');
        }

        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const newVideo = await res.json();

      const updatedVideos = [newVideo, ...(Array.isArray(videos) ? videos : [])];
      setVideos(updatedVideos);
    } catch (error) {
      console.error("Error adding video:", error);
      alert(error.message);
      throw error; // Re-throw so the component can handle it
    }
  };

  const updateVideo = async (id, updatedVideo) => {
    try {
      const res = await fetch(`${API_URL}/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedVideo)
      });
      const data = await res.json();
      const updatedVideos = (Array.isArray(videos) ? videos : []).map(v => v._id === id ? data : v);
      setVideos(updatedVideos);
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  const deleteVideo = async (id) => {
    try {
      await fetch(`${API_URL}/videos/${id}`, {
        method: 'DELETE'
      });
      const updatedVideos = (Array.isArray(videos) ? videos : []).filter(v => v._id !== id);
      setVideos(updatedVideos);
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  // Audio Books CRUD
  const addAudioBook = async (audioBook) => {
    try {
      const res = await fetch(`${API_URL}/audiobooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(audioBook)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const response = await res.json();

      // Handle response - remove success/message fields if present
      const { success, message, ...newAudioBook } = response;

      // Immediately update state with new audiobook
      setAudioBooks(prev => [newAudioBook, ...(Array.isArray(prev) ? prev : [])]);

      return newAudioBook;
    } catch (error) {
      console.error("Error adding audio book:", error);
      throw error;
    }
  };

  const updateAudioBook = async (id, updatedAudioBook) => {
    try {
      const res = await fetch(`${API_URL}/audiobooks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAudioBook)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const response = await res.json();
      const { success, message, ...data } = response;

      // Immediately update state
      setAudioBooks(prev => (Array.isArray(prev) ? prev : []).map(a => a._id === id ? data : a));

      return data;
    } catch (error) {
      console.error("Error updating audio book:", error);
      throw error;
    }
  };

  const deleteAudioBook = async (id) => {
    try {
      const res = await fetch(`${API_URL}/audiobooks/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      // Immediately update state by removing the deleted item
      setAudioBooks(prev => (Array.isArray(prev) ? prev : []).filter(a => a._id !== id));
    } catch (error) {
      console.error("Error deleting audio book:", error);
      throw error;
    }
  };

  // Study Materials CRUD
  const addStudyMaterial = async (material) => {
    try {
      // Add timeout for large files
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const res = await fetch(`${API_URL}/study-materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Upload response status:', res.status);
      const responseData = await res.json();
      console.log('Response data:', responseData);

      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to add study material');
      }

      const updatedMaterials = [responseData, ...(Array.isArray(studyMaterials) ? studyMaterials : [])];
      console.log('Updated materials count:', updatedMaterials.length);
      setStudyMaterials(updatedMaterials);

      return responseData;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error("Request timed out - file might be too large");
        throw new Error("Upload timed out. Please try with a smaller file or check your connection.");
      }
      console.error("Error adding study material:", error);
      throw error;
    }
  };

  const updateStudyMaterial = async (id, updatedMaterial) => {
    try {
      const res = await fetch(`${API_URL}/study-materials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMaterial)
      });
      const data = await res.json();
      const updatedMaterials = (Array.isArray(studyMaterials) ? studyMaterials : []).map(m => m._id === id ? data : m);
      setStudyMaterials(updatedMaterials);
    } catch (error) {
      console.error("Error updating study material:", error);
    }
  };

  const deleteStudyMaterial = async (id) => {
    try {
      await fetch(`${API_URL}/study-materials/${id}`, {
        method: 'DELETE'
      });
      const updatedMaterials = (Array.isArray(studyMaterials) ? studyMaterials : []).filter(m => m._id !== id);
      setStudyMaterials(updatedMaterials);
    } catch (error) {
      console.error("Error deleting study material:", error);
    }
  };

  // ChemSnaps CRUD
  const addChemSnap = async (chemSnap) => {
    try {
      const res = await fetch(`${API_URL}/chemsnaps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chemSnap)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const newChemSnap = await res.json();
      setChemSnaps([newChemSnap, ...(Array.isArray(chemSnaps) ? chemSnaps : [])]);
      return newChemSnap;
    } catch (error) {
      console.error("Error adding ChemSnap:", error);
      throw error;
    }
  };

  const updateChemSnap = async (id, updatedChemSnap) => {
    try {
      const res = await fetch(`${API_URL}/chemsnaps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedChemSnap)
      });
      const data = await res.json();
      setChemSnaps((Array.isArray(chemSnaps) ? chemSnaps : []).map(c => c._id === id ? data : c));
    } catch (error) {
      console.error("Error updating ChemSnap:", error);
      throw error;
    }
  };

  const deleteChemSnap = async (id) => {
    try {
      await fetch(`${API_URL}/chemsnaps/${id}`, {
        method: 'DELETE'
      });
      setChemSnaps((Array.isArray(chemSnaps) ? chemSnaps : []).filter(c => c._id !== id));
    } catch (error) {
      console.error("Error deleting ChemSnap:", error);
      throw error;
    }
  };

  // Magazines CRUD
  const addMagazine = async (magazine) => {
    try {
      const res = await fetch(`${API_URL}/magazines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(magazine)
      });
      const newMagazine = await res.json();
      const updatedMagazines = [newMagazine, ...(Array.isArray(magazines) ? magazines : [])];
      setMagazines(updatedMagazines);
    } catch (error) {
      console.error("Error adding magazine:", error);
    }
  };

  const updateMagazine = async (id, updatedMagazine) => {
    try {
      const res = await fetch(`${API_URL}/magazines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMagazine)
      });
      const data = await res.json();
      const updatedMagazines = (Array.isArray(magazines) ? magazines : []).map(m => m._id === id ? data : m);
      setMagazines(updatedMagazines);
    } catch (error) {
      console.error("Error updating magazine:", error);
    }
  };

  const deleteMagazine = async (id) => {
    try {
      await fetch(`${API_URL}/magazines/${id}`, {
        method: 'DELETE'
      });
      const updatedMagazines = (Array.isArray(magazines) ? magazines : []).filter(m => m._id !== id);
      setMagazines(updatedMagazines);
    } catch (error) {
      console.error("Error deleting magazine:", error);
    }
  };

  // Score Max Batches CRUD
  const addScoreMatchBatch = async (batch) => {
    try {
      const res = await fetch(`${API_URL}/score-match-batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const newBatch = await res.json();
      setScoreMatchBatches([...(Array.isArray(scoreMatchBatches) ? scoreMatchBatches : []), newBatch]);
      return newBatch;
    } catch (error) {
      console.error("Error adding Score Max Batch:", error);
      throw error;
    }
  };

  const updateScoreMatchBatch = async (id, updatedBatch) => {
    try {
      const res = await fetch(`${API_URL}/score-match-batches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBatch)
      });
      const data = await res.json();
      setScoreMatchBatches((Array.isArray(scoreMatchBatches) ? scoreMatchBatches : []).map(b => b._id === id ? data : b));
    } catch (error) {
      console.error("Error updating Score Max Batch:", error);
    }
  };

  const deleteScoreMatchBatch = async (id) => {
    try {
      await fetch(`${API_URL}/score-match-batches/${id}`, {
        method: 'DELETE'
      });
      setScoreMatchBatches((Array.isArray(scoreMatchBatches) ? scoreMatchBatches : []).filter(b => b._id !== id));
    } catch (error) {
      console.error("Error deleting Score Max Batch:", error);
    }
  };

  // Free Quizzes CRUD
  const addFreeQuiz = async (quiz) => {
    try {
      const res = await fetch(`${API_URL}/free-quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const newQuiz = await res.json();
      setFreeQuizzes([...(Array.isArray(freeQuizzes) ? freeQuizzes : []), newQuiz]);
      return newQuiz;
    } catch (error) {
      console.error("Error adding Free Quiz:", error);
      throw error;
    }
  };

  const updateFreeQuiz = async (id, updatedQuiz) => {
    try {
      const res = await fetch(`${API_URL}/free-quizzes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQuiz)
      });
      const data = await res.json();
      setFreeQuizzes((Array.isArray(freeQuizzes) ? freeQuizzes : []).map(q => q._id === id ? data : q));
    } catch (error) {
      console.error("Error updating Free Quiz:", error);
    }
  };

  const deleteFreeQuiz = async (id) => {
    try {
      await fetch(`${API_URL}/free-quizzes/${id}`, {
        method: 'DELETE'
      });
      setFreeQuizzes((Array.isArray(freeQuizzes) ? freeQuizzes : []).filter(q => q._id !== id));
    } catch (error) {
      console.error("Error deleting Free Quiz:", error);
    }
  };

  const login = (username, password) => {
    // Since we already validated via API in AdminLogin, just set admin state
    setIsAdmin(true);
    // Fetch enquiries and contacts immediately after login
    fetchEnquiriesAndContacts();
    return true;
  };

  const fetchEnquiriesAndContacts = async () => {
    try {
      const enquiriesRes = await fetch(`${API_URL}/enquiries`);
      const enquiriesData = await enquiriesRes.json();
      setEnquiries(enquiriesData);

      const contactsRes = await fetch(`${API_URL}/contacts`);
      const contactsData = await contactsRes.json();
      setContacts(contactsData);
    } catch (error) {
      console.error("Error fetching enquiries and contacts:", error);
    }
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return (
    <DataContext.Provider value={{
      courses,
      enquiries,
      contacts,
      videos,
      audioBooks,
      studyMaterials,
      chemSnaps,
      magazines,
      scoreMatchBatches,
      isAdmin,
      // Lazy loaders — call these from pages to load data on demand
      ensureCoursesLoaded,
      ensureVideosLoaded,
      ensureAudioBooksLoaded,
      ensureStudyMaterialsLoaded,
      ensureChemSnapsLoaded,
      ensureMagazinesLoaded,
      ensureScoreMatchBatchesLoaded,
      ensureFreeQuizzesLoaded,
      addEnquiry,
      deleteEnquiry,
      addContact,
      deleteContact,
      addCourse,
      updateCourse,
      deleteCourse,
      addVideo,
      updateVideo,
      deleteVideo,
      addAudioBook,
      updateAudioBook,
      deleteAudioBook,
      addStudyMaterial,
      updateStudyMaterial,
      deleteStudyMaterial,
      addChemSnap,
      updateChemSnap,
      deleteChemSnap,
      addMagazine,
      updateMagazine,
      deleteMagazine,
      addScoreMatchBatch,
      updateScoreMatchBatch,
      deleteScoreMatchBatch,
      freeQuizzes,
      addFreeQuiz,
      updateFreeQuiz,
      deleteFreeQuiz,
      login,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
};