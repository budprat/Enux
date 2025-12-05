// ============================================================================
// ENUX - Repository Detail Page
// ============================================================================

import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRepository, useRepositoryCollaborators, useRepositoryActivity } from '@/hooks/queries';
import {
  Star,
  GitFork,
  Users,
  Clock,
  Edit,
  Share2,
  Eye,
  Lock,
  Globe,
  Loader2,
  ArrowLeft,
  Activity,
  GitPullRequest,
} from 'lucide-react';

export default function RepositoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: repository, isLoading, error } = useRepository(id!);
  const { data: collaborators } = useRepositoryCollaborators(id!);
  const { data: activities } = useRepositoryActivity(id!, 10);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-6 text-center py-20">
          <p className="text-muted-foreground mb-4">Repository not found</p>
          <Link to="/repositories">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Repositories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success">Active</Badge>;
      case 'review':
        return <Badge className="bg-warning">In Review</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        {/* Back Link */}
        <Link to="/repositories" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Repositories
        </Link>

        {/* Repository Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold">{repository.name}</h1>
              {repository.visibility === 'private' ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Globe className="h-4 w-4 text-muted-foreground" />
              )}
              {getStatusBadge(repository.status)}
            </div>
            <p className="text-muted-foreground">{repository.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Star ({repository.stars})
            </Button>
            <Button variant="outline" size="sm">
              <GitFork className="h-4 w-4 mr-2" />
              Fork ({repository.forks})
            </Button>
            <Link to={`/repositories/${id}/edit`}>
              <Button size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>{repository.category}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>{repository.stars} stars</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitFork className="h-4 w-4" />
            <span>{repository.forks} forks</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{repository.collaboratorCount} collaborators</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Updated {repository.lastUpdated}</span>
          </div>
        </div>

        {/* Tags */}
        {repository.tags && repository.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {repository.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">
              <Eye className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="collaborators">
              <Users className="h-4 w-4 mr-2" />
              Collaborators
            </TabsTrigger>
            <TabsTrigger value="proposals">
              <GitPullRequest className="h-4 w-4 mr-2" />
              Proposals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card>
              <CardContent className="p-6">
                {repository.content ? (
                  <div className="prose max-w-none">
                    {repository.content}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No content yet. Click Edit to add content.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activities && activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {activity.user.displayName.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{activity.user.displayName}</span>{' '}
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.createdAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No activity yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaborators">
            <Card>
              <CardHeader>
                <CardTitle>Collaborators</CardTitle>
              </CardHeader>
              <CardContent>
                {collaborators && collaborators.length > 0 ? (
                  <div className="space-y-4">
                    {collaborators.map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {collaborator.user.displayName.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{collaborator.user.displayName}</p>
                            <p className="text-sm text-muted-foreground">{collaborator.role}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{collaborator.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No collaborators yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proposals">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Improvement Proposals</CardTitle>
                <Link to={`/proposals/new?repository=${id}`}>
                  <Button size="sm">
                    <GitPullRequest className="h-4 w-4 mr-2" />
                    New Proposal
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">No proposals yet</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
