const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('token');

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (token && !options.headers?.['Content-Type']?.includes('multipart')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const courseApi = {
  // Create course
  createCourse: async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('level', data.level);
      formData.append('status', data.status);
      formData.append('price', data.price);
      if (data.coverImage) {
        formData.append('file', data.coverImage);
      }

      const token = getAuthToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get all courses
  getAllCourses: async (filter = 'all', category = null, page = 1, limit = 12) => {
    try {
      const params = new URLSearchParams({ filter, page, limit });
      if (category && category !== 'All Topics') {
        params.append('category', category.toLowerCase());
      }
      return await fetchWithAuth(`${API_BASE_URL}/courses?${params}`);
    } catch (error) {
      throw error;
    }
  },

  // Get course details
  getCourseDetails: async (courseId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/courses/${courseId}`);
    } catch (error) {
      throw error;
    }
  },

  // Enroll in course
  enrollCourse: async (courseId) => {
    try {
      const token = getAuthToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
        method: 'POST',
        headers,
      });

      const result = await response.json();
      if (!response.ok) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Update course progress
  updateCourseProgress: async (courseId, percentComplete) => {
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      };

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/progress`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ percentComplete }),
      });

      const result = await response.json();
      if (!response.ok) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get user enrolled courses
  getUserEnrolledCourses: async (userId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/users/${userId}/courses/enrolled`);
    } catch (error) {
      throw error;
    }
  },

  // Get user created courses
  getUserCreatedCourses: async (userId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/users/${userId}/courses/created`);
    } catch (error) {
      throw error;
    }
  },

  // Update course
  updateCourse: async (courseId, data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('level', data.level);
      formData.append('status', data.status);
      formData.append('price', data.price);
      if (data.coverImage) {
        formData.append('file', data.coverImage);
      }

      const token = getAuthToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers,
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Delete course
  deleteCourse: async (courseId) => {
    try {
      const token = getAuthToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'DELETE',
        headers,
      });

      const result = await response.json();
      if (!response.ok) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get quizzes
  getQuizzes: async (userId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/users/${userId}/quizzes`);
    } catch (error) {
      throw error;
    }
  },

  // Get quiz details
  getQuizDetails: async (quizId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/quizzes/${quizId}`);
    } catch (error) {
      throw error;
    }
  },

  // Submit quiz
  submitQuiz: async (quizId, answers) => {
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      };

      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ answers }),
      });

      const result = await response.json();
      if (!response.ok) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get assignments
  getAssignments: async (userId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/users/${userId}/assignments`);
    } catch (error) {
      throw error;
    }
  },

  // Submit assignment
  submitAssignment: async (assignmentId, data) => {
    try {
      const formData = new FormData();
      if (data.file) {
        formData.append('file', data.file);
      }
      if (data.submissionText) {
        formData.append('submissionText', data.submissionText);
      }

      const token = getAuthToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get learning analytics
  getLearningAnalytics: async (userId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/users/${userId}/learning-analytics`);
    } catch (error) {
      throw error;
    }
  },

  // Get dashboard stats
  getDashboardStats: async (userId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/users/${userId}/dashboard-stats`);
    } catch (error) {
      throw error;
    }
  },

  // Get certificates
  getCertificates: async (userId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/users/${userId}/certificates`);
    } catch (error) {
      throw error;
    }
  },

  // Download certificate
  downloadCertificate: async (certificateId) => {
    try {
      const token = getAuthToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}/download`, {
        headers,
      });

      if (!response.ok) throw new Error('Download failed');
      return await response.blob();
    } catch (error) {
      throw error;
    }
  },

  // Get discussions
  getDiscussions: async (courseId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/courses/${courseId}/discussions`);
    } catch (error) {
      throw error;
    }
  },

  // Get discussion details
  getDiscussionDetails: async (discussionId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/discussions/${discussionId}`);
    } catch (error) {
      throw error;
    }
  },

  // Post discussion
  postDiscussion: async (courseId, data) => {
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      };

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/discussions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Reply to discussion
  replyToDiscussion: async (discussionId, body) => {
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      };

      const response = await fetch(`${API_BASE_URL}/discussions/${discussionId}/replies`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ body }),
      });

      const result = await response.json();
      if (!response.ok) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  },
};
