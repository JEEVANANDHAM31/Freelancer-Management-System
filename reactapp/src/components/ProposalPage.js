import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProposalForm from './ProposalForm';
import './ProposalPage.css';
const ProposalPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!projectId) {
      console.error('No project ID found');
      navigate('/projects');
      return;
    }
    console.log('Project ID:', projectId);
  }, [projectId, navigate]);
  if (!projectId) return null;
  return (
    <div className="proposal-page">
      <div className="proposal-container">
        <div className="form-header">
          <h1>Submit Your Proposal</h1>
          <p>Present your skills and convince the client why you're the perfect fit for this project</p>
        </div>
        <ProposalForm projectId={Number(projectId)} />
      </div>
    </div>
  );
};
export default ProposalPage;
