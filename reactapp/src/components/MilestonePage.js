import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MilestonePage.css';

const MilestonePage = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      setError('Failed to update milestone');
    }
  };

  if (loading) {
    return (
      <div className="milestone-page">
        <div className="milestone-state">
          <div className="milestone-spinner"></div>
          <p className="loading">Loading milestones for contract {contractId}...</p>
        </div>
      </div>
    );
  }

  const completedCount = milestones.filter(m => (m.status || '').toUpperCase() === 'COMPLETED').length;

  return (
    <div className="milestone-page animate-fade-in">
      <button className="ms-back-btn" onClick={() => navigate(`/contracts/${contractId}`)}>
        ← Back to Contract #{contractId}
      </button>

      <div className="milestone-header">
        <div>
          <span className="ms-category-tag">PROGRESS TRACKER</span>
          <h1>Contract Milestones</h1>
          <p className="ms-header-subtitle">Track deliverables, due dates, and stage approvals for Contract #{contractId}</p>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary add-btn">
          {showForm ? '✕ Close Form' : '+ Add Milestone'}
        </button>
      </div>

      {/* Progress overview */}
      {milestones.length > 0 && (
        <div className="ms-progress-card">
          <div className="ms-progress-info">
            <span className="ms-progress-title">Milestone Completion</span>
            <span className="ms-progress-percent">
              {Math.round((completedCount / milestones.length) * 100)}% ({completedCount} of {milestones.length})
            </span>
          </div>
          <div className="ms-progress-bar-bg">
            <div 
              className="ms-progress-bar-fill" 
              style={{ width: `${(completedCount / milestones.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <div className="milestone-form animate-fade-in">
          <div className="ms-form-header">
            <h3>Create New Milestone</h3>
            <p>Define deliverable criteria and due date for your engagement.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Milestone Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="e.g. Complete responsive UI components and integrate with client API"
                rows="4"
                required
              />
            </div>
            <div className="form-group">
              <label>Target Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                required
              />
            </div>
            <div className="ms-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary submit-btn">
                Create Milestone
              </button>
            </div>
          </form>
        </div>
      )}

      {milestones.length === 0 && !showForm ? (
        <div className="ms-empty-state">
          <div className="ms-empty-icon">🎯</div>
          <h3>No milestones established</h3>
          <p>Break this contract down into manageable milestones to track progress and release payments.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ marginTop: '0.75rem' }}>
            Add First Milestone
          </button>
        </div>
      ) : (
        <div className="milestones-list">
          {milestones.map((milestone, idx) => {
            const statusKey = (milestone.status || 'PENDING').toLowerCase();
            return (
              <div key={milestone.id} className="milestone-card">
                <div className="milestone-index-pill">#{idx + 1}</div>
                <div className="milestone-content">
                  <h4>{milestone.description}</h4>
                  <p className="due-date">
                    📅 Due: {new Date(milestone.dueDate).toLocaleDateString()}
                  </p>
                  <div className="milestone-status">
                    <span className={`status ${statusKey}`}>
                      {milestone.status}
                    </span>
                  </div>
                </div>

                <div className="milestone-actions">
                  <label className="status-select-label">Update Status:</label>
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MilestonePage;
