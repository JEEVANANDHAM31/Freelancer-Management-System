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
    return <div data-testid="loading-projects">Loading projects...</div>;
  }
  if (error) {
    return <div data-testid="project-listing-error">{error}</div>;
  }
  if (projects.length === 0) {
    return <div>No projects available</div>;
  }
  return (
    <div className="project-dashboard">
      <h2> Available Projects</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card" data-testid={`project-${project.id}`}>
            <h3>{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <div className="project-details">
              <p><strong>Budget:</strong> ${project.minBudget} - ${project.maxBudget}</p>
              <p><strong>Deadline:</strong> {project.deadline}</p>
              <p><strong>Skills:</strong> {project.skills.join(', ')}</p>
            </div>
            <button 
              onClick={() => handleViewDetails(project.id)}
              className="view-details-btn"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProjectDashboard;
