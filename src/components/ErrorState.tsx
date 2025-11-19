import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  isRetrying?: boolean;
  errorType?: 'network' | 'server' | 'unknown';
}

/**
 * Composant pour afficher un état d'erreur avec option de retry
 * Utilisé pour les erreurs réseau, serveur, etc.
 */
export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = 'Réessayer',
  isRetrying = false,
  errorType = 'unknown',
}: ErrorStateProps) {
  const defaultTitle = {
    network: 'Problème de connexion',
    server: 'Erreur serveur',
    unknown: 'Une erreur s\'est produite',
  }[errorType];

  const defaultDescription = {
    network: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet et réessayez.',
    server: 'Le serveur a rencontré une erreur. Veuillez réessayer dans quelques instants.',
    unknown: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
  }[errorType];

  const Icon = errorType === 'network' ? WifiOff : AlertCircle;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 justify-center mb-2">
          <Icon className="h-6 w-6 text-destructive" />
          <CardTitle className="text-center">
            {title || defaultTitle}
          </CardTitle>
        </div>
        <CardDescription className="text-center">
          {description || defaultDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {onRetry && (
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            variant="default"
            className="flex items-center gap-2"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Réessai en cours...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                {retryLabel}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

