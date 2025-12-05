// ============================================================================
// ENUX - User Profile Page
// ============================================================================

import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUserProfile, useUserFollowers, useUserFollowing, useFollowUser, useUnfollowUser } from '@/hooks/queries';
import {
  MapPin,
  Globe,
  Star,
  Users,
  Briefcase,
  Calendar,
  Loader2,
  ArrowLeft,
  UserPlus,
  UserMinus,
  MessageCircle,
} from 'lucide-react';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, error } = useUserProfile(id!);
  const { data: followersData } = useUserFollowers(id!);
  const { data: followingData } = useUserFollowing(id!);
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

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

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-6 text-center py-20">
          <p className="text-muted-foreground mb-4">User not found</p>
          <Link to="/community">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleFollow = () => {
    followMutation.mutate(id!);
  };

  const handleUnfollow = () => {
    unfollowMutation.mutate(id!);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        {/* Back Link */}
        <Link to="/community" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Community
        </Link>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">
                  {user.displayName.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-2xl font-bold">{user.displayName}</h1>
                {user.bio && <p className="text-muted-foreground mt-1">{user.bio}</p>}

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {user.location}
                    </div>
                  )}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-primary"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      Website
                    </a>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {user.expertise && user.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {user.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Button onClick={handleFollow} disabled={followMutation.isPending}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </Button>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-5 w-5 mx-auto mb-2 text-warning" />
              <p className="text-2xl font-bold">{user.reputation}</p>
              <p className="text-sm text-muted-foreground">Reputation</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Briefcase className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Repositories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-5 w-5 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold">{followersData?.total || 0}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-5 w-5 mx-auto mb-2 text-secondary" />
              <p className="text-2xl font-bold">{followingData?.total || 0}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="repositories">
          <TabsList>
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <TabsContent value="repositories" className="mt-6">
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No public repositories yet
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No recent activity
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followers" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {followersData?.data && followersData.data.length > 0 ? (
                  <div className="space-y-4">
                    {followersData.data.map((follower) => (
                      <Link
                        key={follower.id}
                        to={`/users/${follower.id}`}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted"
                      >
                        <Avatar>
                          <AvatarFallback>
                            {follower.displayName.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{follower.displayName}</p>
                          <p className="text-sm text-muted-foreground">{follower.bio}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No followers yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="following" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {followingData?.data && followingData.data.length > 0 ? (
                  <div className="space-y-4">
                    {followingData.data.map((following) => (
                      <Link
                        key={following.id}
                        to={`/users/${following.id}`}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted"
                      >
                        <Avatar>
                          <AvatarFallback>
                            {following.displayName.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{following.displayName}</p>
                          <p className="text-sm text-muted-foreground">{following.bio}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">Not following anyone yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
