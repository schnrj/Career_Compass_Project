/**
 * SignupPage Component
 *
 * Dedicated signup/registration page with full-screen layout.
 * Provides a professional user registration experience.
 *
 * Backend Integration:
 * - Uses AuthService for user registration
 * - Redirects to onboarding or dashboard after successful signup
 * - Handles registration errors and validation
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass } from "lucide-react";
import SignupForm from "@/components/auth/SignupForm";

/**
 * SignupPage Class Controller
 * Handles page-level signup logic and navigation
 */
export class SignupPageController {
  private static instance: SignupPageController;

  public static getInstance(): SignupPageController {
    if (!SignupPageController.instance) {
      SignupPageController.instance = new SignupPageController();
    }
    return SignupPageController.instance;
  }

  /**
   * Handle successful signup
   * Redirects user to appropriate page after registration
   */
  public handleSignupSuccess(navigate: (path: string) => void): void {
    // TODO: Customize post-signup flow based on your app's requirements
    // - Redirect to onboarding flow for new users
    // - Redirect to email verification page
    // - Redirect to dashboard with welcome message
    // - Trigger analytics events for new user registration

    navigate("/");

    // Optional: Add analytics or user tracking
    console.log("New user registered successfully");
  }

  /**
   * Navigate to login page
   */
  public navigateToLogin(navigate: (path: string) => void): void {
    navigate("/login");
  }

  /**
   * Handle terms of service acceptance
   */
  public handleTermsAcceptance(): boolean {
    // TODO: Implement terms of service logic
    // - Track user consent
    // - Store acceptance timestamp
    // - Update user profile with terms version

    console.log("User accepted terms of service");
    return true;
  }
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const signupController = SignupPageController.getInstance();

  /**
   * Handle successful signup
   */
  const handleSignupSuccess = () => {
    signupController.handleSignupSuccess(navigate);
  };

  /**
   * Navigate to login page
   */
  const navigateToLogin = () => {
    signupController.navigateToLogin(navigate);
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
              Join Career Compass
            </h1>
            <p className="text-muted-foreground">
              Start your personalized job search journey today
            </p>
          </div>

          <SignupForm
            onSuccess={handleSignupSuccess}
            onSwitchToLogin={navigateToLogin}
          />

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Already have an account?
            </p>
            <Button
              variant="outline"
              onClick={navigateToLogin}
              className="w-full"
            >
              Sign In to Your Account
            </Button>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
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

export default SignupPage;
