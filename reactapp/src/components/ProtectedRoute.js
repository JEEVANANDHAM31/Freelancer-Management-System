import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [shouldAllow, setShouldAllow] = useState(false);

  useEffect(() => {
    if (!loading) {
      const authStatus = isAuthenticated();
      setShouldAllow(authStatus);
      setIsAuthChecked(true);
    }
  }, [loading, isAuthenticated]);

  if (loading || !isAuthChecked) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      Loading...
    </div>;
  }

  if (!shouldAllow) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
