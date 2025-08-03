import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Upload, History, Home, User, LogOut } from "lucide-react";
import { authService } from "@/services/AuthService";
import AuthModal from "@/components/auth/AuthModal";
import React from "react";

/**
 * Navigation Class Controller
 * Handles navigation state and authentication logic
 */
class NavigationController {
  private static instance: NavigationController;

  public static getInstance(): NavigationController {
    if (!NavigationController.instance) {
      NavigationController.instance = new NavigationController();
    }
    return NavigationController.instance;
  }

  /**
   * Handle user logout
   * Calls AuthService logout and redirects appropriately
   */
  public async handleLogout(): Promise<void> {
    try {
      await authService.logout();
      // Optional: Show logout success message
      console.log("User logged out successfully");
      // Optional: Redirect to home page or login page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  /**
   * Check if current path is active
   */
  public isActive(currentPath: string, targetPath: string): boolean {
    return currentPath === targetPath;
  }
}

const Navigation = () => {
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authModalMode, setAuthModalMode] = React.useState<"login" | "signup">(
    "login"
  );
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);

  const navigationController = NavigationController.getInstance();

  /**
   * Check authentication status on component mount and route changes
   */
  React.useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = authService.isAuthenticated();
      const user = authService.getStoredUser();
      setIsAuthenticated(authenticated);
      setCurrentUser(user);
    };

    checkAuthStatus();
  }, [location]);

  /**
   * Handle authentication modal
   */
  const openAuthModal = (mode: "login" | "signup") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  /**
   * Handle successful authentication
   */
  const handleAuthSuccess = () => {
    const user = authService.getStoredUser();
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    await navigationController.handleLogout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const isActive = (path: string) => {
    return navigationController.isActive(location.pathname, path);
  };

  return (
    <nav className="bg-card border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Compass className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Career Compass
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/upload"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/upload")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Link>

            <Link
              to="/history"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/history")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </Link>
          </div>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="hidden md:block text-sm text-muted-foreground">
                  Welcome, {currentUser?.firstName || "User"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:block">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuthModal("login")}
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden md:block">Login</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => openAuthModal("signup")}
                  className="flex items-center space-x-2"
                >
                  <span>Sign Up</span>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-2">
            <Button variant="ghost" size="sm">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        defaultMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </nav>
  );
};

export default Navigation;
