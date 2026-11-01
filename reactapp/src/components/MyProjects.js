import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyProjects.css';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isClient = user.role === 'CLIENT';

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = 'http://localhost:8080/api/projects';
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
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

  const handleCreateProject = () => {
    navigate('/projects/new');
  };

  if (loading) {
    return (
      <div className="my-projects-page">
        <div className="my-projects-state">
          <div className="spinner-large"></div>
          <p>Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-projects-page">
        <div className="my-projects-error-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const filteredProjects = projects.filter((project) =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="my-projects-page animate-fade-in">
      <div className="my-projects-header">
        <div className="my-projects-header-left">
          <span className="mp-category-badge">{isClient ? 'CLIENT REPOSITORY' : 'TALENT WORKSPACE'}</span>
          <h2>{isClient ? 'My Posted Projects' : 'Available Projects'}</h2>
          <p className="subtitle">
            {isClient
              ? 'Manage and monitor all your project listings, proposals, and milestones.'
              : 'Discover exciting freelance opportunities and submit competitive proposals.'}
          </p>
        </div>

        {isClient && (
          <button onClick={handleCreateProject} className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Post New Project
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="mp-search-container">
        <div className="mp-search-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Filter projects by title or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mp-search-input"
          />
          {searchTerm && (
            <button className="mp-clear-btn" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="my-projects-empty">
          <div className="empty-icon-wrap">🗂️</div>
          <h3>No projects found</h3>
          <p>
            {isClient 
              ? 'You have not posted any projects yet. Start by publishing your first job listing!'
              : 'There are no active projects listed at the moment.'}
          </p>
          {isClient && (
            <button onClick={handleCreateProject} className="btn btn-primary" style={{ marginTop: '0.75rem' }}>
              Post Your First Project
            </button>
          )}
        </div>
      ) : (
        <div className="my-projects-grid">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="mp-project-card"
              onClick={() => handleViewDetails(project.id)}
            >
              <div className="mp-card-top">
                <span className="mp-id-chip">Project #{project.id}</span>
                <span className={`mp-status-pill ${(project.status || 'ACTIVE').toLowerCase()}`}>
                  {project.status || 'ACTIVE'}
                </span>
              </div>

              <div className="mp-project-content">
                <h3>{project.title}</h3>
                <p className="mp-project-description">{project.description}</p>

                <div className="mp-details-list">
                  <div className="mp-detail-row">
                    <span className="label">Budget</span>
                    <span className="value">${project.minBudget} - ${project.maxBudget}</span>
                  </div>
                  <div className="mp-detail-row">
                    <span className="label">Deadline</span>
                    <span className="value">{project.deadline}</span>
                  </div>
                </div>

                {project.skills && project.skills.length > 0 && (
                  <div className="mp-skills-row">
                    {project.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="mp-skill-tag">{skill}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mp-card-actions">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(project.id);
                  }} 
                  className="btn btn-secondary btn-sm mp-view-btn"
                >
                  <span>View Details</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;
