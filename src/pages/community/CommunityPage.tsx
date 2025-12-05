// ============================================================================
// ENUX - Community Page
// ============================================================================

import { Header } from '@/components/Header';
import { CommunityDiscovery } from '@/components/CommunityDiscovery';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="text-muted-foreground">Connect with entrepreneurs and discover opportunities</p>
        </div>
        <CommunityDiscovery />
      </main>
    </div>
  );
}
