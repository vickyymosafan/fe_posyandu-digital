'use client';

/**
 * Query Provider
 *
 * Provider untuk TanStack Query yang menyediakan caching layer untuk API calls.
 * Menggunakan pattern stale-while-revalidate untuk optimal UX.
 *
 * Konfigurasi:
 * - staleTime: 5 menit (data dianggap fresh selama 5 menit)
 * - gcTime: 10 menit (cache dibuang setelah 10 menit tidak digunakan)
 * - refetchOnWindowFocus: false (tidak refetch saat window focus)
 * - retry: 1 (hanya retry 1x jika gagal)
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
    children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Data dianggap fresh selama 5 menit
                        staleTime: 5 * 60 * 1000,
                        // Cache dibuang setelah 10 menit tidak digunakan
                        gcTime: 10 * 60 * 1000,
                        // Tidak refetch otomatis saat window focus
                        refetchOnWindowFocus: false,
                        // Hanya retry 1x jika gagal
                        retry: 1,
                        // Tidak refetch saat reconnect
                        refetchOnReconnect: false,
                    },
                    mutations: {
                        // Retry 1x untuk mutations
                        retry: 1,
                    },
                },
            })
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
