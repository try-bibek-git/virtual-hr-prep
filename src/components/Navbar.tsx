
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, LogOut, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Get user display name from user metadata or email
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    // Try to get name from user metadata
    const metadata = user.user_metadata;
    if (metadata && metadata.name) {
      return metadata.name;
    }
    
    // Try to get name from user metadata full_name
    if (metadata && metadata.full_name) {
      return metadata.full_name;
    }
    
    // Fallback to email
    return user.email ? user.email.split('@')[0] : 'User';
  };

  const handleScrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home page first
      window.location.href = `/#${sectionId}`;
    } else {
      // If on home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleStartPractice = () => {
    if (isAuthenticated) {
      navigate("/setup");
    } else {
      navigate("/login");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "#how-it-works", onClick: () => handleScrollToSection('how-it-works') },
    { name: "Testimonials", href: "#testimonials", onClick: () => handleScrollToSection('testimonials') },
    { name: "FAQ", href: "/faq" },
  ];

  // Get the user display name
  const userDisplayName = getUserDisplayName();

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <MessageSquareIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">VirtualHR</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            link.onClick ? (
              <button
                key={link.name}
                onClick={link.onClick}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled className="font-medium">
                  {userDisplayName}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="hidden md:flex">
              <Link to="/login">Login</Link>
            </Button>
          )}
          
          <Button onClick={handleStartPractice} className="hidden md:flex">
            Start Practice
          </Button>

          {/* Mobile Menu */}
          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 py-8">
                  <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                      <MessageSquareIcon className="h-6 w-6 text-primary" />
                      <span className="text-xl font-bold">VirtualHR</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      link.onClick ? (
                        <button
                          key={link.name}
                          onClick={link.onClick}
                          className="text-lg font-medium transition-colors hover:text-primary text-left"
                        >
                          {link.name}
                        </button>
                      ) : (
                        <Link
                          key={link.name}
                          to={link.href}
                          className="text-lg font-medium transition-colors hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      )
                    ))}
                  </nav>
                  
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                        <div className="text-lg font-medium">
                          {userDisplayName}
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                      <Button onClick={() => {
                        navigate("/setup");
                        setIsMenuOpen(false);
                      }}>
                        Start Practice
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" onClick={() => setIsMenuOpen(false)}>
                        <Link to="/login">Login / Sign Up</Link>
                      </Button>
                      <Button onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}>
                        Start Practice
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

// MessageSquare icon component
const MessageSquareIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
