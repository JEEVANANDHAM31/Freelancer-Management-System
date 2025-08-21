import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyProjects.css';
const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
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
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
        <div style={{ background: 'white !important', color: '#333 !important', padding: '30px', textAlign: 'center', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', maxWidth: '400px', margin: '0 auto' }}>
          Loading your projects...
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="my-projects">
        <div className="error" style={{ background: '#fee', color: '#c33', padding: '40px', textAlign: 'center', borderRadius: '12px', border: '1px solid #fcc', maxWidth: '500px', margin: '0 auto' }}>
          {error}
        </div>
      </div>
    );
  }
  return (
    <div className="my-projects">
      <div className="my-projects-header">
        <h2>{user.role === 'CLIENT' ? 'My Posted Projects' : 'Available Projects'}</h2>
        <p className="subtitle">Discover exciting freelance opportunities</p>
        {user.role === 'CLIENT' && (
          <button onClick={handleCreateProject} className="create-project-btn">
            Post New Project
          </button>
        )}
      </div>
      {projects.length === 0 ? (
        <div className="empty-state" style={{ background: 'white', color: '#2c3e50', padding: '40px 20px', textAlign: 'center', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', maxWidth: '500px', margin: '0 auto' }}>
          <p>No projects found.</p>
          {user.role === 'CLIENT' && (
            <button onClick={handleCreateProject} className="create-project-btn">
              Post Your First Project
            </button>
          )}
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-content">
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-details">
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span className="value">{project.status}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Budget:</span>
                    <span className="value">${project.minBudget} - ${project.maxBudget}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Deadline:</span>
                    <span className="value">{project.deadline}</span>
                  </div>
                </div>
              </div>
              <div className="project-actions">
                <button onClick={() => handleViewDetails(project.id)} className="view-details-btn">
                  View Details
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
