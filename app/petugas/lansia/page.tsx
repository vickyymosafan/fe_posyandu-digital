'use client';

import { PetugasLayout } from '@/components/layout';
import { LansiaListContent } from '@/components/lansia';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

/**
 * Halaman Daftar Lansia (Petugas)
 * 
 * Halaman untuk menampilkan daftar semua lansia yang terdaftar.
 * Petugas dapat melihat, mencari, dan mendaftarkan lansia baru.
 * 
 * Features:
 * - Daftar lansia dengan tabel
 * - Search functionality
 * - Navigate ke detail lansia
 * - Tombol daftar lansia baru
 * 
 * Design Principles:
 * - SRP: Component hanya untuk layout dan orchestration
 * - Composition: Menggunakan LansiaListContent yang shared
 * - DRY: Reuse komponen yang sama dengan Admin
 * 
 * @returns {JSX.Element} Halaman daftar lansia petugas
 */
export default function DaftarLansiaPetugasPage() {
  const router = useRouter();

  const handleDaftarBaru = () => {
    router.push('/petugas/lansia/daftar');
  };

  return (
    <PetugasLayout>
      <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-950 mb-2">
              Daftar Lansia
            </h1>
            <p className="text-neutral-600">
              Kelola dan pantau data lansia yang terdaftar di Posyandu
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleDaftarBaru}
            aria-label="Daftar lansia baru"
          >
            + Daftar Lansia Baru
          </Button>
        </div>

        {/* Content Section */}
        <LansiaListContent />
      </div>
    </PetugasLayout>
  );
}
