import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  TrendingUp,
  Zap,
  BookOpen,
  Target,
  Brain,
  Lightbulb,
  FileText,
  Award
} from "lucide-react";

export function Discovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const trendingFrameworks = [
    {
      id: "1",
      title: "Lean Startup Canvas",
      description: "Validated learning approach for startup development with systematic hypothesis testing",
      category: "Business Model",
      stars: 1234,
      forks: 456,
      contributors: 89,
      tags: ["startup", "validation", "lean", "canvas"],
      difficulty: "Beginner",
      timeToImplement: "1-2 weeks"
    },
    {
      id: "2",
      title: "Growth Hacking Playbook",
      description: "Data-driven marketing strategies and growth experiments for rapid scaling",
      category: "Marketing",
      stars: 987,
      forks: 234,
      contributors: 67,
      tags: ["growth", "marketing", "analytics", "experimentation"],
      difficulty: "Intermediate",
      timeToImplement: "2-4 weeks"
    },
    {
      id: "3",
      title: "SaaS Metrics Dashboard",
      description: "Comprehensive framework for tracking and optimizing SaaS business metrics",
      category: "Analytics",
      stars: 856,
      forks: 178,
      contributors: 45,
      tags: ["saas", "metrics", "kpi", "dashboard"],
      difficulty: "Advanced",
      timeToImplement: "4-6 weeks"
    }
  ];

  const categories = [
    { name: "Business Models", count: 156, icon: Target },
    { name: "Marketing", count: 243, icon: TrendingUp },
    { name: "Finance", count: 89, icon: FileText },
    { name: "Operations", count: 167, icon: Zap },
    { name: "Strategy", count: 134, icon: Brain },
    { name: "Innovation", count: 78, icon: Lightbulb }
  ];

  const aiRecommendations = [
    {
      title: "Customer Development Framework",
      reason: "Based on your recent activity in startup validation",
      matchScore: 95,
      type: "Highly Recommended"
    },
    {
      title: "Product-Market Fit Metrics",
      reason: "Complements your SaaS analytics work",
      matchScore: 87,
      type: "Good Match"
    },
    {
      title: "Pricing Strategy Templates",
      reason: "Popular among users with similar projects",
      matchScore: 72,
      type: "Community Favorite"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Discover Frameworks</h1>
            <p className="text-muted-foreground">Find proven business frameworks and templates from the community</p>
          </div>
          <Button variant="premium">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Search
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search frameworks, templates, and strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="ai-recommended">AI Recommended</TabsTrigger>
          <TabsTrigger value="recently-added">Recently Added</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {trendingFrameworks.map((framework) => (
              <Card key={framework.id} className="hover:shadow-elegant transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{framework.title}</h3>
                        <Badge variant="secondary">{framework.category}</Badge>
                        <Badge variant={framework.difficulty === "Beginner" ? "default" : framework.difficulty === "Intermediate" ? "secondary" : "destructive"}>
                          {framework.difficulty}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{framework.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4" />
                          <span>{framework.stars.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{framework.contributors} contributors</span>
                        </div>
                        <div>
                          <span>⏱️ {framework.timeToImplement}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {framework.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-6">
                      <Button variant="premium" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="h-4 w-4 mr-2" />
                        Star
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="hover:shadow-elegant transition-all duration-200 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-primary rounded-lg">
                      <category.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.count} frameworks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-recommended" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI-Powered Recommendations
              </CardTitle>
              <CardDescription>
                Personalized framework suggestions based on your projects and goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium">{recommendation.title}</h4>
                      <Badge variant="default">{recommendation.matchScore}% match</Badge>
                      <Badge variant="outline">{recommendation.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="premium" size="sm">Use</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recently-added" className="space-y-6">
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">New Frameworks Coming Soon</h3>
            <p className="text-muted-foreground">
              Fresh frameworks and templates are added weekly by our community
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}