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

  // Webinar Settings State
  const [webinarSettings, setWebinarSettings] = useState({
    title: 'Demo Webinar',
    description: 'Webinar - Description',
    type: 'Webinar',
    date: '',
    time: '14:30',
    timezone: 'IST',
    isActive: true
  });

  // Meeting Requests State
  const [meetingRequests, setMeetingRequests] = useState([]);

  // Auth State
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('reaction_isAdmin') === 'true';
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use bulk API endpoint to get all public data in ONE request (MUCH FASTER!)
        const bulkRes = await fetch(`${API_URL}/bulk`);
        const bulkData = await bulkRes.json();

        // Set all data at once
        setCourses(bulkData.courses || []);
        setVideos(bulkData.videos || []);
        setAudioBooks(bulkData.audioBooks || []);
        setStudyMaterials(bulkData.studyMaterials || []);
        setMagazines(bulkData.magazines || []);

        // Fetch webinar settings from localStorage
        const storedWebinarSettings = localStorage.getItem('webinarSettings');
        if (storedWebinarSettings) {
          setWebinarSettings(JSON.parse(storedWebinarSettings));
        }

        // Fetch admin data separately if user is admin
        if (isAdmin) {
          const adminRes = await fetch(`${API_URL}/bulk/admin`);
          const adminData = await adminRes.json();

          setEnquiries(adminData.enquiries || []);
          setContacts(adminData.contacts || []);
          setMeetingRequests(adminData.meetingRequests || []);
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
      console.log('Sending audio book data:', audioBook);
      const res = await fetch(`${API_URL}/audiobooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(audioBook)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const newAudioBook = await res.json();
      console.log('Audio book added successfully:', newAudioBook);
      setAudioBooks([newAudioBook, ...audioBooks]);
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
      console.log('Sending study material data:', material);
      const res = await fetch(`${API_URL}/study-materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const newMaterial = await res.json();
      console.log('Study material added successfully:', newMaterial);
      setStudyMaterials([newMaterial, ...studyMaterials]);
      return newMaterial;
    } catch (error) {
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
      console.log('Sending magazine data:', magazine);
      const res = await fetch(`${API_URL}/magazines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(magazine)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const newMagazine = await res.json();
      console.log('Magazine added successfully:', newMagazine);
      setMagazines([newMagazine, ...magazines]);
      return newMagazine;
    } catch (error) {
      console.error("Error adding magazine:", error);
      throw error;
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
    // Get stored credentials or use defaults
    const storedUsername = localStorage.getItem('admin_username') || 'admin';
    const storedPassword = localStorage.getItem('admin_password') || 'admin123';

    if (username === storedUsername && password === storedPassword) {
      setIsAdmin(true);
      // Fetch enquiries and contacts immediately after login
      fetchEnquiriesAndContacts();
      return true;
    }
    return false;
  };

  const fetchEnquiriesAndContacts = async () => {
    try {
      const adminRes = await fetch(`${API_URL}/bulk/admin`);
      const adminData = await adminRes.json();

      setEnquiries(adminData.enquiries || []);
      setContacts(adminData.contacts || []);
      setMeetingRequests(adminData.meetingRequests || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  // Webinar Settings Management
  const updateWebinarSettings = (settings) => {
    setWebinarSettings(settings);
    localStorage.setItem('webinarSettings', JSON.stringify(settings));
  };

  // Meeting Requests Management
  const addMeetingRequest = async (request) => {
    try {
      const requestData = {
        ...request,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };

      const res = await fetch(`${API_URL}/meeting-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const newRequest = await res.json();
      setMeetingRequests([newRequest, ...meetingRequests]);
      return newRequest;
    } catch (error) {
      console.error("Error adding meeting request:", error);
      throw error;
    }
  };

  const deleteMeetingRequest = async (id) => {
    try {
      await fetch(`${API_URL}/meeting-requests/${id}`, {
        method: 'DELETE'
      });
      setMeetingRequests(meetingRequests.filter(r => r._id !== id));
    } catch (error) {
      console.error("Error deleting meeting request:", error);
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
      addContact,
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
      meetingRequests,
      addMeetingRequest,
      deleteMeetingRequest,
      webinarSettings,
      updateWebinarSettings,
      login,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
};