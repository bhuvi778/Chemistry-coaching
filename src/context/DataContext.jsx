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

  // Clear all cache on mount
  useEffect(() => {
    const clearAllCache = () => {
      const cacheKeys = ['cache_version', 'cache_courses', 'cache_videos', 'cache_audiobooks', 'cache_study-materials', 'cache_magazines'];
      cacheKeys.forEach(key => localStorage.removeItem(key));
      console.log('✅ All cache cleared - fetching fresh data from API');
    };
    clearAllCache();
  }, []);

  // Fetch with timeout
  const fetchWithTimeout = (url, timeout = 10000) => {
    return Promise.race([
      fetch(url),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Add cache-busting timestamp to force fresh data
        const cacheBuster = `?_t=${Date.now()}`;
        
        // Fetch all data in parallel with timeout
        const [coursesData, videosData, audioBooksResponse, studyMaterialsData, magazinesData, enquiriesData, contactsData] = await Promise.all([
          fetchWithTimeout(`${API_URL}/courses${cacheBuster}`).then(r => r.json()).catch(err => {
            console.error('❌ Courses fetch error:', err);
            return [];
          }),
          fetchWithTimeout(`${API_URL}/videos${isAdmin ? '?all=true&' : '?'}_t=${Date.now()}`).then(r => r.json()).catch(err => {
            console.error('❌ Videos fetch error:', err);
            return [];
          }),
          fetchWithTimeout(`${API_URL}/audiobooks?limit=100&_t=${Date.now()}`).then(r => r.json()).catch(err => {
            console.error('❌ Audiobooks fetch error:', err);
            return { audioBooks: [] };
          }),
          fetchWithTimeout(`${API_URL}/study-materials${cacheBuster}`).then(r => r.json()).catch(() => []),
          fetchWithTimeout(`${API_URL}/magazines${cacheBuster}`).then(r => r.json()).catch(() => []),
          isAdmin ? fetchWithTimeout(`${API_URL}/enquiries${cacheBuster}`).then(r => r.json()).catch(() => []) : Promise.resolve([]),
          isAdmin ? fetchWithTimeout(`${API_URL}/contacts${cacheBuster}`).then(r => r.json()).catch(() => []) : Promise.resolve([])
        ]);

        // Ensure array helper
        const ensureArray = (data) => Array.isArray(data) ? data : [];

        // Handle audiobooks response (might be paginated)
        const audioBooksData = audioBooksResponse.audioBooks || audioBooksResponse;

        // Update state - ensure all are arrays
        setCourses(ensureArray(coursesData));
        setVideos(ensureArray(videosData));
        setAudioBooks(ensureArray(audioBooksData));
        setStudyMaterials(ensureArray(studyMaterialsData));
        setMagazines(ensureArray(magazinesData));

        if (isAdmin) {
          setEnquiries(ensureArray(enquiriesData));
          setContacts(ensureArray(contactsData));
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