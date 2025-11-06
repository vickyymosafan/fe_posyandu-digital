'use client';

import { useState, useEffect } from 'react';
import { lansiaAPI, petugasAPI } from '@/lib/api';
import { pemeriksaanRepository, lansiaRepository } from '@/lib/db';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import { checkBackendHealthVerbose } from '@/lib/utils/healthCheck';
import { useAuth } from './useAuth';
import type { UserRole } from '@/types';

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
 * - DIP: Depend pada user role untuk menentukan data yang di-fetch
 * 
 * Hook ini smart: otomatis adjust data yang di-fetch berdasarkan role user
 * - ADMIN: Fetch semua data termasuk petugas
 * - PETUGAS: Hanya fetch data lansia dan pemeriksaan (skip petugas karena tidak punya akses)
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
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch statistics dari API dan IndexedDB
   * Smart function yang adjust berdasarkan user role
   */
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[useDashboardStats] Starting to fetch dashboard statistics...');
      console.log('[useDashboardStats] User role:', user?.role);

      let totalPetugasAktif = 0;
      let totalLansia = 0;

      // Fetch data berdasarkan role
      if (user?.role === 'ADMIN') {
        // Admin: Fetch semua data termasuk petugas
        console.log('[useDashboardStats] Admin mode: Fetching petugas and lansia data...');
        const [petugasResponse, lansiaResponse] = await Promise.all([
          petugasAPI.getAll(),
          lansiaAPI.getAll(),
        ]);

        totalPetugasAktif = petugasResponse.data
          ? petugasResponse.data.filter((p) => p.aktif).length
          : 0;
        totalLansia = lansiaResponse.data ? lansiaResponse.data.length : 0;

        console.log('[useDashboardStats] Admin stats:', {
          totalPetugasAktif,
          totalLansia,
        });
      } else {
        // Petugas: Hanya fetch lansia (tidak punya akses ke petugas endpoint)
        console.log('[useDashboardStats] Petugas mode: Fetching lansia data only...');
        
        // Try fetch from API first, fallback to IndexedDB if offline
        try {
          const lansiaResponse = await lansiaAPI.getAll();
          totalLansia = lansiaResponse.data ? lansiaResponse.data.length : 0;
        } catch (apiError) {
          console.warn('[useDashboardStats] API fetch failed, using IndexedDB fallback');
          const lansiaFromDB = await lansiaRepository.getAll();
          totalLansia = lansiaFromDB.length;
        }

        // Petugas tidak perlu data petugas, set 0
        totalPetugasAktif = 0;

        console.log('[useDashboardStats] Petugas stats:', {
          totalLansia,
        });
      }

      // Hitung pemeriksaan hari ini dari IndexedDB (sama untuk semua role)
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
      
      console.error('❌ [useDashboardStats] Error fetching stats:', errorMessage);
      
      setError(errorMessage);
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
      console.warn('[useDashboardStats] Error fetching trend data:', err);
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

  // Fetch data saat component mount dan saat user berubah
  useEffect(() => {
    // Only fetch if user is authenticated
    if (!user) {
      console.log('[useDashboardStats] No user, skipping fetch');
      setIsLoading(false);
      return;
    }

    // Check backend health first
    checkBackendHealthVerbose()
      .then(() => {
        fetchStats();
      })
      .catch((err) => {
        console.error('[useDashboardStats] Backend health check failed:', err);
        setError('Backend tidak dapat diakses');
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency - only run once on mount

  return {
    stats,
    trendData,
    isLoading,
    error,
    refetch,
  };
}
