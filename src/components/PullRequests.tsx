import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  GitPullRequest, 
  GitMerge,
  GitBranch,
  MessageCircle, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Eye,
  FileText,
  Users,
  Calendar,
  Filter,
  Search
} from "lucide-react";

export function PullRequests() {
  const [selectedPR, setSelectedPR] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState("");

  const pullRequests = [
    {
      id: "1",
      title: "Add Customer Acquisition Cost Analysis Framework",
      description: "Comprehensive framework for calculating and optimizing CAC across different channels",
      author: "Sarah Chen",
      repository: "SaaS-Startup-Framework",
      status: "open",
      priority: "high",
      changes: {
        additions: 156,
        deletions: 23,
        files: 4
      },
      reviewers: [
        { name: "Michael Rodriguez", status: "approved" },
        { name: "Emily Johnson", status: "pending" }
      ],
      comments: 8,
      conflicts: false,
      createdAt: "2 hours ago",
      updatedAt: "30 minutes ago",
      labels: ["enhancement", "finance", "urgent"]
    },
    {
      id: "2",
      title: "Update Market Research Templates",
      description: "Refined market research templates with better data collection methods",
      author: "David Park",
      repository: "Marketing-Automation-Templates",
      status: "review",
      priority: "medium",
      changes: {
        additions: 89,
        deletions: 45,
        files: 6
      },
      reviewers: [
        { name: "Lisa Wong", status: "approved" },
        { name: "Alex Thompson", status: "changes-requested" }
      ],
      comments: 12,
      conflicts: true,
      createdAt: "1 day ago",
      updatedAt: "4 hours ago",
      labels: ["improvement", "research", "templates"]
    },
    {
      id: "3",
      title: "Fix Financial Projection Calculations",
      description: "Corrected formulas in the financial planning spreadsheet templates",
      author: "Jennifer Liu",
      repository: "Financial-Planning-Tools",
      status: "approved",
      priority: "high",
      changes: {
        additions: 34,
        deletions: 12,
        files: 2
      },
      reviewers: [
        { name: "Robert Kim", status: "approved" },
        { name: "Ahmed Hassan", status: "approved" }
      ],
      comments: 5,
      conflicts: false,
      createdAt: "3 days ago",
      updatedAt: "1 day ago",
      labels: ["bugfix", "finance", "critical"]
    }
  ];

  const myPullRequests = [
    {
      id: "4",
      title: "Growth Metrics Dashboard Enhancement",
      repository: "SaaS-Startup-Framework",
      status: "draft",
      progress: 65,
      lastSaved: "15 minutes ago"
    },
    {
      id: "5",
      title: "Competitive Analysis Template",
      repository: "Marketing-Automation-Templates",
      status: "ready",
      progress: 100,
      lastSaved: "2 hours ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "default";
      case "review": return "secondary";
      case "approved": return "default";
      case "merged": return "default";
      case "closed": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <GitPullRequest className="h-4 w-4" />;
      case "review": return <Eye className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "merged": return <GitMerge className="h-4 w-4" />;
      case "closed": return <XCircle className="h-4 w-4" />;
      default: return <GitPullRequest className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Improvement Proposals</h1>
          <p className="text-muted-foreground">Review and manage proposed changes to business frameworks</p>
        </div>
        
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
            Propose Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Proposals</TabsTrigger>
          <TabsTrigger value="mine">My Proposals</TabsTrigger>
          <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="space-y-4">
            {pullRequests.map((pr) => (
              <Card key={pr.id} className="hover:shadow-elegant transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(pr.status)}
                          <h3 className="text-lg font-semibold">{pr.title}</h3>
                        </div>
                        <Badge variant={getStatusColor(pr.status)}>
                          {pr.status}
                        </Badge>
                        <Badge variant={getPriorityColor(pr.priority)}>
                          {pr.priority} priority
                        </Badge>
                        {pr.conflicts && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Conflicts
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{pr.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <GitBranch className="h-4 w-4" />
                          <span>{pr.repository}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{pr.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span className="text-success">+{pr.changes.additions}</span>
                          <span className="text-destructive">-{pr.changes.deletions}</span>
                          <span>{pr.changes.files} files</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{pr.comments} comments</span>
                        </div>
                      </div>

                      {/* Reviewers */}
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-sm font-medium">Reviewers:</span>
                        <div className="flex space-x-3">
                          {pr.reviewers.map((reviewer, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {reviewer.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{reviewer.name}</span>
                              {reviewer.status === "approved" && <CheckCircle className="h-4 w-4 text-success" />}
                              {reviewer.status === "changes-requested" && <AlertCircle className="h-4 w-4 text-warning" />}
                              {reviewer.status === "pending" && <Clock className="h-4 w-4 text-muted-foreground" />}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {pr.labels.map((label) => (
                          <Badge key={label} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Created {pr.createdAt}</span>
                        <span>•</span>
                        <span>Updated {pr.updatedAt}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-6">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                      <Button variant="default" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comment
                      </Button>
                      {pr.status === "approved" && (
                        <Button variant="premium" size="sm">
                          <GitMerge className="h-4 w-4 mr-2" />
                          Merge
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mine" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myPullRequests.map((pr) => (
              <Card key={pr.id} className="hover:shadow-elegant transition-all duration-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{pr.title}</h3>
                      <Badge variant={pr.status === "ready" ? "default" : "secondary"}>
                        {pr.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{pr.repository}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{pr.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pr.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Last saved {pr.lastSaved}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      {pr.status === "ready" && (
                        <Button variant="default" size="sm" className="flex-1">
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviewing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Pending Reviews
              </CardTitle>
              <CardDescription>
                Proposals waiting for your review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pullRequests.filter(pr => pr.reviewers.some(r => r.status === "pending")).map((pr) => (
                  <div key={pr.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{pr.title}</h4>
                      <p className="text-sm text-muted-foreground">by {pr.author} • {pr.repository}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Request Changes
                      </Button>
                      <Button variant="default" size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t space-y-4">
                <h4 className="font-medium">Add Review Comment</h4>
                <Textarea
                  placeholder="Provide feedback on the proposed changes..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                />
                <Button variant="default">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Submit Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-6">
          <div className="space-y-4">
            {pullRequests.filter(pr => pr.status === "approved").map((pr) => (
              <Card key={pr.id} className="border-success/20 bg-success/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-success" />
                      <div>
                        <h3 className="font-semibold text-success">{pr.title}</h3>
                        <p className="text-sm text-muted-foreground">Ready to be implemented • {pr.repository}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                      <Button variant="default" size="sm">
                        <GitMerge className="h-4 w-4 mr-2" />
                        Implement Now
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