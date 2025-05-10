
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
      const success = await register(name, email, password);
      if (success) {
        toast({
          title: "Registration successful!",
          description: "Your account has been created. You can now log in.",
        });
        return true;
      } else {
        toast({
          title: "Registration failed",
          description: "This email may already be in use.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
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
          title: "Login successful!",
          description: "Redirecting to setup page...",
        });
        navigate("/setup");
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
