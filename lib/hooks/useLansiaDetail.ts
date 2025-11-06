'use client';

import { useState, useEffect, useCallback } from 'react';
import { lansiaAPI } from '@/lib/api';
import { Lansia, Pemeriksaan } from '@/types';
import { handleAPIError } from '@/lib/utils/errors';

/**
 * Hook untuk fetch detail lansia dan riwayat pemeriksaan
 * 
 * Responsibilities (SRP):
 * - Fetch lansia data by kode
 * - Fetch pemeriksaan history
 * - Handle loading and error states
 * - Provide refetch functionality
 * 
 * @param kode - Kode unik lansia
 */
export interface UseLansiaDetailReturn {
  lansia: Lansia | null;
  pemeriksaan: Pemeriksaan[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useLansiaDetail(kode: string): UseLansiaDetailReturn {
  const [lansia, setLansia] = useState<Lansia | null>(null);
  const [pemeriksaan, setPemeriksaan] = useState<Pemeriksaan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!kode) {
      setError('Kode lansia tidak valid');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch lansia data
      const lansiaResponse = await lansiaAPI.getByKode(kode);
      if (lansiaResponse.error) {
        throw new Error(lansiaResponse.error);
      }

      if (!lansiaResponse.data) {
        throw new Error('Data lansia tidak ditemukan');
      }

      setLansia(lansiaResponse.data);

      // Fetch pemeriksaan history
      const pemeriksaanResponse = await lansiaAPI.getPemeriksaan(kode);
      if (pemeriksaanResponse.error) {
        // Pemeriksaan error tidak fatal, set empty array
        console.warn('Gagal fetch pemeriksaan:', pemeriksaanResponse.error);
        setPemeriksaan([]);
      } else {
        setPemeriksaan(pemeriksaanResponse.data || []);
      }
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      setLansia(null);
      setPemeriksaan([]);
    } finally {
      setIsLoading(false);
    }
  }, [kode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    lansia,
    pemeriksaan,
    isLoading,
    error,
    refetch: fetchData,
  };
}
