// ============================================================================
// ENUX - AI Assistant Component
// ============================================================================

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  useAIRecommendations,
  useSendWebhookMessage,
  useGenerateBusinessPlan,
  useFindCollaborators,
  useAnalyzeMarketTrends,
  useGetContentIdeas
} from "@/hooks/queries";
import {
  MessageCircle,
  Send,
  Zap,
  Lightbulb,
  FileText,
  TrendingUp,
  Users,
  Target,
  Settings,
  Loader2,
  AlertCircle
} from "lucide-react";

interface AIMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface AIRecommendation {
  id: string;
  type: "template" | "optimization" | "collaboration" | "insight";
  title: string;
  description: string;
  confidence: number;
  action: string;
}

// Recommendation skeleton
function RecommendationSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 rounded-lg border bg-gradient-secondary">
          <div className="flex items-start space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your AI assistant for entrepreneurship collaboration. I can help you with business framework recommendations, content optimization, and finding the right collaborators for your projects. What would you like to work on today?",
      timestamp: new Date().toISOString(),
      suggestions: [
        "Analyze my SaaS framework",
        "Find collaboration opportunities",
        "Optimize my business model",
        "Suggest relevant templates"
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [webhookUrl, setWebhookUrl] = useState(() => {
    // Try to load webhook URL from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('enux_webhook_url') || '';
    }
    return '';
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch AI recommendations
  const { data: recommendationsData, isLoading: isLoadingRecommendations, isError: isErrorRecommendations } = useAIRecommendations();

  // Mutations
  const webhookMutation = useSendWebhookMessage();
  const businessPlanMutation = useGenerateBusinessPlan();
  const findCollaboratorsMutation = useFindCollaborators();
  const analyzeMarketMutation = useAnalyzeMarketTrends();
  const contentIdeasMutation = useGetContentIdeas();

  const recommendations: AIRecommendation[] = recommendationsData?.data ?? [];

  // Save webhook URL to localStorage when it changes
  useEffect(() => {
    if (webhookUrl) {
      localStorage.setItem('enux_webhook_url', webhookUrl);
    }
  }, [webhookUrl]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputValue;
    setInputValue("");

    try {
      if (webhookUrl) {
        const response = await webhookMutation.mutateAsync({
          message: messageContent,
          webhookUrl,
          context: "ai_assistant"
        });

        const assistantMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: response.response || "I've processed your request. Here are my recommendations based on your query.",
          timestamp: new Date().toISOString(),
          suggestions: response.suggestions || []
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Mock response for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        const assistantMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "I understand you're looking for guidance on your entrepreneurship project. Based on your query, I recommend exploring our business framework templates and connecting with relevant collaborators in your industry. Would you like me to provide specific recommendations?",
          timestamp: new Date().toISOString(),
          suggestions: [
            "Show me relevant templates",
            "Find industry experts",
            "Analyze market trends",
            "Review my business model"
          ]
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleQuickAction = async (action: string) => {
    let response: string = '';

    try {
      switch (action) {
        case 'business-plan':
          toast({ title: "Generating business plan..." });
          await businessPlanMutation.mutateAsync({
            industry: 'Technology',
            targetMarket: 'B2B SaaS',
            businessModel: 'Subscription'
          });
          response = "I've started generating your business plan. Check the recommendations panel for insights.";
          break;

        case 'find-collaborators':
          toast({ title: "Finding collaborators..." });
          await findCollaboratorsMutation.mutateAsync({
            projectDescription: 'Entrepreneurship platform development',
            requiredSkills: ['Business Development', 'Marketing', 'Finance']
          });
          response = "I've found some potential collaborators for your project. Check the recommendations panel.";
          break;

        case 'market-trends':
          toast({ title: "Analyzing market trends..." });
          await analyzeMarketMutation.mutateAsync({
            industry: 'SaaS',
            keywords: ['entrepreneurship', 'collaboration', 'business frameworks']
          });
          response = "Market analysis complete. Check the recommendations panel for trend insights.";
          break;

        case 'content-ideas':
          toast({ title: "Generating content ideas..." });
          await contentIdeasMutation.mutateAsync('demo-repository-id');
          response = "I've generated some content ideas for you. Check the recommendations panel.";
          break;

        default:
          response = "Action not recognized.";
      }

      const assistantMessage: AIMessage = {
        id: Date.now().toString(),
        type: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete action. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRecommendationIcon = (type: AIRecommendation["type"]) => {
    switch (type) {
      case "template":
        return <FileText className="h-4 w-4" />;
      case "collaboration":
        return <Users className="h-4 w-4" />;
      case "optimization":
        return <TrendingUp className="h-4 w-4" />;
      case "insight":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const isLoading = webhookMutation.isPending ||
    businessPlanMutation.isPending ||
    findCollaboratorsMutation.isPending ||
    analyzeMarketMutation.isPending ||
    contentIdeasMutation.isPending;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              AI Assistant Chat
            </CardTitle>
            <CardDescription>
              Get intelligent recommendations for your entrepreneurship projects
            </CardDescription>

            {/* Webhook Configuration */}
            {import.meta.env.VITE_ENABLE_WEBHOOK_CONFIG === 'true' && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Webhook Configuration</span>
                </div>
                <Input
                  placeholder="Enter your n8n webhook URL here..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="mt-2 text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Configure your n8n webhook to enable AI-powered responses
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {formatTimeAgo(message.timestamp)}
                    </span>

                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium">Suggested actions:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center space-x-2">
              <Textarea
                placeholder="Ask me about business frameworks, templates, or collaboration opportunities..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 min-h-[40px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="h-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRecommendations ? (
              <RecommendationSkeleton />
            ) : isErrorRecommendations ? (
              <div className="flex items-center space-x-4 p-4 bg-destructive/5 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-muted-foreground">Failed to load recommendations.</p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
                <p className="text-muted-foreground text-sm">
                  Start a conversation to get personalized recommendations
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="p-3 rounded-lg border bg-gradient-secondary">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                        {getRecommendationIcon(rec.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-sm">{rec.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {rec.confidence}%
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                          {rec.description}
                        </p>

                        <Button variant="ghost" size="sm" className="mt-2 h-6 text-xs">
                          {rec.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="professional"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleQuickAction('business-plan')}
              disabled={businessPlanMutation.isPending}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Business Plan
            </Button>
            <Button
              variant="professional"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleQuickAction('find-collaborators')}
              disabled={findCollaboratorsMutation.isPending}
            >
              <Users className="h-4 w-4 mr-2" />
              Find Collaborators
            </Button>
            <Button
              variant="professional"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleQuickAction('market-trends')}
              disabled={analyzeMarketMutation.isPending}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Analyze Market Trends
            </Button>
            <Button
              variant="professional"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleQuickAction('content-ideas')}
              disabled={contentIdeasMutation.isPending}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Get Content Ideas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
