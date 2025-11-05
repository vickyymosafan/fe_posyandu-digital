/**
 * Petugas API
 *
 * File ini berisi API endpoints untuk manajemen data petugas (Admin only).
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle petugas-related endpoints
 * - ISP: Hanya expose method yang relevan untuk petugas
 */

import { apiClient } from './client';
import type { APIResponse, Petugas, CreatePetugasData, UpdateStatusPetugasData } from '@/types';

/**
 * Petugas API Class
 */
class PetugasAPI {
  /**
   * Create petugas baru (Admin only)
   * POST /petugas
   */
  async create(data: CreatePetugasData): Promise<APIResponse<Petugas>> {
    return apiClient.post<Petugas>('/petugas', data);
  }

  /**
   * Get semua petugas (Admin only)
   * GET /petugas
   */
  async getAll(): Promise<APIResponse<Petugas[]>> {
    return apiClient.get<Petugas[]>('/petugas');
  }

  /**
   * Update status petugas (Admin only)
   * PATCH /petugas/:id/status
   */
  async updateStatus(
    id: number,
    data: UpdateStatusPetugasData
  ): Promise<APIResponse<Petugas>> {
    return apiClient.patch<Petugas>(`/petugas/${id}/status`, data);
  }
}

/**
 * Export singleton instance
 */
export const petugasAPI = new PetugasAPI();
