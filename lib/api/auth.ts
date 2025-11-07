/**
 * Auth API
 *
 * File ini berisi API endpoints untuk autentikasi.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle auth-related endpoints
 * - ISP: Hanya expose method yang relevan untuk auth
 */

import { apiClient } from './client';
import { setToken, removeToken } from '../utils/tokenStorage';
import type { APIResponse, User } from '@/types';

/**
 * Interface untuk login request
 */
interface LoginRequest {
  email: string;
  kataSandi: string;
}

/**
 * Interface untuk login response
 */
interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Auth API Class
 */
class AuthAPI {
  /**
   * Login user
   * POST /auth/login
   */
  async login(email: string, password: string): Promise<APIResponse<LoginResponse>> {
    console.log('[AuthAPI] Login request:', {
      email,
      endpoint: '/auth/login',
      timestamp: new Date().toISOString(),
    });

    try {
      const response = await apiClient.post<LoginResponse>(
        '/auth/login',
        {
          email,
          kataSandi: password,
        } as LoginRequest,
        { skipAuth: true } // Skip auth untuk login
      );

      console.log('[AuthAPI] Login response:', {
        hasData: !!response.data,
        hasToken: !!response.data?.token,
        hasUser: !!response.data?.user,
        hasError: !!response.error,
        response: response,
        timestamp: new Date().toISOString(),
      });

      // Simpan token jika login berhasil
      if (response.data?.token) {
        setToken(response.data.token);
        console.log('[AuthAPI] Token saved to localStorage');
      }

      return response;
    } catch (error) {
      console.error('[AuthAPI] Login failed (caught error):', {
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        timestamp: new Date().toISOString(),
      });

      // Return APIResponse format dengan error
      // Jangan throw, biar AuthContext bisa handle dengan konsisten
      return {
        error: error instanceof Error ? error.message : 'Login gagal',
      };
    }
  }

  /**
   * Logout user
   * POST /auth/logout
   */
  async logout(): Promise<APIResponse<void>> {
    const response = await apiClient.post<void>('/auth/logout');

    // Hapus token dari localStorage
    removeToken();

    return response;
  }
}

/**
 * Export singleton instance
 */
export const authAPI = new AuthAPI();
