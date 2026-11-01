import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './ProposalListing.css';

const ProposalListing = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingProposal, setEditingProposal] = useState(null);
  const [editBid, setEditBid] = useState('');
  const [editDays, setEditDays] = useState('');
  const [editText, setEditText] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : {};
  const isFreelancer = user.role === 'FREELANCER';

  /* ── Fetch proposals ──────────────────────────── */
  const fetchProposals = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8080/api/proposals');
      if (!res.ok) throw new Error('Failed to fetch proposals');
      const all = await res.json();
      const filtered = isFreelancer
        ? (all || []).filter(p => Number(p.freelancerId) === Number(user.id))
        : (all || []);
      setProposals(filtered);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isFreelancer, user.id]);

  useEffect(() => { 
    fetchProposals(); 
  }, [fetchProposals]);

  /* ── Edit Modal Helpers ──────────────────────── */
  const openEdit = (p) => {
    setEditingProposal(p);
    setEditBid(p.bidAmount);
    setEditDays(p.estimatedDays);
    setEditText(p.proposalText);
    setEditError('');
    setEditSuccess('');
  };

  const closeEdit = () => {
    setEditingProposal(null);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');

    const bid = parseFloat(editBid);
    const days = parseInt(editDays, 10);
    const text = String(editText).trim();

    if (isNaN(bid) || bid <= 0) {
      setEditError('Bid must be greater than 0.');
      return;
    }
    if (isNaN(days) || days < 1 || days > 60) {
      setEditError('Estimated days must be between 1 and 60.');
      return;
    }
    if (text.length < 20) {
      setEditError('Proposal text must be at least 20 characters.');
      return;
    }

    setEditSaving(true);
    try {
      const res = await fetch(`http://localhost:8080/api/proposals/${editingProposal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: editingProposal.projectId,
          freelancerId: editingProposal.freelancerId,
          bidAmount: bid,
          estimatedDays: days,
          proposalText: text,
          status: editingProposal.status,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || 'Update failed');
      }

      const updated = await res.json();
      setProposals(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditSuccess('Proposal updated successfully!');
      setTimeout(closeEdit, 1200);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditSaving(false);
    }
  };

  /* ── Filtered Proposals ──────────────────────── */
  const filteredProposals = proposals.filter((p) => {
    if (statusFilter === 'ALL') return true;
    return (p.status || 'PENDING').toUpperCase() === statusFilter;
  });

  const totalAccepted = proposals.filter(p => (p.status || '').toUpperCase() === 'ACCEPTED').length;
  const totalPending = proposals.filter(p => (p.status || '').toUpperCase() === 'PENDING').length;

  if (loading) {
    return (
      <div className="pl-page">
        <div className="pl-state">
          <div className="pl-spinner" />
          <p>Loading proposals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pl-page">
        <div className="pl-state pl-error">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-page animate-fade-in">
      {/* Header Banner */}
      <div className="pl-header-box">
        <div className="pl-header-left">
          <span className="pl-badge-category">PROPOSAL PIPELINE</span>
          <h1 className="pl-title">
            {isFreelancer ? 'My Submitted Proposals' : 'Candidate Proposals'}
          </h1>
          <p className="pl-subtitle">
            {isFreelancer
              ? 'Track your active bids, monitor client decisions, and make updates.'
              : 'Review incoming quotes, compare applicant experience, and select candidates.'}
          </p>
        </div>

        {/* Quick Stats Strip */}
        <div className="pl-header-metrics">
          <div className="pl-metric-box">
            <span className="pl-metric-num">{proposals.length}</span>
            <span className="pl-metric-lbl">Total</span>
          </div>
          <div className="pl-metric-box">
            <span className="pl-metric-num pl-metric-green">{totalAccepted}</span>
            <span className="pl-metric-lbl">Accepted</span>
          </div>
          <div className="pl-metric-box">
            <span className="pl-metric-num pl-metric-amber">{totalPending}</span>
            <span className="pl-metric-lbl">Pending</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="pl-filter-tabs">
        <button
          className={`pl-tab-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setStatusFilter('ALL')}
        >
          All ({proposals.length})
        </button>
        <button
          className={`pl-tab-btn ${statusFilter === 'PENDING' ? 'active' : ''}`}
          onClick={() => setStatusFilter('PENDING')}
        >
          Pending ({totalPending})
        </button>
        <button
          className={`pl-tab-btn ${statusFilter === 'ACCEPTED' ? 'active' : ''}`}
          onClick={() => setStatusFilter('ACCEPTED')}
        >
          Accepted ({totalAccepted})
        </button>
        <button
          className={`pl-tab-btn ${statusFilter === 'REJECTED' ? 'active' : ''}`}
          onClick={() => setStatusFilter('REJECTED')}
        >
          Dismissed
        </button>
      </div>

      {/* Proposals List */}
      {filteredProposals.length === 0 ? (
        <div className="pl-empty-card">
          <div className="pl-empty-icon">📭</div>
          <h3>No proposals found</h3>
          <p>
            {isFreelancer
              ? "You haven't submitted any proposals matching this criteria. Browse available projects to submit a bid!"
              : 'No proposals currently match this filter.'}
          </p>
          {isFreelancer && (
            <Link to="/projects" className="btn btn-primary" style={{ marginTop: '0.75rem' }}>
              Explore Projects
            </Link>
          )}
        </div>
      ) : (
        <div className="pl-grid">
          {filteredProposals.map((proposal) => {
            const status = (proposal.status || 'PENDING').toUpperCase();
            const isPending = status === 'PENDING';
            const isAccepted = status === 'ACCEPTED';

            return (
              <div 
                key={proposal.id} 
                className={`pl-card ${isAccepted ? 'pl-card-accepted' : ''} ${status === 'REJECTED' ? 'pl-card-rejected' : 'pl-card-pending'}`}
              >
                <div className="pl-card-top">
                  <div>
                    <h3 className="pl-card-title">
                      Proposal #{proposal.id}
                    </h3>
                    <span className="pl-card-sub">
                      Target Project #{proposal.projectId} • Freelancer ID: {proposal.freelancerId}
                    </span>
                  </div>

                  <div className="pl-card-top-right">
                    <span className="pl-card-bid-val">${proposal.bidAmount}</span>
                    <span className={`pl-badge ${isAccepted ? 'pl-badge-accepted' : status === 'REJECTED' ? 'pl-badge-rejected' : 'pl-badge-pending'}`}>
                      {status}
                    </span>
                  </div>
                </div>

                <div className="pl-meta-row">
                  <span className="pl-chip">💵 Proposed Bid: ${proposal.bidAmount}</span>
                  <span className="pl-chip">⏱️ Delivery in {proposal.estimatedDays} day{proposal.estimatedDays !== 1 ? 's' : ''}</span>
                  <span className="pl-chip">📁 Project #{proposal.projectId}</span>
                </div>

                <p className="pl-proposal-text">{proposal.proposalText}</p>

                <div className="pl-actions">
                  <Link
                    to={`/projects/${proposal.projectId}`}
                    className="btn btn-secondary btn-sm"
                  >
                    View Project Details
                  </Link>
                  {isFreelancer && isPending && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => openEdit(proposal)}
                    >
                      ✏️ Edit Proposal
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingProposal && (
        <div className="pl-modal-overlay" onClick={closeEdit}>
          <div className="pl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pl-modal-hdr">
              <div>
                <h2>Edit Proposal #{editingProposal.id}</h2>
                <small style={{ color: 'rgba(255,255,255,0.8)' }}>Update your terms for Project #{editingProposal.projectId}</small>
              </div>
              <button className="pl-modal-close" onClick={closeEdit}>✕</button>
            </div>

            <form onSubmit={handleEditSave} className="pl-modal-form">
              <div className="pl-modal-field">
                <label>Bid Amount ($)</label>
                <input
                  type="number"
                  value={editBid}
                  onChange={(e) => setEditBid(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div className="pl-modal-field">
                <label>Estimated Days (1–60)</label>
                <input
                  type="number"
                  value={editDays}
                  onChange={(e) => setEditDays(e.target.value)}
                  min="1"
                  max="60"
                  required
                />
              </div>

              <div className="pl-modal-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>Proposal Pitch</label>
                  <small style={{ color: String(editText).trim().length >= 20 ? '#10b981' : '#ef4444' }}>
                    {String(editText).trim().length} / min 20 chars
                  </small>
                </div>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              {editError && <div className="form-alert alert-error">{editError}</div>}
              {editSuccess && <div className="form-alert alert-success">{editSuccess}</div>}

              <div className="pl-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeEdit} disabled={editSaving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={editSaving}>
                  {editSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalListing;
