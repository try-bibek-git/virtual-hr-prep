
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export function useAuthForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login successful!",
          description: "Redirecting to setup page...",
        });
        navigate("/setup");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { success, error } = await register(name, email, password);
      
      if (success) {
        toast({
          title: "Registration successful!",
          description: "Your account has been created. You can now log in.",
        });
        return true;
      } else {
        // Handle specific error cases
        let errorMessage = "Something went wrong. Please try again.";
        
        if (error?.message?.toLowerCase().includes("user already registered")) {
          errorMessage = "This email is already registered. Please use a different email or sign in.";
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        toast({
          title: "Redirecting to Google",
          description: "Please complete the authentication process.",
        });
        // The redirect will happen automatically through Supabase
      } else {
        toast({
          title: "Google login failed",
          description: "Something went wrong with Google authentication.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Google login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignIn,
    handleSignUp,
    handleGoogleSignIn,
  };
}
