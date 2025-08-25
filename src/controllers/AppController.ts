/**
 * AppController - Application-Level Controller
 * 
 * This controller manages application-wide state, initialization, and global operations.
 * It handles app startup, authentication state management, theme management, and
 * global error handling throughout the application lifecycle.
 * 
 * Responsibilities:
 * - Application initialization and bootstrap
 * - Global authentication state management
 * - Theme and user preferences management
 * - Global error boundary and error handling
 * - Route protection and access control
 * - Application-wide notifications and alerts
 */

import { BaseController, NavigationHelper, LoadingState, ErrorState } from './BaseController';
import { authService, User } from '@/services/AuthService';
import { userService, UserPreferences } from '@/services/UserService';

/**
 * Application State Interface
 * Manages the global state of the application
 */
export interface AppState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  currentUser: User | null;
  userPreferences: UserPreferences | null;
  theme: 'light' | 'dark' | 'system';
  isOnline: boolean;
  lastActivity: Date;
}

/**
 * App Initialization Result Interface
 * Results from application startup process
 */
export interface AppInitResult {
  success: boolean;
  user?: User;
  preferences?: UserPreferences;
  errors?: string[];
}

/**
 * AppController Class
 * Central controller for application-wide operations
 */
export class AppController extends BaseController {
  private static instance: AppController;
  private appState: AppState;
  private activityTimer: NodeJS.Timeout | null = null;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    super('AppController');
    
    // Initialize app state
    this.appState = {
      isInitialized: false,
      isAuthenticated: false,
      currentUser: null,
      userPreferences: null,
      theme: 'system',
      isOnline: navigator.onLine,
      lastActivity: new Date(),
    };

