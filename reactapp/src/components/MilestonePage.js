import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MilestonePage.css';

const MilestonePage = () => {
  const { contractId } = useParams();
  const { getAuthHeaders } = useAuth();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    dueDate: '',
    status: 'PENDING'
  });

  const fetchMilestones = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/contracts/${contractId}/milestones`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setMilestones(data);
      }
    } catch (error) {
      setError('Failed to load milestones');
    } finally {
      setLoading(false);
    }
  }, [contractId, getAuthHeaders]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/contracts/${contractId}/milestones`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchMilestones();
        setFormData({ description: '', dueDate: '', status: 'PENDING' });
        setShowForm(false);
      }
    } catch (error) {
      setError('Failed to create milestone');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const milestone = milestones.find(m => m.id === id);
      const response = await fetch(`http://localhost:8080/api/contracts/${contractId}/milestones/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...milestone, status })
      });
      if (response.ok) {
        fetchMilestones();
      }
    } catch (error) {
      setError('Failed to update milestone');
    }
  };

  if (loading) return <div className="loading">Loading milestones for contract {contractId}...</div>;

  console.log('MilestonePage loaded for contract:', contractId);

  return (
    <div className="milestone-page" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      <div className="milestone-header">
        <h1>Contract Milestones</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          {showForm ? 'Cancel' : 'Add Milestone'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="milestone-form">
          <h3>Create New Milestone</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Create Milestone</button>
          </form>
        </div>
      )}

      <div className="milestones-list">
        {milestones.map(milestone => (
          <div key={milestone.id} className="milestone-card">
            <div className="milestone-content">
              <h4>{milestone.description}</h4>
              <p className="due-date">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
              <div className="milestone-status">
                <span className={`status ${milestone.status.toLowerCase()}`}>
                  {milestone.status}
                </span>
              </div>
            </div>
            <div className="milestone-actions">
              <select 
                value={milestone.status} 
                onChange={(e) => updateStatus(milestone.id, e.target.value)}
                className="status-select"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestonePage;