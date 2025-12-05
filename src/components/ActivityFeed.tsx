// ============================================================================
// ENUX - Activity Feed Component
// ============================================================================

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivityFeed } from "@/hooks/queries";
import type { Activity as ActivityType } from "@/types";
import {
  Activity,
  GitCommit,
  Star,
  GitFork,
  Users,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

// Loading skeleton
function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start space-x-3 p-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActivityFeed() {
  const { data, isLoading, isError } = useActivityFeed({ limit: 10 });

  const activities = data?.data ?? [];

  const getActivityIcon = (type: ActivityType['type']) => {
    switch (type) {
      case "commit":
        return <GitCommit className="h-4 w-4" />;
      case "star":
        return <Star className="h-4 w-4 text-warning" />;
      case "fork":
        return <GitFork className="h-4 w-4" />;
      case "collaboration":
        return <Users className="h-4 w-4" />;
      case "comment":
        return <MessageCircle className="h-4 w-4" />;
      case "review":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "merge":
        return <GitCommit className="h-4 w-4 text-success" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-3 w-3 text-success" />;
      case "pending":
        return <Clock className="h-3 w-3 text-warning" />;
      case "warning":
        return <AlertCircle className="h-3 w-3 text-warning" />;
      default:
        return null;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Latest updates from your repositories and collaborators
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ActivitySkeleton />
        ) : isError ? (
          <div className="flex items-center space-x-4 p-4 bg-destructive/5 rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-muted-foreground">Failed to load activity feed.</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No recent activity</h3>
            <p className="text-muted-foreground">
              Activity from your repositories will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {activity.user?.displayName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">
                      {activity.user?.displayName || "Unknown User"}
                    </span>
                    {activity.metadata?.status && getStatusIcon(activity.metadata.status)}
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                    {activity.repository && (
                      <>
                        {" "}in{" "}
                        <span className="font-medium text-foreground">
                          {activity.repository.name}
                        </span>
                      </>
                    )}
                  </p>

                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.createdAt)}
                    </span>
                    {activity.metadata?.status && (
                      <Badge variant="outline" className="text-xs">
                        {activity.metadata.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
