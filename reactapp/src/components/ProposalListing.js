import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProposalListing.css';

const ProposalListing = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/proposals');
        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }
        const data = await response.json();
        setProposals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  if (loading) return <div className="loading">Loading proposals...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="proposal-listing-page">
      <div className="proposal-listing-header">
        <h1>My Proposals</h1>
        <p className="subtitle">Track your submitted proposals and their status</p>
      </div>
      {proposals.length === 0 ? (
        <div className="empty-state">
          <p>No proposals found. Start applying to projects!</p>
        </div>
      ) : (
        <div className="proposals-grid">
          {proposals.map(proposal => (
            <div key={proposal.id} className="proposal-card">
              <div className="proposal-content">
                <h3>{proposal.projectTitle || `Proposal #${proposal.id}`}</h3>
                <div className="proposal-details">
                  <div className="detail-item">
                    <span className="label">Bid Amount:</span>
                    <span className="value">${proposal.bidAmount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Estimated Days:</span>
                    <span className="value">{proposal.estimatedDays} days</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span className="value status">{proposal.status || 'Pending'}</span>
                  </div>
                </div>
                <div className="proposal-text">
                  <p>{proposal.proposalText}</p>
                </div>
              </div>
              <div className="proposal-actions">
                <Link 
                  to={`/projects/${proposal.projectId}`}
                  className="view-details-btn"
                >
                  View Project
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalListing;