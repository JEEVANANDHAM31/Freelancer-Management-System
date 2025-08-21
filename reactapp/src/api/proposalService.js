const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const proposalService = {
  createProposal: async (proposalData) => {
    const response = await fetch(`${API_BASE_URL}/proposals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(proposalData),
    });
    if (!response.ok) throw new Error('Failed to create proposal');
    return response.json();
  },

  getAllProposals: async () => {
    const response = await fetch(`${API_BASE_URL}/proposals`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch proposals');
    return response.json();
  },

  getProposalById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/proposals/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch proposal');
    return response.json();
  },

  updateProposal: async (id, proposalData) => {
    const response = await fetch(`${API_BASE_URL}/proposals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(proposalData),
    });
    if (!response.ok) throw new Error('Failed to update proposal');
    return response.json();
  },

  deleteProposal: async (id) => {
    const response = await fetch(`${API_BASE_URL}/proposals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete proposal');
    return response.json();
  },
};

export default proposalService;
