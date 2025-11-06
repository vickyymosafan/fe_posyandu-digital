'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { petugasAPI } from '@/lib/api';
import { useNotification } from '@/components/ui';
import { handleAPIError } from '@/lib/utils/errors';
import { petugasFormSchema } from '@/lib/utils/validators';
import { z } from 'zod';

/**
 * Interface untuk form data petugas
 */
interface PetugasFormData {
  nama: string;
  email: string;
  kataSandi: string;
}

/**
 * Interface untuk form errors
 */
interface PetugasFormErrors {
  nama?: string;
  email?: string;
  kataSandi?: string;
}

/**
 * Interface untuk return value hook
 */
interface UsePetugasFormReturn {
  formData: PetugasFormData;
  errors: PetugasFormErrors;
  isSubmitting: boolean;
  showPassword: boolean;
  handleChange: (field: keyof PetugasFormData, value: string) => void;
  togglePasswordVisibility: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Custom hook untuk mengelola form tambah petugas
 * 
 * Responsibilities:
 * - Form state management
 * - Form validation dengan Zod
 * - Submit handler dengan API call
 * - Error handling
 * - Success notification dan redirect
 * 
 * Design Principles:
 * - SRP: Single responsibility untuk petugas form logic
 * - DIP: Depends on petugasAPI abstraction
 * - SoC: Separates form logic from UI
 * 
 * @returns {UsePetugasFormReturn} Object dengan form state dan handlers
 */
export function usePetugasForm(): UsePetugasFormReturn {
  const router = useRouter();
  const { showNotification } = useNotification();

  // Form state
  const [formData, setFormData] = useState<PetugasFormData>({
    nama: '',
    email: '',
    kataSandi: '',
  });

  const [errors, setErrors] = useState<PetugasFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle perubahan field
   * Validate field saat user mengetik (realtime validation)
   */
  const handleChange = useCallback(
    (field: keyof PetugasFormData, value: string) => {
      // Update form data
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error untuk field ini
      setErrors((prev) => ({ ...prev, [field]: undefined }));

      // Validate field secara realtime
      try {
        const fieldSchema = petugasFormSchema.shape[field];
        fieldSchema.parse(value);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const firstError = error.issues[0];
          if (firstError) {
            setErrors((prev) => ({
              ...prev,
              [field]: firstError.message,
            }));
          }
        }
      }
    },
    []
  );

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  /**
   * Handle form submit
   * Validate semua field dan call API
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate semua field
      try {
        petugasFormSchema.parse(formData);
        setErrors({});
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: PetugasFormErrors = {};
          error.issues.forEach((issue) => {
            const field = issue.path[0] as keyof PetugasFormData;
            newErrors[field] = issue.message;
          });
          setErrors(newErrors);
          showNotification('error', 'Mohon perbaiki kesalahan pada form');
          return;
        }
      }

      // Submit ke API
      setIsSubmitting(true);
      try {
        const response = await petugasAPI.create(formData);

        if (response.data) {
          showNotification('success', 'Petugas berhasil ditambahkan');
          // Redirect ke daftar petugas
          router.push('/admin/petugas');
        } else {
          throw new Error(response.error || 'Gagal menambahkan petugas');
        }
      } catch (error) {
        const errorMessage = handleAPIError(error);
        showNotification('error', errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, router, showNotification]
  );

  return {
    formData,
    errors,
    isSubmitting,
    showPassword,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
  };
}
