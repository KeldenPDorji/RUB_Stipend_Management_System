import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('student' | 'admin')[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading, user, requiresMFA } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to MFA if it's required
    if (requiresMFA) {
      return <Navigate to="/auth/mfa-verify" state={{ from: location }} replace />;
    }
    
    // Otherwise redirect to login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If MFA is required, redirect to MFA page
  if (requiresMFA && location.pathname !== '/auth/mfa-verify') {
    return <Navigate to="/auth/mfa-verify" state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have required role
  if (requireAuth && isAuthenticated && allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user role
      const redirectPath = user.role === 'student' ? '/student/dashboard' : '/admin/dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;

// Convenience components for specific roles
export const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['student']}>
    {children}
  </ProtectedRoute>
);

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

// Component for routes that should only be accessible when NOT authenticated
export const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user, requiresMFA } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If MFA is required, allow access to MFA verify page
  if (requiresMFA && location.pathname === '/auth/mfa-verify') {
    return <>{children}</>;
  }

  // If user is already authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    const redirectPath = user.role === 'student' ? '/student/dashboard' : '/admin/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // If user is not authenticated or MFA is required, show the guest content
  return <>{children}</>;
};
