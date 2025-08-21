import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDetails.css';
const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchProjectDetails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error(`Project not found with ID: ${projectId}`);
      }
      const data = await response.json();
      setProject(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchProjectProposals = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/proposals`);
      if (!response || !response.ok) {
        setProposals([]);
        return;
      }
      const allProposals = await response.json();
      const projectProposals = (allProposals || []).filter(proposal => 
        proposal && proposal.projectId === parseInt(projectId)
      );
      setProposals(projectProposals);
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setProposals([]);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectDetails();
    fetchProjectProposals();
  }, [fetchProjectDetails, fetchProjectProposals]);
    const handleSubmitProposal = () => {
        console.log("Navigating to proposal form with projectId:", projectId);
        navigate(`/projects/${projectId}/proposal`);
    };
  const handleBack = () => {
    navigate('/projects');
  };
  if (loading) {
    return <div data-testid="loading-details">Loading project details...</div>;
  }
  if (error) {
    return <div data-testid="project-details-error">{error}</div>;
  }
  if (!project) {
    return <div>Project not found</div>;
  }
  return (
    <div className="project-details">
      <button onClick={handleBack} className="back-btn">← Back to Projects</button>
      <div className="project-header">
        <h1>{project.title}</h1>
      </div>
      <div className="project-info">
        <div className="info-section">
          <h3>Project Description</h3>
          <p>{project.description}</p>
        </div>
        <div className="info-section">
          <h3>Project Details</h3>
          <ul>
            <li><strong>Budget:</strong> ${project.minBudget} - ${project.maxBudget}</li>
            <li><strong>Deadline:</strong> {project.deadline}</li>
            <li><strong>Skills Required:</strong> {Array.isArray(project.skills) ? project.skills.join(', ') : 'N/A'}</li>
            <li><strong>Client ID:</strong> {project.clientId}</li>
            <li><strong>Created:</strong> {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</li>
          </ul>
        </div>
        <div className="action-section">
          <button 
            onClick={handleSubmitProposal}
            className="submit-proposal-btn"
            data-testid="submit-proposal-btn"
          >
            Submit Proposal
          </button>
          <button 
            onClick={() => navigate(`/projects/${projectId}/files`)}
            className="submit-proposal-btn"
            style={{ marginLeft: '10px', background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)' }}
          >
            Manage Files
          </button>
        </div>
      </div>
      <div className="proposals-section">
        <h2>Proposals ({proposals.filter(p => p.freelancerId !== 1).length})</h2>
        {proposals.length === 0 ? (
          <div className="no-proposals">
            <p>No proposals submitted yet. Be the first to submit a proposal!</p>
          </div>
        ) : (
          <div className="proposals-list">
            {proposals.map((proposal) => {
              const isDefaultProposal = proposal.freelancerId === 1;
              return (
                <div key={proposal.id} className={`proposal-card ${isDefaultProposal ? 'default-proposal' : ''}`}>
                  <div className="proposal-header">
                    <h3>{isDefaultProposal ? 'Platform Demo' : `Proposal #${proposal.id}`}</h3>
                    <span className="proposal-bid">${proposal.bidAmount}</span>
                  </div>
                  <div className="proposal-content">
                    <p className="proposal-text">{proposal.proposalText}</p>
                    <div className="proposal-meta">
                      <span>
                        <strong>{isDefaultProposal ? 'Posted by:' : 'Freelancer ID:'}</strong> 
                        {isDefaultProposal ? ' System' : ` ${proposal.freelancerId}`}
                      </span>
                      <span><strong>Estimated Days:</strong> {proposal.estimatedDays}</span>
                    </div>
                    {isDefaultProposal && (
                      <div className="default-notice">
                        <em>This is a placeholder proposal. Submit yours to replace it!</em>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default ProjectDetails;
