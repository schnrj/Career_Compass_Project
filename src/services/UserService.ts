/**
 * UserService - User Management API Service
 * 
 * This service handles all user-related operations including profile management,
 * preferences, settings, and user data operations. It works in conjunction with
 * AuthService to provide comprehensive user management functionality.
 * 
 * Backend Integration:
 * - GET /user/profile - Retrieve user profile
 * - PUT /user/profile - Update user profile
 * - GET /user/preferences - Get user preferences
 * - PUT /user/preferences - Update user preferences
 * - POST /user/avatar - Upload user avatar
 * - DELETE /user/account - Delete user account
 */

import { BaseApiService, ApiResponse } from './BaseApiService';
import { User } from './AuthService';

/**
 * Extended User Profile Interface
 * Comprehensive user profile structure with additional fields
 */
export interface UserProfile extends User {
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  skills: string[];
  experience: UserExperience[];
  education: UserEducation[];
  preferences: UserPreferences;
  stats: UserStats;
  subscription?: UserSubscription;
}

/**
 * User Experience Structure
 * Work experience entries in user profile
 */
export interface UserExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  skills: string[];
  location?: string;
}

/**
 * User Education Structure
 * Educational background entries
 */
export interface UserEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: number;
  achievements: string[];
}

/**
 * User Preferences Structure
 * Application and analysis preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: {
    analysisComplete: boolean;
    weeklyReport: boolean;
    marketingUpdates: boolean;
    securityAlerts: boolean;
  };
  analysisDefaults: {
    analysisType: 'standard' | 'detailed' | 'ats_focused';
    includeSkillSuggestions: boolean;
    includeExperienceGaps: boolean;
    autoSaveResults: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    shareAnonymousData: boolean;
    allowDataExport: boolean;
  };
}

/**
 * User Statistics Structure
 * Analytics and usage statistics
 */
export interface UserStats {
  totalAnalyses: number;
  averageScore: number;
  bestScore: number;
  improvementRate: number;
  lastAnalysisDate?: string;
  joinDate: string;
  streakDays: number;
  totalTimeSpent: number; // in minutes
}

/**
 * User Subscription Structure
 * Subscription and billing information
 */
export interface UserSubscription {
  plan: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate: string;
  endDate?: string;
  trialEndsAt?: string;
  analysesRemaining?: number;
  features: string[];
}

/**
 * Profile Update Request Structure
 * Data structure for profile updates
 */
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  skills?: string[];
}

/**
 * Experience Update Request Structure
 * Data structure for adding/updating work experience
 */
export interface ExperienceUpdateRequest {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  skills: string[];
  location?: string;
}

/**
 * Education Update Request Structure
 * Data structure for adding/updating education
 */
export interface EducationUpdateRequest {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: number;
  achievements: string[];
}

/**
 * UserService Class
 * Comprehensive service for user management operations
 */
export class UserService extends BaseApiService {
  private static instance: UserService;

