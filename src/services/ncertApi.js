import axios from 'axios';

// Ideally this should use an environment variable, but for now relative path relies on proxy
// If you are using full independent URL:
const API_URL = import.meta.env.VITE_API_URL || '/api';

// ============ CHAPTER API ============

export const fetchNCERTChapters = async (category) => {
    try {
        const response = await axios.get(`${API_URL}/ncert/chapters/${category}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching NCERT chapters:', error);
        throw error;
    }
};

export const fetchNCERTChapter = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/ncert/chapters/single/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching NCERT chapter:', error);
        throw error;
    }
};

// ============ TOPIC API ============

export const fetchNCERTTopics = async (chapterId) => {
    try {
        const response = await axios.get(`${API_URL}/ncert/topics/chapter/${chapterId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching NCERT topics:', error);
        throw error;
    }
};

export const fetchNCERTTopic = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/ncert/topics/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching NCERT topic:', error);
        throw error;
    }
};

// ============ QUESTION API ============

export const fetchNCERTQuestions = async (filters = {}) => {
    try {
        // Remove undefined/null keys to prevent "undefined" string in query
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v != null)
        );
        // Build query string
        const params = new URLSearchParams(cleanFilters).toString();
        const response = await axios.get(`${API_URL}/ncert/questions?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching NCERT questions:', error);
        throw error;
    }
};

export const fetchNCERTQuestion = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/ncert/questions/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching NCERT question:', error);
        throw error;
    }
};

// ============ BADGE API ============

export const fetchNCERTBadges = async (category) => {
    try {
        const response = await axios.get(`${API_URL}/ncert/badges/${category}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching NCERT badges:', error);
        throw error;
    }
};

// ============ STATISTICS API ============

export const fetchNCERTStats = async (category) => {
    try {
        const response = await axios.get(`${API_URL}/ncert/stats/${category}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching NCERT stats:', error);
        throw error;
    }
};

// ============ PROGRESS API ============

export const saveNCERTProgress = async (progressData) => {
    try {
        const response = await axios.post(`${API_URL}/ncert/progress`, progressData);
        return response.data;
    } catch (error) {
        console.error('Error saving NCERT progress:', error);
        throw error;
    }
};

export const fetchNCERTProgress = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/ncert/progress/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching NCERT progress:', error);
        throw error; // Or return [] to be safe
    }
};

// ============ ERROR REPORT API ============

export const submitErrorReport = async (reportData) => {
    try {
        const response = await axios.post(`${API_URL}/ncert/error-reports`, reportData);
        return response.data;
    } catch (error) {
        console.error('Error submitting error report:', error);
        throw error;
    }
};

export const fetchErrorReports = async (filters = {}) => {
    try {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v != null)
        );
        const params = new URLSearchParams(cleanFilters).toString();
        const response = await axios.get(`${API_URL}/ncert/error-reports?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching error reports:', error);
        throw error;
    }
};

export const updateErrorReport = async (id, updateData) => {
    try {
        const response = await axios.put(`${API_URL}/ncert/error-reports/${id}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error updating error report:', error);
        throw error;
    }
};

export const deleteErrorReport = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/ncert/error-reports/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting error report:', error);
        throw error;
    }
};
