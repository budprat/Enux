import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Users, 
  Star, 
  TrendingUp,
  Globe,
  MapPin,
  Briefcase,
  Heart,
  MessageCircle,
  UserPlus,
  Eye,
  GitFork,
  Zap
} from "lucide-react";

interface CommunityMember {
  id: string;
  name: string;
  title: string;
  location: string;
  expertise: string[];
  reputation: number;
  repositories: number;
  followers: number;
  matchScore: number;
  isOnline: boolean;
  recentActivity: string;
}

interface TrendingFramework {
  id: string;
  name: string;
  category: string;
  description: string;
  stars: number;
  forks: number;
  contributors: number;
  growth: string;
  tags: string[];
  author: string;
}

interface CollaborationOpportunity {
  id: string;
  title: string;
  type: "seeking" | "offering";
  description: string;
  skills: string[];
  author: string;
  posted: string;
  responses: number;
  matchScore: number;
}

export function CommunityDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discover");

  const communityMembers: CommunityMember[] = [
    {
      id: "1",
      name: "Sarah Chen",
      title: "Startup Financial Advisor",
      location: "San Francisco, CA",
      expertise: ["Financial Modeling", "SaaS", "Fundraising"],
      reputation: 4.9,
      repositories: 23,
      followers: 1247,
      matchScore: 94,
      isOnline: true,
      recentActivity: "Updated SaaS-Financial-Model 2 hours ago"
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      title: "Marketing Strategy Consultant",
      location: "New York, NY",
      expertise: ["Digital Marketing", "Growth Hacking", "Brand Strategy"],
      reputation: 4.7,
      repositories: 18,
      followers: 892,
      matchScore: 87,
      isOnline: false,
      recentActivity: "Shared Marketing-Automation-Framework 1 day ago"
    },
    {
      id: "3",
      name: "Emily Johnson",
      title: "Product Management Expert",
      location: "Austin, TX",
      expertise: ["Product Strategy", "UX Design", "Agile"],
      reputation: 4.8,
      repositories: 31,
      followers: 1456,
      matchScore: 91,
      isOnline: true,
      recentActivity: "Contributed to Product-Launch-Toolkit 4 hours ago"
    }
  ];

  const trendingFrameworks: TrendingFramework[] = [
    {
      id: "1",
      name: "AI-Powered Business Model Canvas",
      category: "Strategy",
      description: "Modern business model framework enhanced with AI insights and market analysis",
      stars: 2341,
      forks: 456,
      contributors: 78,
      growth: "+234% this month",
      tags: ["AI", "Business Model", "Strategy", "Canvas"],
      author: "AI Strategy Labs"
    },
    {
      id: "2",
      name: "Sustainable Startup Framework",
      category: "Sustainability",
      description: "Complete framework for building environmentally conscious startups",
      stars: 1876,
      forks: 234,
      contributors: 45,
      growth: "+156% this month",
      tags: ["Sustainability", "ESG", "Green Business", "Impact"],
      author: "GreenVentures"
    },
    {
      id: "3",
      name: "Remote Team Building Toolkit",
      category: "Operations",
      description: "Comprehensive toolkit for building and managing remote startup teams",
      stars: 3245,
      forks: 678,
      contributors: 124,
      growth: "+89% this month",
      tags: ["Remote Work", "Team Building", "Operations", "Culture"],
      author: "RemoteFirst Co"
    }
  ];

  const collaborationOpportunities: CollaborationOpportunity[] = [
    {
      id: "1",
      title: "Seeking: Technical Co-founder for FinTech Startup",
      type: "seeking",
      description: "Looking for a technical co-founder with blockchain experience for a revolutionary DeFi platform",
      skills: ["Blockchain", "DeFi", "Smart Contracts", "React", "Node.js"],
      author: "Jennifer Walsh",
      posted: "2 days ago",
      responses: 12,
      matchScore: 85
    },
    {
      id: "2",
      title: "Offering: Marketing Strategy Consultation",
      type: "offering",
      description: "Experienced marketing strategist offering free consultation for early-stage startups",
      skills: ["Growth Marketing", "SEO", "Content Strategy", "Social Media"],
      author: "David Kim",
      posted: "5 days ago",
      responses: 8,
      matchScore: 78
    },
    {
      id: "3",
      title: "Seeking: UX/UI Designer for Health Tech App",
      type: "seeking",
      description: "Need a talented designer to create intuitive interfaces for mental health application",
      skills: ["UI/UX Design", "Figma", "User Research", "Health Tech"],
      author: "Alex Thompson",
      posted: "1 week ago",
      responses: 15,
      matchScore: 92
    }
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityMembers.map((member) => (
              <Card key={member.id} className="group hover:shadow-professional transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      {member.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{member.name}</h3>
                      <p className="text-xs text-muted-foreground">{member.title}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{member.location}</span>
                      </div>
                    </div>
                    
                    <Badge variant="secondary" className="text-xs">
                      {member.matchScore}% match
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>{member.reputation}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Briefcase className="h-3 w-3" />
                      <span>{member.repositories}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{member.followers}</span>
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{member.recentActivity}</p>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="default" size="sm" className="flex-1">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Connect
                    </Button>
                    <Button variant="outline" size="sm">
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
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-6">
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
                      <span>{framework.stars}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="h-4 w-4" />
                      <span>{framework.forks}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{framework.contributors}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="bg-success">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {framework.growth}
                    </Badge>
                    <span className="text-xs text-muted-foreground">by {framework.author}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {framework.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
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
        </TabsContent>

        <TabsContent value="collaborate" className="space-y-6">
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
                    <Badge variant="outline" className="text-xs">
                      {opportunity.matchScore}% match
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {opportunity.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Posted by {opportunity.author}</span>
                    <span>{opportunity.posted}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {opportunity.responses} responses
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="default" size="sm">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}