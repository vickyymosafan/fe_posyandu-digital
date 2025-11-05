/**
 * Auth API
 *
 * File ini berisi API endpoints untuk autentikasi.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle auth-related endpoints
 * - ISP: Hanya expose method yang relevan untuk auth
 */

import { apiClient, setToken, removeToken } from './client';
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
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      {
        email,
        kataSandi: password,
      } as LoginRequest,
      { skipAuth: true } // Skip auth untuk login
    );

    // Simpan token jika login berhasil
    if (response.data?.token) {
      setToken(response.data.token);
    }

    return response;
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
