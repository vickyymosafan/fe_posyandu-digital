/**
 * Dashboard API
 *
 * File ini berisi API endpoints untuk dashboard statistics.
 * Menggunakan aggregation endpoint untuk optimal performance.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle dashboard-related endpoints
 * - Performance: Single API call untuk multiple stats
 */

import { apiClient } from './client';
import type { APIResponse } from '@/types';

/**
 * Interface untuk trend data item
 */
export interface TrendDataItem {
    tanggal: string;
    jumlah: number;
}

/**
 * Interface untuk dashboard statistics
 */
export interface DashboardStats {
    totalPetugasAktif: number;
    totalLansia: number;
    totalPemeriksaanHariIni: number;
    trendData: TrendDataItem[];
}

/**
 * Dashboard API Class
 */
class DashboardAPI {
    /**
     * Get aggregated dashboard statistics
     * GET /dashboard/stats
     *
     * Mengembalikan semua statistik dashboard dalam satu call:
     * - totalPetugasAktif
     * - totalLansia
     * - totalPemeriksaanHariIni
     * - trendData (7 hari terakhir)
     */
    async getStats(): Promise<APIResponse<DashboardStats>> {
        return apiClient.get<DashboardStats>('/dashboard/stats');
    }
}

/**
 * Export singleton instance
 */
export const dashboardAPI = new DashboardAPI();
