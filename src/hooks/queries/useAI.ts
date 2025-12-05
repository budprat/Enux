// ============================================================================
// ENUX - AI Assistant Query Hooks
// ============================================================================

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { aiService } from '@/services';
import type { SendAIMessageInput } from '@/types';

// Query Keys
export const aiKeys = {
  all: ['ai'] as const,
  conversations: () => [...aiKeys.all, 'conversations'] as const,
  conversationList: () => [...aiKeys.conversations(), 'list'] as const,
  conversationDetail: (id: string) => [...aiKeys.conversations(), 'detail', id] as const,
  recommendations: () => [...aiKeys.all, 'recommendations'] as const,
  frameworkRecommendations: () => [...aiKeys.recommendations(), 'frameworks'] as const,
  collaboratorRecommendations: () => [...aiKeys.recommendations(), 'collaborators'] as const,
  contentOptimizations: (repositoryId: string) => [...aiKeys.recommendations(), 'content', repositoryId] as const,
};

// ----------------------------------------------------------------------------
// Conversation Query Hooks
// ----------------------------------------------------------------------------

/**
 * Get all conversations
 */
export function useAIConversations(page?: number, limit?: number) {
  return useQuery({
    queryKey: [...aiKeys.conversationList(), page, limit],
    queryFn: () => aiService.getConversations(page, limit),
  });
}

/**
 * Get conversations with infinite scroll
 */
export function useInfiniteAIConversations(limit?: number) {
  return useInfiniteQuery({
    queryKey: [...aiKeys.conversationList(), 'infinite'],
    queryFn: ({ pageParam = 1 }) => aiService.getConversations(pageParam, limit),
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
 * Get a single conversation
 */
export function useAIConversation(id: string) {
  return useQuery({
    queryKey: aiKeys.conversationDetail(id),
    queryFn: () => aiService.getConversation(id),
    enabled: !!id,
  });
}

// ----------------------------------------------------------------------------
// Recommendation Query Hooks
// ----------------------------------------------------------------------------

/**
 * Get AI-powered recommendations
 */
export function useAIRecommendations() {
  return useQuery({
    queryKey: aiKeys.recommendations(),
    queryFn: () => aiService.getRecommendations(),
  });
}

/**
 * Get framework recommendations
 */
export function useFrameworkRecommendations(limit?: number) {
  return useQuery({
    queryKey: aiKeys.frameworkRecommendations(),
    queryFn: () => aiService.getFrameworkRecommendations(limit),
  });
}

/**
 * Get collaborator recommendations
 */
export function useCollaboratorRecommendations(limit?: number) {
  return useQuery({
    queryKey: aiKeys.collaboratorRecommendations(),
    queryFn: () => aiService.getCollaboratorRecommendations(limit),
  });
}

/**
 * Get content optimizations for a repository
 */
export function useContentOptimizations(repositoryId: string) {
  return useQuery({
    queryKey: aiKeys.contentOptimizations(repositoryId),
    queryFn: () => aiService.getContentOptimizations(repositoryId),
    enabled: !!repositoryId,
  });
}

// ----------------------------------------------------------------------------
// Mutation Hooks
// ----------------------------------------------------------------------------

/**
 * Send a message to the AI assistant
 */
export function useSendAIMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SendAIMessageInput) => aiService.sendMessage(input),
    onSuccess: (response) => {
      if (response.conversationId) {
        queryClient.invalidateQueries({
          queryKey: aiKeys.conversationDetail(response.conversationId),
        });
      }
    },
  });
}

/**
 * Send a message via webhook
 */
export function useSendWebhookMessage() {
  return useMutation({
    mutationFn: ({
      message,
      webhookUrl,
      context,
    }: {
      message: string;
      webhookUrl?: string;
      context?: string;
    }) => aiService.sendMessageViaWebhook(message, webhookUrl, context),
  });
}

/**
 * Create a new conversation
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title?: string) => aiService.createConversation(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.conversationList() });
    },
  });
}

/**
 * Delete a conversation
 */
export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiService.deleteConversation(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: aiKeys.conversationDetail(id) });
      queryClient.invalidateQueries({ queryKey: aiKeys.conversationList() });
    },
  });
}

/**
 * Update conversation title
 */
export function useUpdateConversationTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      aiService.updateConversationTitle(id, title),
    onSuccess: (updated) => {
      queryClient.setQueryData(aiKeys.conversationDetail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: aiKeys.conversationList() });
    },
  });
}

/**
 * Generate a business plan
 */
export function useGenerateBusinessPlan() {
  return useMutation({
    mutationFn: (params: {
      industry: string;
      targetMarket: string;
      businessModel: string;
    }) => aiService.generateBusinessPlan(params),
  });
}

/**
 * Analyze market trends
 */
export function useAnalyzeMarketTrends() {
  return useMutation({
    mutationFn: (params: { industry: string; keywords: string[] }) =>
      aiService.analyzeMarketTrends(params),
  });
}

/**
 * Get content ideas
 */
export function useGetContentIdeas() {
  return useMutation({
    mutationFn: (repositoryId: string) => aiService.getContentIdeas(repositoryId),
  });
}

/**
 * Summarize content
 */
export function useSummarizeContent() {
  return useMutation({
    mutationFn: (content: string) => aiService.summarizeContent(content),
  });
}

/**
 * Find collaborators based on project needs
 */
export function useFindCollaborators() {
  return useMutation({
    mutationFn: (params: {
      projectDescription: string;
      requiredSkills: string[];
    }) => aiService.findCollaborators(params),
  });
}
