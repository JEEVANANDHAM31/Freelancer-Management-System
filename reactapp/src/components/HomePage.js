import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Welcome to FreelanceHub</h1>
        <p>Connect talented freelancers with amazing projects worldwide. Build your career or find the perfect team member.</p>
        <div className="cta-buttons">
          {user ? (
            <>
              <button onClick={() => navigate('/dashboard')} className="btn-primary">
                Go to Dashboard
              </button>
              <button onClick={() => navigate('/projects')} className="btn-secondary">
                Browse Projects
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/register')} className="btn-primary">
                Get Started
              </button>
              <button onClick={() => navigate('/projects')} className="btn-secondary">
                Browse Projects
              </button>
            </>
          )}
        </div>
        
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Active Projects</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Freelancers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">98%</span>
            <span className="stat-label">Success Rate</span>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose FreelanceHub?</h2>
          <p className="features-subtitle">Everything you need to succeed in the freelance economy</p>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Find Perfect Matches</h3>
              <p>Advanced matching algorithm connects you with projects that fit your skills and interests perfectly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Professional Tools</h3>
              <p>Complete project management suite with milestones, contracts, and secure communication channels.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payments</h3>
              <p>Protected transactions with escrow services and multiple payment options for your peace of mind.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Quality Assurance</h3>
              <p>Verified profiles, ratings, and reviews ensure you work with trusted professionals every time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast Delivery</h3>
              <p>Streamlined workflows and clear deadlines help projects get completed on time, every time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Network</h3>
              <p>Access to worldwide talent pool and international opportunities for unlimited growth potential.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
