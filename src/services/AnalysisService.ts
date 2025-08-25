/**
 * AnalysisService - Resume Analysis API Service
 * 
 * This service handles all resume analysis operations including document upload,
 * processing, result retrieval, and history management. It provides a comprehensive
 * interface for the core functionality of the Career Compass application.
 * 
 * Backend Integration:
 * - POST /analysis/upload - Upload and analyze resume + job description
 * - GET /analysis/{id} - Retrieve specific analysis results
 * - GET /analysis/history - Get user's analysis history
 * - DELETE /analysis/{id} - Delete analysis record
 * - POST /analysis/{id}/export - Export analysis report
 */

import { BaseApiService, ApiResponse } from './BaseApiService';

/**
 * Analysis Result Interfaces
 * Define the structure of analysis data returned from backend
 */
export interface AnalysisResult {
  id: string;
  userId: string;
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  feedback: AnalysisFeedback;
  matchedKeywords: string[];
  missingKeywords: string[];
  createdAt: string;
  updatedAt: string;
  resumeFileName: string;
  jobTitle: string;
  status: AnalysisStatus;
}

/**
 * Analysis Feedback Structure
 * Detailed feedback categories from AI analysis
 */
export interface AnalysisFeedback {
  strengths: string[];
  improvements: string[];
  missing: string[];
  recommendations: string[];
  skillsAnalysis: SkillAnalysis[];
  experienceAnalysis: ExperienceAnalysis[];
}

/**
 * Skill Analysis Structure
 * Individual skill matching results
 */
export interface SkillAnalysis {
  skill: string;
  required: boolean;
  found: boolean;
  relevance: number;
  suggestions: string[];
}

/**
 * Experience Analysis Structure
 * Work experience matching results
 */
export interface ExperienceAnalysis {
  category: string;
  required: boolean;
  found: boolean;
  yearsRequired: number;
  yearsFound: number;
  suggestions: string[];
}

/**
 * Analysis Status Enum
 * Current state of analysis processing
 */
export enum AnalysisStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

/**
 * Upload Request Structure
 * Data sent when initiating new analysis
 */
export interface AnalysisUploadRequest {
  resume: File;
  jobDescription: File | string; // File or text content
  jobTitle?: string;
  companyName?: string;
  analysisType?: 'standard' | 'detailed' | 'ats_focused';
  includeSkillSuggestions?: boolean;
  includeExperienceGaps?: boolean;
}

/**
 * Analysis History Query Parameters
 * Filtering and pagination options for history retrieval
 */
export interface AnalysisHistoryQuery {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'score' | 'jobTitle';
  sortDirection?: 'asc' | 'desc';
  status?: AnalysisStatus;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Export Options
 * Configuration for analysis report export
 */
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'json';
  includeCharts?: boolean;
  includeRecommendations?: boolean;
  includeFullFeedback?: boolean;
}

/**
 * AnalysisService Class
 * Comprehensive service for resume analysis operations
 */
export class AnalysisService extends BaseApiService {
  private static instance: AnalysisService;

  /**
   * Singleton pattern implementation
   * Ensures consistent service instance across application
   */
  public static getInstance(): AnalysisService {
    if (!AnalysisService.instance) {
      AnalysisService.instance = new AnalysisService();
    }
    return AnalysisService.instance;
  }

