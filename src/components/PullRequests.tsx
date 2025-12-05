// ============================================================================
// ENUX - Pull Requests Component
// ============================================================================

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useProposals,
  useMyProposals,
  useProposalsToReview,
  useApproveProposal,
  useRequestChanges,
  useMergeProposal,
  useAddProposalComment
} from "@/hooks/queries";
import { useToast } from "@/hooks/use-toast";
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

// Loading skeleton
function ProposalSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex space-x-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function PullRequests() {
  const [reviewComment, setReviewComment] = useState("");
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch proposals
  const { data: allProposals, isLoading: isLoadingAll, isError: isErrorAll } = useProposals();
  const { data: myProposals, isLoading: isLoadingMine } = useMyProposals();
  const { data: reviewingProposals, isLoading: isLoadingReviewing } = useProposalsToReview();

  // Mutations
  const approveMutation = useApproveProposal();
  const requestChangesMutation = useRequestChanges();
  const mergeMutation = useMergeProposal();
  const addCommentMutation = useAddProposalComment();

  const proposals = allProposals?.data ?? [];
  const myProposalsList = myProposals?.data ?? [];
  const reviewingList = reviewingProposals?.data ?? [];
  const approvedProposals = proposals.filter((p) => p.status === "approved");

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync({ id });
      toast({ title: "Proposal approved successfully" });
    } catch {
      toast({ title: "Failed to approve proposal", variant: "destructive" });
    }
  };

  const handleRequestChanges = async (id: string) => {
    if (!reviewComment.trim()) {
      toast({ title: "Please provide feedback when requesting changes", variant: "destructive" });
      return;
    }
    try {
      await requestChangesMutation.mutateAsync({ id, comment: reviewComment });
      setReviewComment("");
      toast({ title: "Changes requested" });
    } catch {
      toast({ title: "Failed to request changes", variant: "destructive" });
    }
  };

  const handleMerge = async (id: string) => {
    try {
      await mergeMutation.mutateAsync(id);
      toast({ title: "Proposal merged successfully" });
    } catch {
      toast({ title: "Failed to merge proposal", variant: "destructive" });
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedProposalId || !reviewComment.trim()) return;
    try {
      await addCommentMutation.mutateAsync({
        id: selectedProposalId,
        content: reviewComment
      });
      setReviewComment("");
      toast({ title: "Review submitted" });
    } catch {
      toast({ title: "Failed to submit review", variant: "destructive" });
    }
  };

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
          {isLoadingAll ? (
            <ProposalSkeleton />
          ) : isErrorAll ? (
            <Card className="border-destructive/50">
              <CardContent className="p-6 flex items-center space-x-4">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-muted-foreground">Failed to load proposals.</p>
              </CardContent>
            </Card>
          ) : proposals.length === 0 ? (
            <div className="text-center py-12">
              <GitPullRequest className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No proposals yet</h3>
              <p className="text-muted-foreground">Be the first to propose changes to a framework</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map((pr) => (
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
                          {pr.priority && (
                            <Badge variant={getPriorityColor(pr.priority)}>
                              {pr.priority} priority
                            </Badge>
                          )}
                        </div>

                        <p className="text-muted-foreground mb-4">{pr.description}</p>

                        <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center space-x-1">
                            <GitBranch className="h-4 w-4" />
                            <span>{pr.repository?.name || "Unknown Repository"}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{pr.author?.displayName || "Unknown Author"}</span>
                          </div>
                          {pr.changes && (
                            <div className="flex items-center space-x-1">
                              <FileText className="h-4 w-4" />
                              <span className="text-success">+{pr.changes.additions}</span>
                              <span className="text-destructive">-{pr.changes.deletions}</span>
                              <span>{pr.changes.files} files</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{pr.commentsCount || 0} comments</span>
                          </div>
                        </div>

                        {/* Reviewers */}
                        {pr.reviewers && pr.reviewers.length > 0 && (
                          <div className="flex items-center space-x-4 mb-4">
                            <span className="text-sm font-medium">Reviewers:</span>
                            <div className="flex space-x-3">
                              {pr.reviewers.map((reviewer, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {reviewer.user?.displayName?.split(" ").map((n) => n[0]).join("") || "R"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{reviewer.user?.displayName || "Reviewer"}</span>
                                  {reviewer.status === "approved" && <CheckCircle className="h-4 w-4 text-success" />}
                                  {reviewer.status === "changes_requested" && <AlertCircle className="h-4 w-4 text-warning" />}
                                  {reviewer.status === "pending" && <Clock className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Labels */}
                        {pr.labels && pr.labels.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {pr.labels.map((label) => (
                              <Badge key={label} variant="outline" className="text-xs">
                                {label}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Created {formatTimeAgo(pr.createdAt)}</span>
                          <span>•</span>
                          <span>Updated {formatTimeAgo(pr.updatedAt)}</span>
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
                          <Button
                            variant="premium"
                            size="sm"
                            onClick={() => handleMerge(pr.id)}
                            disabled={mergeMutation.isPending}
                          >
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
          )}
        </TabsContent>

        <TabsContent value="mine" className="space-y-6">
          {isLoadingMine ? (
            <ProposalSkeleton />
          ) : myProposalsList.length === 0 ? (
            <div className="text-center py-12">
              <GitPullRequest className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No proposals yet</h3>
              <p className="text-muted-foreground">Create your first proposal to contribute improvements</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myProposalsList.map((pr) => (
                <Card key={pr.id} className="hover:shadow-elegant transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{pr.title}</h3>
                        <Badge variant={pr.status === "draft" ? "secondary" : "default"}>
                          {pr.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">{pr.repository?.name}</p>

                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Updated {formatTimeAgo(pr.updatedAt)}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                        {pr.status === "draft" && (
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
          )}
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
              {isLoadingReviewing ? (
                <ProposalSkeleton />
              ) : reviewingList.length === 0 ? (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pending reviews</h3>
                  <p className="text-muted-foreground">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviewingList.map((pr) => (
                    <div key={pr.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{pr.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          by {pr.author?.displayName} • {pr.repository?.name}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProposalId(pr.id);
                            handleRequestChanges(pr.id);
                          }}
                          disabled={requestChangesMutation.isPending}
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Request Changes
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(pr.id)}
                          disabled={approveMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t space-y-4">
                <h4 className="font-medium">Add Review Comment</h4>
                <Textarea
                  placeholder="Provide feedback on the proposed changes..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                />
                <Button
                  variant="default"
                  onClick={handleSubmitReview}
                  disabled={addCommentMutation.isPending || !reviewComment.trim()}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Submit Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-6">
          {approvedProposals.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No approved proposals</h3>
              <p className="text-muted-foreground">Approved proposals will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {approvedProposals.map((pr) => (
                <Card key={pr.id} className="border-success/20 bg-success/5">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-success" />
                        <div>
                          <h3 className="font-semibold text-success">{pr.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Ready to be implemented • {pr.repository?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleMerge(pr.id)}
                          disabled={mergeMutation.isPending}
                        >
                          <GitMerge className="h-4 w-4 mr-2" />
                          Implement Now
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
