import api from './api';

export const taskService = {
  // Create new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Get all tasks with filtering and pagination
  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Get single task by ID
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task (soft delete)
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Bulk create tasks
  bulkCreateTasks: async (tasks) => {
    const response = await api.post('/tasks/bulk', { tasks });
    return response.data;
  },

  // Get task comments
  getTaskComments: async (taskId, params = {}) => {
    const response = await api.get(`/comments/task/${taskId}`, { params });
    return response.data;
  },

  // Add comment to task
  addComment: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  // Update comment
  updateComment: async (id, content) => {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data;
  },

  // Delete comment
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  }
};

export default taskService;