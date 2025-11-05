/**
 * Lansia API
 *
 * File ini berisi API endpoints untuk manajemen data lansia.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle lansia-related endpoints
 * - ISP: Hanya expose method yang relevan untuk lansia
 */

import { apiClient } from './client';
import type { APIResponse, Lansia, CreateLansiaData, MinimalLansia, Pemeriksaan } from '@/types';

/**
 * Lansia API Class
 */
class LansiaAPI {
  /**
   * Create lansia baru
   * POST /lansia
   */
  async create(data: CreateLansiaData): Promise<APIResponse<Lansia>> {
    return apiClient.post<Lansia>('/lansia', data);
  }

  /**
   * Get semua lansia
   * GET /lansia
   */
  async getAll(): Promise<APIResponse<Lansia[]>> {
    return apiClient.get<Lansia[]>('/lansia');
  }

  /**
   * Get lansia by kode
   * GET /lansia/:kode
   */
  async getByKode(kode: string): Promise<APIResponse<Lansia>> {
    return apiClient.get<Lansia>(`/lansia/${kode}`);
  }

  /**
   * Get riwayat pemeriksaan lansia
   * GET /lansia/:kode/pemeriksaan
   */
  async getPemeriksaan(kode: string): Promise<APIResponse<Pemeriksaan[]>> {
    return apiClient.get<Pemeriksaan[]>(`/lansia/${kode}/pemeriksaan`);
  }

  /**
   * Find lansia (minimal data untuk search)
   * POST /find
   */
  async find(query: string): Promise<APIResponse<MinimalLansia[]>> {
    return apiClient.post<MinimalLansia[]>('/find', { query });
  }
}

/**
 * Export singleton instance
 */
export const lansiaAPI = new LansiaAPI();
