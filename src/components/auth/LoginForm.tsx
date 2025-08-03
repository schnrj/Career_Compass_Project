/**
 * LoginForm Component
 *
 * Provides a responsive login form with validation.
 * Integrates with AuthService for backend authentication.
 *
 * Props:
 * - onSuccess: Callback function called after successful login
 * - onSwitchToSignup: Callback to switch to signup form
 */

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { authService, type LoginCredentials } from "@/services/AuthService";

/**
 * Validation schema for login form
 */
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

/**
 * LoginForm Class Component
 * Handles user login functionality with form validation
 */
export class LoginFormController {
  private static instance: LoginFormController;

  public static getInstance(): LoginFormController {
    if (!LoginFormController.instance) {
      LoginFormController.instance = new LoginFormController();
    }
    return LoginFormController.instance;
  }

  /**
   * Handle login form submission
   * Validates credentials and calls backend authentication
   */
  public async handleLogin(
    credentials: LoginCredentials,
    onSuccess?: () => void
  ): Promise<{
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await authService.login(credentials);

      if (response.success) {
        onSuccess?.();
        return { success: true };
      }

      return {
        success: false,
        message: response.message || "Login failed",
        errors: response.errors,
      };
    } catch (error) {
      console.error("Login submission error:", error);
      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      };
    }
  }
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToSignup,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  const loginController = LoginFormController.getInstance();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Form submission handler
   */
  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setError("");

    const result = await loginController.handleLogin(data, onSuccess);

    if (!result.success) {
      setError(result.message || "Login failed");
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to your Career Compass account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
