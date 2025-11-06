'use client';

import { AdminLayout } from '@/components/layout';
import { LansiaListContent } from '@/components/lansia';

/**
 * Halaman Daftar Lansia (Admin)
 * 
 * Halaman untuk menampilkan daftar semua lansia yang terdaftar.
 * Admin dapat melihat dan mencari data lansia.
 * 
 * Features:
 * - Daftar lansia dengan tabel
 * - Search functionality
 * - Navigate ke detail lansia
 * 
 * Design Principles:
 * - SRP: Component hanya untuk layout dan orchestration
 * - Composition: Menggunakan LansiaListContent yang shared
 * - DRY: Reuse komponen yang sama dengan Petugas
 * 
 * @returns {JSX.Element} Halaman daftar lansia admin
 */
export default function DaftarLansiaAdminPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-950 mb-2">
            Daftar Lansia
          </h1>
          <p className="text-neutral-600">
            Kelola dan pantau data lansia yang terdaftar di Posyandu
          </p>
        </div>

        {/* Content Section */}
        <LansiaListContent />
      </div>
    </AdminLayout>
  );
}
