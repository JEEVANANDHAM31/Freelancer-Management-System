import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-blob hero-glow-1"></div>
        <div className="hero-glow-blob hero-glow-2"></div>
        
        <div className="hero-content">
          <div className="hero-pill-badge">
            <span className="pill-dot"></span>
            <span>The Premier Platform for Global Talent</span>
          </div>

          <h1 className="hero-title">
            Connect with World-Class Freelancers. <br />
            <span className="gradient-text">Build Ambitious Projects.</span>
          </h1>

          <p className="hero-subtitle">
            FreelanceHub bridges the gap between visionaries and top-tier digital talent. From development to design, assemble your dream team or find high-impact contracts.
          </p>

          <div className="hero-cta-group">
            {user ? (
              <>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                  Go to Dashboard
                </button>
                <button onClick={() => navigate('/projects')} className="btn btn-secondary btn-lg">
                  Browse Projects
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">
                  Get Started Free
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
                <button onClick={() => navigate('/projects')} className="btn btn-secondary btn-lg">
                  Explore Projects
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </>
            )}
          </div>

          {/* Stats Bar */}
          <div className="hero-stats-card">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Active Projects</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Vetted Freelancers</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">&lt; 24h</span>
              <span className="stat-label">Avg. Match Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Everything You Need</span>
            <h2 className="section-title">Built for Modern Freelancing</h2>
            <p className="section-description">
              A comprehensive suite of tools designed to streamline collaboration, contract management, and project delivery.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon-box icon-indigo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <h3>Precision Matching</h3>
              <p>Find the exact skills and domain expertise your project needs with structured proposals and skill tagging.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box icon-cyan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <h3>Milestone-Based Contracts</h3>
              <p>Track deliverables with granular contract milestones and progress statuses from start to finish.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box icon-emerald">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3>Protected Agreements</h3>
              <p>Clear transparent budgets, upfront terms, and documented agreements to safeguard clients and freelancers alike.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box icon-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3>Real-Time Chat</h3>
              <p>Collaborate effortlessly with built-in messaging for approved proposals without leaving the platform.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box icon-amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
              </div>
              <h3>File & Asset Manager</h3>
              <p>Upload specifications, creative designs, and project deliverables with dedicated file repositories.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box icon-rose">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <h3>Role-Based Portals</h3>
              <p>Tailored dashboards optimized for Clients hiring talent and Freelancers managing their pipeline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Simple Workflow</span>
            <h2 className="section-title">How FreelanceHub Works</h2>
            <p className="section-description">A streamlined experience from first post to final delivery.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Post or Explore</h3>
              <p>Clients create detailed project requirements with budget and timeline. Freelancers discover matching gigs.</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Propose & Agree</h3>
              <p>Submit customized proposals with bids and delivery estimates. Review, discuss via chat, and approve the best proposal.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Execute & Deliver</h3>
              <p>Formalize contracts, track progress via milestones, exchange files, and achieve outstanding results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bottom-cta-section">
        <div className="container">
          <div className="cta-banner-card">
            <div className="cta-banner-content">
              <h2>Ready to Elevate Your Work?</h2>
              <p>Join thousands of businesses and independent professionals already creating high quality work together.</p>
              <div className="cta-banner-actions">
                {user ? (
                  <button onClick={() => navigate('/projects')} className="btn btn-secondary btn-lg">
                    Browse Projects Now
                  </button>
                ) : (
                  <>
                    <button onClick={() => navigate('/register')} className="btn btn-secondary btn-lg">
                      Create Your Account
                    </button>
                    <button onClick={() => navigate('/login')} className="btn btn-outline-white btn-lg">
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
