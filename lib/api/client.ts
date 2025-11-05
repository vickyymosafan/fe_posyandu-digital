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
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
 * Get JWT token dari localStorage
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Set JWT token ke localStorage
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
}

/**
 * Remove JWT token dari localStorage
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}

/**
 * Create fetch request dengan timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { timeout = REQUEST_TIMEOUT, ...fetchOptions } = options;

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
    return data;
  }

  // Handle error response berdasarkan status code
  const errorMessage = data.error || 'Terjadi kesalahan';

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