  /**
   * Upload and analyze resume with job description
   * 
   * Backend Endpoint: POST /analysis/upload
   * Expected Response: { success: boolean, data: AnalysisResult }
   * 
   * @param uploadData - Resume and job description files with metadata
   * @param onProgress - Optional progress callback for upload tracking
   * @returns Promise resolving to analysis result
   */
  public async uploadAndAnalyze(
    uploadData: AnalysisUploadRequest,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<AnalysisResult>> {
    try {
      const formData = new FormData();
      
      // Add files
      formData.append('resume', uploadData.resume);
      
      if (uploadData.jobDescription instanceof File) {
        formData.append('jobDescription', uploadData.jobDescription);
      } else {
        formData.append('jobDescriptionText', uploadData.jobDescription);
      }

      // Add metadata
      if (uploadData.jobTitle) {
        formData.append('jobTitle', uploadData.jobTitle);
      }
      if (uploadData.companyName) {
        formData.append('companyName', uploadData.companyName);
      }
      if (uploadData.analysisType) {
        formData.append('analysisType', uploadData.analysisType);
      }
      
      formData.append('includeSkillSuggestions', String(uploadData.includeSkillSuggestions ?? true));
      formData.append('includeExperienceGaps', String(uploadData.includeExperienceGaps ?? true));

      return await this.post<AnalysisResult>('/analysis/upload', formData);
    } catch (error) {
      console.error('Analysis upload error:', error);
      throw error;
    }
  }

  /**
   * Retrieve specific analysis result by ID
   * 
   * Backend Endpoint: GET /analysis/{id}
   * Expected Response: { success: boolean, data: AnalysisResult }
   * 
   * @param analysisId - Unique analysis identifier
   * @returns Promise resolving to analysis result
   */
  public async getAnalysisResult(analysisId: string): Promise<ApiResponse<AnalysisResult>> {
    try {
      return await this.get<AnalysisResult>(`/analysis/${analysisId}`);
    } catch (error) {
      console.error('Get analysis result error:', error);
      throw error;
    }
  }

  /**
   * Retrieve user's analysis history with filtering and pagination
   * 
   * Backend Endpoint: GET /analysis/history
   * Expected Response: { success: boolean, data: AnalysisResult[], meta: PaginationMeta }
   * 
   * @param query - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated analysis history
   */
  public async getAnalysisHistory(
    query: AnalysisHistoryQuery = {}
  ): Promise<ApiResponse<AnalysisResult[]>> {
    try {
      const params: Record<string, string> = {};

      if (query.page) params.page = String(query.page);
      if (query.limit) params.limit = String(query.limit);
      if (query.sortBy) params.sortBy = query.sortBy;
      if (query.sortDirection) params.sortDirection = query.sortDirection;
      if (query.status) params.status = query.status;
      if (query.dateFrom) params.dateFrom = query.dateFrom;
      if (query.dateTo) params.dateTo = query.dateTo;

      return await this.get<AnalysisResult[]>('/analysis/history', params);
    } catch (error) {
      console.error('Get analysis history error:', error);
      throw error;
    }
  }

  /**
   * Delete specific analysis record
   * 
   * Backend Endpoint: DELETE /analysis/{id}
   * Expected Response: { success: boolean, message: string }
   * 
   * @param analysisId - Unique analysis identifier
   * @returns Promise resolving to deletion confirmation
   */
  public async deleteAnalysis(analysisId: string): Promise<ApiResponse<void>> {
    try {
      return await this.delete<void>(`/analysis/${analysisId}`);
    } catch (error) {
      console.error('Delete analysis error:', error);
      throw error;
    }
  }

  /**
   * Export analysis report in specified format
   * 
   * Backend Endpoint: POST /analysis/{id}/export
   * Expected Response: Binary file download or { success: boolean, data: { downloadUrl: string } }
   * 
   * @param analysisId - Unique analysis identifier
   * @param options - Export configuration options
   * @returns Promise resolving to export result or download URL
   */
  public async exportAnalysis(
    analysisId: string,
    options: ExportOptions
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      return await this.post<{ downloadUrl: string }>(
        `/analysis/${analysisId}/export`,
        options
      );
    } catch (error) {
      console.error('Export analysis error:', error);
      throw error;
    }
  }

  /**
   * Get analysis statistics for user dashboard
   * 
   * Backend Endpoint: GET /analysis/stats
   * Expected Response: { success: boolean, data: AnalysisStats }
   * 
   * @returns Promise resolving to user's analysis statistics
   */
  public async getAnalysisStats(): Promise<ApiResponse<{
    totalAnalyses: number;
    averageScore: number;
    latestScore: number;
    improvementTrend: number;
    scoreHistory: Array<{ date: string; score: number }>;
  }>> {
    try {
      return await this.get('/analysis/stats');
    } catch (error) {
      console.error('Get analysis stats error:', error);
      throw error;
    }
  }

  /**
   * Reprocess existing analysis with updated parameters
   * 
   * Backend Endpoint: POST /analysis/{id}/reprocess
   * Expected Response: { success: boolean, data: AnalysisResult }
   * 
   * @param analysisId - Unique analysis identifier
   * @param options - Reprocessing options
   * @returns Promise resolving to updated analysis result
   */
  public async reprocessAnalysis(
    analysisId: string,
    options: {
      analysisType?: 'standard' | 'detailed' | 'ats_focused';
      includeSkillSuggestions?: boolean;
      includeExperienceGaps?: boolean;
    }
  ): Promise<ApiResponse<AnalysisResult>> {
    try {
      return await this.post<AnalysisResult>(
        `/analysis/${analysisId}/reprocess`,
        options
      );
    } catch (error) {
      console.error('Reprocess analysis error:', error);
      throw error;
    }
  }

  /**
   * Get skill suggestions based on job requirements and user profile
   * 
   * Backend Endpoint: POST /analysis/skill-suggestions
   * Expected Response: { success: boolean, data: SkillSuggestion[] }
   * 
   * @param jobDescription - Job description text or requirements
   * @param currentSkills - User's current skills
   * @returns Promise resolving to skill suggestions
   */
  public async getSkillSuggestions(
    jobDescription: string,
    currentSkills: string[]
  ): Promise<ApiResponse<Array<{
    skill: string;
    importance: number;
    learningResources: string[];
    timeToLearn: string;
  }>>> {
    try {
      return await this.post('/analysis/skill-suggestions', {
        jobDescription,
        currentSkills
      });
    } catch (error) {
      console.error('Get skill suggestions error:', error);
      throw error;
    }
  }
}

/**
 * Export singleton instance for easy import
 */
export const analysisService = AnalysisService.getInstance();