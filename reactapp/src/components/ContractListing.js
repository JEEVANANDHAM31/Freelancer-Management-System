import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contracts.css';

const ContractListing = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch('/api/contracts');
        if (!response.ok) {
          throw new Error('Failed to retrieve contracts');
        }
        const data = await response.json();
        setContracts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  if (loading) {
    return (
      <div className="contracts-container">
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Loading contracts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contracts-container">
        <div className="error-message" data-testid="contract-listing-error">
          {error}
        </div>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="contracts-container">
        <div className="empty-message">
          <h1>Available Contracts</h1>
          <p>No contracts available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contracts-container">
      <div className="contracts-header">
        <h1>Available Contracts</h1>
        <p>View and manage all your project contracts</p>
      </div>
      <div className="contract-list">
        {contracts.map((contract) => (
          <div key={contract.id} className="contract-card">
            <h3>Contract #{contract.id}</h3>
            <p><strong>Project:</strong> {contract.projectTitle || 'N/A'}</p>
            <p><strong>Client:</strong> {contract.clientName || 'N/A'}</p>
            <p><strong>Freelancer:</strong> {contract.freelancerName || 'N/A'}</p>
            <p><strong>Amount:</strong> ${contract.amount}</p>
            <p><strong>Status:</strong> <span className={`status-badge ${(contract.status || 'unknown').toLowerCase()}`}>{contract.status || 'Unknown'}</span></p>
            <p><strong>Start Date:</strong> {contract.startDate}</p>
            <p><strong>End Date:</strong> {contract.endDate}</p>
            <button className="btn btn-primary" onClick={() => navigate(`/contracts/${contract.id}`)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractListing;
