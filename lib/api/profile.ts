/**
 * Profile API
 *
 * File ini berisi API endpoints untuk manajemen profil user.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle profile-related endpoints
 * - ISP: Hanya expose method yang relevan untuk profile
 */

import { apiClient } from './client';
import type { APIResponse, User, UpdateNamaData, UpdatePasswordData } from '@/types';

/**
 * Profile API Class
 */
class ProfileAPI {
  /**
   * Get user profile
   * GET /profile
   */
  async get(): Promise<APIResponse<User>> {
    return apiClient.get<User>('/profile');
  }

  /**
   * Update nama user
   * PATCH /profile/nama
   */
  async updateNama(data: UpdateNamaData): Promise<APIResponse<User>> {
    return apiClient.patch<User>('/profile/nama', data);
  }

  /**
   * Update password user
   * PATCH /profile/password
   */
  async updatePassword(data: UpdatePasswordData): Promise<APIResponse<void>> {
    return apiClient.patch<void>('/profile/password', data);
  }
}

/**
 * Export singleton instance
 */
export const profileAPI = new ProfileAPI();
