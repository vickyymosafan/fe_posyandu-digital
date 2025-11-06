'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { pemeriksaanAPI } from '@/lib/api';
import { pemeriksaanRepository, syncQueueRepository } from '@/lib/db';
import { useOffline } from './useOffline';
import { klasifikasiGulaDarah } from '@/lib/utils/gulaDarah';
import { klasifikasiKolesterol } from '@/lib/utils/kolesterol';
import { klasifikasiAsamUrat } from '@/lib/utils/asamUrat';
import { pemeriksaanKesehatanSchema } from '@/lib/utils/validators';
import { handleAPIError } from '@/lib/utils/errors';
import type { PemeriksaanKesehatanData, Gender, KlasifikasiGulaDarah } from '@/types';

/**
 * Hook untuk form pemeriksaan kesehatan
 * 
 * Responsibilities (SRP):
 * - Manage form state (gdp, gds, duaJpp, kolesterol, asamUrat - all optional)
 * - Classify lab values realtime
 * - Handle form validation
 * - Submit data (online/offline)
 * - Save to IndexedDB and sync queue
 * 
 * @param kode - Kode unik lansia
 * @param lansiaId - ID lansia untuk IndexedDB
 * @param gender - Jenis kelamin lansia untuk klasifikasi asam urat
 */

export interface PemeriksaanKesehatanFormData {
  gulaPuasa: string;
  gulaSewaktu: string;
  gula2Jpp: string;
  kolesterol: string;
  asamUrat: string;
}

export interface PemeriksaanKesehatanFormErrors {
  gulaPuasa?: string;
  gulaSewaktu?: string;
  gula2Jpp?: string;
  kolesterol?: string;
  asamUrat?: string;
}

