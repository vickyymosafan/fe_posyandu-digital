/**
 * Constants Index
 * 
 * Central export untuk semua constants yang digunakan di aplikasi.
 * Mengikuti prinsip DRY dan memudahkan import.
 */

export { ROUTES } from './navigation';
export * from './config';

// Re-export commonly used constants for convenience
export {
  API_REQUEST_TIMEOUT_MS,
  NOTIFICATION_DURATION_MS,
  PATIENT_ID_PREFIX,
  HEALTH_LIMITS,
} from './config';
