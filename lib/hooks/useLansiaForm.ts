'use client';

/**
 * useLansiaForm Hook
 *
 * Custom hook untuk mengelola form pendaftaran lansia.
 * Mengikuti prinsip:
 * - SRP: Hanya handle form state dan validation
 * - DIP: Depend on abstractions (submission service)
 * - SoC: Memisahkan business logic dari UI
 */

import { useState, useCallback } from 'react';
import { generateIdPasien } from '@/lib/utils/generateIdPasien';
import { lansiaFormSchema } from '@/lib/utils/validators';
import { submitLansiaOnline, submitLansiaOffline } from '@/lib/services/lansiaSubmissionService';
import { useOffline } from './useOffline';
import { useNotification } from '@/components/ui/Notification';
import { NOTIFICATION_DURATION_MS } from '@/lib/constants';
import type { Gender } from '@/types';

// ============================================
// Types
// ============================================

interface LansiaFormData {
  nik: string;
  kk: string;
  nama: string;
  tanggalLahir: string;
  gender: Gender | '';
  alamat: string;
}

interface LansiaFormErrors {
  nik?: string;
  kk?: string;
  nama?: string;
  tanggalLahir?: string;
  gender?: string;
  alamat?: string;
}

interface UseLansiaFormReturn {
  formData: LansiaFormData;
  errors: LansiaFormErrors;
  isSubmitting: boolean;
  generatedKode: string | null;
  handleChange: (field: keyof LansiaFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

// ============================================
// Initial State
// ============================================

const initialFormData: LansiaFormData = {
  nik: '',
  kk: '',
  nama: '',
  tanggalLahir: '',
  gender: '',
  alamat: '',
};

// ============================================
// Hook
// ============================================

/**
 * Hook untuk mengelola form pendaftaran lansia
 *
 * Flow:
 * 1. Validate form dengan Zod schema
 * 2. Generate unique ID dengan generateIdPasien
 * 3. Verify uniqueness di IndexedDB
 * 4. If online: submit ke API → save ke IndexedDB dengan syncedAt
 * 5. If offline: save ke IndexedDB → add ke syncQueue
 * 6. Return generated kode untuk ditampilkan
 *
 * @returns Form state dan handlers
 */
export function useLansiaForm(): UseLansiaFormReturn {
  const [formData, setFormData] = useState<LansiaFormData>(initialFormData);
  const [errors, setErrors] = useState<LansiaFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedKode, setGeneratedKode] = useState<string | null>(null);

  const { isOnline } = useOffline();
  const { showNotification } = useNotification();

  /**
   * Handle perubahan field dengan realtime validation
   */
  const handleChange = useCallback(
    (field: keyof LansiaFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Realtime validation untuk field yang diubah
      try {
        const fieldSchema = lansiaFormSchema.shape[field];
        if (fieldSchema) {
          fieldSchema.parse(value);
          // Clear error jika valid
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }
      } catch (error) {
        // Set error jika tidak valid
        if (error && typeof error === 'object' && 'errors' in error) {
          const zodError = error as { errors: Array<{ message: string }> };
          if (zodError.errors && zodError.errors[0]) {
            setErrors((prev) => ({
              ...prev,
              [field]: zodError.errors[0].message,
            }));
          }
        }
      }
    },
    []
  );

  /**
   * Validate seluruh form
   */
  const validateForm = useCallback((): boolean => {
    try {
      lansiaFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors: LansiaFormErrors = {};
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as {
          errors: Array<{ path: Array<string | number>; message: string }>;
        };
        if (zodError.errors) {
          zodError.errors.forEach((err) => {
            const field = err.path[0] as keyof LansiaFormErrors;
            newErrors[field] = err.message;
          });
        }
      }
      setErrors(newErrors);
      return false;
    }
  }, [formData]);

  /**
   * Handle form submission
   * Delegates to appropriate submission service based on online status
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate form
      if (!validateForm()) {
        showNotification('error', 'Mohon perbaiki kesalahan pada form');
        return;
      }

      setIsSubmitting(true);

      try {
        // Prepare submission data
        const submissionData = {
          nik: formData.nik,
          kk: formData.kk,
          nama: formData.nama,
          tanggalLahir: formData.tanggalLahir,
          gender: formData.gender as Gender,
          alamat: formData.alamat,
        };

        // Submit based on online status
        let result;
        if (isOnline) {
          result = await submitLansiaOnline(submissionData);
        } else {
          const kode = await generateIdPasien();
          result = await submitLansiaOffline(submissionData, kode);
        }

        // Handle result
        if (result.success) {
          setGeneratedKode(result.kode || null);
          const message = isOnline
            ? 'Lansia berhasil didaftarkan'
            : 'Lansia berhasil didaftarkan (offline). Data akan disinkronkan saat online.';
          showNotification('success', message, NOTIFICATION_DURATION_MS);
        } else {
          showNotification('error', result.error || 'Gagal mendaftarkan lansia', NOTIFICATION_DURATION_MS);
        }
      } catch (error) {
        console.error('[useLansiaForm] Submission error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Gagal mendaftarkan lansia';
        showNotification('error', errorMessage, NOTIFICATION_DURATION_MS);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, isOnline, showNotification]
  );

  /**
   * Reset form ke initial state
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setGeneratedKode(null);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    generatedKode,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
