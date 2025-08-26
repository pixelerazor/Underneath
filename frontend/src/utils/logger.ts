/**
 * Application Logger
 * 
 * Centralized logging system that respects environment settings
 * Provides different log levels and formatting for development vs production
 * 
 * @author Underneath Team
 * @version 2.0.0
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

class Logger {
  private level: LogLevel;
  private isDevelopment: boolean;
  
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    
    // Set log level based on environment
    if (this.isDevelopment) {
      this.level = LogLevel.DEBUG;
    } else {
      // Production: only warnings and errors
      this.level = LogLevel.WARN;
    }
  }
  
  /**
   * Format log message with timestamp and context
   */
  private formatMessage(level: string, context: string, message: any): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()} [${context}] ${message}`;
  }
  
  /**
   * Debug logging - only in development
   */
  debug(context: string, message: any, ...args: any[]): void {
    if (this.level <= LogLevel.DEBUG && this.isDevelopment) {
      console.debug(this.formatMessage('debug', context, message), ...args);
    }
  }
  
  /**
   * Info logging - development and staging
   */
  info(context: string, message: any, ...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      console.info(this.formatMessage('info', context, message), ...args);
    }
  }
  
  /**
   * Warning logging - all environments
   */
  warn(context: string, message: any, ...args: any[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(this.formatMessage('warn', context, message), ...args);
    }
  }
  
  /**
   * Error logging - all environments, always visible
   */
  error(context: string, message: any, error?: Error): void {
    if (this.level <= LogLevel.ERROR) {
      const errorMessage = this.formatMessage('error', context, message);
      console.error(errorMessage, error || '');
      
      // In production, also send to error reporting service
      if (!this.isDevelopment && error instanceof Error) {
        this.reportError(context, message, error);
      }
    }
  }
  
  /**
   * Performance logging - measure execution time
   */
  time(context: string, label: string): void {
    if (this.isDevelopment) {
      console.time(`[${context}] ${label}`);
    }
  }
  
  timeEnd(context: string, label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(`[${context}] ${label}`);
    }
  }
  
  /**
   * Group logging for complex operations
   */
  group(context: string, label: string): void {
    if (this.isDevelopment) {
      console.group(`[${context}] ${label}`);
    }
  }
  
  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }
  
  /**
   * API request/response logging
   */
  api(method: string, url: string, status?: number, duration?: number): void {
    if (this.isDevelopment) {
      const statusEmoji = status ? (status < 400 ? '✅' : '❌') : '⏳';
      const durationText = duration ? ` (${duration}ms)` : '';
      console.log(`${statusEmoji} ${method.toUpperCase()} ${url}${durationText}`);
    }
  }
  
  /**
   * Report errors to external service (placeholder)
   */
  private reportError(context: string, message: string, error: Error): void {
    // TODO: Integrate with error reporting service like Sentry
    // For now, just ensure it's logged to console
    console.error(`[ERROR REPORT] ${context}: ${message}`, error);
  }
  
  /**
   * Set log level dynamically
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }
  
  /**
   * Check if specific log level is enabled
   */
  isEnabled(level: LogLevel): boolean {
    return this.level <= level;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience methods
export const log = {
  debug: (context: string, message: any, ...args: any[]) => logger.debug(context, message, ...args),
  info: (context: string, message: any, ...args: any[]) => logger.info(context, message, ...args),
  warn: (context: string, message: any, ...args: any[]) => logger.warn(context, message, ...args),
  error: (context: string, message: any, error?: Error) => logger.error(context, message, error),
  time: (context: string, label: string) => logger.time(context, label),
  timeEnd: (context: string, label: string) => logger.timeEnd(context, label),
  group: (context: string, label: string) => logger.group(context, label),
  groupEnd: () => logger.groupEnd(),
  api: (method: string, url: string, status?: number, duration?: number) => logger.api(method, url, status, duration)
};

export default logger;