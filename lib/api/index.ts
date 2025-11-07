/**
 * API Index
 *
 * File ini mengexport semua API clients untuk kemudahan import.
 *
 * Usage:
 * import { authAPI, lansiaAPI, pemeriksaanAPI } from '@/lib/api';
 */

export { apiClient } from './client';
export { authAPI } from './auth';
export { lansiaAPI } from './lansia';
export { pemeriksaanAPI } from './pemeriksaan';
export { petugasAPI } from './petugas';
export { profileAPI } from './profile';

// Re-export error classes untuk kemudahan
export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  TimeoutError,
  ServerError,
  NetworkError,
  handleAPIError,
} from '../utils/errors';
