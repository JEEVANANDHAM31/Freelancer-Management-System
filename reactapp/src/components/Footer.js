import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>FreelanceHub</h3>
            <p>Connecting talented freelancers with amazing projects worldwide.</p>
            <div className="social-links">
              <a href="https://facebook.com" aria-label="Facebook">📘</a>
              <a href="https://twitter.com" aria-label="Twitter">🐦</a>
              <a href="https://linkedin.com" aria-label="LinkedIn">💼</a>
              <a href="https://instagram.com" aria-label="Instagram">📷</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>For Clients</h4>
            <ul>
              <li><Link to="/projects/new">Post a Project</Link></li>
              <li><Link to="/projects">Browse Freelancers</Link></li>
              <li><Link to="/contracts">Manage Contracts</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>For Freelancers</h4>
            <ul>
              <li><Link to="/projects">Find Work</Link></li>
              <li><Link to="/dashboard">My Dashboard</Link></li>
              <li><Link to="/proposals">My Proposals</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 FreelanceHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;