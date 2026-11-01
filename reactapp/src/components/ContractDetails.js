import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Contracts.css';

const ContractDetails = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const response = await fetch(`/api/contracts/${contractId}`);
        if (!response.ok) {
          throw new Error('Failed to retrieve contract details');
        }
        const data = await response.json();
        setContract(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContractDetails();
  }, [contractId]);

  if (loading) {
    return (
      <div className="contracts-container animate-fade-in">
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Loading contract details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contracts-container animate-fade-in">
        <div className="error-message" data-testid="contract-details-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="contracts-container animate-fade-in">
        <div className="empty-message">
          <h1>Contract Not Found</h1>
          <p>The requested contract could not be found.</p>
          <button className="btn btn-secondary" onClick={() => navigate('/contracts')} style={{ marginTop: '1rem' }}>
            Back to Contracts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contracts-container animate-fade-in">
      <div className="contract-details">
        <button className="back-button" onClick={() => navigate('/contracts')}>
          ← Back to Contracts
        </button>

        <div className="contract-header-strip">
          <div>
            <span className="contract-category-tag">OFFICIAL CONTRACT</span>
            <h1>Contract #{contract.id}</h1>
          </div>
          <span className={`status-badge ${(contract.status || 'unknown').toLowerCase()}`}>
            {contract.status || 'Unknown'}
          </span>
        </div>

        <div className="contract-info">
          <div className="contract-section">
            <h3>Project Information</h3>
            <div className="contract-fields-grid">
              <p><strong>Title:</strong> <span>{contract.projectTitle || 'N/A'}</span></p>
              <p><strong>Description:</strong> <span>{contract.projectDescription || 'N/A'}</span></p>
            </div>
          </div>

          <div className="contract-section">
            <h3>Parties</h3>
            <div className="parties-grid">
              <div className="party-card">
                <span className="party-role">Client</span>
                <p><strong>Client:</strong> <span>{contract.clientName || 'N/A'}</span></p>
                <p><strong>Client Email:</strong> <span>{contract.clientEmail || 'N/A'}</span></p>
              </div>
              <div className="party-card">
                <span className="party-role">Freelancer</span>
                <p><strong>Freelancer:</strong> <span>{contract.freelancerName || 'N/A'}</span></p>
                <p><strong>Freelancer Email:</strong> <span>{contract.freelancerEmail || 'N/A'}</span></p>
              </div>
            </div>
          </div>

          <div className="contract-section">
            <h3>Financial Details</h3>
            <div className="financial-summary-box">
              <div className="financial-item highlight">
                <span className="fin-label">Total Amount</span>
                <span className="fin-val">${contract.amount}</span>
              </div>
              <div className="financial-item">
                <span className="fin-label">Payment Terms</span>
                <span className="fin-subval">{contract.paymentTerms || 'Standard'}</span>
              </div>
              <div className="financial-item">
                <span className="fin-label">Milestone Payments</span>
                <span className="fin-subval">{contract.milestonePayments || 'As agreed'}</span>
              </div>
            </div>
          </div>

          <div className="contract-section">
            <h3>Timeline</h3>
            <div className="timeline-grid">
              <p><strong>Start Date:</strong> <span>{contract.startDate}</span></p>
              <p><strong>End Date:</strong> <span>{contract.endDate}</span></p>
              <p><strong>Duration:</strong> <span>{contract.duration || 'Not specified'}</span></p>
            </div>
          </div>

          <div className="contract-section">
            <h3>Terms & Conditions</h3>
            <div className="terms-box">
              <p><strong>Status:</strong> <span className={`status-badge ${(contract.status || 'unknown').toLowerCase()}`}>{contract.status || 'Unknown'}</span></p>
              <p><strong>Terms:</strong> <span>{contract.terms || 'Standard terms apply'}</span></p>
              <p><strong>Deliverables:</strong> <span>{contract.deliverables || 'As per project requirements'}</span></p>
            </div>
          </div>

          <div className="contract-section">
            <h3>Actions</h3>
            <div className="contract-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => navigate(`/projects/${contract.projectId}`)}
              >
                View Related Project
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => navigate(`/contracts/${contractId}/milestones`)}
              >
                Manage Milestones
              </button>
              {contract.status === 'PENDING' && (
                <button className="btn btn-success">
                  Approve Contract
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
