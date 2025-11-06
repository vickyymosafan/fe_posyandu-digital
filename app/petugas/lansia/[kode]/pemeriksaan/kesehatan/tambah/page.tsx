'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { PetugasLayout } from '@/components/layout';
import { PemeriksaanKesehatanForm } from '@/components/pemeriksaan';
import { Card, Loading } from '@/components/ui';
import { useLansiaDetail } from '@/lib/hooks/useLansiaDetail';
import { usePemeriksaanKesehatanForm } from '@/lib/hooks/usePemeriksaanKesehatanForm';
import { formatDate, formatUmur } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';

/**
 * Halaman Tambah Pemeriksaan Kesehatan
 * 
 * Responsibilities (SRP):
 * - Display lansia info
 * - Show pemeriksaan kesehatan form
 * - Handle form submission
 * - Navigate back on success
 * 
 * Route: /petugas/lansia/[kode]/pemeriksaan/kesehatan/tambah
 */

interface PageProps {
  params: Promise<{ kode: string }>;
}

export default function TambahPemeriksaanKesehatanPage({ params }: PageProps) {
  const router = useRouter();
  const { kode } = use(params);
  const { lansia, isLoading, error } = useLansiaDetail(kode);
  const formState = usePemeriksaanKesehatanForm(
    kode,
    lansia?.id || 0,
    lansia?.gender || 'L'
  );

  if (isLoading) {
    return (
      <PetugasLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loading />
        </div>
      </PetugasLayout>
    );
  }

  if (error || !lansia) {
    return (
      <PetugasLayout>
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              {error || 'Data lansia tidak ditemukan'}
            </p>
            <Button onClick={() => router.back()}>Kembali</Button>
          </div>
        </div>
      </PetugasLayout>
    );
  }

  return (
    <PetugasLayout>
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            ← Kembali ke Detail Lansia
          </button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-950 mb-2">
            Input Pemeriksaan Kesehatan
          </h1>
          <p className="text-neutral-600">
            Masukkan data pemeriksaan kesehatan (lab) untuk lansia
          </p>
        </div>

        {/* Lansia Info Card */}
        <Card className="mb-6">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">ID Lansia</p>
                <p className="font-mono text-base font-medium text-neutral-900">
                  {lansia.kode}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Nama</p>
                <p className="text-base font-medium text-neutral-900">
                  {lansia.nama}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">
                  Tanggal Lahir / Umur
                </p>
                <p className="text-base text-neutral-900">
                  {formatDate(lansia.tanggalLahir)} ({formatUmur(lansia.tanggalLahir)})
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Jenis Kelamin</p>
                <p className="text-base text-neutral-900">
                  {lansia.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Form */}
        <PemeriksaanKesehatanForm formState={formState} />
      </div>
    </PetugasLayout>
  );
}
