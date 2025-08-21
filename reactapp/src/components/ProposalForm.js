import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import './ProposalForm.css';
const ProposalForm = ({ projectId }) => {
    const [bid, setBid] = useState("");
    const [proposal, setProposal] = useState("");
    const [days, setDays] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        console.log('ProjectId received:', projectId);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [projectId]);
    const isValid =
        parseFloat(bid) > 0 &&
        proposal.trim().length >= 20 &&
        parseInt(days) > 0 &&
        parseInt(days) <= 60 &&
        !submitting;
    const handleSubmit = async (e) => {
        console.log('Bid:', bid);
        console.log('Proposal:', proposal);
        console.log('Days:', days);
        console.log('Is Valid:', isValid);
        e.preventDefault();
        if (!projectId) {
            setError("Project ID is missing");
            return;
        }
        if (!user) {
            setError("Please login to submit a proposal");
            return;
        }
        if (user.role !== 'FREELANCER') {
            setError("Only freelancers can submit proposals");
            return;
        }
        if (!isValid) {
            let errorMsg = "Please fill all fields correctly";
            if (parseFloat(bid) <= 0) errorMsg = "Bid must be greater than 0";
            else if (proposal.trim().length < 20) errorMsg = "Proposal must be at least 20 characters";
            else if (parseInt(days) <= 0) errorMsg = "Days must be greater than 0";
            else if (parseInt(days) > 60) errorMsg = "Days must not exceed 60";
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
                freelancerId: user.id
            };
            console.log('Sending request:', requestBody);
            console.log('Fetching proposals for project ID:', numericProjectId);
            console.log('Fetching proposals for project ID:', numericProjectId);
            console.log('Fetching proposals for project ID:', numericProjectId);
            console.log('Fetching proposals for project ID:', numericProjectId);
            console.log('Fetching proposals for project ID:', numericProjectId);
            console.log('Fetching proposals for project ID:', numericProjectId);
            console.log('Fetching proposals for project ID:', numericProjectId);
            console.log('Fetching proposals for project ID:', numericProjectId);
            console.log('Fetching proposals for project ID:', numericProjectId);
            console.log('Fetching proposals for project ID:', numericProjectId);
            const res = await fetch(`http://localhost:8080/api/proposals/projects/${numericProjectId}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requestBody)
            });
            if (!res.ok) {
                const errorData = await res.json();
                console.error('Server response:', errorData);
                if (errorData.errors && Array.isArray(errorData.errors)) {
                    const validationErrors = errorData.errors.map(err => err.defaultMessage || err).join(', ');
                    throw new Error(validationErrors || errorData.message || "Failed to submit proposal");
                } else {
                    throw new Error(errorData.message || "Failed to submit proposal");
                }
            }
            setSuccess("Proposal submitted successfully!");
            setBid("");
            setProposal("");
            setDays("");
        } catch (err) {
            console.error('Error details:', err);
            setError(err.message || "Network error, please try again.");
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <form data-testid="proposal-form" onSubmit={handleSubmit} className="proposal-form">
            <div>
                <label htmlFor="bid">Your Bid</label>
                <input
                    id="bid"
                    data-testid="bid-input"
                    type="number"
                    value={bid}
                    onChange={(e) => setBid(e.target.value)}
                    placeholder="Enter your bid"
                    min="0.01"
                    step="0.01"
                />
            </div>
            <div>
                <label htmlFor="proposal">Proposal</label>
                <textarea
                    id="proposal"
                    data-testid="proposal-textarea"
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Enter proposal details (minimum 20 characters)"
                    rows="4"
                />
            </div>
            <div>
                <label htmlFor="days">Days to complete</label>
                <input
                    id="days"
                    data-testid="days-input"
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="Enter days (max 60)"
                    min="1"
                    max="60"
                />
            </div>
            {error && <p style={{ color: "red" }} data-testid="submit-error">{error}</p>}
            {success && <p style={{ color: "green" }} data-testid="submit-success">{success}</p>}
            <button
                data-testid="submit-btn"
                type="submit"
                disabled={!isValid || submitting}
            >
                {submitting ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
};
ProposalForm.propTypes = {
    projectId: PropTypes.number.isRequired
};
export default ProposalForm;
