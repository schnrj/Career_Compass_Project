/**
 * BaseController - Foundation Controller Class
 * 
 * This is the base class for all controller classes in the Career Compass application.
 * It provides common functionality, error handling, and consistent patterns across
 * all page and component controllers.
 * 
 * Design Principles:
 * - Separation of concerns between UI and business logic
 * - Consistent error handling and logging
 * - Reusable utility methods for common operations
 * - Type-safe navigation and routing
 * - Standardized loading and error states management
 */

import { NavigateFunction } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

/**
 * Navigation Helper Interface
 * Standardizes navigation operations across controllers
 */
export interface NavigationHelper {
  navigate: NavigateFunction;
  currentPath: string;
}

/**
 * Loading State Interface
 * Manages loading states for asynchronous operations
 */
export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  progress?: number;
}

/**
 * Error State Interface
 * Manages error states and user feedback
 */
export interface ErrorState {
  hasError: boolean;
  errorMessage?: string;
  errorCode?: string;
  canRetry: boolean;
}

/**
 * Base Controller Abstract Class
 * Foundation for all controller implementations
 */
export abstract class BaseController {
  protected readonly controllerName: string;
  private static instances: Map<string, BaseController> = new Map();

  /**
   * Constructor
   * @param controllerName - Unique identifier for the controller
   */
  constructor(controllerName: string) {
    this.controllerName = controllerName;
  }

  /**
   * Generic singleton factory method
   * Ensures consistent instance management across all controllers
   * 
   * @param controllerClass - Controller class to instantiate
   * @param controllerName - Unique identifier for the controller
   * @returns Singleton instance of the controller
   */
  protected static getControllerInstance<T extends BaseController>(
    controllerClass: new (name: string) => T,
    controllerName: string
  ): T {
    if (!this.instances.has(controllerName)) {
      this.instances.set(controllerName, new controllerClass(controllerName));
    }
    return this.instances.get(controllerName) as T;
  }

  /**
   * Handle asynchronous operations with consistent loading and error management
   * 
   * @param operation - Async operation to execute
   * @param setLoading - Loading state setter function
   * @param setError - Error state setter function
   * @param loadingMessage - Message to display during loading
   * @returns Promise resolving to operation result or null on error
   */
  protected async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    setLoading?: (state: LoadingState) => void,
    setError?: (state: ErrorState) => void,
    loadingMessage: string = 'Processing...'
  ): Promise<T | null> {
    try {
      // Set loading state
      if (setLoading) {
        setLoading({
          isLoading: true,
          loadingMessage,
        });
      }

      // Clear previous errors
      if (setError) {
        setError({
          hasError: false,
          canRetry: false,
        });
      }

      // Execute operation
      const result = await operation();

      // Clear loading state
      if (setLoading) {
        setLoading({
          isLoading: false,
        });
      }

      return result;
    } catch (error) {
      // Handle error
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      const errorCode = (error as any)?.status?.toString() || 'UNKNOWN';

      this.logError('Async operation failed', error);

      // Set error state
      if (setError) {
        setError({
          hasError: true,
          errorMessage,
          errorCode,
          canRetry: true,
        });
      }

      // Clear loading state
      if (setLoading) {
        setLoading({
          isLoading: false,
        });
      }

      return null;
    }
  }

  /**
   * Navigate to specified route with error handling
   * 
   * @param navigationHelper - Navigation utilities
   * @param path - Target route path
   * @param state - Optional state to pass to the route
   */
  protected navigateTo(
    navigationHelper: NavigationHelper,
    path: string,
    state?: any
  ): void {
    try {
      if (state) {
        navigationHelper.navigate(path, { state });
      } else {
        navigationHelper.navigate(path);
      }
    } catch (error) {
      this.logError(`Navigation failed to ${path}`, error);
      this.showErrorToast('Navigation failed. Please try again.');
    }
  }

  /**
   * Check if current path matches target path
   * 
   * @param navigationHelper - Navigation utilities
   * @param targetPath - Path to compare against
   * @returns True if paths match
   */
  protected isCurrentPath(
    navigationHelper: NavigationHelper,
    targetPath: string
  ): boolean {
    return navigationHelper.currentPath === targetPath;
  }

  /**
   * Show success toast notification
   * 
   * @param message - Success message to display
   * @param description - Optional detailed description
   */
  protected showSuccessToast(message: string, description?: string): void {
    toast({
      title: message,
      description,
      variant: 'default',
    });
  }

  /**
   * Show error toast notification
   * 
   * @param message - Error message to display
   * @param description - Optional detailed description
   */
  protected showErrorToast(message: string, description?: string): void {
    toast({
      title: message,
      description,
      variant: 'destructive',
    });
  }

  /**
   * Show info toast notification
   * 
   * @param message - Info message to display
   * @param description - Optional detailed description
   */
  protected showInfoToast(message: string, description?: string): void {
    toast({
      title: message,
      description,
    });
  }

  /**
   * Log error with context information
   * 
   * @param context - Context description
   * @param error - Error object or message
   */
  protected logError(context: string, error: any): void {
    const timestamp = new Date().toISOString();
    const errorDetails = {
      controller: this.controllerName,
      context,
      timestamp,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };

    console.error(`[${this.controllerName}] ${context}:`, errorDetails);

    // In production, you might want to send this to an error tracking service
    // errorTrackingService.logError(errorDetails);
  }

  /**
   * Log info message with context
   * 
   * @param context - Context description
   * @param data - Additional data to log
   */
  protected logInfo(context: string, data?: any): void {
    const timestamp = new Date().toISOString();
    console.info(`[${this.controllerName}] ${context}`, {
      timestamp,
      data,
    });
  }

  /**
   * Validate required fields in an object
   * 
   * @param data - Object to validate
   * @param requiredFields - Array of required field names
   * @returns Validation result with errors
   */
  protected validateRequiredFields(
    data: Record<string, any>,
    requiredFields: string[]
  ): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    requiredFields.forEach(field => {
      const value = data[field];
      if (value === null || value === undefined || value === '') {
        errors[field] = `${field} is required`;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Format date for display
   * 
   * @param date - Date to format
   * @param options - Intl.DateTimeFormat options
   * @returns Formatted date string
   */
  protected formatDate(
    date: string | Date,
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  ): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', options);
    } catch (error) {
      this.logError('Date formatting failed', error);
      return 'Invalid Date';
    }
  }

  /**
   * Debounce function calls
   * 
   * @param func - Function to debounce
   * @param delay - Delay in milliseconds
   * @returns Debounced function
   */
  protected debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * Create a retry function for failed operations
   * 
   * @param operation - Operation to retry
   * @param maxRetries - Maximum number of retry attempts
   * @param delay - Delay between retries in milliseconds
   * @returns Promise resolving to operation result
   */
  protected async createRetryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError!;
  }

  /**
   * Abstract method for cleanup operations
   * Should be implemented by concrete controllers if needed
   */
  public abstract cleanup?(): void;
}