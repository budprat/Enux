// ============================================================================
// ENUX - Error Boundary Component
// ============================================================================

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log error to console in development
    if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }

    // TODO: Send error to monitoring service (Sentry, etc.)
    // if (import.meta.env.VITE_SENTRY_DSN) {
    //   Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred. We apologize for the inconvenience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error details (only in development) */}
              {(import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true') && this.state.error && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-mono text-destructive mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer hover:text-foreground">
                        View component stack
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={this.handleReset}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={this.handleReload}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={this.handleGoHome}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Support message */}
              <p className="text-xs text-center text-muted-foreground">
                If this problem persists, please contact support or try again later.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary wrapper for use with React Query errors
interface QueryErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

export function QueryErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <Card className="border-destructive/50">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-destructive/10 rounded-full">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-destructive">Failed to load data</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message || 'An error occurred while fetching data.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={resetError}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ErrorBoundary;
