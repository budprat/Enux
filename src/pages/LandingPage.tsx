// ============================================================================
// ENUX - Landing Page
// ============================================================================

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  GitBranch,
  Users,
  Zap,
  TrendingUp,
  Star,
  Shield,
  ArrowRight,
  Brain,
  Globe,
  BookOpen,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: GitBranch,
      title: 'Business Frameworks',
      description: 'Access and share proven business frameworks, templates, and strategies.',
    },
    {
      icon: Users,
      title: 'Collaboration Hub',
      description: 'Connect with entrepreneurs, advisors, and investors worldwide.',
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations and optimize your business strategy.',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your entrepreneurial journey with detailed analytics.',
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Join a thriving community of entrepreneurs from around the world.',
    },
    {
      icon: BookOpen,
      title: 'Learning Resources',
      description: 'Access curated content and learn from successful entrepreneurs.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Entrepreneurs' },
    { value: '500+', label: 'Frameworks' },
    { value: '2,500+', label: 'Collaborations' },
    { value: '50+', label: 'Countries' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-gradient-primary flex items-center justify-center">
              <GitBranch className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Enux</span>
            <Badge variant="secondary">Beta</Badge>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground">
              Explore
            </Link>
            <Link to="/community" className="text-sm text-muted-foreground hover:text-foreground">
              Community
            </Link>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button variant="premium" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container relative">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <Badge variant="outline" className="px-4 py-1">
              <Star className="h-3 w-3 mr-1" />
              GitHub for Entrepreneurs
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Build, Share, and Scale Your{' '}
              <span className="text-primary">Business Ideas</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl">
              Enux is the collaboration platform where entrepreneurs share frameworks,
              find collaborators, and leverage AI to accelerate their journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Frameworks
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Free to start
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1" />
                AI-powered
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                10K+ users
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enux provides all the tools entrepreneurs need to build, validate,
              and scale their business ideas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-professional transition-all duration-200">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to start your journey?</h2>
            <p className="text-lg opacity-90">
              Join thousands of entrepreneurs who are building the future with Enux.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Create Your Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-md bg-gradient-primary flex items-center justify-center">
                <GitBranch className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Enux</span>
            </div>

            <nav className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">About</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Contact</a>
            </nav>

            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Enux. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
