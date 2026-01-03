/**
 * Shared Metadata Configuration
 * 
 * Konfigurasi metadata SEO yang konsisten untuk semua halaman.
 * Mengikuti best practices Next.js untuk SEO.
 * 
 * Usage:
 * ```tsx
 * import { sharedMetadata, createPageMetadata } from '@/app/metadata';
 * 
 * export const metadata = createPageMetadata({
 *   title: 'Dashboard',
 *   description: 'Overview statistik Posyandu Lansia',
 * });
 * ```
 */

import type { Metadata } from 'next';

/**
 * Base metadata yang digunakan di seluruh aplikasi
 */
export const sharedMetadata: Metadata = {
    title: {
        default: 'Posyandu Digital - Sistem Manajemen Kesehatan Lansia',
        template: '%s | Posyandu Digital',
    },
    description: 'Aplikasi digital untuk manajemen dan monitoring kesehatan lansia di Posyandu',
    keywords: ['posyandu', 'lansia', 'kesehatan', 'digital', 'pemeriksaan', 'indonesia'],
    authors: [{ name: 'Posyandu Digital Team' }],
    creator: 'Posyandu Digital',
    publisher: 'Posyandu Digital',
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: 'website',
        locale: 'id_ID',
        siteName: 'Posyandu Digital',
        title: 'Posyandu Digital - Sistem Manajemen Kesehatan Lansia',
        description: 'Aplikasi digital untuk manajemen dan monitoring kesehatan lansia di Posyandu',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Posyandu Digital',
        description: 'Aplikasi digital untuk manajemen dan monitoring kesehatan lansia di Posyandu',
    },
};

/**
 * Helper function untuk membuat page metadata
 * Menggabungkan base metadata dengan page-specific metadata
 */
export function createPageMetadata(pageMetadata: {
    title: string;
    description?: string;
    keywords?: string[];
}): Metadata {
    return {
        title: pageMetadata.title,
        description: pageMetadata.description || sharedMetadata.description,
        keywords: pageMetadata.keywords
            ? [...(sharedMetadata.keywords as string[]), ...pageMetadata.keywords]
            : sharedMetadata.keywords,
    };
}

/**
 * Metadata untuk halaman Admin Dashboard
 */
export const adminDashboardMetadata: Metadata = createPageMetadata({
    title: 'Dashboard Admin',
    description: 'Dashboard administrasi Posyandu Digital dengan statistik lansia, petugas, dan pemeriksaan',
    keywords: ['admin', 'dashboard', 'statistik'],
});

/**
 * Metadata untuk halaman Petugas Dashboard
 */
export const petugasDashboardMetadata: Metadata = createPageMetadata({
    title: 'Dashboard Petugas',
    description: 'Dashboard petugas Posyandu Digital untuk monitoring dan manajemen kesehatan lansia',
    keywords: ['petugas', 'dashboard', 'monitoring'],
});

/**
 * Metadata untuk halaman Login
 */
export const loginMetadata: Metadata = createPageMetadata({
    title: 'Masuk',
    description: 'Masuk ke sistem Posyandu Digital untuk mengelola data kesehatan lansia',
    keywords: ['login', 'masuk', 'autentikasi'],
});

/**
 * Metadata untuk halaman Daftar Lansia
 */
export const lansiaListMetadata: Metadata = createPageMetadata({
    title: 'Daftar Lansia',
    description: 'Daftar lansia yang terdaftar di Posyandu Digital beserta status kesehatannya',
    keywords: ['lansia', 'daftar', 'list'],
});

/**
 * Helper untuk membuat metadata detail lansia
 */
export function createLansiaDetailMetadata(nama: string): Metadata {
    return createPageMetadata({
        title: `Detail ${nama}`,
        description: `Data dan riwayat kesehatan ${nama} di Posyandu Digital`,
        keywords: ['lansia', 'detail', 'riwayat', 'kesehatan'],
    });
}
