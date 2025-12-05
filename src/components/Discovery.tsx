// ============================================================================
// ENUX - Discovery Component
// ============================================================================

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useTrendingFrameworks,
  useFrameworkCategories,
  useFrameworkRecommendations,
  useRecentFrameworks,
  useSearchFrameworks,
  useStarFramework,
  useForkFramework
} from "@/hooks/queries";
import { useToast } from "@/hooks/use-toast";
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
  Award,
  AlertCircle
} from "lucide-react";

// Loading skeleton
function FrameworkSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex space-x-4">
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

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Icon mapping for categories
const categoryIcons: Record<string, typeof Target> = {
  "Business Models": Target,
  "Marketing": TrendingUp,
  "Finance": FileText,
  "Operations": Zap,
  "Strategy": Brain,
  "Innovation": Lightbulb,
};

export function Discovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch data
  const { data: trendingData, isLoading: isLoadingTrending, isError: isErrorTrending } = useTrendingFrameworks(10);
  const { data: categoriesData, isLoading: isLoadingCategories } = useFrameworkCategories();
  const { data: recommendationsData, isLoading: isLoadingRecommendations } = useFrameworkRecommendations();
  const { data: recentData, isLoading: isLoadingRecent } = useRecentFrameworks(10);
  const { data: searchResults, isLoading: isSearching } = useSearchFrameworks(searchQuery);

  // Mutations
  const starMutation = useStarFramework();
  const forkMutation = useForkFramework();

  const trendingFrameworks = trendingData?.data ?? [];
  const categories = categoriesData ?? [];
  const recommendations = recommendationsData?.data ?? [];
  const recentFrameworks = recentData?.data ?? [];
  const searchedFrameworks = searchResults?.data ?? [];

  const handleStar = async (id: string) => {
    try {
      await starMutation.mutateAsync(id);
      toast({ title: "Framework starred!" });
    } catch {
      toast({ title: "Failed to star framework", variant: "destructive" });
    }
  };

  const handleFork = async (id: string) => {
    try {
      await forkMutation.mutateAsync(id);
      toast({ title: "Framework forked to your repositories!" });
    } catch {
      toast({ title: "Failed to fork framework", variant: "destructive" });
    }
  };

  const displayFrameworks = searchQuery.length >= 2 ? searchedFrameworks : trendingFrameworks;
  const isLoadingFrameworks = searchQuery.length >= 2 ? isSearching : isLoadingTrending;

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
          {isLoadingFrameworks ? (
            <FrameworkSkeleton />
          ) : isErrorTrending ? (
            <Card className="border-destructive/50">
              <CardContent className="p-6 flex items-center space-x-4">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-muted-foreground">Failed to load frameworks.</p>
              </CardContent>
            </Card>
          ) : displayFrameworks.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? "No frameworks found" : "No trending frameworks"}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search" : "Check back later for trending frameworks"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {displayFrameworks.map((framework) => (
                <Card key={framework.id} className="hover:shadow-elegant transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{framework.name}</h3>
                          <Badge variant="secondary">{framework.category}</Badge>
                          <Badge variant={
                            framework.difficulty === "Beginner" ? "default" :
                            framework.difficulty === "Intermediate" ? "secondary" : "destructive"
                          }>
                            {framework.difficulty}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{framework.description}</p>

                        <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4" />
                            <span>{framework.stars?.toLocaleString() ?? 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{framework.contributorsCount ?? 0} contributors</span>
                          </div>
                          {framework.timeToImplement && (
                            <div>
                              <span>⏱️ {framework.timeToImplement}</span>
                            </div>
                          )}
                        </div>

                        {framework.tags && framework.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {framework.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        <Button
                          variant="premium"
                          size="sm"
                          onClick={() => handleFork(framework.id)}
                          disabled={forkMutation.isPending}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStar(framework.id)}
                          disabled={starMutation.isPending}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Star
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          {isLoadingCategories ? (
            <CategorySkeleton />
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No categories available</h3>
              <p className="text-muted-foreground">Check back later for framework categories</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.name] || Target;
                return (
                  <Card key={category.name} className="hover:shadow-elegant transition-all duration-200 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-primary rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.count} frameworks</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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
              {isLoadingRecommendations ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
                  <p className="text-muted-foreground">
                    Start working on projects to get personalized recommendations
                  </p>
                </div>
              ) : (
                recommendations.map((recommendation) => (
                  <div key={recommendation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium">{recommendation.framework?.name}</h4>
                        <Badge variant="default">{recommendation.matchScore}% match</Badge>
                        <Badge variant="outline">{recommendation.reason}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{recommendation.framework?.description}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm">View</Button>
                      <Button
                        variant="premium"
                        size="sm"
                        onClick={() => recommendation.framework && handleFork(recommendation.framework.id)}
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recently-added" className="space-y-6">
          {isLoadingRecent ? (
            <FrameworkSkeleton />
          ) : recentFrameworks.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">New Frameworks Coming Soon</h3>
              <p className="text-muted-foreground">
                Fresh frameworks and templates are added weekly by our community
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {recentFrameworks.map((framework) => (
                <Card key={framework.id} className="hover:shadow-elegant transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{framework.name}</h3>
                          <Badge variant="secondary">{framework.category}</Badge>
                          <Badge variant="outline" className="text-xs">New</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{framework.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4" />
                            <span>{framework.stars ?? 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{framework.contributorsCount ?? 0} contributors</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-6">
                        <Button variant="premium" size="sm" onClick={() => handleFork(framework.id)}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleStar(framework.id)}>
                          <Star className="h-4 w-4 mr-2" />
                          Star
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
