'use client';

import { AdminLayout } from '@/components/layout';
import { Button, Input, Card, Loading } from '@/components/ui';
import { usePetugasForm } from '@/lib/hooks/usePetugasForm';
import Link from 'next/link';

/**
 * Halaman Tambah Petugas (Admin Only)
 * 
 * Features:
 * - Form tambah petugas dengan validasi
 * - Realtime validation feedback
 * - Password visibility toggle
 * - Loading state saat submit
 * - Redirect ke daftar petugas setelah sukses
 * 
 * Design Principles:
 * - SRP: Component hanya untuk presentasi
 * - DIP: Depends on usePetugasForm hook abstraction
 * - Composition: Compose dari UI components yang sudah ada
 * 
 * @returns {JSX.Element} Halaman tambah petugas
 */
export default function TambahPetugasPage() {
  const {
    formData,
    errors,
    isSubmitting,
    showPassword,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
  } = usePetugasForm();

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/admin/petugas"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
              aria-label="Kembali ke daftar petugas"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-neutral-950">
              Tambah Petugas
            </h1>
          </div>
          <p className="text-neutral-600">
            Tambahkan petugas baru untuk sistem Posyandu Lansia
          </p>
        </div>

        {/* Form Section */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Field */}
            <div>
              <label
                htmlFor="nama"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <Input
                id="nama"
                type="text"
                value={formData.nama}
                onChange={(e) => handleChange('nama', e.target.value)}
                placeholder="Masukkan nama lengkap"
                error={errors.nama}
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.nama}
                aria-describedby={errors.nama ? 'nama-error' : undefined}
              />
              {errors.nama && (
                <p
                  id="nama-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.nama}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="contoh@email.com"
                error={errors.email}
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="kataSandi"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="kataSandi"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.kataSandi}
                  onChange={(e) => handleChange('kataSandi', e.target.value)}
                  placeholder="Minimal 8 karakter"
                  error={errors.kataSandi}
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-invalid={!!errors.kataSandi}
                  aria-describedby={
                    errors.kataSandi ? 'kataSandi-error' : 'kataSandi-help'
                  }
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
                  aria-label={
                    showPassword ? 'Sembunyikan password' : 'Tampilkan password'
                  }
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.kataSandi && (
                <p
                  id="kataSandi-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.kataSandi}
                </p>
              )}
              <p
                id="kataSandi-help"
                className="mt-1 text-sm text-neutral-600"
              >
                Password harus minimal 8 karakter dengan kombinasi huruf, angka,
                dan simbol
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Informasi Penting</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Petugas akan menerima email dengan kredensial login</li>
                    <li>
                      Petugas dapat mengubah password setelah login pertama kali
                    </li>
                    <li>Status petugas akan aktif secara otomatis</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loading variant="spinner" size="sm" />
                    Menyimpan...
                  </span>
                ) : (
                  'Simpan Petugas'
                )}
              </Button>
              <Link href="/admin/petugas" className="flex-1">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting}
                  fullWidth
                >
                  Batal
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}
