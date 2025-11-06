'use client';

/**
 * SearchLansiaContent Component
 *
 * Komponen untuk halaman pencarian lansia dengan tampilan card.
 * Menggunakan useLansiaList hook untuk logic dan LansiaCard untuk display.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya bertanggung jawab untuk UI pencarian
 * - DIP: Depend on useLansiaList hook abstraction
 * - DRY: Reuse existing hook dan components
 * - Composition: Compose dari LansiaCard dan UI components
 */

import { useRouter } from 'next/navigation';
import { Input, Loading } from '@/components/ui';
import { useLansiaList } from '@/lib/hooks/useLansiaList';
import { LansiaCard } from './LansiaCard';

// ============================================
// Component
// ============================================

export function SearchLansiaContent() {
  const router = useRouter();
  const { lansia, isLoading, searchQuery, isSearching, handleSearch } =
    useLansiaList();

  /**
   * Handle klik tombol lihat detail
   * Navigate ke halaman detail lansia
   */
  const handleViewDetail = (kode: string) => {
    router.push(`/petugas/lansia/${kode}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-950 mb-2">
          Pencarian Lansia
        </h1>
        <p className="text-neutral-600">
          Cari lansia berdasarkan ID, nama, atau NIK
        </p>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="space-y-2">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-neutral-900"
          >
            Cari Lansia
          </label>
          <Input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari berdasarkan ID, Nama, atau NIK"
            disabled={isLoading}
            autoFocus
          />
          <p className="text-sm text-neutral-600">
            {isSearching
              ? 'Mencari...'
              : searchQuery.length > 0 && searchQuery.length < 3
                ? 'Ketik minimal 3 karakter untuk mencari'
                : searchQuery.length >= 3
                  ? `Ditemukan ${lansia.length} lansia`
                  : 'Ketik minimal 3 karakter untuk memulai pencarian'}
          </p>
        </div>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loading variant="spinner" size="lg" />
        </div>
      ) : searchQuery.length < 3 ? (
        <div className="card text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-neutral-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-neutral-600 mb-2">Mulai Pencarian</p>
          <p className="text-sm text-neutral-500">
            Ketik minimal 3 karakter untuk mencari lansia
          </p>
        </div>
      ) : lansia.length === 0 ? (
        <div className="card text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-neutral-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-neutral-600 mb-2">Tidak ada lansia ditemukan</p>
          <p className="text-sm text-neutral-500">
            Coba gunakan kata kunci yang berbeda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lansia.map((l) => (
            <LansiaCard
              key={l.id}
              lansia={l}
              onViewDetail={handleViewDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
}
