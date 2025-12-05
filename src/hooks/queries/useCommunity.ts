// ============================================================================
// ENUX - Community Query Hooks
// ============================================================================

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { communityService } from '@/services';
import type { CommunityFilters, OpportunityFilters } from '@/types';

// Query Keys
export const communityKeys = {
  all: ['community'] as const,
  members: () => [...communityKeys.all, 'members'] as const,
  memberList: (filters: CommunityFilters) => [...communityKeys.members(), 'list', filters] as const,
  memberDetail: (id: string) => [...communityKeys.members(), 'detail', id] as const,
  recommended: () => [...communityKeys.members(), 'recommended'] as const,
  followers: (userId: string) => [...communityKeys.members(), userId, 'followers'] as const,
  following: (userId: string) => [...communityKeys.members(), userId, 'following'] as const,
  opportunities: () => [...communityKeys.all, 'opportunities'] as const,
  opportunityList: (filters: OpportunityFilters) => [...communityKeys.opportunities(), 'list', filters] as const,
  opportunityDetail: (id: string) => [...communityKeys.opportunities(), 'detail', id] as const,
  userProfile: (userId: string) => [...communityKeys.all, 'profile', userId] as const,
  pendingConnections: () => [...communityKeys.all, 'connections', 'pending'] as const,
};

// ----------------------------------------------------------------------------
// Member Query Hooks
// ----------------------------------------------------------------------------

/**
 * Get community members with filters
 */
export function useCommunityMembers(filters?: CommunityFilters) {
  return useQuery({
    queryKey: communityKeys.memberList(filters || {}),
    queryFn: () => communityService.getMembers(filters),
  });
}

/**
 * Get members with infinite scroll
 */
export function useInfiniteCommunityMembers(filters?: Omit<CommunityFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: communityKeys.memberList({ ...filters, page: 'infinite' } as CommunityFilters),
    queryFn: ({ pageParam = 1 }) => communityService.getMembers({ ...filters, page: pageParam }),
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
 * Get a single community member
 */
export function useCommunityMember(id: string) {
  return useQuery({
    queryKey: communityKeys.memberDetail(id),
    queryFn: () => communityService.getMember(id),
    enabled: !!id,
  });
}

/**
 * Get recommended members
 */
export function useRecommendedMembers(limit?: number) {
  return useQuery({
    queryKey: communityKeys.recommended(),
    queryFn: () => communityService.getRecommendedMembers(limit),
  });
}

/**
 * Search community members
 */
export function useSearchCommunityMembers(query: string, filters?: CommunityFilters) {
  return useQuery({
    queryKey: [...communityKeys.members(), 'search', query, filters],
    queryFn: () => communityService.searchMembers(query, filters),
    enabled: query.length >= 2,
  });
}

/**
 * Get followers of a user
 */
export function useUserFollowers(userId: string, page?: number, limit?: number) {
  return useQuery({
    queryKey: communityKeys.followers(userId),
    queryFn: () => communityService.getFollowers(userId, page, limit),
    enabled: !!userId,
  });
}

/**
 * Get users followed by a user
 */
export function useUserFollowing(userId: string, page?: number, limit?: number) {
  return useQuery({
    queryKey: communityKeys.following(userId),
    queryFn: () => communityService.getFollowing(userId, page, limit),
    enabled: !!userId,
  });
}

// ----------------------------------------------------------------------------
// Opportunity Query Hooks
// ----------------------------------------------------------------------------

/**
 * Get collaboration opportunities
 */
export function useCollaborationOpportunities(filters?: OpportunityFilters) {
  return useQuery({
    queryKey: communityKeys.opportunityList(filters || {}),
    queryFn: () => communityService.getOpportunities(filters),
  });
}

/**
 * Get opportunities with infinite scroll
 */
export function useInfiniteOpportunities(filters?: Omit<OpportunityFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: communityKeys.opportunityList({ ...filters, page: 'infinite' } as OpportunityFilters),
    queryFn: ({ pageParam = 1 }) => communityService.getOpportunities({ ...filters, page: pageParam }),
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
 * Get a single opportunity
 */
export function useCollaborationOpportunity(id: string) {
  return useQuery({
    queryKey: communityKeys.opportunityDetail(id),
    queryFn: () => communityService.getOpportunity(id),
    enabled: !!id,
  });
}

// ----------------------------------------------------------------------------
// Profile Query Hooks
// ----------------------------------------------------------------------------

/**
 * Get user profile
 */
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: communityKeys.userProfile(userId),
    queryFn: () => communityService.getUserProfile(userId),
    enabled: !!userId,
  });
}

/**
 * Get pending connection requests
 */
export function usePendingConnections() {
  return useQuery({
    queryKey: communityKeys.pendingConnections(),
    queryFn: () => communityService.getPendingConnections(),
  });
}

// ----------------------------------------------------------------------------
// Mutation Hooks
// ----------------------------------------------------------------------------

/**
 * Follow a user
 */
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => communityService.follow(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.memberDetail(userId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.following('me') });
    },
  });
}

/**
 * Unfollow a user
 */
export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => communityService.unfollow(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.memberDetail(userId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.following('me') });
    },
  });
}

/**
 * Create an opportunity
 */
export function useCreateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      type: 'seeking' | 'offering';
      description: string;
      skills: string[];
    }) => communityService.createOpportunity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.opportunities() });
    },
  });
}

/**
 * Update an opportunity
 */
export function useUpdateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        title: string;
        type: 'seeking' | 'offering';
        description: string;
        skills: string[];
      }>;
    }) => communityService.updateOpportunity(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(communityKeys.opportunityDetail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: communityKeys.opportunities() });
    },
  });
}

/**
 * Delete an opportunity
 */
export function useDeleteOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => communityService.deleteOpportunity(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: communityKeys.opportunityDetail(id) });
      queryClient.invalidateQueries({ queryKey: communityKeys.opportunities() });
    },
  });
}

/**
 * Respond to an opportunity
 */
export function useRespondToOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      communityService.respondToOpportunity(id, message),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.opportunityDetail(id) });
    },
  });
}

/**
 * Save an opportunity
 */
export function useSaveOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => communityService.saveOpportunity(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.opportunityDetail(id) });
    },
  });
}

/**
 * Unsave an opportunity
 */
export function useUnsaveOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => communityService.unsaveOpportunity(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.opportunityDetail(id) });
    },
  });
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<{
      displayName: string;
      bio: string;
      location: string;
      website: string;
      expertise: string[];
      avatar: string;
    }>) => communityService.updateProfile(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['auth', 'user'], updated);
      queryClient.invalidateQueries({ queryKey: communityKeys.userProfile(updated.id) });
    },
  });
}

/**
 * Send connection request
 */
export function useSendConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, message }: { userId: string; message?: string }) =>
      communityService.sendConnectionRequest(userId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.pendingConnections() });
    },
  });
}

/**
 * Accept connection request
 */
export function useAcceptConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => communityService.acceptConnectionRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.pendingConnections() });
    },
  });
}

/**
 * Decline connection request
 */
export function useDeclineConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => communityService.declineConnectionRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.pendingConnections() });
    },
  });
}
