'use client';

/**
 * Offline Indicator Component
 *
 * Component untuk menampilkan indikator "Mode Offline" saat tidak ada koneksi internet.
 * Mengikuti prinsip:
 * - SRP: Hanya handle display offline indicator
 * - Composition: Compose useOffline hook
 * - Responsive: Adapt untuk mobile dan desktop
 */

import { useEffect, useState } from 'react';
import { useOffline } from '@/lib/hooks';
import { syncManager } from '@/lib/utils';

export function OfflineIndicator() {
  const [mounted, setMounted] = useState(false);
  const { isOnline } = useOffline({
    onOnline: async () => {
      console.log('Back online! Triggering sync...');
      await syncManager.syncAll();
    },
    onOffline: () => {
      console.log('Gone offline!');
    },
  });

  // Prevent hydration mismatch by only rendering after mount
  // This is a standard pattern for client-only components
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server or if online
  if (!mounted || isOnline) {
    return null;
  }

  return (
    <div
      className="fixed top-4 right-4 z-50 bg-yellow-500 text-white px-4 py-2 rounded-xl shadow-lg 
                 flex items-center gap-2 transition-all duration-300 animate-pulse"
      role="status"
      aria-live="polite"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
        />
      </svg>
      <span className="font-medium text-sm">Mode Offline</span>
    </div>
  );
}
