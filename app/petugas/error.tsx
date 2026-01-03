'use client';

/**
 * Petugas Error Component
 * 
 * Route-level error boundary untuk halaman petugas.
 * Menangkap error yang terjadi di dalam /petugas/* routes.
 * 
 * Features:
 * - Tampilan error yang user-friendly
 * - Tombol reset untuk retry
 * - Tombol kembali ke dashboard
 * - Log error ke console untuk debugging
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */

import { useEffect } from 'react';
import { Button } from '@/components/ui';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function PetugasError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log error untuk debugging
        console.error('❌ [Petugas Error]', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    {/* Error Icon */}
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                        Terjadi Kesalahan
                    </h1>

                    {/* Message */}
                    <p className="text-neutral-600 mb-6">
                        Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi atau kembali ke dashboard.
                    </p>

                    {/* Error Details (Development) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
                            <p className="text-sm font-medium text-red-800 mb-1">Error Details:</p>
                            <p className="text-sm text-red-700 font-mono break-all">
                                {error.message}
                            </p>
                            {error.digest && (
                                <p className="text-xs text-red-500 mt-2">
                                    Digest: {error.digest}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            variant="primary"
                            onClick={reset}
                            aria-label="Coba lagi"
                        >
                            Coba Lagi
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => window.location.href = '/petugas/dashboard'}
                            aria-label="Kembali ke dashboard"
                        >
                            Ke Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
