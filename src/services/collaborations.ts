// ============================================================================
// ENUX - Collaborations Service
// ============================================================================

import { apiClient, buildQueryString } from './api';
import type {
  Collaboration,
  CollaborationRequest,
  CollaborationMessage,
  CreateCollaborationInput,
  SendCollaborationRequestInput,
  Collaborator,
  ApiResponse,
  PaginatedResponse,
  InviteStatus,
} from '@/types';

// ----------------------------------------------------------------------------
// Collaborations Service
// ----------------------------------------------------------------------------

export const collaborationsService = {
  /**
   * Get all collaborations for current user
   */
  async getAll(status?: string): Promise<Collaboration[]> {
    const query = status ? buildQueryString({ status }) : '';
    const response = await apiClient.get<ApiResponse<Collaboration[]>>(`/collaborations${query}`);
    return response.data;
  },

  /**
   * Get a single collaboration by ID
   */
  async getById(id: string): Promise<Collaboration> {
    const response = await apiClient.get<ApiResponse<Collaboration>>(`/collaborations/${id}`);
    return response.data;
  },

  /**
   * Create a new collaboration
   */
  async create(data: CreateCollaborationInput): Promise<Collaboration> {
    const response = await apiClient.post<ApiResponse<Collaboration>>('/collaborations', data);
    return response.data;
  },

  /**
   * Update a collaboration
   */
  async update(id: string, data: Partial<CreateCollaborationInput>): Promise<Collaboration> {
    const response = await apiClient.patch<ApiResponse<Collaboration>>(`/collaborations/${id}`, data);
    return response.data;
  },

  /**
   * Delete a collaboration
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/collaborations/${id}`);
  },

  /**
   * Update collaboration progress
   */
  async updateProgress(id: string, progress: number): Promise<Collaboration> {
    const response = await apiClient.patch<ApiResponse<Collaboration>>(
      `/collaborations/${id}/progress`,
      { progress }
    );
    return response.data;
  },

  // --------------------------------------------------------------------------
  // Collaboration Requests
  // --------------------------------------------------------------------------

  /**
   * Get incoming collaboration requests
   */
  async getIncomingRequests(): Promise<CollaborationRequest[]> {
    const response = await apiClient.get<ApiResponse<CollaborationRequest[]>>('/collaborations/requests/incoming');
    return response.data;
  },

  /**
   * Get outgoing collaboration requests
   */
  async getOutgoingRequests(): Promise<CollaborationRequest[]> {
    const response = await apiClient.get<ApiResponse<CollaborationRequest[]>>('/collaborations/requests/outgoing');
    return response.data;
  },

  /**
   * Send a collaboration request
   */
  async sendRequest(data: SendCollaborationRequestInput): Promise<CollaborationRequest> {
    const response = await apiClient.post<ApiResponse<CollaborationRequest>>(
      '/collaborations/requests',
      data
    );
    return response.data;
  },

  /**
   * Respond to a collaboration request
   */
  async respondToRequest(requestId: string, status: InviteStatus): Promise<CollaborationRequest> {
    const response = await apiClient.patch<ApiResponse<CollaborationRequest>>(
      `/collaborations/requests/${requestId}`,
      { status }
    );
    return response.data;
  },

  /**
   * Cancel a collaboration request
   */
  async cancelRequest(requestId: string): Promise<void> {
    await apiClient.delete(`/collaborations/requests/${requestId}`);
  },

  // --------------------------------------------------------------------------
  // Collaborators Management
  // --------------------------------------------------------------------------

  /**
   * Get collaborators for a collaboration
   */
  async getCollaborators(id: string): Promise<Collaborator[]> {
    const response = await apiClient.get<ApiResponse<Collaborator[]>>(`/collaborations/${id}/collaborators`);
    return response.data;
  },

  /**
   * Invite a user to a collaboration
   */
  async inviteCollaborator(id: string, userId: string, role: string): Promise<Collaborator> {
    const response = await apiClient.post<ApiResponse<Collaborator>>(
      `/collaborations/${id}/collaborators`,
      { userId, role }
    );
    return response.data;
  },

  /**
   * Remove a collaborator from a collaboration
   */
  async removeCollaborator(id: string, userId: string): Promise<void> {
    await apiClient.delete(`/collaborations/${id}/collaborators/${userId}`);
  },

  /**
   * Update collaborator role
   */
  async updateCollaboratorRole(id: string, userId: string, role: string): Promise<Collaborator> {
    const response = await apiClient.patch<ApiResponse<Collaborator>>(
      `/collaborations/${id}/collaborators/${userId}`,
      { role }
    );
    return response.data;
  },

  // --------------------------------------------------------------------------
  // Messages
  // --------------------------------------------------------------------------

  /**
   * Get messages for a collaboration
   */
  async getMessages(id: string, page?: number, limit?: number): Promise<PaginatedResponse<CollaborationMessage>> {
    const query = buildQueryString({ page, limit });
    const response = await apiClient.get<PaginatedResponse<CollaborationMessage>>(
      `/collaborations/${id}/messages${query}`
    );
    return response;
  },

  /**
   * Send a message to a collaboration
   */
  async sendMessage(id: string, content: string, type?: string): Promise<CollaborationMessage> {
    const response = await apiClient.post<ApiResponse<CollaborationMessage>>(
      `/collaborations/${id}/messages`,
      { content, type }
    );
    return response.data;
  },

  /**
   * Delete a message
   */
  async deleteMessage(collaborationId: string, messageId: string): Promise<void> {
    await apiClient.delete(`/collaborations/${collaborationId}/messages/${messageId}`);
  },

  // --------------------------------------------------------------------------
  // Suggested Collaborators
  // --------------------------------------------------------------------------

  /**
   * Get suggested collaborators based on user profile
   */
  async getSuggestedCollaborators(limit?: number): Promise<Collaborator[]> {
    const query = limit ? buildQueryString({ limit }) : '';
    const response = await apiClient.get<ApiResponse<Collaborator[]>>(
      `/collaborations/suggested-collaborators${query}`
    );
    return response.data;
  },
};
