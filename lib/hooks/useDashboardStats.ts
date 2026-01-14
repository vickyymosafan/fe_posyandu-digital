'use client';

/**
 * useDashboardStats Hook
 *
 * Hook untuk fetch dashboard statistics menggunakan TanStack Query.
 * Menggunakan aggregation endpoint untuk optimal performance.
 *
 * Prinsip yang diterapkan:
 * - SRP: Hanya bertanggung jawab untuk fetch dan cache data statistik
 * - SoC: Memisahkan data fetching logic dari UI component
 * - DRY: Reusable di berbagai dashboard component
 * - Performance: Single API call dengan caching bawaan
 *
 * @returns UseDashboardStatsReturn dengan stats, loading state, error, dan refetch
 *
 * @example
 * ```tsx
 * const { data: stats, isLoading, error, refetch } = useDashboardStats();
 *
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 *
 * return (
 *   <div>
 *     <StatCard label="Total Petugas Aktif" value={stats.totalPetugasAktif} />
 *     <TrendChart data={stats.trendData} />
 *   </div>
 * );
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardAPI, type DashboardStats } from '@/lib/api/dashboard';
import { useAuth } from './useAuth';

/**
 * Query key untuk dashboard stats
 * Digunakan untuk cache invalidation
 */
export const DASHBOARD_STATS_KEY = ['dashboard', 'stats'] as const;

/**
 * Custom hook untuk fetch dashboard statistics
 */
export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: DASHBOARD_STATS_KEY,
    queryFn: async () => {
      const response = await dashboardAPI.getStats();
      if (response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Gagal memuat statistik dashboard');
    },
    // Hanya fetch jika user sudah login
    enabled: !!user,
    // Stats berubah cukup sering, stale time 2 menit
    staleTime: 2 * 60 * 1000,
    // Retry 1x jika gagal
    retry: 1,
    // Refetch saat window focus untuk data terbaru
    refetchOnWindowFocus: true,
  });
}

/**
 * Interface untuk backward compatibility
 * Digunakan oleh komponen lama yang masih menggunakan format lama
 */
export interface DashboardStatsLegacy {
  totalPetugasAktif: number;
  totalLansia: number;
  totalPemeriksaanHariIni: number;
}

export interface TrendData {
  tanggal: string;
  jumlah: number;
}

export interface UseDashboardStatsReturn {
  stats: DashboardStatsLegacy | null;
  trendData: TrendData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Legacy hook untuk backward compatibility
 * Gunakan useDashboardStats() untuk implementasi baru
 *
 * @deprecated Use useDashboardStats() instead
 */
export function useDashboardStatsLegacy(): UseDashboardStatsReturn {
  const { data, isLoading, error, refetch } = useDashboardStats();

  return {
    stats: data
      ? {
        totalPetugasAktif: data.totalPetugasAktif,
        totalLansia: data.totalLansia,
        totalPemeriksaanHariIni: data.totalPemeriksaanHariIni,
      }
      : null,
    trendData: data?.trendData || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch: async () => {
      await refetch();
    },
  };
}

// Re-export DashboardStats type
export type { DashboardStats };
