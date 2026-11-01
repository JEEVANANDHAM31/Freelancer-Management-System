import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CLIENT'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    const { success, error } = await register(formData.name, formData.email, formData.password, formData.role);
    if (success) {
      navigate('/login');
    } else {
      setError(error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-header" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1>Create Account</h1>
        <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
          Join FreelanceHub as a client or skilled professional
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label htmlFor="register-name">Full Name</label>
          <input
            id="register-name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            data-testid="register-name"
          />
        </div>
        <div>
          <label htmlFor="register-email">Email Address</label>
          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            data-testid="register-email"
          />
        </div>
        <div>
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            data-testid="register-password"
          />
        </div>
        <div>
          <label htmlFor="register-confirm-password">Confirm Password</label>
          <input
            id="register-confirm-password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            data-testid="register-confirm-password"
          />
        </div>
        <div>
          <label htmlFor="register-role">I Want To</label>
          <select
            id="register-role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            data-testid="register-role"
          >
            <option value="CLIENT">Hire Freelancers (Client)</option>
            <option value="FREELANCER">Work as a Freelancer</option>
            <option value="ADMIN">Platform Admin</option>
          </select>
        </div>

        {error && (
          <div className="error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading} data-testid="register-submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {loading && <span className="spinner" style={{ width: '16px', height: '16px' }} />}
          {loading ? 'Creating Account...' : 'Get Started'}
        </button>

        <p>
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
