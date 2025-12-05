// ============================================================================
// ENUX - Community Service
// ============================================================================

import { apiClient, buildQueryString } from './api';
import type {
  User,
  CommunityMember,
  CollaborationOpportunity,
  CommunityFilters,
  OpportunityFilters,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

// ----------------------------------------------------------------------------
// Community Service
// ----------------------------------------------------------------------------

export const communityService = {
  // --------------------------------------------------------------------------
  // Members
  // --------------------------------------------------------------------------

  /**
   * Get community members with optional filters
   */
  async getMembers(filters?: CommunityFilters): Promise<PaginatedResponse<CommunityMember>> {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get<PaginatedResponse<CommunityMember>>(`/community/members${query}`);
    return response;
  },

  /**
   * Get a single member by ID
   */
  async getMember(id: string): Promise<CommunityMember> {
    const response = await apiClient.get<ApiResponse<CommunityMember>>(`/community/members/${id}`);
    return response.data;
  },

  /**
   * Get recommended members based on user profile
   */
  async getRecommendedMembers(limit?: number): Promise<CommunityMember[]> {
    const query = limit ? buildQueryString({ limit }) : '';
    const response = await apiClient.get<ApiResponse<CommunityMember[]>>(
      `/community/members/recommended${query}`
    );
    return response.data;
  },

  /**
   * Search community members
   */
  async searchMembers(query: string, filters?: CommunityFilters): Promise<PaginatedResponse<CommunityMember>> {
    const params = buildQueryString({ ...filters, search: query });
    const response = await apiClient.get<PaginatedResponse<CommunityMember>>(
      `/community/members/search${params}`
    );
    return response;
  },

  // --------------------------------------------------------------------------
  // Following/Followers
  // --------------------------------------------------------------------------

  /**
   * Follow a user
   */
  async follow(userId: string): Promise<void> {
    await apiClient.post(`/community/members/${userId}/follow`);
  },

  /**
   * Unfollow a user
   */
  async unfollow(userId: string): Promise<void> {
    await apiClient.delete(`/community/members/${userId}/follow`);
  },

  /**
   * Get followers of a user
   */
  async getFollowers(userId: string, page?: number, limit?: number): Promise<PaginatedResponse<CommunityMember>> {
    const query = buildQueryString({ page, limit });
    const response = await apiClient.get<PaginatedResponse<CommunityMember>>(
      `/community/members/${userId}/followers${query}`
    );
    return response;
  },

  /**
   * Get users followed by a user
   */
  async getFollowing(userId: string, page?: number, limit?: number): Promise<PaginatedResponse<CommunityMember>> {
    const query = buildQueryString({ page, limit });
    const response = await apiClient.get<PaginatedResponse<CommunityMember>>(
      `/community/members/${userId}/following${query}`
    );
    return response;
  },

  // --------------------------------------------------------------------------
  // Collaboration Opportunities
  // --------------------------------------------------------------------------

  /**
   * Get all collaboration opportunities
   */
  async getOpportunities(filters?: OpportunityFilters): Promise<PaginatedResponse<CollaborationOpportunity>> {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get<PaginatedResponse<CollaborationOpportunity>>(
      `/community/opportunities${query}`
    );
    return response;
  },

  /**
   * Get a single opportunity by ID
   */
  async getOpportunity(id: string): Promise<CollaborationOpportunity> {
    const response = await apiClient.get<ApiResponse<CollaborationOpportunity>>(
      `/community/opportunities/${id}`
    );
    return response.data;
  },

  /**
   * Create a new collaboration opportunity
   */
  async createOpportunity(data: {
    title: string;
    type: 'seeking' | 'offering';
    description: string;
    skills: string[];
  }): Promise<CollaborationOpportunity> {
    const response = await apiClient.post<ApiResponse<CollaborationOpportunity>>(
      '/community/opportunities',
      data
    );
    return response.data;
  },

  /**
   * Update an opportunity
   */
  async updateOpportunity(
    id: string,
    data: Partial<{
      title: string;
      type: 'seeking' | 'offering';
      description: string;
      skills: string[];
    }>
  ): Promise<CollaborationOpportunity> {
    const response = await apiClient.patch<ApiResponse<CollaborationOpportunity>>(
      `/community/opportunities/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete an opportunity
   */
  async deleteOpportunity(id: string): Promise<void> {
    await apiClient.delete(`/community/opportunities/${id}`);
  },

  /**
   * Respond to an opportunity
   */
  async respondToOpportunity(id: string, message: string): Promise<void> {
    await apiClient.post(`/community/opportunities/${id}/respond`, { message });
  },

  /**
   * Save/bookmark an opportunity
   */
  async saveOpportunity(id: string): Promise<void> {
    await apiClient.post(`/community/opportunities/${id}/save`);
  },

  /**
   * Unsave/unbookmark an opportunity
   */
  async unsaveOpportunity(id: string): Promise<void> {
    await apiClient.delete(`/community/opportunities/${id}/save`);
  },

  // --------------------------------------------------------------------------
  // User Profiles
  // --------------------------------------------------------------------------

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${userId}`);
    return response.data;
  },

  /**
   * Update current user profile
   */
  async updateProfile(data: Partial<{
    displayName: string;
    bio: string;
    location: string;
    website: string;
    expertise: string[];
    avatar: string;
  }>): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>('/users/me', data);
    return response.data;
  },

  /**
   * Get user's repositories
   */
  async getUserRepositories(userId: string, page?: number, limit?: number): Promise<PaginatedResponse<unknown>> {
    const query = buildQueryString({ page, limit });
    const response = await apiClient.get<PaginatedResponse<unknown>>(
      `/users/${userId}/repositories${query}`
    );
    return response;
  },

  // --------------------------------------------------------------------------
  // Connections
  // --------------------------------------------------------------------------

  /**
   * Send a connection request
   */
  async sendConnectionRequest(userId: string, message?: string): Promise<void> {
    await apiClient.post(`/community/connections/request`, { userId, message });
  },

  /**
   * Accept a connection request
   */
  async acceptConnectionRequest(requestId: string): Promise<void> {
    await apiClient.post(`/community/connections/${requestId}/accept`);
  },

  /**
   * Decline a connection request
   */
  async declineConnectionRequest(requestId: string): Promise<void> {
    await apiClient.post(`/community/connections/${requestId}/decline`);
  },

  /**
   * Get pending connection requests
   */
  async getPendingConnections(): Promise<unknown[]> {
    const response = await apiClient.get<ApiResponse<unknown[]>>('/community/connections/pending');
    return response.data;
  },
};
