import api from './api';

export const analyticsService = {
  // Get task overview statistics
  getTaskOverview: async (params = {}) => {
    const response = await api.get('/analytics/overview', { params });
    return response.data;
  },

  // Get user performance metrics
  getUserPerformance: async (params = {}) => {
    const response = await api.get('/analytics/performance', { params });
    return response.data;
  },

  // Get task trends over time
  getTaskTrends: async (params = {}) => {
    const response = await api.get('/analytics/trends', { params });
    return response.data;
  },

  // Export tasks data
  exportTasksData: async (params = {}) => {
    const response = await api.get('/analytics/export', { 
      params,
      responseType: params.format === 'csv' ? 'blob' : 'json'
    });
    return response.data;
  }
};

export default analyticsService;