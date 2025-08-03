/**
 * AuthModal Component
 *
 * A reusable modal component that handles both login and signup forms.
 * Provides smooth transitions between login and signup modes.
 *
 * Props:
 * - isOpen: Controls modal visibility
 * - onClose: Callback when modal is closed
 * - defaultMode: Initial mode ('login' | 'signup')
 * - onAuthSuccess: Callback after successful authentication
 */

import React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

type AuthMode = "login" | "signup";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
  onAuthSuccess?: () => void;
}

/**
 * AuthModal Class Controller
 * Manages authentication modal state and mode switching
 */
export class AuthModalController {
  private static instance: AuthModalController;

  public static getInstance(): AuthModalController {
    if (!AuthModalController.instance) {
      AuthModalController.instance = new AuthModalController();
    }
    return AuthModalController.instance;
  }

  /**
   * Handle successful authentication
   * Can be extended to include additional logic like redirects, analytics, etc.
   */
  public handleAuthSuccess(
    onClose: () => void,
    onAuthSuccess?: () => void
  ): void {
    onClose();
    onAuthSuccess?.();

    // Additional success logic can be added here:
    // - Analytics tracking
    // - Welcome notifications
    // - Redirect to specific pages
    console.log("User authenticated successfully");
  }

  /**
   * Handle mode switching with smooth transitions
   */
  public switchMode(
    currentMode: AuthMode,
    setMode: (mode: AuthMode) => void
  ): void {
    const newMode = currentMode === "login" ? "signup" : "login";
    setMode(newMode);
  }
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = "login",
  onAuthSuccess,
}) => {
  const [mode, setMode] = React.useState<AuthMode>(defaultMode);
  const authController = AuthModalController.getInstance();

  /**
   * Reset mode when modal opens
   */
  React.useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
    }
  }, [isOpen, defaultMode]);

  /**
   * Handle successful authentication
   */
  const handleAuthSuccess = () => {
    authController.handleAuthSuccess(onClose, onAuthSuccess);
  };

  /**
   * Switch between login and signup modes
   */
  const switchToLogin = () => authController.switchMode(mode, setMode);
  const switchToSignup = () => authController.switchMode(mode, setMode);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>
        </DialogHeader>

        <div className="transition-all duration-300 ease-in-out">
          {mode === "login" ? (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onSwitchToSignup={switchToSignup}
            />
          ) : (
            <SignupForm
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={switchToLogin}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
