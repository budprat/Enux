// ============================================================================
// ENUX - Framework Query Hooks
// ============================================================================

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { frameworksService } from '@/services';
import type { FrameworkFilters } from '@/types';

// Query Keys
export const frameworkKeys = {
  all: ['frameworks'] as const,
  lists: () => [...frameworkKeys.all, 'list'] as const,
  list: (filters: FrameworkFilters) => [...frameworkKeys.lists(), filters] as const,
  details: () => [...frameworkKeys.all, 'detail'] as const,
  detail: (id: string) => [...frameworkKeys.details(), id] as const,
  trending: () => [...frameworkKeys.all, 'trending'] as const,
  recent: () => [...frameworkKeys.all, 'recent'] as const,
  categories: () => [...frameworkKeys.all, 'categories'] as const,
  recommendations: () => [...frameworkKeys.all, 'recommendations'] as const,
  similar: (id: string) => [...frameworkKeys.detail(id), 'similar'] as const,
};

// ----------------------------------------------------------------------------
// Query Hooks
// ----------------------------------------------------------------------------

/**
 * Get all frameworks with filters
 */
export function useFrameworks(filters?: FrameworkFilters) {
  return useQuery({
    queryKey: frameworkKeys.list(filters || {}),
    queryFn: () => frameworksService.getAll(filters),
  });
}

/**
 * Get frameworks with infinite scroll
 */
export function useInfiniteFrameworks(filters?: Omit<FrameworkFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: frameworkKeys.list({ ...filters, page: 'infinite' } as FrameworkFilters),
    queryFn: ({ pageParam = 1 }) => frameworksService.getAll({ ...filters, page: pageParam }),
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
 * Get a single framework by ID
 */
export function useFramework(id: string) {
  return useQuery({
    queryKey: frameworkKeys.detail(id),
    queryFn: () => frameworksService.getById(id),
    enabled: !!id,
  });
}

/**
 * Get trending frameworks
 */
export function useTrendingFrameworks(limit?: number) {
  return useQuery({
    queryKey: frameworkKeys.trending(),
    queryFn: () => frameworksService.getTrending(limit),
  });
}

/**
 * Get recently added frameworks
 */
export function useRecentFrameworks(limit?: number) {
  return useQuery({
    queryKey: frameworkKeys.recent(),
    queryFn: () => frameworksService.getRecentlyAdded(limit),
  });
}

/**
 * Get all framework categories
 */
export function useFrameworkCategories() {
  return useQuery({
    queryKey: frameworkKeys.categories(),
    queryFn: () => frameworksService.getCategories(),
    staleTime: 1000 * 60 * 60, // Categories rarely change, cache for 1 hour
  });
}

/**
 * Get frameworks by category
 */
export function useFrameworksByCategory(category: string, filters?: FrameworkFilters) {
  return useQuery({
    queryKey: [...frameworkKeys.all, 'category', category, filters],
    queryFn: () => frameworksService.getByCategory(category, filters),
    enabled: !!category,
  });
}

/**
 * Get AI-powered framework recommendations
 */
export function useFrameworkRecommendations() {
  return useQuery({
    queryKey: frameworkKeys.recommendations(),
    queryFn: () => frameworksService.getRecommendations(),
  });
}

/**
 * Get similar frameworks
 */
export function useSimilarFrameworks(id: string, limit?: number) {
  return useQuery({
    queryKey: frameworkKeys.similar(id),
    queryFn: () => frameworksService.getSimilar(id, limit),
    enabled: !!id,
  });
}

/**
 * Search frameworks
 */
export function useSearchFrameworks(query: string, filters?: FrameworkFilters) {
  return useQuery({
    queryKey: [...frameworkKeys.all, 'search', query, filters],
    queryFn: () => frameworksService.search(query, filters),
    enabled: query.length >= 2,
  });
}

// ----------------------------------------------------------------------------
// Mutation Hooks
// ----------------------------------------------------------------------------

/**
 * Star a framework
 */
export function useStarFramework() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => frameworksService.star(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: frameworkKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: frameworkKeys.trending() });
    },
  });
}

/**
 * Unstar a framework
 */
export function useUnstarFramework() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => frameworksService.unstar(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: frameworkKeys.detail(id) });
    },
  });
}

/**
 * Fork a framework
 */
export function useForkFramework() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => frameworksService.fork(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories', 'list'] });
    },
  });
}

/**
 * Use a framework template
 */
export function useFrameworkTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, repositoryName }: { id: string; repositoryName: string }) =>
      frameworksService.useTemplate(id, repositoryName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories', 'list'] });
    },
  });
}
