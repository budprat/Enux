// ============================================================================
// ENUX - Settings Page
// ============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile, useNotificationPreferences, useUpdateNotificationPreferences } from '@/hooks/queries';
import { useToast } from '@/hooks/use-toast';
import { User, Bell, Shield, Loader2, AlertCircle, Check } from 'lucide-react';

// Profile form schema
const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  expertise: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfile();
  const { data: notificationPrefs } = useNotificationPreferences();
  const updateNotificationsMutation = useUpdateNotificationPreferences();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      expertise: user?.expertise?.join(', ') || '',
    },
  });

  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const expertise = data.expertise
        ? data.expertise.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await updateProfileMutation.mutateAsync({
        displayName: data.displayName,
        bio: data.bio,
        location: data.location,
        website: data.website || undefined,
        expertise,
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    try {
      await updateNotificationsMutation.mutateAsync({ [key]: value });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information visible to other users
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmitProfile)}>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-xl">
                        {user?.displayName?.split(' ').map((n) => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" type="button">
                      Change Avatar
                    </Button>
                  </div>

                  {/* Display Name */}
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      {...register('displayName')}
                      disabled={isSaving}
                    />
                    {errors.displayName && (
                      <p className="text-sm text-destructive">{errors.displayName.message}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell others about yourself..."
                      rows={3}
                      {...register('bio')}
                      disabled={isSaving}
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, CA"
                      {...register('location')}
                      disabled={isSaving}
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      {...register('website')}
                      disabled={isSaving}
                    />
                  </div>

                  {/* Expertise */}
                  <div className="space-y-2">
                    <Label htmlFor="expertise">Expertise</Label>
                    <Input
                      id="expertise"
                      placeholder="Marketing, Finance, Strategy (comma separated)"
                      {...register('expertise')}
                      disabled={isSaving}
                    />
                    <p className="text-xs text-muted-foreground">
                      Add your areas of expertise to help others find you
                    </p>
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </form>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Collaboration Requests</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when someone wants to collaborate
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs?.collaboration_requests ?? true}
                    onCheckedChange={(value) => handleNotificationChange('collaboration_requests', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Proposal Reviews</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about your proposal reviews
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs?.proposal_reviews ?? true}
                    onCheckedChange={(value) => handleNotificationChange('proposal_reviews', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Comments</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when someone comments on your content
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs?.comments ?? true}
                    onCheckedChange={(value) => handleNotificationChange('comments', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mentions</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when someone mentions you
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs?.mentions ?? true}
                    onCheckedChange={(value) => handleNotificationChange('mentions', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Digest</p>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly email summary of activity
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs?.email_digest ?? false}
                    onCheckedChange={(value) => handleNotificationChange('email_digest', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible actions that affect your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sign out</p>
                      <p className="text-sm text-muted-foreground">
                        Sign out of your account on this device
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                      Sign out
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
