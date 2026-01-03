'use client';

/**
 * Admin Loading Component
 * 
 * Menampilkan skeleton loading state untuk halaman admin.
 * Menggunakan komponen Skeleton yang sudah ada untuk konsistensi UI.
 * 
 * File ini otomatis ditampilkan oleh Next.js App Router saat:
 * - Navigasi ke halaman admin
 * - Data sedang di-fetch
 * - Suspense boundary aktif
 */

import { Skeleton } from '@/components/ui';

export default function AdminLoading() {
    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Sidebar Skeleton */}
            <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-200 p-6">
                {/* Logo */}
                <div className="mb-8">
                    <Skeleton variant="rectangular" width={120} height={40} />
                </div>

                {/* Menu Items */}
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton variant="circular" width={24} height={24} />
                            <Skeleton variant="text" width="70%" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <Skeleton variant="text" width={300} height={32} className="mb-2" />
                    <Skeleton variant="text" width={200} />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                            <Skeleton variant="text" width="60%" className="mb-2" />
                            <Skeleton variant="text" width="40%" height={32} />
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <Skeleton variant="text" width={200} height={24} className="mb-6" />
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} variant="text" width="100%" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
