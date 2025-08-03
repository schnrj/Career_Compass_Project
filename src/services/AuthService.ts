/**
 * AuthService - Authentication Service Class
 * 
 * This service handles all authentication-related operations including login, signup,
 * logout, and user session management. It's designed to easily integrate with your backend API.
 * 
 * Backend Integration Guide:
 * - Replace API_BASE_URL with your actual backend URL
 * - Update endpoints to match your backend routes
 * - Modify request/response structures as needed
 * - Add proper error handling for your specific API responses
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Authentication Service Class
 * Handles all user authentication operations
 */
export class AuthService {
  private static instance: AuthService;
  private readonly API_BASE_URL = '/api/auth'; // TODO: Replace with your backend URL
  private readonly TOKEN_KEY = 'career_compass_token';
  private readonly USER_KEY = 'career_compass_user';

  /**
   * Singleton pattern implementation
   * Ensures only one instance of AuthService exists
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * User Login
   * 
   * Backend Endpoint: POST /api/auth/login
   * Expected Request Body: { email: string, password: string }
   * Expected Response: { success: boolean, user: User, token: string }
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user && data.token) {
        this.setAuthData(data.user, data.token);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  /**
   * User Signup/Registration
   * 
   * Backend Endpoint: POST /api/auth/signup
   * Expected Request Body: { email: string, password: string, firstName: string, lastName: string }
   * Expected Response: { success: boolean, user: User, token: string }
   */
  public async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const { confirmPassword, ...signupData } = credentials;
      
      const response = await fetch(`${this.API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user && data.token) {
        this.setAuthData(data.user, data.token);
      }

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  /**
   * User Logout
   * 
   * Backend Endpoint: POST /api/auth/logout
   * Expected Headers: Authorization: Bearer {token}
   * Expected Response: { success: boolean }
   */
  public async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${this.API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Get Current User Profile
   * 
   * Backend Endpoint: GET /api/auth/profile
   * Expected Headers: Authorization: Bearer {token}
   * Expected Response: { success: boolean, user: User }
   */
  public async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch(`${this.API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        return data.user;
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  /**
   * Get stored authentication token
   */
  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored user data
   */
  public getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Set authentication data in localStorage
   * @private
   */
  private setAuthData(user: User, token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear authentication data from localStorage
   * @private
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Get authentication headers for API requests
   */
  public getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

/**
 * Export singleton instance for easy import
 */
export const authService = AuthService.getInstance();