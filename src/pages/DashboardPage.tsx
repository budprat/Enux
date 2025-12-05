// ============================================================================
// ENUX - Dashboard Page
// ============================================================================

import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-8">
        <Dashboard />
      </main>
    </div>
  );
}
