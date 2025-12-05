// ============================================================================
// ENUX - Proposals (Pull Requests) Service
// ============================================================================

import { apiClient, buildQueryString } from './api';
import type {
  Proposal,
  ProposalComment,
  CreateProposalInput,
  UpdateProposalInput,
  SubmitReviewInput,
  ProposalFilters,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

// ----------------------------------------------------------------------------
// Proposals Service
// ----------------------------------------------------------------------------

export const proposalsService = {
  /**
   * Get all proposals with optional filters
   */
  async getAll(filters?: ProposalFilters): Promise<PaginatedResponse<Proposal>> {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get<PaginatedResponse<Proposal>>(`/proposals${query}`);
    return response;
  },

  /**
   * Get a single proposal by ID
   */
  async getById(id: string): Promise<Proposal> {
    const response = await apiClient.get<ApiResponse<Proposal>>(`/proposals/${id}`);
    return response.data;
  },

  /**
   * Get proposals for a specific repository
   */
  async getByRepository(repositoryId: string, filters?: ProposalFilters): Promise<PaginatedResponse<Proposal>> {
    const query = buildQueryString({ ...filters, repositoryId });
    const response = await apiClient.get<PaginatedResponse<Proposal>>(`/proposals${query}`);
    return response;
  },

  /**
   * Get proposals authored by current user
   */
  async getMyProposals(filters?: ProposalFilters): Promise<PaginatedResponse<Proposal>> {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get<PaginatedResponse<Proposal>>(`/proposals/mine${query}`);
    return response;
  },

  /**
   * Get proposals where current user is a reviewer
   */
  async getToReview(filters?: ProposalFilters): Promise<PaginatedResponse<Proposal>> {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get<PaginatedResponse<Proposal>>(`/proposals/reviewing${query}`);
    return response;
  },

  /**
   * Create a new proposal
   */
  async create(data: CreateProposalInput): Promise<Proposal> {
    const response = await apiClient.post<ApiResponse<Proposal>>('/proposals', data);
    return response.data;
  },

  /**
   * Update a proposal
   */
  async update(id: string, data: UpdateProposalInput): Promise<Proposal> {
    const response = await apiClient.patch<ApiResponse<Proposal>>(`/proposals/${id}`, data);
    return response.data;
  },

  /**
   * Delete a proposal
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/proposals/${id}`);
  },

  /**
   * Submit a proposal for review (change from draft to open)
   */
  async submit(id: string): Promise<Proposal> {
    const response = await apiClient.post<ApiResponse<Proposal>>(`/proposals/${id}/submit`);
    return response.data;
  },

  /**
   * Close a proposal
   */
  async close(id: string): Promise<Proposal> {
    const response = await apiClient.post<ApiResponse<Proposal>>(`/proposals/${id}/close`);
    return response.data;
  },

  /**
   * Reopen a closed proposal
   */
  async reopen(id: string): Promise<Proposal> {
    const response = await apiClient.post<ApiResponse<Proposal>>(`/proposals/${id}/reopen`);
    return response.data;
  },

  /**
   * Merge an approved proposal
   */
  async merge(id: string): Promise<Proposal> {
    const response = await apiClient.post<ApiResponse<Proposal>>(`/proposals/${id}/merge`);
    return response.data;
  },

  // --------------------------------------------------------------------------
  // Reviews
  // --------------------------------------------------------------------------

  /**
   * Submit a review for a proposal
   */
  async submitReview(data: SubmitReviewInput): Promise<Proposal> {
    const response = await apiClient.post<ApiResponse<Proposal>>(
      `/proposals/${data.proposalId}/reviews`,
      { status: data.status, comment: data.comment }
    );
    return response.data;
  },

  /**
   * Request changes on a proposal
   */
  async requestChanges(id: string, comment: string): Promise<Proposal> {
    const response = await apiClient.post<ApiResponse<Proposal>>(
      `/proposals/${id}/reviews`,
      { status: 'changes_requested', comment }
    );
    return response.data;
  },

  /**
   * Approve a proposal
   */
  async approve(id: string, comment?: string): Promise<Proposal> {
    const response = await apiClient.post<ApiResponse<Proposal>>(
      `/proposals/${id}/reviews`,
      { status: 'approved', comment }
    );
    return response.data;
  },

  // --------------------------------------------------------------------------
  // Reviewers
  // --------------------------------------------------------------------------

  /**
   * Add a reviewer to a proposal
   */
  async addReviewer(id: string, userId: string): Promise<Proposal> {
    const response = await apiClient.post<ApiResponse<Proposal>>(
      `/proposals/${id}/reviewers`,
      { userId }
    );
    return response.data;
  },

  /**
   * Remove a reviewer from a proposal
   */
  async removeReviewer(id: string, userId: string): Promise<Proposal> {
    const response = await apiClient.delete<ApiResponse<Proposal>>(
      `/proposals/${id}/reviewers/${userId}`
    );
    return response.data;
  },

  // --------------------------------------------------------------------------
  // Comments
  // --------------------------------------------------------------------------

  /**
   * Get comments for a proposal
   */
  async getComments(id: string): Promise<ProposalComment[]> {
    const response = await apiClient.get<ApiResponse<ProposalComment[]>>(`/proposals/${id}/comments`);
    return response.data;
  },

  /**
   * Add a comment to a proposal
   */
  async addComment(id: string, content: string, lineNumber?: number): Promise<ProposalComment> {
    const response = await apiClient.post<ApiResponse<ProposalComment>>(
      `/proposals/${id}/comments`,
      { content, lineNumber }
    );
    return response.data;
  },

  /**
   * Update a comment
   */
  async updateComment(proposalId: string, commentId: string, content: string): Promise<ProposalComment> {
    const response = await apiClient.patch<ApiResponse<ProposalComment>>(
      `/proposals/${proposalId}/comments/${commentId}`,
      { content }
    );
    return response.data;
  },

  /**
   * Delete a comment
   */
  async deleteComment(proposalId: string, commentId: string): Promise<void> {
    await apiClient.delete(`/proposals/${proposalId}/comments/${commentId}`);
  },

  // --------------------------------------------------------------------------
  // Labels
  // --------------------------------------------------------------------------

  /**
   * Add labels to a proposal
   */
  async addLabels(id: string, labels: string[]): Promise<Proposal> {
    const response = await apiClient.post<ApiResponse<Proposal>>(
      `/proposals/${id}/labels`,
      { labels }
    );
    return response.data;
  },

  /**
   * Remove a label from a proposal
   */
  async removeLabel(id: string, label: string): Promise<Proposal> {
    const response = await apiClient.delete<ApiResponse<Proposal>>(
      `/proposals/${id}/labels/${encodeURIComponent(label)}`
    );
    return response.data;
  },
};
