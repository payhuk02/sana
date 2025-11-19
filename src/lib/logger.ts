/**
 * Utilitaire de logging pour remplacer console.log/error
 * En production, les logs sont désactivés ou envoyés à un service de monitoring
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  context?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  private formatMessage(level: LogLevel, message: string, data?: unknown, context?: string): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      context,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    // En développement, on log tout
    if (this.isDevelopment) {
      return true;
    }

    // En production, on log seulement les warnings et erreurs
    if (this.isProduction) {
      return level === 'warn' || level === 'error';
    }

    return false;
  }

  private log(level: LogLevel, message: string, data?: unknown, context?: string) {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.formatMessage(level, message, data, context);
    const prefix = context ? `[${context}]` : '';

    switch (level) {
      case 'debug':
        console.debug(`🔍 ${prefix}`, message, data || '');
        break;
      case 'info':
        console.info(`ℹ️ ${prefix}`, message, data || '');
        break;
      case 'warn':
        console.warn(`⚠️ ${prefix}`, message, data || '');
        break;
      case 'error':
        console.error(`❌ ${prefix}`, message, data || '');
        // En production, envoyer à un service de monitoring (ex: Sentry)
        if (this.isProduction) {
          // TODO: Intégrer un service de monitoring
          // Example: Sentry.captureException(new Error(message), { extra: data });
        }
        break;
    }
  }

  debug(message: string, data?: unknown, context?: string) {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: unknown, context?: string) {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: unknown, context?: string) {
    this.log('warn', message, data, context);
  }

  error(message: string, error?: unknown, context?: string) {
    // Si c'est une Error, extraire le message et la stack
    if (error instanceof Error) {
      this.log('error', `${message}: ${error.message}`, { stack: error.stack, error }, context);
    } else {
      this.log('error', message, error, context);
    }
  }
}

// Export une instance singleton
export const logger = new Logger();

// Export aussi la classe pour les tests
export { Logger };

