import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      padding: '0.85rem 1.75rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold'
        }}>
          ⚡
        </div>
        <Link to="/" style={{ color: '#0f172a', textDecoration: 'none', fontSize: '1.25rem', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Freelance<span style={{ color: '#4f46e5' }}>Hub</span>
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isAuthenticated() ? (
          <>
            <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: '500' }}>
              Welcome, <strong style={{ color: '#0f172a' }}>{user.name}</strong> ({user.role})
            </span>
            <Link to="/projects" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
              Projects
            </Link>
            <Link to="/dashboard" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
              Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
