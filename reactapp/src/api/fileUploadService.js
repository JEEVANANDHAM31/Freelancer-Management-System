import { useAuth } from '../context/AuthContext';

const useFileUpload = () => {
  const { getAuthHeaders } = useAuth();

  const uploadFile = async (projectId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`http://localhost:8080/api/projects/${projectId}/files/upload`, {
      method: 'POST',
      headers: getAuthHeaders(true), // Pass true to exclude Content-Type for FormData
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  };

  return { uploadFile };
};

export default useFileUpload;
