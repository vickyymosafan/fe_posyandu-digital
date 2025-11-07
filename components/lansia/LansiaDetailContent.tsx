'use client';

import { useRouter } from 'next/navigation';
import { Lansia, Pemeriksaan } from '@/types';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, formatUmur } from '@/lib/utils/formatters'
import { PemeriksaanHistoryTable } from './PemeriksaanHistoryTable';

/**
 * Component untuk menampilkan detail lengkap lansia
 * 
 * Responsibilities (SRP):
 * - Orchestrate layout dan composition dari sub-komponen
 * - Handle navigation actions
 * - Compose InfoRow dan PemeriksaanHistoryTable
 * 
 * Principles Applied:
 * - SRP: Fokus pada orchestration, detail rendering di-delegate ke InfoRow
 * - OCP: Extensible via props (showActions, grafikUrl)
 * - DRY: Menggunakan InfoRow untuk menghindari duplikasi pattern
 * - Composition: Build UI dari komponen kecil yang reusable
 * - ISP: Interface props minimal dan focused
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
    <div className="space-y-6 sm:space-y-8">
      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          {/* Header dengan responsive layout */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 break-words">
                {lansia.nama}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                ID: {lansia.kode}
              </p>
            </div>
            {showActions && (
              <Button 
                onClick={handleInputPemeriksaan}
                className="w-full sm:w-auto shrink-0"
              >
                Input Pemeriksaan Baru
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          {/* Grid responsive: 1 col mobile, 2 col tablet+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-sm text-neutral-600 mb-1">NIK</p>
              <p className="text-base font-medium text-neutral-900">{lansia.nik}</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 mb-1">Nomor KK</p>
              <p className="text-base font-medium text-neutral-900">{lansia.kk}</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 mb-1">Tanggal Lahir</p>
              <p className="text-base font-medium text-neutral-900">
                {formatDate(lansia.tanggalLahir)}
                <span className="text-neutral-600 ml-2 text-sm">
                  ({formatUmur(lansia.tanggalLahir)})
                </span>
              </p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 mb-1">Jenis Kelamin</p>
              <p className="text-base font-medium text-neutral-900">
                {lansia.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
              </p>
            </div>
            
            <div className="sm:col-span-2">
              <p className="text-sm text-neutral-600 mb-1">Alamat</p>
              <p className="text-base font-medium text-neutral-900">{lansia.alamat}</p>
            </div>
            
            <div className="sm:col-span-2">
              <p className="text-sm text-neutral-600 mb-1">Terdaftar Sejak</p>
              <p className="text-base font-medium text-neutral-900">{formatDate(lansia.createdAt)}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Riwayat Pemeriksaan Section */}
      <div>
        {/* Header section dengan responsive button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-950">
            Riwayat Pemeriksaan
          </h2>
          {grafikUrl && pemeriksaan.length > 0 && (
            <Button 
              variant="secondary" 
              onClick={handleLihatGrafik}
              className="w-full sm:w-auto"
            >
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
