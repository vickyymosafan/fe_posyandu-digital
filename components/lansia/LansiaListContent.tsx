'use client';

import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Loading,
} from '@/components/ui';
import { useLansiaList } from '@/lib/hooks/useLansiaList';
import { formatDate, formatUmur } from '@/lib/utils/formatters';

/**
 * LansiaListContent Component
 * 
 * Komponen shared untuk menampilkan daftar lansia.
 * Dapat digunakan di halaman Admin maupun Petugas.
 * 
 * Features:
 * - Search bar dengan debounce
 * - Tabel daftar lansia
 * - Loading state
 * - Empty state
 * - Navigate ke detail lansia
 * 
 * Design Principles:
 * - SRP: Component hanya untuk presentasi
 * - DIP: Depends on useLansiaList hook abstraction
 * - Composition: Compose dari UI components yang sudah ada
 * 
 * @returns {JSX.Element} Konten daftar lansia
 */
export function LansiaListContent() {
  const router = useRouter();
  const { lansia, isLoading, searchQuery, isSearching, handleSearch } =
    useLansiaList();

  /**
   * Handle klik tombol lihat detail
   * Navigate ke halaman detail lansia
   */
  const handleViewDetail = (kode: string) => {
    // Detect current path to determine navigation
    const currentPath = window.location.pathname;
    const baseUrl = currentPath.includes('/admin') ? '/admin' : '/petugas';
    router.push(`${baseUrl}/lansia/${kode}`);
  };

  return (
    <div className="space-y-6">
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
            placeholder="Cari berdasarkan ID, Nama, atau NIK (minimal 3 karakter)"
            disabled={isLoading}
          />
          <p className="text-sm text-neutral-600">
            {isSearching
              ? 'Mencari...'
              : searchQuery.length > 0 && searchQuery.length < 3
              ? 'Ketik minimal 3 karakter untuk mencari'
              : `Menampilkan ${lansia.length} lansia`}
          </p>
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loading variant="spinner" size="lg" />
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-neutral-600 mb-2">
            {searchQuery.length >= 3
              ? 'Tidak ada lansia ditemukan'
              : 'Belum ada lansia terdaftar'}
          </p>
          <p className="text-sm text-neutral-500">
            {searchQuery.length >= 3
              ? 'Coba gunakan kata kunci yang berbeda'
              : 'Daftarkan lansia baru untuk memulai'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <Table variant="striped" responsive>
            <TableHead>
              <TableRow>
                <TableHeader>ID Lansia</TableHeader>
                <TableHeader>Nama</TableHeader>
                <TableHeader>Tanggal Lahir</TableHeader>
                <TableHeader>Umur</TableHeader>
                <TableHeader>Jenis Kelamin</TableHeader>
                <TableHeader>Aksi</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {lansia.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <span className="font-mono text-sm font-medium text-neutral-900">
                      {l.kode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-neutral-900">
                      {l.nama}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-neutral-700">
                      {formatDate(l.tanggalLahir)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-neutral-700">
                      {formatUmur(l.tanggalLahir)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {'gender' in l ? (
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          l.gender === 'L'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-pink-100 text-pink-800'
                        }`}
                      >
                        {l.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    ) : (
                      <span className="text-neutral-500 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleViewDetail(l.kode)}
                      aria-label={`Lihat detail ${l.nama}`}
                    >
                      Lihat Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
