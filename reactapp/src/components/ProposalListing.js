import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './ProposalListing.css';

const ProposalListing = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        ? all.filter(p => Number(p.freelancerId) === Number(user.id))
        : all;
      setProposals(filtered);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isFreelancer, user.id]);

  useEffect(() => { fetchProposals(); }, [fetchProposals]);

  /* ── Edit Helpers ─────────────────────────────── */
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
    const days = parseInt(editDays);
    const text = String(editText).trim();
    if (isNaN(bid) || bid <= 0) { setEditError('Bid must be greater than 0.'); return; }
    if (isNaN(days) || days < 1 || days > 60) { setEditError('Estimated days must be between 1 and 60.'); return; }
    if (text.length < 20) { setEditError('Proposal text must be at least 20 characters.'); return; }
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
      setTimeout(closeEdit, 1400);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditSaving(false);
    }
  };

  /* ── Badge helper ─────────────────────────────── */
  const badge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    const cls = s === 'ACCEPTED' ? 'pl-badge-accepted'
      : s === 'REJECTED' ? 'pl-badge-rejected'
        : 'pl-badge-pending';
    const icon = s === 'ACCEPTED' ? '✓' : s === 'REJECTED' ? '✗' : '●';
    return <span className={`pl-badge ${cls}`}>{icon} {s}</span>;
  };

  const cardClass = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    return s === 'ACCEPTED' ? 'pl-card pl-card-accepted'
      : s === 'REJECTED' ? 'pl-card pl-card-rejected'
        : 'pl-card pl-card-pending';
  };

  /* ── Render ───────────────────────────────────── */
  if (loading) return (
    <div className="pl-state">
      <div className="pl-spinner" />
      <p>Loading proposals…</p>
    </div>
  );

  if (error) return (
    <div className="pl-state pl-error">
      <p>⚠️ {error}</p>
    </div>
  );

  return (
    <div className="pl-page">
      {/* Header */}
      <div className="pl-header">
        <h1 className="pl-title">
          {isFreelancer ? '📝 My Proposals' : '📋 All Proposals'}
        </h1>
        <p className="pl-subtitle">
          {isFreelancer
            ? 'Track your submitted proposals and their current status.'
            : 'Review and manage all received proposals.'}
        </p>
      </div>

      {/* List */}
      {proposals.length === 0 ? (
        <div className="pl-empty">
          <span className="pl-empty-icon">📭</span>
          <p>
            {isFreelancer
              ? "You haven't submitted any proposals yet. Browse projects to get started!"
              : 'No proposals found.'}
          </p>
        </div>
      ) : (
        <div className="pl-grid">
          {proposals.map(proposal => {
            const status = (proposal.status || 'PENDING').toUpperCase();
            const isPending = status === 'PENDING';

            return (
              <div key={proposal.id} className={cardClass(proposal.status)}>
                {/* Top row */}
                <div className="pl-card-top">
                  <div>
                    <p className="pl-card-title">
                      Proposal #{proposal.id} — Project #{proposal.projectId}
                    </p>
                    <p className="pl-card-sub">Freelancer ID: {proposal.freelancerId}</p>
                  </div>
                  {badge(proposal.status)}
                </div>

                {/* Meta chips */}
                <div className="pl-meta-row">
                  <span className="pl-chip">💵 ${proposal.bidAmount}</span>
                  <span className="pl-chip">🕐 {proposal.estimatedDays} day{proposal.estimatedDays !== 1 ? 's' : ''}</span>
                  <span className="pl-chip">📂 Project #{proposal.projectId}</span>
                </div>

                {/* Proposal text */}
                <p className="pl-proposal-text">{proposal.proposalText}</p>

                {/* Actions */}
                <div className="pl-actions">
                  <Link
                    to={`/projects/${proposal.projectId}`}
                    className="pl-view-btn"
                  >
                    🔗 View Project
                  </Link>
                  {isFreelancer && isPending && (
                    <button
                      className="pl-edit-btn"
                      onClick={() => openEdit(proposal)}
                    >
                      ✏️ Edit
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
          <div className="pl-modal" onClick={e => e.stopPropagation()}>
            <div className="pl-modal-hdr">
              <h2>Edit Proposal #{editingProposal.id}</h2>
              <button className="pl-modal-close" onClick={closeEdit}>✕</button>
            </div>
            <form onSubmit={handleEditSave} className="pl-modal-form">
              <div className="pl-modal-field">
                <label>Bid Amount ($)</label>
                <input
                  type="number"
                  value={editBid}
                  onChange={e => setEditBid(e.target.value)}
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
                  onChange={e => setEditDays(e.target.value)}
                  min="1"
                  max="60"
                  required
                />
              </div>
              <div className="pl-modal-field">
                <label>Proposal Description</label>
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  rows={5}
                  required
                />
                <small>{String(editText).trim().length} chars (min 20)</small>
              </div>
              {editError && <p className="pl-modal-err">{editError}</p>}
              {editSuccess && <p className="pl-modal-ok">{editSuccess}</p>}
              <div className="pl-modal-actions">
                <button type="button" className="pl-modal-cancel" onClick={closeEdit} disabled={editSaving}>
                  Cancel
                </button>
                <button type="submit" className="pl-modal-save" disabled={editSaving}>
                  {editSaving ? 'Saving…' : '💾 Save Changes'}
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