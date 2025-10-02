import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Authentication API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Tasks API
export const tasksAPI = {
  getTasks: (params = {}) => api.get('/tasks', { params }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  bulkCreateTasks: (tasks) => api.post('/tasks/bulk', { tasks }),
};

// Comments API
export const commentsAPI = {
  getTaskComments: (taskId, params = {}) => api.get(`/comments/task/${taskId}`, { params }),
  addComment: (commentData) => api.post('/comments', commentData),
  updateComment: (id, commentData) => api.put(`/comments/${id}`, commentData),
  deleteComment: (id) => api.delete(`/comments/${id}`),
};

// Files API
export const filesAPI = {
  uploadFiles: (taskId, files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return api.post(`/files/upload/${taskId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getTaskFiles: (taskId) => api.get(`/files/${taskId}`),
  downloadFile: (taskId, filename) => api.get(`/files/${taskId}/${filename}`, {
    responseType: 'blob',
  }),
  deleteFile: (taskId, filename) => api.delete(`/files/${taskId}/${filename}`),
};

// Analytics API
export const analyticsAPI = {
  getOverview: (params = {}) => api.get('/analytics/overview', { params }),
  getUserPerformance: (params = {}) => api.get('/analytics/performance', { params }),
  getTaskTrends: (params = {}) => api.get('/analytics/trends', { params }),
  exportTasks: (params = {}) => api.get('/analytics/export', { params }),
};

export default api;