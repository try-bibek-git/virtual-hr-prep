
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff, ArrowLeft, MessageSquare } from "lucide-react";
import JobRolesManager from "@/components/admin/JobRolesManager";
import ThemeToggle from "@/components/ThemeToggle";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (credentials.username === "admin" && credentials.password === "2003") {
      setIsAuthenticated(true);
      toast({
        title: "Welcome Admin!",
        description: "You have successfully logged in to the admin panel.",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: "", password: "" });
    toast({
      title: "Logged Out",
      description: "You have been logged out of the admin panel.",
    });
  };

  // Custom header component for admin panel
  const AdminHeader = () => (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">VirtualHR</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated && (
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Admin Panel
            </Button>
          )}
        </div>
      </div>
    </header>
  );

  if (!isAuthenticated) {
    return (
      <>
        <AdminHeader />
        <div className="min-h-screen flex flex-col bg-gradient-blue dark:bg-gradient-blue-dark">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
              <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">Admin Login</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={credentials.username}
                        onChange={(e) =>
                          setCredentials({ ...credentials, username: e.target.value })
                        }
                        placeholder="Enter admin username"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={credentials.password}
                          onChange={(e) =>
                            setCredentials({ ...credentials, password: e.target.value })
                          }
                          placeholder="Enter admin password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Login to Admin Panel
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-gradient-blue dark:bg-gradient-blue-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
          
          <JobRolesManager />
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
