'use client';

import { useState, useEffect, useCallback } from 'react';
import { lansiaAPI } from '@/lib/api';
import { Lansia, MinimalLansia } from '@/types';
import { useNotification } from '@/components/ui';
import { handleAPIError } from '@/lib/utils/errors';

/**
 * Interface untuk return value hook useLansiaList
 */
interface UseLansiaListReturn {
  lansia: (Lansia | MinimalLansia)[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  isSearching: boolean;
  handleSearch: (query: string) => void;
  refetch: () => Promise<void>;
}

/**
 * Custom hook untuk mengelola data lansia
 * 
 * Responsibilities:
 * - Fetch data lansia dari API
 * - Handle search functionality dengan debounce
 * - Handle loading dan error states
 * - Provide refetch function untuk refresh data
 * 
 * Design Principles:
 * - SRP: Single responsibility untuk lansia data management
 * - DIP: Depends on lansiaAPI abstraction
 * - SoC: Separates data logic from UI
 * 
 * @returns {UseLansiaListReturn} Object dengan lansia data dan functions
 */
export function useLansiaList(): UseLansiaListReturn {
  const [lansia, setLansia] = useState<(Lansia | MinimalLansia)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { showNotification } = useNotification();

  /**
   * Fetch semua data lansia dari API
   */
  const fetchAll = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await lansiaAPI.getAll();

      if (response.data) {
        setLansia(response.data);
      } else {
        throw new Error(response.error || 'Gagal mengambil data lansia');
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
   * Search lansia berdasarkan query
   * Minimal 3 karakter untuk trigger search
   */
  const searchLansia = useCallback(
    async (query: string) => {
      if (query.length < 3) {
        // Jika query < 3 karakter, fetch all
        await fetchAll();
        return;
      }

      try {
        setIsSearching(true);
        setError(null);

        const response = await lansiaAPI.find(query);

        if (response.data) {
          setLansia(response.data);
        } else {
          throw new Error(response.error || 'Gagal mencari data lansia');
        }
      } catch (err) {
        const errorMessage = handleAPIError(err);
        setError(errorMessage);
        showNotification('error', errorMessage);
      } finally {
        setIsSearching(false);
      }
    },
    [fetchAll, showNotification]
  );

  /**
   * Handle search dengan debounce
   * Debounce 500ms untuk menghindari terlalu banyak API calls
   */
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      // Debounce search
      const timeoutId = setTimeout(() => {
        searchLansia(query);
      }, 500);

      return () => clearTimeout(timeoutId);
    },
    [searchLansia]
  );

  /**
   * Refetch data lansia
   * Exposed untuk manual refresh
   */
  const refetch = useCallback(async () => {
    if (searchQuery.length >= 3) {
      await searchLansia(searchQuery);
    } else {
      await fetchAll();
    }
  }, [searchQuery, searchLansia, fetchAll]);

  // Fetch data on mount
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    lansia,
    isLoading,
    error,
    searchQuery,
    isSearching,
    handleSearch,
    refetch,
  };
}
