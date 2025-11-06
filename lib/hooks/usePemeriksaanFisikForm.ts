'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { pemeriksaanAPI } from '@/lib/api';
import { pemeriksaanRepository, syncQueueRepository } from '@/lib/db';
import { useOffline } from './useOffline';
import { useNotification } from '@/components/ui';
import { hitungBMISafe, klasifikasiBMISafe } from '@/lib/utils/bmi';
import { klasifikasiTekananDarahSafe } from '@/lib/utils/tekananDarah';
import { pemeriksaanFisikSchema } from '@/lib/utils/validators';
import { handleAPIError } from '@/lib/utils/errors';
import type { PemeriksaanFisikData } from '@/types';

/**
 * Hook untuk form pemeriksaan fisik
 * 
 * Responsibilities (SRP):
 * - Manage form state (tinggi, berat, sistolik, diastolik)
 * - Calculate BMI realtime
 * - Classify blood pressure realtime
 * - Handle form validation
 * - Submit data (online/offline)
 * - Save to IndexedDB and sync queue
 * 
 * @param kode - Kode unik lansia
 * @param lansiaId - ID lansia untuk IndexedDB
 */

export interface PemeriksaanFisikFormData {
  tinggi: string;
  berat: string;
  sistolik: string;
  diastolik: string;
}

export interface PemeriksaanFisikFormErrors {
  tinggi?: string;
  berat?: string;
  sistolik?: string;
  diastolik?: string;
}

export interface BMIResult {
  nilai: number | null;
  kategori: string | null;
}

export interface TekananDarahResult {
  kategori: string | null;
  emergency: boolean;
}

export interface UsePemeriksaanFisikFormReturn {
  formData: PemeriksaanFisikFormData;
  errors: PemeriksaanFisikFormErrors;
  isSubmitting: boolean;
  bmiResult: BMIResult;
  tekananDarahResult: TekananDarahResult;
  handleChange: (field: keyof PemeriksaanFisikFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

const initialFormData: PemeriksaanFisikFormData = {
  tinggi: '',
  berat: '',
  sistolik: '',
  diastolik: '',
};

export function usePemeriksaanFisikForm(
  kode: string,
  lansiaId: number
): UsePemeriksaanFisikFormReturn {
  const router = useRouter();
  const { isOnline } = useOffline();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<PemeriksaanFisikFormData>(initialFormData);
  const [errors, setErrors] = useState<PemeriksaanFisikFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bmiResult, setBmiResult] = useState<BMIResult>({ nilai: null, kategori: null });
  const [tekananDarahResult, setTekananDarahResult] = useState<TekananDarahResult>({
    kategori: null,
    emergency: false,
  });

  /**
   * Calculate BMI realtime (menggunakan safe version untuk tidak throw error)
   */
  useEffect(() => {
    const tinggi = parseFloat(formData.tinggi);
    const berat = parseFloat(formData.berat);

    if (!isNaN(tinggi) && !isNaN(berat) && tinggi > 0 && berat > 0) {
      const bmi = hitungBMISafe(berat, tinggi);
      const kategori = klasifikasiBMISafe(bmi);
      setBmiResult({ nilai: bmi, kategori });
    } else {
      setBmiResult({ nilai: null, kategori: null });
    }
  }, [formData.tinggi, formData.berat]);

  /**
   * Classify blood pressure realtime (menggunakan safe version untuk tidak throw error)
   */
  useEffect(() => {
    const sistolik = parseFloat(formData.sistolik);
    const diastolik = parseFloat(formData.diastolik);

    if (!isNaN(sistolik) && !isNaN(diastolik) && sistolik > 0 && diastolik > 0) {
      const result = klasifikasiTekananDarahSafe(sistolik, diastolik);
      if (result) {
        setTekananDarahResult(result);
      } else {
        setTekananDarahResult({ kategori: null, emergency: false });
      }
    } else {
      setTekananDarahResult({ kategori: null, emergency: false });
    }
  }, [formData.sistolik, formData.diastolik]);

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (field: keyof PemeriksaanFisikFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  /**
   * Validate form
   */
  const validateForm = useCallback((): boolean => {
    try {
      const data = {
        tinggi: parseFloat(formData.tinggi),
        berat: parseFloat(formData.berat),
        sistolik: parseFloat(formData.sistolik),
        diastolik: parseFloat(formData.diastolik),
      };

      pemeriksaanFisikSchema.parse(data);
      setErrors({});
      return true;
    } catch (error: unknown) {
      const newErrors: PemeriksaanFisikFormErrors = {};
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: Array<string | number>; message: string }> };
        zodError.errors.forEach((err) => {
          const field = err.path[0] as keyof PemeriksaanFisikFormErrors;
          newErrors[field] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  }, [formData]);

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const data: PemeriksaanFisikData = {
          tinggi: parseFloat(formData.tinggi),
          berat: parseFloat(formData.berat),
          sistolik: parseFloat(formData.sistolik),
          diastolik: parseFloat(formData.diastolik),
        };

        if (isOnline) {
          // Online: submit to API
          const response = await pemeriksaanAPI.createFisik(kode, data);

          if (response.error) {
            throw new Error(response.error);
          }

          // Save to IndexedDB for offline access
          if (response.data) {
            await pemeriksaanRepository.create({
              ...response.data,
              syncedAt: new Date(),
            });
          }

          // Show success notification
          showNotification('success', 'Pemeriksaan fisik berhasil disimpan');

          // Redirect to detail page
          router.push(`/petugas/lansia/${kode}`);
        } else {
          // Offline: save to IndexedDB and sync queue
          const pemeriksaan = {
            id: Date.now(), // Temporary ID
            lansiaId,
            tanggal: new Date(),
            tinggi: data.tinggi,
            berat: data.berat,
            bmi: bmiResult.nilai || undefined,
            kategoriBmi: bmiResult.kategori || undefined,
            sistolik: data.sistolik,
            diastolik: data.diastolik,
            tekananDarah: tekananDarahResult.kategori || undefined,
            createdAt: new Date(),
          };

          await pemeriksaanRepository.create(pemeriksaan);

          // Add to sync queue
          await syncQueueRepository.add({
            entity: 'PEMERIKSAAN',
            type: 'CREATE',
            data: { kode, ...data },
          });

          // Show success notification (offline mode)
          showNotification('success', 'Pemeriksaan fisik disimpan (akan disinkronkan saat online)');

          // Redirect to detail page
          router.push(`/petugas/lansia/${kode}`);
        }
      } catch (error) {
        const errorMessage = handleAPIError(error);
        showNotification('error', errorMessage);
        setErrors({ tinggi: errorMessage });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      kode,
      lansiaId,
      isOnline,
      bmiResult,
      tekananDarahResult,
      validateForm,
      router,
      showNotification,
    ]
  );

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setBmiResult({ nilai: null, kategori: null });
    setTekananDarahResult({ kategori: null, emergency: false });
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    bmiResult,
    tekananDarahResult,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
