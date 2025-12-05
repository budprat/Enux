// ============================================================================
// ENUX - Collaboration Query Hooks
// ============================================================================

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { collaborationsService } from '@/services';
import type {
  CreateCollaborationInput,
  SendCollaborationRequestInput,
  InviteStatus,
} from '@/types';

// Query Keys
export const collaborationKeys = {
  all: ['collaborations'] as const,
  lists: () => [...collaborationKeys.all, 'list'] as const,
  list: (status?: string) => [...collaborationKeys.lists(), status] as const,
  details: () => [...collaborationKeys.all, 'detail'] as const,
  detail: (id: string) => [...collaborationKeys.details(), id] as const,
  requests: () => [...collaborationKeys.all, 'requests'] as const,
  incomingRequests: () => [...collaborationKeys.requests(), 'incoming'] as const,
  outgoingRequests: () => [...collaborationKeys.requests(), 'outgoing'] as const,
  collaborators: (id: string) => [...collaborationKeys.detail(id), 'collaborators'] as const,
  messages: (id: string) => [...collaborationKeys.detail(id), 'messages'] as const,
  suggested: () => [...collaborationKeys.all, 'suggested'] as const,
};

// ----------------------------------------------------------------------------
// Query Hooks
// ----------------------------------------------------------------------------

/**
 * Get all collaborations
 */
export function useCollaborations(status?: string) {
  return useQuery({
    queryKey: collaborationKeys.list(status),
    queryFn: () => collaborationsService.getAll(status),
  });
}

/**
 * Get a single collaboration by ID
 */
export function useCollaboration(id: string) {
  return useQuery({
    queryKey: collaborationKeys.detail(id),
    queryFn: () => collaborationsService.getById(id),
    enabled: !!id,
  });
}

/**
 * Get incoming collaboration requests
 */
export function useIncomingRequests() {
  return useQuery({
    queryKey: collaborationKeys.incomingRequests(),
    queryFn: () => collaborationsService.getIncomingRequests(),
  });
}

/**
 * Get outgoing collaboration requests
 */
export function useOutgoingRequests() {
  return useQuery({
    queryKey: collaborationKeys.outgoingRequests(),
    queryFn: () => collaborationsService.getOutgoingRequests(),
  });
}

/**
 * Get collaborators for a collaboration
 */
export function useCollaborationCollaborators(id: string) {
  return useQuery({
    queryKey: collaborationKeys.collaborators(id),
    queryFn: () => collaborationsService.getCollaborators(id),
    enabled: !!id,
  });
}

/**
 * Get messages for a collaboration
 */
export function useCollaborationMessages(id: string, page?: number, limit?: number) {
  return useQuery({
    queryKey: [...collaborationKeys.messages(id), page, limit],
    queryFn: () => collaborationsService.getMessages(id, page, limit),
    enabled: !!id,
  });
}

/**
 * Get messages with infinite scroll
 */
export function useInfiniteCollaborationMessages(id: string, limit?: number) {
  return useInfiniteQuery({
    queryKey: [...collaborationKeys.messages(id), 'infinite'],
    queryFn: ({ pageParam = 1 }) => collaborationsService.getMessages(id, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!id,
  });
}

/**
 * Get suggested collaborators
 */
export function useSuggestedCollaborators(limit?: number) {
  return useQuery({
    queryKey: collaborationKeys.suggested(),
    queryFn: () => collaborationsService.getSuggestedCollaborators(limit),
  });
}

// ----------------------------------------------------------------------------
// Mutation Hooks
// ----------------------------------------------------------------------------

/**
 * Create a new collaboration
 */
export function useCreateCollaboration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollaborationInput) => collaborationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.lists() });
    },
  });
}

/**
 * Update a collaboration
 */
export function useUpdateCollaboration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCollaborationInput> }) =>
      collaborationsService.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(collaborationKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: collaborationKeys.lists() });
    },
  });
}

/**
 * Delete a collaboration
 */
export function useDeleteCollaboration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collaborationsService.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: collaborationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: collaborationKeys.lists() });
    },
  });
}

/**
 * Update collaboration progress
 */
export function useUpdateCollaborationProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) =>
      collaborationsService.updateProgress(id, progress),
    onSuccess: (updated) => {
      queryClient.setQueryData(collaborationKeys.detail(updated.id), updated);
    },
  });
}

/**
 * Send a collaboration request
 */
export function useSendCollaborationRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendCollaborationRequestInput) => collaborationsService.sendRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.outgoingRequests() });
    },
  });
}

/**
 * Respond to a collaboration request
 */
export function useRespondToRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: InviteStatus }) =>
      collaborationsService.respondToRequest(requestId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.incomingRequests() });
      queryClient.invalidateQueries({ queryKey: collaborationKeys.lists() });
    },
  });
}

/**
 * Cancel a collaboration request
 */
export function useCancelRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => collaborationsService.cancelRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.outgoingRequests() });
    },
  });
}

/**
 * Invite a collaborator
 */
export function useInviteCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId, role }: { id: string; userId: string; role: string }) =>
      collaborationsService.inviteCollaborator(id, userId, role),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.collaborators(id) });
    },
  });
}

/**
 * Remove a collaborator
 */
export function useRemoveCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      collaborationsService.removeCollaborator(id, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.collaborators(id) });
    },
  });
}

/**
 * Send a message to a collaboration
 */
export function useSendCollaborationMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content, type }: { id: string; content: string; type?: string }) =>
      collaborationsService.sendMessage(id, content, type),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.messages(id) });
    },
  });
}

/**
 * Delete a message
 */
export function useDeleteCollaborationMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collaborationId, messageId }: { collaborationId: string; messageId: string }) =>
      collaborationsService.deleteMessage(collaborationId, messageId),
    onSuccess: (_, { collaborationId }) => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.messages(collaborationId) });
    },
  });
}
