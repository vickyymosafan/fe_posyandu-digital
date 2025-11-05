/**
 * Pemeriksaan API
 *
 * File ini berisi API endpoints untuk manajemen data pemeriksaan kesehatan.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle pemeriksaan-related endpoints
 * - ISP: Hanya expose method yang relevan untuk pemeriksaan
 */

import { apiClient } from './client';
import type {
  APIResponse,
  Pemeriksaan,
  PemeriksaanFisikData,
  PemeriksaanKesehatanData,
  PemeriksaanGabunganData,
} from '@/types';

/**
 * Pemeriksaan API Class
 */
class PemeriksaanAPI {
  /**
   * Create pemeriksaan fisik
   * POST /lansia/:kode/pemeriksaan/fisik
   */
  async createFisik(
    kode: string,
    data: PemeriksaanFisikData
  ): Promise<APIResponse<Pemeriksaan>> {
    return apiClient.post<Pemeriksaan>(`/lansia/${kode}/pemeriksaan/fisik`, data);
  }

  /**
   * Create pemeriksaan kesehatan
   * POST /lansia/:kode/pemeriksaan/kesehatan
   */
  async createKesehatan(
    kode: string,
    data: PemeriksaanKesehatanData
  ): Promise<APIResponse<Pemeriksaan>> {
    return apiClient.post<Pemeriksaan>(`/lansia/${kode}/pemeriksaan/kesehatan`, data);
  }

  /**
   * Create pemeriksaan gabungan (fisik + kesehatan)
   * POST /lansia/:kode/pemeriksaan
   */
  async createGabungan(
    kode: string,
    data: PemeriksaanGabunganData
  ): Promise<APIResponse<Pemeriksaan>> {
    return apiClient.post<Pemeriksaan>(`/lansia/${kode}/pemeriksaan`, data);
  }
}

/**
 * Export singleton instance
 */
export const pemeriksaanAPI = new PemeriksaanAPI();
