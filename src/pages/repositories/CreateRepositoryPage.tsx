// ============================================================================
// ENUX - Create Repository Page
// ============================================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateRepository } from '@/hooks/queries';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Globe, Lock, AlertCircle } from 'lucide-react';

// Form schema
const createRepositorySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().max(500),
  category: z.string().min(1, 'Please select a category'),
  visibility: z.enum(['public', 'private']),
  tags: z.string().optional(),
});

type CreateRepositoryFormData = z.infer<typeof createRepositorySchema>;

const categories = [
  'Business Model',
  'Marketing',
  'Finance',
  'Operations',
  'Strategy',
  'Innovation',
  'Product',
  'Sales',
  'HR',
  'Legal',
];

export default function CreateRepositoryPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createMutation = useCreateRepository();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateRepositoryFormData>({
    resolver: zodResolver(createRepositorySchema),
    defaultValues: {
      visibility: 'public',
    },
  });

  const visibility = watch('visibility');

  const onSubmit = async (data: CreateRepositoryFormData) => {
    try {
      const tags = data.tags
        ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];

      const result = await createMutation.mutateAsync({
        name: data.name,
        description: data.description,
        category: data.category,
        visibility: data.visibility,
        tags,
      });

      toast({
        title: 'Repository created',
        description: 'Your new repository has been created successfully.',
      });

      navigate(`/repositories/${result.id}`);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create repository. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 max-w-2xl space-y-6">
        {/* Back Link */}
        <Link to="/repositories" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Repositories
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create a new repository</CardTitle>
            <CardDescription>
              A repository contains your business frameworks, templates, and documentation.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {createMutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {createMutation.error instanceof Error
                      ? createMutation.error.message
                      : 'Failed to create repository'}
                  </AlertDescription>
                </Alert>
              )}

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Repository name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., SaaS-Startup-Framework"
                  {...register('name')}
                  disabled={createMutation.isPending}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Use a descriptive name that reflects your framework's purpose.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this repository is about..."
                  rows={3}
                  {...register('description')}
                  disabled={createMutation.isPending}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  onValueChange={(value) => setValue('category', value)}
                  disabled={createMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="startup, saas, b2b (comma separated)"
                  {...register('tags')}
                  disabled={createMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Add tags to help others discover your repository.
                </p>
              </div>

              {/* Visibility */}
              <div className="space-y-3">
                <Label>Visibility</Label>
                <RadioGroup
                  value={visibility}
                  onValueChange={(value) => setValue('visibility', value as 'public' | 'private')}
                  disabled={createMutation.isPending}
                >
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="public" id="public" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="public" className="flex items-center cursor-pointer">
                        <Globe className="h-4 w-4 mr-2" />
                        Public
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Anyone can see this repository. You choose who can contribute.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="private" id="private" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="private" className="flex items-center cursor-pointer">
                        <Lock className="h-4 w-4 mr-2" />
                        Private
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        You choose who can see and contribute to this repository.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end space-x-4 pt-4">
                <Link to="/repositories">
                  <Button type="button" variant="outline" disabled={createMutation.isPending}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create repository'
                  )}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </main>
    </div>
  );
}
