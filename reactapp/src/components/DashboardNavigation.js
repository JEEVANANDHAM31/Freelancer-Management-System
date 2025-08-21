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

  const getWelcomeMessage = () => {
    const userName = user?.name || 'User';
    if (user?.role === 'FREELANCER') {
      return `Hi ${userName}! Ready to find your next project?`;
    } else if (user?.role === 'CLIENT') {
      return `Hi ${userName}! Ready to hire top talent?`;
    }
    return `Welcome ${userName}!`;
  };

  const dashboardCards = [
    {
      title: 'My projects',
      description: 'Find and apply to exciting freelance projects',
      icon: '📋',
      path: '/projects',
      color: '#3498db',
      roles: ['FREELANCER', 'CLIENT']
    },
    {
      title: 'Browse projects',
      description: 'Manage your active projects and contracts',
      icon: '⚙️',
      path: '/my-projects',
      color: '#2ecc71',
      roles: ['FREELANCER', 'CLIENT']
    },
    {
      title: 'Proposals',
      description: 'View and manage your proposals',
      icon: '📝',
      path: '/proposals',
      color: '#f39c12',
      roles: ['FREELANCER', 'CLIENT']
    },
    {
      title: 'Contracts',
      description: 'Manage your active contracts and agreements',
      icon: '📄',
      path: '/contracts',
      color: '#e74c3c',
      roles: ['FREELANCER', 'CLIENT']
    },
    {
      title: 'Post New Project',
      description: 'Create a new project and hire freelancers',
      icon: '➕',
      path: '/projects/new',
      color: '#9b59b6',
      roles: ['CLIENT']
    },
   
  ];

  const filteredCards = dashboardCards.filter(card => 
    card.roles.includes(user?.role) || (card.roles.includes('FREELANCER') && card.roles.includes('CLIENT'))
  );

  return (
    <div className="dashboard-navigation">
      <div className="dashboard-header">
        <h1>{getWelcomeMessage()}</h1>
        <p className="dashboard-subtitle">
          {user?.role === 'FREELANCER' 
            ? 'Discover amazing opportunities and grow your freelance career'
            : 'Find talented freelancers to bring your projects to life'}
        </p>
      </div>

      <div className="dashboard-grid">
        {filteredCards.map((card, index) => (
          <div 
            key={index} 
            className="dashboard-card"
            style={{ borderLeftColor: card.color }}
            onClick={() => handleNavigation(card.path)}
          >
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <button className="card-button">Go to {card.title}</button>
          </div>
        ))}
      </div>

      <div className="dashboard-footer">
        <p>Need help getting started? Check out our <a href="/help">help center</a> or <a href="/contact">contact support</a>.</p>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '10px' }}></p>

        </div>
      </div>
    </div>
  );
};

export default DashboardNavigation;
