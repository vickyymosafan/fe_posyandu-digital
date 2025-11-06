'use client';

import { useState, useEffect, useCallback } from 'react';
import { petugasAPI } from '@/lib/api';
import { Petugas } from '@/types';
import { useNotification } from '@/components/ui';
import { handleAPIError } from '@/lib/utils/errors';

/**
 * Interface untuk return value hook usePetugasList
 */
interface UsePetugasListReturn {
  petugas: Petugas[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  toggleStatus: (id: number, currentStatus: boolean) => Promise<boolean>;
}

/**
 * Custom hook untuk mengelola data petugas
 * 
 * Responsibilities:
 * - Fetch data petugas dari API
 * - Update status petugas (aktif/nonaktif)
 * - Handle loading dan error states
 * - Provide refetch function untuk refresh data
 * 
 * Design Principles:
 * - SRP: Single responsibility untuk petugas data management
 * - DIP: Depends on petugasAPI abstraction
 * - SoC: Separates data logic from UI
 * 
 * @returns {UsePetugasListReturn} Object dengan petugas data dan functions
 */
export function usePetugasList(): UsePetugasListReturn {
  const [petugas, setPetugas] = useState<Petugas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  /**
   * Fetch data petugas dari API
   * Menggunakan useCallback untuk memoization
   */
  const fetchPetugas = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await petugasAPI.getAll();

      if (response.data) {
        setPetugas(response.data);
      } else {
        throw new Error(response.error || 'Gagal mengambil data petugas');
      }
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      showNotification('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  /**
   * Toggle status petugas (aktif/nonaktif)
   * 
   * @param id - ID petugas
   * @param currentStatus - Status aktif saat ini
   * @returns Promise<boolean> - true jika berhasil, false jika gagal
   */
  const toggleStatus = useCallback(
    async (id: number, currentStatus: boolean): Promise<boolean> => {
      try {
        const newStatus = !currentStatus;
        const response = await petugasAPI.updateStatus(id, {
          aktif: newStatus,
        });

        if (response.data) {
          // Update local state
          setPetugas((prev) =>
            prev.map((p) => (p.id === id ? { ...p, aktif: newStatus } : p))
          );

          showNotification(
            'success',
            `Petugas berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`
          );

          return true;
        } else {
          throw new Error(response.error || 'Gagal mengubah status petugas');
        }
      } catch (err) {
        const errorMessage = handleAPIError(err);
        showNotification('error', errorMessage);
        return false;
      }
    },
    [showNotification]
  );

  /**
   * Refetch data petugas
   * Exposed untuk manual refresh
   */
  const refetch = useCallback(async () => {
    await fetchPetugas();
  }, [fetchPetugas]);

  // Fetch data on mount
  useEffect(() => {
    fetchPetugas();
  }, [fetchPetugas]);

  return {
    petugas,
    isLoading,
    error,
    refetch,
    toggleStatus,
  };
}
