import { createContext, useState, useEffect, useContext } from 'react';

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

  // Magazines State
  const [magazines, setMagazines] = useState([]);

  // Auth State
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('reaction_isAdmin') === 'true';
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Cache management - 1 hour cache
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
  const getCachedData = (key) => {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
    return data;
  };

  const setCachedData = (key, data) => {
    localStorage.setItem(`cache_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  // Fetch with timeout
  const fetchWithTimeout = (url, timeout = 10000) => {
    return Promise.race([
      fetch(url),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
  };

  // Fetch data from backend with caching and parallel requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to load from cache first
        const cachedCourses = getCachedData('courses');
        const cachedVideos = getCachedData('videos');
        const cachedAudioBooks = getCachedData('audiobooks');
        const cachedStudyMaterials = getCachedData('study-materials');
        const cachedMagazines = getCachedData('magazines');

        if (cachedCourses) setCourses(cachedCourses);
        if (cachedVideos) setVideos(cachedVideos);
        if (cachedAudioBooks) setAudioBooks(cachedAudioBooks);
        if (cachedStudyMaterials) setStudyMaterials(cachedStudyMaterials);
        if (cachedMagazines) setMagazines(cachedMagazines);

        // Fetch all data in parallel with timeout
        const [coursesData, videosData, audioBooksResponse, studyMaterialsData, magazinesData, enquiriesData, contactsData] = await Promise.all([
          fetchWithTimeout(`${API_URL}/courses`).then(r => r.json()).catch(() => cachedCourses || []),
          fetchWithTimeout(`${API_URL}/videos`).then(r => r.json()).catch(() => cachedVideos || []),
          fetchWithTimeout(`${API_URL}/audiobooks?limit=100`).then(r => r.json()).catch(() => ({ audioBooks: cachedAudioBooks || [] })),
          fetchWithTimeout(`${API_URL}/study-materials`).then(r => r.json()).catch(() => cachedStudyMaterials || []),
          fetchWithTimeout(`${API_URL}/magazines`).then(r => r.json()).catch(() => cachedMagazines || []),
          isAdmin ? fetchWithTimeout(`${API_URL}/enquiries`).then(r => r.json()).catch(() => []) : Promise.resolve([]),
          isAdmin ? fetchWithTimeout(`${API_URL}/contacts`).then(r => r.json()).catch(() => []) : Promise.resolve([])
        ]);

        // Handle audiobooks response (might be paginated)
        const audioBooksData = audioBooksResponse.audioBooks || audioBooksResponse;

        // Update state and cache
        setCourses(coursesData);
        setVideos(videosData);
        setAudioBooks(audioBooksData);
        setStudyMaterials(studyMaterialsData);
        setMagazines(magazinesData);
        
        setCachedData('courses', coursesData);
        setCachedData('videos', videosData);
        setCachedData('audiobooks', audioBooksData);
        setCachedData('study-materials', studyMaterialsData);
        setCachedData('magazines', magazinesData);

        if (isAdmin) {
          setEnquiries(enquiriesData);
          setContacts(contactsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
      
      setEnquiries(enquiries.filter(enq => enq._id !== id));
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
      setContacts([newContact, ...contacts]);
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
      
      setContacts(contacts.filter(contact => contact._id !== id));
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
      setCourses([...courses, newCourse]);
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
      setCourses(courses.map(c => c._id === id ? data : c));
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE'
      });
      setCourses(courses.filter(c => c._id !== id));
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
      const newVideo = await res.json();
      setVideos([newVideo, ...videos]);
    } catch (error) {
      console.error("Error adding video:", error);
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
      setVideos(videos.map(v => v._id === id ? data : v));
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  const deleteVideo = async (id) => {
    try {
      await fetch(`${API_URL}/videos/${id}`, {
        method: 'DELETE'
      });
      setVideos(videos.filter(v => v._id !== id));
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
      const newAudioBook = await res.json();
      setAudioBooks([newAudioBook, ...audioBooks]);
    } catch (error) {
      console.error("Error adding audio book:", error);
    }
  };

  const updateAudioBook = async (id, updatedAudioBook) => {
    try {
      const res = await fetch(`${API_URL}/audiobooks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAudioBook)
      });
      const data = await res.json();
      setAudioBooks(audioBooks.map(a => a._id === id ? data : a));
    } catch (error) {
      console.error("Error updating audio book:", error);
    }
  };

  const deleteAudioBook = async (id) => {
    try {
      await fetch(`${API_URL}/audiobooks/${id}`, {
        method: 'DELETE'
      });
      setAudioBooks(audioBooks.filter(a => a._id !== id));
    } catch (error) {
      console.error("Error deleting audio book:", error);
    }
  };

  // Study Materials CRUD
  const addStudyMaterial = async (material) => {
    try {
      const res = await fetch(`${API_URL}/study-materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material)
      });
      const newMaterial = await res.json();
      setStudyMaterials([newMaterial, ...studyMaterials]);
    } catch (error) {
      console.error("Error adding study material:", error);
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
      setStudyMaterials(studyMaterials.map(m => m._id === id ? data : m));
    } catch (error) {
      console.error("Error updating study material:", error);
    }
  };

  const deleteStudyMaterial = async (id) => {
    try {
      await fetch(`${API_URL}/study-materials/${id}`, {
        method: 'DELETE'
      });
      setStudyMaterials(studyMaterials.filter(m => m._id !== id));
    } catch (error) {
      console.error("Error deleting study material:", error);
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
      setMagazines([newMagazine, ...magazines]);
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
      setMagazines(magazines.map(m => m._id === id ? data : m));
    } catch (error) {
      console.error("Error updating magazine:", error);
    }
  };

  const deleteMagazine = async (id) => {
    try {
      await fetch(`${API_URL}/magazines/${id}`, {
        method: 'DELETE'
      });
      setMagazines(magazines.filter(m => m._id !== id));
    } catch (error) {
      console.error("Error deleting magazine:", error);
    }
  };

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      // Fetch enquiries and contacts immediately after login
      fetchEnquiriesAndContacts();
      return true;
    }
    return false;
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
      magazines,
      isAdmin,
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
      addMagazine,
      updateMagazine,
      deleteMagazine,
      login,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
};