    this.setupEventListeners();
  }

  /**
   * Singleton pattern implementation
   * @returns AppController instance
   */
  public static getInstance(): AppController {
    if (!AppController.instance) {
      AppController.instance = new AppController();
    }
    return AppController.instance;
  }

  /**
   * Initialize the application
   * Handles authentication check, user preferences loading, and initial setup
   * 
   * @param setLoading - Loading state setter
   * @param setError - Error state setter
   * @returns Promise resolving to initialization result
   */
  public async initializeApp(
    setLoading?: (state: LoadingState) => void,
    setError?: (state: ErrorState) => void
  ): Promise<AppInitResult> {
    return await this.handleAsyncOperation(
      async () => {
        this.logInfo('Starting application initialization');

        const initResult: AppInitResult = {
          success: false,
          errors: [],
        };

        try {
          // Check authentication status
          const isAuthenticated = authService.isAuthenticated();
          
          if (isAuthenticated) {
            // Get current user profile
            const currentUser = await authService.getCurrentUser();
            
            if (currentUser) {
              this.appState.currentUser = currentUser;
              this.appState.isAuthenticated = true;
              initResult.user = currentUser;

              // Load user preferences
              try {
                const preferencesResponse = await userService.getUserPreferences();
                if (preferencesResponse.success && preferencesResponse.data) {
                  this.appState.userPreferences = preferencesResponse.data;
                  this.appState.theme = preferencesResponse.data.theme;
                  initResult.preferences = preferencesResponse.data;
                }
              } catch (error) {
                this.logError('Failed to load user preferences', error);
                initResult.errors?.push('Failed to load user preferences');
              }
            } else {
              // Invalid token, clear auth data
              await authService.logout();
              this.appState.isAuthenticated = false;
            }
          }

          // Apply theme
          this.applyTheme(this.appState.theme);

          // Mark as initialized
          this.appState.isInitialized = true;
          initResult.success = true;

          this.logInfo('Application initialization completed', {
            isAuthenticated: this.appState.isAuthenticated,
            user: this.appState.currentUser?.email,
            theme: this.appState.theme,
          });

          return initResult;
        } catch (error) {
          this.logError('Application initialization failed', error);
          initResult.errors?.push('Application initialization failed');
          throw error;
        }
      },
      setLoading,
      setError,
      'Initializing application...'
    ) || { success: false, errors: ['Initialization failed'] };
  }

  /**
   * Handle user login success
   * Updates app state and loads user data
   * 
   * @param user - Authenticated user
   * @param navigationHelper - Navigation utilities
   */
  public async handleLoginSuccess(
    user: User,
    navigationHelper: NavigationHelper
  ): Promise<void> {
    try {
      this.appState.currentUser = user;
      this.appState.isAuthenticated = true;
      this.appState.lastActivity = new Date();

      // Load user preferences
      try {
        const preferencesResponse = await userService.getUserPreferences();
        if (preferencesResponse.success && preferencesResponse.data) {
          this.appState.userPreferences = preferencesResponse.data;
          this.applyTheme(preferencesResponse.data.theme);
        }
      } catch (error) {
        this.logError('Failed to load preferences after login', error);
      }

      this.showSuccessToast(
        'Welcome back!',
        `Successfully logged in as ${user.firstName} ${user.lastName}`
      );

      this.logInfo('User login successful', { userId: user.id, email: user.email });

      // Navigate to dashboard or intended page
      this.navigateTo(navigationHelper, '/');

    } catch (error) {
      this.logError('Post-login setup failed', error);
      this.showErrorToast('Login successful, but some features may not work properly');
    }
  }

  /**
   * Handle user logout
   * Clears app state and redirects to home
   * 
   * @param navigationHelper - Navigation utilities
   */
  public async handleLogout(navigationHelper: NavigationHelper): Promise<void> {
    try {
      await authService.logout();
      
      // Clear app state
      this.appState.currentUser = null;
      this.appState.isAuthenticated = false;
      this.appState.userPreferences = null;
      this.appState.theme = 'system';

      // Apply default theme
      this.applyTheme('system');

      this.showInfoToast('Logged out successfully');
      this.logInfo('User logout successful');

      // Navigate to home
      this.navigateTo(navigationHelper, '/');

    } catch (error) {
      this.logError('Logout failed', error);
      this.showErrorToast('Logout failed', 'Please try again or refresh the page');
    }
  }

  /**
   * Update user preferences
   * 
   * @param preferences - Updated preferences
   * @returns Promise resolving to success status
   */
  public async updateUserPreferences(
    preferences: Partial<UserPreferences>
  ): Promise<boolean> {
    try {
      const response = await userService.updateUserPreferences(preferences);
      
      if (response.success && response.data) {
        this.appState.userPreferences = response.data;
        
        // Apply theme if changed
        if (preferences.theme && preferences.theme !== this.appState.theme) {
          this.appState.theme = preferences.theme;
          this.applyTheme(preferences.theme);
        }

        this.showSuccessToast('Preferences updated successfully');
        return true;
      }

      this.showErrorToast('Failed to update preferences');
      return false;
    } catch (error) {
      this.logError('Failed to update preferences', error);
      this.showErrorToast('Failed to update preferences', 'Please try again');
      return false;
    }
  }

  /**
   * Check if route requires authentication
   * 
   * @param path - Route path to check
   * @returns True if authentication is required
   */
  public isProtectedRoute(path: string): boolean {
    const protectedRoutes = ['/upload', '/results', '/history', '/profile', '/settings'];
    return protectedRoutes.some(route => path.startsWith(route));
  }

  /**
   * Handle unauthorized access
   * 
   * @param navigationHelper - Navigation utilities
   * @param intendedPath - Path user was trying to access
   */
  public handleUnauthorizedAccess(
    navigationHelper: NavigationHelper,
    intendedPath?: string
  ): void {
    this.showErrorToast(
      'Authentication Required',
      'Please log in to access this feature'
    );

    // Store intended path for redirect after login
    if (intendedPath) {
      sessionStorage.setItem('intendedPath', intendedPath);
    }

    this.navigateTo(navigationHelper, '/login');
  }

  /**
   * Get current application state
   * 
   * @returns Current app state
   */
  public getAppState(): AppState {
    return { ...this.appState };
  }

  /**
   * Update user activity timestamp
   */
  public updateActivity(): void {
    this.appState.lastActivity = new Date();
    this.resetActivityTimer();
  }

  /**
   * Check if user session is still active
   * 
   * @param maxInactiveMinutes - Maximum inactive time in minutes
   * @returns True if session is still active
   */
  public isSessionActive(maxInactiveMinutes: number = 30): boolean {
    const now = new Date();
    const inactiveTime = now.getTime() - this.appState.lastActivity.getTime();
    const maxInactiveTime = maxInactiveMinutes * 60 * 1000; // Convert to milliseconds

    return inactiveTime < maxInactiveTime;
  }

  /**
   * Apply theme to the application
   * 
   * @param theme - Theme to apply
   */
  private applyTheme(theme: 'light' | 'dark' | 'system'): void {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }

    this.appState.theme = theme;
  }

  /**
   * Setup event listeners for app-wide events
   */
  private setupEventListeners(): void {
    // Online/offline status
    window.addEventListener('online', () => {
      this.appState.isOnline = true;
      this.showSuccessToast('Connection restored');
    });

    window.addEventListener('offline', () => {
      this.appState.isOnline = false;
      this.showErrorToast('Connection lost', 'Some features may not work offline');
    });

    // Activity tracking
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, () => this.updateActivity(), true);
    });

    // System theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.appState.theme === 'system') {
        document.documentElement.classList.toggle('dark', e.matches);
      }
    });
  }

  /**
   * Reset activity timer for session management
   */
  private resetActivityTimer(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }

    // Set timer for 30 minutes of inactivity
    this.activityTimer = setTimeout(() => {
      if (this.appState.isAuthenticated && !this.isSessionActive()) {
        this.showInfoToast(
          'Session Expired',
          'You have been logged out due to inactivity'
        );
        this.handleLogout({ navigate: () => {}, currentPath: '/' } as NavigationHelper);
      }
    }, 30 * 60 * 1000); // 30 minutes
  }

  /**
   * Cleanup method for controller destruction
   */
  public cleanup(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }

    // Remove event listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.removeEventListener(event, () => this.updateActivity(), true);
    });
  }
}

/**
 * Export singleton instance
 */
export const appController = AppController.getInstance();