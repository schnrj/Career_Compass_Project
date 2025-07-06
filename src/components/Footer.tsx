import { Link } from 'react-router-dom';
import { Compass, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Compass className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Career Compass</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Tailor your resume. Land your dream job. Get AI-powered insights to improve your job application success rate.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/upload" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Upload Documents
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Analysis History
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Connect</h4>
            <div className="flex space-x-3">
              <a
                href="#"
                className="bg-muted p-2 rounded-lg hover:bg-muted/80 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="bg-muted p-2 rounded-lg hover:bg-muted/80 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="bg-muted p-2 rounded-lg hover:bg-muted/80 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Built with React, TypeScript, and Tailwind CSS
              </p>
              <p className="text-xs text-muted-foreground">
                Ready for REST API integration
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Career Compass. All rights reserved. Built for developers who value clean, maintainable code.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;