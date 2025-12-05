// ============================================================================
// ENUX - Repository Query Hooks
// ============================================================================

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { repositoriesService } from '@/services';
import type {
  Repository,
  CreateRepositoryInput,
  UpdateRepositoryInput,
  RepositoryFilters,
} from '@/types';

// Query Keys
export const repositoryKeys = {
  all: ['repositories'] as const,
  lists: () => [...repositoryKeys.all, 'list'] as const,
  list: (filters: RepositoryFilters) => [...repositoryKeys.lists(), filters] as const,
  details: () => [...repositoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...repositoryKeys.details(), id] as const,
  starred: () => [...repositoryKeys.all, 'starred'] as const,
  trending: () => [...repositoryKeys.all, 'trending'] as const,
  byOwner: (ownerId: string) => [...repositoryKeys.all, 'owner', ownerId] as const,
  collaborators: (id: string) => [...repositoryKeys.detail(id), 'collaborators'] as const,
  activity: (id: string) => [...repositoryKeys.detail(id), 'activity'] as const,
};

// ----------------------------------------------------------------------------
// Query Hooks
// ----------------------------------------------------------------------------

/**
 * Get all repositories with filters
 */
export function useRepositories(filters?: RepositoryFilters) {
  return useQuery({
    queryKey: repositoryKeys.list(filters || {}),
    queryFn: () => repositoriesService.getAll(filters),
  });
}

/**
 * Get repositories with infinite scroll
 */
export function useInfiniteRepositories(filters?: Omit<RepositoryFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: repositoryKeys.list({ ...filters, page: 'infinite' } as RepositoryFilters),
    queryFn: ({ pageParam = 1 }) => repositoriesService.getAll({ ...filters, page: pageParam }),
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
 * Get a single repository by ID
 */
export function useRepository(id: string) {
  return useQuery({
    queryKey: repositoryKeys.detail(id),
    queryFn: () => repositoriesService.getById(id),
    enabled: !!id,
  });
}

/**
 * Get repositories by owner
 */
export function useRepositoriesByOwner(ownerId: string, filters?: RepositoryFilters) {
  return useQuery({
    queryKey: repositoryKeys.byOwner(ownerId),
    queryFn: () => repositoriesService.getByOwner(ownerId, filters),
    enabled: !!ownerId,
  });
}

/**
 * Get starred repositories
 */
export function useStarredRepositories(filters?: RepositoryFilters) {
  return useQuery({
    queryKey: repositoryKeys.starred(),
    queryFn: () => repositoriesService.getStarred(filters),
  });
}

/**
 * Get trending repositories
 */
export function useTrendingRepositories(limit?: number) {
  return useQuery({
    queryKey: repositoryKeys.trending(),
    queryFn: () => repositoriesService.getTrending(limit),
  });
}

/**
 * Get repository collaborators
 */
export function useRepositoryCollaborators(id: string) {
  return useQuery({
    queryKey: repositoryKeys.collaborators(id),
    queryFn: () => repositoriesService.getCollaborators(id),
    enabled: !!id,
  });
}

/**
 * Get repository activity
 */
export function useRepositoryActivity(id: string, limit?: number) {
  return useQuery({
    queryKey: repositoryKeys.activity(id),
    queryFn: () => repositoriesService.getActivity(id, limit),
    enabled: !!id,
  });
}

/**
 * Search repositories
 */
export function useSearchRepositories(query: string, filters?: RepositoryFilters) {
  return useQuery({
    queryKey: [...repositoryKeys.all, 'search', query, filters],
    queryFn: () => repositoriesService.search(query, filters),
    enabled: query.length >= 2,
  });
}

// ----------------------------------------------------------------------------
// Mutation Hooks
// ----------------------------------------------------------------------------

/**
 * Create a new repository
 */
export function useCreateRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRepositoryInput) => repositoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: repositoryKeys.lists() });
    },
  });
}

/**
 * Update a repository
 */
export function useUpdateRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRepositoryInput }) =>
      repositoriesService.update(id, data),
    onSuccess: (updatedRepo) => {
      queryClient.setQueryData(repositoryKeys.detail(updatedRepo.id), updatedRepo);
      queryClient.invalidateQueries({ queryKey: repositoryKeys.lists() });
    },
  });
}

/**
 * Delete a repository
 */
export function useDeleteRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repositoriesService.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: repositoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: repositoryKeys.lists() });
    },
  });
}

/**
 * Star a repository
 */
export function useStarRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repositoriesService.star(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: repositoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: repositoryKeys.starred() });
    },
  });
}

/**
 * Unstar a repository
 */
export function useUnstarRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repositoriesService.unstar(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: repositoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: repositoryKeys.starred() });
    },
  });
}

/**
 * Fork a repository
 */
export function useForkRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repositoriesService.fork(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: repositoryKeys.lists() });
    },
  });
}

/**
 * Add collaborator to repository
 */
export function useAddRepositoryCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId, role }: { id: string; userId: string; role: string }) =>
      repositoriesService.addCollaborator(id, userId, role),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: repositoryKeys.collaborators(id) });
      queryClient.invalidateQueries({ queryKey: repositoryKeys.detail(id) });
    },
  });
}

/**
 * Remove collaborator from repository
 */
export function useRemoveRepositoryCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      repositoriesService.removeCollaborator(id, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: repositoryKeys.collaborators(id) });
      queryClient.invalidateQueries({ queryKey: repositoryKeys.detail(id) });
    },
  });
}
