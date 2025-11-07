'use client';

import { Input, Button, Card } from '@/components/ui';
import type { UsePemeriksaanGabunganFormReturn } from '@/lib/hooks/usePemeriksaanGabunganForm';

/**
 * Component untuk form pemeriksaan gabungan (fisik + kesehatan)
 * 
 * Responsibilities (SRP):
 * - Display form fields untuk data fisik dan kesehatan
 * - Handle form submission
 * 
 * Props (ISP):
 * - Form state and handlers from usePemeriksaanGabunganForm hook
 * 
 * Design Principles:
 * - Composition: Compose dari UI components yang sudah ada
 * - DRY: Reuse Input, Button, Card components
 * - KISS: Simple and straightforward UI
 * 
 * Note: Health metrics calculations (BMI, blood pressure, etc.) are performed
 * by the backend API and will be displayed after the form is submitted.
 */

interface PemeriksaanGabunganFormProps {
  formState: UsePemeriksaanGabunganFormReturn;
}

export function PemeriksaanGabunganForm({ formState }: PemeriksaanGabunganFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = formState;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pengukuran Fisik Section */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Pengukuran Fisik
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Semua field wajib diisi
          </p>
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
        </div>
      </Card>

      {/* Tekanan Darah Section */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Tekanan Darah
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Semua field wajib diisi
          </p>
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
        </div>
      </Card>

      {/* Pemeriksaan Kesehatan (Lab) Section */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Pemeriksaan Kesehatan (Lab)
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Semua field bersifat opsional. Isi sesuai pemeriksaan yang dilakukan.
          </p>
        </div>

        {/* Gula Darah */}
        <div className="mb-6">
          <h4 className="text-base font-medium text-neutral-900 mb-4">Gula Darah</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gula Darah Puasa (GDP) */}
            <div>
              <label
                htmlFor="gulaPuasa"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Gula Darah Puasa (GDP)
              </label>
              <Input
                id="gulaPuasa"
                type="number"
                value={formData.gulaPuasa}
                onChange={(e) => handleChange('gulaPuasa', e.target.value)}
                placeholder="mg/dL"
                error={errors.gulaPuasa}
                disabled={isSubmitting}
                min="20"
                max="600"
              />
              {errors.gulaPuasa && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.gulaPuasa}
                </p>
              )}
            </div>

            {/* Gula Darah Sewaktu (GDS) */}
            <div>
              <label
                htmlFor="gulaSewaktu"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Gula Darah Sewaktu (GDS)
              </label>
              <Input
                id="gulaSewaktu"
                type="number"
                value={formData.gulaSewaktu}
                onChange={(e) => handleChange('gulaSewaktu', e.target.value)}
                placeholder="mg/dL"
                error={errors.gulaSewaktu}
                disabled={isSubmitting}
                min="20"
                max="600"
              />
              {errors.gulaSewaktu && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.gulaSewaktu}
                </p>
              )}
            </div>

            {/* Gula Darah 2 Jam Post Prandial (2JPP) */}
            <div>
              <label
                htmlFor="gula2Jpp"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Gula Darah 2JPP
              </label>
              <Input
                id="gula2Jpp"
                type="number"
                value={formData.gula2Jpp}
                onChange={(e) => handleChange('gula2Jpp', e.target.value)}
                placeholder="mg/dL"
                error={errors.gula2Jpp}
                disabled={isSubmitting}
                min="20"
                max="600"
              />
              {errors.gula2Jpp && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.gula2Jpp}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Kolesterol dan Asam Urat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolesterol */}
          <div>
            <label
              htmlFor="kolesterol"
              className="block text-sm font-medium text-neutral-900 mb-2"
            >
              Kolesterol Total
            </label>
            <Input
              id="kolesterol"
              type="number"
              value={formData.kolesterol}
              onChange={(e) => handleChange('kolesterol', e.target.value)}
              placeholder="mg/dL"
              error={errors.kolesterol}
              disabled={isSubmitting}
              min="50"
              max="500"
            />
            {errors.kolesterol && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.kolesterol}
              </p>
            )}
          </div>

          {/* Asam Urat */}
          <div>
            <label
              htmlFor="asamUrat"
              className="block text-sm font-medium text-neutral-900 mb-2"
            >
              Asam Urat
            </label>
            <Input
              id="asamUrat"
              type="number"
              value={formData.asamUrat}
              onChange={(e) => handleChange('asamUrat', e.target.value)}
              placeholder="mg/dL"
              error={errors.asamUrat}
              disabled={isSubmitting}
              min="1"
              max="20"
              step="0.1"
            />
            {errors.asamUrat && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.asamUrat}
              </p>
            )}
          </div>
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
