import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectForm.css';
import projectService from '../api/projectService';

const ProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [skills, setSkills] = useState(['']);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const removeSkill = (index) => {
    if (skills.length > 1) {
      setSkills(skills.filter((_, idx) => idx !== index));
    } else {
      setSkills(['']);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      setError('Please log in to create a project');
      return;
    }

    const validSkills = skills.map(s => s.trim()).filter(Boolean);
    if (validSkills.length === 0) {
      setError('Please specify at least one required skill');
      return;
    }

    const min = parseFloat(minBudget);
    const max = parseFloat(maxBudget);

    if (isNaN(min) || isNaN(max)) {
      setError('Please provide valid minimum and maximum budget values');
      return;
    }

    if (min >= max) {
      setError('Maximum budget must be greater than minimum budget');
      return;
    }

    const projectData = { 
      title: title.trim(), 
      description: description.trim(), 
      minBudget: min, 
      maxBudget: max, 
      deadline: deadline, 
      skills: validSkills,
      clientId: parseInt(user.id, 10) 
    };

    setSubmitting(true);
    try {
      await projectService.createProject(projectData);
      navigate('/my-projects');
    } catch (err) {
      setError(err.message || 'Failed to create project. Please verify all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="project-form-page animate-fade-in">
      <button className="pf-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="project-form-card">
        <div className="pf-header">
          <span className="pf-badge">NEW REQUIREMENT</span>
          <h2>Create New Project</h2>
          <p>Define your project scope, budget range, and timeline to attract qualified freelancers.</p>
        </div>

        {error && (
          <div className="pf-error-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="pf-form-body">
          <div className="pf-field">
            <label htmlFor="pf-title">Project Title</label>
            <input 
              id="pf-title"
              type="text" 
              placeholder="e.g. Full-Stack E-Commerce Web Application in React & Node.js" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
            <small>A clear, descriptive title helps freelancers understand your goal.</small>
          </div>

          <div className="pf-field">
            <label htmlFor="pf-desc">Project Description</label>
            <textarea 
              id="pf-desc"
              placeholder="Describe deliverables, project requirements, architectural preferences, and expectations..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={5}
              required 
            />
          </div>

          {/* Budget row */}
          <div className="pf-row-2">
            <div className="pf-field">
              <label htmlFor="pf-min-budget">Minimum Budget ($)</label>
              <div className="pf-input-prefix-wrap">
                <span className="pf-prefix">$</span>
                <input 
                  id="pf-min-budget"
                  type="number" 
                  placeholder="500" 
                  value={minBudget} 
                  onChange={(e) => setMinBudget(e.target.value)} 
                  min="1"
                  step="0.01"
                  required 
                />
              </div>
            </div>

            <div className="pf-field">
              <label htmlFor="pf-max-budget">Maximum Budget ($)</label>
              <div className="pf-input-prefix-wrap">
                <span className="pf-prefix">$</span>
                <input 
                  id="pf-max-budget"
                  type="number" 
                  placeholder="2500" 
                  value={maxBudget} 
                  onChange={(e) => setMaxBudget(e.target.value)} 
                  min="1"
                  step="0.01"
                  required 
                />
              </div>
            </div>
          </div>

          <div className="pf-field">
            <label htmlFor="pf-deadline">Project Deadline</label>
            <input 
              id="pf-deadline"
              type="date" 
              placeholder="Deadline" 
              value={deadline} 
              onChange={(e) => setDeadline(e.target.value)} 
              required 
            />
          </div>

          {/* Skills tags */}
          <div className="pf-field">
            <div className="pf-skills-label-row">
              <label>Required Skills & Technologies</label>
              <button type="button" onClick={addSkill} className="pf-add-skill-btn">
                + Add Another Skill
              </button>
            </div>

            <div className="pf-skills-grid">
              {skills.map((skill, index) => (
                <div key={index} className="pf-skill-input-wrap">
                  <input 
                    type="text" 
                    placeholder="e.g. React, Python, UI/UX" 
                    value={skill} 
                    onChange={(e) => handleSkillChange(index, e.target.value)} 
                  />
                  {skills.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeSkill(index)} 
                      className="pf-remove-skill-btn"
                      title="Remove skill"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pf-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/my-projects')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating Project...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
