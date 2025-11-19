import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isRetrying: boolean;
}

const MAX_RETRY_ATTEMPTS = 3;

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Logger l'erreur avec notre système de logging
    logger.error('ErrorBoundary caught an error', error, 'ErrorBoundary');
    
    // Logger les détails supplémentaires en développement
    if (import.meta.env.DEV) {
      logger.debug('Error details', {
        componentStack: errorInfo.componentStack,
        errorBoundary: errorInfo,
      }, 'ErrorBoundary');
    }

    // Appeler le callback personnalisé si fourni
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
    });
  };

  handleRetry = async () => {
    const { retryCount } = this.state;
    
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      logger.warn('Max retry attempts reached', { retryCount }, 'ErrorBoundary');
      return;
    }

    this.setState({ isRetrying: true });

    // Attendre un peu avant de réessayer
    await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: retryCount + 1,
      isRetrying: false,
    });

    logger.info('ErrorBoundary retry attempt', { attempt: retryCount + 1 }, 'ErrorBoundary');
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <CardTitle>Une erreur s'est produite</CardTitle>
              </div>
              <CardDescription>
                Désolé, quelque chose s'est mal passé. Veuillez réessayer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {import.meta.env.DEV && this.state.error && (
                <div className="rounded-md bg-muted p-4">
                  <p className="font-mono text-sm text-destructive">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-muted-foreground">
                        Détails techniques
                      </summary>
                      <pre className="mt-2 overflow-auto text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                {this.state.retryCount < MAX_RETRY_ATTEMPTS && (
                  <Button 
                    onClick={this.handleRetry} 
                    variant="default"
                    disabled={this.state.isRetrying}
                    className="flex items-center gap-2"
                  >
                    {this.state.isRetrying ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Réessai en cours...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Réessayer ({this.state.retryCount + 1}/{MAX_RETRY_ATTEMPTS})
                      </>
                    )}
                  </Button>
                )}
                <Button
                  onClick={this.handleReset}
                  variant={this.state.retryCount >= MAX_RETRY_ATTEMPTS ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Réinitialiser
                </Button>
                <Button
                  onClick={() => (window.location.href = '/')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Retour à l'accueil
                </Button>
              </div>
              
              {this.state.retryCount >= MAX_RETRY_ATTEMPTS && (
                <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Trop de tentatives</p>
                  <p>Veuillez réinitialiser ou retourner à l'accueil. Si le problème persiste, contactez le support.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

