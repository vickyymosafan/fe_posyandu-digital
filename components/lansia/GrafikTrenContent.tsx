'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Pemeriksaan } from '@/types';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';

// Dynamic import untuk HealthTrendCharts karena menggunakan recharts (browser-only library)
const HealthTrendCharts = dynamic(
  () => import('./HealthTrendCharts').then((mod) => mod.HealthTrendCharts),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <Loading />
      </div>
    ),
  }
);

/**
 * Component untuk menampilkan grafik tren kesehatan lansia
 * 
 * Responsibilities (SRP):
 * - Display health trend charts
 * - Show back navigation
 * - Handle empty state
 * 
 * Props (ISP):
 * - lansiaKode: kode lansia untuk navigasi
 * - lansianama: nama lansia untuk display
 * - pemeriksaan: array of pemeriksaan data
 * - months: number of months to show (default: 6)
 * - backUrl: URL untuk tombol kembali
 */

interface GrafikTrenContentProps {
  lansiaKode: string;
  lansiaNama: string;
  pemeriksaan: Pemeriksaan[];
  months?: number;
  backUrl: string;
}

export function GrafikTrenContent({
  lansiaKode,
  lansiaNama,
  pemeriksaan,
  months = 6,
  backUrl,
}: GrafikTrenContentProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(backUrl);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-950">
                Grafik Tren Kesehatan
              </h1>
              <p className="text-sm text-neutral-600 mt-1">
                {lansiaNama} (ID: {lansiaKode})
              </p>
            </div>
            <Button variant="secondary" onClick={handleBack}>
              Kembali
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Charts Section */}
      {pemeriksaan.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <p className="text-neutral-500">
                Belum ada data pemeriksaan untuk ditampilkan
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody>
            <HealthTrendCharts pemeriksaan={pemeriksaan} months={months} />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
