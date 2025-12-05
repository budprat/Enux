// ============================================================================
// ENUX - Frameworks Service
// ============================================================================

import { apiClient, buildQueryString } from './api';
import type {
  Framework,
  FrameworkCategory,
  FrameworkFilters,
  AIRecommendation,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

// ----------------------------------------------------------------------------
// Frameworks Service
// ----------------------------------------------------------------------------

export const frameworksService = {
  /**
   * Get all frameworks with optional filters
   */
  async getAll(filters?: FrameworkFilters): Promise<PaginatedResponse<Framework>> {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get<PaginatedResponse<Framework>>(`/frameworks${query}`);
    return response;
  },

  /**
   * Get a single framework by ID
   */
  async getById(id: string): Promise<Framework> {
    const response = await apiClient.get<ApiResponse<Framework>>(`/frameworks/${id}`);
    return response.data;
  },

  /**
   * Get trending frameworks
   */
  async getTrending(limit?: number): Promise<Framework[]> {
    const query = limit ? buildQueryString({ limit }) : '';
    const response = await apiClient.get<ApiResponse<Framework[]>>(`/frameworks/trending${query}`);
    return response.data;
  },

  /**
   * Get recently added frameworks
   */
  async getRecentlyAdded(limit?: number): Promise<Framework[]> {
    const query = limit ? buildQueryString({ limit }) : '';
    const response = await apiClient.get<ApiResponse<Framework[]>>(`/frameworks/recent${query}`);
    return response.data;
  },

  /**
   * Get all framework categories
   */
  async getCategories(): Promise<FrameworkCategory[]> {
    const response = await apiClient.get<ApiResponse<FrameworkCategory[]>>('/frameworks/categories');
    return response.data;
  },

  /**
   * Get frameworks by category
   */
  async getByCategory(category: string, filters?: FrameworkFilters): Promise<PaginatedResponse<Framework>> {
    const query = buildQueryString({ ...filters, category });
    const response = await apiClient.get<PaginatedResponse<Framework>>(`/frameworks${query}`);
    return response;
  },

  /**
   * Get AI-powered framework recommendations
   */
  async getRecommendations(): Promise<AIRecommendation[]> {
    const response = await apiClient.get<ApiResponse<AIRecommendation[]>>('/frameworks/recommendations');
    return response.data;
  },

  /**
   * Star a framework
   */
  async star(id: string): Promise<void> {
    await apiClient.post(`/frameworks/${id}/star`);
  },

  /**
   * Unstar a framework
   */
  async unstar(id: string): Promise<void> {
    await apiClient.delete(`/frameworks/${id}/star`);
  },

  /**
   * Fork a framework to create a new repository
   */
  async fork(id: string): Promise<Framework> {
    const response = await apiClient.post<ApiResponse<Framework>>(`/frameworks/${id}/fork`);
    return response.data;
  },

  /**
   * Use a framework template
   */
  async useTemplate(id: string, repositoryName: string): Promise<void> {
    await apiClient.post(`/frameworks/${id}/use`, { repositoryName });
  },

  /**
   * Search frameworks
   */
  async search(query: string, filters?: FrameworkFilters): Promise<PaginatedResponse<Framework>> {
    const params = buildQueryString({ ...filters, search: query });
    const response = await apiClient.get<PaginatedResponse<Framework>>(`/frameworks/search${params}`);
    return response;
  },

  /**
   * Get similar frameworks
   */
  async getSimilar(id: string, limit?: number): Promise<Framework[]> {
    const query = limit ? buildQueryString({ limit }) : '';
    const response = await apiClient.get<ApiResponse<Framework[]>>(`/frameworks/${id}/similar${query}`);
    return response.data;
  },
};
