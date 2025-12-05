// ============================================================================
// ENUX - Collaboration Hub Page
// ============================================================================

import { Header } from '@/components/Header';
import { Collaboration } from '@/components/Collaboration';

export default function CollaborationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-8">
        <Collaboration />
      </main>
    </div>
  );
}
