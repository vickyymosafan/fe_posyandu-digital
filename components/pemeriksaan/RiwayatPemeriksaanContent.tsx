'use client';

import { useState, useEffect } from 'react';
import { useRiwayatPemeriksaan } from '@/lib/hooks/useRiwayatPemeriksaan';
import { DateRangeFilter } from './DateRangeFilter';
import { PemeriksaanHistoryTable } from '@/components/lansia/PemeriksaanHistoryTable';
import { HealthTrendCharts } from '@/components/lansia/HealthTrendCharts';
import { lansiaAPI } from '@/lib/api';
import { handleAPIError } from '@/lib/utils/errors';

/**
 * Props untuk RiwayatPemeriksaanContent component
 */
interface RiwayatPemeriksaanContentProps {
  /** Kode unik lansia */
  kode: string;
}

/**
 * RiwayatPemeriksaanContent Component
 * 
 * Komponen utama untuk menampilkan riwayat pemeriksaan dengan filtering.
 * 
 * Features:
 * - Date range filter
 * - Tabel riwayat pemeriksaan
 * - Grafik tren kesehatan
 * - Loading dan error state
 * - Empty state
 * 
 * Follows SoC principle:
 * - Hook layer: useRiwayatPemeriksaan (data + logic)
 * - Component layer: DateRangeFilter, PemeriksaanHistoryTable, HealthTrendCharts (UI)
 * 
 * @example
 * ```tsx
 * <RiwayatPemeriksaanContent kode="pasien202501011A" />
 * ```
 */
export function RiwayatPemeriksaanContent({
  kode,
}: RiwayatPemeriksaanContentProps) {
  const [namaLansia, setNamaLansia] = useState<string>('');
  const [lansiaError, setLansiaError] = useState<string | null>(null);

  const {
    pemeriksaan,
    allPemeriksaan,
    isLoading,
    error,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    clearFilter,
  } = useRiwayatPemeriksaan(kode);

  // Fetch lansia data untuk mendapatkan nama
  useEffect(() => {
    const fetchLansia = async () => {
      try {
        const response = await lansiaAPI.getByKode(kode);
        if (response.data) {
          setNamaLansia(response.data.nama);
        }
      } catch (err) {
        const errorMessage = handleAPIError(err);
        setLansiaError(errorMessage);
      }
    };

    fetchLansia();
  }, [kode]);

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-10 bg-neutral-200 rounded"></div>
              <div className="h-10 bg-neutral-200 rounded"></div>
              <div className="h-10 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
            <div className="h-64 bg-neutral-200 rounded"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-12 bg-neutral-200 rounded"></div>
              <div className="h-12 bg-neutral-200 rounded"></div>
              <div className="h-12 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || lansiaError) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-neutral-600 mb-6">{error || lansiaError}</p>
        </div>
      </div>
    );
  }

  // Empty State (no data at all)
  if (allPemeriksaan.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-12">
          <div className="text-neutral-400 text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            Belum Ada Riwayat Pemeriksaan
          </h3>
          <p className="text-neutral-600">
            {namaLansia} belum memiliki riwayat pemeriksaan.
          </p>
        </div>
      </div>
    );
  }

  // Empty State (filtered result is empty)
  const isFiltered = startDate || endDate;
  const hasFilteredData = pemeriksaan.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-neutral-950 mb-2">
          Riwayat Pemeriksaan
        </h2>
        <p className="text-neutral-600">
          Riwayat pemeriksaan kesehatan untuk <span className="font-medium">{namaLansia}</span>
        </p>
        <p className="text-sm text-neutral-500 mt-1">
          Total: {allPemeriksaan.length} pemeriksaan
          {isFiltered && ` • Ditampilkan: ${pemeriksaan.length} pemeriksaan`}
        </p>
      </div>

      {/* Date Range Filter */}
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClearFilter={clearFilter}
      />

      {/* Filtered Empty State */}
      {isFiltered && !hasFilteredData && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center py-12">
            <div className="text-neutral-400 text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Tidak Ada Data
            </h3>
            <p className="text-neutral-600 mb-4">
              Tidak ada pemeriksaan dalam rentang tanggal yang dipilih.
            </p>
            <button
              onClick={clearFilter}
              className="text-neutral-900 font-medium hover:underline"
            >
              Hapus filter untuk melihat semua data
            </button>
          </div>
        </div>
      )}

      {/* Content (only show if has filtered data) */}
      {hasFilteredData && (
        <>
          {/* Grafik Tren */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-6">
              Grafik Tren Kesehatan
            </h3>
            <HealthTrendCharts pemeriksaan={pemeriksaan} />
          </div>

          {/* Tabel Riwayat */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-6">
              Tabel Riwayat Pemeriksaan
            </h3>
            <PemeriksaanHistoryTable pemeriksaan={pemeriksaan} />
          </div>
        </>
      )}
    </div>
  );
}
