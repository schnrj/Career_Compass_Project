/**
 * LoginPage Component
 *
 * Dedicated login page with full-screen layout.
 * Provides a professional authentication experience.
 *
 * Backend Integration:
 * - Uses AuthService for login functionality
 * - Redirects to dashboard/home after successful login
 * - Handles authentication errors and validation
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

/**
 * LoginPage Class Controller
 * Handles page-level login logic and navigation
 */
export class LoginPageController {
  private static instance: LoginPageController;

  public static getInstance(): LoginPageController {
    if (!LoginPageController.instance) {
      LoginPageController.instance = new LoginPageController();
    }
    return LoginPageController.instance;
  }

  /**
   * Handle successful login
   * Redirects user to appropriate page after authentication
   */
  public handleLoginSuccess(navigate: (path: string) => void): void {
    // TODO: Customize redirect logic based on your app's requirements
    // - Redirect to dashboard for authenticated users
    // - Redirect to intended page if user was redirected to login
    // - Show welcome message or onboarding flow

    navigate("/");

    // Optional: Add analytics or user tracking
    console.log("User logged in successfully");
  }

  /**
   * Navigate to signup page
   */
  public navigateToSignup(navigate: (path: string) => void): void {
    navigate("/signup");
  }
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginController = LoginPageController.getInstance();

  /**
   * Handle successful login
   */
  const handleLoginSuccess = () => {
    loginController.handleLoginSuccess(navigate);
  };

  /**
   * Navigate to signup page
   */
  const navigateToSignup = () => {
    loginController.navigateToSignup(navigate);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link
            to="/"
            className="flex items-center space-x-2 text-foreground hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Compass className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Career Compass
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Continue your career journey with personalized job matching
            </p>
          </div>

          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={navigateToSignup}
          />

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              New to Career Compass?
            </p>
            <Button
              variant="outline"
              onClick={navigateToSignup}
              className="w-full"
            >
              Create Your Account
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; 2024 Career Compass. Helping you find your perfect job match.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
