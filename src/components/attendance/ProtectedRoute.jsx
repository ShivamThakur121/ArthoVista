import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Pulsing smart clock spinner */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
          <div className="absolute w-10 h-10 bg-primary-100 dark:bg-primary-950/50 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-5 h-5 text-primary-500 animate-pulse-ring" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Verifying session...</p>
      </div>
    );
  }

  // Not logged in: redirect to login page keeping track of location
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but role not allowed: redirect to respective dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Unauthorized role access: ${user.role} tried to view administrative page.`);
    return <Navigate to={['Admin', 'Manager'].includes(user.role) ? '/admin' : '/employee'} replace />;
  }

  return children;
};

export default ProtectedRoute;
