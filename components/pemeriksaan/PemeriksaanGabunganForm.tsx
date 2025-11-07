'use client';

import { useMemo } from 'react';
import { Input, Button, Card } from '@/components/ui';
import type { UsePemeriksaanGabunganFormReturn } from '@/lib/hooks/usePemeriksaanGabunganForm';
import { hitungBMI } from '@/lib/utils/bmi';
import { klasifikasiTekananDarah } from '@/lib/utils/tekananDarah';
import { klasifikasiGDP, klasifikasiGDS, klasifikasiDuaJPP } from '@/lib/utils/gulaDarah';
import { klasifikasiKolesterol } from '@/lib/utils/kolesterol';
import { klasifikasiAsamUrat } from '@/lib/utils/asamUrat';

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

  // Real-time calculations
  const bmiResult = useMemo(() => {
    const tinggi = parseFloat(formData.tinggi);
    const berat = parseFloat(formData.berat);
    return hitungBMI(berat, tinggi);
  }, [formData.tinggi, formData.berat]);

  const tekananDarahResult = useMemo(() => {
    const sistolik = parseFloat(formData.sistolik);
    const diastolik = parseFloat(formData.diastolik);
    return klasifikasiTekananDarah(sistolik, diastolik);
  }, [formData.sistolik, formData.diastolik]);

  const gulaPuasaKlasifikasi = useMemo(() => {
    const nilai = parseFloat(formData.gulaPuasa);
    return klasifikasiGDP(nilai);
  }, [formData.gulaPuasa]);

  const gulaSewaktuKlasifikasi = useMemo(() => {
    const nilai = parseFloat(formData.gulaSewaktu);
    return klasifikasiGDS(nilai);
  }, [formData.gulaSewaktu]);

  const gula2JppKlasifikasi = useMemo(() => {
    const nilai = parseFloat(formData.gula2Jpp);
    return klasifikasiDuaJPP(nilai);
  }, [formData.gula2Jpp]);

  const kolesterolKlasifikasi = useMemo(() => {
    const nilai = parseFloat(formData.kolesterol);
    return klasifikasiKolesterol(nilai);
  }, [formData.kolesterol]);

  const asamUratKlasifikasi = useMemo(() => {
    const nilai = parseFloat(formData.asamUrat);
    // Note: Gender should be passed from parent component
    // For now, we'll show both classifications
    return nilai > 0 ? {
      laki: klasifikasiAsamUrat(nilai, 'L'),
      perempuan: klasifikasiAsamUrat(nilai, 'P'),
    } : null;
  }, [formData.asamUrat]);

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

          {/* BMI Result */}
          {bmiResult && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Body Mass Index (BMI)
                  </p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {bmiResult.nilai}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700">Kategori:</p>
                  <p className={`text-lg font-semibold mt-1 ${
                    bmiResult.kategori === 'Normal' ? 'text-green-600' :
                    bmiResult.kategori.includes('Obesitas') ? 'text-red-600' :
                    'text-orange-600'
                  }`}>
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

          {/* Tekanan Darah Result */}
          {tekananDarahResult && (
            <div className={`mt-4 p-4 rounded-lg border ${
              tekananDarahResult.emergency 
                ? 'bg-red-50 border-red-200' 
                : tekananDarahResult.kategori === 'Normal'
                ? 'bg-green-50 border-green-200'
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    tekananDarahResult.emergency ? 'text-red-900' :
                    tekananDarahResult.kategori === 'Normal' ? 'text-green-900' :
                    'text-orange-900'
                  }`}>
                    Klasifikasi Tekanan Darah
                  </p>
                  <p className={`text-lg font-bold mt-1 ${
                    tekananDarahResult.emergency ? 'text-red-700' :
                    tekananDarahResult.kategori === 'Normal' ? 'text-green-700' :
                    'text-orange-700'
                  }`}>
                    {tekananDarahResult.kategori}
                  </p>
                </div>
                {tekananDarahResult.emergency && (
                  <div className="flex items-center gap-2 text-red-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold">EMERGENCY!</span>
                  </div>
                )}
              </div>
            </div>
          )}
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
              {gulaPuasaKlasifikasi && (
                <p className={`mt-2 text-sm font-medium ${
                  gulaPuasaKlasifikasi === 'Normal' ? 'text-green-600' :
                  gulaPuasaKlasifikasi === 'Diabetes' ? 'text-red-600' :
                  'text-orange-600'
                }`}>
                  {gulaPuasaKlasifikasi}
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
              {gulaSewaktuKlasifikasi && (
                <p className={`mt-2 text-sm font-medium ${
                  gulaSewaktuKlasifikasi === 'Normal' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {gulaSewaktuKlasifikasi}
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
              {gula2JppKlasifikasi && (
                <p className={`mt-2 text-sm font-medium ${
                  gula2JppKlasifikasi === 'Normal' ? 'text-green-600' :
                  gula2JppKlasifikasi === 'Diabetes' ? 'text-red-600' :
                  'text-orange-600'
                }`}>
                  {gula2JppKlasifikasi}
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
            {kolesterolKlasifikasi && (
              <p className={`mt-2 text-sm font-medium ${
                kolesterolKlasifikasi === 'Normal' ? 'text-green-600' :
                kolesterolKlasifikasi === 'Tinggi' ? 'text-red-600' :
                'text-orange-600'
              }`}>
                {kolesterolKlasifikasi}
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
            {asamUratKlasifikasi && (
              <div className="mt-2 text-sm">
                <p className="text-neutral-600 mb-1">Klasifikasi:</p>
                <div className="flex gap-4">
                  <span className={`font-medium ${
                    asamUratKlasifikasi.laki === 'Normal' ? 'text-green-600' :
                    asamUratKlasifikasi.laki === 'Tinggi' ? 'text-red-600' :
                    'text-orange-600'
                  }`}>
                    L: {asamUratKlasifikasi.laki}
                  </span>
                  <span className={`font-medium ${
                    asamUratKlasifikasi.perempuan === 'Normal' ? 'text-green-600' :
                    asamUratKlasifikasi.perempuan === 'Tinggi' ? 'text-red-600' :
                    'text-orange-600'
                  }`}>
                    P: {asamUratKlasifikasi.perempuan}
                  </span>
                </div>
              </div>
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
