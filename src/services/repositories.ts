// ============================================================================
// ENUX - Repositories Service
// ============================================================================

import { apiClient, buildQueryString } from './api';
import type {
  Repository,
  CreateRepositoryInput,
  UpdateRepositoryInput,
  RepositoryFilters,
  ApiResponse,
  PaginatedResponse,
  Activity,
  Collaborator,
} from '@/types';

// ----------------------------------------------------------------------------
// Repositories Service
// ----------------------------------------------------------------------------

export const repositoriesService = {
  /**
   * Get all repositories with optional filters
   */
  async getAll(filters?: RepositoryFilters): Promise<PaginatedResponse<Repository>> {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get<PaginatedResponse<Repository>>(`/repositories${query}`);
    return response;
  },

  /**
   * Get a single repository by ID
   */
  async getById(id: string): Promise<Repository> {
    const response = await apiClient.get<ApiResponse<Repository>>(`/repositories/${id}`);
    return response.data;
  },

  /**
   * Get repositories by owner ID
   */
  async getByOwner(ownerId: string, filters?: RepositoryFilters): Promise<PaginatedResponse<Repository>> {
    const query = buildQueryString({ ...filters, ownerId });
    const response = await apiClient.get<PaginatedResponse<Repository>>(`/repositories${query}`);
    return response;
  },

  /**
   * Get starred repositories for current user
   */
  async getStarred(filters?: RepositoryFilters): Promise<PaginatedResponse<Repository>> {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get<PaginatedResponse<Repository>>(`/repositories/starred${query}`);
    return response;
  },

  /**
   * Get trending repositories
   */
  async getTrending(limit?: number): Promise<Repository[]> {
    const query = limit ? buildQueryString({ limit }) : '';
    const response = await apiClient.get<ApiResponse<Repository[]>>(`/repositories/trending${query}`);
    return response.data;
  },

  /**
   * Create a new repository
   */
  async create(data: CreateRepositoryInput): Promise<Repository> {
    const response = await apiClient.post<ApiResponse<Repository>>('/repositories', data);
    return response.data;
  },

  /**
   * Update a repository
   */
  async update(id: string, data: UpdateRepositoryInput): Promise<Repository> {
    const response = await apiClient.patch<ApiResponse<Repository>>(`/repositories/${id}`, data);
    return response.data;
  },

  /**
   * Delete a repository
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/repositories/${id}`);
  },

  /**
   * Star a repository
   */
  async star(id: string): Promise<void> {
    await apiClient.post(`/repositories/${id}/star`);
  },

  /**
   * Unstar a repository
   */
  async unstar(id: string): Promise<void> {
    await apiClient.delete(`/repositories/${id}/star`);
  },

  /**
   * Fork a repository
   */
  async fork(id: string): Promise<Repository> {
    const response = await apiClient.post<ApiResponse<Repository>>(`/repositories/${id}/fork`);
    return response.data;
  },

  /**
   * Get repository collaborators
   */
  async getCollaborators(id: string): Promise<Collaborator[]> {
    const response = await apiClient.get<ApiResponse<Collaborator[]>>(`/repositories/${id}/collaborators`);
    return response.data;
  },

  /**
   * Add a collaborator to a repository
   */
  async addCollaborator(id: string, userId: string, role: string): Promise<Collaborator> {
    const response = await apiClient.post<ApiResponse<Collaborator>>(
      `/repositories/${id}/collaborators`,
      { userId, role }
    );
    return response.data;
  },

  /**
   * Remove a collaborator from a repository
   */
  async removeCollaborator(id: string, userId: string): Promise<void> {
    await apiClient.delete(`/repositories/${id}/collaborators/${userId}`);
  },

  /**
   * Get repository activity
   */
  async getActivity(id: string, limit?: number): Promise<Activity[]> {
    const query = limit ? buildQueryString({ limit }) : '';
    const response = await apiClient.get<ApiResponse<Activity[]>>(`/repositories/${id}/activity${query}`);
    return response.data;
  },

  /**
   * Search repositories
   */
  async search(query: string, filters?: RepositoryFilters): Promise<PaginatedResponse<Repository>> {
    const params = buildQueryString({ ...filters, search: query });
    const response = await apiClient.get<PaginatedResponse<Repository>>(`/repositories/search${params}`);
    return response;
  },
};
