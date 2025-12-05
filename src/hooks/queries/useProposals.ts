// ============================================================================
// ENUX - Proposal Query Hooks
// ============================================================================

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { proposalsService } from '@/services';
import type {
  CreateProposalInput,
  UpdateProposalInput,
  SubmitReviewInput,
  ProposalFilters,
  ReviewStatus,
} from '@/types';

// Query Keys
export const proposalKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalKeys.all, 'list'] as const,
  list: (filters: ProposalFilters) => [...proposalKeys.lists(), filters] as const,
  details: () => [...proposalKeys.all, 'detail'] as const,
  detail: (id: string) => [...proposalKeys.details(), id] as const,
  mine: () => [...proposalKeys.all, 'mine'] as const,
  reviewing: () => [...proposalKeys.all, 'reviewing'] as const,
  byRepository: (repositoryId: string) => [...proposalKeys.all, 'repository', repositoryId] as const,
  comments: (id: string) => [...proposalKeys.detail(id), 'comments'] as const,
};

// ----------------------------------------------------------------------------
// Query Hooks
// ----------------------------------------------------------------------------

/**
 * Get all proposals with filters
 */
export function useProposals(filters?: ProposalFilters) {
  return useQuery({
    queryKey: proposalKeys.list(filters || {}),
    queryFn: () => proposalsService.getAll(filters),
  });
}

/**
 * Get proposals with infinite scroll
 */
export function useInfiniteProposals(filters?: Omit<ProposalFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: proposalKeys.list({ ...filters, page: 'infinite' } as ProposalFilters),
    queryFn: ({ pageParam = 1 }) => proposalsService.getAll({ ...filters, page: pageParam }),
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
 * Get a single proposal by ID
 */
export function useProposal(id: string) {
  return useQuery({
    queryKey: proposalKeys.detail(id),
    queryFn: () => proposalsService.getById(id),
    enabled: !!id,
  });
}

/**
 * Get proposals for a specific repository
 */
export function useProposalsByRepository(repositoryId: string, filters?: ProposalFilters) {
  return useQuery({
    queryKey: proposalKeys.byRepository(repositoryId),
    queryFn: () => proposalsService.getByRepository(repositoryId, filters),
    enabled: !!repositoryId,
  });
}

/**
 * Get proposals authored by current user
 */
export function useMyProposals(filters?: ProposalFilters) {
  return useQuery({
    queryKey: proposalKeys.mine(),
    queryFn: () => proposalsService.getMyProposals(filters),
  });
}

/**
 * Get proposals where current user is a reviewer
 */
export function useProposalsToReview(filters?: ProposalFilters) {
  return useQuery({
    queryKey: proposalKeys.reviewing(),
    queryFn: () => proposalsService.getToReview(filters),
  });
}

/**
 * Get comments for a proposal
 */
export function useProposalComments(id: string) {
  return useQuery({
    queryKey: proposalKeys.comments(id),
    queryFn: () => proposalsService.getComments(id),
    enabled: !!id,
  });
}

// ----------------------------------------------------------------------------
// Mutation Hooks
// ----------------------------------------------------------------------------

/**
 * Create a new proposal
 */
export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProposalInput) => proposalsService.create(data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: proposalKeys.mine() });
      queryClient.invalidateQueries({ queryKey: proposalKeys.byRepository(created.repositoryId) });
    },
  });
}

/**
 * Update a proposal
 */
export function useUpdateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProposalInput }) =>
      proposalsService.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(proposalKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
}

/**
 * Delete a proposal
 */
export function useDeleteProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proposalsService.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: proposalKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: proposalKeys.mine() });
    },
  });
}

/**
 * Submit a proposal for review
 */
export function useSubmitProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proposalsService.submit(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(proposalKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: proposalKeys.mine() });
    },
  });
}

/**
 * Close a proposal
 */
export function useCloseProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proposalsService.close(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(proposalKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
}

/**
 * Reopen a proposal
 */
export function useReopenProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proposalsService.reopen(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(proposalKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
}

/**
 * Merge a proposal
 */
export function useMergeProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proposalsService.merge(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(proposalKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
    },
  });
}

/**
 * Submit a review
 */
export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitReviewInput) => proposalsService.submitReview(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(proposalKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: proposalKeys.reviewing() });
    },
  });
}

/**
 * Approve a proposal
 */
export function useApproveProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      proposalsService.approve(id, comment),
    onSuccess: (updated) => {
      queryClient.setQueryData(proposalKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: proposalKeys.reviewing() });
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
}

/**
 * Request changes on a proposal
 */
export function useRequestChanges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      proposalsService.requestChanges(id, comment),
    onSuccess: (updated) => {
      queryClient.setQueryData(proposalKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: proposalKeys.reviewing() });
    },
  });
}

/**
 * Add a reviewer
 */
export function useAddReviewer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      proposalsService.addReviewer(id, userId),
    onSuccess: (updated) => {
      queryClient.setQueryData(proposalKeys.detail(updated.id), updated);
    },
  });
}

/**
 * Remove a reviewer
 */
export function useRemoveReviewer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      proposalsService.removeReviewer(id, userId),
    onSuccess: (updated) => {
      queryClient.setQueryData(proposalKeys.detail(updated.id), updated);
    },
  });
}

/**
 * Add a comment
 */
export function useAddProposalComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content, lineNumber }: { id: string; content: string; lineNumber?: number }) =>
      proposalsService.addComment(id, content, lineNumber),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.comments(id) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(id) });
    },
  });
}

/**
 * Delete a comment
 */
export function useDeleteProposalComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ proposalId, commentId }: { proposalId: string; commentId: string }) =>
      proposalsService.deleteComment(proposalId, commentId),
    onSuccess: (_, { proposalId }) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.comments(proposalId) });
    },
  });
}

/**
 * Add labels
 */
export function useAddProposalLabels() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, labels }: { id: string; labels: string[] }) =>
      proposalsService.addLabels(id, labels),
    onSuccess: (updated) => {
      queryClient.setQueryData(proposalKeys.detail(updated.id), updated);
    },
  });
}

/**
 * Remove a label
 */
export function useRemoveProposalLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, label }: { id: string; label: string }) =>
      proposalsService.removeLabel(id, label),
    onSuccess: (updated) => {
      queryClient.setQueryData(proposalKeys.detail(updated.id), updated);
    },
  });
}
