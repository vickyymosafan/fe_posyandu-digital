'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { LansiaDetailContent } from '@/components/lansia';
import { Loading } from '@/components/ui';
import { useLansiaDetail } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';

/**
 * Halaman Detail Lansia untuk Admin
 * 
 * Responsibilities (SRP):
 * - Display lansia detail with pemeriksaan history (read-only)
 * - Handle loading and error states
 * 
 * Route: /admin/lansia/[kode]
 */

interface PageProps {
  params: Promise<{ kode: string }>;
}

export default function AdminLansiaDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { kode } = use(params);
  const { lansia, pemeriksaan, isLoading, error, refetch } = useLansiaDetail(kode);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loading />
        </div>
      </AdminLayout>
    );
  }

  if (error || !lansia) {
    return (
      <AdminLayout>
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
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

        {/* Content - Read-only for Admin */}
        <LansiaDetailContent
          lansia={lansia}
          pemeriksaan={pemeriksaan}
          showActions={false}
          grafikUrl={`/admin/lansia/${kode}/grafik`}
        />
      </div>
    </AdminLayout>
  );
}
