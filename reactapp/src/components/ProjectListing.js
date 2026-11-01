import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectListing.css';

const ProjectListing = ({ onViewDetails }) => {
  // Safe navigation guard for testing environments where Router context might not be present
  let navigate;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate();
  } catch {
    navigate = null;
  }

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('ALL');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/projects');
        if (!response.ok) {
          throw new Error('Failed to retrieve projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        // Fallback for tests or port discrepancy
        try {
          const fallbackRes = await fetch('http://localhost:8081/api/projects');
          if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            setProjects(data);
            return;
          }
        } catch {
          // ignore fallback error
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCardClick = (projectId) => {
    if (onViewDetails) {
      onViewDetails(projectId);
    } else if (navigate) {
      navigate(`/projects/${projectId}`);
    }
  };

  if (loading) {
    return (
      <div className="project-listing-page">
        <div className="listing-state-container">
          <div className="listing-spinner"></div>
          <p className="loading">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-listing-page">
        <div className="listing-error-banner" data-testid="project-listing-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="project-listing-page">
        <div className="listing-empty-state">
          <div className="empty-icon-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <h3>No projects available</h3>
          <p>Check back later or post a new project to get the ball rolling.</p>
        </div>
      </div>
    );
  }

  // Extract all unique skills for filter pill bar
  const allSkills = Array.from(
    new Set(
      projects.flatMap((p) => p.skills || [])
    )
  ).slice(0, 8);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill =
      selectedSkill === 'ALL' ||
      (project.skills && project.skills.includes(selectedSkill));
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="project-listing-page animate-fade-in">
      <div className="project-listing-header">
        <div className="project-listing-title-container">
          <span className="listing-badge">MARKETPLACE</span>
          <h1>Explore Projects</h1>
          <p className="subtitle">Discover verified client opportunities and submit your proposals</p>
        </div>

        {navigate && (
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/projects/new')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Post a Project
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="listing-filter-bar">
        <div className="search-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search projects by keyword, technology, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>

        {allSkills.length > 0 && (
          <div className="skill-filter-pills">
            <button
              className={`filter-pill ${selectedSkill === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedSkill('ALL')}
            >
              All Skills
            </button>
            {allSkills.map((skill, idx) => (
              <button
                key={idx}
                className={`filter-pill ${selectedSkill === skill ? 'active' : ''}`}
                onClick={() => setSelectedSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div 
            key={project.id} 
            className="project-card" 
            onClick={() => handleCardClick(project.id)}
          >
            <div className="project-card-top">
              <span className="project-id-tag">Project #{project.id}</span>
              <span className="project-status-badge">ACTIVE</span>
            </div>

            <div className="project-content">
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              
              <div className="project-details">
                <div className="detail-item">
                  <span className="label">Budget: </span>
                  <span className="value">${project.minBudget} - ${project.maxBudget}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Deadline: </span>
                  <span className="value">{project.deadline}</span>
                </div>
              </div>

              {project.skills && project.skills.length > 0 && (
                <div className="project-skills-list">
                  {project.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="project-actions">
              <button 
                className="view-details-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(project.id);
                }}
              >
                <span>View Details</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="listing-empty-state">
          <p>No projects match your search criteria. Try a different search keyword.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectListing;