  /**
   * Singleton pattern implementation
   * Ensures consistent service instance across application
   */
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get comprehensive user profile with all related data
   * 
   * Backend Endpoint: GET /user/profile
   * Expected Response: { success: boolean, data: UserProfile }
   * 
   * @returns Promise resolving to complete user profile
   */
  public async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      return await this.get<UserProfile>('/user/profile');
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile information
   * 
   * Backend Endpoint: PUT /user/profile
   * Expected Response: { success: boolean, data: UserProfile }
   * 
   * @param profileData - Updated profile information
   * @returns Promise resolving to updated user profile
   */
  public async updateUserProfile(
    profileData: ProfileUpdateRequest
  ): Promise<ApiResponse<UserProfile>> {
    try {
      return await this.put<UserProfile>('/user/profile', profileData);
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  /**
   * Upload and update user avatar
   * 
   * Backend Endpoint: POST /user/avatar
   * Expected Response: { success: boolean, data: { avatarUrl: string } }
   * 
   * @param avatarFile - Image file for user avatar
   * @returns Promise resolving to avatar URL
   */
  public async uploadAvatar(
    avatarFile: File
  ): Promise<ApiResponse<{ avatarUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      return await this.post<{ avatarUrl: string }>('/user/avatar', formData);
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  }

  /**
   * Get user preferences and settings
   * 
   * Backend Endpoint: GET /user/preferences
   * Expected Response: { success: boolean, data: UserPreferences }
   * 
   * @returns Promise resolving to user preferences
   */
  public async getUserPreferences(): Promise<ApiResponse<UserPreferences>> {
    try {
      return await this.get<UserPreferences>('/user/preferences');
    } catch (error) {
      console.error('Get user preferences error:', error);
      throw error;
    }
  }

  /**
   * Update user preferences and settings
   * 
   * Backend Endpoint: PUT /user/preferences
   * Expected Response: { success: boolean, data: UserPreferences }
   * 
   * @param preferences - Updated preferences object
   * @returns Promise resolving to updated preferences
   */
  public async updateUserPreferences(
    preferences: Partial<UserPreferences>
  ): Promise<ApiResponse<UserPreferences>> {
    try {
      return await this.put<UserPreferences>('/user/preferences', preferences);
    } catch (error) {
      console.error('Update user preferences error:', error);
      throw error;
    }
  }

  /**
   * Add work experience entry
   * 
   * Backend Endpoint: POST /user/experience
   * Expected Response: { success: boolean, data: UserExperience }
   * 
   * @param experienceData - Work experience information
   * @returns Promise resolving to created experience entry
   */
  public async addExperience(
    experienceData: ExperienceUpdateRequest
  ): Promise<ApiResponse<UserExperience>> {
    try {
      return await this.post<UserExperience>('/user/experience', experienceData);
    } catch (error) {
      console.error('Add experience error:', error);
      throw error;
    }
  }

  /**
   * Update work experience entry
   * 
   * Backend Endpoint: PUT /user/experience/{id}
   * Expected Response: { success: boolean, data: UserExperience }
   * 
   * @param experienceId - Experience entry ID
   * @param experienceData - Updated experience information
   * @returns Promise resolving to updated experience entry
   */
  public async updateExperience(
    experienceId: string,
    experienceData: Partial<ExperienceUpdateRequest>
  ): Promise<ApiResponse<UserExperience>> {
    try {
      return await this.put<UserExperience>(
        `/user/experience/${experienceId}`,
        experienceData
      );
    } catch (error) {
      console.error('Update experience error:', error);
      throw error;
    }
  }

  /**
   * Delete work experience entry
   * 
   * Backend Endpoint: DELETE /user/experience/{id}
   * Expected Response: { success: boolean, message: string }
   * 
   * @param experienceId - Experience entry ID
   * @returns Promise resolving to deletion confirmation
   */
  public async deleteExperience(experienceId: string): Promise<ApiResponse<void>> {
    try {
      return await this.delete<void>(`/user/experience/${experienceId}`);
    } catch (error) {
      console.error('Delete experience error:', error);
      throw error;
    }
  }

  /**
   * Add education entry
   * 
   * Backend Endpoint: POST /user/education
   * Expected Response: { success: boolean, data: UserEducation }
   * 
   * @param educationData - Education information
   * @returns Promise resolving to created education entry
   */
  public async addEducation(
    educationData: EducationUpdateRequest
  ): Promise<ApiResponse<UserEducation>> {
    try {
      return await this.post<UserEducation>('/user/education', educationData);
    } catch (error) {
      console.error('Add education error:', error);
      throw error;
    }
  }

  /**
   * Update education entry
   * 
   * Backend Endpoint: PUT /user/education/{id}
   * Expected Response: { success: boolean, data: UserEducation }
   * 
   * @param educationId - Education entry ID
   * @param educationData - Updated education information
   * @returns Promise resolving to updated education entry
   */
  public async updateEducation(
    educationId: string,
    educationData: Partial<EducationUpdateRequest>
  ): Promise<ApiResponse<UserEducation>> {
    try {
      return await this.put<UserEducation>(
        `/user/education/${educationId}`,
        educationData
      );
    } catch (error) {
      console.error('Update education error:', error);
      throw error;
    }
  }

  /**
   * Delete education entry
   * 
   * Backend Endpoint: DELETE /user/education/{id}
   * Expected Response: { success: boolean, message: string }
   * 
   * @param educationId - Education entry ID
   * @returns Promise resolving to deletion confirmation
   */
  public async deleteEducation(educationId: string): Promise<ApiResponse<void>> {
    try {
      return await this.delete<void>(`/user/education/${educationId}`);
    } catch (error) {
      console.error('Delete education error:', error);
      throw error;
    }
  }

  /**
   * Get user statistics and analytics
   * 
   * Backend Endpoint: GET /user/stats
   * Expected Response: { success: boolean, data: UserStats }
   * 
   * @returns Promise resolving to user statistics
   */
  public async getUserStats(): Promise<ApiResponse<UserStats>> {
    try {
      return await this.get<UserStats>('/user/stats');
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  }

  /**
   * Delete user account permanently
   * 
   * Backend Endpoint: DELETE /user/account
   * Expected Response: { success: boolean, message: string }
   * 
   * @param confirmationToken - Security token for account deletion
   * @returns Promise resolving to deletion confirmation
   */
  public async deleteAccount(confirmationToken: string): Promise<ApiResponse<void>> {
    try {
      return await this.delete<void>('/user/account', {
        body: { confirmationToken },
      });
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }

  /**
   * Export user data (GDPR compliance)
   * 
   * Backend Endpoint: POST /user/export
   * Expected Response: { success: boolean, data: { downloadUrl: string } }
   * 
   * @param format - Export format ('json' | 'csv' | 'pdf')
   * @returns Promise resolving to export download URL
   */
  public async exportUserData(
    format: 'json' | 'csv' | 'pdf' = 'json'
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      return await this.post<{ downloadUrl: string }>('/user/export', { format });
    } catch (error) {
      console.error('Export user data error:', error);
      throw error;
    }
  }
}

/**
 * Export singleton instance for easy import
 */
export const userService = UserService.getInstance();