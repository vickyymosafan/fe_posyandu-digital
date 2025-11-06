'use client';

import { useRouter } from 'next/navigation';
import { Lansia, Pemeriksaan } from '@/types';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, formatUmur } from '@/lib/utils/formatters';
import { PemeriksaanHistoryTable } from './PemeriksaanHistoryTable';

/**
 * Component untuk menampilkan detail lengkap lansia
 * 
 * Responsibilities (SRP):
 * - Display personal information
 * - Compose PemeriksaanHistoryTable
 * - Show action buttons based on role
 * - Navigate to charts page
 * 
 * Props (ISP, OCP):
 * - lansia: lansia data
 * - pemeriksaan: array of pemeriksaan
 * - showActions: whether to show action buttons (extensible)
 * - grafikUrl: URL untuk halaman grafik
 */

interface LansiaDetailContentProps {
  lansia: Lansia;
  pemeriksaan: Pemeriksaan[];
  showActions?: boolean;
  grafikUrl?: string;
}

export function LansiaDetailContent({
  lansia,
  pemeriksaan,
  showActions = false,
  grafikUrl,
}: LansiaDetailContentProps) {
  const router = useRouter();

  const handleInputPemeriksaan = () => {
    router.push(`/petugas/lansia/${lansia.kode}/pemeriksaan/tambah`);
  };

  const handleLihatGrafik = () => {
    if (grafikUrl) {
      router.push(grafikUrl);
    }
  };

  return (
    <div className="space-y-8">
      {/* Personal Information Card */}
      <Card>
        <CardHeader>
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
        </CardHeader>
        <CardBody>
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
        </CardBody>
      </Card>

      {/* Riwayat Pemeriksaan Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-950">
            Riwayat Pemeriksaan
          </h2>
          {grafikUrl && pemeriksaan.length > 0 && (
            <Button variant="secondary" onClick={handleLihatGrafik}>
              Lihat Grafik Tren
            </Button>
          )}
        </div>
        <Card>
          <CardBody>
            <PemeriksaanHistoryTable pemeriksaan={pemeriksaan} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
