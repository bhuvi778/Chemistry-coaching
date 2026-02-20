const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get exam categories (JEE, NEET)
export const fetchExamCategories = () => {
    return ['JEE', 'NEET'];
};

// Get chapters for an exam category
export const fetchChapters = async (examCategory) => {
    try {
        const response = await fetch(`${API_BASE_URL}/nta-abhyas/chapters/${examCategory}`);
        if (!response.ok) {
            throw new Error('Failed to fetch chapters');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching NTA Abhyas chapters:', error);
        throw error;
    }
};

// Get questions by exam category and chapter
export const fetchQuestions = async (examCategory, chapter) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/nta-abhyas/questions?examCategory=${encodeURIComponent(examCategory)}&chapter=${encodeURIComponent(chapter)}`
        );
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching NTA Abhyas questions:', error);
        throw error;
    }
};

// Get statistics
export const fetchStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/nta-abhyas/stats`);
        if (!response.ok) {
            throw new Error('Failed to fetch stats');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching NTA Abhyas stats:', error);
        throw error;
    }
};

// Admin: Get all questions with filters
export const fetchAllQuestions = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.examCategory) params.append('examCategory', filters.examCategory);
        if (filters.chapter) params.append('chapter', filters.chapter);
        if (filters.difficulty) params.append('difficulty', filters.difficulty);

        const response = await fetch(`${API_BASE_URL}/nta-abhyas/admin/all?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch all questions');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching all NTA Abhyas questions:', error);
        throw error;
    }
};

// Admin: Create question
export const createQuestion = async (questionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/nta-abhyas/admin/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData),
        });
        if (!response.ok) {
            throw new Error('Failed to create question');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating NTA Abhyas question:', error);
        throw error;
    }
};

// Admin: Update question
export const updateQuestion = async (id, questionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/nta-abhyas/admin/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData),
        });
        if (!response.ok) {
            throw new Error('Failed to update question');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating NTA Abhyas question:', error);
        throw error;
    }
};

// Admin: Delete question
export const deleteQuestion = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/nta-abhyas/admin/delete/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete question');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting NTA Abhyas question:', error);
        throw error;
    }
};
