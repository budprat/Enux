// ============================================================================
// ENUX - Activity & Notifications Query Hooks
// ============================================================================

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { activityService, notificationsService, statsService } from '@/services';
import type { ActivityFilters } from '@/types';

// Query Keys
export const activityKeys = {
  all: ['activity'] as const,
  feed: () => [...activityKeys.all, 'feed'] as const,
  userActivity: (userId: string) => [...activityKeys.all, 'user', userId] as const,
  repositoryActivity: (repositoryId: string) => [...activityKeys.all, 'repository', repositoryId] as const,
  global: () => [...activityKeys.all, 'global'] as const,
};

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
  unreadCount: () => [...notificationKeys.all, 'unread', 'count'] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
};

export const statsKeys = {
  all: ['stats'] as const,
  user: () => [...statsKeys.all, 'user'] as const,
  dashboard: () => [...statsKeys.all, 'dashboard'] as const,
  repository: (repositoryId: string) => [...statsKeys.all, 'repository', repositoryId] as const,
};

// ----------------------------------------------------------------------------
// Activity Query Hooks
// ----------------------------------------------------------------------------

/**
 * Get activity feed
 */
export function useActivityFeed(filters?: ActivityFilters) {
  return useQuery({
    queryKey: [...activityKeys.feed(), filters],
    queryFn: () => activityService.getFeed(filters),
  });
}

/**
 * Get activity feed with infinite scroll
 */
export function useInfiniteActivityFeed(filters?: Omit<ActivityFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: [...activityKeys.feed(), 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => activityService.getFeed({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

/**
 * Get activity for a specific user
 */
export function useUserActivity(userId: string, filters?: ActivityFilters) {
  return useQuery({
    queryKey: [...activityKeys.userActivity(userId), filters],
    queryFn: () => activityService.getUserActivity(userId, filters),
    enabled: !!userId,
  });
}

/**
 * Get activity for a specific repository
 */
export function useRepositoryActivity(repositoryId: string, filters?: ActivityFilters) {
  return useQuery({
    queryKey: [...activityKeys.repositoryActivity(repositoryId), filters],
    queryFn: () => activityService.getRepositoryActivity(repositoryId, filters),
    enabled: !!repositoryId,
  });
}

/**
 * Get global activity feed
 */
export function useGlobalActivity(filters?: ActivityFilters) {
  return useQuery({
    queryKey: [...activityKeys.global(), filters],
    queryFn: () => activityService.getGlobalFeed(filters),
  });
}

// ----------------------------------------------------------------------------
// Notification Query Hooks
// ----------------------------------------------------------------------------

/**
 * Get all notifications
 */
export function useNotifications(page?: number, limit?: number) {
  return useQuery({
    queryKey: [...notificationKeys.list(), page, limit],
    queryFn: () => notificationsService.getAll(page, limit),
  });
}

/**
 * Get notifications with infinite scroll
 */
export function useInfiniteNotifications(limit?: number) {
  return useInfiniteQuery({
    queryKey: [...notificationKeys.list(), 'infinite'],
    queryFn: ({ pageParam = 1 }) => notificationsService.getAll(pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

/**
 * Get unread notification count
 */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationsService.getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Get notification preferences
 */
export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: () => notificationsService.getPreferences(),
  });
}

// ----------------------------------------------------------------------------
// Stats Query Hooks
// ----------------------------------------------------------------------------

/**
 * Get user stats
 */
export function useUserStats() {
  return useQuery({
    queryKey: statsKeys.user(),
    queryFn: () => statsService.getUserStats(),
  });
}

/**
 * Get dashboard stats
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: () => statsService.getDashboardStats(),
  });
}

/**
 * Get repository stats
 */
export function useRepositoryStats(repositoryId: string) {
  return useQuery({
    queryKey: statsKeys.repository(repositoryId),
    queryFn: () => statsService.getRepositoryStats(repositoryId),
    enabled: !!repositoryId,
  });
}

// ----------------------------------------------------------------------------
// Notification Mutation Hooks
// ----------------------------------------------------------------------------

/**
 * Mark notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.setQueryData(notificationKeys.unreadCount(), 0);
    },
  });
}

/**
 * Delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}

/**
 * Delete all notifications
 */
export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsService.deleteAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.setQueryData(notificationKeys.unreadCount(), 0);
    },
  });
}

/**
 * Update notification preferences
 */
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Record<string, boolean>) =>
      notificationsService.updatePreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
    },
  });
}
