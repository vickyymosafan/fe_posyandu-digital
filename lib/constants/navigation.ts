/**
 * Navigation Constants
 * 
 * File ini berisi konstanta untuk navigation routes.
 * Mengikuti prinsip DRY (Don't Repeat Yourself) dan SRP (Single Responsibility Principle).
 * 
 * Dengan memusatkan route paths di satu tempat:
 * - Mudah maintenance ketika ada perubahan route
 * - Menghindari typo dan inconsistency
 * - Type-safe dengan TypeScript
 * 
 * Note: Navigation items dengan JSX icons didefinisikan di masing-masing layout component
 * karena JSX tidak bisa digunakan di file .ts
 */

/**
 * Route paths untuk aplikasi
 * Digunakan untuk navigation dan redirect
 */
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  OFFLINE: '/offline',

  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PETUGAS: '/admin/petugas',
    PETUGAS_TAMBAH: '/admin/petugas/tambah',
    LANSIA: '/admin/lansia',
    LANSIA_DETAIL: (kode: string) => `/admin/lansia/${kode}`,
    LANSIA_GRAFIK: (kode: string) => `/admin/lansia/${kode}/grafik`,
    PROFIL: '/admin/profil',
  },

  // Petugas routes
  PETUGAS: {
    DASHBOARD: '/petugas/dashboard',
    LANSIA: '/petugas/lansia',
    LANSIA_TAMBAH: '/petugas/lansia/tambah',
    LANSIA_CARI: '/petugas/lansia/cari',
    LANSIA_DETAIL: (kode: string) => `/petugas/lansia/${kode}`,
    LANSIA_GRAFIK: (kode: string) => `/petugas/lansia/${kode}/grafik`,
    PEMERIKSAAN_TAMBAH: (kode: string) => `/petugas/lansia/${kode}/pemeriksaan/tambah`,
    PEMERIKSAAN_KESEHATAN_TAMBAH: (kode: string) => `/petugas/lansia/${kode}/pemeriksaan/kesehatan/tambah`,
    PEMERIKSAAN_RIWAYAT: (kode: string) => `/petugas/lansia/${kode}/pemeriksaan/riwayat`,
    PROFIL: '/petugas/profil',
  },
} as const;


