import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProposalForm from './ProposalForm';
import Chat from './Chat';
import './ProjectDetails.css';

const ProjectDetails = ({ projectId: propProjectId, onBack }) => {
  // Safe navigation guard for testing contexts without BrowserRouter
  let navigate;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate();
  } catch {
    navigate = null;
  }

  let routeParams = {};
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    routeParams = useParams() || {};
  } catch {
    routeParams = {};
  }

  const effectiveProjectId = propProjectId || routeParams.projectId;

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMessage, setActionMessage] = useState({});
  const [openChat, setOpenChat] = useState(null);

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : { role: 'FREELANCER' };
  const isClient = user.role === 'CLIENT';
  const isFreelancer = user.role === 'FREELANCER' || !user.role;

  /* ── Fetch Project ──────────────────────────────────────────────── */
  const fetchProject = useCallback(async () => {
    if (!effectiveProjectId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/projects/${effectiveProjectId}`);
      if (!res.ok) {
        throw new Error(`Project not found with ID: ${effectiveProjectId}`);
      }
      const data = await res.json();
      setProject(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [effectiveProjectId]);

  /* ── Fetch Proposals ────────────────────────────────────────────── */
  const fetchProposals = useCallback(async () => {
    if (!effectiveProjectId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/proposals`);
      if (!res?.ok) { setProposals([]); return; }
      const all = await res.json();
      setProposals(
        (all || []).filter(p => p && Number(p.projectId) === Number(effectiveProjectId) && p.freelancerId !== 1)
      );
    } catch {
      setProposals([]);
    }
  }, [effectiveProjectId]);

  useEffect(() => {
    fetchProject();
    fetchProposals();
  }, [fetchProject, fetchProposals]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigate) {
      navigate('/projects');
    }
  };

  /* ── Proposal Approval Actions ───────────────────────────────────── */
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
            ? 'Proposal approved! Collaboration chat is now active below.'
            : 'Proposal dismissed.',
        },
      }));
      if (newStatus === 'ACCEPTED') setOpenChat(proposalId);
    } catch (err) {
      setActionMessage(prev => ({ ...prev, [proposalId]: { type: 'error', text: err.message } }));
    } finally {
      setActionLoading(prev => ({ ...prev, [proposalId]: false }));
    }
  };

  const statusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    const cls = s === 'ACCEPTED' ? 'badge-accepted'
      : s === 'REJECTED' ? 'badge-rejected'
        : 'badge-pending';
    return <span className={`pd-status-pill ${cls}`}>{s}</span>;
  };

  /* ── Guards ─────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="pd-page" data-testid="loading-details">
        <div className="pd-state-wrap">
          <div className="pd-spinner" />
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-page">
        <button className="pd-back-btn" onClick={handleBack}>
          ← Back to Projects
        </button>
        <div className="pd-error-banner" data-testid="project-details-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pd-page">
        <button className="pd-back-btn" onClick={handleBack}>
          ← Back to Projects
        </button>
        <div className="pd-error-banner">
          <span>Project not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-page animate-fade-in" data-testid="loading-details">
      {/* Back button */}
      <button className="pd-back-btn" onClick={handleBack}>
        ← Back to Projects
      </button>

      {/* Main Project Overview Card */}
      <div className="pd-hero-card">
        <div className="pd-hero-header">
          <div>
            <div className="pd-tags-row">
              <span className="pd-id-tag">Project #{project.id}</span>
              <span className="pd-status-tag">ACTIVE</span>
            </div>
            <h1 className="pd-hero-title">{project.title}</h1>
          </div>

          <div className="pd-action-buttons">
            <button
              className="pd-btn pd-btn-primary"
              onClick={() => setShowProposalForm(!showProposalForm)}
            >
              {showProposalForm ? 'Hide Form' : 'Submit Proposal'}
            </button>

            {navigate && (
              <button
                className="pd-btn pd-btn-secondary"
                onClick={() => navigate(`/projects/${effectiveProjectId}/files`)}
              >
                📁 Manage Files
              </button>
            )}
          </div>
        </div>

        <p className="pd-hero-description">{project.description}</p>

        {/* Detailed Metadata Grid */}
        <div className="pd-meta-grid">
          <div className="pd-meta-box">
            <span className="pd-meta-icon">💰</span>
            <div className="pd-meta-content">
              <span className="pd-meta-label">Budget:</span>
              <span className="pd-meta-value">${project.minBudget} - ${project.maxBudget}</span>
            </div>
          </div>

          <div className="pd-meta-box">
            <span className="pd-meta-icon">📅</span>
            <div className="pd-meta-content">
              <span className="pd-meta-label">Deadline:</span>
              <span className="pd-meta-value">{project.deadline}</span>
            </div>
          </div>

          <div className="pd-meta-box">
            <span className="pd-meta-icon">🛠️</span>
            <div className="pd-meta-content">
              <span className="pd-meta-label">Skills required:</span>
              <span className="pd-meta-value">
                {Array.isArray(project.skills) && project.skills.length > 0
                  ? project.skills.join(', ')
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div className="pd-meta-box">
            <span className="pd-meta-icon">👤</span>
            <div className="pd-meta-content">
              <span className="pd-meta-label">Client ID:</span>
              <span className="pd-meta-value">{project.clientId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Proposal Form Toggle */}
      {showProposalForm && (
        <div className="pd-proposal-form-section">
          <ProposalForm
            projectId={Number(effectiveProjectId)}
            onCancel={() => setShowProposalForm(false)}
            onSuccess={() => {
              fetchProposals();
              setTimeout(() => setShowProposalForm(false), 2000);
            }}
          />
        </div>
      )}

      {/* Proposals Section */}
      <div className="pd-proposals-container">
        <div className="pd-section-hdr">
          <div className="pd-section-hdr-left">
            <h2>Proposals Received</h2>
            <span className="pd-count-pill">{proposals.length}</span>
          </div>
          <p className="pd-section-sub">
            {isClient
              ? 'Review candidate bids, approve collaborators, or initiate direct chat.'
              : 'View community proposals submitted for this project.'}
          </p>
        </div>

        {proposals.length === 0 ? (
          <div className="pd-empty-state">
            <div className="pd-empty-icon">📭</div>
            <p>No proposals submitted yet.{isFreelancer ? ' Be the first to place a bid!' : ''}</p>
          </div>
        ) : (
          <div className="pd-proposals-list">
            {proposals.map((proposal) => {
              const status = (proposal.status || 'PENDING').toUpperCase();
              const isPending = status === 'PENDING';
              const isAccepted = status === 'ACCEPTED';
              const isActing = actionLoading[proposal.id];
              const msg = actionMessage[proposal.id];

              const isMyProposal = isFreelancer && Number(proposal.freelancerId) === Number(user?.id);
              const canChat = isAccepted && (isClient || isMyProposal);

              const otherUserId = isClient ? proposal.freelancerId : project.clientId;
              const otherUserName = isClient ? `Freelancer #${proposal.freelancerId}` : `Client #${project.clientId}`;

              return (
                <div
                  key={proposal.id}
                  className={`pd-proposal-card ${isAccepted ? 'card-accepted' : ''} ${status === 'REJECTED' ? 'card-rejected' : ''}`}
                >
                  <div className="pd-pcard-header">
                    <div className="pd-pcard-user">
                      <div className="pd-freelancer-avatar">
                        F{proposal.freelancerId}
                      </div>
                      <div>
                        <span className="pd-pcard-num">Proposal #{proposal.id}</span>
                        <span className="pd-pcard-author">Freelancer #{proposal.freelancerId}</span>
                      </div>
                    </div>

                    <div className="pd-pcard-header-right">
                      <span className="pd-pcard-amount">${proposal.bidAmount}</span>
                      {statusBadge(proposal.status)}
                    </div>
                  </div>

                  <div className="pd-pcard-body">
                    <p className="pd-pcard-pitch">{proposal.proposalText}</p>
                    <div className="pd-pcard-chips">
                      <span className="pd-info-chip">
                        ⏱️ {proposal.estimatedDays} day{proposal.estimatedDays !== 1 ? 's' : ''}
                      </span>
                      <span className="pd-info-chip">
                        💵 Bid: ${proposal.bidAmount}
                      </span>
                    </div>
                  </div>

                  {/* Actions for Client */}
                  {isClient && isPending && (
                    <div className="pd-client-actions">
                      <button
                        className="btn btn-success btn-sm"
                        disabled={isActing}
                        onClick={() => handleProposalAction(proposal.id, 'ACCEPTED')}
                      >
                        ✓ Approve Proposal
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled={isActing}
                        onClick={() => handleProposalAction(proposal.id, 'REJECTED')}
                      >
                        ✕ Dismiss
                      </button>
                    </div>
                  )}

                  {msg && (
                    <div className={`pd-action-alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                      {msg.text}
                    </div>
                  )}

                  {/* Real-time collaboration chat */}
                  {canChat && (
                    <div className="pd-chat-drawer">
                      <button
                        className="btn btn-outline-primary btn-sm pd-chat-btn"
                        onClick={() => setOpenChat(openChat === proposal.id ? null : proposal.id)}
                      >
                        <span>{openChat === proposal.id ? 'Hide Chat' : '💬 Open Collaboration Chat'}</span>
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
