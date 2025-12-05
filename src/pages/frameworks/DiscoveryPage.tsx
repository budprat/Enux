// ============================================================================
// ENUX - Framework Discovery Page
// ============================================================================

import { Header } from '@/components/Header';
import { Discovery } from '@/components/Discovery';

export default function DiscoveryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-8">
        <Discovery />
      </main>
    </div>
  );
}
