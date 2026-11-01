import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProposalForm from './ProposalForm';
import './ProposalPage.css';

const ProposalPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) {
      navigate('/projects');
    }
  }, [projectId, navigate]);

  if (!projectId) return null;

  return (
    <div className="proposal-page animate-fade-in">
      <div className="proposal-page-container">
        <button className="proposal-back-btn" onClick={() => navigate(`/projects/${projectId}`)}>
          ← Back to Project Details
        </button>

        <div className="proposal-header-box">
          <span className="proposal-eyebrow">NEW PROPOSAL</span>
          <h1>Submit Your Pitch</h1>
          <p>Present your proposed rate, delivery timeline, and credentials to stand out from the competition.</p>
        </div>

        <ProposalForm 
          projectId={Number(projectId)} 
          onSuccess={() => {
            setTimeout(() => {
              navigate(`/projects/${projectId}`);
            }, 1800);
          }}
          onCancel={() => navigate(`/projects/${projectId}`)}
        />
      </div>
    </div>
  );
};

export default ProposalPage;
