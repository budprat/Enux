import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RepositoryCard } from "./RepositoryCard";
import { ActivityFeed } from "./ActivityFeed";
import { AIAssistant } from "./AIAssistant";
import { CommunityDiscovery } from "./CommunityDiscovery";
import { 
  GitBranch, 
  Star, 
  Users, 
  Activity,
  TrendingUp,
  Zap,
  Plus,
  Search,
  Filter
} from "lucide-react";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app would come from API
  const stats = {
    repositories: 12,
    stars: 89,
    collaborators: 24,
    activeProjects: 7
  };

  const repositories = [
    {
      id: "1",
      name: "SaaS-Startup-Framework",
      description: "Complete framework for launching SaaS products with validated business models",
      stars: 234,
      forks: 45,
      language: "Business Framework",
      lastUpdated: "2 hours ago",
      status: "active" as const,
      collaborators: 8,
      visibility: "public" as const
    },
    {
      id: "2",
      name: "Marketing-Automation-Templates",
      description: "Ready-to-use marketing templates and automation workflows",
      stars: 156,
      forks: 32,
      language: "Marketing",
      lastUpdated: "1 day ago",
      status: "review" as const,
      collaborators: 12,
      visibility: "private" as const
    },
    {
      id: "3",
      name: "Financial-Planning-Tools",
      description: "Comprehensive financial planning and analysis tools for startups",
      stars: 89,
      forks: 23,
      language: "Finance",
      lastUpdated: "3 days ago",
      status: "pending" as const,
      collaborators: 5,
      visibility: "public" as const
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-secondary border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Repositories</p>
                <p className="text-2xl font-bold">{stats.repositories}</p>
              </div>
              <GitBranch className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-secondary border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stars</p>
                <p className="text-2xl font-bold">{stats.stars}</p>
              </div>
              <Star className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-secondary border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Collaborators</p>
                <p className="text-2xl font-bold">{stats.collaborators}</p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-secondary border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="premium" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Repository
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Repositories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GitBranch className="h-5 w-5 mr-2" />
                    Recent Repositories
                  </CardTitle>
                  <CardDescription>
                    Your most recently updated repositories
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {repositories.slice(0, 3).map((repo) => (
                    <RepositoryCard key={repo.id} repository={repo} />
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="professional" className="h-20 flex-col">
                      <Plus className="h-6 w-6 mb-2" />
                      Create Repository
                    </Button>
                    <Button variant="professional" className="h-20 flex-col">
                      <Search className="h-6 w-6 mb-2" />
                      Explore Templates
                    </Button>
                    <Button variant="professional" className="h-20 flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      Find Collaborators
                    </Button>
                    <Button variant="professional" className="h-20 flex-col">
                      <TrendingUp className="h-6 w-6 mb-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Activity Feed */}
              <ActivityFeed />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="repositories" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {repositories.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} detailed={true} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <CommunityDiscovery />
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-6">
          <AIAssistant />
        </TabsContent>
      </Tabs>
    </div>
  );
}