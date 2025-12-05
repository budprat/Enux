// ============================================================================
// ENUX - Dashboard Component
// ============================================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { RepositoryCard } from "./RepositoryCard";
import { ActivityFeed } from "./ActivityFeed";
import { AIAssistant } from "./AIAssistant";
import { CommunityDiscovery } from "./CommunityDiscovery";
import { Discovery } from "./Discovery";
import { Collaboration } from "./Collaboration";
import { PullRequests } from "./PullRequests";
import { useRepositories, useDashboardStats } from "@/hooks/queries";
import { ROUTES } from "@/lib/constants";
import {
  GitBranch,
  Star,
  Users,
  Activity,
  TrendingUp,
  Zap,
  Plus,
  Search,
  Filter,
  AlertCircle
} from "lucide-react";

// Stats card skeleton
function StatsSkeleton() {
  return (
    <Card className="bg-gradient-secondary border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-12" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// Repository list skeleton
function RepositoryListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <div className="flex space-x-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch dashboard stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isStatsError
  } = useDashboardStats();

  // Fetch repositories
  const {
    data: repositoriesData,
    isLoading: isLoadingRepositories,
    isError: isRepositoriesError
  } = useRepositories({ limit: 10, sortBy: 'updatedAt', sortOrder: 'desc' });

  const repositories = repositoriesData?.data ?? [];

  const handleNewRepository = () => {
    navigate(ROUTES.REPOSITORY_CREATE);
  };

  const handleExploreTemplates = () => {
    navigate(ROUTES.DISCOVERY);
  };

  const handleFindCollaborators = () => {
    navigate(ROUTES.COMMUNITY);
  };

  const handleViewAnalytics = () => {
    // Analytics page would go here
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {isLoadingStats ? (
          <>
            <StatsSkeleton />
            <StatsSkeleton />
            <StatsSkeleton />
            <StatsSkeleton />
          </>
        ) : isStatsError ? (
          <Card className="md:col-span-4 border-destructive/50">
            <CardContent className="p-6 flex items-center space-x-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-muted-foreground">Failed to load dashboard stats. Please try again later.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-gradient-secondary border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Repositories</p>
                    <p className="text-2xl font-bold">{stats?.repositories ?? 0}</p>
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
                    <p className="text-2xl font-bold">{stats?.stars ?? 0}</p>
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
                    <p className="text-2xl font-bold">{stats?.collaborators ?? 0}</p>
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
                    <p className="text-2xl font-bold">{stats?.activeProjects ?? 0}</p>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="discovery">Discovery</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
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
            <Button variant="premium" size="sm" onClick={handleNewRepository}>
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
                  {isLoadingRepositories ? (
                    <RepositoryListSkeleton />
                  ) : isRepositoriesError ? (
                    <div className="flex items-center space-x-4 p-4 bg-destructive/5 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <p className="text-sm text-muted-foreground">Failed to load repositories.</p>
                    </div>
                  ) : repositories.length === 0 ? (
                    <div className="text-center py-8">
                      <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No repositories yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first repository to get started
                      </p>
                      <Button onClick={handleNewRepository}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Repository
                      </Button>
                    </div>
                  ) : (
                    repositories.slice(0, 3).map((repo) => (
                      <RepositoryCard key={repo.id} repository={repo} />
                    ))
                  )}
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
                    <Button
                      variant="professional"
                      className="h-20 flex-col"
                      onClick={handleNewRepository}
                    >
                      <Plus className="h-6 w-6 mb-2" />
                      Create Repository
                    </Button>
                    <Button
                      variant="professional"
                      className="h-20 flex-col"
                      onClick={handleExploreTemplates}
                    >
                      <Search className="h-6 w-6 mb-2" />
                      Explore Templates
                    </Button>
                    <Button
                      variant="professional"
                      className="h-20 flex-col"
                      onClick={handleFindCollaborators}
                    >
                      <Users className="h-6 w-6 mb-2" />
                      Find Collaborators
                    </Button>
                    <Button
                      variant="professional"
                      className="h-20 flex-col"
                      onClick={handleViewAnalytics}
                    >
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
          {isLoadingRepositories ? (
            <RepositoryListSkeleton />
          ) : isRepositoriesError ? (
            <Card className="border-destructive/50">
              <CardContent className="p-6 flex items-center space-x-4">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-muted-foreground">Failed to load repositories. Please try again later.</p>
              </CardContent>
            </Card>
          ) : repositories.length === 0 ? (
            <div className="text-center py-12">
              <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No repositories yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first repository to get started
              </p>
              <Button onClick={handleNewRepository}>
                <Plus className="h-4 w-4 mr-2" />
                Create Repository
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {repositories.map((repo) => (
                <RepositoryCard key={repo.id} repository={repo} detailed={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="discovery" className="space-y-6">
          <Discovery />
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <Collaboration />
        </TabsContent>

        <TabsContent value="pull-requests" className="space-y-6">
          <PullRequests />
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
