import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext';
import { UserRole } from '../../types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  allowedRoles = ['Manager', 'Worker'] 
}) => {
  const { isAuthenticated, role } = useAuthContext();

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const dashboardPath = `/dashboard/${role.toLowerCase()}`;
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;