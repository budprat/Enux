// ============================================================================
// ENUX - Community Discovery Component
// ============================================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCommunityMembers,
  useTrendingFrameworks,
  useCollaborationOpportunities,
  useFollowUser,
  useRespondToOpportunity
} from "@/hooks/queries";
import { useToast } from "@/hooks/use-toast";
import { generateRoute } from "@/lib/constants";
import {
  Search,
  Filter,
  Users,
  Star,
  TrendingUp,
  MapPin,
  Briefcase,
  Heart,
  MessageCircle,
  UserPlus,
  Eye,
  GitFork,
  Zap,
  AlertCircle
} from "lucide-react";

// Loading skeletons
function MemberSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="flex items-start space-x-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FrameworkSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CommunityDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch data
  const { data: membersData, isLoading: isLoadingMembers, isError: isErrorMembers } = useCommunityMembers();
  const { data: frameworksData, isLoading: isLoadingFrameworks } = useTrendingFrameworks(6);
  const { data: opportunitiesData, isLoading: isLoadingOpportunities } = useCollaborationOpportunities();

  // Mutations
  const followMutation = useFollowUser();
  const respondMutation = useRespondToOpportunity();

  const communityMembers = membersData?.data ?? [];
  const trendingFrameworks = frameworksData?.data ?? [];
  const collaborationOpportunities = opportunitiesData?.data ?? [];

  const handleFollow = async (userId: string) => {
    try {
      await followMutation.mutateAsync(userId);
      toast({ title: "Following user" });
    } catch {
      toast({ title: "Failed to follow user", variant: "destructive" });
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(generateRoute.userProfile(userId));
  };

  const handleRespondToOpportunity = async (opportunityId: string) => {
    try {
      await respondMutation.mutateAsync({ id: opportunityId, message: "I'm interested in this opportunity!" });
      toast({ title: "Response sent" });
    } catch {
      toast({ title: "Failed to respond", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search community members, frameworks, or opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {isLoadingMembers ? (
            <MemberSkeleton />
          ) : isErrorMembers ? (
            <Card className="border-destructive/50">
              <CardContent className="p-6 flex items-center space-x-4">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-muted-foreground">Failed to load community members.</p>
              </CardContent>
            </Card>
          ) : communityMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No members found</h3>
              <p className="text-muted-foreground">Be the first to join the community!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communityMembers.map((member) => (
                <Card key={member.id} className="group hover:shadow-professional transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {member.displayName?.split(" ").map((n) => n[0]).join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-background"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{member.displayName}</h3>
                        <p className="text-xs text-muted-foreground">{member.bio?.slice(0, 50) || "Community member"}</p>
                        {member.location && (
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{member.location}</span>
                          </div>
                        )}
                      </div>

                      {member.matchScore && (
                        <Badge variant="secondary" className="text-xs">
                          {member.matchScore}% match
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {member.expertise && member.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>{member.reputation ?? 0}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{member.repositoriesCount ?? 0}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{member.followersCount ?? 0}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleFollow(member.id)}
                        disabled={followMutation.isPending}
                      >
                        <UserPlus className="h-3 w-3 mr-1" />
                        Connect
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(member.id)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-6">
          {isLoadingFrameworks ? (
            <FrameworkSkeleton />
          ) : trendingFrameworks.length === 0 ? (
            <div className="text-center py-12">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No frameworks yet</h3>
              <p className="text-muted-foreground">Check back later for trending frameworks</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {trendingFrameworks.map((framework) => (
                <Card key={framework.id} className="group hover:shadow-professional transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{framework.name}</CardTitle>
                        <CardDescription>{framework.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{framework.category}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>{framework.stars ?? 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitFork className="h-4 w-4" />
                        <span>{framework.forks ?? 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{framework.contributorsCount ?? 0}</span>
                      </div>
                    </div>

                    {framework.growthPercent && (
                      <div className="flex items-center justify-between">
                        <Badge variant="default" className="bg-success">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +{framework.growthPercent}% this month
                        </Badge>
                        <span className="text-xs text-muted-foreground">by {framework.author?.displayName}</span>
                      </div>
                    )}

                    {framework.tags && framework.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {framework.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Button variant="default" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View Framework
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <GitFork className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collaborate" className="space-y-6">
          {isLoadingOpportunities ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-1">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : collaborationOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No opportunities yet</h3>
              <p className="text-muted-foreground">Be the first to post a collaboration opportunity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {collaborationOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="group hover:shadow-professional transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                          <Badge variant={opportunity.type === "seeking" ? "default" : "secondary"}>
                            {opportunity.type === "seeking" ? "Seeking" : "Offering"}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2">{opportunity.description}</CardDescription>
                      </div>
                      {opportunity.matchScore && (
                        <Badge variant="outline" className="text-xs">
                          {opportunity.matchScore}% match
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {opportunity.skills && opportunity.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {opportunity.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Posted by {opportunity.author?.displayName}</span>
                      <span>{opportunity.createdAt && new Date(opportunity.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {opportunity.responsesCount ?? 0} responses
                      </span>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleRespondToOpportunity(opportunity.id)}
                          disabled={respondMutation.isPending}
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Respond
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="h-3 w-3" />
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
