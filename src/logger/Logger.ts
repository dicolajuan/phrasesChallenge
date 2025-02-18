
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

interface LoggerConfig {
  currentLogLevel: LogLevel;
  prefix?: string;
}

export class Logger {
  // 1. Propiedad estática para la instancia única
  private static instance: Logger | null = null;

  private config: LoggerConfig;

  /**
   * 2. Constructor privado: no se puede invocar "new Logger(...)" desde fuera
   */
  private constructor(config: LoggerConfig) {
    this.config = config;
  }

  /**
   * 3. Método público estático para obtener la instancia única.
   *    Si no existe, la crea; si existe, la retorna.
   */
  public static getInstance(config?: LoggerConfig): Logger {
    if (!Logger.instance) {
      // Si no se provee config, usa valores por defecto
      const defaultConfig: LoggerConfig = {
        currentLogLevel: 'info',
        prefix: '[phrases-app]',
      };
      Logger.instance = new Logger(config ?? defaultConfig);
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const order: Record<LogLevel, number> = {
      debug: 10,
      info: 20,
      warn: 30,
      error: 40,
      none: 999,
    };
    return order[level] >= order[this.config.currentLogLevel];
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.config.prefix, '[DEBUG]', ...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(this.config.prefix, '[INFO]', ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.config.prefix, '[WARN]', ...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(this.config.prefix, '[ERROR]', ...args);
    }
  }
}