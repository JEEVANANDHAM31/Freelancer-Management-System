import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectDashboard.css';

const ProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/projects');
      if (!response.ok) {
        throw new Error('Failed to retrieve projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="project-dashboard-page">
        <div className="dash-state-wrap" data-testid="loading-projects">
          <div className="dash-spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-dashboard-page">
        <div className="dash-error-banner" data-testid="project-listing-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="project-dashboard-page">
        <div className="dash-empty-banner">
          <p>No projects available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-dashboard-page animate-fade-in">
      <div className="project-dashboard-header">
        <span className="pdash-badge">WORKSPACE</span>
        <h2>Available Projects</h2>
        <p className="subtitle">All active marketplace opportunities open for bids</p>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="project-card" 
            data-testid={`project-${project.id}`}
            onClick={() => handleViewDetails(project.id)}
          >
            <div className="pdash-card-top">
              <span className="pdash-id">Project #{project.id}</span>
              <span className="pdash-status">OPEN</span>
            </div>

            <div className="project-content">
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              
              <div className="project-details">
                <p><strong>Budget:</strong> <span>${project.minBudget} - ${project.maxBudget}</span></p>
                <p><strong>Deadline:</strong> <span>{project.deadline}</span></p>
                <p><strong>Skills:</strong> <span>{(project.skills || []).join(', ')}</span></p>
              </div>
            </div>

            <div className="project-actions">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(project.id);
                }}
                className="btn btn-primary view-details-btn"
              >
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

export default ProjectDashboard;
