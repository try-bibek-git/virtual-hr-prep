
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail, MessageSquare } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">VirtualHR</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              AI-powered interview practice to help you land your dream job.
            </p>
          </div>

          {/* Links Section */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="font-semibold">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/features" className="text-gray-600 dark:text-gray-400 hover:text-primary">Features</Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary">Pricing</Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary">FAQ</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary">Blog</Link>
                </li>
                <li>
                  <Link to="/guides" className="text-gray-600 dark:text-gray-400 hover:text-primary">Interview Guides</Link>
                </li>
                <li>
                  <Link to="/tips" className="text-gray-600 dark:text-gray-400 hover:text-primary">Tips & Tricks</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary">About Us</Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-600 dark:text-gray-400 hover:text-primary">Careers</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary">Contact</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-semibold">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:contact@virtualhr.com" aria-label="Email" className="hover:text-primary">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} VirtualHR. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0 text-sm">
            <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
