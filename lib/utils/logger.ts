/**
 * Production-safe Logger
 *
 * Logger yang hanya aktif di development mode.
 * Di production, semua logs di-disable untuk keamanan.
 *
 * @example
 * import { logger } from '@/lib/utils/logger';
 * logger.info('User action', { userId: 123 });
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Sanitize sensitive data from log objects
 */
function sanitize<T extends Record<string, unknown>>(data: T): T {
    if (!data || typeof data !== 'object') return data;

    const sensitiveKeys = [
        'password',
        'token',
        'authorization',
        'cookie',
        'secret',
        'apiKey',
        'api_key',
        'accessToken',
        'refreshToken',
        'kataSandi',
    ];

    const sanitized = { ...data };
    for (const key of Object.keys(sanitized)) {
        if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk.toLowerCase()))) {
            sanitized[key as keyof T] = '[REDACTED]' as T[keyof T];
        }
    }
    return sanitized;
}

/**
 * Production-safe logger
 * - Development: Logs to console
 * - Production: Silent (no logs)
 */
export const logger = {
    /**
     * Log info message (development only)
     */
    info: (message: string, data?: Record<string, unknown>): void => {
        if (isDevelopment) {
            console.log(`[INFO] ${message}`, data ? sanitize(data) : '');
        }
    },

    /**
     * Log warning message (development only)
     */
    warn: (message: string, data?: Record<string, unknown>): void => {
        if (isDevelopment) {
            console.warn(`[WARN] ${message}`, data ? sanitize(data) : '');
        }
    },

    /**
     * Log error message (always log errors, but sanitize)
     */
    error: (message: string, data?: Record<string, unknown>): void => {
        // Errors still logged in production for debugging, but sanitized
        console.error(`[ERROR] ${message}`, data ? sanitize(data) : '');
    },

    /**
     * Log debug message (development only)
     */
    debug: (message: string, data?: Record<string, unknown>): void => {
        if (isDevelopment) {
            console.debug(`[DEBUG] ${message}`, data ? sanitize(data) : '');
        }
    },
};

export default logger;
