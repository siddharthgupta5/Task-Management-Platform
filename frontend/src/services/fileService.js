import api from './api';

export const fileService = {
  // Upload files to a task
  uploadFiles: async (taskId, files) => {
    const formData = new FormData();
    
    // Add files to FormData
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

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

  // Download/Get file
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

  // Helper function to trigger file download
  triggerDownload: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};

export default fileService;