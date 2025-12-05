// ============================================================================
// ENUX - AI Assistant Service
// ============================================================================

import { apiClient, buildQueryString } from './api';
import type {
  AIMessage,
  AIConversation,
  AIAssistantRecommendation,
  SendAIMessageInput,
  AIResponse,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

// N8n Webhook URL from environment
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

// ----------------------------------------------------------------------------
// AI Assistant Service
// ----------------------------------------------------------------------------

export const aiService = {
  // --------------------------------------------------------------------------
  // Conversations
  // --------------------------------------------------------------------------

  /**
   * Get all conversations for current user
   */
  async getConversations(page?: number, limit?: number): Promise<PaginatedResponse<AIConversation>> {
    const query = buildQueryString({ page, limit });
    const response = await apiClient.get<PaginatedResponse<AIConversation>>(`/ai/conversations${query}`);
    return response;
  },

  /**
   * Get a single conversation by ID
   */
  async getConversation(id: string): Promise<AIConversation> {
    const response = await apiClient.get<ApiResponse<AIConversation>>(`/ai/conversations/${id}`);
    return response.data;
  },

  /**
   * Create a new conversation
   */
  async createConversation(title?: string): Promise<AIConversation> {
    const response = await apiClient.post<ApiResponse<AIConversation>>('/ai/conversations', { title });
    return response.data;
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(id: string): Promise<void> {
    await apiClient.delete(`/ai/conversations/${id}`);
  },

  /**
   * Update conversation title
   */
  async updateConversationTitle(id: string, title: string): Promise<AIConversation> {
    const response = await apiClient.patch<ApiResponse<AIConversation>>(
      `/ai/conversations/${id}`,
      { title }
    );
    return response.data;
  },

  // --------------------------------------------------------------------------
  // Messages
  // --------------------------------------------------------------------------

  /**
   * Send a message to the AI assistant
   */
  async sendMessage(input: SendAIMessageInput): Promise<AIResponse> {
    const response = await apiClient.post<ApiResponse<AIResponse>>('/ai/chat', input);
    return response.data;
  },

  /**
   * Send a message via N8n webhook (alternative integration)
   */
  async sendMessageViaWebhook(
    message: string,
    webhookUrl?: string,
    context?: string
  ): Promise<{ response: string; suggestions?: string[] }> {
    const url = webhookUrl || N8N_WEBHOOK_URL;

    if (!url) {
      throw new Error('No webhook URL configured');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context: context || 'ai_assistant',
        user_id: 'current_user', // Will be replaced with actual user ID
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Webhook request failed');
    }

    return response.json();
  },

  // --------------------------------------------------------------------------
  // Recommendations
  // --------------------------------------------------------------------------

  /**
   * Get AI-powered recommendations
   */
  async getRecommendations(): Promise<AIAssistantRecommendation[]> {
    const response = await apiClient.get<ApiResponse<AIAssistantRecommendation[]>>('/ai/recommendations');
    return response.data;
  },

  /**
   * Get personalized framework recommendations
   */
  async getFrameworkRecommendations(limit?: number): Promise<AIAssistantRecommendation[]> {
    const query = limit ? buildQueryString({ limit }) : '';
    const response = await apiClient.get<ApiResponse<AIAssistantRecommendation[]>>(
      `/ai/recommendations/frameworks${query}`
    );
    return response.data;
  },

  /**
   * Get collaborator recommendations
   */
  async getCollaboratorRecommendations(limit?: number): Promise<AIAssistantRecommendation[]> {
    const query = limit ? buildQueryString({ limit }) : '';
    const response = await apiClient.get<ApiResponse<AIAssistantRecommendation[]>>(
      `/ai/recommendations/collaborators${query}`
    );
    return response.data;
  },

  /**
   * Get content optimization suggestions
   */
  async getContentOptimizations(repositoryId: string): Promise<AIAssistantRecommendation[]> {
    const response = await apiClient.get<ApiResponse<AIAssistantRecommendation[]>>(
      `/ai/recommendations/content/${repositoryId}`
    );
    return response.data;
  },

  // --------------------------------------------------------------------------
  // AI Actions
  // --------------------------------------------------------------------------

  /**
   * Generate a business plan outline
   */
  async generateBusinessPlan(params: {
    industry: string;
    targetMarket: string;
    businessModel: string;
  }): Promise<{ content: string; suggestions: string[] }> {
    const response = await apiClient.post<ApiResponse<{ content: string; suggestions: string[] }>>(
      '/ai/generate/business-plan',
      params
    );
    return response.data;
  },

  /**
   * Analyze market trends
   */
  async analyzeMarketTrends(params: {
    industry: string;
    keywords: string[];
  }): Promise<{ analysis: string; trends: { topic: string; growth: string }[] }> {
    const response = await apiClient.post<ApiResponse<{ analysis: string; trends: { topic: string; growth: string }[] }>>(
      '/ai/analyze/market-trends',
      params
    );
    return response.data;
  },

  /**
   * Get content ideas for a repository
   */
  async getContentIdeas(repositoryId: string): Promise<{ ideas: string[]; rationale: string }> {
    const response = await apiClient.get<ApiResponse<{ ideas: string[]; rationale: string }>>(
      `/ai/content-ideas/${repositoryId}`
    );
    return response.data;
  },

  /**
   * Summarize repository content
   */
  async summarizeContent(content: string): Promise<{ summary: string; keyPoints: string[] }> {
    const response = await apiClient.post<ApiResponse<{ summary: string; keyPoints: string[] }>>(
      '/ai/summarize',
      { content }
    );
    return response.data;
  },

  /**
   * Find matching collaborators based on project needs
   */
  async findCollaborators(params: {
    projectDescription: string;
    requiredSkills: string[];
  }): Promise<{ collaborators: unknown[]; reasoning: string }> {
    const response = await apiClient.post<ApiResponse<{ collaborators: unknown[]; reasoning: string }>>(
      '/ai/find-collaborators',
      params
    );
    return response.data;
  },
};
