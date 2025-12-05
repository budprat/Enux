// ============================================================================
// ENUX - Activity & Notifications Service
// ============================================================================

import { apiClient, buildQueryString } from './api';
import type {
  Activity,
  ActivityFilters,
  Notification,
  UserStats,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

// ----------------------------------------------------------------------------
// Activity Service
// ----------------------------------------------------------------------------

export const activityService = {
  /**
   * Get activity feed for current user
   */
  async getFeed(filters?: ActivityFilters): Promise<PaginatedResponse<Activity>> {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get<PaginatedResponse<Activity>>(`/activity/feed${query}`);
    return response;
  },

  /**
   * Get activity for a specific user
   */
  async getUserActivity(userId: string, filters?: ActivityFilters): Promise<PaginatedResponse<Activity>> {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get<PaginatedResponse<Activity>>(`/activity/user/${userId}${query}`);
    return response;
  },

  /**
   * Get activity for a specific repository
   */
  async getRepositoryActivity(repositoryId: string, filters?: ActivityFilters): Promise<PaginatedResponse<Activity>> {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get<PaginatedResponse<Activity>>(
      `/activity/repository/${repositoryId}${query}`
    );
    return response;
  },

  /**
   * Get global/public activity feed
   */
  async getGlobalFeed(filters?: ActivityFilters): Promise<PaginatedResponse<Activity>> {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get<PaginatedResponse<Activity>>(`/activity/global${query}`);
    return response;
  },
};

// ----------------------------------------------------------------------------
// Notifications Service
// ----------------------------------------------------------------------------

export const notificationsService = {
  /**
   * Get all notifications for current user
   */
  async getAll(page?: number, limit?: number): Promise<PaginatedResponse<Notification>> {
    const query = buildQueryString({ page, limit });
    const response = await apiClient.get<PaginatedResponse<Notification>>(`/notifications${query}`);
    return response;
  },

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread/count');
    return response.data.count;
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.patch('/notifications/read-all');
  },

  /**
   * Delete a notification
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },

  /**
   * Delete all notifications
   */
  async deleteAll(): Promise<void> {
    await apiClient.delete('/notifications/all');
  },

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<Record<string, boolean>> {
    const response = await apiClient.get<ApiResponse<Record<string, boolean>>>('/notifications/preferences');
    return response.data;
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Record<string, boolean>): Promise<void> {
    await apiClient.patch('/notifications/preferences', preferences);
  },
};

// ----------------------------------------------------------------------------
// Stats Service
// ----------------------------------------------------------------------------

export const statsService = {
  /**
   * Get user stats
   */
  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get<ApiResponse<UserStats>>('/stats/user');
    return response.data;
  },

  /**
   * Get dashboard stats (includes recommendations and activity)
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/stats/dashboard');
    return response.data;
  },

  /**
   * Get repository stats
   */
  async getRepositoryStats(repositoryId: string): Promise<{
    views: number;
    stars: number;
    forks: number;
    collaborators: number;
    proposals: number;
    viewsOverTime: { date: string; count: number }[];
    starsOverTime: { date: string; count: number }[];
  }> {
    const response = await apiClient.get<ApiResponse<{
      views: number;
      stars: number;
      forks: number;
      collaborators: number;
      proposals: number;
      viewsOverTime: { date: string; count: number }[];
      starsOverTime: { date: string; count: number }[];
    }>>(`/stats/repository/${repositoryId}`);
    return response.data;
  },
};
