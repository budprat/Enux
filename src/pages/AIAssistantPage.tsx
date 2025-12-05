// ============================================================================
// ENUX - AI Assistant Page
// ============================================================================

import { Header } from '@/components/Header';
import { AIAssistant } from '@/components/AIAssistant';

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground">Get intelligent recommendations for your entrepreneurship projects</p>
        </div>
        <AIAssistant />
      </main>
    </div>
  );
}
