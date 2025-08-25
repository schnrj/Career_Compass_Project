/**
 * BaseApiService - Core API Service Class
 * 
 * This is the foundation class for all API operations in the Career Compass application.
 * It provides standardized HTTP request handling, error management, authentication,
 * and response processing for seamless backend integration.
 * 
 * Backend Integration Notes:
 * - Configure API_BASE_URL to match your backend server
 * - All services extend this class for consistent API communication
 * - Supports JWT authentication via Authorization header
 * - Provides standardized error handling and response formatting
 * - Includes request/response interceptors for common operations
 */

import { authService } from './AuthService';

/**
 * Standard API Response Interface
 * Defines consistent response structure from backend
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * HTTP Request Options Interface
 * Configures request parameters for API calls
 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  requireAuth?: boolean;
  timeout?: number;
}

/**
 * API Error Class
 * Custom error handling for API-related failures
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number = 500,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * BaseApiService Class
 * Foundation service class for all API operations
 */
export class BaseApiService {
  protected readonly baseUrl: string;
  private readonly defaultTimeout: number = 30000; // 30 seconds

  /**
   * Constructor
   * @param baseUrl - Base URL for the API endpoint
   */
  constructor(baseUrl: string = process.env.REACT_APP_API_URL || 'http://localhost:8000/api') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Build complete URL with query parameters
   * @param endpoint - API endpoint path
   * @param params - Query parameters object
   * @returns Complete URL string
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * Prepare request headers with authentication and content type
   * @param options - Request options
   * @returns Headers object
   */
  private prepareHeaders(options: RequestOptions): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    // Add authentication headers if required
    if (options.requireAuth !== false) {
      const authHeaders = authService.getAuthHeaders();
      Object.assign(headers, authHeaders);
    }

    return headers;
  }

  /**
   * Process API response and handle errors
   * @param response - Fetch response object
   * @returns Parsed response data
   */
  private async processResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let responseData: any;

    try {
      responseData = await response.json();
    } catch (error) {
      // Handle non-JSON responses
      responseData = {
        success: false,
        message: 'Invalid response format from server',
      };
    }

    if (!response.ok) {
      throw new ApiError(
        responseData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        responseData.errors
      );
    }

    return responseData;
  }

  /**
   * Execute HTTP request with comprehensive error handling
   * @param endpoint - API endpoint path
   * @param options - Request configuration options
   * @returns Promise resolving to API response
   */
  protected async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      params,
      timeout = this.defaultTimeout,
      ...restOptions
    } = options;

    const url = this.buildUrl(endpoint, params);
    const headers = this.prepareHeaders(options);

    const requestConfig: RequestInit = {
      method,
      headers,
      ...restOptions,
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      if (body instanceof FormData) {
        // Remove Content-Type for FormData (browser sets it automatically)
        delete headers['Content-Type'];
        requestConfig.body = body;
      } else {
        requestConfig.body = JSON.stringify(body);
      }
    }

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new ApiError('Request timeout', 408));
        }, timeout);
      });

      // Execute request with timeout
      const response = await Promise.race([
        fetch(url, requestConfig),
        timeoutPromise,
      ]);

      return await this.processResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Network request failed',
        0
      );
    }
  }

  /**
   * GET request wrapper
   * @param endpoint - API endpoint path
   * @param params - Query parameters
   * @param options - Additional request options
   * @returns Promise resolving to API response
   */
  protected async get<T = any>(
    endpoint: string,
    params?: Record<string, string>,
    options: Omit<RequestOptions, 'method' | 'params'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET', params });
  }

  /**
   * POST request wrapper
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param options - Additional request options
   * @returns Promise resolving to API response
   */
  protected async post<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: data });
  }

  /**
   * PUT request wrapper
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param options - Additional request options
   * @returns Promise resolving to API response
   */
  protected async put<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: data });
  }

  /**
   * PATCH request wrapper
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param options - Additional request options
   * @returns Promise resolving to API response
   */
  protected async patch<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: data });
  }

  /**
   * DELETE request wrapper
   * @param endpoint - API endpoint path
   * @param options - Additional request options
   * @returns Promise resolving to API response
   */
  protected async delete<T = any>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Upload file with progress tracking
   * @param endpoint - Upload endpoint path
   * @param file - File to upload
   * @param additionalData - Additional form data
   * @param onProgress - Progress callback function
   * @returns Promise resolving to API response
   */
  protected async uploadFile<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string>,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    // Add additional form data if provided
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.post<T>(endpoint, formData);
  }

  /**
   * Health check endpoint to verify API connectivity
   * @returns Promise resolving to health status
   */
  public async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    try {
      return await this.get('/health', undefined, { requireAuth: false, timeout: 5000 });
    } catch (error) {
      throw new ApiError('API health check failed', 503);
    }
  }
}

/**
 * Export singleton instance for direct usage
 * Use this for ad-hoc API calls that don't fit into specific service classes
 */
export const baseApiService = new BaseApiService();