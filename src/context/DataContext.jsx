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

  // Auth State
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('reaction_isAdmin') === 'true';
  });

  const API_URL = 'http://localhost:5000/api';

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Seed data first if needed
        await fetch(`${API_URL}/seed`);

        const coursesRes = await fetch(`${API_URL}/courses`);
        const coursesData = await coursesRes.json();
        setCourses(coursesData);

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
      const newEnquiry = await res.json();
      setEnquiries([newEnquiry, ...enquiries]);
    } catch (error) {
      console.error("Error adding enquiry:", error);
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
      const res = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      });
      const newCourse = await res.json();
      setCourses([...courses, newCourse]);
    } catch (error) {
      console.error("Error adding course:", error);
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

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return (
    <DataContext.Provider value={{
      courses,
      enquiries,
      contacts,
      isAdmin,
      addEnquiry,
      addContact,
      addCourse,
      updateCourse,
      deleteCourse,
      login,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
};