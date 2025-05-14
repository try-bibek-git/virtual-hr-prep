
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // When the session becomes available (either null or valid), 
    // we know we can stop loading
    if (session !== undefined) {
      setIsLoading(false);
    }
  }, [session]);

  // Show nothing while checking authentication status
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // If not authenticated after loading completes, redirect to login
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
