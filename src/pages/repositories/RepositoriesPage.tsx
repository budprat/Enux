// ============================================================================
// ENUX - Repositories List Page
// ============================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { RepositoryCard } from '@/components/RepositoryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRepositories, useStarredRepositories } from '@/hooks/queries';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';

export default function RepositoriesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: repositoriesData, isLoading: isLoadingAll } = useRepositories({
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter as 'active' | 'review' | 'pending' | 'archived' : undefined,
  });

  const { data: starredData, isLoading: isLoadingStarred } = useStarredRepositories();

  const repositories = repositoriesData?.data || [];
  const starredRepositories = starredData?.data || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Repositories</h1>
            <p className="text-muted-foreground">Manage your business frameworks and templates</p>
          </div>
          <Link to="/repositories/new">
            <Button variant="premium">
              <Plus className="h-4 w-4 mr-2" />
              New Repository
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Repositories</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {isLoadingAll ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : repositories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No repositories found</p>
                <Link to="/repositories/new">
                  <Button>Create your first repository</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {repositories.map((repo) => (
                  <Link key={repo.id} to={`/repositories/${repo.id}`}>
                    <RepositoryCard repository={repo} detailed />
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="starred" className="space-y-4 mt-6">
            {isLoadingStarred ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : starredRepositories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No starred repositories yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {starredRepositories.map((repo) => (
                  <Link key={repo.id} to={`/repositories/${repo.id}`}>
                    <RepositoryCard repository={repo} detailed />
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
