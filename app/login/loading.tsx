'use client';

/**
 * Login Loading Component
 * 
 * Menampilkan skeleton loading state untuk halaman login.
 * 
 * File ini otomatis ditampilkan oleh Next.js App Router saat:
 * - Navigasi ke halaman login
 * - Suspense boundary aktif
 */

import { Skeleton } from '@/components/ui';

export default function LoginLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <Skeleton variant="circular" width={80} height={80} />
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <Skeleton variant="text" width="60%" height={28} className="mx-auto mb-2" />
                        <Skeleton variant="text" width="80%" className="mx-auto" />
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        <div>
                            <Skeleton variant="text" width={60} className="mb-2" />
                            <Skeleton variant="rectangular" width="100%" height={44} className="rounded-lg" />
                        </div>
                        <div>
                            <Skeleton variant="text" width={80} className="mb-2" />
                            <Skeleton variant="rectangular" width="100%" height={44} className="rounded-lg" />
                        </div>

                        {/* Button */}
                        <Skeleton variant="rectangular" width="100%" height={48} className="rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
