'use client';

import { useRouter } from 'next/navigation';
import { Lansia, Pemeriksaan } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, formatUmur } from '@/lib/utils/formatters';
import { PemeriksaanHistoryTable } from './PemeriksaanHistoryTable';
import { HealthTrendCharts } from './HealthTrendCharts';

/**
 * Component untuk menampilkan detail lengkap lansia
 * 
 * Responsibilities (SRP):
 * - Display personal information
 * - Compose PemeriksaanHistoryTable and HealthTrendCharts
 * - Show action buttons based on role
 * 
 * Props (ISP, OCP):
 * - lansia: lansia data
 * - pemeriksaan: array of pemeriksaan
 * - showActions: whether to show action buttons (extensible)
 */

interface LansiaDetailContentProps {
  lansia: Lansia;
  pemeriksaan: Pemeriksaan[];
  showActions?: boolean;
}

export function LansiaDetailContent({
  lansia,
  pemeriksaan,
  showActions = false,
}: LansiaDetailContentProps) {
  const router = useRouter();

  const handleInputPemeriksaan = () => {
    router.push(`/petugas/lansia/${lansia.kode}/pemeriksaan/tambah`);
  };

  return (
    <div className="space-y-8">
      {/* Personal Information Card */}
      <Card>
        <Card.Header>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-950">
                {lansia.nama}
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                ID: {lansia.kode}
              </p>
            </div>
            {showActions && (
              <Button onClick={handleInputPemeriksaan}>
                Input Pemeriksaan Baru
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-neutral-700">
                NIK
              </label>
              <p className="mt-1 text-base text-neutral-900">{lansia.nik}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700">
                Nomor KK
              </label>
              <p className="mt-1 text-base text-neutral-900">{lansia.kk}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700">
                Tanggal Lahir
              </label>
              <p className="mt-1 text-base text-neutral-900">
                {formatDate(lansia.tanggalLahir)}
                <span className="text-neutral-600 ml-2">
                  ({formatUmur(lansia.tanggalLahir)})
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700">
                Jenis Kelamin
              </label>
              <p className="mt-1 text-base text-neutral-900">
                {lansia.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-neutral-700">
                Alamat
              </label>
              <p className="mt-1 text-base text-neutral-900">{lansia.alamat}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-neutral-700">
                Terdaftar Sejak
              </label>
              <p className="mt-1 text-base text-neutral-900">
                {formatDate(lansia.createdAt)}
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Riwayat Pemeriksaan Section */}
      <div>
        <h2 className="text-xl font-bold text-neutral-950 mb-4">
          Riwayat Pemeriksaan
        </h2>
        <Card>
          <Card.Body>
            <PemeriksaanHistoryTable pemeriksaan={pemeriksaan} />
          </Card.Body>
        </Card>
      </div>

      {/* Trend Charts Section */}
      {pemeriksaan.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-neutral-950 mb-4">
            Grafik Tren Kesehatan (6 Bulan Terakhir)
          </h2>
          <HealthTrendCharts pemeriksaan={pemeriksaan} months={6} />
        </div>
      )}
    </div>
  );
}