export interface UsePemeriksaanKesehatanFormReturn {
  formData: PemeriksaanKesehatanFormData;
  errors: PemeriksaanKesehatanFormErrors;
  isSubmitting: boolean;
  klasifikasiGula: KlasifikasiGulaDarah;
  klasifikasiKolesterolValue: string | null;
  klasifikasiAsamUratValue: string | null;
  handleChange: (field: keyof PemeriksaanKesehatanFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

const initialFormData: PemeriksaanKesehatanFormData = {
  gulaPuasa: '',
  gulaSewaktu: '',
  gula2Jpp: '',
  kolesterol: '',
  asamUrat: '',
};

export function usePemeriksaanKesehatanForm(
  kode: string,
  lansiaId: number,
  gender: Gender
): UsePemeriksaanKesehatanFormReturn {
  const router = useRouter();
  const { isOnline } = useOffline();
  const [formData, setFormData] = useState<PemeriksaanKesehatanFormData>(initialFormData);
  const [errors, setErrors] = useState<PemeriksaanKesehatanFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [klasifikasiGula, setKlasifikasiGula] = useState<KlasifikasiGulaDarah>({});
  const [klasifikasiKolesterolValue, setKlasifikasiKolesterolValue] = useState<string | null>(null);
  const [klasifikasiAsamUratValue, setKlasifikasiAsamUratValue] = useState<string | null>(null);

  /**
   * Classify gula darah realtime
   */
  useEffect(() => {
    const gdp = formData.gulaPuasa ? parseFloat(formData.gulaPuasa) : undefined;
    const gds = formData.gulaSewaktu ? parseFloat(formData.gulaSewaktu) : undefined;
    const duaJpp = formData.gula2Jpp ? parseFloat(formData.gula2Jpp) : undefined;

    const result = klasifikasiGulaDarah(gdp, gds, duaJpp);
    setKlasifikasiGula(result);
  }, [formData.gulaPuasa, formData.gulaSewaktu, formData.gula2Jpp]);

  /**
   * Classify kolesterol realtime
   */
  useEffect(() => {
    const kolesterol = parseFloat(formData.kolesterol);
    if (!isNaN(kolesterol) && kolesterol > 0) {
      const result = klasifikasiKolesterol(kolesterol);
      setKlasifikasiKolesterolValue(result);
    } else {
      setKlasifikasiKolesterolValue(null);
    }
  }, [formData.kolesterol]);

  /**
   * Classify asam urat realtime
   */
  useEffect(() => {
    const asamUrat = parseFloat(formData.asamUrat);
    if (!isNaN(asamUrat) && asamUrat > 0) {
      const result = klasifikasiAsamUrat(asamUrat, gender);
      setKlasifikasiAsamUratValue(result);
    } else {
      setKlasifikasiAsamUratValue(null);
    }
  }, [formData.asamUrat, gender]);

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (field: keyof PemeriksaanKesehatanFormData, value: string) => {
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
      const data: PemeriksaanKesehatanData = {
        gulaPuasa: formData.gulaPuasa ? parseFloat(formData.gulaPuasa) : undefined,
        gulaSewaktu: formData.gulaSewaktu ? parseFloat(formData.gulaSewaktu) : undefined,
        gula2Jpp: formData.gula2Jpp ? parseFloat(formData.gula2Jpp) : undefined,
        kolesterol: formData.kolesterol ? parseFloat(formData.kolesterol) : undefined,
        asamUrat: formData.asamUrat ? parseFloat(formData.asamUrat) : undefined,
      };

      // Check if at least one field is filled
      const hasData = Object.values(data).some((value) => value !== undefined);
      if (!hasData) {
        setErrors({ gulaPuasa: 'Minimal satu field harus diisi' });
        return false;
      }

      pemeriksaanKesehatanSchema.parse(data);
      setErrors({});
      return true;
    } catch (error: unknown) {
      const newErrors: PemeriksaanKesehatanFormErrors = {};
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: Array<string | number>; message: string }> };
        zodError.errors.forEach((err) => {
          const field = err.path[0] as keyof PemeriksaanKesehatanFormErrors;
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
        const data: PemeriksaanKesehatanData = {
          gulaPuasa: formData.gulaPuasa ? parseFloat(formData.gulaPuasa) : undefined,
          gulaSewaktu: formData.gulaSewaktu ? parseFloat(formData.gulaSewaktu) : undefined,
          gula2Jpp: formData.gula2Jpp ? parseFloat(formData.gula2Jpp) : undefined,
          kolesterol: formData.kolesterol ? parseFloat(formData.kolesterol) : undefined,
          asamUrat: formData.asamUrat ? parseFloat(formData.asamUrat) : undefined,
        };

        if (isOnline) {
          // Online: submit to API
          const response = await pemeriksaanAPI.createKesehatan(kode, data);

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

          // Redirect to detail page
          router.push(`/petugas/lansia/${kode}`);
        } else {
          // Offline: save to IndexedDB and sync queue
          const pemeriksaan = {
            id: Date.now(), // Temporary ID
            lansiaId,
            tanggal: new Date(),
            asamUrat: data.asamUrat,
            gulaPuasa: data.gulaPuasa,
            gulaSewaktu: data.gulaSewaktu,
            gula2Jpp: data.gula2Jpp,
            klasifikasiGula: klasifikasiGula,
            kolesterol: data.kolesterol,
            klasifikasiKolesterol: klasifikasiKolesterolValue || undefined,
            createdAt: new Date(),
          };

          await pemeriksaanRepository.create(pemeriksaan);

          // Add to sync queue
          await syncQueueRepository.add({
            entity: 'PEMERIKSAAN',
            type: 'CREATE',
            data: { kode, ...data },
          });

          // Redirect to detail page
          router.push(`/petugas/lansia/${kode}`);
        }
      } catch (error) {
        const errorMessage = handleAPIError(error);
        setErrors({ gulaPuasa: errorMessage });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      kode,
      lansiaId,
      isOnline,
      klasifikasiGula,
      klasifikasiKolesterolValue,
      validateForm,
      router,
    ]
  );

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setKlasifikasiGula({});
    setKlasifikasiKolesterolValue(null);
    setKlasifikasiAsamUratValue(null);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    klasifikasiGula,
    klasifikasiKolesterolValue,
    klasifikasiAsamUratValue,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
