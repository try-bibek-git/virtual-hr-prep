
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    // When the session becomes available (either null or valid), 
    // we know we can stop loading
    if (session !== undefined) {
      console.log("Session available, auth state:", isAuthenticated ? "authenticated" : "not authenticated");
      
      // Add a small delay before making the final decision
      // This helps ensure any auth state updates have completed
      const timer = setTimeout(() => {
        setIsLoading(false);
        if (!isAuthenticated) {
          console.log("Not authenticated after check, will redirect to login");
          setRedirectToLogin(true);
        } else {
          console.log("Successfully authenticated, showing protected content");
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [session, isAuthenticated]);

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated after loading completes, redirect to login
  if (redirectToLogin) {
    toast({
      title: "Authentication required",
      description: "Please log in to access this page",
    });
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
