import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectListing.css';

const ProjectListing = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/projects');
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

    fetchProjects();
  }, []);

  const handleViewDetails = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  if (error) return <div className="error-message" data-testid="project-listing-error">{error}</div>;

  if (projects.length === 0) return <div className="empty-state">No projects available</div>;

  return (
    <div className="project-listing-page">
      <div className="project-listing-header">
        <div className="project-listing-title-container">
          <h1>Your Projects</h1>
          
        </div>
      </div>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card" onClick={() => handleViewDetails(project.id)}>
            <div className="project-content">
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-details">
                <div className="detail-item">
                  <span className="label">Budget:</span>
                  <span className="value">${project.minBudget} - ${project.maxBudget}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Deadline:</span>
                  <span className="value">{project.deadline}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Skills:</span>
                  <span className="value">{(project.skills || []).join(', ')}</span>
                </div>
              </div>
            </div>
            <div className="project-actions">
              {/* Details button removed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectListing;
