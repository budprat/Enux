import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
  Loader2
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

export function AIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your AI assistant for entrepreneurship collaboration. I can help you with business framework recommendations, content optimization, and finding the right collaborators for your projects. What would you like to work on today?",
      timestamp: "Just now",
      suggestions: [
        "Analyze my SaaS framework",
        "Find collaboration opportunities",
        "Optimize my business model",
        "Suggest relevant templates"
      ]
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const { toast } = useToast();

  const recommendations: AIRecommendation[] = [
    {
      id: "1",
      type: "template",
      title: "Market Research Framework",
      description: "Based on your SaaS project, I recommend this validated market research template",
      confidence: 94,
      action: "View Template"
    },
    {
      id: "2",
      type: "collaboration",
      title: "Financial Planning Expert",
      description: "Connect with Sarah Chen who has expertise in startup financial modeling",
      confidence: 87,
      action: "Connect"
    },
    {
      id: "3",
      type: "optimization",
      title: "Content Structure",
      description: "Your business plan could benefit from restructuring the executive summary",
      confidence: 78,
      action: "Optimize"
    },
    {
      id: "4",
      type: "insight",
      title: "Trending Topic",
      description: "AI-powered customer service is trending in your industry segment",
      confidence: 82,
      action: "Explore"
    }
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Send to webhook if configured
      if (webhookUrl) {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputValue,
            context: "ai_assistant",
            user_id: "demo_user",
            timestamp: new Date().toISOString()
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const assistantMessage: AIMessage = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: data.response || "I've processed your request. Here are my recommendations based on your query.",
            timestamp: "Just now",
            suggestions: data.suggestions || []
          };
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          throw new Error("Webhook request failed");
        }
      } else {
        // Mock response for demo
        setTimeout(() => {
          const assistantMessage: AIMessage = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: "I understand you're looking for guidance on your entrepreneurship project. Based on your query, I recommend exploring our business framework templates and connecting with relevant collaborators in your industry. Would you like me to provide specific recommendations?",
            timestamp: "Just now",
            suggestions: [
              "Show me relevant templates",
              "Find industry experts",
              "Analyze market trends",
              "Review my business model"
            ]
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
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
                      {message.timestamp}
                    </span>
                    
                    {message.suggestions && (
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
            </div>
            
            {/* Input */}
            <div className="flex items-center space-x-2">
              <Textarea
                placeholder="Ask me about business frameworks, templates, or collaboration opportunities..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 min-h-[40px] resize-none"
                onKeyPress={(e) => {
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
          <CardContent className="space-y-3">
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
            <Button variant="professional" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Generate Business Plan
            </Button>
            <Button variant="professional" size="sm" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Find Collaborators
            </Button>
            <Button variant="professional" size="sm" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analyze Market Trends
            </Button>
            <Button variant="professional" size="sm" className="w-full justify-start">
              <Lightbulb className="h-4 w-4 mr-2" />
              Get Content Ideas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}