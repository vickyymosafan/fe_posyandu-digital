'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { pemeriksaanAPI } from '@/lib/api';
import { pemeriksaanRepository, syncQueueRepository } from '@/lib/db';
import { useOffline } from './useOffline';
import { useNotification } from '@/components/ui';
import { pemeriksaanKesehatanSchema } from '@/lib/utils/validators';
import { handleAPIError } from '@/lib/utils/errors';
import type { PemeriksaanKesehatanData, Gender } from '@/types';

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
 * - Low Coupling: Delegates calculations to backend API
 * - DIP: Depends on abstractions (API)
 * 
 * Note: Health metrics classifications (blood glucose, cholesterol, uric acid) are
 * calculated by the backend API using WHO standards. The frontend only collects and
 * validates input data, then displays the calculated results from the API response.
 * 
 * @param kode - Kode unik lansia
 * @param lansiaId - ID lansia untuk IndexedDB
 * @param gender - Jenis kelamin lansia (not used for client-side calculations)
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
  _gender: Gender // eslint-disable-line @typescript-eslint/no-unused-vars
): UsePemeriksaanKesehatanFormReturn {
  // Note: _gender parameter kept for backward compatibility but not used
  // Classifications are now performed by the backend API
  const router = useRouter();
  const { isOnline } = useOffline();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<PemeriksaanKesehatanFormData>(initialFormData);
  const [errors, setErrors] = useState<PemeriksaanKesehatanFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);



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
          // Note: Classifications will be calculated by backend when synced
          const pemeriksaan = {
            id: Date.now(), // Temporary ID
            lansiaId,
            tanggal: new Date(),
            asamUrat: data.asamUrat,
            gulaPuasa: data.gulaPuasa,
            gulaSewaktu: data.gulaSewaktu,
            gula2Jpp: data.gula2Jpp,
            kolesterol: data.kolesterol,
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
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
