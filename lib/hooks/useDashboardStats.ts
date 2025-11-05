'use client';

import { useState, useEffect } from 'react';
import { lansiaAPI, petugasAPI } from '@/lib/api';
import { pemeriksaanRepository } from '@/lib/db';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import { checkBackendHealthVerbose } from '@/lib/utils/healthCheck';

/**
 * Interface untuk statistik dashboard
 */
export interface DashboardStats {
  totalPetugasAktif: number;
  totalLansia: number;
  totalPemeriksaanHariIni: number;
}

/**
 * Interface untuk data tren pemeriksaan
 */
export interface TrendData {
  tanggal: string;
  jumlah: number;
}

/**
 * Interface untuk return value hook
 */
export interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  trendData: TrendData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook untuk fetch dashboard statistics
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya bertanggung jawab untuk fetch dan aggregate data statistik
 * - SoC: Memisahkan data fetching logic dari UI component
 * - DRY: Reusable di berbagai dashboard component
 * 
 * @returns {UseDashboardStatsReturn} Stats, trend data, loading state, error, dan refetch function
 * 
 * @example
 * ```tsx
 * const { stats, trendData, isLoading, error } = useDashboardStats();
 * 
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error} />;
 * 
 * return (
 *   <div>
 *     <StatCard label="Total Petugas" value={stats.totalPetugasAktif} />
 *     <TrendChart data={trendData} />
 *   </div>
 * );
 * ```
 */
export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch statistics dari API dan IndexedDB
   */
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[useDashboardStats] Starting to fetch dashboard statistics...');

      // Fetch data secara parallel untuk performa lebih baik
      console.log('[useDashboardStats] Fetching petugas and lansia data from API...');
      const [petugasResponse, lansiaResponse] = await Promise.all([
        petugasAPI.getAll(),
        lansiaAPI.getAll(),
      ]);

      console.log('[useDashboardStats] API responses received:', {
        petugasResponse,
        lansiaResponse,
      });

      // Hitung jumlah petugas aktif
      const totalPetugasAktif = petugasResponse.data
        ? petugasResponse.data.filter((p) => p.aktif).length
        : 0;

      // Hitung total lansia
      const totalLansia = lansiaResponse.data ? lansiaResponse.data.length : 0;

      console.log('[useDashboardStats] Calculated stats:', {
        totalPetugasAktif,
        totalLansia,
      });

      // Hitung pemeriksaan hari ini dari IndexedDB
      console.log('[useDashboardStats] Fetching pemeriksaan from IndexedDB...');
      const today = new Date();
      const startToday = startOfDay(today);
      const endToday = endOfDay(today);
      const pemeriksaanHariIni = await pemeriksaanRepository.getByDateRange(
        startToday,
        endToday
      );
      const totalPemeriksaanHariIni = pemeriksaanHariIni.length;

      console.log('[useDashboardStats] Pemeriksaan hari ini:', totalPemeriksaanHariIni);

      setStats({
        totalPetugasAktif,
        totalLansia,
        totalPemeriksaanHariIni,
      });

      // Fetch trend data untuk 7 hari terakhir
      console.log('[useDashboardStats] Fetching trend data...');
      await fetchTrendData();

      console.log('[useDashboardStats] ✅ Successfully fetched all dashboard data');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal memuat data statistik';
      
      // FAIL FAST: Log error dengan detail lengkap
      console.error('❌ [useDashboardStats] CRITICAL ERROR - Dashboard failed to load!');
      console.error('❌ [useDashboardStats] Error message:', errorMessage);
      console.error('❌ [useDashboardStats] Error object:', err);
      console.error('❌ [useDashboardStats] Error stack:', err instanceof Error ? err.stack : 'No stack trace');
      
      setError(errorMessage);
      
      // FAIL FAST: Throw error untuk stop execution
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch trend data pemeriksaan 7 hari terakhir
   */
  const fetchTrendData = async () => {
    try {
      console.log('[useDashboardStats] Fetching trend data for last 7 days...');
      const today = new Date();
      const trends: TrendData[] = [];

      // Loop 7 hari terakhir
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const startDate = startOfDay(date);
        const endDate = endOfDay(date);

        // Get pemeriksaan untuk tanggal tersebut dari IndexedDB
        const pemeriksaan = await pemeriksaanRepository.getByDateRange(
          startDate,
          endDate
        );

        trends.push({
          tanggal: format(date, 'dd/MM'),
          jumlah: pemeriksaan.length,
        });
      }

      console.log('[useDashboardStats] Trend data fetched:', trends);
      setTrendData(trends);
    } catch (err) {
      console.error('❌ [useDashboardStats] Error fetching trend data:', err);
      console.error('❌ [useDashboardStats] Trend error stack:', err instanceof Error ? err.stack : 'No stack trace');
      // Tidak set error karena trend data bersifat optional
      setTrendData([]);
    }
  };

  /**
   * Refetch data
   */
  const refetch = async () => {
    await fetchStats();
  };

  // Fetch data saat component mount
  useEffect(() => {
    // Check backend health first
    checkBackendHealthVerbose().then(() => {
      fetchStats();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    stats,
    trendData,
    isLoading,
    error,
    refetch,
  };
}
