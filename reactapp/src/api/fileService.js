const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const fileService = {
  uploadFile: async (fileData) => {
    const response = await fetch(`${API_BASE_URL}/files`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: fileData,
    });
    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
  },

  getFilesByProject: async (projectId) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/files`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch files');
    return response.json();
  },
};

export default fileService;
