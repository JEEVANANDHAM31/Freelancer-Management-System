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
      <div className="contracts-container">
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Loading contract details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contracts-container">
        <div className="error-message" data-testid="contract-details-error">
          {error}
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="contracts-container">
        <div className="empty-message">
          <h1>Contract Not Found</h1>
          <p>The requested contract could not be found.</p>
          <button className="btn btn-secondary" onClick={() => navigate('/contracts')}>
            Back to Contracts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contracts-container">
      <div className="contract-details">
        <h1>Contract Details</h1>
        <button className="back-button" onClick={() => navigate('/contracts')}>
          ← Back to Contracts
        </button>

        <div className="contract-info">
          <h2>Contract #{contract.id}</h2>
          
          <div className="contract-section">
            <h3>Project Information</h3>
            <p><strong>Title:</strong> {contract.projectTitle || 'N/A'}</p>
            <p><strong>Description:</strong> {contract.projectDescription || 'N/A'}</p>
          </div>

          <div className="contract-section">
            <h3>Parties</h3>
            <p><strong>Client:</strong> {contract.clientName || 'N/A'}</p>
            <p><strong>Client Email:</strong> {contract.clientEmail || 'N/A'}</p>
            <p><strong>Freelancer:</strong> {contract.freelancerName || 'N/A'}</p>
            <p><strong>Freelancer Email:</strong> {contract.freelancerEmail || 'N/A'}</p>
          </div>

          <div className="contract-section">
            <h3>Financial Details</h3>
            <p><strong>Total Amount:</strong> ${contract.amount}</p>
            <p><strong>Payment Terms:</strong> {contract.paymentTerms || 'Standard'}</p>
            <p><strong>Milestone Payments:</strong> {contract.milestonePayments || 'As agreed'}</p>
          </div>

          <div className="contract-section">
            <h3>Timeline</h3>
            <p><strong>Start Date:</strong> {contract.startDate}</p>
            <p><strong>End Date:</strong> {contract.endDate}</p>
            <p><strong>Duration:</strong> {contract.duration || 'Not specified'}</p>
          </div>

          <div className="contract-section">
            <h3>Terms & Conditions</h3>
            <p><strong>Status:</strong> <span className={`status-badge ${(contract.status || 'unknown').toLowerCase()}`}>{contract.status || 'Unknown'}</span></p>
            <p><strong>Terms:</strong> {contract.terms || 'Standard terms apply'}</p>
            <p><strong>Deliverables:</strong> {contract.deliverables || 'As per project requirements'}</p>
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
