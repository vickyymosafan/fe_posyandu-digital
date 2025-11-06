'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { PetugasLayout } from '@/components/layout';
import { LansiaDetailContent } from '@/components/lansia';
import { Loading } from '@/components/ui';
import { useLansiaDetail } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';

/**
 * Halaman Detail Lansia untuk Petugas
 * 
 * Responsibilities (SRP):
 * - Display lansia detail with pemeriksaan history
 * - Show action button for input pemeriksaan
 * - Handle loading and error states
 * 
 * Route: /petugas/lansia/[kode]
 */

interface PageProps {
  params: Promise<{ kode: string }>;
}

export default function PetugasLansiaDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { kode } = use(params);
  const { lansia, pemeriksaan, isLoading, error, refetch } = useLansiaDetail(kode);

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
            <p className="text-red-600 mb-4">{error || 'Data lansia tidak ditemukan'}</p>
            <div className="flex gap-4 justify-center">
              <Button variant="secondary" onClick={() => router.back()}>
                Kembali
              </Button>
              <Button onClick={refetch}>Coba Lagi</Button>
            </div>
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
            ← Kembali
          </button>
        </div>

        {/* Content */}
        <LansiaDetailContent
          lansia={lansia}
          pemeriksaan={pemeriksaan}
          showActions={true}
        />
      </div>
    </PetugasLayout>
  );
}
