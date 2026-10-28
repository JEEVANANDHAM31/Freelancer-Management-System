import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chat from './Chat';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMessage, setActionMessage] = useState({});
  const [openChat, setOpenChat] = useState(null);

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : {};
  const isClient = user.role === 'CLIENT';
  const isFreelancer = user.role === 'FREELANCER';

  /* ── Data fetching ─────────────────────────────────────────────── */
  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/projects/${projectId}`);
      if (!res.ok) throw new Error(`Project not found (ID: ${projectId})`);
      setProject(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchProposals = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/proposals`);
      if (!res?.ok) { setProposals([]); return; }
      const all = await res.json();
      setProposals(
        (all || []).filter(p => p && Number(p.projectId) === Number(projectId) && p.freelancerId !== 1)
      );
    } catch {
      setProposals([]);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
    fetchProposals();
  }, [fetchProject, fetchProposals]);

  /* ── Approve / Reject ──────────────────────────────────────────── */
  const handleProposalAction = async (proposalId, newStatus) => {
    setActionLoading(prev => ({ ...prev, [proposalId]: true }));
    setActionMessage(prev => ({ ...prev, [proposalId]: null }));
    try {
      const res = await fetch(`http://localhost:8080/api/proposals/${proposalId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.message || 'Failed to update status');
      }
      const updated = await res.json();
      setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: updated.status } : p));
      setActionMessage(prev => ({
        ...prev,
        [proposalId]: {
          type: 'success',
          text: newStatus === 'ACCEPTED'
            ? '✅ Proposal approved! Chat is now open below.'
            : '❌ Proposal dismissed.',
        },
      }));
      // Auto-open chat when approved
      if (newStatus === 'ACCEPTED') setOpenChat(proposalId);
    } catch (err) {
      setActionMessage(prev => ({ ...prev, [proposalId]: { type: 'error', text: err.message } }));
    } finally {
      setActionLoading(prev => ({ ...prev, [proposalId]: false }));
    }
  };

  /* ── Helpers ───────────────────────────────────────────────────── */
  const statusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    const cls = s === 'ACCEPTED' ? 'badge-accepted'
      : s === 'REJECTED' ? 'badge-rejected'
        : 'badge-pending';
    const icon = s === 'ACCEPTED' ? '✓' : s === 'REJECTED' ? '✗' : '●';
    return <span className={`pd-badge ${cls}`}>{icon} {s}</span>;
  };

  /* ── Guards ────────────────────────────────────────────────────── */
  if (loading) return (
    <div className="pd-guard">
      <div className="pd-spinner" />
      <p>Loading project details…</p>
    </div>
  );
  if (error) return <div className="pd-guard pd-guard-error" data-testid="project-details-error">{error}</div>;
  if (!project) return <div className="pd-guard pd-guard-error">Project not found</div>;

  return (
    <div className="pd-page" data-testid="loading-details">

      {/* ── Back ── */}
      <button className="pd-back-btn" onClick={() => navigate('/projects')}>
        ← Back to Projects
      </button>

      {/* ── Project Hero ── */}
      <div className="pd-hero">
        <div className="pd-hero-left">
          <span className="pd-hero-tag">Project #{project.id}</span>
          <h1 className="pd-hero-title">{project.title}</h1>
          <p className="pd-hero-desc">{project.description}</p>
        </div>
        <div className="pd-hero-meta">
          <div className="pd-meta-pill">
            <span className="pd-meta-icon">💰</span>
            <div>
              <span className="pd-meta-label">Budget</span>
              <span className="pd-meta-val">${project.minBudget} – ${project.maxBudget}</span>
            </div>
          </div>
          <div className="pd-meta-pill">
            <span className="pd-meta-icon">📅</span>
            <div>
              <span className="pd-meta-label">Deadline</span>
              <span className="pd-meta-val">{project.deadline}</span>
            </div>
          </div>
          <div className="pd-meta-pill">
            <span className="pd-meta-icon">🛠️</span>
            <div>
              <span className="pd-meta-label">Skills</span>
              <span className="pd-meta-val">
                {Array.isArray(project.skills) && project.skills.length > 0
                  ? project.skills.join(', ')
                  : 'N/A'}
              </span>
            </div>
          </div>
          <div className="pd-meta-pill">
            <span className="pd-meta-icon">👤</span>
            <div>
              <span className="pd-meta-label">Client ID</span>
              <span className="pd-meta-val">{project.clientId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="pd-actions-bar">
        {isFreelancer && (
          <button
            className="pd-btn pd-btn-primary"
            data-testid="submit-proposal-btn"
            onClick={() => navigate(`/projects/${projectId}/proposal`)}
          >
            📝 Submit Proposal
          </button>
        )}
        <button
          className="pd-btn pd-btn-secondary"
          onClick={() => navigate(`/projects/${projectId}/files`)}
        >
          📁 Manage Files
        </button>
      </div>

      {/* ── Proposals ── */}
      <div className="pd-proposals-section">
        <div className="pd-section-header">
          <h2 className="pd-section-title">
            📋 Proposals
            <span className="pd-proposals-count">{proposals.length}</span>
          </h2>
          {isClient && <p className="pd-section-hint">Review and approve the best fit for your project.</p>}
          {isFreelancer && <p className="pd-section-hint">View all proposals submitted for this project.</p>}
        </div>

        {proposals.length === 0 ? (
          <div className="pd-empty">
            <span className="pd-empty-icon">📭</span>
            <p>No proposals yet.{isFreelancer ? ' Be the first to apply!' : ''}</p>
          </div>
        ) : (
          <div className="pd-proposals-list">
            {proposals.map(proposal => {
              const status = (proposal.status || 'PENDING').toUpperCase();
              const isPending = status === 'PENDING';
              const isAccepted = status === 'ACCEPTED';
              const isActing = actionLoading[proposal.id];
              const msg = actionMessage[proposal.id];

              // Freelancer sees chat only on their own accepted proposal
              const isMyProposal = isFreelancer && Number(proposal.freelancerId) === Number(user.id);
              // Client sees chat on ALL accepted proposals
              // *** FIX: removed isOwner restriction — any CLIENT can see the chat ***
              const canChat = isAccepted && (isClient || isMyProposal);

              const otherUserId = isClient ? proposal.freelancerId : project.clientId;
              const otherUserName = isClient ? `Freelancer #${proposal.freelancerId}` : `Client #${project.clientId}`;

              return (
                <div
                  key={proposal.id}
                  className={`pd-proposal-card ${isAccepted ? 'pd-proposal-accepted' : ''} ${status === 'REJECTED' ? 'pd-proposal-rejected' : ''}`}
                >
                  {/* Card header */}
                  <div className="pd-proposal-header">
                    <div className="pd-proposal-id">
                      <span className="pd-proposal-num">Proposal #{proposal.id}</span>
                      <span className="pd-proposal-freelancer">by Freelancer #{proposal.freelancerId}</span>
                    </div>
                    <div className="pd-proposal-header-right">
                      <span className="pd-proposal-bid">${proposal.bidAmount}</span>
                      {statusBadge(proposal.status)}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="pd-proposal-body">
                    <p className="pd-proposal-text">{proposal.proposalText}</p>
                    <div className="pd-proposal-info-row">
                      <span className="pd-proposal-info-chip">
                        🕐 {proposal.estimatedDays} day{proposal.estimatedDays !== 1 ? 's' : ''}
                      </span>
                      <span className="pd-proposal-info-chip">
                        💵 Bid: ${proposal.bidAmount}
                      </span>
                    </div>
                  </div>

                  {/* Client actions */}
                  {isClient && isPending && (
                    <div className="pd-proposal-actions">
                      <button
                        className="pd-approve-btn"
                        disabled={isActing}
                        onClick={() => handleProposalAction(proposal.id, 'ACCEPTED')}
                      >
                        {isActing ? <span className="pd-btn-spinner" /> : '✓'} Approve
                      </button>
                      <button
                        className="pd-dismiss-btn"
                        disabled={isActing}
                        onClick={() => handleProposalAction(proposal.id, 'REJECTED')}
                      >
                        {isActing ? <span className="pd-btn-spinner" /> : '✗'} Dismiss
                      </button>
                    </div>
                  )}

                  {/* Feedback */}
                  {msg && (
                    <div className={`pd-feedback ${msg.type === 'success' ? 'pd-feedback-ok' : 'pd-feedback-err'}`}>
                      {msg.text}
                    </div>
                  )}

                  {/* Collaboration Chat */}
                  {canChat && (
                    <div className="pd-chat-area">
                      <button
                        className="pd-chat-toggle"
                        onClick={() => setOpenChat(openChat === proposal.id ? null : proposal.id)}
                      >
                        <span>{openChat === proposal.id ? '▲' : '💬'}</span>
                        {openChat === proposal.id ? 'Close Chat' : 'Collaboration Chat'}
                      </button>
                      {openChat === proposal.id && (
                        <Chat
                          proposalId={proposal.id}
                          currentUser={user}
                          otherUserId={otherUserId}
                          otherUserName={otherUserName}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
