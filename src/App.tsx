// ============================================================================
// ENUX - Main Application
// ============================================================================

import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// ----------------------------------------------------------------------------
// Query Client Configuration
// ----------------------------------------------------------------------------

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ----------------------------------------------------------------------------
// Lazy-loaded Pages
// ----------------------------------------------------------------------------

// Public Pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));

// Protected Pages
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const RepositoriesPage = lazy(() => import('@/pages/repositories/RepositoriesPage'));
const RepositoryDetailPage = lazy(() => import('@/pages/repositories/RepositoryDetailPage'));
const CreateRepositoryPage = lazy(() => import('@/pages/repositories/CreateRepositoryPage'));
const DiscoveryPage = lazy(() => import('@/pages/frameworks/DiscoveryPage'));
const CollaborationPage = lazy(() => import('@/pages/collaboration/CollaborationPage'));
const ProposalsPage = lazy(() => import('@/pages/proposals/ProposalsPage'));
const CommunityPage = lazy(() => import('@/pages/community/CommunityPage'));
const UserProfilePage = lazy(() => import('@/pages/community/UserProfilePage'));
const AIAssistantPage = lazy(() => import('@/pages/AIAssistantPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// ----------------------------------------------------------------------------
// Loading Component
// ----------------------------------------------------------------------------

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Application
// ----------------------------------------------------------------------------

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
              {/* ============================================================ */}
              {/* Public Routes */}
              {/* ============================================================ */}

              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Discovery (no auth required) */}
              <Route path="/explore" element={<DiscoveryPage />} />

              {/* ============================================================ */}
              {/* Auth Routes (redirect to dashboard if logged in) */}
              {/* ============================================================ */}

              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* ============================================================ */}
              {/* Protected Routes (require authentication) */}
              {/* ============================================================ */}

              <Route element={<ProtectedRoute />}>
                {/* Dashboard */}
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* Repositories */}
                <Route path="/repositories" element={<RepositoriesPage />} />
                <Route path="/repositories/new" element={<CreateRepositoryPage />} />
                <Route path="/repositories/:id" element={<RepositoryDetailPage />} />
                <Route path="/repositories/:id/edit" element={<CreateRepositoryPage />} />

                {/* Frameworks/Discovery */}
                <Route path="/discovery" element={<DiscoveryPage />} />
                <Route path="/frameworks/:id" element={<RepositoryDetailPage />} />

                {/* Collaboration */}
                <Route path="/collaboration" element={<CollaborationPage />} />
                <Route path="/collaboration/:id" element={<CollaborationPage />} />

                {/* Proposals (Pull Requests) */}
                <Route path="/proposals" element={<ProposalsPage />} />
                <Route path="/proposals/new" element={<ProposalsPage />} />
                <Route path="/proposals/:id" element={<ProposalsPage />} />

                {/* Community */}
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/users/:id" element={<UserProfilePage />} />

                {/* AI Assistant */}
                <Route path="/ai-assistant" element={<AIAssistantPage />} />

                {/* Settings */}
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/settings/profile" element={<SettingsPage />} />
                <Route path="/settings/notifications" element={<SettingsPage />} />
                <Route path="/settings/security" element={<SettingsPage />} />
              </Route>

              {/* ============================================================ */}
              {/* Catch-all 404 */}
              {/* ============================================================ */}

              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
