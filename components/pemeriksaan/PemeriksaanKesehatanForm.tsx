'use client';

import { Input, Button, Card } from '@/components/ui';
import type { UsePemeriksaanKesehatanFormReturn } from '@/lib/hooks/usePemeriksaanKesehatanForm';

/**
 * Component untuk form pemeriksaan kesehatan
 * 
 * Responsibilities (SRP):
 * - Display form fields (all optional)
 * - Handle form submission
 * 
 * Props (ISP):
 * - Form state and handlers from usePemeriksaanKesehatanForm hook
 * 
 * Note: Health metrics classifications are calculated by the backend API
 * and will be displayed after the form is submitted and data is saved.
 */

interface PemeriksaanKesehatanFormProps {
  formState: UsePemeriksaanKesehatanFormReturn;
}

export function PemeriksaanKesehatanForm({ formState }: PemeriksaanKesehatanFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = formState;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Gula Darah Section */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Gula Darah</h3>
          <p className="text-sm text-neutral-600 mt-1">
            Semua field bersifat opsional. Isi sesuai pemeriksaan yang dilakukan.
          </p>
        </div>
        <div>
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
      </Card>

      {/* Kolesterol Section */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Kolesterol</h3>
        </div>
        <div>
          <div className="max-w-md">
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
        </div>
      </Card>

      {/* Asam Urat Section */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Asam Urat</h3>
        </div>
        <div>
          <div className="max-w-md">
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
