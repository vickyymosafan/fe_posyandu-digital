'use client';

import { useState } from 'react';
import { useLansiaDetail } from '@/lib/hooks/useLansiaDetail';
import { Loading } from '@/components/ui';
import { PemeriksaanHistoryTable } from '@/components/lansia/PemeriksaanHistoryTable';
import { HealthTrendCharts } from '@/components/lansia/HealthTrendCharts';
import { formatUmur } from '@/lib/utils/formatters';

/**
 * RiwayatPemeriksaanContent Component
 *
 * Component untuk menampilkan riwayat pemeriksaan lengkap dengan:
 * - Info lansia
 * - Filter tanggal (optional)
 * - Tabel riwayat pemeriksaan
 * - Grafik tren kesehatan
 *
 * Responsibilities (SRP):
 * - Fetch data lansia dan pemeriksaan
 * - Display lansia info
 * - Display pemeriksaan history table
 * - Display health trend charts
 * - Handle loading and error states
 *
 * Props (ISP):
 * - kode: kode lansia
 */

interface RiwayatPemeriksaanContentProps {
  kode: string;
}

export function RiwayatPemeriksaanContent({ kode }: RiwayatPemeriksaanContentProps) {
  const { lansia, pemeriksaan, isLoading, error } = useLansiaDetail(kode);
  const [showCharts, setShowCharts] = useState(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          Gagal Memuat Data
        </h3>
        <p className="text-neutral-600">{error}</p>
      </div>
    );
  }

  if (!lansia) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Data lansia tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Info Lansia */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Riwayat Pemeriksaan
            </h1>
            <div className="space-y-1">
              <p className="text-lg font-medium text-neutral-700">
                {lansia.nama}
              </p>
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <span>Kode: {lansia.kode}</span>
                <span>•</span>
                <span>Umur: {formatUmur(lansia.tanggalLahir)}</span>
                <span>•</span>
                <span>
                  {lansia.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                </span>
              </div>
            </div>
          </div>

          {/* Toggle Charts Button */}
          {pemeriksaan.length > 0 && (
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              {showCharts ? 'Sembunyikan Grafik' : 'Tampilkan Grafik'}
            </button>
          )}
        </div>
      </div>

      {/* Grafik Tren */}
      {showCharts && pemeriksaan.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">
            Grafik Tren Kesehatan
          </h2>
          <HealthTrendCharts pemeriksaan={pemeriksaan} months={6} />
        </div>
      )}

      {/* Tabel Riwayat */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
          Riwayat Pemeriksaan
        </h2>
        <PemeriksaanHistoryTable pemeriksaan={pemeriksaan} />
      </div>
    </div>
  );
}
