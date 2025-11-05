'use client';

/**
 * useOffline Hook
 *
 * Custom hook untuk detect online/offline status browser.
 * Mengikuti prinsip:
 * - SRP: Hanya handle online/offline detection
 * - OCP: Extensible dengan callback options
 * - KISS: Simple implementation dengan browser API
 */

import { useEffect, useState, useCallback } from 'react';

// ============================================
// Types
// ============================================

interface UseOfflineOptions {
  /**
   * Callback yang dipanggil saat browser kembali online
   */
  onOnline?: () => void;

  /**
   * Callback yang dipanggil saat browser offline
   */
  onOffline?: () => void;
}

interface UseOfflineReturn {
  /**
   * Status online/offline browser
   */
  isOnline: boolean;
}

// ============================================
// Hook
// ============================================

/**
 * Hook untuk detect online/offline status browser
 *
 * @param options - Optional callbacks untuk online/offline events
 * @returns Object dengan isOnline status
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isOnline } = useOffline({
 *     onOnline: () => console.log('Back online!'),
 *     onOffline: () => console.log('Gone offline!'),
 *   });
 *
 *   return (
 *     <div>
 *       Status: {isOnline ? 'Online' : 'Offline'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useOffline(options?: UseOfflineOptions): UseOfflineReturn {
  // Initialize dengan current online status
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Memoize callbacks untuk stable reference
  const handleOnline = useCallback(() => {
    setIsOnline(true);
    options?.onOnline?.();
  }, [options]);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    options?.onOffline?.();
  }, [options]);

  useEffect(() => {
    // Setup event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return { isOnline };
}
