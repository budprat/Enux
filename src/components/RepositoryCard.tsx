import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Star, 
  GitFork, 
  Eye, 
  Clock,
  Users,
  Lock,
  Globe,
  MoreHorizontal,
  Edit,
  Share2,
  Archive
} from "lucide-react";

interface Repository {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  lastUpdated: string;
  status: "active" | "review" | "pending" | "archived";
  collaborators: number;
  visibility: "public" | "private";
}

interface RepositoryCardProps {
  repository: Repository;
  detailed?: boolean;
}

export function RepositoryCard({ repository, detailed = false }: RepositoryCardProps) {
  const getStatusBadge = (status: Repository["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-success">Active</Badge>;
      case "review":
        return <Badge variant="default" className="bg-warning">In Review</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="group hover:shadow-professional transition-all duration-200 hover:scale-[1.01]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg hover:text-primary cursor-pointer">
                {repository.name}
              </CardTitle>
              {repository.visibility === "private" ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Globe className="h-4 w-4 text-muted-foreground" />
              )}
              {getStatusBadge(repository.status)}
            </div>
            <CardDescription className="mt-1 text-sm">
              {repository.description}
            </CardDescription>
          </div>
          
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Repository Stats */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span>{repository.language}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>{repository.stars}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <GitFork className="h-4 w-4" />
            <span>{repository.forks}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{repository.collaborators}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{repository.lastUpdated}</span>
          </div>
        </div>

        {detailed && (
          <>
            {/* Collaborators */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Collaborators:</span>
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(repository.collaborators, 5) }).map((_, i) => (
                  <Avatar key={i} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      {String.fromCharCode(65 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {repository.collaborators > 5 && (
                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs font-medium">+{repository.collaborators - 5}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-2">
              <Button variant="default" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>
          </>
        )}

        {!detailed && (
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="default" size="sm">
              Open
            </Button>
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}