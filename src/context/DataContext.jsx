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

  // Auth State
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('reaction_isAdmin') === 'true';
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Seed data first if needed
        await fetch(`${API_URL}/seed`);

        const coursesRes = await fetch(`${API_URL}/courses`);
        const coursesData = await coursesRes.json();
        setCourses(coursesData);

        const videosRes = await fetch(`${API_URL}/videos`);
        const videosData = await videosRes.json();
        setVideos(videosData);

        if (isAdmin) {
          const enquiriesRes = await fetch(`${API_URL}/enquiries`);
          const enquiriesData = await enquiriesRes.json();
          setEnquiries(enquiriesData);

          const contactsRes = await fetch(`${API_URL}/contacts`);
          const contactsData = await contactsRes.json();
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
      isAdmin,
      addEnquiry,
      addContact,
      addCourse,
      updateCourse,
      deleteCourse,
      addVideo,
      updateVideo,
      deleteVideo,
      login,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
};