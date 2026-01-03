'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Modal,
  Loading,
} from '@/components/ui';
import { usePetugasList } from '@/lib/hooks/usePetugasList';
import { Petugas } from '@/types';
import { formatDate } from '@/lib/utils/formatters';

/**
 * Halaman Daftar Petugas (Admin Only)
 * 
 * Features:
 * - Tampilkan tabel daftar petugas
 * - Tombol tambah petugas
 * - Tombol edit petugas
 * - Tombol nonaktifkan/aktifkan petugas dengan konfirmasi
 * - Loading state dan error handling
 * 
 * Design Principles:
 * - SRP: Component hanya untuk presentasi dan orchestration
 * - DIP: Depends on usePetugasList hook abstraction
 * - Composition: Compose dari UI components yang sudah ada
 * 
 * @returns {JSX.Element} Halaman daftar petugas
 */
export default function DaftarPetugasPage() {
  const router = useRouter();
  const { petugas, isLoading, toggleStatus } = usePetugasList();

  // State untuk modal konfirmasi
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPetugas, setSelectedPetugas] = useState<Petugas | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  /**
   * Handle klik tombol tambah petugas
   * Navigate ke halaman form tambah
   */
  const handleTambahPetugas = () => {
    router.push('/admin/petugas/tambah');
  };



  /**
   * Handle klik tombol toggle status
   * Tampilkan modal konfirmasi
   */
  const handleToggleStatusClick = (petugas: Petugas) => {
    setSelectedPetugas(petugas);
    setShowConfirmModal(true);
  };

  /**
   * Handle konfirmasi toggle status
   * Call API untuk update status
   */
  const handleConfirmToggleStatus = async () => {
    if (!selectedPetugas) return;

    setIsTogglingStatus(true);
    const success = await toggleStatus(selectedPetugas.id, selectedPetugas.aktif);
    setIsTogglingStatus(false);

    if (success) {
      setShowConfirmModal(false);
      setSelectedPetugas(null);
    }
  };

  /**
   * Handle cancel modal
   */
  const handleCancelModal = () => {
    if (!isTogglingStatus) {
      setShowConfirmModal(false);
      setSelectedPetugas(null);
    }
  };



  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-950 mb-2">
              Daftar Petugas
            </h1>
            <p className="text-neutral-600">
              Kelola data petugas Posyandu Lansia
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleTambahPetugas}
            aria-label="Tambah petugas baru"
          >
            + Tambah Petugas
          </Button>
        </div>

        {/* Table Section */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loading variant="spinner" size="lg" />
          </div>
        ) : petugas.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-neutral-600 mb-4">
              Belum ada petugas terdaftar
            </p>
            <Button variant="primary" onClick={handleTambahPetugas}>
              Tambah Petugas Pertama
            </Button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <Table variant="striped" responsive>
              <TableHead>
                <TableRow>
                  <TableHeader>Nama</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Tanggal Dibuat</TableHeader>
                  <TableHeader>Aksi</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {petugas.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <span className="font-medium text-neutral-900">
                        {p.nama}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-neutral-700">{p.email}</span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-4 py-1.5 rounded-full text-base font-medium ${p.aktif
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {p.aktif ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-neutral-600 text-sm">
                        {formatDate(p.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={p.aktif ? 'danger' : 'primary'}
                        size="sm"
                        onClick={() => handleToggleStatusClick(p)}
                        aria-label={`${p.aktif ? 'Nonaktifkan' : 'Aktifkan'} petugas ${p.nama}`}
                      >
                        {p.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Modal Konfirmasi */}
        <Modal
          isOpen={showConfirmModal}
          onClose={handleCancelModal}
          title={`${selectedPetugas?.aktif ? 'Nonaktifkan' : 'Aktifkan'} Petugas`}
        >
          <div className="space-y-4">
            <p className="text-neutral-700">
              Apakah Anda yakin ingin{' '}
              <span className="font-semibold">
                {selectedPetugas?.aktif ? 'menonaktifkan' : 'mengaktifkan'}
              </span>{' '}
              petugas{' '}
              <span className="font-semibold">{selectedPetugas?.nama}</span>?
            </p>

            {selectedPetugas?.aktif && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Petugas yang dinonaktifkan tidak akan dapat login ke sistem.
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 justify-end pt-4">
              <Button
                variant="secondary"
                onClick={handleCancelModal}
                disabled={isTogglingStatus}
              >
                Batal
              </Button>
              <Button
                variant={selectedPetugas?.aktif ? 'danger' : 'primary'}
                onClick={handleConfirmToggleStatus}
                disabled={isTogglingStatus}
              >
                {isTogglingStatus ? (
                  <span className="flex items-center gap-2">
                    <Loading variant="spinner" size="sm" />
                    Memproses...
                  </span>
                ) : (
                  `Ya, ${selectedPetugas?.aktif ? 'Nonaktifkan' : 'Aktifkan'}`
                )}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
