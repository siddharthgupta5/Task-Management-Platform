import api from './api';

export const fileService = {
  // Upload file to task
  uploadFile: async (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/files/upload/${taskId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all files for a task
  getTaskFiles: async (taskId) => {
    const response = await api.get(`/files/${taskId}`);
    return response.data;
  },

  // Download file
  downloadFile: async (taskId, filename) => {
    const response = await api.get(`/files/${taskId}/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete file
  deleteFile: async (taskId, filename) => {
    const response = await api.delete(`/files/${taskId}/${filename}`);
    return response.data;
  },

  // Helper function to create download URL
  getDownloadUrl: (taskId, filename) => {
    return `/api/files/${taskId}/${filename}`;
  },
};

export default fileService;