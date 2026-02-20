import axios from 'axios';

const API_URL = '/api/dpps';

// Settings
export const fetchDPPSSettings = async () => {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data;
};

export const updateDPPSSettings = async (settings) => {
    const response = await axios.put(`${API_URL}/settings`, settings);
    return response.data;
};

// Chapters
export const fetchDPPSChapters = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.classLevel) params.append('classLevel', filters.classLevel);
    if (filters.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel);
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);

    const response = await axios.get(`${API_URL}/chapters?${params.toString()}`);
    return response.data;
};

export const fetchDPPSChapter = async (id) => {
    const response = await axios.get(`${API_URL}/chapters/${id}`);
    return response.data;
};

export const createDPPSChapter = async (chapter) => {
    const response = await axios.post(`${API_URL}/chapters`, chapter);
    return response.data;
};

export const updateDPPSChapter = async (id, chapter) => {
    const response = await axios.put(`${API_URL}/chapters/${id}`, chapter);
    return response.data;
};

export const deleteDPPSChapter = async (id) => {
    const response = await axios.delete(`${API_URL}/chapters/${id}`);
    return response.data;
};

// Questions
export const fetchDPPSQuestions = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.chapterId) params.append('chapterId', filters.chapterId);
    if (filters.classLevel) params.append('classLevel', filters.classLevel);
    if (filters.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel);
    if (filters.questionType) params.append('questionType', filters.questionType);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);

    const response = await axios.get(`${API_URL}/questions?${params.toString()}`);
    return response.data;
};

export const fetchDPPSQuestion = async (id) => {
    const response = await axios.get(`${API_URL}/questions/${id}`);
    return response.data;
};

export const createDPPSQuestion = async (questionData) => {
    const response = await axios.post(`${API_URL}/questions`, questionData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateDPPSQuestion = async (id, questionData) => {
    const response = await axios.put(`${API_URL}/questions/${id}`, questionData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteDPPSQuestion = async (id) => {
    const response = await axios.delete(`${API_URL}/questions/${id}`);
    return response.data;
};

// Progress
export const saveDPPSProgress = async (progressData) => {
    const response = await axios.post(`${API_URL}/progress`, progressData);
    return response.data;
};

export const fetchDPPSProgress = async (userId) => {
    const response = await axios.get(`${API_URL}/progress/${userId}`);
    return response.data;
};

// Statistics
export const fetchDPPSStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};

// Test Sessions
export const startDPPSTest = async (userId, chapterId) => {
    const response = await axios.post(`${API_URL}/test-sessions`, {
        userId,
        chapterId
    });
    return response.data;
};

export const fetchDPPSTestSession = async (sessionId) => {
    const response = await axios.get(`${API_URL}/test-sessions/${sessionId}`);
    return response.data;
};

export const saveDPPSTestAnswer = async (sessionId, questionId, selectedAnswer, timeSpent) => {
    const response = await axios.put(`${API_URL}/test-sessions/${sessionId}/answer`, {
        questionId,
        selectedAnswer,
        timeSpent
    });
    return response.data;
};

export const submitDPPSTest = async (sessionId, isAutoSubmit = false) => {
    const response = await axios.put(`${API_URL}/test-sessions/${sessionId}/submit`, {
        isAutoSubmit
    });
    return response.data;
};

export const fetchDPPSTestResults = async (sessionId) => {
    const response = await axios.get(`${API_URL}/test-sessions/${sessionId}/results`);
    return response.data;
};

export const fetchDPPSTestHistory = async (userId, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.classLevel) params.append('classLevel', filters.classLevel);
    if (filters.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel);

    const response = await axios.get(`${API_URL}/test-sessions/user/${userId}?${params.toString()}`);
    return response.data;
};

