import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// ============ CHAPTER API ============

export const fetchPYQChapters = async (filters = {}) => {
    try {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v != null)
        );
        const params = new URLSearchParams(cleanFilters).toString();
        const response = await axios.get(`${API_URL}/pyq/chapters?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching PYQ chapters:', error);
        throw error;
    }
};

export const fetchPYQChapter = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/pyq/chapters/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching PYQ chapter:', error);
        throw error;
    }
};

// ============ TOPIC API ============

export const fetchPYQTopics = async (chapterId) => {
    try {
        const response = await axios.get(`${API_URL}/pyq/topics/chapter/${chapterId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching PYQ topics:', error);
        throw error;
    }
};

export const fetchPYQTopic = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/pyq/topics/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching PYQ topic:', error);
        throw error;
    }
};

// ============ QUESTION API ============

export const fetchPYQQuestions = async (filters = {}) => {
    try {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v != null)
        );
        const params = new URLSearchParams(cleanFilters).toString();
        const response = await axios.get(`${API_URL}/pyq/questions?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching PYQ questions:', error);
        throw error;
    }
};

export const fetchPYQQuestion = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/pyq/questions/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching PYQ question:', error);
        throw error;
    }
};

// ============ PROGRESS API ============

export const savePYQProgress = async (progressData) => {
    try {
        const response = await axios.post(`${API_URL}/pyq/progress`, progressData);
        return response.data;
    } catch (error) {
        console.error('Error saving PYQ progress:', error);
        throw error;
    }
};

export const fetchPYQProgress = async (userId, filters = {}) => {
    try {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v != null)
        );
        const params = new URLSearchParams(cleanFilters).toString();
        const response = await axios.get(`${API_URL}/pyq/progress/${userId}?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching PYQ progress:', error);
        throw error;
    }
};

// ============ STATISTICS API ============

export const fetchPYQStats = async (userId, filters = {}) => {
    try {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v != null)
        );
        const params = new URLSearchParams(cleanFilters).toString();
        const response = await axios.get(`${API_URL}/pyq/stats/${userId}?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching PYQ stats:', error);
        throw error;
    }
};

// ============ ERROR REPORT API ============

export const submitErrorReport = async (reportData) => {
    try {
        const response = await axios.post(`${API_URL}/pyq/error-reports`, reportData);
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
        const response = await axios.get(`${API_URL}/pyq/error-reports?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching error reports:', error);
        throw error;
    }
};

export const updateErrorReport = async (id, updateData) => {
    try {
        const response = await axios.put(`${API_URL}/pyq/error-reports/${id}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error updating error report:', error);
        throw error;
    }
};

export const deleteErrorReport = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/pyq/error-reports/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting error report:', error);
        throw error;
    }
};
