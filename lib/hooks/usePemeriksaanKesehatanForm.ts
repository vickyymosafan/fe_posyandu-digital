'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { pemeriksaanAPI } from '@/lib/api';
import { pemeriksaanRepository, syncQueueRepository } from '@/lib/db';
import { useOffline } from './useOffline';
import { useNotification } from '@/components/ui';
import { classifyBloodGlucose, classifyCholesterol, classifyUricAcid } from '@/lib/services/healthMetricsService';
import { parseNumber } from '@/lib/utils/numberParser';
import { pemeriksaanKesehatanSchema } from '@/lib/utils/validators';
import { handleAPIError } from '@/lib/utils/errors';
import type { PemeriksaanKesehatanData, Gender, KlasifikasiGulaDarah } from '@/types';

/**
 * Hook untuk form pemeriksaan kesehatan
 * 
 * Responsibilities (SRP):
 * - Manage form state (gdp, gds, duaJpp, kolesterol, asamUrat - all optional)
 * - Handle form validation
 * - Submit data (online/offline)
 * - Save to IndexedDB and sync queue
 * 
 * Design Principles:
 * - High Cohesion: Focused on form management only
 * - Low Coupling: Uses service layer for classifications
 * - DIP: Depends on abstractions (API, services)
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
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<PemeriksaanKesehatanFormData>(initialFormData);
  const [errors, setErrors] = useState<PemeriksaanKesehatanFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [klasifikasiGula, setKlasifikasiGula] = useState<KlasifikasiGulaDarah>({});
  const [klasifikasiKolesterolValue, setKlasifikasiKolesterolValue] = useState<string | null>(null);
  const [klasifikasiAsamUratValue, setKlasifikasiAsamUratValue] = useState<string | null>(null);

  /**
   * Classify all lab values realtime using service layer
   * Reduces coupling by using service abstractions
   */
  useEffect(() => {
    const gdp = parseNumber(formData.gulaPuasa);
    const gds = parseNumber(formData.gulaSewaktu);
    const duaJpp = parseNumber(formData.gula2Jpp);
    const kolesterol = parseNumber(formData.kolesterol);
    const asamUrat = parseNumber(formData.asamUrat);

    setKlasifikasiGula(classifyBloodGlucose(gdp, gds, duaJpp));
    setKlasifikasiKolesterolValue(classifyCholesterol(kolesterol));
    setKlasifikasiAsamUratValue(classifyUricAcid(asamUrat, gender));
  }, [
    formData.gulaPuasa,
    formData.gulaSewaktu,
    formData.gula2Jpp,
    formData.kolesterol,
    formData.asamUrat,
    gender,
  ]);



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
            // Convert string dates dari API response ke Date objects
            await pemeriksaanRepository.create({
              ...response.data,
              tanggal: new Date(response.data.tanggal),
              createdAt: new Date(response.data.createdAt),
              syncedAt: new Date(),
            });
          }

          // Show success notification
          showNotification('success', 'Pemeriksaan kesehatan berhasil disimpan');

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

          // Show success notification (offline mode)
          showNotification('success', 'Pemeriksaan kesehatan disimpan (akan disinkronkan saat online)');

          // Redirect to detail page
          router.push(`/petugas/lansia/${kode}`);
        }
      } catch (error) {
        const errorMessage = handleAPIError(error);
        showNotification('error', errorMessage);
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
      showNotification,
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
