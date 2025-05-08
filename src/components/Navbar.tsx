import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "#how-it-works", onClick: () => handleScrollToSection('how-it-works') },
    { name: "Testimonials", href: "#testimonials", onClick: () => handleScrollToSection('testimonials') },
    { name: "FAQ", href: "/faq" },
  ];

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
          
          <Button asChild className="hidden md:flex">
            <Link to="/setup">Start Practice</Link>
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
                  <Button asChild className="mt-4">
                    <Link to="/setup" onClick={() => setIsMenuOpen(false)}>
                      Start Practice
                    </Link>
                  </Button>
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
