'use client';

import { Input, Button, Card } from '@/components/ui';
import { formatBMI } from '@/lib/utils/formatters';
import type { UsePemeriksaanFisikFormReturn } from '@/lib/hooks/usePemeriksaanFisikForm';

/**
 * Component untuk form pemeriksaan fisik
 * 
 * Responsibilities (SRP):
 * - Display form fields
 * - Show realtime BMI calculation and category
 * - Show realtime blood pressure classification
 * - Show Krisis Hipertensi warning
 * - Handle form submission
 * 
 * Props (ISP):
 * - Form state and handlers from usePemeriksaanFisikForm hook
 */

interface PemeriksaanFisikFormProps {
  formState: UsePemeriksaanFisikFormReturn;
}

export function PemeriksaanFisikForm({ formState }: PemeriksaanFisikFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    bmiResult,
    tekananDarahResult,
    handleChange,
    handleSubmit,
  } = formState;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Krisis Hipertensi Warning */}
      {tekananDarahResult.emergency && (
        <div
          className="bg-red-50 border-2 border-red-500 rounded-xl p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-1">
                PERHATIAN: Krisis Hipertensi
              </h3>
              <p className="text-red-800">
                Rujuk ke Fasilitas Kesehatan Segera
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pengukuran Fisik Section */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Pengukuran Fisik
          </h3>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tinggi Badan */}
            <div>
              <label
                htmlFor="tinggi"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Tinggi Badan (cm) <span className="text-red-500">*</span>
              </label>
              <Input
                id="tinggi"
                type="number"
                value={formData.tinggi}
                onChange={(e) => handleChange('tinggi', e.target.value)}
                placeholder="Contoh: 165"
                error={errors.tinggi}
                disabled={isSubmitting}
                min="50"
                max="250"
                step="0.1"
              />
              {errors.tinggi && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.tinggi}
                </p>
              )}
            </div>

            {/* Berat Badan */}
            <div>
              <label
                htmlFor="berat"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Berat Badan (kg) <span className="text-red-500">*</span>
              </label>
              <Input
                id="berat"
                type="number"
                value={formData.berat}
                onChange={(e) => handleChange('berat', e.target.value)}
                placeholder="Contoh: 60"
                error={errors.berat}
                disabled={isSubmitting}
                min="20"
                max="300"
                step="0.1"
              />
              {errors.berat && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.berat}
                </p>
              )}
            </div>
          </div>

          {/* BMI Result */}
          {bmiResult.nilai !== null && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl" role="status">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">
                    Body Mass Index (BMI)
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {formatBMI(bmiResult.nilai)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-600 mb-1">Kategori</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {bmiResult.kategori}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tekanan Darah Section */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Tekanan Darah
          </h3>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sistolik */}
            <div>
              <label
                htmlFor="sistolik"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Sistolik (mmHg) <span className="text-red-500">*</span>
              </label>
              <Input
                id="sistolik"
                type="number"
                value={formData.sistolik}
                onChange={(e) => handleChange('sistolik', e.target.value)}
                placeholder="Contoh: 120"
                error={errors.sistolik}
                disabled={isSubmitting}
                min="50"
                max="300"
              />
              {errors.sistolik && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.sistolik}
                </p>
              )}
            </div>

            {/* Diastolik */}
            <div>
              <label
                htmlFor="diastolik"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Diastolik (mmHg) <span className="text-red-500">*</span>
              </label>
              <Input
                id="diastolik"
                type="number"
                value={formData.diastolik}
                onChange={(e) => handleChange('diastolik', e.target.value)}
                placeholder="Contoh: 80"
                error={errors.diastolik}
                disabled={isSubmitting}
                min="30"
                max="200"
              />
              {errors.diastolik && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.diastolik}
                </p>
              )}
            </div>
          </div>

          {/* Tekanan Darah Result */}
          {tekananDarahResult.kategori !== null && (
            <div
              className={`mt-6 p-4 rounded-xl ${
                tekananDarahResult.emergency
                  ? 'bg-red-50'
                  : tekananDarahResult.kategori.includes('Hipertensi')
                    ? 'bg-orange-50'
                    : 'bg-green-50'
              }`}
              role="status"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Kategori</p>
                  <p
                    className={`text-xl font-bold ${
                      tekananDarahResult.emergency
                        ? 'text-red-900'
                        : tekananDarahResult.kategori.includes('Hipertensi')
                          ? 'text-orange-900'
                          : 'text-green-900'
                    }`}
                  >
                    {tekananDarahResult.kategori}
                  </p>
                </div>
                {tekananDarahResult.emergency && (
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Simpan Pemeriksaan'}
        </Button>
      </div>
    </form>
  );
}
