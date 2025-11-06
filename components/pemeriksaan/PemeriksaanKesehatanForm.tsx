'use client';

import { Input, Button, Card } from '@/components/ui';
import { formatLabValue } from '@/lib/utils/formatters';
import type { UsePemeriksaanKesehatanFormReturn } from '@/lib/hooks/usePemeriksaanKesehatanForm';

/**
 * Component untuk form pemeriksaan kesehatan
 * 
 * Responsibilities (SRP):
 * - Display form fields (all optional)
 * - Show realtime lab value classifications
 * - Handle form submission
 * 
 * Props (ISP):
 * - Form state and handlers from usePemeriksaanKesehatanForm hook
 */

interface PemeriksaanKesehatanFormProps {
  formState: UsePemeriksaanKesehatanFormReturn;
}

export function PemeriksaanKesehatanForm({ formState }: PemeriksaanKesehatanFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    klasifikasiGula,
    klasifikasiKolesterolValue,
    klasifikasiAsamUratValue,
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
              {klasifikasiGula.gdp && (
                <p className="mt-1 text-sm text-neutral-600">
                  Klasifikasi: <span className="font-medium">{klasifikasiGula.gdp}</span>
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
              {klasifikasiGula.gds && (
                <p className="mt-1 text-sm text-neutral-600">
                  Klasifikasi: <span className="font-medium">{klasifikasiGula.gds}</span>
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
              {klasifikasiGula.duaJpp && (
                <p className="mt-1 text-sm text-neutral-600">
                  Klasifikasi: <span className="font-medium">{klasifikasiGula.duaJpp}</span>
                </p>
              )}
            </div>
          </div>

          {/* Gula Darah Summary */}
          {(klasifikasiGula.gdp || klasifikasiGula.gds || klasifikasiGula.duaJpp) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl" role="status">
              <p className="text-sm font-medium text-neutral-900 mb-2">
                Ringkasan Klasifikasi Gula Darah
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {klasifikasiGula.gdp && (
                  <div>
                    <span className="text-neutral-600">GDP: </span>
                    <span className="font-semibold text-blue-900">
                      {klasifikasiGula.gdp}
                    </span>
                  </div>
                )}
                {klasifikasiGula.gds && (
                  <div>
                    <span className="text-neutral-600">GDS: </span>
                    <span className="font-semibold text-blue-900">
                      {klasifikasiGula.gds}
                    </span>
                  </div>
                )}
                {klasifikasiGula.duaJpp && (
                  <div>
                    <span className="text-neutral-600">2JPP: </span>
                    <span className="font-semibold text-blue-900">
                      {klasifikasiGula.duaJpp}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
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

          {/* Kolesterol Result */}
          {klasifikasiKolesterolValue && (
            <div
              className={`mt-6 p-4 rounded-xl ${
                klasifikasiKolesterolValue === 'Tinggi'
                  ? 'bg-red-50'
                  : klasifikasiKolesterolValue === 'Batas Tinggi'
                    ? 'bg-orange-50'
                    : 'bg-green-50'
              }`}
              role="status"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Klasifikasi</p>
                  <p
                    className={`text-xl font-bold ${
                      klasifikasiKolesterolValue === 'Tinggi'
                        ? 'text-red-900'
                        : klasifikasiKolesterolValue === 'Batas Tinggi'
                          ? 'text-orange-900'
                          : 'text-green-900'
                    }`}
                  >
                    {klasifikasiKolesterolValue}
                  </p>
                </div>
                {formData.kolesterol && (
                  <div className="text-right">
                    <p className="text-sm text-neutral-600 mb-1">Nilai</p>
                    <p className="text-xl font-bold text-neutral-900">
                      {formatLabValue(parseFloat(formData.kolesterol))}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
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

          {/* Asam Urat Result */}
          {klasifikasiAsamUratValue && (
            <div
              className={`mt-6 p-4 rounded-xl ${
                klasifikasiAsamUratValue === 'Tinggi'
                  ? 'bg-red-50'
                  : klasifikasiAsamUratValue === 'Rendah'
                    ? 'bg-orange-50'
                    : 'bg-green-50'
              }`}
              role="status"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Klasifikasi</p>
                  <p
                    className={`text-xl font-bold ${
                      klasifikasiAsamUratValue === 'Tinggi'
                        ? 'text-red-900'
                        : klasifikasiAsamUratValue === 'Rendah'
                          ? 'text-orange-900'
                          : 'text-green-900'
                    }`}
                  >
                    {klasifikasiAsamUratValue}
                  </p>
                </div>
                {formData.asamUrat && (
                  <div className="text-right">
                    <p className="text-sm text-neutral-600 mb-1">Nilai</p>
                    <p className="text-xl font-bold text-neutral-900">
                      {formatLabValue(parseFloat(formData.asamUrat))}
                    </p>
                  </div>
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
