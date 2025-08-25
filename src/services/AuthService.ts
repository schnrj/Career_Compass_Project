/**
 * AuthService - Authentication Service Class
 * 
 * This service handles all authentication-related operations including login, signup,
 * logout, and user session management. It extends BaseApiService for consistent
 * API communication and error handling.
 * 
 * Backend Integration:
 * - POST /auth/login - User authentication
 * - POST /auth/signup - User registration
 * - POST /auth/logout - User logout
 * - GET /auth/profile - Get current user profile
 * - POST /auth/refresh - Refresh authentication token
 * - POST /auth/forgot-password - Password reset request
 * - POST /auth/reset-password - Password reset confirmation
 */

import { BaseApiService, ApiResponse } from './BaseApiService';

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
 * Handles all user authentication operations with comprehensive backend integration
 */
export class AuthService extends BaseApiService {
  private static instance: AuthService;
  private readonly TOKEN_KEY = 'career_compass_token';
  private readonly USER_KEY = 'career_compass_user';
  private readonly REFRESH_TOKEN_KEY = 'career_compass_refresh_token';

  /**
   * Constructor - Initialize with auth endpoint
   */
  constructor() {
    super(); // Initialize BaseApiService
  }

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
   * Backend Endpoint: POST /auth/login
   * Expected Request Body: { email: string, password: string }
   * Expected Response: { success: boolean, data: { user: User, token: string, refreshToken: string } }
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.post<{
        user: User;
        token: string;
        refreshToken?: string;
      }>('/auth/login', credentials, { requireAuth: false });

      if (response.success && response.data) {
        this.setAuthData(
          response.data.user,
          response.data.token,
          response.data.refreshToken
        );

        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
          message: 'Login successful',
        };
      }

      return {
        success: false,
        message: response.message || 'Login failed',
        errors: response.errors,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error. Please try again.',
      };
    }
  }

  /**
   * User Signup/Registration
   * 
   * Backend Endpoint: POST /auth/signup
   * Expected Request Body: { email: string, password: string, firstName: string, lastName: string }
   * Expected Response: { success: boolean, data: { user: User, token: string, refreshToken: string } }
   */
  public async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const { confirmPassword, ...signupData } = credentials;
      
      const response = await this.post<{
        user: User;
        token: string;
        refreshToken?: string;
      }>('/auth/signup', signupData, { requireAuth: false });

      if (response.success && response.data) {
        this.setAuthData(
          response.data.user,
          response.data.token,
          response.data.refreshToken
        );

        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
          message: 'Signup successful',
        };
      }

      return {
        success: false,
        message: response.message || 'Signup failed',
        errors: response.errors,
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error. Please try again.',
      };
    }
  }

  /**
   * User Logout
   * 
   * Backend Endpoint: POST /auth/logout
   * Expected Headers: Authorization: Bearer {token}
   * Expected Response: { success: boolean }
   */
  public async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await this.post('/auth/logout', {});
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
   * Backend Endpoint: GET /auth/profile
   * Expected Headers: Authorization: Bearer {token}
   * Expected Response: { success: boolean, data: { user: User } }
   */
  public async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await this.get<{ user: User }>('/auth/profile');
      
      if (response.success && response.data?.user) {
        return response.data.user;
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
  private setAuthData(user: User, token: string, refreshToken?: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  /**
   * Clear authentication data from localStorage
   * @private
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get stored refresh token
   */
  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Refresh authentication token
   * 
   * Backend Endpoint: POST /auth/refresh
   * Expected Request Body: { refreshToken: string }
   * Expected Response: { success: boolean, data: { token: string, refreshToken?: string } }
   */
  public async refreshAuthToken(): Promise<{ success: boolean; token?: string }> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return { success: false };
      }

      const response = await this.post<{
        token: string;
        refreshToken?: string;
      }>('/auth/refresh', { refreshToken }, { requireAuth: false });

      if (response.success && response.data) {
        localStorage.setItem(this.TOKEN_KEY, response.data.token);
        
        if (response.data.refreshToken) {
          localStorage.setItem(this.REFRESH_TOKEN_KEY, response.data.refreshToken);
        }

        return { success: true, token: response.data.token };
      }

      return { success: false };
    } catch (error) {
      console.error('Refresh token error:', error);
      return { success: false };
    }
  }

  /**
   * Request password reset
   * 
   * Backend Endpoint: POST /auth/forgot-password
   * Expected Request Body: { email: string }
   * Expected Response: { success: boolean, message: string }
   */
  public async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await this.post('/auth/forgot-password', { email }, { requireAuth: false });
      
      return {
        success: response.success,
        message: response.message || 'Password reset email sent',
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error. Please try again.',
      };
    }
  }

  /**
   * Reset password with token
   * 
   * Backend Endpoint: POST /auth/reset-password
   * Expected Request Body: { token: string, password: string }
   * Expected Response: { success: boolean, message: string }
   */
  public async resetPassword(token: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.post('/auth/reset-password', { token, password }, { requireAuth: false });
      
      return {
        success: response.success,
        message: response.message || 'Password reset successful',
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error. Please try again.',
      };
    }
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