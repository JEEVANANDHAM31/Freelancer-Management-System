import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardNavigation.css';

const DashboardNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const userName = user?.name || 'User';
  const isFreelancer = user?.role === 'FREELANCER';
  const isClient = user?.role === 'CLIENT';

  const dashboardCards = [
    {
      title: 'Browse Projects',
      description: 'Discover high-value freelance projects and submit winning proposals',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
      ),
      path: '/projects',
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
      colorTag: 'indigo',
      roles: ['FREELANCER', 'CLIENT']
    },
    {
      title: isClient ? 'My Posted Projects' : 'Project Management',
      description: isClient ? 'Manage your posted job requirements and applications' : 'View your active workspace and engagements',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
      ),
      path: '/my-projects',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      colorTag: 'cyan',
      roles: ['FREELANCER', 'CLIENT']
    },
    {
      title: 'Proposals',
      description: 'Track submissions, edit open pitches, or review candidate proposals',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      ),
      path: '/proposals',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      colorTag: 'amber',
      roles: ['FREELANCER', 'CLIENT']
    },
    {
      title: 'Contracts',
      description: 'Oversee legally binding contracts, milestones, and deliverable status',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      ),
      path: '/contracts',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      colorTag: 'emerald',
      roles: ['FREELANCER', 'CLIENT']
    },
    {
      title: 'Post New Project',
      description: 'Publish requirements, define budget range, and invite top freelancers',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      ),
      path: '/projects/new',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      colorTag: 'purple',
      roles: ['CLIENT']
    }
  ];

  const filteredCards = dashboardCards.filter(card => 
    card.roles.includes(user?.role) || (card.roles.includes('FREELANCER') && card.roles.includes('CLIENT'))
  );

  return (
    <div className="dashboard-navigation animate-fade-in">
      {/* Welcome Banner */}
      <div className="dash-welcome-banner">
        <div className="dash-welcome-text">
          <div className="dash-user-role-badge">
            <span className="dash-badge-dot"></span>
            <span>{user?.role || 'PORTAL'} WORKSPACE</span>
          </div>
          <h1>
            {isFreelancer && `Welcome back, ${userName}!`}
            {isClient && `Hello, ${userName}!`}
            {!isFreelancer && !isClient && `Welcome, ${userName}!`}
          </h1>
          <p className="dashboard-subtitle">
            {isFreelancer 
              ? 'Discover exciting opportunities, track proposal reviews, and execute project milestones.'
              : 'Find vetted freelance professionals, review incoming bids, and manage active contracts.'}
          </p>
        </div>
        
        {isClient && (
          <button onClick={() => navigate('/projects/new')} className="btn btn-primary dash-action-cta">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Post a Project
          </button>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="dash-quick-stats">
        <div className="dash-stat-pill" onClick={() => navigate('/projects')}>
          <div className="dash-stat-icon-wrapper" style={{ background: '#eef2ff', color: '#4f46e5' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-label">Projects</span>
            <span className="dash-stat-val">Explore All</span>
          </div>
        </div>

        <div className="dash-stat-pill" onClick={() => navigate('/proposals')}>
          <div className="dash-stat-icon-wrapper" style={{ background: '#fffbeb', color: '#d97706' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-label">Proposals</span>
            <span className="dash-stat-val">View Pipeline</span>
          </div>
        </div>

        <div className="dash-stat-pill" onClick={() => navigate('/contracts')}>
          <div className="dash-stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#059669' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-label">Contracts</span>
            <span className="dash-stat-val">Manage Active</span>
          </div>
        </div>
      </div>

      {/* Main Action Hub Grid */}
      <div className="dashboard-grid">
        {filteredCards.map((card, index) => (
          <div 
            key={index} 
            className="dashboard-card"
            onClick={() => handleNavigation(card.path)}
          >
            <div className="dash-card-header">
              <div className="card-icon" style={{ background: card.gradient }}>
                {card.icon}
              </div>
              <div className="dash-card-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>

            <div className="dash-card-content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>

            <button className="card-button">
              <span>Go to {card.title}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="dashboard-footer">
        <p>
          Need assistance or have questions? Check out our <a href="#help">Help Center</a> or <a href="#contact">Contact Support</a>.
        </p>
      </div>
    </div>
  );
};

export default DashboardNavigation;
