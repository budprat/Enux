// ============================================================================
// ENUX - Collaboration Component
// ============================================================================

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCollaborations,
  useIncomingRequests,
  useSuggestedCollaborators,
  useCollaborationMessages,
  useRespondToRequest,
  useSendCollaborationMessage
} from "@/hooks/queries";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  UserPlus,
  MessageCircle,
  Video,
  Calendar,
  Bell,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Search,
  Filter
} from "lucide-react";

// Loading skeletons
function CollaborationSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-2 w-full" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function Collaboration() {
  const [message, setMessage] = useState("");
  const [selectedCollaborationId, setSelectedCollaborationId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch data
  const { data: collaborationsData, isLoading: isLoadingCollaborations, isError: isErrorCollaborations } = useCollaborations();
  const { data: requestsData, isLoading: isLoadingRequests } = useIncomingRequests();
  const { data: suggestedData, isLoading: isLoadingSuggested } = useSuggestedCollaborators();
  const { data: messagesData, isLoading: isLoadingMessages } = useCollaborationMessages(selectedCollaborationId || '');

  // Mutations
  const respondMutation = useRespondToRequest();
  const sendMessageMutation = useSendCollaborationMessage();

  const activeCollaborations = collaborationsData?.data ?? [];
  const collaborationRequests = requestsData?.data ?? [];
  const suggestedCollaborators = suggestedData?.data ?? [];
  const teamMessages = messagesData?.data ?? [];

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await respondMutation.mutateAsync({ requestId, status: 'accepted' });
      toast({ title: "Request accepted!" });
    } catch {
      toast({ title: "Failed to accept request", variant: "destructive" });
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await respondMutation.mutateAsync({ requestId, status: 'declined' });
      toast({ title: "Request declined" });
    } catch {
      toast({ title: "Failed to decline request", variant: "destructive" });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedCollaborationId) return;
    try {
      await sendMessageMutation.mutateAsync({
        id: selectedCollaborationId,
        content: message
      });
      setMessage("");
      toast({ title: "Message sent" });
    } catch {
      toast({ title: "Failed to send message", variant: "destructive" });
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
          <h1 className="text-2xl font-bold">Collaboration Hub</h1>
          <p className="text-muted-foreground">Manage your team collaborations and find new partners</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
          <Button variant="premium" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Find Collaborators
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="requests">Collaboration Requests</TabsTrigger>
          <TabsTrigger value="discover">Discover Collaborators</TabsTrigger>
          <TabsTrigger value="messages">Team Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {isLoadingCollaborations ? (
            <CollaborationSkeleton />
          ) : isErrorCollaborations ? (
            <Card className="border-destructive/50">
              <CardContent className="p-6 flex items-center space-x-4">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-muted-foreground">Failed to load collaborations.</p>
              </CardContent>
            </Card>
          ) : activeCollaborations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No active collaborations</h3>
              <p className="text-muted-foreground">Start collaborating with others to see your projects here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeCollaborations.map((project) => (
                <Card key={project.id} className="hover:shadow-elegant transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant={project.status === "active" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Last activity: {formatTimeAgo(project.updatedAt)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    {project.progress !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Collaborators */}
                    {project.collaborators && project.collaborators.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Team Members</h4>
                        {project.collaborators.map((collaborator, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {collaborator.user?.displayName?.split(" ").map((n) => n[0]).join("") || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                                collaborator.status === "online" ? "bg-success" :
                                collaborator.status === "away" ? "bg-warning" : "bg-muted"
                              }`}></div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{collaborator.user?.displayName}</p>
                              <p className="text-xs text-muted-foreground">{collaborator.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Next Meeting */}
                    {project.nextMeeting && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Next meeting: {new Date(project.nextMeeting).toLocaleString()}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedCollaborationId(project.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Video className="h-4 w-4 mr-2" />
                        Meet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          {isLoadingRequests ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : collaborationRequests.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No pending requests</h3>
              <p className="text-muted-foreground">Collaboration requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {collaborationRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-elegant transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {request.user?.displayName?.split(" ").map((n) => n[0]).join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{request.user?.displayName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Wants to collaborate on <span className="font-medium">{request.collaboration?.name}</span>
                            </p>
                          </div>
                        </div>

                        {request.message && (
                          <p className="text-sm mb-3">{request.message}</p>
                        )}

                        {request.user?.expertise && request.user.expertise.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {request.user.expertise.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{formatTimeAgo(request.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id)}
                          disabled={respondMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeclineRequest(request.id)}
                          disabled={respondMutation.isPending}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover" className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by skills, experience, or industry..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {isLoadingSuggested ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                      <Skeleton className="h-4 w-24 mx-auto" />
                      <Skeleton className="h-3 w-32 mx-auto" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : suggestedCollaborators.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No suggestions yet</h3>
              <p className="text-muted-foreground">Complete your profile to get collaborator suggestions</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedCollaborators.map((collaborator) => (
                <Card key={collaborator.id} className="hover:shadow-elegant transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <Avatar className="h-16 w-16 mx-auto">
                        <AvatarFallback className="text-lg">
                          {collaborator.displayName?.split(" ").map((n) => n[0]).join("") || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold">{collaborator.displayName}</h3>
                        {collaborator.expertise && collaborator.expertise[0] && (
                          <p className="text-sm text-muted-foreground">{collaborator.expertise[0]}</p>
                        )}
                        {collaborator.bio && (
                          <p className="text-xs text-muted-foreground mt-1">{collaborator.bio.slice(0, 50)}...</p>
                        )}
                      </div>

                      <div className="flex items-center justify-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-warning" />
                          <span>{collaborator.reputation ?? 0}</span>
                        </div>
                        <div>
                          <span>{collaborator.repositoriesCount ?? 0} projects</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {collaborator.matchReason && (
                          <p className="text-xs text-muted-foreground">{collaborator.matchReason}</p>
                        )}
                        <div className="flex items-center justify-center space-x-1 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>{collaborator.availability || "Available"}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Profile
                        </Button>
                        <Button variant="default" size="sm" className="flex-1">
                          <UserPlus className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Team Messages
              </CardTitle>
              <CardDescription>
                Recent messages from your collaboration teams
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {isLoadingMessages ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : teamMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                  <p className="text-muted-foreground">
                    Select a collaboration to view messages
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {teamMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {msg.sender?.displayName?.split(" ").map((n) => n[0]).join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium">{msg.sender?.displayName}</span>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(msg.createdAt)}</span>
                          {msg.type === "question" && <AlertCircle className="h-3 w-3 text-warning" />}
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                    disabled={!selectedCollaborationId}
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || !selectedCollaborationId || sendMessageMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {!selectedCollaborationId && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Select a collaboration from "Active Projects" to send messages
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
