import { useState, useEffect, useCallback } from 'react';
import { lansiaAPI } from '@/lib/api';
import { Pemeriksaan } from '@/types';
import { handleAPIError } from '@/lib/utils/errors';

/**
 * Interface untuk return value hook
 */
interface UseRiwayatPemeriksaanReturn {
  /** Data pemeriksaan yang sudah difilter */
  pemeriksaan: Pemeriksaan[];
  /** Data pemeriksaan asli (tanpa filter) */
  allPemeriksaan: Pemeriksaan[];
  /** Status loading */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Tanggal mulai filter */
  startDate: string;
  /** Tanggal akhir filter */
  endDate: string;
  /** Handler untuk set tanggal mulai */
  setStartDate: (date: string) => void;
  /** Handler untuk set tanggal akhir */
  setEndDate: (date: string) => void;
  /** Handler untuk clear filter */
  clearFilter: () => void;
  /** Handler untuk refetch data */
  refetch: () => Promise<void>;
}

/**
 * Custom hook untuk mengelola data riwayat pemeriksaan dengan filtering
 * 
 * Features:
 * - Fetch data pemeriksaan dari API
 * - Filter by date range (client-side)
 * - Loading dan error state management
 * - Refetch capability
 * 
 * @param kode - Kode unik lansia
 * @returns Object dengan data dan handlers
 */
export function useRiwayatPemeriksaan(kode: string): UseRiwayatPemeriksaanReturn {
  const [allPemeriksaan, setAllPemeriksaan] = useState<Pemeriksaan[]>([]);
  const [filteredPemeriksaan, setFilteredPemeriksaan] = useState<Pemeriksaan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  /**
   * Fetch data pemeriksaan dari API
   */
  const fetchPemeriksaan = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await lansiaAPI.getPemeriksaan(kode);
      
      if (response.data) {
        // Convert tanggal string to Date objects
        const pemeriksaanData = response.data.map((p) => ({
          ...p,
          tanggal: new Date(p.tanggal),
          createdAt: new Date(p.createdAt),
        }));

        // Sort by tanggal descending (terbaru dulu)
        pemeriksaanData.sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime());

        setAllPemeriksaan(pemeriksaanData);
        setFilteredPemeriksaan(pemeriksaanData);
      } else {
        setAllPemeriksaan([]);
        setFilteredPemeriksaan([]);
      }
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      setAllPemeriksaan([]);
      setFilteredPemeriksaan([]);
    } finally {
      setIsLoading(false);
    }
  }, [kode]);

  /**
   * Filter pemeriksaan by date range
   */
  const filterPemeriksaan = useCallback(() => {
    if (!startDate && !endDate) {
      // No filter, show all
      setFilteredPemeriksaan(allPemeriksaan);
      return;
    }

    const filtered = allPemeriksaan.filter((p) => {
      const pemeriksaanDate = new Date(p.tanggal);
      pemeriksaanDate.setHours(0, 0, 0, 0); // Reset time untuk comparison

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return pemeriksaanDate >= start && pemeriksaanDate <= end;
      }

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        return pemeriksaanDate >= start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return pemeriksaanDate <= end;
      }

      return true;
    });

    setFilteredPemeriksaan(filtered);
  }, [allPemeriksaan, startDate, endDate]);

  /**
   * Clear filter dan tampilkan semua data
   */
  const clearFilter = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setFilteredPemeriksaan(allPemeriksaan);
  }, [allPemeriksaan]);

  // Fetch data on mount
  useEffect(() => {
    fetchPemeriksaan();
  }, [fetchPemeriksaan]);

  // Apply filter when dates change
  useEffect(() => {
    filterPemeriksaan();
  }, [filterPemeriksaan]);

  return {
    pemeriksaan: filteredPemeriksaan,
    allPemeriksaan,
    isLoading,
    error,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    clearFilter,
    refetch: fetchPemeriksaan,
  };
}
