/**
 * Base API Client
 *
 * File ini berisi base API client yang digunakan oleh semua API endpoints.
 * Mengimplementasikan fetch wrapper dengan error handling dan timeout.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle HTTP communication (token management di tokenStorage.ts)
 * - OCP: Mudah diperluas dengan method baru
 * - DIP: High-level modules depend on abstraction ini
 * - DRY: Extracted common logic to helper functions
 * - Security: No sensitive data logging in production
 */

import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  NetworkError,
  NotFoundError,
  ServerError,
  TimeoutError,
  ValidationError,
} from '../utils/errors';
import { getToken, removeToken } from '../utils/tokenStorage';
import { API_REQUEST_TIMEOUT_MS } from '@/lib/constants';
import type { APIResponse } from '@/types';
import { logger } from '../utils/logger';

/**
 * Base URL dari environment variable
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-posyandu-digital.vercel.app';

/**
 * Interface untuk request options
 */
interface RequestOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}

/**
 * Build request headers with optional authentication
 * Extracted to reduce duplication across HTTP methods
 */
function buildHeaders(skipAuth: boolean): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Create fetch request dengan timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { timeout = API_REQUEST_TIMEOUT_MS, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError();
    }

    throw new NetworkError();
  }
}

/**
 * Handle response berdasarkan status code
 */
async function handleResponse<T>(response: Response): Promise<APIResponse<T>> {
  // Parse response body
  let data: APIResponse<T>;
  try {
    data = await response.json();
  } catch {
    // Jika response bukan JSON, buat response object
    data = {
      error: response.statusText || 'Unknown error',
    };
  }

  // Handle success response
  if (response.ok) {
    // Backend return data langsung tanpa wrapper "data"
    // Wrap ke format APIResponse jika belum
    if (!('data' in data) && !('error' in data)) {
      // Response dari backend adalah data langsung, wrap ke APIResponse format
      return {
        data: data as T,
      };
    }

    return data;
  }

  // Handle error response berdasarkan status code
  const errorMessage = data.error || 'Terjadi kesalahan';

  // Log error for debugging (sanitized in production)
  logger.error('API Error', { status: response.status, message: errorMessage });

  switch (response.status) {
    case 400:
      throw new ValidationError(errorMessage, data.details);
    case 401:
      // Clear token dan redirect ke login
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new AuthenticationError(errorMessage);
    case 403:
      throw new AuthorizationError(errorMessage);
    case 404:
      throw new NotFoundError(errorMessage);
    case 500:
    case 502:
    case 503:
      throw new ServerError(errorMessage);
    default:
      throw new AppError(errorMessage, response.status);
  }
}

/**
 * Base API Client Class
 */
class APIClient {
  /**
   * GET request
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<APIResponse<T>> {
    const { skipAuth = false, ...restOptions } = options;

    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: buildHeaders(skipAuth),
      ...restOptions,
    });

    return handleResponse<T>(response);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    const { skipAuth = false, ...restOptions } = options;

    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(skipAuth),
      body: body ? JSON.stringify(body) : undefined,
      ...restOptions,
    });

    return handleResponse<T>(response);
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    const { skipAuth = false, ...restOptions } = options;

    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: buildHeaders(skipAuth),
      body: body ? JSON.stringify(body) : undefined,
      ...restOptions,
    });

    return handleResponse<T>(response);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<APIResponse<T>> {
    const { skipAuth = false, ...restOptions } = options;

    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: buildHeaders(skipAuth),
      ...restOptions,
    });

    return handleResponse<T>(response);
  }
}

/**
 * Export singleton instance
 */
export const apiClient = new APIClient();
