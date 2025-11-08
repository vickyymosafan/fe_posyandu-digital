'use client';

/**
 * LansiaForm Component
 *
 * Form untuk pendaftaran lansia baru.
 * Mengikuti prinsip:
 * - SRP: Hanya bertanggung jawab untuk UI presentation
 * - OCP: Extensible dengan props
 * - Composition: Menggunakan UI components yang sudah ada
 */

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useLansiaForm } from '@/lib/hooks/useLansiaForm';

// ============================================
// Component
// ============================================

export function LansiaForm() {
  const {
    formData,
    errors,
    isSubmitting,
    generatedKode,
    handleChange,
    handleSubmit,
    resetForm,
  } = useLansiaForm();

  /**
   * Handle close success modal
   */
  const handleCloseSuccessModal = () => {
    resetForm();
  };

  /**
   * Get validation state untuk Input component
   */
  const getValidationState = (
    field: keyof typeof formData
  ): 'error' | 'success' | 'default' => {
    if (errors[field]) return 'error';
    if (formData[field] && !errors[field]) return 'success';
    return 'default';
  };

  return (
    <>
      <Card padding="lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-950">
            Pendaftaran Lansia Baru
          </h2>
          <p className="text-neutral-600 mt-2">
            Lengkapi data lansia untuk mendaftarkan ke sistem Posyandu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* NIK */}
            <Input
              label="NIK"
              type="text"
              value={formData.nik}
              onChange={(e) => handleChange('nik', e.target.value)}
              error={errors.nik}
              validationState={getValidationState('nik')}
              placeholder="Masukkan 16 digit NIK"
              maxLength={16}
              required
              disabled={isSubmitting}
              helperText={`${formData.nik.length}/16 karakter`}
            />

            {/* KK */}
            <Input
              label="Nomor Kartu Keluarga (KK)"
              type="text"
              value={formData.kk}
              onChange={(e) => handleChange('kk', e.target.value)}
              error={errors.kk}
              validationState={getValidationState('kk')}
              placeholder="Masukkan 16 digit KK"
              maxLength={16}
              required
              disabled={isSubmitting}
              helperText={`${formData.kk.length}/16 karakter`}
            />

            {/* Nama */}
            <Input
              label="Nama Lengkap"
              type="text"
              value={formData.nama}
              onChange={(e) => handleChange('nama', e.target.value)}
              error={errors.nama}
              validationState={getValidationState('nama')}
              placeholder="Masukkan nama lengkap"
              required
              disabled={isSubmitting}
            />

            {/* Tanggal Lahir */}
            <Input
              label="Tanggal Lahir"
              type="date"
              value={formData.tanggalLahir}
              onChange={(e) => handleChange('tanggalLahir', e.target.value)}
              error={errors.tanggalLahir}
              validationState={getValidationState('tanggalLahir')}
              required
              disabled={isSubmitting}
              max={new Date().toISOString().split('T')[0]}
            />

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="L"
                    checked={formData.gender === 'L'}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-neutral-900 focus:ring-2 focus:ring-neutral-900"
                  />
                  <span className="text-neutral-900">Laki-laki</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="P"
                    checked={formData.gender === 'P'}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-neutral-900 focus:ring-2 focus:ring-neutral-900"
                  />
                  <span className="text-neutral-900">Perempuan</span>
                </label>
              </div>
              {errors.gender && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {errors.gender}
                </p>
              )}
            </div>

            {/* Alamat */}
            <div>
              <label
                htmlFor="alamat"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                id="alamat"
                value={formData.alamat}
                onChange={(e) => handleChange('alamat', e.target.value)}
                disabled={isSubmitting}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.alamat
                    ? 'border-red-500 focus:ring-red-500'
                    : formData.alamat
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-neutral-300 focus:ring-neutral-900'
                }`}
                placeholder="Masukkan alamat lengkap"
              />
              {errors.alamat && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {errors.alamat}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? 'Mendaftarkan...' : 'Daftarkan Lansia'}
              </Button>
            </div>
          </form>
      </Card>

      {/* Success Modal */}
      <Modal
        isOpen={!!generatedKode}
        onClose={handleCloseSuccessModal}
        title="Pendaftaran Berhasil"
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <p className="text-neutral-700 mb-4">
              Lansia berhasil didaftarkan dengan ID:
            </p>
            <div className="bg-neutral-100 rounded-xl p-4">
              <p className="text-2xl font-bold text-neutral-950 font-mono">
                {generatedKode}
              </p>
            </div>
            <p className="text-sm text-neutral-600 mt-4">
              Simpan ID ini untuk keperluan pemeriksaan selanjutnya
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="primary"
              onClick={handleCloseSuccessModal}
              fullWidth
            >
              Daftarkan Lansia Lain
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
