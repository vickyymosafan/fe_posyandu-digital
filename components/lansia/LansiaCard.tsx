'use client';

/**
 * LansiaCard Component
 *
 * Komponen card untuk menampilkan informasi lansia.
 * Digunakan di halaman pencarian untuk tampilan yang lebih visual.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya bertanggung jawab untuk menampilkan card lansia
 * - OCP: Extensible dengan props
 * - Composition: Menggunakan Button dari UI components
 */

import { Button } from '@/components/ui';
import { formatDate, formatUmur } from '@/lib/utils/formatters';
import type { Lansia, MinimalLansia } from '@/types';

// ============================================
// Types
// ============================================

interface LansiaCardProps {
  lansia: Lansia | MinimalLansia;
  onViewDetail: (kode: string) => void;
}

// ============================================
// Component
// ============================================

export function LansiaCard({ lansia, onViewDetail }: LansiaCardProps) {
  return (
    <div className="card hover:shadow-md transition-shadow duration-300">
      <div className="space-y-4">
        {/* Header dengan ID */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-600 mb-1">ID Lansia</p>
            <p className="font-mono text-lg font-bold text-neutral-950">
              {lansia.kode}
            </p>
          </div>
          {'gender' in lansia && (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                lansia.gender === 'L'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-pink-100 text-pink-800'
              }`}
            >
              {lansia.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
            </span>
          )}
        </div>

        {/* Nama */}
        <div>
          <p className="text-sm text-neutral-600 mb-1">Nama Lengkap</p>
          <p className="text-xl font-semibold text-neutral-950">
            {lansia.nama}
          </p>
        </div>

        {/* Info Tanggal Lahir dan Umur */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-600 mb-1">Tanggal Lahir</p>
            <p className="text-base text-neutral-900">
              {formatDate(lansia.tanggalLahir)}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 mb-1">Umur</p>
            <p className="text-base text-neutral-900">
              {formatUmur(lansia.tanggalLahir)}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            fullWidth
            onClick={() => onViewDetail(lansia.kode)}
            aria-label={`Lihat detail ${lansia.nama}`}
          >
            Lihat Detail
          </Button>
        </div>
      </div>
    </div>
  );
}
