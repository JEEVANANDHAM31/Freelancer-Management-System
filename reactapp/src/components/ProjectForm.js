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
  const navigate = useNavigate();
  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };
  const addSkill = () => {
    setSkills([...skills, '']);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      setError('Please log in to create a project');
      return;
    }
    const validSkills = skills.filter(skill => skill.trim() !== '');
    if (validSkills.length === 0) {
      setError('Please add at least one skill');
      return;
    }
    const projectData = { 
      title: title.trim(), 
      description: description.trim(), 
      minBudget: parseFloat(minBudget), 
      maxBudget: parseFloat(maxBudget), 
      deadline: deadline, 
      skills: validSkills,
      clientId: parseInt(user.id) 
    };
    if (projectData.minBudget >= projectData.maxBudget) {
      setError('Maximum budget must be greater than minimum budget');
      return;
    }
    try {
      await projectService.createProject(projectData);
      navigate('/my-projects');
    } catch (err) {
      setError(err.message || 'Failed to create project. Please check all fields.');
    }
  };
  return (
    <div className="project-form">
      <h2>Create New Project</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" placeholder="Minimum Budget" value={minBudget} onChange={(e) => setMinBudget(e.target.value)} required />
        <input type="number" placeholder="Maximum Budget" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} required />
        <input type="date" placeholder="Deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
        {skills.map((skill, index) => (
          <input key={index} type="text" placeholder="Skill" value={skill} onChange={(e) => handleSkillChange(index, e.target.value)} />
        ))}
        <button type="button" onClick={addSkill}>Add Skill</button>
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};
export default ProjectForm;
