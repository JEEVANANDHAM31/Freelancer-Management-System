const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const milestoneService = {
  createMilestone: async (milestoneData) => {
    const response = await fetch(`${API_BASE_URL}/milestones`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(milestoneData),
    });
    if (!response.ok) throw new Error('Failed to create milestone');
    return response.json();
  },

  getMilestonesByContract: async (contractId) => {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/milestones`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch milestones');
    return response.json();
  },

  updateMilestone: async (id, milestoneData) => {
    const response = await fetch(`${API_BASE_URL}/milestones/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(milestoneData),
    });
    if (!response.ok) throw new Error('Failed to update milestone');
    return response.json();
  },
};

export default milestoneService;
