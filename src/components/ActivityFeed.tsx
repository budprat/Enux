import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface ActivityItem {
  id: string;
  type: "commit" | "star" | "fork" | "collaboration" | "comment" | "review" | "merge";
  user: string;
  repository: string;
  action: string;
  time: string;
  status?: "success" | "pending" | "warning";
}

export function ActivityFeed() {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "commit",
      user: "Sarah Chen",
      repository: "SaaS-Startup-Framework",
      action: "updated financial projections template",
      time: "2 hours ago",
      status: "success"
    },
    {
      id: "2",
      type: "star",
      user: "Michael Rodriguez",
      repository: "Marketing-Automation-Templates",
      action: "starred your repository",
      time: "4 hours ago"
    },
    {
      id: "3",
      type: "collaboration",
      user: "Emily Johnson",
      repository: "Financial-Planning-Tools",
      action: "requested collaboration",
      time: "6 hours ago",
      status: "pending"
    },
    {
      id: "4",
      type: "review",
      user: "David Kim",
      repository: "SaaS-Startup-Framework",
      action: "reviewed and approved changes",
      time: "8 hours ago",
      status: "success"
    },
    {
      id: "5",
      type: "fork",
      user: "Jessica Liu",
      repository: "Marketing-Automation-Templates",
      action: "forked repository",
      time: "12 hours ago"
    },
    {
      id: "6",
      type: "comment",
      user: "Alex Thompson",
      repository: "Financial-Planning-Tools",
      action: "commented on pricing strategy",
      time: "1 day ago"
    }
  ];

  const getActivityIcon = (type: ActivityItem["type"]) => {
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

  const getStatusIcon = (status?: ActivityItem["status"]) => {
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
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {activity.user.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{activity.user}</span>
                  {activity.status && getStatusIcon(activity.status)}
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.action} in{" "}
                  <span className="font-medium text-foreground">
                    {activity.repository}
                  </span>
                </p>
                
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                  {activity.status && (
                    <Badge variant="outline" className="text-xs">
                      {activity.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}