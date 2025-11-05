/**
 * Base API Client
 *
 * File ini berisi base API client yang digunakan oleh semua API endpoints.
 * Mengimplementasikan fetch wrapper dengan error handling dan timeout.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle HTTP communication
 * - OCP: Mudah diperluas dengan method baru
 * - DIP: High-level modules depend on abstraction ini
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
import type { APIResponse } from '@/types';

/**
 * Base URL dari environment variable
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Log BASE_URL saat module dimuat
console.log('[API Client] Initialized with BASE_URL:', BASE_URL);

/**
 * Timeout untuk setiap request (30 detik)
 */
const REQUEST_TIMEOUT = 30000;

/**
 * Interface untuk request options
 */
interface RequestOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}

/**
 * Token key - harus sama dengan AuthContext
 */
const TOKEN_KEY = 'auth_token';

/**
 * Get JWT token dari localStorage
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set JWT token ke localStorage
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove JWT token dari localStorage
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Create fetch request dengan timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { timeout = REQUEST_TIMEOUT, ...fetchOptions } = options;

  console.log('[API Client] Request:', {
    url,
    method: fetchOptions.method || 'GET',
    headers: fetchOptions.headers,
    timestamp: new Date().toISOString(),
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    console.log('[API Client] Response:', {
      url,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      timestamp: new Date().toISOString(),
    });

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    console.error('[API Client] Request Failed:', {
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorName: error instanceof Error ? error.name : 'Unknown',
      timestamp: new Date().toISOString(),
    });

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[API Client] Request Timeout:', {
        url,
        timeout,
        timestamp: new Date().toISOString(),
      });
      throw new TimeoutError();
    }

    console.error('[API Client] Network Error:', {
      url,
      message: 'Tidak dapat terhubung ke server',
      baseUrl: BASE_URL,
      timestamp: new Date().toISOString(),
    });
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
    console.log('[API Client] Response Data:', {
      status: response.status,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (parseError) {
    console.error('[API Client] Failed to parse response:', {
      status: response.status,
      statusText: response.statusText,
      error: parseError instanceof Error ? parseError.message : 'Unknown',
      timestamp: new Date().toISOString(),
    });
    // Jika response bukan JSON, buat response object
    data = {
      error: response.statusText || 'Unknown error',
    };
  }

  // Handle success response
  if (response.ok) {
    console.log('[API Client] Success Response:', {
      status: response.status,
      timestamp: new Date().toISOString(),
    });
    
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

  console.error('[API Client] Error Response:', {
    status: response.status,
    errorMessage,
    details: data.details,
    timestamp: new Date().toISOString(),
  });

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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Attach token jika tidak skip auth
    if (!skipAuth) {
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Attach token jika tidak skip auth
    if (!skipAuth) {
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Attach token jika tidak skip auth
    if (!skipAuth) {
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Attach token jika tidak skip auth
    if (!skipAuth) {
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
      ...restOptions,
    });

    return handleResponse<T>(response);
  }
}

/**
 * Export singleton instance
 */
export const apiClient = new APIClient();
