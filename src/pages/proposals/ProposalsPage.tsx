// ============================================================================
// ENUX - Proposals Page
// ============================================================================

import { Header } from '@/components/Header';
import { PullRequests } from '@/components/PullRequests';

export default function ProposalsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-8">
        <PullRequests />
      </main>
    </div>
  );
}
