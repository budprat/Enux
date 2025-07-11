import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export function Collaboration() {
  const [message, setMessage] = useState("");

  const activeCollaborations = [
    {
      id: "1",
      projectName: "SaaS Startup Framework",
      collaborators: [
        { name: "Sarah Chen", role: "Financial Advisor", avatar: "/api/placeholder/32/32", status: "online" },
        { name: "Michael Rodriguez", role: "Marketing Expert", avatar: "/api/placeholder/32/32", status: "away" },
        { name: "Emily Johnson", role: "Product Manager", avatar: "/api/placeholder/32/32", status: "offline" }
      ],
      lastActivity: "2 hours ago",
      status: "active",
      progress: 78,
      nextMeeting: "Tomorrow at 2:00 PM"
    },
    {
      id: "2",
      projectName: "Marketing Automation Templates",
      collaborators: [
        { name: "David Park", role: "Growth Hacker", avatar: "/api/placeholder/32/32", status: "online" },
        { name: "Lisa Wong", role: "Content Strategist", avatar: "/api/placeholder/32/32", status: "online" }
      ],
      lastActivity: "5 hours ago",
      status: "review",
      progress: 92,
      nextMeeting: "Friday at 10:00 AM"
    }
  ];

  const collaborationRequests = [
    {
      id: "1",
      from: "Alex Thompson",
      project: "Fintech Startup Playbook",
      message: "I'd love to collaborate on the financial planning section. I have 5 years of fintech experience.",
      skills: ["Finance", "Fintech", "Regulatory Compliance"],
      time: "3 hours ago",
      mutual: 2
    },
    {
      id: "2",
      from: "Maria Santos",
      project: "E-commerce Growth Framework",
      message: "Your framework looks promising! I can contribute insights from scaling 3 e-commerce brands.",
      skills: ["E-commerce", "Digital Marketing", "Analytics"],
      time: "1 day ago",
      mutual: 1
    }
  ];

  const suggestedCollaborators = [
    {
      id: "1",
      name: "Robert Kim",
      expertise: "Product Strategy",
      experience: "Ex-Google PM, 8 years",
      projects: 12,
      rating: 4.9,
      matchReason: "Works on similar SaaS frameworks",
      availability: "Available this week"
    },
    {
      id: "2",
      name: "Jennifer Liu",
      expertise: "Growth Marketing",
      experience: "Marketing Director, Scale.ai",
      projects: 8,
      rating: 4.8,
      matchReason: "Expert in your industry focus",
      availability: "Available next week"
    },
    {
      id: "3",
      name: "Ahmed Hassan",
      expertise: "Business Development",
      experience: "Startup Founder & Advisor",
      projects: 15,
      rating: 4.7,
      matchReason: "Complementary skill set",
      availability: "Limited availability"
    }
  ];

  const teamMessages = [
    {
      id: "1",
      sender: "Sarah Chen",
      message: "I've updated the financial projections section with more conservative estimates.",
      time: "2 hours ago",
      type: "update"
    },
    {
      id: "2",
      sender: "Michael Rodriguez",
      message: "Great work on the market analysis! Should we schedule a review meeting?",
      time: "4 hours ago",
      type: "question"
    },
    {
      id: "3",
      sender: "You",
      message: "Thanks for the feedback! I'll incorporate the suggestions by EOD.",
      time: "5 hours ago",
      type: "response"
    }
  ];

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeCollaborations.map((project) => (
              <Card key={project.id} className="hover:shadow-elegant transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.projectName}</CardTitle>
                    <Badge variant={project.status === "active" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Last activity: {project.lastActivity}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
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

                  {/* Collaborators */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Team Members</h4>
                    {project.collaborators.map((collaborator, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={collaborator.avatar} />
                            <AvatarFallback>
                              {collaborator.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                            collaborator.status === "online" ? "bg-success" : 
                            collaborator.status === "away" ? "bg-warning" : "bg-muted"
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{collaborator.name}</p>
                          <p className="text-xs text-muted-foreground">{collaborator.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Next Meeting */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Next meeting: {project.nextMeeting}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
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
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="space-y-4">
            {collaborationRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-elegant transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {request.from.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{request.from}</h3>
                          <p className="text-sm text-muted-foreground">
                            Wants to collaborate on <span className="font-medium">{request.project}</span>
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{request.message}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {request.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{request.time}</span>
                        <span>• {request.mutual} mutual connections</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-6">
                      <Button variant="default" size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedCollaborators.map((collaborator) => (
              <Card key={collaborator.id} className="hover:shadow-elegant transition-all duration-200">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <Avatar className="h-16 w-16 mx-auto">
                      <AvatarFallback className="text-lg">
                        {collaborator.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold">{collaborator.name}</h3>
                      <p className="text-sm text-muted-foreground">{collaborator.expertise}</p>
                      <p className="text-xs text-muted-foreground mt-1">{collaborator.experience}</p>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-warning" />
                        <span>{collaborator.rating}</span>
                      </div>
                      <div>
                        <span>{collaborator.projects} projects</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">{collaborator.matchReason}</p>
                      <div className="flex items-center justify-center space-x-1 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{collaborator.availability}</span>
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
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {teamMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {msg.sender.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">{msg.sender}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                        {msg.type === "question" && <AlertCircle className="h-3 w-3 text-warning" />}
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}