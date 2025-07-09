import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Save, 
  Edit, 
  Eye,
  History,
  Share2,
  Settings,
  Users,
  MessageCircle,
  GitCommit,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Send
} from "lucide-react";

export function ContentEditor() {
  const [content, setContent] = useState(`# SaaS Startup Framework

## Executive Summary
This framework provides a comprehensive approach to launching a successful SaaS product with validated business models and proven market strategies.

## Business Model Canvas
- **Key Partners**: Technology providers, integration partners, channel partners
- **Key Activities**: Software development, customer acquisition, customer support
- **Key Resources**: Technical team, intellectual property, customer data
- **Value Propositions**: Efficiency gains, cost reduction, scalability
- **Customer Relationships**: Self-service, personal assistance, automated services
- **Customer Segments**: Small businesses, mid-market, enterprise
- **Channels**: Direct sales, online marketing, partner channels
- **Cost Structure**: Development costs, hosting, marketing, support
- **Revenue Streams**: Subscription fees, professional services, training

## Market Analysis
### Target Market
- Total Addressable Market (TAM): $50B
- Serviceable Addressable Market (SAM): $10B
- Serviceable Obtainable Market (SOM): $100M

### Competition Analysis
1. **Direct Competitors**
   - Competitor A: Market leader with 30% market share
   - Competitor B: Fast-growing challenger with innovative features
   - Competitor C: Established player focusing on enterprise

2. **Indirect Competitors**
   - Legacy solutions
   - In-house development
   - Alternative approaches

## Financial Projections
### Revenue Forecast (3-Year)
- Year 1: $500K
- Year 2: $2M
- Year 3: $5M

### Key Metrics
- Monthly Recurring Revenue (MRR) growth: 15%
- Customer Acquisition Cost (CAC): $200
- Customer Lifetime Value (CLV): $1,500
- Churn Rate: 5%`);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  const collaborators = [
    { name: "Sarah Chen", role: "Financial Advisor", status: "active" },
    { name: "Michael Rodriguez", role: "Marketing Expert", status: "reviewing" },
    { name: "Emily Johnson", role: "Product Manager", status: "offline" }
  ];

  const versionHistory = [
    { version: "v1.3", author: "You", changes: "Updated financial projections", time: "2 hours ago", status: "current" },
    { version: "v1.2", author: "Sarah Chen", changes: "Added market analysis section", time: "1 day ago", status: "merged" },
    { version: "v1.1", author: "Michael Rodriguez", changes: "Improved executive summary", time: "3 days ago", status: "merged" },
    { version: "v1.0", author: "You", changes: "Initial framework creation", time: "1 week ago", status: "merged" }
  ];

  const comments = [
    { id: "1", author: "Sarah Chen", content: "The financial projections look conservative. Consider adding SaaS metrics breakdown.", time: "4 hours ago", resolved: false },
    { id: "2", author: "Michael Rodriguez", content: "Great work on the market analysis. The TAM/SAM/SOM breakdown is very clear.", time: "1 day ago", resolved: true },
    { id: "3", author: "Emily Johnson", content: "Should we add a product roadmap section to this framework?", time: "2 days ago", resolved: false }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SaaS Startup Framework</h1>
          <p className="text-muted-foreground">Comprehensive business framework for SaaS product launches</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="default" className="bg-success">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="default" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Editor */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Content Editor
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="diff">Changes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="mt-4">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[600px] font-mono text-sm"
                    placeholder="Start writing your business framework..."
                    disabled={!isEditing}
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="mt-4">
                  <div className="prose prose-sm max-w-none">
                    <div className="bg-muted/50 p-6 rounded-lg">
                      <div className="whitespace-pre-wrap text-sm">
                        {content}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="diff" className="mt-4">
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Recent Changes</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span className="text-success">+ Added financial projections section</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-warning rounded-full"></div>
                          <span className="text-warning">~ Modified market analysis</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-destructive rounded-full"></div>
                          <span className="text-destructive">- Removed outdated competition data</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Collaborators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Collaborators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {collaborators.map((collaborator, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      {collaborator.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{collaborator.name}</p>
                    <p className="text-xs text-muted-foreground">{collaborator.role}</p>
                  </div>
                  <Badge variant={collaborator.status === "active" ? "default" : "secondary"} className="text-xs">
                    {collaborator.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Version History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {versionHistory.map((version, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{version.version}</span>
                    <Badge variant={version.status === "current" ? "default" : "secondary"} className="text-xs">
                      {version.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{version.changes}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{version.author}</span>
                    <span>•</span>
                    <span>{version.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                    {comment.resolved ? (
                      <CheckCircle className="h-3 w-3 text-success" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-warning" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Add a comment..." className="flex-1" />
                  <Button size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}