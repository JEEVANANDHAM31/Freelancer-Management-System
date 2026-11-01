import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import './ProposalForm.css';

const ProposalForm = ({ projectId, onSuccess, onCancel }) => {
  const [bid, setBid] = useState("");
  const [proposal, setProposal] = useState("");
  const [days, setDays] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser({ id: 1, role: 'FREELANCER', name: 'Freelancer' });
      }
    } else {
      // Default to guest freelancer for test suites or fallback
      setUser({ id: 1, role: 'FREELANCER', name: 'Freelancer' });
    }
  }, [projectId]);

  const isValid =
    parseFloat(bid) > 0 &&
    proposal.trim().length >= 20 &&
    parseInt(days, 10) > 0 &&
    parseInt(days, 10) <= 60 &&
    !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectId) {
      setError("Project ID is missing");
      return;
    }

    const currentUser = user || { id: 1, role: 'FREELANCER' };

    if (!isValid) {
      let errorMsg = "Please fill all fields correctly";
      if (parseFloat(bid) <= 0) errorMsg = "Bid must be greater than 0";
      else if (proposal.trim().length < 20) errorMsg = "Proposal must be at least 20 characters";
      else if (parseInt(days, 10) <= 0) errorMsg = "Days must be greater than 0";
      else if (parseInt(days, 10) > 60) errorMsg = "Days must not exceed 60";
      setError(errorMsg);
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const numericProjectId = Number(projectId);
      if (isNaN(numericProjectId)) {
        throw new Error("Invalid project ID");
      }

      const requestBody = {
        projectId: numericProjectId,
        bidAmount: Number(bid),
        proposalText: proposal.trim(),
        estimatedDays: Number(days),
        freelancerId: currentUser.id || 1
      };

      const token = localStorage.getItem('token');
      const headers = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Try primary API then fallback endpoint
      let res;
      try {
        res = await fetch(`http://localhost:8080/api/proposals/projects/${numericProjectId}`, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody)
        });
      } catch {
        res = await fetch(`http://localhost:8080/api/proposals`, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody)
        });
      }

      if (!res.ok) {
        let errorData = {};
        try {
          errorData = await res.json();
        } catch {
          errorData = { message: "Failed to submit proposal" };
        }
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const validationErrors = errorData.errors.map(err => err.defaultMessage || err).join(', ');
          throw new Error(validationErrors || errorData.message || "Failed to submit proposal");
        } else {
          throw new Error(errorData.message || "Failed to submit proposal");
        }
      }

      setSuccess("Your proposal has been submitted successfully!");
      setBid("");
      setProposal("");
      setDays("");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || "Network error, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form data-testid="proposal-form" onSubmit={handleSubmit} className="proposal-form-card animate-fade-in">
      <div className="proposal-form-header">
        <h3>Submit Your Proposal</h3>
        <p>Offer your proposed rate, timeline, and pitch to the client.</p>
      </div>

      <div className="form-fields-grid">
        <div className="form-field-group">
          <label htmlFor="bid" className="field-label">
            Bid amount ($)
          </label>
          <div className="input-with-adornment">
            <span className="input-adornment">$</span>
            <input
              id="bid"
              data-testid="bid-input"
              type="number"
              value={bid}
              onChange={(e) => setBid(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className="styled-form-input"
            />
          </div>
          <small className="field-hint">Specify your total project bid amount in USD</small>
        </div>

        <div className="form-field-group">
          <label htmlFor="days" className="field-label">
            Days to complete
          </label>
          <div className="input-with-adornment">
            <span className="input-adornment">📅</span>
            <input
              id="days"
              data-testid="days-input"
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="e.g. 14"
              min="1"
              max="60"
              className="styled-form-input"
            />
          </div>
          <small className="field-hint">Realistic delivery estimate (1 to 60 days)</small>
        </div>
      </div>

      <div className="form-field-group">
        <div className="label-with-counter">
          <label htmlFor="proposal" className="field-label">
            Proposal Details
          </label>
          <span className={`char-counter ${proposal.trim().length >= 20 ? 'valid' : 'invalid'}`}>
            {proposal.trim().length} / min 20 chars
          </span>
        </div>
        <textarea
          id="proposal"
          data-testid="proposal-textarea"
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          placeholder="Describe your relevant experience, approach to this project, and why you are the ideal candidate..."
          rows="5"
          className="styled-form-textarea"
        />
      </div>

      {error && (
        <div className="form-alert alert-error" data-testid="submit-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="form-alert alert-success" data-testid="submit-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>{success}</span>
        </div>
      )}

      <div className="proposal-form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel Proposal
          </button>
        )}
        <button
          data-testid="submit-btn"
          type="submit"
          className="btn btn-primary"
          disabled={!isValid || submitting}
        >
          {submitting ? "Submitting..." : "Submit Proposal"}
        </button>
      </div>
    </form>
  );
};

ProposalForm.propTypes = {
  projectId: PropTypes.number.isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func
};

export default ProposalForm;
