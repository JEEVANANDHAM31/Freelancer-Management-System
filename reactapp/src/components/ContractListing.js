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
      <div className="contracts-container animate-fade-in">
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Loading contracts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contracts-container animate-fade-in">
        <div className="error-message" data-testid="contract-listing-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="contracts-container animate-fade-in">
        <div className="empty-message">
          <div className="empty-contract-icon">📑</div>
          <h1>Available Contracts</h1>
          <p>No contracts available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contracts-container animate-fade-in">
      <div className="contracts-header">
        <div>
          <span className="contract-category-tag">ENGAGEMENT DIRECTORY</span>
          <h1>Available Contracts</h1>
          <p>View and manage all your binding project contracts and milestones</p>
        </div>
      </div>

      <div className="contract-list">
        {contracts.map((contract) => (
          <div key={contract.id} className="contract-card">
            <div className="contract-card-header">
              <h3>Contract #{contract.id}</h3>
              <span className={`status-badge ${(contract.status || 'unknown').toLowerCase()}`}>
                {contract.status || 'Unknown'}
              </span>
            </div>

            <div className="contract-card-body">
              <div className="contract-field-row">
                <strong>Project:</strong>
                <span>{contract.projectTitle || 'N/A'}</span>
              </div>
              <div className="contract-field-row">
                <strong>Client:</strong>
                <span>{contract.clientName || 'N/A'}</span>
              </div>
              <div className="contract-field-row">
                <strong>Freelancer:</strong>
                <span>{contract.freelancerName || 'N/A'}</span>
              </div>
              <div className="contract-field-row highlight-amount">
                <strong>Amount:</strong>
                <span className="amount-val">${contract.amount}</span>
              </div>
              <div className="contract-field-row">
                <strong>Status:</strong>
                <span className={`status-badge ${(contract.status || 'unknown').toLowerCase()}`}>
                  {contract.status || 'Unknown'}
                </span>
              </div>
              <div className="contract-field-row">
                <strong>Start Date:</strong>
                <span>{contract.startDate}</span>
              </div>
              <div className="contract-field-row">
                <strong>End Date:</strong>
                <span>{contract.endDate}</span>
              </div>
            </div>

            <div className="contract-card-actions">
              <button className="btn btn-primary" onClick={() => navigate(`/contracts/${contract.id}`)}>
                <span>View Details</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractListing;
